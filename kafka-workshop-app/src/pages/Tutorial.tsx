import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Storage,
  ViewModule,
  CloudQueue,
  Group,
  Router,
  PlayCircleOutline,
  Timeline,
  DataObject,
  Code,
  Speed,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';
import { Header } from '../components/layout/Header';

const drawerWidth = 280;

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'kafka' | 'databricks' | 'code';
}

const sections: Section[] = [
  { id: 'kafka-intro', title: 'What is Apache Kafka?', icon: <Storage />, category: 'kafka' },
  { id: 'topics', title: 'Topics & Partitions', icon: <ViewModule />, category: 'kafka' },
  { id: 'producers', title: 'Producers', icon: <CloudQueue />, category: 'kafka' },
  { id: 'consumers', title: 'Consumers & Groups', icon: <Group />, category: 'kafka' },
  { id: 'brokers', title: 'Brokers & Clusters', icon: <Router />, category: 'kafka' },
  { id: 'databricks-intro', title: 'What is Databricks?', icon: <PlayCircleOutline />, category: 'databricks' },
  { id: 'structured-streaming', title: 'Structured Streaming', icon: <Timeline />, category: 'databricks' },
  { id: 'delta-lake', title: 'Delta Lake', icon: <DataObject />, category: 'databricks' },
  { id: 'code-python', title: 'Python Consumer', icon: <Code />, category: 'code' },
  { id: 'code-databricks', title: 'Databricks Streaming', icon: <Speed />, category: 'code' },
];

