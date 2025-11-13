# Kafka Workshop App - Build Plan
## Professional App with Auth, Tutorial, and Data Generation

---

## App Structure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC PAGES                             │
│  (No login required)                                        │
│                                                             │
│  ├── Landing Page                                           │
│  │   - Hero section                                         │
│  │   - Features overview                                    │
│  │   - Call to action                                       │
│  │                                                          │
│  ├── Login Page                                             │
│  │   - Email/password                                       │
│  │   - Google sign-in                                       │
│  │                                                          │
│  └── Registration Page                                      │
│      - Create account                                       │
│      - Email verification                                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ After Login
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATED AREA                         │
│  (Login required)                                           │
│                                                             │
│  ├── Dashboard                                              │
│  │   - Welcome message                                      │
│  │   - Progress overview                                    │
│  │   - Quick links                                          │
│  │                                                          │
│  ├── Tutorial Section                                       │
│  │   ├── What is Kafka?                                    │
│  │   ├── What is Databricks?                               │
│  │   ├── How to Connect (Python/Databricks)               │
│  │   └── Best Practices                                    │
│  │                                                          │
│  ├── Data Generator Control Panel                          │
│  │   - Start/Stop buttons for 4 generators                 │
│  │   - Live metrics                                        │
│  │   - Stream preview                                      │
│  │                                                          │
│  ├── Challenges                                             │
│  │   - 9 progressive challenges                            │
│  │   - Track completion                                    │
│  │   - Starter code                                        │
│  │                                                          │
│  ├── Resources                                              │
│  │   - Connection details                                  │
│  │   - Code snippets                                       │
│  │   - Downloads                                           │
│  │                                                          │
│  └── Profile                                                │
│      - User info                                            │
│      - Progress tracking                                    │
│      - Settings                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Emotion (comes with MUI)
- **State Management**: React Context + React Query
- **Forms**: React Hook Form + Yup validation
- **Auth**: Firebase Authentication
- **Animations**: Framer Motion (for landing page)
- **Code Display**: react-syntax-highlighter
- **Charts**: Recharts (for metrics)

### Backend
- **Hosting**: Firebase Hosting
- **Functions**: Firebase Functions (Node.js/TypeScript)
- **Database**: Firestore
- **Authentication**: Firebase Auth (Email/Password + Google)
- **Storage**: Firebase Storage (for downloadable resources)

### Kafka
- **Provider**: Confluent Cloud
- **Client**: kafkajs (in Firebase Functions)

---

## Project Structure

```
kafka-workshop-app/
├── public/
│   ├── index.html
│   ├── logo.png
│   └── assets/
│       ├── kafka-diagram.svg
│       └── hero-image.jpg
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTA.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AppLayout.tsx
│   │   │
│   │   ├── tutorial/
│   │   │   ├── TutorialNav.tsx
│   │   │   ├── KafkaIntro.tsx
│   │   │   ├── DatabricksIntro.tsx
│   │   │   ├── ConnectionGuide.tsx
│   │   │   ├── InteractiveDiagram.tsx
│   │   │   └── QuizSection.tsx
│   │   │
│   │   ├── generators/
│   │   │   ├── GeneratorCard.tsx
│   │   │   ├── GeneratorControls.tsx
│   │   │   ├── MetricsChart.tsx
│   │   │   ├── StreamPreview.tsx
│   │   │   └── RateSlider.tsx
│   │   │
│   │   ├── challenges/
│   │   │   ├── ChallengeList.tsx
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── ChallengeDetail.tsx
│   │   │   ├── StarterCode.tsx
│   │   │   └── ProgressTracker.tsx
│   │   │
│   │   └── common/
│   │       ├── CodeBlock.tsx
│   │       ├── CopyButton.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── Toast.tsx
│   │
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Tutorial.tsx
│   │   ├── Generators.tsx
│   │   ├── Challenges.tsx
│   │   ├── Resources.tsx
│   │   └── Profile.tsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── GeneratorContext.tsx
│   │
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   └── firestore.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGenerators.ts
│   │   ├── useChallenges.ts
│   │   └── useProgress.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── generator.ts
│   │   └── challenge.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   │
│   ├── theme/
│   │   ├── palette.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.tsx
│   └── routes.tsx
│
├── functions/
│   ├── src/
│   │   ├── index.ts
│   │   ├── auth/
│   │   │   └── onCreate.ts          # Welcome email on signup
│   │   ├── generators/
│   │   │   ├── base.ts
│   │   │   ├── ecommerce.ts
│   │   │   ├── iot.ts
│   │   │   ├── social.ts
│   │   │   └── financial.ts
│   │   ├── kafka/
│   │   │   ├── client.ts
│   │   │   └── producer.ts
│   │   └── utils/
│   │       └── helpers.ts
│   ├── package.json
│   └── tsconfig.json
│
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── .firebaserc
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Phase 1: Project Setup & Landing Page

### 1.1 Initialize React App

```bash
# Create React app with TypeScript
npx create-react-app kafka-workshop-app --template typescript
cd kafka-workshop-app

