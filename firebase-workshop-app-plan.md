# Firebase Workshop App - Architecture & Implementation Plan

## Overview
A single-page React application hosted on Firebase that serves as both:
1. **Interactive Documentation**: Tutorial content about Kafka, Databricks, and streaming concepts
2. **Control Panel**: Interface to manage Kafka data generators and monitor streams

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Hosting                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │           React Single Page Application               │ │
│  │                                                       │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Docs      │  │   Control    │  │  Challenges │ │ │
│  │  │   Pages     │  │   Panel      │  │   List      │ │ │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          ├─────────────────────┐
                          ▼                     ▼
          ┌───────────────────────┐   ┌─────────────────────┐
          │  Firebase Functions   │   │  Firestore DB       │
          │  (Backend API)        │   │  (State/Config)     │
          │                       │   │                     │
          │  - Start/Stop Gen     │   │  - Generator status │
          │  - Get Metrics        │   │  - Kafka config     │
          │  - Health Checks      │   │  - User progress    │
          └───────────────────────┘   └─────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────────┐
          │   Cloud Run / Cloud Functions     │
          │   (Long-running containers)       │
          │                                   │
          │  ┌────────────┐  ┌─────────────┐ │
          │  │ Kafka      │  │ Data        │ │
          │  │ Cluster    │  │ Generators  │ │
          │  │            │  │ (4 types)   │ │
          │  └────────────┘  └─────────────┘ │
          └───────────────────────────────────┘
```

---

## Component Breakdown

### 1. React Frontend (Firebase Hosting)

#### Pages/Sections:

**A. Documentation Section**
- **Home**: Welcome, workshop overview, learning objectives
- **What is Kafka?**:
  - Concepts (producers, consumers, topics, partitions)
  - Use cases (IoT, e-commerce, logs)
  - Visual diagrams (animated)
  - When to use Kafka vs traditional DB
- **What is Databricks?**:
  - Spark Structured Streaming
  - Delta Lake benefits
  - Medallion architecture (bronze/silver/gold)
- **How to Connect**:
  - From Python (VS Code) with kafka-python
  - From PySpark (local)
  - From Databricks notebooks
  - Connection string examples
  - Troubleshooting guide

**B. Control Panel Section**
- **Live Kafka Status**:
  - Connection status indicator
  - Available topics list
  - Messages/sec per topic
  - Consumer group status
- **Data Generator Controls** (Admin only):
  - Start/Stop buttons for each scenario
  - Rate control (messages/sec)
  - Reset data option
- **Stream Previews**:
  - Live sample messages from each topic
  - Schema viewer
  - Copy sample data for testing

**C. Challenges Section**
- List of 9 challenges with difficulty badges
- Expandable cards showing:
  - Scenario description
  - Success criteria
  - Starter code (copy to clipboard)
  - AI prompt suggestions
  - Link to solution (instructor only)

**D. Resources Section**
- Connection credentials (copyable)
- Quick reference cards (downloadable)
- AI prompt cheat sheet
- External links (Kafka docs, Databricks docs)

---

### 2. Firebase Backend

#### Firebase Functions (API Endpoints):

```javascript
// Generator Management
exports.startGenerator = functions.https.onCall(async (data, context) => {
  // Start specific data generator
  // data: { generatorType: 'ecommerce' | 'iot' | 'social' | 'financial' }
  // Returns: { success: boolean, generatorId: string }
});

exports.stopGenerator = functions.https.onCall(async (data, context) => {
  // Stop specific generator
});

exports.getGeneratorStatus = functions.https.onCall(async (data, context) => {
  // Get status of all generators
  // Returns: { generators: [...], kafka: { topics: [...] } }
});

// Kafka Monitoring
exports.getKafkaMetrics = functions.https.onCall(async (data, context) => {
  // Fetch metrics from Kafka cluster
  // Returns: { topics: [...], messagesPerSec: {...}, consumerLag: {...} }
});

exports.getTopicSample = functions.https.onCall(async (data, context) => {
  // Get sample messages from a topic
  // data: { topicName: string, limit: number }
  // Returns: { messages: [...] }
});

