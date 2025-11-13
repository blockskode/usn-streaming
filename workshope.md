# Objective
Create an engaging, hands-on workshop where students actively solve real-world problems with Kafka and Databricks. Students are **encouraged to use AI tools** (ChatGPT, Claude, Copilot, etc.) as learning companions. The focus is on **understanding concepts through doing**, not memorization or grades.

## Core Philosophy: AI-Enhanced Learning
In the AI era, the skill isn't memorizing syntax or documentation—it's about:
- **Understanding core concepts** and when to apply them
- **Problem-solving** with real-world constraints
- **Effectively collaborating with AI** to accelerate development
- **Critical thinking** to validate AI-generated solutions
- **Learning how to learn** in an AI-augmented workflow

---

# Workshop Structure

## Part 1: Interactive Learning Platform (30-45 min)
**Format:** Web-based interactive tutorial (React + Firebase or simple HTML)

**Content Strategy:**
- **Minimal theory, maximum interaction**: Brief explanations followed by interactive demos
- **Built-in AI prompts**: Provide suggested prompts students can use with AI tools to explore deeper
- **Visual-first**: Animated diagrams showing how Kafka works (producers, topics, consumers, partitions)
- **Real-world scenarios**: "When would you need Kafka vs a traditional database?"

**Key Topics to Cover:**
- What is event streaming and why it matters
- Kafka core concepts (producers, consumers, topics, partitions)
- Common use cases (IoT data, user activity tracking, log aggregation)
- Databricks for stream processing and analytics

**Interactive Elements:**
- Embedded quizzes with instant feedback
- Live architecture diagrams students can manipulate
- Code snippets they can copy and ask AI to explain

---

## Part 2: Hands-On Lab Environment (90-120 min)

### Infrastructure Setup
**Pre-configured Kafka Cluster (Instructor-Managed):**
- Kafka cluster with pre-populated topics running continuously
- Students receive connection details (bootstrap servers, topic names)
- Web UI dashboard for monitoring (read-only access for students)
- Multiple real-world data streams already flowing

**What Students See:**
```
┌─────────────────────────────────────┐
│  Student's Browser                  │
│  ┌───────────────────────────────┐  │
│  │ Workshop Dashboard            │  │
│  │ - Kafka connection details    │  │
│  │ - Available topics & schemas  │  │
│  │ - Live metrics viewer         │  │
│  │ - Challenge instructions      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
           │
           ▼ (Connect to)
┌─────────────────────────────────────┐
│  Pre-Running Kafka Cluster          │
│  (Instructor-managed - Hidden)      │
│                                     │
│  Topics with live data streams:     │
│  • ecommerce-events                 │
│  • iot-sensor-data                  │
│  • social-media-feed                │
│  • financial-transactions           │
└─────────────────────────────────────┘
           │
           ▼ (Students connect from)
┌──────────────────┬──────────────────┐
│  VS Code         │  Databricks      │
│  (Local Python)  │  (Notebooks)     │
│                  │                  │
│  - Consumer code │  - Spark         │
│  - Analysis      │    Streaming     │
│  - Dashboards    │  - Delta Lake    │
└──────────────────┴──────────────────┘
```

### Pre-Running Data Streams
Students connect to already-streaming topics with realistic data:

1. **`ecommerce-events`** topic:
   - User browsing, cart actions, purchases
   - Schema: `{user_id, event_type, product_id, price, timestamp, session_id}`

2. **`iot-sensor-data`** topic:
   - Temperature, humidity, device health from simulated sensors
   - Schema: `{device_id, sensor_type, value, unit, location, timestamp}`

3. **`social-media-feed`** topic:
   - Posts, likes, shares, comments (anonymized)
   - Schema: `{post_id, user_id, action_type, content_preview, timestamp, engagement_score}`

4. **`financial-transactions`** topic:
   - Payment events with fraud indicators
   - Schema: `{transaction_id, amount, currency, merchant_category, risk_score, timestamp, country}`

**Student Focus**: Learning to **connect, consume, and process** these streams—not worrying about how the data is generated.

---

## Part 3: Progressive Challenges (Main Activity)

### Challenge Format
Each challenge includes:
- **Real-world scenario**: Context for why you'd do this
- **Environment**: VS Code (Python) or Databricks (Spark)
- **Connection focus**: How to connect and what configurations matter
- **Success criteria**: Clear, measurable goals
- **Boilerplate code**: Starting point (not complete solution)
- **AI collaboration tips**: Suggested questions to ask AI tools

