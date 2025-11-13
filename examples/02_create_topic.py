#!/usr/bin/env python3
"""
Create Your Own Topic
This script creates a topic with your name for testing.
"""

import os
from kafka.admin import KafkaAdminClient, NewTopic
from dotenv import load_dotenv

# Load credentials
load_dotenv()

# Get your name for the topic
your_name = input("Enter your name (no spaces): ").strip().lower()
topic_name = f"{your_name}-topic"

print(f"\n🔨 Creating topic: {topic_name}")

# Connect to Kafka
admin = KafkaAdminClient(
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=os.getenv('KAFKA_API_KEY'),
    sasl_plain_password=os.getenv('KAFKA_API_SECRET')
)

# Create the topic
topic = NewTopic(
    name=topic_name,
    num_partitions=1,
    replication_factor=3
)

try:
    admin.create_topics([topic])
    print(f"✅ Successfully created topic: {topic_name}")
    print(f"   - Partitions: 1")
    print(f"   - Replication Factor: 3")
    print(f"\n💡 Remember your topic name: {topic_name}")
    print("   You'll use it in the producer and consumer examples!")
except Exception as e:
    if "TopicExistsException" in str(e):
        print(f"ℹ️  Topic {topic_name} already exists - you can use it!")
    else:
        print(f"❌ Error creating topic: {e}")

admin.close()