// Health Checks
exports.healthCheck = functions.https.onRequest(async (req, res) => {
  // Check Kafka connectivity and generator health
});
```

#### Firestore Collections:

```
/config
  - kafkaBootstrapServers: string
  - availableTopics: array
  - schemaDefinitions: object

/generators
  /ecommerce
    - status: 'running' | 'stopped'
    - startedAt: timestamp
    - messagesPerSec: number
    - totalMessages: number
  /iot
    - ...
  /social
    - ...
  /financial
    - ...

/metrics (time-series data)
  /{timestamp}
    - topicMetrics: object
    - consumerLags: object

/users (optional - for tracking progress)
  /{userId}
    - completedChallenges: array
    - lastActive: timestamp
```

---

### 3. Data Generators

#### Option A: Cloud Run Containers (Recommended)
- **Why**: Long-running processes, better control, scalable
- **Deploy**: 4 separate containers (one per data type)
- **Tech Stack**: Python + kafka-python
- **Control**: Start/stop via Firebase Functions calling Cloud Run API

```python
# Example structure: ecommerce_generator.py
from kafka import KafkaProducer
import json
import time
import random

class EcommerceGenerator:
    def __init__(self, bootstrap_servers, topic_name):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        self.topic = topic_name
        self.running = False

    def generate_event(self):
        event_types = ['view', 'cart_add', 'purchase']
        return {
            'user_id': f'user_{random.randint(1, 1000)}',
            'event_type': random.choice(event_types),
            'product_id': f'prod_{random.randint(1, 500)}',
            'price': round(random.uniform(10, 500), 2),
            'timestamp': int(time.time() * 1000),
            'session_id': f'session_{random.randint(1, 5000)}'
        }

    def start(self, messages_per_sec=10):
        self.running = True
        delay = 1.0 / messages_per_sec
        while self.running:
            event = self.generate_event()
            self.producer.send(self.topic, value=event)
            time.sleep(delay)

    def stop(self):
        self.running = False
        self.producer.close()
```

#### Option B: Firebase Functions (Scheduled)
- **Why**: Simpler, no separate infrastructure
- **Limitation**: 9-minute timeout (need to retrigger)
- **Use Case**: If you want fully serverless

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI) or Tailwind CSS
- **State Management**: React Context API + React Query (for API calls)
- **Charts**: Recharts or Chart.js (for metrics visualization)
- **Code Highlighting**: Prism.js or react-syntax-highlighter
- **Icons**: React Icons or MUI Icons

### Backend
- **Firebase Hosting**: Static site hosting
- **Firebase Functions**: Node.js serverless functions
- **Firestore**: Real-time database for state
- **Firebase Authentication** (optional): If tracking student progress

### Data Generation
- **Cloud Run**: Docker containers with Python generators
- **Language**: Python 3.11+
- **Kafka Client**: kafka-python or confluent-kafka-python

### Kafka Infrastructure
- **Option 1**: Confluent Cloud (easiest, managed)
- **Option 2**: Self-hosted on GCP Compute Engine
- **Option 3**: Aiven for Apache Kafka

---

## Implementation Steps

### Phase 1: Project Setup (Day 1)

#### 1.1 Initialize Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Select:
# - Hosting
# - Functions
# - Firestore
```

#### 1.2 Create React App
```bash
# Create React app with TypeScript
npx create-react-app workshop-app --template typescript
cd workshop-app

# Install dependencies
npm install react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install firebase
npm install react-query
npm install recharts
npm install prismjs
npm install react-icons
```

