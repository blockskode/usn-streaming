# Real-Time Data Streaming Workshop

Welcome to the Kafka & Databricks Streaming Workshop! This repository contains Python code examples to help you learn real-time data streaming.

## Workshop Platform

All tutorials, challenges, and interactive features are available at:

**https://usnkafka.web.app**

The workshop platform includes:
- Step-by-step tutorials for Apache Kafka and Databricks
- Interactive data generators
- Hands-on coding challenges
- Complete code examples with explanations
- Live data streaming controls

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/blockskode/usn-streaming.git
cd usn-streaming
```

### 2. Create a Virtual Environment

**For macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**For Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Your Kafka Credentials

Create a `.env` file in the root directory with your Kafka credentials:

```bash
KAFKA_BOOTSTRAP_SERVERS=your-kafka-server:9092
KAFKA_API_KEY=your-api-key
KAFKA_API_SECRET=your-api-secret
```

**Note:** Your instructor will provide the Kafka credentials during the workshop.

## What's Included

### Code Examples

The `examples/` folder contains progressive Python scripts to help you learn Kafka:

- `00_test_connection.py` - Test your Kafka connection
- `01_connect_kafka.py` - Basic Kafka consumer setup
- `02_create_topic.py` - Create Kafka topics
- `03_produce_messages.py` - Send messages to Kafka
- `04_consume_messages.py` - Read messages from Kafka

Each example builds on the previous one and includes detailed comments.

### Requirements

The `requirements.txt` file includes all necessary Python packages:
- `kafka-python` - Apache Kafka client for Python
- `python-dotenv` - Environment variable management

## Using the Examples

### Test Your Connection

```bash
python examples/00_test_connection.py
```

### Run Individual Examples

```bash
python examples/01_connect_kafka.py
python examples/02_create_topic.py
python examples/03_produce_messages.py
python examples/04_consume_messages.py
```

## Need Help?

### Workshop Platform
Visit **https://usnkafka.web.app** for:
- Comprehensive tutorials
- Code examples with explanations
- Troubleshooting guides
- Interactive challenges

### Documentation
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Databricks Documentation](https://docs.databricks.com/)

## Workshop Structure

1. **Kafka Fundamentals** - Learn producers, consumers, topics, and partitions
2. **Python Integration** - Use kafka-python to build applications
3. **Databricks Streaming** - Process data with Structured Streaming
4. **Delta Lake** - Store streaming data with ACID guarantees

## Prerequisites

- Python 3.13 or higher
- Basic understanding of Python programming
- Familiarity with JSON data format
- Terminal/command line knowledge

## Troubleshooting

### Virtual Environment Issues

If you have issues activating the virtual environment:

**macOS/Linux:**
```bash
deactivate  # If already in a venv
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Windows:**
```bash
deactivate  # If already in a venv
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Connection Issues

If you can't connect to Kafka:
1. Verify your `.env` file has the correct credentials
2. Check your internet connection
3. Run `python examples/00_test_connection.py` to diagnose
4. Contact your instructor for help

## Getting Started

1. Visit **https://usnkafka.web.app** and create an account
2. Complete the tutorials to learn Kafka fundamentals
3. Use the code examples in this repository to practice
4. Work through the challenges on the platform
5. Start the data generators to create live streams
6. Build your own streaming applications!

## Additional Resources

For extensive tutorials, code examples, and interactive learning:

**Visit: https://usnkafka.web.app**

The platform provides everything you need to master real-time data streaming with Kafka and Databricks.

---

Happy Streaming!