export const Tutorial: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('kafka-intro');

  const scrollToSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              top: '64px',
              height: 'calc(100vh - 64px)',
              bgcolor: '#2c5aa0',
              color: 'white',
              borderRight: 'none',
            },
          }}
        >
          <Box sx={{ overflow: 'auto', pt: 3, px: 2 }}>
            <Typography variant="overline" sx={{ color: '#ffeb99', fontWeight: 'bold', display: 'block', mb: 2 }}>
              Apache Kafka
            </Typography>
            <List dense>
              {sections.filter(s => s.category === 'kafka').map((section) => (
                <ListItem key={section.id} disablePadding>
                  <ListItemButton
                    selected={selectedSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      color: '#e6f7ff',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderLeft: '4px solid #ffeb99',
                        color: 'white',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{section.icon}</ListItemIcon>
                    <ListItemText primary={section.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

            <Typography variant="overline" sx={{ color: '#ffeb99', fontWeight: 'bold', display: 'block', mb: 2 }}>
              Databricks
            </Typography>
            <List dense>
              {sections.filter(s => s.category === 'databricks').map((section) => (
                <ListItem key={section.id} disablePadding>
                  <ListItemButton
                    selected={selectedSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      color: '#e6f7ff',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderLeft: '4px solid #ffeb99',
                        color: 'white',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{section.icon}</ListItemIcon>
                    <ListItemText primary={section.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

            <Typography variant="overline" sx={{ color: '#ffeb99', fontWeight: 'bold', display: 'block', mb: 2 }}>
              Code Examples
            </Typography>
            <List dense>
              {sections.filter(s => s.category === 'code').map((section) => (
                <ListItem key={section.id} disablePadding>
                  <ListItemButton
                    selected={selectedSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      color: '#e6f7ff',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderLeft: '4px solid #ffeb99',
                        color: 'white',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{section.icon}</ListItemIcon>
                    <ListItemText primary={section.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#fafafa',
            p: 4,
            fontFamily: "'Palatino', 'Georgia', serif",
            lineHeight: 1.8,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                color: '#1a365d',
                borderBottom: '4px solid #2c5aa0',
                pb: 2,
                textAlign: 'center',
                mb: 1,
                fontFamily: "'Palatino', 'Georgia', serif",
              }}
            >
              Kafka & Databricks Tutorial
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 6, fontStyle: 'italic' }}>
              Learn by doing - practical examples you can run right now
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* ==================== WHAT IS KAFKA ==================== */}
            <Paper id="kafka-intro" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
              <Box
                sx={{
                  bgcolor: '#FF6B35',
                  color: 'white',
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Storage sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    What is Apache Kafka?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                    A messaging system for moving data between systems in real-time
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                The Problem It Solves
              </Typography>

              <Typography variant="body1" paragraph>
                Imagine you have an e-commerce website. When a user buys a product, you need to:
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
                <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: 20 }}>
                  <li>Update inventory in the database</li>
                  <li>Send confirmation email</li>
                  <li>Notify warehouse to ship</li>
                  <li>Update analytics dashboard</li>
                  <li>Send push notification to mobile app</li>
                </ul>
              </Box>

              <Typography variant="body1" paragraph>
                <strong>Without Kafka:</strong> Each system connects directly to others = messy and hard to maintain.<br/>
                <strong>With Kafka:</strong> All systems send/receive messages through Kafka = clean and scalable.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Real-World Example
              </Typography>

              <Typography variant="body1" paragraph>
                <strong>Imagine you're Uber.</strong> Every second, thousands of rides are happening:
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, mb: 3, borderLeft: '4px solid #FF6B35' }}>
                <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                  📍 A rider requests a ride in New York → The app needs to:
                </Typography>
                <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: 20 }}>
                  <li>Find nearby drivers and update their apps in real-time</li>
                  <li>Calculate and update pricing based on demand</li>
                  <li>Send notifications to the rider's phone</li>
                  <li>Update the live map showing driver location</li>
                  <li>Log the event for fraud detection systems</li>
                  <li>Update analytics dashboards for city managers</li>
                  <li>Store the ride data for billing at the end</li>
                </ul>
              </Box>

              <Typography variant="body1" paragraph>
                <strong>The Challenge:</strong> All of this must happen in milliseconds, for millions of rides simultaneously, 24/7. If one system goes down (like the email service), it shouldn't stop the ride from happening.
              </Typography>

              <Typography variant="body1" paragraph>
                <strong>Kafka's Solution:</strong> When a rider requests a ride, that event goes into Kafka. Every system that needs to know about it (pricing, notifications, maps, analytics) reads from Kafka independently. If the email system is down, the ride still happens - the email will be sent when the system comes back up.
              </Typography>

              <Alert severity="success" sx={{ mt: 3, mb: 3 }}>
                <strong>💡 This is why companies like Uber, Netflix, LinkedIn, and Airbnb use Kafka</strong> - they need to handle millions of real-time events reliably, even when some systems fail.
              </Alert>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Quick Example - Connecting to Kafka
              </Typography>

              <Typography variant="body2" paragraph>
                Here's how to connect to our Kafka cluster and list available topics:
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 2, fontFamily: 'Courier, monospace', fontSize: '0.9rem', overflowX: 'auto', position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 8, color: '#888', bgcolor: '#2d2d2d', px: 1, py: 0.5, borderRadius: 1 }}>
                  Python
                </Typography>
                <pre style={{ margin: 0 }}>{`from kafka import KafkaAdminClient

# Connect to Confluent Cloud Kafka
admin = KafkaAdminClient(
    bootstrap_servers='pkc-619z3.us-east1.gcp.confluent.cloud:9092',
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='YOUR_API_KEY',
    sasl_plain_password='YOUR_API_SECRET'
)

# List all topics
topics = admin.list_topics()
print("Available topics:", topics)

# Output: ['ecommerce-events', 'iot-sensors', 'social-media', ...]`}</pre>
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>💡 Try it yourself:</strong> Replace YOUR_API_KEY and YOUR_API_SECRET with credentials from the Resources page, then run this code!
              </Alert>
            </Paper>

            {/* ==================== TOPICS ==================== */}
            <Paper id="topics" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
              <Box
                sx={{
                  bgcolor: '#4CAF50',
                  color: 'white',
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ViewModule sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    1. Topics
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                    Categories where messages are stored
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                What is a Topic?
              </Typography>

              <Typography variant="body1" paragraph>
                Think of a topic like a folder or category. All messages about the same thing go into the same topic.
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" component="div">
                  <strong>Examples:</strong>
                  <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                    <li><code>user-registrations</code> - All new user signups</li>
                    <li><code>order-events</code> - Every purchase made</li>
                    <li><code>sensor-data</code> - IoT device readings</li>
                  </ul>
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Code Example - Create and Use a Topic
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 2, fontFamily: 'Courier, monospace', fontSize: '0.9rem', overflowX: 'auto', position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 8, color: '#888', bgcolor: '#2d2d2d', px: 1, py: 0.5, borderRadius: 1 }}>
                  Python
                </Typography>
                <pre style={{ margin: 0 }}>{`from kafka.admin import KafkaAdminClient, NewTopic

admin = KafkaAdminClient(
    bootstrap_servers='pkc-619z3.us-east1.gcp.confluent.cloud:9092',
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='YOUR_API_KEY',
    sasl_plain_password='YOUR_API_SECRET'
)

# Create a new topic
topic = NewTopic(
    name='my-first-topic',
    num_partitions=3,      # Split data across 3 partitions for parallel processing
    replication_factor=3   # Keep 3 copies for safety
)

admin.create_topics([topic])
print("✅ Topic 'my-first-topic' created!")

# List all topics
print("All topics:", admin.list_topics())`}</pre>
              </Box>

              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>📝 Key Point:</strong> Topics are automatically created when you send your first message, but it's better to create them manually with the right settings.
              </Alert>
            </Paper>

            {/* ==================== PRODUCERS ==================== */}
            <Paper id="producers" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
              <Box
                sx={{
                  bgcolor: '#2196F3',
                  color: 'white',
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CloudQueue sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    2. Producers
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                    Applications that send messages to Kafka
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                What is a Producer?
              </Typography>

              <Typography variant="body1" paragraph>
                A producer is any application that sends data (messages) to Kafka topics. Think of it as the "sender" or "writer".
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" component="div">
                  <strong>Examples:</strong>
                  <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                    <li>A web server sending user clicks to Kafka</li>
                    <li>An IoT device sending sensor readings every minute</li>
                    <li>A payment system sending transaction events</li>
                  </ul>
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Code Example - Send Messages to Kafka
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 2, fontFamily: 'Courier, monospace', fontSize: '0.9rem', overflowX: 'auto', position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 8, color: '#888', bgcolor: '#2d2d2d', px: 1, py: 0.5, borderRadius: 1 }}>
                  Python
                </Typography>
                <pre style={{ margin: 0 }}>{`from kafka import KafkaProducer
import json
from datetime import datetime

# Create a producer
producer = KafkaProducer(
    bootstrap_servers='pkc-619z3.us-east1.gcp.confluent.cloud:9092',
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='YOUR_API_KEY',
    sasl_plain_password='YOUR_API_SECRET',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')  # Convert to JSON
)

# Send a message
message = {
    'user_id': 'user_123',
    'action': 'purchase',
    'product': 'Laptop',
    'price': 999.99,
    'timestamp': datetime.now().isoformat()
}

future = producer.send('ecommerce-events', value=message)

# Wait for confirmation
result = future.get(timeout=10)
print(f"✅ Message sent to partition {result.partition} at offset {result.offset}")

# Always close the producer when done
producer.close()`}</pre>
              </Box>

              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>📝 Key Point:</strong> Producers decide which topic to send to. You can send messages as fast as your application generates them - Kafka handles the storage and delivery to consumers!
              </Alert>
            </Paper>

            {/* ==================== CONSUMERS ==================== */}
            <Paper id="consumers" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
              <Box
                sx={{
                  bgcolor: '#9C27B0',
                  color: 'white',
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Group sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    3. Consumers
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                    Applications that read messages from Kafka
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                What is a Consumer?
              </Typography>

              <Typography variant="body1" paragraph>
                A consumer is any application that reads data (messages) from Kafka topics. Think of it as the "receiver" or "reader".
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" component="div">
                  <strong>Examples:</strong>
                  <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                    <li>An email service reading user signup events to send welcome emails</li>
                    <li>A dashboard reading sales data to update charts in real-time</li>
                    <li>An analytics system reading all events to compute statistics</li>
                  </ul>
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Code Example - Read Messages from Kafka
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 2, fontFamily: 'Courier, monospace', fontSize: '0.9rem', overflowX: 'auto', position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 8, color: '#888', bgcolor: '#2d2d2d', px: 1, py: 0.5, borderRadius: 1 }}>
                  Python
                </Typography>
                <pre style={{ margin: 0 }}>{`from kafka import KafkaConsumer
import json

# Create a consumer
consumer = KafkaConsumer(
    'ecommerce-events',  # Topic to read from
    bootstrap_servers='pkc-619z3.us-east1.gcp.confluent.cloud:9092',
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='YOUR_API_KEY',
    sasl_plain_password='YOUR_API_SECRET',
    group_id='my-consumer-group',  # Group ID - important for scaling!
    auto_offset_reset='earliest',  # Start from beginning if no previous position
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

# Read messages (this runs forever)
print("🎧 Listening for messages...")
for message in consumer:
    data = message.value
    print(f"📩 Received: User {data['user_id']} did {data['action']}")

    # Do something with the message
    if data['action'] == 'purchase':
        print(f"   💰 Purchase: {data['product']} for ${'$'}{data['price']}")`}</pre>
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>📝 Key Point:</strong> Multiple consumers with the same <code>group_id</code> automatically share the work! If one crashes, others take over. This makes your application reliable and scalable.
              </Alert>
            </Paper>

            {/* ==================== BROKERS ==================== */}
            <Paper id="brokers" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
              <Box
                sx={{
                  bgcolor: '#FF9800',
                  color: 'white',
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Router sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    4. Brokers
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                    The servers that store and manage Kafka data
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                What is a Broker?
              </Typography>

              <Typography variant="body1" paragraph>
                A broker is a Kafka server that stores messages and handles requests from producers and consumers. Think of it as the "storage and management system".
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" component="div">
                  <strong>Why Multiple Brokers?</strong>
                  <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                    <li><strong>Redundancy:</strong> If one broker fails, others keep working</li>
                    <li><strong>Scale:</strong> More brokers = more storage and throughput</li>
                    <li><strong>Reliability:</strong> Data is copied across multiple brokers</li>
                  </ul>
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                In this workshop, we're using <strong>Confluent Cloud</strong>, which manages the brokers for you! You don't need to worry about setting them up.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Quick Example - Check Broker Connection
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 2, fontFamily: 'Courier, monospace', fontSize: '0.9rem', overflowX: 'auto', position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: 8, right: 8, color: '#888', bgcolor: '#2d2d2d', px: 1, py: 0.5, borderRadius: 1 }}>
                  Python
                </Typography>
                <pre style={{ margin: 0 }}>{`from kafka import KafkaAdminClient

# Connect to broker
admin = KafkaAdminClient(
    bootstrap_servers='pkc-619z3.us-east1.gcp.confluent.cloud:9092',
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username='YOUR_API_KEY',
    sasl_plain_password='YOUR_API_SECRET'
)

# Check connection
try:
    topics = admin.list_topics()
    print(f"✅ Connected! Found {len(topics)} topics")
    print(f"Topics: {topics}")
except Exception as e:
    print(f"❌ Connection failed: {e}")

admin.close()`}</pre>
              </Box>

              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>📝 Key Point:</strong> With managed Kafka (like Confluent Cloud), you don't manage brokers directly. Just connect and start producing/consuming messages!
              </Alert>
            </Paper>

            {/* ==================== DATABRICKS INTRO ==================== */}
            <Paper id="databricks-intro" sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PlayCircleOutline sx={{ fontSize: 40, mr: 2, color: '#FF6B35' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#2c5aa0' }}>
                    What is Databricks?
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Unified analytics platform for big data and AI
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
                <strong>Databricks</strong> is a cloud-based unified data analytics platform built on Apache Spark. Founded by the creators of Spark, it provides enterprise-grade data engineering, collaborative data science, and production ML capabilities. When integrated with Kafka, Databricks enables real-time stream processing, ETL pipelines, and analytics at scale.
              </Typography>

              <Alert severity="info" icon={<TrendingUp />} sx={{ my: 3 }}>
                <strong>🌐 Industry adoption:</strong> Over 10,000+ organizations including Comcast, Shell, H&M, and Regeneron use Databricks to process exabytes of data monthly, powering everything from real-time fraud detection to genomic research.
              </Alert>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Core Components
              </Typography>

              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #4CAF50' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        ⚡ Apache Spark Engine
                      </Typography>
                      <Typography variant="body2">
                        Optimized Spark runtime with performance improvements (Photon engine for 12x faster queries), auto-scaling clusters, and intelligent caching. Supports batch and streaming workloads with unified API.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #2196F3' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        💾 Delta Lake
                      </Typography>
                      <Typography variant="body2">
                        ACID transactions on data lakes. Combines reliability of data warehouses with scalability/flexibility of data lakes. Supports time travel, schema evolution, and upserts (MERGE operations).
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #9C27B0' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        📓 Collaborative Notebooks
                      </Typography>
                      <Typography variant="body2">
                        Interactive notebooks supporting Python, SQL, Scala, and R. Real-time collaboration, version control integration, and native visualization libraries. Schedule notebooks as production jobs.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #FF6B35' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        🤖 MLflow Integration
                      </Typography>
                      <Typography variant="body2">
                        End-to-end ML lifecycle management. Track experiments, package models, deploy to production with model registry, and monitor performance. Native integration with Spark ML and popular frameworks.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Databricks + Kafka: The Modern Data Stack
              </Typography>

              <Typography variant="body1" paragraph>
                Kafka and Databricks form a powerful combination for real-time data pipelines:
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, my: 2 }}>
                <Typography variant="body2" component="div">
                  <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
                    <li><strong>Streaming ETL:</strong> Kafka ingests raw events, Databricks transforms and writes to Delta Lake</li>
                    <li><strong>Real-time Analytics:</strong> Kafka streams operational data, Databricks aggregates with SQL for dashboards</li>
                    <li><strong>ML Feature Engineering:</strong> Kafka streams feature updates, Databricks computes and stores features</li>
                    <li><strong>Change Data Capture:</strong> Kafka streams database changes, Databricks replicates to Delta Lake</li>
                  </ul>
                </Typography>
              </Box>
            </Paper>

            {/* ==================== STRUCTURED STREAMING ==================== */}
            <Paper id="structured-streaming" sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Timeline sx={{ fontSize: 40, mr: 2, color: '#FF6B35' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#2c5aa0' }}>
                    Structured Streaming
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time stream processing on Databricks
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
                <strong>Structured Streaming</strong> is Spark's stream processing engine built on the Spark SQL API. It treats streaming data as an unbounded table that continuously grows—queries against this table run continuously, producing results to an output sink. This abstraction makes streaming code nearly identical to batch code.
              </Typography>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Core Concepts
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, my: 2 }}>
                <Typography variant="body2" component="div">
                  <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
                    <li><strong>Input Source:</strong> Where data originates - <code>spark.readStream.format("kafka")</code></li>
                    <li><strong>Transformation:</strong> Standard DataFrame operations - <code>df.groupBy("user_id").count()</code></li>
                    <li><strong>Output Sink:</strong> Destination for processed data - <code>.writeStream.format("delta")</code></li>
                    <li><strong>Trigger:</strong> When to process micro-batches - <code>.trigger(processingTime="10 seconds")</code></li>
                    <li><strong>Checkpointing:</strong> Fault-tolerance via write-ahead log - <code>.option("checkpointLocation", "/path")</code></li>
                  </ul>
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Output Modes
              </Typography>

              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #4CAF50' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Append Mode
                      </Typography>
                      <Typography variant="body2">
                        Only new rows added since last trigger are written. Default for most operations. Use for immutable events.
                      </Typography>
                      <Box component="code" sx={{ fontSize: '0.7rem', display: 'block', mt: 1 }}>
                        .outputMode("append")
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #2196F3' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Complete Mode
                      </Typography>
                      <Typography variant="body2">
                        Entire result table written every trigger. Required for aggregations without watermark. High overhead.
                      </Typography>
                      <Box component="code" sx={{ fontSize: '0.7rem', display: 'block', mt: 1 }}>
                        .outputMode("complete")
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #9C27B0' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Update Mode
                      </Typography>
                      <Typography variant="body2">
                        Only rows updated since last trigger. Use with aggregations + watermark for efficient stateful processing.
                      </Typography>
                      <Box component="code" sx={{ fontSize: '0.7rem', display: 'block', mt: 1 }}>
                        .outputMode("update")
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Watermarking for Late Data
              </Typography>

              <Typography variant="body2" paragraph>
                Streaming systems must handle late-arriving data (events with timestamps earlier than expected). <strong>Watermarks</strong> define how long to wait for late data before finalizing aggregations:
              </Typography>

              <Alert severity="info" sx={{ my: 2 }}>
                <strong>📘 Watermark example:</strong> With <code>withWatermark("timestamp", "10 minutes")</code>, Spark waits up to 10 minutes past event time before dropping late data. If current max event time is 12:00, events with timestamps before 11:50 are dropped.
              </Alert>

              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                <strong>Tradeoff:</strong> Longer watermarks increase state size and latency but capture more late data. Shorter watermarks reduce memory/latency but may drop valid events.
              </Typography>
            </Paper>

            {/* ==================== DELTA LAKE ==================== */}
            <Paper id="delta-lake" sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DataObject sx={{ fontSize: 40, mr: 2, color: '#FF6B35' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#2c5aa0' }}>
                    Delta Lake
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ACID transactions and reliability for data lakes
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
                <strong>Delta Lake</strong> is an open-source storage layer that brings ACID transactions to Apache Spark and big data workloads. It runs on top of existing data lakes (S3, ADLS, HDFS) and provides reliability features previously only available in data warehouses.
              </Typography>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Key Features
              </Typography>

              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #4CAF50' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        ✅ ACID Transactions
                      </Typography>
                      <Typography variant="body2">
                        Serializable isolation ensures concurrent reads/writes don't corrupt data. Transaction log records all operations. Failed writes automatically roll back—no partial/corrupted files.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #2196F3' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        🕒 Time Travel
                      </Typography>
                      <Typography variant="body2">
                        Query previous versions of data using <code>@v123</code> or <code>timestamp as of '2024-01-15'</code>. Audit data changes, reproduce ML model training, or recover from mistakes.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #9C27B0' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        📝 Schema Evolution
                      </Typography>
                      <Typography variant="body2">
                        Automatically handle schema changes (add columns, rename fields). <code>mergeSchema</code> option allows writes with new columns without manual DDL. Protects against incompatible changes.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #FF6B35' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        🔄 Upserts (MERGE)
                      </Typography>
                      <Typography variant="body2">
                        Efficiently update, insert, and delete with single MERGE command. Critical for CDC pipelines and slowly changing dimensions. 10-100x faster than read-modify-write pattern.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Performance Optimizations
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, my: 2 }}>
                <Typography variant="body2" component="div">
                  <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
                    <li><strong>Data Skipping:</strong> Automatic - Skip entire files during queries based on filters</li>
                    <li><strong>Z-Ordering:</strong> <code>OPTIMIZE table ZORDER BY (col1, col2)</code> - 10-100x faster queries</li>
                    <li><strong>Compaction:</strong> <code>OPTIMIZE table</code> - Merge small files for better performance</li>
                    <li><strong>Vacuum:</strong> <code>VACUUM table RETAIN 168 HOURS</code> - Reclaim storage (keeps 7 days for time travel)</li>
                  </ul>
                </Typography>
              </Box>

              <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 3 }}>
                <strong>💡 Delta Lake best practices:</strong> (1) Partition by low-cardinality columns (date, region); (2) Run OPTIMIZE weekly for streaming tables; (3) Use MERGE for CDC instead of overwrite; (4) Enable auto-compaction with <code>delta.autoOptimize.optimizeWrite=true</code>.
              </Alert>
            </Paper>

            {/* ==================== PYTHON CONSUMER CODE ==================== */}
            <Paper id="code-python" sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Code sx={{ fontSize: 40, mr: 2, color: '#FF6B35' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#2c5aa0' }}>
                    Python Consumer Example
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Production-ready Kafka consumer with manual offset commits
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                Below is a complete Python consumer using <code>kafka-python</code> library with best practices for production deployments:
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 1, fontFamily: 'Courier, monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}>{`from kafka import KafkaConsumer
import json
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_consumer() -> KafkaConsumer:
    """Create and configure Kafka consumer with production settings."""
    return KafkaConsumer(
        'ecommerce-events',  # Topic name
        bootstrap_servers=['pkc-619z3.us-east1.gcp.confluent.cloud:9092'],
        group_id='python-analytics-group',

        # Security configuration (Confluent Cloud)
        security_protocol='SASL_SSL',
        sasl_mechanism='PLAIN',
        sasl_plain_username='YOUR_API_KEY',
        sasl_plain_password='YOUR_API_SECRET',

        # Deserialization
        value_deserializer=lambda m: json.loads(m.decode('utf-8')),
        key_deserializer=lambda m: m.decode('utf-8') if m else None,

        # Consumer configuration
        auto_offset_reset='earliest',  # Start from beginning if no offset
        enable_auto_commit=False,      # Manual commit for at-least-once
        max_poll_records=500,           # Batch size per poll
        session_timeout_ms=45000,       # 45s before considered dead
        max_poll_interval_ms=300000,    # 5 min max processing time

        # Performance tuning
        fetch_min_bytes=1024,           # Wait for 1KB before returning
        fetch_max_wait_ms=500,          # Or wait max 500ms
    )

def process_message(message: Dict[str, Any]) -> bool:
    """
    Process individual message. Return True on success, False on failure.

    In production, this might:
    - Write to database
    - Call external API
    - Update cache
    - Trigger alerts
    """
    try:
        logger.info(f"Processing event: {message.get('event_id')}")

        # Example: Track user activity
        user_id = message.get('user_id')
        action = message.get('action')
        product = message.get('product', {})

        logger.info(
            f"User {user_id} performed {action} on "
            f"{product.get('name')} (${'$'}{product.get('price')})"
        )

        # Simulate processing (replace with actual business logic)
        # db.insert_event(message)
        # cache.update_user_activity(user_id, action)

        return True
    except Exception as e:
        logger.error(f"Error processing message: {e}", exc_info=True)
        return False

def main():
    """Main consumer loop with error handling and graceful shutdown."""
    consumer = create_consumer()
    logger.info("Consumer started, waiting for messages...")

    try:
        batch_count = 0
        success_count = 0
        failure_count = 0

        for message in consumer:
            # Process message
            success = process_message(message.value)

            if success:
                success_count += 1
            else:
                failure_count += 1

            batch_count += 1

            # Commit offsets every 100 messages
            if batch_count >= 100:
                try:
                    consumer.commit()
                    logger.info(
                        f"Committed offsets. Processed: {success_count} success, "
                        f"{failure_count} failures"
                    )
                    batch_count = 0
                except Exception as e:
                    logger.error(f"Commit failed: {e}")

    except KeyboardInterrupt:
        logger.info("Shutdown signal received")
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
    finally:
        # Graceful shutdown
        consumer.commit()  # Commit final batch
        consumer.close()
        logger.info(
            f"Consumer closed. Total: {success_count} success, "
            f"{failure_count} failures"
        )

if __name__ == "__main__":
    main()
`}</pre>
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>🔑 Key implementation details:</strong>
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                  <li><code>enable_auto_commit=False</code>: Manual commits provide at-least-once guarantee</li>
                  <li>Batch commits every 100 messages: Balance between safety and performance</li>
                  <li>Graceful shutdown: Final commit in <code>finally</code> block prevents message loss</li>
                  <li>Error handling: Log failures but continue processing (dead letter queue in production)</li>
                </ul>
              </Alert>
            </Paper>

            {/* ==================== DATABRICKS STREAMING CODE ==================== */}
            <Paper id="code-databricks" sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Speed sx={{ fontSize: 40, mr: 2, color: '#FF6B35' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#2c5aa0' }}>
                    Databricks Streaming Code
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PySpark Structured Streaming with Delta Lake
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                Complete example of reading from Kafka, transforming data, and writing to Delta Lake with watermarking and aggregations:
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 1, fontFamily: 'Courier, monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}>{`from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, from_json, window, count, sum as spark_sum, avg, current_timestamp
)
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType

# Initialize Spark session (automatically configured on Databricks)
spark = SparkSession.builder \\
    .appName("KafkaStreamingToDeltalake") \\
    .getOrCreate()

# Define schema for incoming JSON data
event_schema = StructType([
    StructField("event_id", StringType(), True),
    StructField("timestamp", TimestampType(), True),
    StructField("user_id", StringType(), True),
    StructField("action", StringType(), True),
    StructField("product", StructType([
        StructField("id", StringType(), True),
        StructField("name", StringType(), True),
        StructField("price", DoubleType(), True),
        StructField("category", StringType(), True),
    ]), True),
    StructField("session_id", StringType(), True),
])

# Read from Kafka (streaming DataFrame)
kafka_df = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "pkc-619z3.us-east1.gcp.confluent.cloud:9092") \\
    .option("subscribe", "ecommerce-events") \\
    .option("startingOffsets", "latest") \\
    .option("kafka.security.protocol", "SASL_SSL") \\
    .option("kafka.sasl.mechanism", "PLAIN") \\
    .option("kafka.sasl.jaas.config",
        f'org.apache.kafka.common.security.plain.PlainLoginModule required '
        f'username="YOUR_API_KEY" password="YOUR_API_SECRET";') \\
    .load()

# Parse JSON and extract fields
parsed_df = kafka_df \\
    .selectExpr("CAST(value AS STRING) as json_value") \\
    .select(from_json(col("json_value"), event_schema).alias("data")) \\
    .select("data.*") \\
    .select(
        col("event_id"),
        col("timestamp"),
        col("user_id"),
        col("action"),
        col("product.id").alias("product_id"),
        col("product.name").alias("product_name"),
        col("product.price").alias("product_price"),
        col("product.category").alias("product_category"),
        col("session_id")
    )

# ==== STREAM 1: Raw events to Delta Lake (bronze layer) ====
raw_query = parsed_df \\
    .withColumn("ingestion_time", current_timestamp()) \\
    .writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "/mnt/delta/checkpoints/raw_events") \\
    .option("mergeSchema", "true") \\
    .trigger(processingTime="30 seconds") \\
    .table("ecommerce_raw_events")

# ==== STREAM 2: Aggregated metrics (silver layer) ====
# Aggregate purchases by product with 5-minute tumbling windows
aggregated_df = parsed_df \\
    .filter(col("action") == "purchase") \\
    .withWatermark("timestamp", "10 minutes") \\
    .groupBy(
        window(col("timestamp"), "5 minutes"),
        col("product_id"),
        col("product_name"),
        col("product_category")
    ) \\
    .agg(
        count("*").alias("purchase_count"),
        spark_sum("product_price").alias("total_revenue"),
        avg("product_price").alias("avg_price")
    ) \\
    .select(
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("product_id"),
        col("product_name"),
        col("product_category"),
        col("purchase_count"),
        col("total_revenue"),
        col("avg_price")
    )

aggregated_query = aggregated_df \\
    .writeStream \\
    .format("delta") \\
    .outputMode("update") \\
    .option("checkpointLocation", "/mnt/delta/checkpoints/aggregated_metrics") \\
    .trigger(processingTime="1 minute") \\
    .table("ecommerce_product_metrics")

# ==== STREAM 3: Real-time alerts (filter high-value purchases) ====
high_value_purchases = parsed_df \\
    .filter((col("action") == "purchase") & (col("product_price") > 500)) \\
    .select(
        col("timestamp"),
        col("user_id"),
        col("product_name"),
        col("product_price")
    )

alert_query = high_value_purchases \\
    .writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "/mnt/delta/checkpoints/high_value_alerts") \\
    .trigger(processingTime="10 seconds") \\
    .table("ecommerce_high_value_purchases")

