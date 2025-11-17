import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  Code,
  Psychology,
} from '@mui/icons-material';
import { Header } from '../components/layout/Header';

interface Challenge {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  environment: 'VS Code' | 'Databricks';
  description: string;
  objectives: string[];
  hints: string[];
  aiPromptSuggestion: string;
  completed?: boolean;
}

export const Challenges: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  const challenges: Challenge[] = [
    {
      id: 1,
      title: 'Read Kafka Data and Save to CSV - Python',
      difficulty: 'Easy',
      environment: 'VS Code',
      description: 'Use Python kafka-python library to consume messages from the ecommerce-events topic and save them to a CSV file on your local computer. This challenge runs locally in VS Code, not in Databricks. ⚠️ IMPORTANT: Start the E-commerce Events generator in the Generators page before running this challenge!',
      objectives: [
        '🔴 FIRST: Go to Generators page and start the "E-commerce Events" generator to produce data',
        'Create a Python script on your local computer (in VS Code)',
        'Set up a Kafka consumer using kafka-python library (same as in the Kafka tutorial)',
        'Subscribe to topic: "ecommerce-events"',
        'Read 100 messages from the topic',
        'Parse the JSON messages and extract relevant fields',
        'Save the data to a CSV file locally with columns: event_id, timestamp, user_id, action, product_id, product_name, product_price, product_category',
      ],
      hints: [
        'This runs on your local computer, not in Databricks',
        'Topic name: "ecommerce-events"',
        'Use the KafkaConsumer from kafka-python library',
        'Set value_deserializer to json.loads to parse JSON automatically',
        'Use Python\'s csv module or pandas to write to CSV',
        'The CSV file will be saved in the same directory as your Python script',
        'Remember to close the consumer when done',
      ],
      aiPromptSuggestion: 'How do I use kafka-python to consume messages from a Kafka topic and save them to a CSV file on my local computer?',
    },
    {
      id: 2,
      title: 'Analyze Data with Pandas - Python',
      difficulty: 'Medium',
      environment: 'VS Code',
      description: 'Use pandas to analyze the CSV file you created in Challenge 1. Perform data analysis to gain insights from the e-commerce events.',
      objectives: [
        'Load the CSV file from Challenge 1 using pandas',
        'Filter data to show only "purchase" actions',
        'Calculate total revenue (sum of all purchase prices)',
        'Find the top 5 most purchased products (by count)',
        'Calculate average purchase price by product category',
        'Create a summary report showing: total purchases, total revenue, and average order value',
        'Save the analysis results to a new CSV file (e.g., "ecommerce_analysis.csv")',
      ],
      hints: [
        'Use pd.read_csv() to load your data',
        'Use df[df["action"] == "purchase"] to filter purchases',
        'Use df.groupby() for aggregations by product or category',
        'Use df["column"].sum(), .mean(), .value_counts() for calculations',
        'Use df.to_csv() to save your analysis results',
      ],
      aiPromptSuggestion: 'How do I use pandas to analyze CSV data, filter rows, calculate aggregations, and find top items?',
    },
    {
      id: 3,
      title: 'Visualize Data with Matplotlib - Python',
      difficulty: 'Medium',
      environment: 'VS Code',
      description: 'Create data visualizations from your CSV data using matplotlib or seaborn. Turn your analysis from Challenge 2 into compelling visual insights.',
      objectives: [
        'Load the CSV file from Challenge 1 using pandas',
        'Create a bar chart showing the top 5 most purchased products',
        'Create a pie chart showing revenue distribution by product category',
        'Create a bar chart comparing total revenue by product category',
        'Create a histogram showing the distribution of product prices',
        'Save all visualizations as PNG files in a "charts" folder',
        'Optional: Create a multi-panel figure combining all charts',
      ],
      hints: [
        'Install matplotlib and seaborn: pip install matplotlib seaborn',
        'Use plt.figure() and plt.savefig() to create and save charts',
        'Use df.groupby() with .sum() and .size() for aggregations',
        'Use plt.bar() for bar charts, plt.pie() for pie charts, plt.hist() for histograms',
        'Use plt.title(), plt.xlabel(), plt.ylabel() to label your charts',
        'Use os.makedirs("charts", exist_ok=True) to create the output folder',
      ],
      aiPromptSuggestion: 'How do I use matplotlib to create bar charts, pie charts, and histograms from pandas DataFrame data?',
    },
    {
      id: 4,
      title: 'Customer Behavior Analysis - Python',
      difficulty: 'Hard',
      environment: 'VS Code',
      description: 'Perform advanced customer behavior analysis using pandas. Analyze user activity patterns, calculate conversion rates, and identify customer segments.',
      objectives: [
        'Load the CSV file from Challenge 1',
        'Identify the top 10 most active users (by total event count)',
        'Calculate conversion rate: (purchases / total events) per user',
        'Analyze session behavior: count events per session_id',
        'Identify products frequently viewed together (products viewed by the same user)',
        'Find users who viewed products but did not purchase',
        'Create customer segments: "Window Shoppers" (views only), "Buyers" (made purchases), "VIP Buyers" (3+ purchases)',
        'Generate a comprehensive report with all insights and save to "customer_analysis.csv"',
      ],
      hints: [
        'Use df.groupby("user_id") to analyze per-user metrics',
        'Use df.pivot_table() for cross-tabulation analysis',
        'Filter by action type: df[df["action"] == "view"] vs df[df["action"] == "purchase"]',
        'Use pd.merge() to combine view and purchase data for conversion analysis',
        'Use df["user_id"].value_counts() to find most active users',
        'Create new columns for segments using df.apply() or np.where()',
      ],
      aiPromptSuggestion: 'How do I perform customer behavior analysis with pandas including conversion rates, user segmentation, and product co-occurrence analysis?',
    },
    {
      id: 5,
      title: 'Stream Kafka to Delta Lake - Databricks',
      difficulty: 'Medium',
      environment: 'Databricks',
      description: 'Create a complete streaming pipeline from Kafka to Delta Lake in Databricks. Follow the tutorial steps to read from ecommerce-events topic, parse JSON data, and write to a Delta table in Unity Catalog. ⚠️ IMPORTANT: Start the E-commerce Events generator in the Generators page before running this challenge!',
      objectives: [
        '🔴 FIRST: Go to Generators page and start the "E-commerce Events" generator to produce data',
        'Set up Kafka credentials in Databricks (bootstrap servers, SASL config)',
        'Test connection with a batch read to verify credentials work',
        'Set topic_name = "ecommerce-events" and create a streaming DataFrame using spark.readStream',
        'Define the ecommerce schema (event_id, timestamp, user_id, action, product nested structure, session_id)',
        'Parse and flatten the JSON data using from_json()',
        'Write the stream to a Delta table in Unity Catalog (kafka_catalog.kafka_schema.ecommerce_events_data)',
        'Use trigger(availableNow=True) for Community Edition compatibility',
        'Set up checkpoint location in Unity Catalog volume',
        'Verify the data landed in Unity Catalog by querying the table',
      ],
      hints: [
        '⚠️ Make sure E-commerce Events generator is running in the Generators page!',
        'Follow the exact steps from the Databricks tutorial section',
        'Topic name: topic_name = "ecommerce-events"',
        'Use the kafkashaded prefix for JAAS config: org.apache.kafka.common.security.plain.PlainLoginModule',
        'Remember to flatten nested product fields: product.id, product.name, product.price, product.category',
        'Checkpoint path format: /Volumes/kafka_catalog/kafka_schema/kafka_schema/checkpoints/{table_name}_checkpoint',
        'Use .table() instead of .start() to write directly to Unity Catalog',
        'Run query.awaitTermination() to wait for completion',
      ],
      aiPromptSuggestion: 'How do I set up Spark Structured Streaming from Kafka to Delta Lake in Databricks with Unity Catalog and checkpointing?',
    },
    {
      id: 6,
      title: 'Stream IoT Data with Auto-Schema - Databricks',
      difficulty: 'Medium',
      environment: 'Databricks',
      description: 'Use a universal approach to stream IoT sensor data from Kafka to Delta Lake. Automatically infer the schema and flatten nested structures without hardcoding field names. ⚠️ IMPORTANT: Start the IoT Sensors generator in the Generators page before running this challenge! 💡 STUCK? Check Tutorial → Code Examples → Example 2 for complete working code!',
      objectives: [
        '🔴 FIRST: Go to Generators page and start the "IoT Sensors" generator to produce data',
        '💡 If stuck, check Tutorial → Code Examples → Example 2: Universal Databricks Streaming',
        'Set topic_name = "iot-sensor-data" and read from this topic using the same Kafka credentials',
        'Use schema_of_json() to automatically infer the schema from sample data',
        'Implement a flatten function to automatically flatten nested structures (like location.lat → location_lat)',
        'Parse and transform the data dynamically',
        'Write the flattened stream to Delta table: kafka_catalog.kafka_schema.iot_sensor_data',
        'Use trigger(availableNow=True) for Community Edition',
        'Verify data in Unity Catalog with all columns properly flattened',
      ],
      hints: [
        '⚠️ Make sure IoT Sensors generator is running in the Generators page!',
        '💡 STUCK? Go to Tutorial → Code Examples → Example 2 for complete working code with step-by-step explanations!',
        '📋 The Code Examples section has a ready-to-use flatten_df() function you can copy and paste',
        'Topic name: topic_name = "iot-sensor-data"',
        'Use test_df.selectExpr("CAST(value AS STRING) as json").first() to get sample JSON',
        'Use from_pyspark.sql.functions import schema_of_json to infer schema',
        'Create a flatten_df() function that recursively handles nested StructType fields',
        'For nested fields like location.lat, create columns named location_lat',
        'Remember to include Kafka metadata: topic, partition, offset, kafka_timestamp',
      ],
      aiPromptSuggestion: 'How do I automatically infer JSON schema and flatten nested structures in PySpark for Kafka streaming?',
    },
    {
      id: 7,
      title: 'Stream Social Media with Auto-Schema - Databricks',
      difficulty: 'Medium',
      environment: 'Databricks',
      description: 'Apply the same universal schema approach to stream social media feed data. Build on Challenge 6 skills to handle a different topic structure automatically. ⚠️ IMPORTANT: Start the Social Media generator in the Generators page before running this challenge! 💡 STUCK? Check Tutorial → Code Examples → Example 2 for complete working code!',
      objectives: [
        '🔴 FIRST: Go to Generators page and start the "Social Media" generator to produce data',
        '💡 If stuck, check Tutorial → Code Examples → Example 2: Universal Databricks Streaming',
        'Set topic_name = "social-media-feed" and read from this topic using Kafka credentials',
        'Reuse or adapt your schema inference and flattening approach from Challenge 6',
        'Handle the social media schema automatically (no hardcoded field names)',
        'Write the stream to Delta table: kafka_catalog.kafka_schema.social_media_feed',
        'Use trigger(availableNow=True) for Community Edition',
        'Compare the resulting schema with IoT data - notice how the same code handles different structures',
        'Query both tables to see how universal code works across topics',
      ],
      hints: [
        '⚠️ Make sure Social Media generator is running in the Generators page!',
        '💡 STUCK? Go to Tutorial → Code Examples → Example 2 for complete working code with step-by-step explanations!',
        '📋 The Code Examples section has a ready-to-use flatten_df() function you can copy and paste',
        'Topic name: topic_name = "social-media-feed"',
        'You can copy and adapt your code from Challenge 6 - just change the topic_name and table name!',
        'Social media data has simpler structure (no nested objects like IoT location)',
        'The flatten function should work for both topics without modification',
        '📝 Note: Social media has a "topic" field (#sports, #tech) - the code handles naming conflicts automatically',
        'Verify both iot_sensor_data and social_media_feed tables exist in Unity Catalog',
      ],
      aiPromptSuggestion: 'How do I create reusable PySpark code that works with multiple Kafka topics with different schemas?',
    },
  ];

  const handleOpenChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleCloseChallenge = () => {
    setSelectedChallenge(null);
  };

  const handleMarkComplete = (id: number) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges([...completedChallenges, id]);
    }
    handleCloseChallenge();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      <Header />

      {/* Main Content */}
      <Container sx={{ pt: 12, pb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Progressive Coding Challenges
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Complete these challenges to master Kafka and Databricks streaming.
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          <strong>Tip:</strong> Start with Challenge 1 and work your way through. Each challenge builds on previous concepts.
        </Alert>

        <Grid container spacing={3}>
          {challenges.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);

            return (
              <Grid item xs={12} md={6} key={challenge.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: isCompleted ? 0.7 : 1,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleOpenChallenge(challenge)}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      {/* Challenge Number and Status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" color="text.secondary">
                          #{challenge.id}
                        </Typography>
                        {isCompleted ? (
                          <CheckCircle color="success" />
                        ) : (
                          <RadioButtonUnchecked color="action" />
                        )}
                      </Box>

                      {/* Title */}
                      <Typography variant="h6">{challenge.title}</Typography>

                      {/* Tags */}
                      <Stack direction="row" spacing={1}>
                        <Chip label={challenge.difficulty} color={getDifficultyColor(challenge.difficulty)} size="small" />
                        <Chip
                          label={challenge.environment}
                          variant="outlined"
                          size="small"
                          icon={<Code />}
                        />
                      </Stack>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary">
                        {challenge.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Challenge Detail Dialog */}
      <Dialog open={!!selectedChallenge} onClose={handleCloseChallenge} maxWidth="md" fullWidth>
        {selectedChallenge && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5">Challenge #{selectedChallenge.id}</Typography>
                <Chip
                  label={selectedChallenge.difficulty}
                  color={getDifficultyColor(selectedChallenge.difficulty)}
                  size="small"
                />
                <Chip label={selectedChallenge.environment} variant="outlined" size="small" />
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedChallenge.title}
                  </Typography>
                  <Typography variant="body1">{selectedChallenge.description}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Objectives:
                  </Typography>
                  <ul style={{ margin: 0 }}>
                    {selectedChallenge.objectives.map((obj, idx) => (
                      <li key={idx}>
                        <Typography variant="body2">{obj}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Hints:
                  </Typography>
                  <ul style={{ margin: 0 }}>
                    {selectedChallenge.hints.map((hint, idx) => (
                      <li key={idx}>
                        <Typography variant="body2" color="text.secondary">
                          {hint}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>

                <Alert severity="info" icon={<Psychology />}>
                  <Typography variant="subtitle2" gutterBottom>
                    AI Prompt Suggestion:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{selectedChallenge.aiPromptSuggestion}"
                  </Typography>
                </Alert>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseChallenge}>Close</Button>
              {!completedChallenges.includes(selectedChallenge.id) && (
                <Button
                  variant="contained"
                  onClick={() => handleMarkComplete(selectedChallenge.id)}
                  startIcon={<CheckCircle />}
                >
                  Mark as Complete
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