#### 1.3 Project Structure
```
workshop-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── Docs/
│   │   │   ├── KafkaIntro.tsx
│   │   │   ├── DatabricksIntro.tsx
│   │   │   └── ConnectionGuide.tsx
│   │   ├── ControlPanel/
│   │   │   ├── GeneratorControls.tsx
│   │   │   ├── KafkaMetrics.tsx
│   │   │   └── StreamPreview.tsx
│   │   ├── Challenges/
│   │   │   ├── ChallengeList.tsx
│   │   │   ├── ChallengeCard.tsx
│   │   │   └── ChallengeDetail.tsx
│   │   └── Common/
│   │       ├── CodeBlock.tsx
│   │       ├── CopyButton.tsx
│   │       └── StatusIndicator.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Documentation.tsx
│   │   ├── Control.tsx
│   │   ├── Challenges.tsx
│   │   └── Resources.tsx
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── api.ts
│   │   └── kafka.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── functions/
│   ├── src/
│   │   ├── index.ts
│   │   ├── generators.ts
│   │   ├── kafka.ts
│   │   └── metrics.ts
│   └── package.json
├── firestore.rules
├── firebase.json
└── package.json
```

---

### Phase 2: Documentation Content (Day 2-3)

#### 2.1 Create Content Structure
```typescript
// src/content/docs.ts
export const docsContent = {
  kafka: {
    title: "What is Apache Kafka?",
    sections: [
      {
        id: "intro",
        title: "Introduction",
        content: "Kafka is a distributed event streaming platform...",
        visual: "kafka-architecture.svg"
      },
      {
        id: "concepts",
        title: "Core Concepts",
        subsections: [
          { title: "Producers", content: "...", code: "producer-example.py" },
          { title: "Consumers", content: "...", code: "consumer-example.py" },
          { title: "Topics", content: "..." },
          { title: "Partitions", content: "..." }
        ]
      }
    ]
  },
  databricks: { /* ... */ },
  connections: { /* ... */ }
};
```

#### 2.2 Interactive Components
- Animated diagrams using React Spring or Framer Motion
- Interactive code examples with live editing
- Embedded quizzes with instant feedback
- Expandable sections for deep dives

---

### Phase 3: Control Panel (Day 4-5)

#### 3.1 Generator Controls Component
```typescript
// src/components/ControlPanel/GeneratorControls.tsx
import { useState } from 'react';
import { startGenerator, stopGenerator } from '../../services/api';

const generators = [
  { id: 'ecommerce', name: 'E-commerce Events', icon: '🛒' },
  { id: 'iot', name: 'IoT Sensors', icon: '🌡️' },
  { id: 'social', name: 'Social Media', icon: '💬' },
  { id: 'financial', name: 'Financial Transactions', icon: '💳' }
];

export const GeneratorControls = () => {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});

  const handleToggle = async (genId: string) => {
    if (statuses[genId]) {
      await stopGenerator(genId);
    } else {
      await startGenerator(genId);
    }
    // Update status
  };

  return (
    <div className="generator-controls">
      {generators.map(gen => (
        <GeneratorCard
          key={gen.id}
          generator={gen}
          isRunning={statuses[gen.id]}
          onToggle={() => handleToggle(gen.id)}
        />
      ))}
    </div>
  );
};
```

#### 3.2 Real-time Metrics
```typescript
// src/components/ControlPanel/KafkaMetrics.tsx
import { useQuery } from 'react-query';
import { LineChart, Line } from 'recharts';
import { getKafkaMetrics } from '../../services/api';

export const KafkaMetrics = () => {
  const { data, isLoading } = useQuery(
    'kafkaMetrics',
    getKafkaMetrics,
    { refetchInterval: 5000 } // Poll every 5 seconds
  );

  return (
    <div>
      <h3>Messages per Second</h3>
      <LineChart data={data?.timeSeries}>
        <Line dataKey="ecommerce" stroke="#8884d8" />
        <Line dataKey="iot" stroke="#82ca9d" />
        {/* ... */}
      </LineChart>
    </div>
  );
};
```

---

### Phase 4: Data Generators (Day 6-7)

#### 4.1 Create Dockerized Generators
```dockerfile
# generators/ecommerce/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY generator.py .

CMD ["python", "generator.py"]
```

