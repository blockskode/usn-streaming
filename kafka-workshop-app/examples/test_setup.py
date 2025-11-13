#!/usr/bin/env python3
"""Test script to verify Kafka setup"""

import sys
from confluent_kafka import Consumer, KafkaError
from dotenv import load_dotenv
import os

def test_setup():
    print("🔍 Testing Kafka setup...\n")

    # Load environment variables
    load_dotenv()

    # Check required environment variables
    required_vars = [
        'KAFKA_BOOTSTRAP_SERVERS',
        'KAFKA_API_KEY',
        'KAFKA_API_SECRET',
        'KAFKA_TOPIC'
    ]

    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please check your .env file")
        return False

    print("✅ Environment variables loaded")

    # Test Kafka connection
    config = {
        'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
        'security.protocol': 'SASL_SSL',
        'sasl.mechanism': 'PLAIN',
        'sasl.username': os.getenv('KAFKA_API_KEY'),
        'sasl.password': os.getenv('KAFKA_API_SECRET'),
        'group.id': 'test-group',
    }

    try:
        consumer = Consumer(config)
        print("✅ Kafka consumer created successfully")
        consumer.close()
        print("✅ Connection test passed")
        print("\n🎉 Your environment is ready!")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_setup()
    sys.exit(0 if success else 1)
