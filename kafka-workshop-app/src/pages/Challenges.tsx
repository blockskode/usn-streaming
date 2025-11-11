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
      title: 'Connect to Kafka - Python',
      difficulty: 'Easy',
      environment: 'VS Code',
      description: 'Set up a Kafka consumer in Python and read messages from the ecommerce-events topic.',
      objectives: [
        'Install confluent-kafka library',
        'Configure consumer with provided credentials',
        'Subscribe to ecommerce-events topic',
        'Print 10 messages to console',
      ],
      hints: [
        'Use the confluent_kafka.Consumer class',
        'Set auto.offset.reset to "earliest" to read from the beginning',
        'Use a while loop with consumer.poll()',
      ],
      aiPromptSuggestion: 'How do I create a Kafka consumer in Python using confluent-kafka to read from a topic with SASL_SSL authentication?',
    },
    {
      id: 2,
      title: 'Filter and Transform Data - Python',
      difficulty: 'Medium',
      environment: 'VS Code',
      description: 'Read from ecommerce-events and filter only "purchase" actions, then calculate total revenue.',
      objectives: [
        'Parse JSON messages',
        'Filter for action == "purchase"',
        'Sum up product prices',
        'Print total revenue every 10 seconds',
      ],
      hints: [
        'Use json.loads() to parse message values',
        'Keep a running total in a variable',
        'Use time.time() to track intervals',
      ],
      aiPromptSuggestion: 'How do I parse JSON from Kafka messages in Python and filter specific fields?',
    },
    {
      id: 3,
      title: 'Write to Kafka - Python',
      difficulty: 'Medium',
      environment: 'VS Code',
      description: 'Create a producer that sends custom messages to a new topic.',
      objectives: [
        'Create a Kafka producer',
        'Define a custom message schema',
        'Send 100 messages to a new topic',
        'Handle delivery reports',
      ],
      hints: [
        'Use confluent_kafka.Producer',
        'Use producer.produce() with a callback',
        'Call producer.flush() to ensure delivery',
      ],
      aiPromptSuggestion: 'How do I create a Kafka producer in Python and send JSON messages with delivery confirmation?',
    },
    {
      id: 4,
      title: 'Real-time Windowing - Python',
      difficulty: 'Hard',
      environment: 'VS Code',
      description: 'Implement a sliding window to count events per user in 5-minute intervals.',
      objectives: [
        'Maintain a time-based window of events',
        'Group events by user_id',
        'Calculate counts per window',
        'Expire old windows',
      ],
      hints: [
        'Use collections.deque for sliding window',
        'Store timestamps with each event',
        'Clean up events older than window size',
      ],
      aiPromptSuggestion: 'How do I implement a sliding time window in Python for stream processing?',
    },
    {
      id: 5,
      title: 'Connect to Kafka - Databricks',
      difficulty: 'Easy',
      environment: 'Databricks',
      description: 'Set up a Structured Streaming job to read from Kafka in Databricks.',
      objectives: [
        'Configure Kafka connection in Databricks',
        'Use spark.readStream to connect',
        'Parse the value column as JSON',
        'Display streaming results',
      ],
      hints: [
        'Use .format("kafka") for readStream',
        'Cast value column to string before parsing',
        'Use from_json() with a schema',
      ],
      aiPromptSuggestion: 'How do I read from Kafka in Databricks using Structured Streaming with SASL authentication?',
    },
    {
      id: 6,
      title: 'Aggregations - Databricks',
      difficulty: 'Medium',
      environment: 'Databricks',
      description: 'Perform windowed aggregations on IoT sensor data to calculate average temperature per sensor.',
      objectives: [
        'Read from iot-sensors topic',
        'Apply a 10-minute tumbling window',
        'Group by sensor_id and window',
        'Calculate average temperature',
      ],
      hints: [
        'Use window() function from pyspark.sql.functions',
        'Use groupBy with multiple columns',
        'Apply avg() aggregation',
      ],
      aiPromptSuggestion: 'How do I perform windowed aggregations on streaming data in Databricks?',
    },
    {
      id: 7,
      title: 'Delta Lake Integration - Databricks',
      difficulty: 'Medium',
      environment: 'Databricks',
      description: 'Stream data from Kafka to Delta Lake with append mode.',
      objectives: [
        'Create a Delta table',
        'Write streaming data to Delta',
        'Use checkpointing for fault tolerance',
        'Query the Delta table',
      ],
      hints: [
        'Use .format("delta") for writeStream',
        'Specify .option("checkpointLocation", path)',
        'Use .outputMode("append")',
      ],
      aiPromptSuggestion: 'How do I write Kafka streaming data to Delta Lake in Databricks with checkpointing?',
    },
    {
      id: 8,
      title: 'Join Streams - Databricks',
      difficulty: 'Hard',
      environment: 'Databricks',
      description: 'Join ecommerce events with user profile data in real-time.',
      objectives: [
        'Read from two Kafka topics',
        'Perform a stream-stream join',
        'Apply watermarking for state management',
        'Output enriched events',
      ],
      hints: [
        'Use withWatermark() on both streams',
        'Join on common key (user_id)',
        'Specify time constraints for join',
      ],
      aiPromptSuggestion: 'How do I join two Kafka streams in Databricks with watermarking?',
    },
    {
      id: 9,
      title: 'Fraud Detection Pipeline - Databricks',
      difficulty: 'Hard',
      environment: 'Databricks',
      description: 'Build an end-to-end fraud detection system using financial transaction data.',
      objectives: [
        'Read from financial-transactions topic',
        'Implement fraud detection rules (velocity, amount thresholds)',
        'Flag suspicious transactions',
        'Write results to Delta Lake bronze/silver/gold tables',
        'Create real-time dashboard',
      ],
      hints: [
        'Use Medallion architecture (bronze → silver → gold)',
        'Apply windowed aggregations for velocity checks',
        'Use UDFs for complex fraud rules',
        'Partition Delta tables by date',
      ],
      aiPromptSuggestion: 'How do I build a fraud detection pipeline in Databricks using Structured Streaming and Delta Lake?',
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
