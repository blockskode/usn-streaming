#!/usr/bin/env python3
"""
Produce Messages to Your Topic
This script sends messages to your personal topic.
"""

import os
import json
from datetime import datetime
from kafka import KafkaProducer
from dotenv import load_dotenv

# Load credentials
load_dotenv()

# Get your topic name
topic_name = input("Enter your topic name (e.g., john-topic): ").strip()

print(f"\n📤 Starting producer for topic: {topic_name}")

# Create Kafka Producer
producer = KafkaProducer(
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=os.getenv('KAFKA_API_KEY'),
    sasl_plain_password=os.getenv('KAFKA_API_SECRET'),
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

print("✅ Producer connected!")
print("\n💬 Type messages to send (or 'quit' to exit):\n")

message_count = 0
try:
    while True:
        user_input = input("Message: ").strip()

        if user_input.lower() == 'quit':
            break

        if not user_input:
            continue

        # Create message with timestamp
        message = {
            'text': user_input,
            'timestamp': datetime.now().isoformat(),
            'message_id': message_count + 1
        }

        # Send message
        producer.send(topic_name, value=message)
        producer.flush()

        message_count += 1
        print(f"✅ Sent message #{message_count}")

except KeyboardInterrupt:
    print("\n\n⚠️  Interrupted by user")

finally:
    producer.close()
    print(f"\n📊 Total messages sent: {message_count}")
    print("✅ Producer closed")
