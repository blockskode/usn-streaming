import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Speed as SpeedIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
          color: 'white',
          py: 12,
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" gutterBottom>
                Master Kafka & Databricks
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Learn real-time data streaming through hands-on challenges,
                powered by AI-assisted learning
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#FF6B35',
                    '&:hover': { bgcolor: '#E55A2B' },
                    px: 4,
                    py: 1.5,
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: '#FF6B35', color: '#FF6B35' },
                    px: 4,
                    py: 1.5,
                  }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 4,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Workshop Highlights
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {[
                    'Live Kafka data streams',
                    'Interactive tutorials',
                    '9 progressive challenges',
                    'Python & Databricks integration',
                    'AI-powered learning',
                  ].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#FF6B35',
                          mr: 2,
                        }}
                      />
                      <Typography>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why This Workshop?
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Learn by doing, not by memorizing. Our hands-on approach combines
          real-world scenarios with AI-assisted learning.
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <SpeedIcon sx={{ fontSize: 48 }} />,
              title: 'Real-Time Streaming',
              description:
                'Connect to live Kafka topics with real data streams. No setup required—just code.',
            },
            {
              icon: <SchoolIcon sx={{ fontSize: 48 }} />,
              title: 'Interactive Tutorials',
              description:
                'Learn Kafka and Databricks concepts through visual, interactive lessons.',
            },
            {
              icon: <CodeIcon sx={{ fontSize: 48 }} />,
              title: 'Hands-On Challenges',
              description:
                '9 progressive challenges from basic connections to fraud detection systems.',
            },
            {
              icon: <PsychologyIcon sx={{ fontSize: 48 }} />,
              title: 'AI-Enhanced Learning',
              description:
                'Get AI prompt suggestions for each challenge. Learn how to learn with AI tools.',
            },
          ].map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: '#FF6B35', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#F5F5F5', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
            Three simple steps to mastering real-time data streaming
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                step: '1',
                title: 'Learn the Concepts',
                description:
                  'Start with interactive tutorials covering Kafka, Databricks, and streaming fundamentals.',
              },
              {
                step: '2',
                title: 'Connect & Code',
                description:
                  'Connect to live data streams from VS Code or Databricks. Build real-time pipelines.',
              },
              {
                step: '3',
                title: 'Complete Challenges',
                description:
                  'Solve 9 progressive challenges. Track your progress and get AI assistance.',
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.step}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: '#FF6B35',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join the workshop and master real-time data streaming today
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#FF6B35',
              '&:hover': { bgcolor: '#F5F5F5' },
              px: 6,
              py: 2,
            }}
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#000000', color: 'white', py: 4 }}>
        <Container>
          <Typography variant="body2" align="center">
            © 2025 Kafka Workshop. Powered by Confluent Cloud & Firebase.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
