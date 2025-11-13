# Kafka Workshop Examples

This directory contains example scripts for the Kafka & Databricks workshop.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

2. **Configure credentials:**
   ```bash
   # Copy the example environment file
   cp ../.env.example ../.env

   # Edit .env and add your Kafka credentials
   nano ../.env  # or use your favorite editor
   ```

3. **Add your credentials to `.env`:**
   ```env
   KAFKA_API_KEY=your_actual_api_key_here
   KAFKA_API_SECRET=your_actual_api_secret_here
   ```

## Examples

### 01. Connect to Kafka
**File:** `01_connect_kafka.py`

Demonstrates how to connect to Confluent Cloud Kafka and list available topics.

```bash
python examples/01_connect_kafka.py
```

**Expected output:**
```
🔌 Connecting to Confluent Cloud Kafka...
✅ Connected successfully!

📂 Available topics (3):
  - ecommerce-events
  - iot-sensors
  - social-media

✅ Connection closed.
```

## Security Notes

- **Never commit `.env` file** - It's already in `.gitignore`
- **Never share your API keys** - Keep them secret
- **Use environment variables** - Always load credentials from `.env` file

## Troubleshooting

### ModuleNotFoundError: No module named 'kafka'
```bash
# Make sure you installed the requirements
pip install -r requirements.txt
```

### ValueError: Missing Kafka credentials
```bash
# Make sure you created .env file and added your credentials
cp .env.example .env
# Edit .env and add your API_KEY and API_SECRET
```

### Connection timeout
- Check your internet connection
- Verify the bootstrap servers URL is correct
- Confirm your API credentials are valid in Confluent Cloud
