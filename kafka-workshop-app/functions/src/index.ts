import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Kafka, Producer } from 'kafkajs';

admin.initializeApp();

// Kafka configuration (credentials stored securely in Firebase config)
const kafka = new Kafka({
  clientId: 'kafka-workshop-generators',
  brokers: ['pkc-619z3.us-east1.gcp.confluent.cloud:9092'],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: functions.config().kafka?.api_key || process.env.KAFKA_API_KEY || '',
    password: functions.config().kafka?.api_secret || process.env.KAFKA_API_SECRET || '',
  },
});

let producer: Producer | null = null;

async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
}

// Generator state stored in Firestore
interface GeneratorState {
  isRunning: boolean;
  type: 'ecommerce' | 'iot' | 'social' | 'financial';
  startedAt?: admin.firestore.Timestamp;
  messagesProduced: number;
}

// E-commerce data generator
function generateEcommerceData() {
  const products = ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Mouse', 'Keyboard'];
  const actions = ['view', 'add_to_cart', 'purchase', 'remove_from_cart'];

  return {
    event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    user_id: `user_${Math.floor(Math.random() * 10000)}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    product: {
      id: `prod_${Math.floor(Math.random() * 1000)}`,
      name: products[Math.floor(Math.random() * products.length)],
      price: Math.floor(Math.random() * 1000) + 50,
      category: 'Electronics',
    },
    session_id: `session_${Math.random().toString(36).substr(2, 9)}`,
  };
}

// IoT sensor data generator
function generateIoTData() {
  return {
    sensor_id: `sensor_${Math.floor(Math.random() * 100)}`,
    timestamp: new Date().toISOString(),
    temperature: (Math.random() * 30 + 10).toFixed(2),
    humidity: (Math.random() * 60 + 20).toFixed(2),
    pressure: (Math.random() * 50 + 980).toFixed(2),
    location: {
      lat: (Math.random() * 180 - 90).toFixed(6),
      lon: (Math.random() * 360 - 180).toFixed(6),
    },
    battery_level: Math.floor(Math.random() * 100),
  };
}

// Social media data generator
function generateSocialData() {
  const actions = ['post', 'like', 'comment', 'share', 'follow'];
  const topics = ['#tech', '#food', '#travel', '#sports', '#music'];

  return {
    event_id: `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    user_id: `user_${Math.floor(Math.random() * 50000)}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    content_id: `content_${Math.floor(Math.random() * 100000)}`,
    topic: topics[Math.floor(Math.random() * topics.length)],
    engagement_score: Math.floor(Math.random() * 1000),
  };
}

// Financial transaction data generator
function generateFinancialData() {
  const types = ['purchase', 'transfer', 'withdrawal', 'deposit'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY'];

  return {
    transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    account_id: `acc_${Math.floor(Math.random() * 10000)}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: (Math.random() * 10000).toFixed(2),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    merchant: `merchant_${Math.floor(Math.random() * 1000)}`,
    is_flagged: Math.random() > 0.95, // 5% flagged for fraud
  };
}

// Start generator HTTP function
export const startGenerator = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { type } = data;
  if (!['ecommerce', 'iot', 'social', 'financial'].includes(type)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid generator type');
  }

  const generatorRef = admin.firestore().collection('generators').doc(type);

  // Check if generator is already running
  const doc = await generatorRef.get();
  if (doc.exists && doc.data()?.isRunning) {
    throw new functions.https.HttpsError('already-exists', 'Generator is already running');
  }

  // Update generator state
  await generatorRef.set({
    isRunning: true,
    type,
    startedAt: admin.firestore.Timestamp.now(),
    messagesProduced: 0,
    userId: context.auth.uid,
  });

  return { success: true, message: `${type} generator started` };
});

// Stop generator HTTP function
export const stopGenerator = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { type } = data;
  const generatorRef = admin.firestore().collection('generators').doc(type);

  await generatorRef.update({
    isRunning: false,
  });

  return { success: true, message: `${type} generator stopped` };
});

// Background function that produces messages every minute (minimum allowed)
export const producerTask = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  const db = admin.firestore();
  const generatorsSnapshot = await db.collection('generators').where('isRunning', '==', true).get();

  console.log(`Found ${generatorsSnapshot.size} running generators`);

  if (generatorsSnapshot.empty) {
    console.log('No running generators found');
    return null;
  }

  const prod = await getProducer();
  console.log('Kafka producer connected');

  const promises = generatorsSnapshot.docs.map(async (doc) => {
    const state = doc.data() as GeneratorState;
    let data;
    let topic;

    switch (state.type) {
      case 'ecommerce':
        data = generateEcommerceData();
        topic = 'ecommerce-events';
        break;
      case 'iot':
        data = generateIoTData();
        topic = 'iot-sensors';
        break;
      case 'social':
        data = generateSocialData();
        topic = 'social-media';
        break;
      case 'financial':
        data = generateFinancialData();
        topic = 'financial-transactions';
        break;
      default:
        console.log(`Unknown generator type: ${state.type}`);
        return;
    }

    try {
      console.log(`Sending message to ${topic}...`);
      await prod.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
      });
      console.log(`✓ Message sent to ${topic} successfully`);

      // Update message count
      await doc.ref.update({
        messagesProduced: admin.firestore.FieldValue.increment(1),
      });
      console.log(`✓ Updated message count for ${state.type}`);
    } catch (error) {
      console.error(`✗ Error producing to ${topic}:`, error);
    }
  });

  await Promise.all(promises);
  console.log('All messages processed');
  return null;
});

// Get generator status
export const getGeneratorStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const snapshot = await admin.firestore().collection('generators').get();
  const status: Record<string, any> = {};

  snapshot.docs.forEach((doc) => {
    status[doc.id] = doc.data();
  });

  return status;
});