# Install core dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom
npm install firebase
npm install react-hook-form yup @hookform/resolvers
npm install framer-motion
npm install react-syntax-highlighter recharts
npm install react-query

# Install dev dependencies
npm install -D @types/react-syntax-highlighter
```

### 1.2 Initialize Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase in the project
firebase init

# Select:
# ☑ Firestore
# ☑ Functions (TypeScript)
# ☑ Hosting
# ☑ Storage
```

### 1.3 Create Landing Page

**Features:**
- **Hero Section**: Eye-catching headline, CTA button
- **Features Grid**: 4 key features with icons
- **How It Works**: 3-step process
- **CTA Section**: "Get Started Free" button

**Design Inspiration:**
- Clean, modern design
- Kafka brand colors (black + accent color)
- Animated scroll effects
- Responsive mobile design

---

## Phase 2: Authentication System

### 2.1 Firebase Auth Setup

**File: `src/services/firebase.ts`**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
```

### 2.2 Auth Context

**File: `src/contexts/AuthContext.tsx`**
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
```

### 2.3 Protected Route Component

**File: `src/components/auth/ProtectedRoute.tsx`**
```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};
```

### 2.4 Login & Registration Pages

Simple, clean forms with:
- Email/password fields
- Google sign-in button
- Form validation
- Error handling
- Loading states

---

## Phase 3: Tutorial Section

### 3.1 Tutorial Content Structure

**Topics:**
1. **What is Kafka?**
   - Event streaming concepts
   - Producers, consumers, topics
   - When to use Kafka
   - Interactive diagram

2. **What is Databricks?**
   - Spark Structured Streaming
   - Delta Lake
   - Medallion architecture
   - Use cases

3. **How to Connect**
   - From Python (VS Code)
   - From Databricks
   - Configuration examples
   - Troubleshooting

4. **Best Practices**
   - Error handling
   - Consumer groups
   - Offset management
   - Performance tips

### 3.2 Interactive Elements

- **Code blocks** with syntax highlighting and copy button
- **Animated diagrams** showing data flow
- **Quizzes** after each section
- **Progress tracking** (mark sections as completed)

### 3.3 Tutorial Navigation

- Sidebar with sections
- Progress indicator
- "Next" and "Previous" buttons
- Bookmark capability

---

## Phase 4: Data Generator Control Panel

### 4.1 Generator Cards

**Each generator card shows:**
- Icon and name
- Description
- Current status (Running/Stopped)
- Message count
- Start/Stop button

### 4.2 Controls

- **Rate slider**: 1-50 messages/second
- **Start All** button
- **Stop All** button
- **Reset counters** button

### 4.3 Metrics Display

- Real-time charts (messages/second over time)
- Total messages sent per topic
- Active time

### 4.4 Stream Preview

- Live sample messages from each topic
- JSON prettified
- Auto-refresh every 5 seconds

---

## Phase 5: Challenges Section

### 5.1 Challenge List

Display all 9 challenges with:
- Difficulty badge (Beginner/Intermediate/Advanced)
- Completion checkmark
- Time estimate
- Tech stack (Python/Databricks)

### 5.2 Challenge Detail Page

When user clicks a challenge:
- Full description
- Learning objectives
- Success criteria
- Starter code (copy button)
- AI prompt suggestions
- Submit button (marks as complete)

### 5.3 Progress Tracking

Store in Firestore:
```typescript
/users/{userId}/progress
  - completedChallenges: string[]
  - currentChallenge: string
  - startedAt: timestamp
  - lastActive: timestamp
```

---

## Phase 6: Resources Page

### 6.1 Connection Details

Display (secured per user):
- Bootstrap servers
- Consumer API keys
- Topic names
- Connection examples

### 6.2 Downloads

- Python starter code (zip)
- Databricks notebooks
- Cheat sheets (PDF)
- Kafka commands reference

### 6.3 Quick Links

- Confluent Cloud docs
- Databricks docs
- Kafka Python client docs
- GitHub repo (if public)

---

## Firestore Data Model

```
/users/{userId}
  - email: string
  - displayName: string
  - createdAt: timestamp
  - lastLogin: timestamp

/users/{userId}/progress
  - completedChallenges: string[]
  - tutorialProgress: { [sectionId]: boolean }
  - currentChallenge: string

/generators (collection)
  /{generatorType}
    - status: 'running' | 'stopped'
    - startedAt: timestamp
    - messageCount: number
    - messagesPerSec: number

/challenges (collection)
  /{challengeId}
    - title: string
    - description: string
    - difficulty: string
    - starterCode: string
    - successCriteria: string[]
```

