# Workshop App Implementation Plan
## Secure Browser-Based Data Generation with Firebase

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 User's Browser                          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │          React App (Firebase Hosting)             │ │
│  │                                                   │ │
│  │  - Documentation pages                           │ │
│  │  - Generator control buttons                     │ │
│  │  - Challenge list                                │ │
│  │  - Live metrics display                          │ │
│  │                                                   │ │
│  │  [No Kafka credentials in browser!]              │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS Calls
                         │ (Firebase SDK)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Firebase Functions (Node.js)               │
│              [API Keys stored securely here]            │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ startStream  │  │ stopStream   │  │ getMetrics   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  Contains:                                              │
│  - Kafka credentials (environment variables)            │
│  - Event generation logic                               │
│  - Kafka producer code                                  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Kafka Protocol
                         │ (SASL_SSL)
                         ▼
┌─────────────────────────────────────────────────────────┐
│             Confluent Cloud Kafka Cluster               │
│                                                         │
│  Topics:                                                │
│  - ecommerce-events                                     │
│  - iot-sensor-data                                      │
│  - social-media-feed                                    │
│  - financial-transactions                               │
└─────────────────────────────────────────────────────────┐
                         │
                         │ Students connect here
                         ▼
┌──────────────────┬──────────────────────────────────────┐
│  Student's       │  Student's Databricks                │
│  VS Code         │  Notebook                            │
│  (Python)        │  (PySpark)                           │
└──────────────────┴──────────────────────────────────────┘
```

---

## Security Model

### ✅ **What Students Get:**
- **Read-only consumer credentials** (separate API keys)
- Bootstrap server URL
- Topic names
- Consumer group guidelines

### 🔒 **What Stays Hidden:**
- **Producer API keys** (only in Firebase Functions)
- Write permissions
- Cluster admin access

### 🎯 **Result:**
- Students can consume data but cannot write/delete/modify topics
- Generator code runs securely on Firebase Functions
- No credentials exposed in browser

---

## Implementation Phases

### Phase 1: Confluent Cloud Setup (Day 1)
**Goal:** Set up Kafka infrastructure with proper security

#### 1.1 Create API Keys (Two Sets)

**Producer Keys (For Firebase Functions - Keep Secret):**
```bash
1. In Confluent Cloud console → API Keys
2. Click "Create Key"
3. Select "Global Access"
4. Name: "workshop-producer-keys"
5. Download and save:
   - API Key: XXXXXXXX
   - API Secret: XXXXXXXX
6. ⚠️ NEVER commit these to git
```

**Consumer Keys (For Students - Read-Only):**
```bash
1. Create another API key
2. Name: "workshop-student-consumer"
3. Use ACLs to restrict to READ only (if available in your tier)
4. These can be shared with students
5. Store in Firestore for easy distribution
```

#### 1.2 Create Topics
```bash
Topics to create in Confluent Cloud UI:

1. ecommerce-events
   - Partitions: 3
   - Retention: 7 days

2. iot-sensor-data
   - Partitions: 3
   - Retention: 7 days

3. social-media-feed
   - Partitions: 3
   - Retention: 7 days

4. financial-transactions
   - Partitions: 3
   - Retention: 7 days
```

#### 1.3 Get Connection Details
```bash
From Confluent Cloud → Cluster Settings:

Bootstrap servers:
  pkc-xxxxx.us-east-1.aws.confluent.cloud:9092

Save this for later configuration
```

---

### Phase 2: Firebase Project Setup (Day 1)

#### 2.1 Initialize Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Create new project directory
mkdir kafka-workshop-app
cd kafka-workshop-app

# Initialize Firebase
firebase init

# Select:
# ☑ Firestore
# ☑ Functions
# ☑ Hosting

# Choose:
# - Create new project or use existing
# - JavaScript or TypeScript for Functions (recommend TypeScript)
# - Install dependencies: Yes
```