```python
# generators/ecommerce/generator.py
import os
from kafka import KafkaProducer
from flask import Flask, jsonify
import threading

app = Flask(__name__)
generator = None

@app.route('/start', methods=['POST'])
def start():
    global generator
    if not generator or not generator.running:
        generator = EcommerceGenerator(
            bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
            topic_name='ecommerce-events'
        )
        threading.Thread(target=generator.start).start()
        return jsonify({'status': 'started'})
    return jsonify({'status': 'already_running'})

@app.route('/stop', methods=['POST'])
def stop():
    global generator
    if generator and generator.running:
        generator.stop()
        return jsonify({'status': 'stopped'})
    return jsonify({'status': 'not_running'})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

#### 4.2 Deploy to Cloud Run
```bash
# Build and deploy each generator
gcloud builds submit --tag gcr.io/PROJECT_ID/ecommerce-generator
gcloud run deploy ecommerce-generator \
  --image gcr.io/PROJECT_ID/ecommerce-generator \
  --platform managed \
  --region us-central1 \
  --set-env-vars KAFKA_BOOTSTRAP_SERVERS=your-kafka-servers
```

---

### Phase 5: Firebase Functions (Day 8)

#### 5.1 Generator Management Functions
```typescript
// functions/src/generators.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const GENERATOR_URLS = {
  ecommerce: process.env.ECOMMERCE_GENERATOR_URL,
  iot: process.env.IOT_GENERATOR_URL,
  social: process.env.SOCIAL_GENERATOR_URL,
  financial: process.env.FINANCIAL_GENERATOR_URL
};

export const startGenerator = functions.https.onCall(async (data, context) => {
  const { generatorType } = data;

  // Verify admin (optional)
  // if (!context.auth || !context.auth.token.admin) {
  //   throw new functions.https.HttpsError('permission-denied', 'Admin only');
  // }

  const generatorUrl = GENERATOR_URLS[generatorType as keyof typeof GENERATOR_URLS];

  try {
    await axios.post(`${generatorUrl}/start`);

    // Update Firestore
    await admin.firestore().collection('generators').doc(generatorType).set({
      status: 'running',
      startedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, generatorType };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Failed to start generator');
  }
});

export const stopGenerator = functions.https.onCall(async (data, context) => {
  // Similar implementation
});

export const getGeneratorStatus = functions.https.onCall(async (data, context) => {
  const snapshot = await admin.firestore().collection('generators').get();
  const statuses: Record<string, any> = {};

  snapshot.forEach(doc => {
    statuses[doc.id] = doc.data();
  });

  return { generators: statuses };
});
```

#### 5.2 Kafka Metrics Functions
```typescript
// functions/src/kafka.ts
import * as functions from 'firebase-functions';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'workshop-monitor',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS!]
});

export const getKafkaMetrics = functions.https.onCall(async (data, context) => {
  const admin = kafka.admin();
  await admin.connect();

  try {
    const topics = await admin.listTopics();
    const cluster = await admin.describeCluster();

    // Get metrics for each topic
    const topicMetrics = [];
    for (const topic of topics) {
      const offsets = await admin.fetchTopicOffsets(topic);
      topicMetrics.push({
        name: topic,
        partitions: offsets.length,
        // Add more metrics as needed
      });
    }

    return { topics: topicMetrics, cluster };
  } finally {
    await admin.disconnect();
  }
});

export const getTopicSample = functions.https.onCall(async (data, context) => {
  const { topicName, limit = 10 } = data;

  const consumer = kafka.consumer({ groupId: 'workshop-preview' });
  await consumer.connect();
  await consumer.subscribe({ topic: topicName, fromBeginning: false });

  const messages: any[] = [];

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      messages.push({
        value: message.value?.toString(),
        timestamp: message.timestamp,
        partition
      });

      if (messages.length >= limit) {
        await consumer.disconnect();
      }
    }
  });

  return { messages };
});
```

---

### Phase 6: Deployment (Day 9)

#### 6.1 Build React App
```bash
cd workshop-app
npm run build
```

#### 6.2 Configure Firebase Hosting
```json
// firebase.json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions"
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

#### 6.3 Deploy Everything
```bash
# Deploy functions
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore

# Deploy hosting
firebase deploy --only hosting

# Or deploy everything
firebase deploy
```