---

## Firebase Functions (Backend)

### Generator Control Functions

```typescript
// Start generator
exports.startGenerator = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { generatorType, messagesPerSec } = data;

  // Implementation from previous plan
  // ...
});

// Stop generator
exports.stopGenerator = functions.https.onCall(async (data, context) => {
  // Implementation
});

// Get status
exports.getGeneratorStatus = functions.https.onCall(async (data, context) => {
  // Implementation
});
```

### User Management Functions

```typescript
// On user creation
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Create user document in Firestore
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName || 'Student',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Initialize progress
  await admin.firestore()
    .collection('users')
    .doc(user.uid)
    .collection('progress')
    .doc('data')
    .set({
      completedChallenges: [],
      tutorialProgress: {},
    });
});
```

---

## Routing Structure

```typescript
// src/routes.tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

<Routes>
  {/* Public routes */}
  <Route path="/" element={<Landing />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/tutorial"
    element={
      <ProtectedRoute>
        <Tutorial />
      </ProtectedRoute>
    }
  />
  <Route
    path="/generators"
    element={
      <ProtectedRoute>
        <Generators />
      </ProtectedRoute>
    }
  />
  <Route
    path="/challenges"
    element={
      <ProtectedRoute>
        <Challenges />
      </ProtectedRoute>
    }
  />
  <Route
    path="/challenges/:id"
    element={
      <ProtectedRoute>
        <ChallengeDetail />
      </ProtectedRoute>
    }
  />
  <Route
    path="/resources"
    element={
      <ProtectedRoute>
        <Resources />
      </ProtectedRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## Design System (Theme)

### Color Palette

```typescript
// src/theme/palette.ts
export const palette = {
  primary: {
    main: '#000000',      // Kafka black
    light: '#333333',
    dark: '#000000',
  },
  secondary: {
    main: '#FF6B35',      // Accent orange
    light: '#FF8C61',
    dark: '#E55A2B',
  },
  success: {
    main: '#4CAF50',
  },
  error: {
    main: '#F44336',
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
};
```

### Typography

```typescript
// src/theme/typography.ts
export const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontSize: '3rem', fontWeight: 700 },
  h2: { fontSize: '2.5rem', fontWeight: 600 },
  h3: { fontSize: '2rem', fontWeight: 600 },
  h4: { fontSize: '1.5rem', fontWeight: 500 },
  h5: { fontSize: '1.25rem', fontWeight: 500 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  code: { fontFamily: '"Fira Code", monospace' },
};
```

---

## Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /progress/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Everyone can read challenges (authenticated)
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Generator status - read by authenticated users
    match /generators/{generatorId} {
      allow read: if request.auth != null;
      allow write: if false; // Only functions can write
    }
  }
}
```

---

## Implementation Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| 1. Setup & Landing | 1 day | Project initialized, landing page live |
| 2. Authentication | 1 day | Login/register working, protected routes |
| 3. Tutorial Section | 2 days | All tutorial content, interactive elements |
| 4. Generator Control | 2 days | Backend functions, UI controls, metrics |
| 5. Challenges | 1 day | Challenge list, detail pages, progress tracking |
| 6. Resources & Polish | 1 day | Resources page, final touches, testing |
| **Total** | **8 days** | **Complete professional app** |

---

## Development Order

### Day 1: Foundation
1. Create React app
2. Initialize Firebase
3. Set up routing
4. Build landing page
5. Deploy to Firebase Hosting

### Day 2: Auth
1. Implement auth context
2. Build login page
3. Build register page
4. Add Google sign-in
5. Create protected routes

### Day 3-4: Tutorial
1. Create tutorial layout
2. Write content for all sections
3. Add code blocks with syntax highlighting
4. Build interactive diagrams
5. Add progress tracking

### Day 5-6: Generators
1. Implement Firebase Functions (Kafka)
2. Build generator card components
3. Add metrics charts
4. Create stream preview
5. Test end-to-end

### Day 7: Challenges
1. Create challenge list
2. Build challenge detail pages
3. Add starter code display
4. Implement progress tracking

### Day 8: Polish & Deploy
1. Resources page
2. Profile page
3. Error handling
4. Loading states
5. Final testing
6. Deploy to production

---

## Next Steps

1. **Create Firebase project** in console
2. **Initialize local project** structure
3. **Build landing page** first (quick win!)
4. **Set up authentication**
5. **Implement generators backend**
6. **Build tutorial content**

---

Ready to start building? Let's begin with Phase 1: Project setup and landing page!
