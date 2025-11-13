#!/usr/bin/env python3
"""
Consume Messages from Your Topic
This script reads messages from your personal topic.
"""

import os
import json
from kafka import KafkaConsumer
from dotenv import load_dotenv

# Load credentials
load_dotenv()

# Get your topic name
topic_name = input("Enter your topic name (e.g., john-topic): ").strip()

print(f"\n📥 Starting consumer for topic: {topic_name}")
print("⏳ Waiting for messages... (Press Ctrl+C to stop)\n")

# Create Kafka Consumer
consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=os.getenv('KAFKA_API_KEY'),
    sasl_plain_password=os.getenv('KAFKA_API_SECRET'),
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',  # Start from beginning
    group_id=f'{topic_name}-consumer-group'
)

print("✅ Consumer connected!\n")

message_count = 0
try:
    for message in consumer:
        message_count += 1
        msg_value = message.value

        print(f"📨 Message #{message_count}")
        print(f"   Text: {msg_value.get('text', 'N/A')}")
        print(f"   Timestamp: {msg_value.get('timestamp', 'N/A')}")
        print(f"   Message ID: {msg_value.get('message_id', 'N/A')}")
        print(f"   Partition: {message.partition}")
        print(f"   Offset: {message.offset}")
        print()

except KeyboardInterrupt:
    print("\n⚠️  Interrupted by user")

finally:
    consumer.close()
    print(f"\n📊 Total messages consumed: {message_count}")
    print("✅ Consumer closed")
