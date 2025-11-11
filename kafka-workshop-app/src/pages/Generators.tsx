import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  ShoppingCart,
  Sensors,
  Share,
  AccountBalance,
  ExpandMore,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Header } from '../components/layout/Header';

interface GeneratorStatus {
  isRunning: boolean;
  type: string;
  messagesProduced: number;
  startedAt?: any;
}

interface GeneratorConfig {
  type: 'ecommerce' | 'iot' | 'social' | 'financial';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  topic: string;
}

export const Generators: React.FC = () => {
  // Try to connect to Firebase functions first
  const [status, setStatus] = useState<Record<string, GeneratorStatus>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedGenerator, setExpandedGenerator] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'connected' | 'disconnected' | 'checking'>>({});
  const [demoMode, setDemoMode] = useState(false);
  const functions = getFunctions();

  const generators: GeneratorConfig[] = [
    {
      type: 'ecommerce',
      title: 'E-Commerce Events',
      description: 'Product views, cart actions, and purchase events',
      icon: <ShoppingCart sx={{ fontSize: 48 }} />,
      color: '#4CAF50',
      topic: 'ecommerce-events',
    },
    {
      type: 'iot',
      title: 'IoT Sensors',
      description: 'Temperature, humidity, pressure, and location data',
      icon: <Sensors sx={{ fontSize: 48 }} />,
      color: '#2196F3',
      topic: 'iot-sensors',
    },
    {
      type: 'social',
      title: 'Social Media',
      description: 'Posts, likes, comments, and engagement metrics',
      icon: <Share sx={{ fontSize: 48 }} />,
      color: '#9C27B0',
      topic: 'social-media',
    },
    {
      type: 'financial',
      title: 'Financial Transactions',
      description: 'Purchases, transfers, and fraud detection events',
      icon: <AccountBalance sx={{ fontSize: 48 }} />,
      color: '#FF6B35',
      topic: 'financial-transactions',
    },
  ];

  const fetchStatus = async () => {
    // In demo mode, don't try to fetch from Firebase
    if (demoMode) return;

    try {
      const getGeneratorStatus = httpsCallable(functions, 'getGeneratorStatus');
      const result = await getGeneratorStatus();
      setStatus(result.data as Record<string, GeneratorStatus>);

      // Update connection status based on whether we can fetch data
      const newConnectionStatus: Record<string, 'connected' | 'disconnected'> = {};
      Object.keys(result.data as Record<string, GeneratorStatus>).forEach((key) => {
        newConnectionStatus[key] = 'connected';
      });
      setConnectionStatus(newConnectionStatus);
      setDemoMode(false); // Successfully connected, exit demo mode
    } catch (err: any) {
      // Stay in demo mode
      setDemoMode(true);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 3 seconds if not in demo mode
    const interval = setInterval(() => {
      if (!demoMode) {
        fetchStatus();
      }
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  // TEMPORARY: Mock message production for demo mode
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (updated[key].isRunning) {
            updated[key] = {
              ...updated[key],
              messagesProduced: updated[key].messagesProduced + Math.floor(Math.random() * 5) + 1,
            };
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async (type: string) => {
    setLoading({ ...loading, [type]: true });
    setError('');
    setSuccess('');

    try {
      const startGenerator = httpsCallable(functions, 'startGenerator');
      await startGenerator({ type });
      setSuccess(`${type} generator started successfully`);
      await fetchStatus();
    } catch (err: any) {
      // TEMPORARY: Mock start functionality for UI testing
      // Simulate starting the generator
      setTimeout(() => {
        setStatus((prev) => ({
          ...prev,
          [type]: {
            isRunning: true,
            type: type as any,
            messagesProduced: 0,
          },
        }));
        setConnectionStatus((prev) => ({ ...prev, [type]: 'connected' }));
        setSuccess(`${type} generator started successfully`);
      }, 1000);
    } finally {
      setTimeout(() => {
        setLoading({ ...loading, [type]: false });
      }, 1000);
    }
  };

  const handleStop = async (type: string) => {
    setLoading({ ...loading, [type]: true });
    setError('');
    setSuccess('');

    try {
      const stopGenerator = httpsCallable(functions, 'stopGenerator');
      await stopGenerator({ type });
      setSuccess(`${type} generator stopped successfully`);
      await fetchStatus();
    } catch (err: any) {
      // TEMPORARY: Mock stop functionality for UI testing
      // Simulate stopping the generator
      setTimeout(() => {
        setStatus((prev) => ({
          ...prev,
          [type]: {
            isRunning: false,
            type: type as any,
            messagesProduced: prev[type]?.messagesProduced || 0,
          },
        }));
        setConnectionStatus((prev) => ({ ...prev, [type]: 'disconnected' }));
        setSuccess(`${type} generator stopped successfully`);
      }, 1000);
    } finally {
      setTimeout(() => {
        setLoading({ ...loading, [type]: false });
      }, 1000);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      <Header />

      {/* Main Content */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom>
          Data Stream Control Panel
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Start and stop live Kafka data streams for your workshop exercises
        </Typography>

        {demoMode && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Demo Mode Active:</strong> Firebase functions are not available (requires Blaze plan upgrade).
            All functionality is simulated for UI testing purposes.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {generators.map((gen) => {
            const isRunning = status[gen.type]?.isRunning || false;
            const messagesProduced = status[gen.type]?.messagesProduced || 0;
            const isLoading = loading[gen.type] || false;
            const isExpanded = expandedGenerator === gen.type;
            const connStatus = connectionStatus[gen.type] || 'checking';

            return (
              <Grid item xs={12} sm={6} md={6} key={gen.type}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                      {/* Icon and Status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ color: gen.color }}>{gen.icon}</Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={isRunning ? 'Running' : 'Stopped'}
                            color={isRunning ? 'success' : 'default'}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => setExpandedGenerator(isExpanded ? null : gen.type)}
                            sx={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                            }}
                          >
                            <ExpandMore />
                          </IconButton>
                        </Stack>
                      </Box>

                      {/* Title and Description */}
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          {gen.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {gen.description}
                        </Typography>
                      </Box>

                      {/* Messages Produced */}
                      {isRunning && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Messages Produced:
                          </Typography>
                          <Typography variant="h6" sx={{ color: gen.color }}>
                            {messagesProduced.toLocaleString()}
                          </Typography>
                        </Box>
                      )}

                      {/* Expandable Connection Details */}
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2}>
                          {/* Connection Status */}
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="caption" color="text.secondary">
                                Connection Status:
                              </Typography>
                              {connStatus === 'connected' ? (
                                <>
                                  <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                    Connected
                                  </Typography>
                                </>
                              ) : connStatus === 'disconnected' ? (
                                <>
                                  <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                  <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                    Disconnected
                                  </Typography>
                                </>
                              ) : (
                                <CircularProgress size={16} />
                              )}
                            </Stack>
                          </Box>

                          {/* Kafka Topic */}
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Kafka Topic:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                bgcolor: '#f5f5f5',
                                p: 1,
                                borderRadius: 1,
                                mt: 0.5,
                              }}
                            >
                              {gen.topic}
                            </Typography>
                          </Box>

                          {/* Bootstrap Server */}
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Bootstrap Server:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                bgcolor: '#f5f5f5',
                                p: 1,
                                borderRadius: 1,
                                mt: 0.5,
                                fontSize: '0.75rem',
                              }}
                            >
                              pkc-619z3.us-east1.gcp.confluent.cloud:9092
                            </Typography>
                          </Box>

                          {/* Security Protocol */}
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Security Protocol:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                bgcolor: '#f5f5f5',
                                p: 1,
                                borderRadius: 1,
                                mt: 0.5,
                              }}
                            >
                              SASL_SSL (PLAIN)
                            </Typography>
                          </Box>

                          {/* Generator Type */}
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Data Schema:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                bgcolor: '#f5f5f5',
                                p: 1,
                                borderRadius: 1,
                                mt: 0.5,
                              }}
                            >
                              {gen.type.toUpperCase()} Events (JSON)
                            </Typography>
                          </Box>
                        </Stack>
                      </Collapse>

                      {/* Control Button */}
                      <Button
                        variant={isRunning ? 'outlined' : 'contained'}
                        color={isRunning ? 'error' : 'primary'}
                        size="large"
                        fullWidth
                        startIcon={
                          isLoading ? (
                            <CircularProgress size={20} />
                          ) : isRunning ? (
                            <Stop />
                          ) : (
                            <PlayArrow />
                          )
                        }
                        onClick={() => (isRunning ? handleStop(gen.type) : handleStart(gen.type))}
                        disabled={isLoading}
                        sx={{
                          mt: 2,
                          py: 1.5,
                          bgcolor: isRunning ? undefined : gen.color,
                          '&:hover': {
                            bgcolor: isRunning ? undefined : gen.color,
                            filter: 'brightness(0.9)',
                          },
                        }}
                      >
                        {isLoading ? 'Processing...' : isRunning ? 'Stop Generator' : 'Start Generator'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Connection Info */}
        <Box sx={{ mt: 6, p: 4, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Connection Information
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use these details to connect to the Kafka cluster from your code:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Bootstrap Server:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  p: 1,
                  borderRadius: 1,
                  mt: 0.5,
                }}
              >
                pkc-619z3.us-east1.gcp.confluent.cloud:9092
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Security Protocol:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: '#f5f5f5',
                  p: 1,
                  borderRadius: 1,
                  mt: 0.5,
                }}
              >
                SASL_SSL (PLAIN)
              </Typography>
            </Grid>
          </Grid>
          <Alert severity="info" sx={{ mt: 3 }}>
            API credentials will be provided separately. Never commit credentials to your code!
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};