#### 2.2 Project Structure
```
kafka-workshop-app/
├── public/               # Static assets
├── src/                  # React app source
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── Docs/
│   │   │   ├── KafkaIntro.tsx
│   │   │   ├── DatabricksIntro.tsx
│   │   │   ├── ConnectionGuide.tsx
│   │   │   └── ConceptsDiagram.tsx
│   │   ├── Control/
│   │   │   ├── GeneratorControls.tsx
│   │   │   ├── GeneratorCard.tsx
│   │   │   ├── MetricsDisplay.tsx
│   │   │   └── StreamPreview.tsx
│   │   ├── Challenges/
│   │   │   ├── ChallengeList.tsx
│   │   │   ├── ChallengeCard.tsx
│   │   │   └── CodeSnippet.tsx
│   │   └── Common/
│   │       ├── CopyButton.tsx
│   │       ├── StatusBadge.tsx
│   │       └── LoadingSpinner.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Documentation.tsx
│   │   ├── Control.tsx
│   │   ├── Challenges.tsx
│   │   └── Resources.tsx
│   ├── services/
│   │   ├── firebase.ts
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── functions/            # Firebase Functions
│   ├── src/
│   │   ├── index.ts           # Main exports
│   │   ├── generators/
│   │   │   ├── base.ts        # Base generator class
│   │   │   ├── ecommerce.ts   # E-commerce event generator
│   │   │   ├── iot.ts         # IoT sensor generator
│   │   │   ├── social.ts      # Social media generator
│   │   │   └── financial.ts   # Financial transaction generator
│   │   ├── kafka/
│   │   │   ├── client.ts      # Kafka client setup
│   │   │   └── producer.ts    # Producer wrapper
│   │   └── utils/
│   │       └── helpers.ts
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md
```

#### 2.3 Install Dependencies

**React App:**
```bash
npm install react-router-dom @mui/material @emotion/react @emotion/styled
npm install firebase
npm install react-query
npm install recharts
npm install prismjs react-syntax-highlighter
npm install @types/prismjs @types/react-syntax-highlighter -D
```

**Firebase Functions:**
```bash
cd functions
npm install kafkajs
npm install node-cron      # For scheduled cleanup tasks
npm install @types/node-cron -D
```

---

### Phase 3: Firebase Functions Implementation (Day 2-3)

#### 3.1 Configure Environment Variables

```bash
# Set Firebase Functions config (secure storage)
firebase functions:config:set \
  kafka.bootstrap_servers="pkc-xxxxx.confluent.cloud:9092" \
  kafka.producer_key="YOUR_PRODUCER_API_KEY" \
  kafka.producer_secret="YOUR_PRODUCER_API_SECRET" \
  kafka.consumer_key="YOUR_CONSUMER_API_KEY" \
  kafka.consumer_secret="YOUR_CONSUMER_API_SECRET"

# For local development, create .runtimeconfig.json in functions/
# (This file is automatically generated when you run firebase functions:config:get)
```

#### 3.2 Kafka Client Setup

**File: `functions/src/kafka/client.ts`**
```typescript
import { Kafka, Producer } from 'kafkajs';
import * as functions from 'firebase-functions';

const config = functions.config();

export const kafka = new Kafka({
  clientId: 'workshop-producer',
  brokers: [config.kafka.bootstrap_servers],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: config.kafka.producer_key,
    password: config.kafka.producer_secret,
  },
  connectionTimeout: 10000,
  retry: {
    retries: 5,
    initialRetryTime: 300,
  },
});

let producerInstance: Producer | null = null;

export async function getProducer(): Promise<Producer> {
  if (!producerInstance) {
    producerInstance = kafka.producer();
    await producerInstance.connect();
    console.log('✓ Kafka producer connected');
  }
  return producerInstance;
}

export async function disconnectProducer(): Promise<void> {
  if (producerInstance) {
    await producerInstance.disconnect();
    producerInstance = null;
    console.log('✓ Kafka producer disconnected');
  }
}
```

#### 3.3 Generator Base Class

