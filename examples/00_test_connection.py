#!/usr/bin/env python3
"""
Quick Test - Verify Kafka Connection
This simple script tests that you can connect to Kafka successfully.
"""

from kafka import KafkaAdminClient
from dotenv import load_dotenv
import os

# Load credentials
load_dotenv()

# Connect to Kafka
admin = KafkaAdminClient(
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=os.getenv('KAFKA_API_KEY'),
    sasl_plain_password=os.getenv('KAFKA_API_SECRET')
)

print("✅ Connected to Kafka!")
admin.close()