---

### Track A: Connecting from VS Code (Python)

**Challenge 1: First Connection - E-commerce Events**
- **Scenario**: You're a data analyst who needs to monitor real-time purchase events
- **Environment**: VS Code with Python
- **Your Task**:
  - Connect to the `ecommerce-events` topic
  - Consume and print the first 50 messages
  - Parse the JSON data and display in readable format
- **Success Criteria**:
  - Successfully authenticate with Kafka cluster
  - Read messages from the correct topic
  - Handle JSON deserialization
- **AI Tips**:
  - "What are the essential Kafka consumer configuration parameters?"
  - "How do I handle JSON deserialization in Python from Kafka messages?"

**Challenge 2: Filtering & Aggregation - High-Value Purchases**
- **Scenario**: Marketing team wants to track purchases over $500 in real-time
- **Environment**: VS Code with Python
- **Your Task**:
  - Filter events where `event_type == 'purchase'` and `price > 500`
  - Calculate running totals: total purchases, total revenue
  - Print summary every 10 high-value purchases
- **Success Criteria**:
  - Accurate filtering logic
  - Maintain running calculations
  - Display formatted output
- **AI Tips**:
  - "How can I efficiently filter streaming data in Python?"
  - "What's the best way to maintain running aggregations?"

**Challenge 3: Real-Time Dashboard - Sales Monitoring**
- **Scenario**: Create a live dashboard for the sales team
- **Environment**: VS Code with Python (Streamlit or Plotly)
- **Your Task**:
  - Build a live-updating visualization showing:
    - Events per second
    - Revenue per minute
    - Top 5 products by sales
  - Auto-refresh every 5 seconds
- **Success Criteria**:
  - Dashboard updates in real-time
  - Multiple metrics displayed
  - Clean, professional UI
- **AI Tips**:
  - "Compare Streamlit vs Plotly Dash for real-time dashboards"
  - "How do I efficiently update visualizations with streaming data?"

**Challenge 4: IoT Sensor Monitoring**
- **Scenario**: Monitor IoT sensors and alert on anomalies
- **Environment**: VS Code with Python
- **Your Task**:
  - Connect to `iot-sensor-data` topic
  - Track temperature sensors across different locations
  - Alert when temperature exceeds thresholds (< 0°C or > 40°C)
  - Calculate average temperature per location
- **Success Criteria**:
  - Parse sensor data correctly
  - Implement alert logic
  - Group by location and aggregate
- **AI Tips**:
  - "How should I structure my code to handle multiple sensor types?"
  - "What's an efficient way to group streaming data by a field?"

---

### Track B: Connecting from Databricks (Spark Streaming)

**Challenge 5: First Spark Streaming Connection**
- **Scenario**: Set up enterprise-scale stream processing
- **Environment**: Databricks Notebook
- **Your Task**:
  - Connect to `ecommerce-events` topic using Spark Structured Streaming
  - Read the stream and display schema
  - Write the stream to a Delta table (bronze layer)
  - Query the Delta table to verify data is flowing
- **Success Criteria**:
  - Successful Kafka connection from Spark
  - Data streaming into Delta Lake
  - Can query the table
- **AI Tips**:
  - "What are the key differences between Kafka consumer in Python vs Spark?"
  - "How do I configure Spark to read from Kafka?"
  - "What are Spark readStream options for Kafka?"

**Challenge 6: Stream Processing & Transformations**
- **Scenario**: Build a medallion architecture (bronze → silver)
- **Environment**: Databricks Notebook
- **Your Task**:
  - Read from the bronze Delta table (from Challenge 5)
  - Transform the data:
    - Parse nested JSON fields
    - Add derived columns (hour of day, day of week)
    - Filter out test/invalid events
  - Write to silver Delta table with schema enforcement
- **Success Criteria**:
  - Data flows from bronze to silver
  - Transformations applied correctly
  - Delta Lake features utilized (schema enforcement, versioning)
- **AI Tips**:
  - "What transformations should I apply in the silver layer?"
  - "How do I use watermarking in Spark Structured Streaming?"