**File: `functions/src/generators/base.ts`**
```typescript
import { Producer } from 'kafkajs';

export abstract class BaseGenerator {
  protected producer: Producer;
  protected topic: string;
  protected intervalId: NodeJS.Timeout | null = null;
  protected messageCount: number = 0;
  protected isRunning: boolean = false;

  constructor(producer: Producer, topic: string) {
    this.producer = producer;
    this.topic = topic;
  }

  abstract generateEvent(): any;

  async sendEvent(event: any): Promise<boolean> {
    try {
      await this.producer.send({
        topic: this.topic,
        messages: [
          {
            value: JSON.stringify(event),
            timestamp: Date.now().toString(),
          },
        ],
      });
      this.messageCount++;
      return true;
    } catch (error) {
      console.error(`Error sending event to ${this.topic}:`, error);
      return false;
    }
  }

  start(messagesPerSecond: number): void {
    if (this.isRunning) {
      console.log(`Generator for ${this.topic} already running`);
      return;
    }

    this.isRunning = true;
    const delay = 1000 / messagesPerSecond;

    console.log(`Starting generator for ${this.topic}: ${messagesPerSecond} msg/sec`);

    this.intervalId = setInterval(async () => {
      const event = this.generateEvent();
      await this.sendEvent(event);

      if (this.messageCount % 100 === 0) {
        console.log(`${this.topic}: Sent ${this.messageCount} messages`);
      }
    }, delay);
  }

  stop(): number {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    const count = this.messageCount;
    console.log(`${this.topic} generator stopped. Total: ${count} messages`);
    return count;
  }

  getStatus() {
    return {
      topic: this.topic,
      isRunning: this.isRunning,
      messageCount: this.messageCount,
    };
  }
}
```

#### 3.4 Specific Generators

**File: `functions/src/generators/ecommerce.ts`**
```typescript
import { BaseGenerator } from './base';

export class EcommerceGenerator extends BaseGenerator {
  private eventTypes = ['view', 'cart_add', 'cart_remove', 'purchase'];
  private products = Array.from({ length: 500 }, (_, i) => `prod_${i + 1}`);
  private users = Array.from({ length: 1000 }, (_, i) => `user_${i + 1}`);

  generateEvent() {
    const eventType = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];

    return {
      user_id: this.users[Math.floor(Math.random() * this.users.length)],
      event_type: eventType,
      product_id: this.products[Math.floor(Math.random() * this.products.length)],
      price: Math.round((Math.random() * 490 + 10) * 100) / 100,
      timestamp: Date.now(),
      session_id: `session_${Math.floor(Math.random() * 5000)}`,
    };
  }
}
```

**File: `functions/src/generators/iot.ts`**
```typescript
import { BaseGenerator } from './base';

export class IoTGenerator extends BaseGenerator {
  private devices = Array.from({ length: 50 }, (_, i) => `device_${i + 1}`);
  private sensorTypes = ['temperature', 'humidity', 'pressure'];
  private locations = ['warehouse_a', 'warehouse_b', 'factory_1', 'office'];

  generateEvent() {
    const sensorType = this.sensorTypes[Math.floor(Math.random() * this.sensorTypes.length)];
    let value: number, unit: string;

    switch (sensorType) {
      case 'temperature':
        value = Math.round((Math.random() * 50 + 10) * 10) / 10;
        unit = 'celsius';
        break;
      case 'humidity':
        value = Math.round(Math.random() * 100);
        unit = 'percent';
        break;
      case 'pressure':
        value = Math.round((Math.random() * 200 + 900) * 10) / 10;
        unit = 'hPa';
        break;
      default:
        value = 0;
        unit = '';
    }

    return {
      device_id: this.devices[Math.floor(Math.random() * this.devices.length)],
      sensor_type: sensorType,
      value: value,
      unit: unit,
      location: this.locations[Math.floor(Math.random() * this.locations.length)],
      timestamp: Date.now(),
    };
  }
}
```

**File: `functions/src/generators/social.ts`**
```typescript
import { BaseGenerator } from './base';

export class SocialGenerator extends BaseGenerator {
  private users = Array.from({ length: 1000 }, (_, i) => `user_${i + 1}`);
  private actionTypes = ['post', 'like', 'share', 'comment'];
  private posts = Array.from({ length: 10000 }, (_, i) => `post_${i + 1}`);
  private sampleContent = [
    'Check out this amazing product!',
    'Just had the best day ever',
    'Thoughts on the new update?',
    'Can\'t believe this happened',
    'Looking forward to the weekend',
  ];

  generateEvent() {
    return {
      post_id: this.posts[Math.floor(Math.random() * this.posts.length)],
      user_id: this.users[Math.floor(Math.random() * this.users.length)],
      action_type: this.actionTypes[Math.floor(Math.random() * this.actionTypes.length)],
      content_preview: this.sampleContent[Math.floor(Math.random() * this.sampleContent.length)],
      timestamp: Date.now(),
      engagement_score: Math.floor(Math.random() * 100),
    };
  }
}
```

