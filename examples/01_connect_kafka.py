#!/usr/bin/env python3
"""
Quick Example - Connecting to Kafka
This script demonstrates how to connect to Confluent Cloud Kafka and list available topics.
"""

import os
from kafka import KafkaAdminClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get credentials from environment variables
BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'pkc-619z3.us-east1.gcp.confluent.cloud:9092')
API_KEY = os.getenv('KAFKA_API_KEY')
API_SECRET = os.getenv('KAFKA_API_SECRET')

# Validate credentials
if not API_KEY or not API_SECRET:
    raise ValueError(
        "Missing Kafka credentials!\n"
        "Please set KAFKA_API_KEY and KAFKA_API_SECRET in your .env file.\n"
        "Copy .env.example to .env and add your credentials."
    )

print("🔌 Connecting to Confluent Cloud Kafka...")

# Connect to Confluent Cloud Kafka
admin = KafkaAdminClient(
    bootstrap_servers=BOOTSTRAP_SERVERS,
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=API_KEY,
    sasl_plain_password=API_SECRET
)

print("✅ Connected successfully!\n")

# List all topics
topics = admin.list_topics()
print(f"📂 Available topics ({len(topics)}):")
for topic in sorted(topics):
    print(f"  - {topic}")

# Close the connection
admin.close()
print("\n✅ Connection closed.")