---

## Security Considerations

### Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to config and docs
    match /config/{document=**} {
      allow read: if true;
      allow write: if false; // Only via admin SDK
    }

    // Generator status - read by all, write by admins only
    match /generators/{generator} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // User progress tracking (if implemented)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### API Key Management
```bash
# Store sensitive keys in Firebase Functions config
firebase functions:config:set kafka.bootstrap_servers="your-servers" \
  kafka.username="your-username" \
  kafka.password="your-password"
```

---

## Cost Estimation (Google Cloud)

### Firebase (Free Tier Sufficient for Workshop)
- **Hosting**: 10GB storage, 360MB/day transfer (FREE)
- **Functions**: 2M invocations/month (FREE)
- **Firestore**: 1GB storage, 50k reads/day (FREE)

### Cloud Run (Pay per use)
- **4 containers** running continuously
- ~$20-30/month per container ($80-120 total)
- Can reduce costs by stopping generators when not in use

### Kafka Options
- **Confluent Cloud**: ~$100-200/month (Basic tier)
- **Aiven**: ~$150/month
- **Self-hosted on GCE**: ~$50-100/month (e2-medium instance)

**Total Estimated Cost**: $150-350/month during active workshop period

---

## Testing Strategy

### Unit Tests
- React components (Jest + React Testing Library)
- Firebase Functions (Jest)
- Data generators (pytest)

### Integration Tests
- End-to-end user flows (Cypress or Playwright)
- Kafka connectivity tests
- Generator start/stop workflows

### Load Tests
- Simulate multiple students connecting simultaneously
- Test generator throughput
- Monitor Firestore read/write limits

---

## Next Steps

1. **Review and approve this plan**
2. **Set up Firebase project and GCP account**
3. **Choose Kafka hosting option** (Confluent Cloud recommended for simplicity)
4. **Begin Phase 1 implementation** (Project setup)
5. **Create content outline** for documentation pages
6. **Design UI mockups** (optional but helpful)

---

## Alternative Architectures (If Needed)

### Option B: Pure Serverless (No Cloud Run)
- Use Firebase Functions with scheduled triggers
- Store generator state in Firestore
- Functions run for short bursts every minute
- **Pro**: Simpler, cheaper
- **Con**: Less real-time, harder to control

### Option C: Static Generators (No Control Panel)
- Generators always running, no start/stop controls
- Firebase app is purely documentation + monitoring
- **Pro**: Simplest to implement
- **Con**: Less interactive, wastes resources

### Option D: Local Development Setup
- Students run generators locally via Docker Compose
- Firebase app is just documentation
- **Pro**: No cloud costs during development
- **Con**: Defeats the "hidden complexity" goal

---

## Questions to Consider

1. **Authentication**: Do students need accounts, or is the app public?
2. **Progress Tracking**: Should we track which challenges students complete?
3. **Admin Interface**: Separate admin panel or inline with public app?
4. **Data Retention**: How long should Kafka retain messages?
5. **Scaling**: How many concurrent students? (10? 50? 100?)
6. **Workshop Duration**: One-time event or recurring sessions?

---

## Resources & Documentation Links

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase Functions Guide](https://firebase.google.com/docs/functions)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Kafka Python Client](https://kafka-python.readthedocs.io/)
- [React Router Tutorial](https://reactrouter.com/en/main)
- [Material-UI Components](https://mui.com/material-ui/getting-started/)

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 1. Project Setup | 1 day | Firebase initialized, React app scaffolded |
| 2. Documentation Content | 2 days | All tutorial content written, components built |
| 3. Control Panel | 2 days | Generator controls, metrics dashboard |
| 4. Data Generators | 2 days | 4 generators built, dockerized, tested |
| 5. Firebase Functions | 1 day | API endpoints, Firestore integration |
| 6. Deployment | 1 day | Everything deployed, tested end-to-end |
| **Total** | **9 days** | **Fully functional workshop app** |

---

This plan provides a comprehensive roadmap to build the Firebase-hosted workshop application. Once approved, we can begin implementation phase by phase.