**Challenge 7: Real-Time Aggregations - Financial Fraud Detection**
- **Scenario**: Detect potential fraud patterns in transactions
- **Environment**: Databricks Notebook
- **Your Task**:
  - Connect to `financial-transactions` topic
  - Calculate windowed aggregations (5-minute windows):
    - Average transaction amount per country
    - Count of high-risk transactions (risk_score > 0.7)
    - Flag countries with sudden spikes in transaction volume
  - Write results to a gold Delta table
  - Create a Databricks SQL dashboard to visualize fraud patterns
- **Success Criteria**:
  - Windowed aggregations working correctly
  - Results updating in real-time
  - Dashboard displays key metrics
- **AI Tips**:
  - "How do time windows work in Spark Structured Streaming?"
  - "What's the difference between tumbling and sliding windows?"
  - "How can I detect anomalies in streaming data?"

**Challenge 8: Multi-Stream Join**
- **Scenario**: Enrich transaction data with user behavior
- **Environment**: Databricks Notebook
- **Your Task**:
  - Read from two topics: `ecommerce-events` and `financial-transactions`
  - Join the streams based on `user_id` with a time window
  - Create enriched events that combine:
    - Purchase behavior (from ecommerce)
    - Payment details (from financial)
  - Write to Delta table for analytics team
- **Success Criteria**:
  - Successfully join two Kafka streams
  - Handle late-arriving data
  - Output contains fields from both streams
- **AI Tips**:
  - "How do I join two Kafka streams in Spark?"
  - "What are the challenges with stream-stream joins?"
  - "When should I use watermarking?"

---

### Bonus Challenge: Cross-Platform Integration

**Challenge 9: Python → Databricks Pipeline**
- **Scenario**: Combine local processing with cloud analytics
- **Your Task**:
  - In VS Code: Pre-process `social-media-feed` data (sentiment analysis, filtering)
  - Produce results back to a new Kafka topic: `processed-social-feed`
  - In Databricks: Consume from `processed-social-feed`
  - Perform aggregations and store in Delta Lake
  - Create dashboards showing trending topics
- **Success Criteria**:
  - Data flows from Python → Kafka → Databricks
  - Each component handles its role correctly
  - End-to-end pipeline functional
- **AI Tips**:
  - "When should I use Python vs Spark for stream processing?"
  - "How do I produce messages to Kafka from Python?"
  - "What are the tradeoffs of different architectures?"

---

## Part 4: Final Report & Reflection (30 min)

### Report Components
Students submit a brief report (2-4 pages) covering:

1. **What You Built**: Brief description of solutions
2. **How You Used AI**:
   - What prompts/questions worked well?
   - When did AI help vs. confuse?
   - What did you have to debug/correct?
3. **Key Learnings**:
   - 3 concepts you now understand
   - 1 thing you'd explore more
4. **Real-World Application**:
   - Describe a scenario where you'd use Kafka in your own project

**Encourage Honesty**: The goal is reflection, not perfection. Failed approaches are valuable learning experiences!

---

# Implementation Roadmap

## Phase 1: Infrastructure Setup (Week 1-2)
- [ ] Set up Kafka cluster (cloud or self-hosted) with proper networking
- [ ] Create data generators for all 4 scenarios (hidden from students)
  - E-commerce events generator
  - IoT sensor data simulator
  - Social media feed simulator
  - Financial transactions generator
- [ ] Configure Kafka topics with proper retention and partitioning
- [ ] Set up Kafka UI (e.g., Kafdrop, Conduktor) for monitoring
- [ ] Test data is flowing continuously to all topics

## Phase 2: Student Environment & Dashboard (Week 2-3)
- [ ] Build workshop web dashboard (HTML/React)
  - Display Kafka connection strings
  - Show topic schemas and sample data
  - Provide challenge instructions
  - Link to live metrics viewer
- [ ] Create connection template files:
  - Python Kafka consumer boilerplate
  - Databricks notebook templates
  - Configuration examples
- [ ] Write detailed connection guides:
  - "Connecting from VS Code/Python"
  - "Connecting from Databricks"
  - Troubleshooting common connection issues

## Phase 3: Challenge Development (Week 3-4)
- [ ] Develop boilerplate code for each challenge (Challenges 1-9)
- [ ] Create solution notebooks/scripts (instructor reference)
- [ ] Write clear success criteria with validation approach
- [ ] Add AI prompt suggestions specific to each challenge
- [ ] Design report template with reflection questions

