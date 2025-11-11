import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  MenuBook as TutorialIcon,
  PlayArrow as GeneratorIcon,
  EmojiEvents as ChallengeIcon,
  Folder as ResourceIcon,
} from '@mui/icons-material';
import { Header } from '../components/layout/Header';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      <Header />

      {/* Main Content */}
      <Container sx={{ pt: 12, pb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Welcome back!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Continue your learning journey with Kafka and Databricks
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              title: 'Tutorial',
              description: 'Learn Kafka and Databricks fundamentals',
              icon: <TutorialIcon sx={{ fontSize: 48 }} />,
              color: '#4CAF50',
              path: '/tutorial',
            },
            {
              title: 'Data Generators',
              description: 'Start and control live data streams',
              icon: <GeneratorIcon sx={{ fontSize: 48 }} />,
              color: '#FF6B35',
              path: '/generators',
            },
            {
              title: 'Challenges',
              description: 'Complete 9 progressive coding challenges',
              icon: <ChallengeIcon sx={{ fontSize: 48 }} />,
              color: '#2196F3',
              path: '/challenges',
            },
            {
              title: 'Resources',
              description: 'Connection details and code snippets',
              icon: <ResourceIcon sx={{ fontSize: 48 }} />,
              color: '#9C27B0',
              path: '/resources',
            },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: item.color, mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Start Section */}
        <Box sx={{ mt: 6 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Quick Start Guide
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    1. Learn
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start with the tutorial to understand Kafka and Databricks concepts
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    2. Connect
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start data generators and connect from VS Code or Databricks
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    3. Practice
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete challenges to reinforce your learning
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};