# Monitor stream status
print("✅ Streaming queries started")
print(f"Raw events: {raw_query.id}")
print(f"Aggregated metrics: {aggregated_query.id}")
print(f"High-value alerts: {alert_query.id}")

# Keep streams running (Databricks notebooks)
# In production, use .awaitTermination() or schedule as job
spark.streams.awaitAnyTermination()
`}</pre>
              </Box>

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Query Delta Tables
              </Typography>

              <Typography variant="body2" paragraph>
                Once streaming data lands in Delta Lake, query it with SQL:
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 3, borderRadius: 1, fontFamily: 'Courier, monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
                <pre style={{ margin: 0 }}>{`-- Real-time product performance (last hour)
SELECT
    product_name,
    SUM(purchase_count) as total_purchases,
    SUM(total_revenue) as revenue,
    AVG(avg_price) as avg_price
FROM ecommerce_product_metrics
WHERE window_start >= current_timestamp() - INTERVAL 1 HOUR
GROUP BY product_name
ORDER BY revenue DESC
LIMIT 10;

-- Time travel: Compare metrics from yesterday
SELECT * FROM ecommerce_product_metrics
TIMESTAMP AS OF '2024-01-14 00:00:00';

-- Audit trail: All high-value purchases today
SELECT
    timestamp,
    user_id,
    product_name,
    product_price
FROM ecommerce_high_value_purchases
WHERE DATE(timestamp) = CURRENT_DATE()
ORDER BY product_price DESC;
`}</pre>
              </Box>

              <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 3 }}>
                <strong>💡 Production recommendations:</strong> (1) Separate bronze (raw), silver (cleaned), and gold (aggregated) layers; (2) Use Delta Lake's MERGE for CDC instead of append; (3) Run OPTIMIZE on streaming tables weekly; (4) Monitor lag with <code>spark.streams.awaitAnyTermination()</code> metrics; (5) Set appropriate watermarks based on data lateness patterns.
              </Alert>
            </Paper>

          </Container>
        </Box>
      </Box>
    </>
  );
};