## Phase 4: Learning Content (Week 3-4)
- [ ] Write interactive tutorial with minimal theory
- [ ] Create visual diagrams (Kafka architecture, data flow)
- [ ] Develop "connection-first" examples
- [ ] Add comparison tables (Python vs Spark, when to use what)

## Phase 5: Testing & Refinement (Week 4-5)
- [ ] Test all connection strings and configurations
- [ ] Verify data generators produce realistic data
- [ ] Run through all challenges end-to-end
- [ ] Pilot with small group and gather feedback
- [ ] Finalize instructor guide and timing estimates

## Phase 6: Databricks Setup (Week 5)
- [ ] Configure Databricks workspace for students
- [ ] Set up network connectivity to Kafka cluster
- [ ] Create shared Delta Lake storage location
- [ ] Prepare notebook templates in workspace
- [ ] Test all Databricks challenges

---

# Key Differentiators (AI-Era Approach)

1. **Connection-First Learning**: Students learn by connecting to real, live data streams—not configuring infrastructure
2. **AI as a Learning Partner**: Explicitly teach students how to use AI effectively for learning
3. **Dual-Environment Mastery**: Experience both local development (Python/VS Code) AND cloud-scale processing (Databricks/Spark)
4. **Real-World Scenarios**: All 4 data streams (e-commerce, IoT, social, financial) mirror actual industry use cases
5. **Hidden Complexity**: Data generation is invisible—focus is 100% on consumption, processing, and analysis
6. **Progressive Difficulty**: Start with simple connections, advance to multi-stream joins and fraud detection
7. **Instant Feedback**: Automated tests + AI assistance = faster learning loops
8. **Reflection Over Grades**: Report emphasizes metacognition and learning process

---

# Why This Approach Works

## Traditional Workshop Problems:
- ❌ Students spend 2 hours debugging Docker/Kafka setup
- ❌ Focus on infrastructure instead of concepts
- ❌ Artificial datasets that don't feel real
- ❌ Single environment (only Python OR only Spark)
- ❌ Students memorize commands without understanding

## This Workshop's Solutions:
- ✅ **Pre-running cluster**: Students connect immediately, no setup friction
- ✅ **Connection-focused**: Learn the most important skill—how to access streaming data
- ✅ **Realistic scenarios**: E-commerce, IoT, social, financial data streams feel authentic
- ✅ **Dual environments**: Experience both local (Python) and enterprise-scale (Databricks)
- ✅ **AI-assisted**: Students use AI to understand WHY, not just HOW
- ✅ **Hands-on throughout**: 80% doing, 20% reading

## Student Journey:
```
Hour 1: "What is Kafka?" → Understand concepts through interactive tutorial
        ↓
Hour 2: "First connection!" → Connect from VS Code, see live data flowing
        ↓
Hour 3: "Processing data" → Filter, aggregate, visualize in real-time
        ↓
Hour 4: "Scale it up" → Same concepts, now in Databricks with Spark
        ↓
Hour 5: "Advanced patterns" → Windowing, joins, fraud detection
        ↓
Hour 6: "Reflect & share" → Write report on what they learned and how AI helped
```

---

# Additional Suggestions

## For the Web Control Panel
- Show live Kafka metrics (messages/sec, topics, consumer groups)
- One-button "Reset Everything" for clean restarts
- Embedded terminal for running commands
- Quick links to documentation and AI prompt templates

## For Enhanced Engagement
- **Leaderboard (optional)**: Gamify with points for completed challenges
- **Pair Programming**: Encourage students to work in pairs, using AI as their "third teammate"
- **Live Demo Session**: Start with 15-min live demo where YOU use AI to solve a problem, showing the workflow

## For Databricks Integration
- Provide pre-configured Databricks Community Edition workspace
- Include notebook templates for stream processing
- Show Delta Lake for reliable streaming storage
- Demo real-time dashboards in Databricks SQL

---

# Resources to Provide Students

1. **Pre-Workshop Setup Guide**: Docker install, VS Code setup, account creation
2. **AI Prompt Cheat Sheet**: Effective prompts for learning Kafka concepts
3. **Quick Reference Cards**: Kafka commands, Python consumer API, troubleshooting tips
4. **Example Projects**: GitHub repos showing real-world Kafka applications
5. **Post-Workshop Resources**: Where to continue learning (courses, docs, communities) 