**File: `functions/src/generators/financial.ts`**
```typescript
import { BaseGenerator } from './base';

export class FinancialGenerator extends BaseGenerator {
  private merchantCategories = ['retail', 'grocery', 'electronics', 'dining', 'travel'];
  private currencies = ['USD', 'EUR', 'GBP', 'CAD'];
  private countries = ['US', 'UK', 'CA', 'DE', 'FR', 'ES', 'IT'];

  generateEvent() {
    const amount = Math.round(Math.random() * 1000 * 100) / 100;
    const riskScore = Math.random();

    // Higher amounts have slightly higher risk scores
    const adjustedRiskScore = amount > 500 ? riskScore * 1.2 : riskScore;

    return {
      transaction_id: `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      amount: amount,
      currency: this.currencies[Math.floor(Math.random() * this.currencies.length)],
      merchant_category: this.merchantCategories[Math.floor(Math.random() * this.merchantCategories.length)],
      risk_score: Math.min(Math.round(adjustedRiskScore * 100) / 100, 1.0),
      timestamp: Date.now(),
      country: this.countries[Math.floor(Math.random() * this.countries.length)],
    };
  }
}
```

#### 3.5 Main Functions (API Endpoints)

**File: `functions/src/index.ts`**
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getProducer } from './kafka/client';
import { EcommerceGenerator } from './generators/ecommerce';
import { IoTGenerator } from './generators/iot';
import { SocialGenerator } from './generators/social';
import { FinancialGenerator } from './generators/financial';
import { BaseGenerator } from './generators/base';

admin.initializeApp();

// Store active generators in memory
const activeGenerators: Map<string, BaseGenerator> = new Map();

// Topic mapping
const TOPIC_MAP = {
  ecommerce: 'ecommerce-events',
  iot: 'iot-sensor-data',
  social: 'social-media-feed',
  financial: 'financial-transactions',
};

type GeneratorType = keyof typeof TOPIC_MAP;

/**
 * Start a data generator
 * Call from React: startGenerator({ generatorType: 'ecommerce', messagesPerSec: 10 })
 */
export const startGenerator = functions.https.onCall(async (data, context) => {
  const { generatorType, messagesPerSec = 10 } = data as {
    generatorType: GeneratorType;
    messagesPerSec?: number;
  };

  // Validate input
  if (!TOPIC_MAP[generatorType]) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Invalid generator type: ${generatorType}`
    );
  }

  // Check if already running
  if (activeGenerators.has(generatorType)) {
    throw new functions.https.HttpsError(
      'already-exists',
      `Generator ${generatorType} is already running`
    );
  }

  try {
    const producer = await getProducer();
    const topic = TOPIC_MAP[generatorType];

    // Create appropriate generator
    let generator: BaseGenerator;
    switch (generatorType) {
      case 'ecommerce':
        generator = new EcommerceGenerator(producer, topic);
        break;
      case 'iot':
        generator = new IoTGenerator(producer, topic);
        break;
      case 'social':
        generator = new SocialGenerator(producer, topic);
        break;
      case 'financial':
        generator = new FinancialGenerator(producer, topic);
        break;
    }

    // Start generating
    generator.start(messagesPerSec);
    activeGenerators.set(generatorType, generator);

    // Update Firestore status
    await admin.firestore().collection('generators').doc(generatorType).set({
      status: 'running',
      topic: topic,
      messagesPerSec: messagesPerSec,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      messageCount: 0,
    });

    console.log(`✓ Started ${generatorType} generator`);

    return {
      success: true,
      generatorType,
      topic,
      messagesPerSec,
    };
  } catch (error: any) {
    console.error(`Failed to start ${generatorType} generator:`, error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Stop a data generator
 * Call from React: stopGenerator({ generatorType: 'ecommerce' })
 */
export const stopGenerator = functions.https.onCall(async (data, context) => {
  const { generatorType } = data as { generatorType: GeneratorType };

  // Validate input
  if (!TOPIC_MAP[generatorType]) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Invalid generator type: ${generatorType}`
    );
  }

  // Check if running
  const generator = activeGenerators.get(generatorType);
  if (!generator) {
    throw new functions.https.HttpsError(
      'not-found',
      `Generator ${generatorType} is not running`
    );
  }

  try {
    const finalCount = generator.stop();
    activeGenerators.delete(generatorType);

    // Update Firestore status
    await admin.firestore().collection('generators').doc(generatorType).set({
      status: 'stopped',
      stoppedAt: admin.firestore.FieldValue.serverTimestamp(),
      finalMessageCount: finalCount,
    }, { merge: true });

    console.log(`✓ Stopped ${generatorType} generator`);

    return {
      success: true,
      generatorType,
      messageCount: finalCount,
    };
  } catch (error: any) {
    console.error(`Failed to stop ${generatorType} generator:`, error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Get status of all generators
 * Call from React: getGeneratorStatus()
 */
export const getGeneratorStatus = functions.https.onCall(async (data, context) => {
  try {
    const snapshot = await admin.firestore().collection('generators').get();
    const statuses: Record<string, any> = {};

    snapshot.forEach((doc) => {
      const generator = activeGenerators.get(doc.id as GeneratorType);
      statuses[doc.id] = {
        ...doc.data(),
        currentMessageCount: generator ? generator.getStatus().messageCount : null,
      };
    });

    return { generators: statuses };
  } catch (error: any) {
    console.error('Failed to get generator status:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Get connection details for students (consumer keys only)
 * Call from React: getConnectionDetails()
 */
export const getConnectionDetails = functions.https.onCall(async (data, context) => {
  const config = functions.config();

  return {
    bootstrapServers: config.kafka.bootstrap_servers,
    apiKey: config.kafka.consumer_key,
    apiSecret: config.kafka.consumer_secret,
    topics: Object.values(TOPIC_MAP),
    instructions: {
      python: 'Use kafka-python library',
      databricks: 'Use Spark Structured Streaming',
    },
  };
});

/**
 * Scheduled function to update message counts in Firestore
 * Runs every minute
 */
export const updateMetrics = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const batch = admin.firestore().batch();

    activeGenerators.forEach((generator, type) => {
      const status = generator.getStatus();
      const docRef = admin.firestore().collection('generators').doc(type);
      batch.update(docRef, {
        messageCount: status.messageCount,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log('✓ Updated generator metrics');
  });
```

---

### Phase 4: React Frontend Implementation (Day 4-5)

#### 4.1 Firebase Configuration

**File: `src/services/firebase.ts`**
```typescript
import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app);
export const db = getFirestore(app);

// Use emulators in development
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

#### 4.2 API Service

**File: `src/services/api.ts`**
```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export type GeneratorType = 'ecommerce' | 'iot' | 'social' | 'financial';

interface StartGeneratorParams {
  generatorType: GeneratorType;
  messagesPerSec?: number;
}

interface GeneratorResponse {
  success: boolean;
  generatorType: string;
  topic?: string;
  messagesPerSec?: number;
  messageCount?: number;
}

interface GeneratorStatus {
  generators: Record<string, any>;
}

interface ConnectionDetails {
  bootstrapServers: string;
  apiKey: string;
  apiSecret: string;
  topics: string[];
  instructions: {
    python: string;
    databricks: string;
  };
}

// Callable functions
const startGeneratorFn = httpsCallable<StartGeneratorParams, GeneratorResponse>(
  functions,
  'startGenerator'
);

const stopGeneratorFn = httpsCallable<{ generatorType: GeneratorType }, GeneratorResponse>(
  functions,
  'stopGenerator'
);

const getGeneratorStatusFn = httpsCallable<void, GeneratorStatus>(
  functions,
  'getGeneratorStatus'
);

const getConnectionDetailsFn = httpsCallable<void, ConnectionDetails>(
  functions,
  'getConnectionDetails'
);

export const api = {
  startGenerator: async (generatorType: GeneratorType, messagesPerSec: number = 10) => {
    const result = await startGeneratorFn({ generatorType, messagesPerSec });
    return result.data;
  },

  stopGenerator: async (generatorType: GeneratorType) => {
    const result = await stopGeneratorFn({ generatorType });
    return result.data;
  },

  getGeneratorStatus: async () => {
    const result = await getGeneratorStatusFn();
    return result.data;
  },

  getConnectionDetails: async () => {
    const result = await getConnectionDetailsFn();
    return result.data;
  },
};
```

#### 4.3 Generator Controls Component

**File: `src/components/Control/GeneratorControls.tsx`**
```typescript
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Slider,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { api, GeneratorType } from '../../services/api';

interface Generator {
  id: GeneratorType;
  name: string;
  icon: string;
  description: string;
  topic: string;
}

const generators: Generator[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce Events',
    icon: '🛒',
    description: 'User browsing, cart actions, purchases',
    topic: 'ecommerce-events',
  },
  {
    id: 'iot',
    name: 'IoT Sensors',
    icon: '🌡️',
    description: 'Temperature, humidity, device health',
    topic: 'iot-sensor-data',
  },
  {
    id: 'social',
    name: 'Social Media Feed',
    icon: '💬',
    description: 'Posts, likes, shares, comments',
    topic: 'social-media-feed',
  },
  {
    id: 'financial',
    name: 'Financial Transactions',
    icon: '💳',
    description: 'Payments with fraud indicators',
    topic: 'financial-transactions',
  },
];

export const GeneratorControls: React.FC = () => {
  const [activeGenerators, setActiveGenerators] = useState<Set<GeneratorType>>(new Set());
  const [loading, setLoading] = useState<Set<GeneratorType>>(new Set());
  const [messagesPerSec, setMessagesPerSec] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (genId: GeneratorType) => {
    setLoading((prev) => new Set(prev).add(genId));
    setError(null);

    try {
      await api.startGenerator(genId, messagesPerSec);
      setActiveGenerators((prev) => new Set(prev).add(genId));
    } catch (err: any) {
      setError(`Failed to start ${genId}: ${err.message}`);
    } finally {
      setLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(genId);
        return newSet;
      });
    }
  };

  const handleStop = async (genId: GeneratorType) => {
    setLoading((prev) => new Set(prev).add(genId));
    setError(null);

    try {
      await api.stopGenerator(genId);
      setActiveGenerators((prev) => {
        const newSet = new Set(prev);
        newSet.delete(genId);
        return newSet;
      });
    } catch (err: any) {
      setError(`Failed to stop ${genId}: ${err.message}`);
    } finally {
      setLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(genId);
        return newSet;
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Data Stream Generators
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Messages per Second: {messagesPerSec}</Typography>
        <Slider
          value={messagesPerSec}
          onChange={(_, value) => setMessagesPerSec(value as number)}
          min={1}
          max={50}
          marks={[
            { value: 1, label: '1' },
            { value: 10, label: '10' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
          ]}
          valueLabelDisplay="auto"
          disabled={activeGenerators.size > 0}
        />
        {activeGenerators.size > 0 && (
          <Typography variant="caption" color="text.secondary">
            Stop all generators to change rate
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 2,
        }}
      >
        {generators.map((gen) => (
          <Card key={gen.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" sx={{ mr: 1 }}>
                  {gen.icon}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{gen.name}</Typography>
                  <Chip
                    label={activeGenerators.has(gen.id) ? 'Running' : 'Stopped'}
                    color={activeGenerators.has(gen.id) ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {gen.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Topic: <code>{gen.topic}</code>
              </Typography>
            </CardContent>
            <CardActions>
              {!activeGenerators.has(gen.id) ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    loading.has(gen.id) ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }
                  onClick={() => handleStart(gen.id)}
                  disabled={loading.has(gen.id)}
                >
                  Start
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={
                    loading.has(gen.id) ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <StopIcon />
                    )
                  }
                  onClick={() => handleStop(gen.id)}
                  disabled={loading.has(gen.id)}
                >
                  Stop
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>🔒 Secure:</strong> Generators run on Firebase Functions. Kafka credentials
          never leave the server!
        </Typography>
      </Alert>
    </Box>
  );
};
```

---

### Phase 5: Firestore Rules (Day 5)

**File: `firestore.rules`**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read access to generator status
    match /generators/{generatorId} {
      allow read: if true;
      allow write: if false; // Only Firebase Functions can write
    }

    // Public read access to config and connection details
    match /config/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // Challenge progress tracking (if you add auth later)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### Phase 6: Deployment (Day 6)

#### 6.1 Environment Variables

**Create `.env` for React app:**
```bash
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

**⚠️ Add to `.gitignore`:**
```
.env
.env.local
functions/.runtimeconfig.json
```

#### 6.2 Build and Deploy

```bash
# Build React app
npm run build

# Deploy everything
firebase deploy

# Or deploy individually:
firebase deploy --only hosting    # Deploy React app
firebase deploy --only functions  # Deploy backend functions
firebase deploy --only firestore  # Deploy database rules
```

#### 6.3 Test Deployment

```bash
# Get your app URL
firebase hosting:channel:deploy preview

# Test the functions
firebase functions:log --only startGenerator
```

---

## Testing Plan

### Local Testing (Before Deploy)

```bash
# Terminal 1: Start Firebase emulators
firebase emulators:start

# Terminal 2: Start React dev server
npm start

# Test in browser at http://localhost:3000
```

### Production Testing

1. **Test generator start/stop**
2. **Verify data in Confluent Cloud UI**
3. **Test student consumer connection** (with consumer keys)
4. **Monitor function logs** for errors

---

## Student Distribution Package

### What Students Receive

**1. Connection Details Card (PDF/Web)**
```
Kafka Workshop - Connection Details
====================================

Bootstrap Servers:
  pkc-xxxxx.us-east-1.aws.confluent.cloud:9092

API Key (Consumer - Read Only):
  YOUR_CONSUMER_API_KEY

API Secret:
  YOUR_CONSUMER_API_SECRET

Available Topics:
  - ecommerce-events
  - iot-sensor-data
  - social-media-feed
  - financial-transactions

⚠️ These credentials are READ-ONLY. Do not share outside the workshop.
```

**2. Quick Start Guides**

Python example:
```python
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'ecommerce-events',
    bootstrap_servers='pkc-xxxxx.confluent.cloud:9092',
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='YOUR_CONSUMER_KEY',
    sasl_plain_password='YOUR_CONSUMER_SECRET',
    auto_offset_reset='latest',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    print(message.value)
```

Databricks example:
```python
df = (spark.readStream
  .format("kafka")
  .option("kafka.bootstrap.servers", "pkc-xxxxx.confluent.cloud:9092")
  .option("kafka.security.protocol", "SASL_SSL")
  .option("kafka.sasl.mechanism", "PLAIN")
  .option("kafka.sasl.jaas.config",
    'org.apache.kafka.common.security.plain.PlainLoginModule required username="KEY" password="SECRET";')
  .option("subscribe", "ecommerce-events")
  .load())
```

---

## Cost Breakdown

### Monthly Costs (During Active Workshop)

| Service | Cost | Notes |
|---------|------|-------|
| Confluent Cloud (Basic) | $0.11/hour × 24 × 30 = ~$80 | Can pause when not in use |
| Firebase Hosting | Free | Under free tier limits |
| Firebase Functions | ~$5-10 | Light usage, mostly free tier |
| Firestore | Free | Minimal reads/writes |
| **Total** | **~$85-90/month** | **Only when cluster is running** |

### Cost Optimization

- **Stop cluster** when not teaching workshop
- **Use Basic tier** (not Standard/Dedicated)
- **Set retention** to 1 day instead of 7 during development

---

## Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| 1. Confluent Setup | 1 day | Cluster, topics, API keys |
| 2. Firebase Setup | 1 day | Project initialized, structure created |
| 3. Functions Implementation | 2 days | All generators working, API endpoints |
| 4. React Frontend | 2 days | Control panel, docs pages, challenges |
| 5. Security & Rules | 0.5 day | Firestore rules, env vars configured |
| 6. Deployment & Testing | 0.5 day | Everything deployed and tested |
| **Total** | **7 days** | **Fully functional workshop app** |

---

## Next Steps

1. ✅ **Complete Confluent Cloud setup**
   - Create topics
   - Generate both API key sets (producer + consumer)

2. **Initialize Firebase project**
   - Create project in console
   - Run `firebase init`

3. **Implement Firebase Functions**
   - Start with kafka client and base generator
   - Test one generator locally

4. **Build React control panel**
   - Start with simple start/stop buttons
   - Add documentation pages

5. **Deploy and test end-to-end**

---

## Questions to Answer Before Starting

1. **Workshop date?** (Determines timeline urgency)
2. **Number of students?** (May affect Kafka partitioning strategy)
3. **Do students need accounts?** (Firebase Auth or anonymous access)
4. **Track student progress?** (Firestore + auth for completed challenges)
5. **Budget approval?** (~$90/month for Confluent Cloud)

---

This plan ensures **zero credential exposure in the browser** while maintaining a **simple, impressive UI** for students. All sensitive operations happen server-side in Firebase Functions.

Ready to start implementation? Which phase would you like to begin with?
