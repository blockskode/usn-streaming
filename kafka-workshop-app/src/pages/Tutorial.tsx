import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Badge,
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
  Settings,
  ContentCopy,
  EmojiEvents,
  Star,
  Whatshot,
} from '@mui/icons-material';
import { Header } from '../components/layout/Header';

const drawerWidth = 280;

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'kafka' | 'databricks' | 'code';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// Reusable CodeBlock component with copy functionality
interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box sx={{ position: 'relative', bgcolor: '#1e1e1e', borderRadius: 1, overflow: 'hidden' }}>
      <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
        <IconButton
          onClick={handleCopy}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: copied ? '#4CAF50' : '#d4d4d4',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.5)',
            },
            zIndex: 1,
          }}
          size="small"
        >
          <ContentCopy fontSize="small" />
        </IconButton>
      </Tooltip>
      <Box sx={{ color: '#d4d4d4', p: 2, pr: 6, fontFamily: 'Courier, monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
        <pre style={{ margin: 0 }}>{code}</pre>
      </Box>
    </Box>
  );
};

const sections: Section[] = [
  { id: 'kafka-intro', title: 'What is Apache Kafka?', icon: <Storage />, category: 'kafka' },
  { id: 'topics', title: 'Topics & Partitions', icon: <ViewModule />, category: 'kafka' },
  { id: 'producers', title: 'Producers', icon: <CloudQueue />, category: 'kafka' },
  { id: 'consumers', title: 'Consumers & Groups', icon: <Group />, category: 'kafka' },
  { id: 'brokers', title: 'Brokers & Clusters', icon: <Router />, category: 'kafka' },
  { id: 'databricks-intro', title: 'What is Databricks?', icon: <PlayCircleOutline />, category: 'databricks' },
  { id: 'structured-streaming', title: 'Structured Streaming', icon: <Timeline />, category: 'databricks' },
  { id: 'delta-lake', title: 'Delta Lake', icon: <DataObject />, category: 'databricks' },
  { id: 'env-setup', title: 'Environment Setup', icon: <Settings />, category: 'code' },
  { id: 'code-python', title: 'Python Consumer', icon: <Code />, category: 'code' },
  { id: 'code-databricks', title: 'Databricks Streaming', icon: <Speed />, category: 'code' },
];

export const Tutorial: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('kafka-intro');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Gamification state - Load from localStorage
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('kafkaAchievements');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 'first-connection', title: 'First Connection', description: 'Connected to Kafka!', icon: '🔌', unlocked: false },
      { id: 'topic-master', title: 'Topic Master', description: 'Created your first topic', icon: '📂', unlocked: false },
      { id: 'producer-pro', title: 'Producer Pro', description: 'Sent messages to Kafka', icon: '📤', unlocked: false },
      { id: 'consumer-champion', title: 'Consumer Champion', description: 'Read messages from Kafka', icon: '📥', unlocked: false },
    ];
  });
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kafkaAchievements', JSON.stringify(achievements));
  }, [achievements]);

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      setAchievements(prev => prev.map(ach =>
        ach.id === achievementId ? { ...ach, unlocked: true } : ach
      ));
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  // Track scroll progress through the tutorial
  const [scrollProgress, setScrollProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Mark sections as completed/uncompleted based on scroll position
      const newCompletedSections = new Set<string>();
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionHeight = rect.height;

          // Mark as completed if user has scrolled past 80% of the section
          if (scrolled > sectionTop + sectionHeight * 0.8) {
            newCompletedSections.add(section.id);
          }
        }
      });
      setCompletedSections(newCompletedSections);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll spy: automatically highlight the current section in the sidebar
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -50% 0px', // Trigger when section is near top of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSelectedSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup
    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              background: 'linear-gradient(180deg, #1e3a5f 0%, #2c5aa0 100%)',
              color: 'white',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Box sx={{ overflow: 'auto', pt: 3, px: 2 }}>
            {/* Progress Bar in Sidebar */}
            <Box sx={{
              bgcolor: 'rgba(76,175,80,0.15)',
              p: 2,
              borderRadius: 2,
              mb: 3,
              border: '1px solid rgba(76,175,80,0.3)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#90ee90', fontWeight: 'bold' }}>
                  📖 TUTORIAL PROGRESS
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                  {Math.round(scrollProgress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={scrollProgress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#4CAF50',
                    borderRadius: 1,
                  },
                }}
              />
            </Box>

            <Typography variant="overline" sx={{
              color: '#ffeb99',
              fontWeight: 'bold',
              display: 'block',
              mb: 1.5,
              px: 1,
              fontSize: '0.75rem',
              letterSpacing: 1.2,
            }}>
              Apache Kafka
            </Typography>
            <List dense sx={{ mb: 2 }}>
              {sections.filter(s => s.category === 'kafka').map((section) => (
                <ListItem key={section.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={selectedSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      color: '#e6f7ff',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,235,153,0.25)',
                        borderLeft: '4px solid #ffeb99',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        transform: 'translateX(4px)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.15)',
                        transform: 'translateX(4px)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      },
                      '&:hover .MuiListItemIcon-root': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{
                      minWidth: 40,
                      color: 'inherit',
                      transition: 'transform 0.2s ease',
                    }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={section.title}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: selectedSection === section.id ? 600 : 400,
                      }}
                    />
                    {completedSections.has(section.id) && (
                      <CheckCircle sx={{
                        color: '#4CAF50',
                        fontSize: 20,
                        ml: 1,
                        animation: 'checkmarkPop 0.3s ease-out',
                        '@keyframes checkmarkPop': {
                          '0%': { transform: 'scale(0)', opacity: 0 },
                          '50%': { transform: 'scale(1.2)' },
                          '100%': { transform: 'scale(1)', opacity: 1 },
                        },
                      }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

            <Typography variant="overline" sx={{
              color: '#ffeb99',
              fontWeight: 'bold',
              display: 'block',
              mb: 1.5,
              px: 1,
              fontSize: '0.75rem',
              letterSpacing: 1.2,
            }}>
              Databricks
            </Typography>
            <List dense sx={{ mb: 2 }}>
              {sections.filter(s => s.category === 'databricks').map((section) => (
                <ListItem key={section.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={selectedSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      color: '#e6f7ff',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,235,153,0.25)',
                        borderLeft: '4px solid #ffeb99',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        transform: 'translateX(4px)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.15)',
                        transform: 'translateX(4px)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      },
                      '&:hover .MuiListItemIcon-root': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{
                      minWidth: 40,
                      color: 'inherit',
                      transition: 'transform 0.2s ease',
                    }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={section.title}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: selectedSection === section.id ? 600 : 400,
                      }}
                    />
                    {completedSections.has(section.id) && (
                      <CheckCircle sx={{
                        color: '#4CAF50',
                        fontSize: 20,
                        ml: 1,
                        animation: 'checkmarkPop 0.3s ease-out',
                        '@keyframes checkmarkPop': {
                          '0%': { transform: 'scale(0)', opacity: 0 },
                          '50%': { transform: 'scale(1.2)' },
                          '100%': { transform: 'scale(1)', opacity: 1 },
                        },
                      }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

            <Typography variant="overline" sx={{
              color: '#ffeb99',
              fontWeight: 'bold',
              display: 'block',
              mb: 1.5,
              px: 1,
              fontSize: '0.75rem',
              letterSpacing: 1.2,
            }}>
              Code Examples
            </Typography>
            <List dense sx={{ mb: 2 }}>
              {sections.filter(s => s.category === 'code').map((section) => (
                <ListItem key={section.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={selectedSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      color: '#e6f7ff',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,235,153,0.25)',
                        borderLeft: '4px solid #ffeb99',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        transform: 'translateX(4px)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.15)',
                        transform: 'translateX(4px)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      },
                      '&:hover .MuiListItemIcon-root': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{
                      minWidth: 40,
                      color: 'inherit',
                      transition: 'transform 0.2s ease',
                    }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={section.title}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: selectedSection === section.id ? 600 : 400,
                      }}
                    />
                    {completedSections.has(section.id) && (
                      <CheckCircle sx={{
                        color: '#4CAF50',
                        fontSize: 20,
                        ml: 1,
                        animation: 'checkmarkPop 0.3s ease-out',
                        '@keyframes checkmarkPop': {
                          '0%': { transform: 'scale(0)', opacity: 0 },
                          '50%': { transform: 'scale(1.2)' },
                          '100%': { transform: 'scale(1)', opacity: 1 },
                        },
                      }} />
                    )}
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
            pt: 12,
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
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4, fontStyle: 'italic' }}>
              Learn by doing - practical examples you can run right now
            </Typography>

            {/* ==================== SETUP BANNER ==================== */}
            <Alert
              severity="info"
              icon={<Settings fontSize="large" />}
              sx={{
                mb: 4,
                bgcolor: '#e3f2fd',
                border: '2px solid #2196F3',
                '& .MuiAlert-icon': {
                  fontSize: '2rem',
                  color: '#2196F3'
                }
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                ⚠️ Before You Start: Setup Required!
              </Typography>
              <Typography variant="body2" paragraph>
                Before diving into Kafka concepts, you need to set up your development environment. This is <strong>essential</strong> to run the code examples throughout this tutorial.
              </Typography>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Quick Setup Checklist:
                </Typography>
                <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: 20 }}>
                  <li>✅ Python 3.13 installed</li>
                  <li>✅ Virtual environment created</li>
                  <li>✅ Dependencies installed (<code>pip install -r requirements.txt</code>)</li>
                  <li>✅ API credentials configured in <code>.env</code> file</li>
                </ul>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: '#1976D2',
                  mt: 2,
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#1565C0'
                  }
                }}
                onClick={() => {
                  const element = document.getElementById('env-setup');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                👉 Click here or scroll down to "Environment Setup" in the sidebar to get started!
              </Typography>
            </Alert>

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

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Apache Kafka is a <strong>high-performance system for moving data between applications</strong>. Think of it as a highway system for information - one application sends data into Kafka, and other applications read that data at their own pace. The data can be anything: a user clicking a button, a sensor reading, a purchase transaction, a log entry - anything your applications need to share.
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                What makes Kafka special is that <strong>applications don't need to talk directly to each other</strong>. When you send data to Kafka, you don't need to worry about who will read it or when. Multiple applications can read the same data independently, and if one application crashes, it can resume right where it left off when it restarts. Kafka stores data reliably and can handle millions of events per second, which is why companies like LinkedIn, Netflix, and Uber use it as the backbone of their systems.
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                But why do we need Kafka? Let's start with a real problem you might face...
              </Typography>

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
                <strong>With Kafka:</strong> All systems send/receive data through Kafka = clean and scalable.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Real-World Example: Uber
              </Typography>

              <Typography variant="body1" paragraph>
                <strong>Imagine you're building Uber.</strong> Every second, thousands of rides are happening:
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

              {/* Uber-like illustration */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
                  borderRadius: 2,
                  p: 3,
                  my: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid #00acc1',
                }}
              >
                {/* Animation styles */}
                <style>
                  {`
                    @keyframes rideRequest {
                      0%, 100% {
                        transform: scale(1);
                        opacity: 0;
                      }
                      50% {
                        transform: scale(1.5);
                        opacity: 1;
                      }
                    }
                    @keyframes eventFlow {
                      0% {
                        left: 0;
                        opacity: 0;
                      }
                      20% {
                        opacity: 1;
                      }
                      80% {
                        opacity: 1;
                      }
                      100% {
                        left: 100%;
                        opacity: 0;
                      }
                    }
                    @keyframes systemBlink {
                      0%, 100% {
                        opacity: 0.6;
                      }
                      50% {
                        opacity: 1;
                      }
                    }
                    .ride-request-pulse {
                      position: absolute;
                      width: 30px;
                      height: 30px;
                      background: rgba(255, 152, 0, 0.4);
                      border-radius: 50%;
                      animation: rideRequest 2s ease-in-out infinite;
                    }
                    .event-dot {
                      position: absolute;
                      width: 10px;
                      height: 10px;
                      background: #FF6B35;
                      border-radius: 50%;
                      box-shadow: 0 0 10px rgba(255,107,53,0.8);
                      animation: eventFlow 3s ease-in-out infinite;
                    }
                    .event-dot:nth-child(1) { animation-delay: 0s; }
                    .event-dot:nth-child(2) { animation-delay: 1s; }
                    .event-dot:nth-child(3) { animation-delay: 2s; }
                    .system-icon {
                      animation: systemBlink 2s ease-in-out infinite;
                    }
                    .system-icon:nth-child(1) { animation-delay: 0.5s; }
                    .system-icon:nth-child(2) { animation-delay: 1s; }
                    .system-icon:nth-child(3) { animation-delay: 1.5s; }
                    .system-icon:nth-child(4) { animation-delay: 2s; }
                  `}
                </style>

                {/* Animated event dots flowing from phone to Kafka */}
                <Box sx={{
                  position: 'absolute',
                  top: 'calc(50% - 5px)',
                  left: '22%',
                  width: '23%',
                  height: '10px',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}>
                  <Box className="event-dot" />
                  <Box className="event-dot" />
                  <Box className="event-dot" />
                </Box>

                <Grid container spacing={2} alignItems="center">
                  {/* Rider with Phone */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', position: 'relative' }}>
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Typography sx={{ fontSize: '48px', mb: 1 }}>📱</Typography>
                        <Box className="ride-request-pulse" sx={{ top: '10px', left: '10px' }} />
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: '#00838f' }}>
                        🚗 Rider Requests
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Arrow */}
                  <Grid item xs={12} md={1}>
                    <Box sx={{ position: 'relative', height: '30px' }}>
                      <Typography variant="h4" sx={{ color: '#00838f', textAlign: 'center' }}>→</Typography>
                    </Box>
                  </Grid>

                  {/* Kafka Hub */}
                  <Grid item xs={12} md={3}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        bgcolor: 'white',
                        borderRadius: 2,
                        p: 2,
                        border: '3px solid #FF6B35',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Storage sx={{ fontSize: 40, color: '#FF6B35', mb: 0.5 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#FF6B35' }}>
                        Kafka
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                        Event Hub
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Arrow */}
                  <Grid item xs={12} md={1}>
                    <Typography variant="h4" sx={{ color: '#00838f', textAlign: 'center' }}>→</Typography>
                  </Grid>

                  {/* Uber Platform - Consumer Services */}
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        p: 2,
                        border: '2px solid #9C27B0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 1.5, textAlign: 'center' }}>
                        🚕 Uber Platform
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666', display: 'block', textAlign: 'center', mb: 1.5 }}>
                        Consumer Services
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        <Box className="system-icon" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, border: '1px solid #ddd', minWidth: '65px', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '18px' }}>💰</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', display: 'block' }}>Pricing</Typography>
                        </Box>
                        <Box className="system-icon" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, border: '1px solid #ddd', minWidth: '65px', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '18px' }}>🔔</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', display: 'block' }}>Notify</Typography>
                        </Box>
                        <Box className="system-icon" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, border: '1px solid #ddd', minWidth: '65px', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '18px' }}>🗺️</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', display: 'block' }}>Maps</Typography>
                        </Box>
                        <Box className="system-icon" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, border: '1px solid #ddd', minWidth: '65px', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '18px' }}>📊</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', display: 'block' }}>Analytics</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: '#00838f',
                    mt: 2,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                  }}
                >
                  One event triggers multiple independent systems - that's the power of Kafka! 🚀
                </Typography>
              </Box>

              <Alert severity="success" sx={{ mt: 3, mb: 4 }}>
                <strong>💡 This is why companies like Uber, Netflix, LinkedIn, and Airbnb use Kafka</strong> - they need to handle millions of real-time events reliably, even when some systems fail.
              </Alert>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                How Kafka Works: The Big Picture
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                Now that you understand the problem, let's visualize how Kafka solves it. In the diagram below, watch the golden dots flowing from <strong>Producers</strong> (applications sending data) into <strong>Kafka</strong> (the central hub), and then the green dots flowing out to <strong>Consumers</strong> (applications reading data). This shows how data moves through the system in real-time!
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Notice how Producers and Consumers never talk directly to each other - they only communicate through Kafka. This is the key to building scalable, reliable systems.
              </Typography>

              {/* Visual Illustration */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  p: 4,
                  mb: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* CSS Animation for flowing messages */}
                <style>
                  {`
                    @keyframes flowMessageLeft {
                      0% {
                        left: 0;
                        opacity: 0;
                      }
                      10% {
                        opacity: 1;
                      }
                      90% {
                        opacity: 1;
                      }
                      100% {
                        left: 100%;
                        opacity: 0;
                      }
                    }
                    @keyframes flowMessageRight {
                      0% {
                        left: 0;
                        opacity: 0;
                      }
                      10% {
                        opacity: 1;
                      }
                      90% {
                        opacity: 1;
                      }
                      100% {
                        left: 100%;
                        opacity: 0;
                      }
                    }
                    .message-dot-left {
                      position: absolute;
                      width: 14px;
                      height: 14px;
                      background: #FFD700;
                      border-radius: 50%;
                      box-shadow: 0 0 15px rgba(255,215,0,0.9);
                      z-index: 10;
                      animation: flowMessageLeft 2.5s ease-in-out infinite;
                    }
                    .message-dot-right {
                      position: absolute;
                      width: 14px;
                      height: 14px;
                      background: #4CAF50;
                      border-radius: 50%;
                      box-shadow: 0 0 15px rgba(76,175,80,0.9);
                      z-index: 10;
                      animation: flowMessageRight 2.5s ease-in-out infinite;
                    }
                    .message-dot-left:nth-child(1) { animation-delay: 0s; }
                    .message-dot-left:nth-child(2) { animation-delay: 0.8s; }
                    .message-dot-left:nth-child(3) { animation-delay: 1.6s; }
                    .message-dot-right:nth-child(1) { animation-delay: 0s; }
                    .message-dot-right:nth-child(2) { animation-delay: 0.8s; }
                    .message-dot-right:nth-child(3) { animation-delay: 1.6s; }
                  `}
                </style>

                {/* Animated message dots on left arrow (Producer to Kafka) */}
                <Box sx={{
                  position: 'absolute',
                  top: 'calc(50% - 7px)',
                  left: '15%',
                  width: '22%',
                  height: '14px',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}>
                  <Box className="message-dot-left" />
                  <Box className="message-dot-left" />
                  <Box className="message-dot-left" />
                </Box>

                {/* Animated message dots on right arrow (Kafka to Consumer) */}
                <Box sx={{
                  position: 'absolute',
                  top: 'calc(50% - 7px)',
                  left: '60%',
                  width: '14%',
                  height: '14px',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}>
                  <Box className="message-dot-right" />
                  <Box className="message-dot-right" />
                  <Box className="message-dot-right" />
                </Box>

                <Grid container spacing={3} alignItems="center">
                  {/* Producers */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          bgcolor: 'white',
                          borderRadius: 2,
                          p: 2,
                          mb: 1,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        <CloudQueue sx={{ fontSize: 48, color: '#2196F3' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333', mt: 1 }}>
                          Producers
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                          Web Apps, IoT, Services
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Arrow */}
                  <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                      →
                    </Typography>
                  </Grid>

                  {/* Kafka (Center) */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          bgcolor: 'white',
                          borderRadius: 3,
                          p: 3,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                          border: '3px solid #FFD700',
                        }}
                      >
                        <Storage sx={{ fontSize: 64, color: '#FF6B35', mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF6B35', mb: 1 }}>
                          Apache Kafka
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Box sx={{ bgcolor: '#f5f5f5', px: 1.5, py: 0.5, borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                              📂 Topics
                            </Typography>
                          </Box>
                          <Box sx={{ bgcolor: '#f5f5f5', px: 1.5, py: 0.5, borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                              🔄 Streams
                            </Typography>
                          </Box>
                          <Box sx={{ bgcolor: '#f5f5f5', px: 1.5, py: 0.5, borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                              💾 Storage
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Arrow */}
                  <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                      →
                    </Typography>
                  </Grid>

                  {/* Consumers */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          bgcolor: 'white',
                          borderRadius: 2,
                          p: 2,
                          mb: 1,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Group sx={{ fontSize: 48, color: '#9C27B0' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333', mt: 1 }}>
                          Consumers
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                          Analytics, Databases, APIs
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Caption */}
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: 'white',
                    mt: 3,
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                  }}
                >
                  💡 Kafka acts as a central hub - producers send data, consumers read independently
                </Typography>
              </Box>

              <Box sx={{
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3,
                borderRadius: 2,
                mb: 3,
                mt: 4,
                border: '3px solid #FFD700',
                boxShadow: '0 4px 20px rgba(102,126,234,0.3)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ fontSize: 32, color: '#FFD700', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    🎮 Challenge #1: First Connection
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Let's get hands-on! Before learning all the technical terms, let's verify you can connect to Kafka. We've prepared a simple test script called <code>00_test_connection.py</code> in the <code>examples/</code> folder. This script loads your credentials from the <code>.env</code> file and attempts to connect to the Kafka cluster. If it succeeds, you'll see a success message!
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.9 }}>
                  💡 Complete this challenge to unlock the <strong>"First Connection"</strong> achievement!
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  💡 To run this example:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🐧 🍎 macOS / Linux:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '12px' }}>
                    python3 examples/00_test_connection.py
                  </code>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🪟 Windows:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    python examples/00_test_connection.py
                  </code>
                </Box>
                <Typography variant="body2">
                  If you see "✅ Connected to Kafka!", you're ready to go!
                </Typography>
              </Alert>

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`from kafka import KafkaAdminClient
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
admin.close()`} />

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Box
                  onClick={() => unlockAchievement('first-connection')}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: 'white',
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#45a049',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(76,175,80,0.4)',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CheckCircle />
                  <Typography variant="button">I Connected Successfully!</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 5, mb: 2 }}>
                Key Components
              </Typography>

              <Typography variant="body1" paragraph>
                Now that you've seen Kafka in action, let's formalize the key concepts. Here are the building blocks you just used:
              </Typography>

              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #4CAF50' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        📂 Topics
                      </Typography>
                      <Typography variant="body2">
                        Categories that organize messages. Like folders for different types of events (e.g., "orders", "payments", "notifications"). Messages are stored in topics and can be read by multiple consumers.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #2196F3' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        📤 Producers
                      </Typography>
                      <Typography variant="body2">
                        Applications that send messages to Kafka topics. Any service that generates events (user actions, sensor readings, transactions) is a producer. They write data without knowing who will read it.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #9C27B0' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        📥 Consumers
                      </Typography>
                      <Typography variant="body2">
                        Applications that read messages from Kafka topics. They subscribe to topics and process events at their own pace. Multiple consumers can read the same data independently.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #FF9800' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        🖥️ Brokers
                      </Typography>
                      <Typography variant="body2">
                        Kafka servers that store data and serve client requests. They handle reading, writing, and replicating messages. Multiple brokers form a cluster for high availability and scalability.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
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
                Listing Available Topics
              </Typography>

              <Typography variant="body1" paragraph>
                Let's connect to our Kafka cluster and see what topics are available. The code is in <code>examples/01_connect_kafka.py</code>:
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📝 To run this example:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  1. Make sure you completed the Environment Setup
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  2. Run the command for your operating system:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🐧 🍎 macOS / Linux:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '12px' }}>
                    python3 examples/01_connect_kafka.py
                  </code>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🪟 Windows:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    python examples/01_connect_kafka.py
                  </code>
                </Box>
              </Alert>

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`#!/usr/bin/env python3
"""Connecting to Kafka and Listing Topics"""

import os
from kafka import KafkaAdminClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get credentials from environment variables
BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS')
API_KEY = os.getenv('KAFKA_API_KEY')
API_SECRET = os.getenv('KAFKA_API_SECRET')

print("🔌 Connecting to Confluent Cloud Kafka...")

# Connect to Confluent Cloud Kafka
admin = KafkaAdminClient(
    bootstrap_servers=BOOTSTRAP_SERVERS,
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=API_KEY,
    sasl_plain_password=API_SECRET
)

print("✅ Connected successfully!\\n")

# List all topics
topics = admin.list_topics()
print(f"📂 Available topics ({len(topics)}):")
for topic in sorted(topics):
    print(f"  - {topic}")

# Close the connection
admin.close()
print("\\n✅ Connection closed.")`} />

              <Typography variant="body2" paragraph sx={{ fontWeight: 'bold', mt: 2 }}>
                Expected Output:
              </Typography>

              <Box sx={{ bgcolor: '#1e1e1e', borderRadius: 1, p: 2, mb: 3 }}>
                <pre style={{ margin: 0, color: '#4CAF50', fontFamily: 'Courier, monospace', fontSize: '0.85rem' }}>
{`🔌 Connecting to Confluent Cloud Kafka...
✅ Connected successfully!

📂 Available topics (4):
  - ecommerce-events
  - financial-transactions
  - iot-sensor-data
  - social-media-feed

✅ Connection closed.`}
                </pre>
              </Box>

              <Alert severity="success" sx={{ mt: 3, mb: 4 }}>
                <strong>✅ Success!</strong> You're now connected to Kafka! These 4 topics contain real-time data streams you can consume and analyze throughout the workshop.
              </Alert>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Hands-On: Create Your Own Topic
              </Typography>

              <Typography variant="body1" paragraph>
                Let's create a topic with your name! The code is in <code>examples/02_create_topic.py</code>:
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📝 To run this example:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🐧 🍎 macOS / Linux:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '12px' }}>
                    python3 examples/02_create_topic.py
                  </code>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🪟 Windows:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    python examples/02_create_topic.py
                  </code>
                </Box>
                <Typography variant="body2">
                  💡 <strong>Remember your topic name!</strong> You'll use it in the next exercises (Producer and Consumer).
                </Typography>
              </Alert>

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`import os
from kafka.admin import KafkaAdminClient, NewTopic
from dotenv import load_dotenv

load_dotenv()

# Get your name for the topic
your_name = input("Enter your name (no spaces): ").strip().lower()
topic_name = f"{your_name}-topic"

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

admin.create_topics([topic])
print(f"✅ Successfully created topic: {topic_name}")`} />

              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>📝 Key Point:</strong> Topics are automatically created when you send your first message, but it's better to create them manually with the right settings (partitions and replication factor).
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
                Hands-On: Send Messages to Your Topic
              </Typography>

              <Typography variant="body1" paragraph>
                Now let's send messages to the topic you created! The code is in <code>examples/03_produce_messages.py</code>:
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📝 To run this example:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  1. Make sure you created your topic in the previous step
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  2. Run the producer:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🐧 🍎 macOS / Linux:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '12px' }}>
                    python3 examples/03_produce_messages.py
                  </code>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🪟 Windows:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    python examples/03_produce_messages.py
                  </code>
                </Box>
                <Typography variant="body2">
                  3. Enter your topic name when prompted (e.g., <code>john-topic</code>)<br />
                  4. Type messages and press Enter to send them<br />
                  5. Type <code>quit</code> to exit
                </Typography>
              </Alert>

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`import os
import json
from datetime import datetime
from kafka import KafkaProducer
from dotenv import load_dotenv

load_dotenv()

topic_name = input("Enter your topic name (e.g., john-topic): ").strip()

producer = KafkaProducer(
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=os.getenv('KAFKA_API_KEY'),
    sasl_plain_password=os.getenv('KAFKA_API_SECRET'),
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Send messages interactively
while True:
    user_input = input("Message: ").strip()
    if user_input.lower() == 'quit':
        break

    message = {
        'text': user_input,
        'timestamp': datetime.now().isoformat(),
        'message_id': message_count + 1
    }
    producer.send(topic_name, value=message)
    print(f"✅ Sent message #{message_count}")`} />

              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>📝 Key Point:</strong> Producers send messages to topics. Each message gets a timestamp and ID. Kafka stores them and delivers to all consumers interested in that topic!
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
                Hands-On: Read Messages from Your Topic
              </Typography>

              <Typography variant="body1" paragraph>
                Now let's consume the messages you sent! The code is in <code>examples/04_consume_messages.py</code>:
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📝 To run this example:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  1. Keep your producer running (or run it first to send messages)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  2. Open a <strong>new terminal window</strong> and run the consumer:
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🐧 🍎 macOS / Linux:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '12px' }}>
                    python3 examples/04_consume_messages.py
                  </code>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>🪟 Windows:</strong>
                  </Typography>
                  <code style={{ display: 'block', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    python examples/04_consume_messages.py
                  </code>
                </Box>
                <Typography variant="body2">
                  3. Enter the same topic name you used for the producer<br />
                  4. Watch messages appear in real-time as you type them in the producer!<br />
                  5. Press <code>Ctrl+C</code> to stop the consumer
                </Typography>
              </Alert>

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`import os
import json
from kafka import KafkaConsumer
from dotenv import load_dotenv

load_dotenv()

topic_name = input("Enter your topic name (e.g., john-topic): ").strip()

consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
    security_protocol='SASL_SSL',
    sasl_mechanism='PLAIN',
    sasl_plain_username=os.getenv('KAFKA_API_KEY'),
    sasl_plain_password=os.getenv('KAFKA_API_SECRET'),
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    group_id=f'{topic_name}-consumer-group'
)

# Read messages
for message in consumer:
    msg_value = message.value
    print(f"📨 Message #{message_count}")
    print(f"   Text: {msg_value.get('text')}")
    print(f"   Timestamp: {msg_value.get('timestamp')}")
    print(f"   Partition: {message.partition}, Offset: {message.offset}")`} />

              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>💡 Pro Tip:</strong> Open two terminal windows side-by-side. Run the producer in one and the consumer in the other. Type messages in the producer and watch them instantly appear in the consumer!
              </Alert>

              <Alert severity="success" sx={{ mt: 2 }}>
                <strong>📝 Key Point:</strong> Consumers read from the beginning (<code>auto_offset_reset='earliest'</code>) and can process messages at their own pace. Multiple consumers with the same <code>group_id</code> automatically share the work!
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

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`from kafka import KafkaAdminClient

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

admin.close()`} />

              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>📝 Key Point:</strong> With managed Kafka (like Confluent Cloud), you don't manage brokers directly. Just connect and start producing/consuming messages!
              </Alert>
            </Paper>

            {/* ==================== DATABRICKS INTRO ==================== */}
            <Paper id="databricks-intro" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
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
                <PlayCircleOutline sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    What is Databricks?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
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
                Key Components
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
            <Paper id="structured-streaming" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
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
                <Timeline sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    Structured Streaming
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
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
            <Paper id="delta-lake" sx={{ p: 4, mb: 4, bgcolor: '#ffffff' }}>
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
                <DataObject sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    Delta Lake
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
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

            {/* ==================== ENVIRONMENT SETUP ==================== */}
            <Paper id="env-setup" sx={{ p: 4, mb: 4 }}>
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
                <Settings sx={{ fontSize: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                    Environment Setup
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                    Prepare your development environment for Kafka streaming
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                Follow these step-by-step instructions to set up your environment on Linux, macOS, or Windows. We'll install Python, create a virtual environment, and install all necessary dependencies.
              </Typography>

              {/* Prerequisites Section */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                📋 Prerequisites
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Before you begin:</strong> Make sure you have administrator/sudo access on your machine and a stable internet connection.
              </Alert>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #4CAF50' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        🐧 Linux (Ubuntu/Debian)
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #2196F3' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        🍎 macOS
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderLeft: '4px solid #FF6B35' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        🪟 Windows
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Step 1: Python Installation */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                Step 1: Install Python 3.13
              </Typography>

              <Typography variant="body1" paragraph>
                Choose the instructions for your operating system:
              </Typography>

              <Box sx={{ mb: 3 }}>
                {/* Linux */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                  🐧 Linux (Ubuntu/Debian)
                </Typography>
                <CodeBlock code={`# Update package list
sudo apt update

# Install Python 3 and pip
sudo apt install python3 python3-pip python3-venv -y

# Verify installation
python3 --version
pip3 --version`} />

                {/* macOS */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                  🍎 macOS
                </Typography>
                <CodeBlock code={`# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python3

# Verify installation
python3 --version
pip3 --version`} />

                {/* Windows */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                  🪟 Windows
                </Typography>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <strong>Option 1 (Recommended):</strong> Download Python from <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" style={{ color: '#FF6B35' }}>python.org</a> and check "Add Python to PATH" during installation.
                  <br /><br />
                  <strong>Option 2 (WSL2):</strong> Use Windows Subsystem for Linux and follow the Linux instructions above.
                </Alert>
                <CodeBlock code={`# After installation, verify in PowerShell or Command Prompt
python --version
pip --version`} />
              </Box>

              {/* Step 2: Clone Workshop Repository */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                Step 2: Clone Workshop Repository
              </Typography>

              <Typography variant="body1" paragraph>
                Clone the workshop repository to get all starter files, requirements, and example code:
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>📦 Workshop Repository:</strong> Contains requirements.txt, .env template, starter code, and examples
              </Alert>

              <CodeBlock code={`# Clone the workshop repository
git clone [GITHUB_REPO_URL_PLACEHOLDER]

# Navigate into the project directory
cd kafka-workshop

# Verify you're in the right directory
pwd  # Linux/Mac
# or
cd  # Windows`} />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                Note: The GitHub repository URL will be provided by your instructor or at the workshop.
              </Typography>

              {/* Step 3: Virtual Environment */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                Step 3: Create Virtual Environment
              </Typography>

              <Typography variant="body1" paragraph>
                Virtual environments isolate your project dependencies from system-wide Python packages.
              </Typography>

              <Box sx={{ mb: 3 }}>
                {/* Linux/macOS */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                  🐧 🍎 Linux / macOS
                </Typography>
                <CodeBlock code={`# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# You should see (venv) prefix in your terminal`} />

                {/* Windows */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                  🪟 Windows (PowerShell)
                </Typography>
                <CodeBlock code={`# Create virtual environment
python -m venv venv

# Activate virtual environment
.\\venv\\Scripts\\Activate.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# You should see (venv) prefix in your terminal`} />

                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                  🪟 Windows (Command Prompt)
                </Typography>
                <CodeBlock code={`# Activate virtual environment
venv\\Scripts\\activate.bat`} />
              </Box>

              {/* Step 4: Install Dependencies */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                Step 4: Install Kafka Dependencies
              </Typography>

              <Typography variant="body1" paragraph>
                The cloned repository includes a <code>requirements.txt</code> file with all necessary packages. Simply install them:
              </Typography>

              <CodeBlock code={`# Make sure virtual environment is activated (you should see (venv) prefix)

# Upgrade pip first
pip install --upgrade pip

# Install all dependencies from requirements.txt
pip install -r requirements.txt

# Verify installation
pip list | grep confluent  # Linux/Mac
# or
pip list | findstr confluent  # Windows`} />

              <Alert severity="success" sx={{ mb: 3 }}>
                <strong>✅ What gets installed:</strong> confluent-kafka, pandas, numpy, python-dotenv, and optional packages for Avro support and testing
              </Alert>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  📄 requirements.txt (included in the repository)
                </Typography>
                <CodeBlock code={`# Kafka client library
confluent-kafka==2.3.0

# Data processing
pandas==2.1.4
numpy==1.26.2

# Logging and utilities
python-dotenv==1.0.0

# Optional: For Avro/Schema Registry support
fastavro==1.9.0

# Optional: For testing
pytest==7.4.3
pytest-mock==3.12.0`} />
              </Box>

              {/* Step 5: Environment Variables */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                Step 5: Configure Environment Variables
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>📋 Your instructor will provide you with a credentials file</strong> (e.g., <code>api-key-XXXXX-student-consumer.txt</code>) containing your Kafka API key and secret.
              </Alert>

              <Typography variant="body1" paragraph>
                The repository includes a <code>.env.example</code> template. Copy it to create your own <code>.env</code> file:
              </Typography>

              <CodeBlock code={`# Copy the example file to create your .env file
cp .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env

# On Windows (Command Prompt)
copy .env.example .env`} />

              <Typography variant="body1" paragraph sx={{ mt: 2, fontWeight: 'bold' }}>
                Then edit the <code>.env</code> file and replace the placeholder values with your actual credentials from the file provided by your instructor:
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2, borderLeft: '4px solid #FF6B35' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  📄 .env
                </Typography>
                <CodeBlock code={`# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=pkc-619z3.us-east1.gcp.confluent.cloud:9092
KAFKA_SECURITY_PROTOCOL=SASL_SSL
KAFKA_SASL_MECHANISM=PLAIN
KAFKA_API_KEY=YOUR_API_KEY_HERE
KAFKA_API_SECRET=YOUR_API_SECRET_HERE

# Consumer Configuration
KAFKA_TOPIC=ecommerce-events
KAFKA_GROUP_ID=workshop-consumer-group`} />
              </Box>

              <Alert severity="warning" sx={{ mb: 3 }}>
                <strong>⚠️ Security Warning:</strong> Add <code>.env</code> to your <code>.gitignore</code> file to prevent committing sensitive credentials!
              </Alert>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3, borderLeft: '4px solid #9C27B0' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  📄 .gitignore
                </Typography>
                <CodeBlock code={`# Python
venv/
__pycache__/
*.pyc
*.pyo
*.egg-info/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp`} />
              </Box>

              {/* Step 6: Verify Installation */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                Step 6: Verify Your Setup
              </Typography>

              <Typography variant="body2" paragraph>
                Create a simple test script to verify everything is working:
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  📄 test_setup.py
                </Typography>
                <CodeBlock code={`#!/usr/bin/env python3
"""Test script to verify Kafka setup"""

import sys
from confluent_kafka import Consumer, KafkaError
from dotenv import load_dotenv
import os

def test_setup():
    print("🔍 Testing Kafka setup...\\n")

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
        print("\\n🎉 Your environment is ready!")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_setup()
    sys.exit(0 if success else 1)`} />
              </Box>

              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                Run the test script:
              </Typography>

              <CodeBlock code={`python test_setup.py`} />

              <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 3 }}>
                <strong>✅ Setup Complete!</strong> If all tests passed, you're ready to start consuming Kafka messages. Proceed to the Python Consumer section below.
              </Alert>

              {/* Quick Reference */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#2c5aa0' }}>
                📚 Quick Reference
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#4CAF50">
                        Activate Virtual Environment
                      </Typography>
                      <CodeBlock code={`# Linux/Mac
source venv/bin/activate

# Windows PowerShell
.\\venv\\Scripts\\Activate.ps1

# Windows CMD
venv\\Scripts\\activate.bat`} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#FF6B35">
                        Deactivate Virtual Environment
                      </Typography>
                      <CodeBlock code={`# All platforms
deactivate`} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#2196F3">
                        Install New Package
                      </Typography>
                      <CodeBlock code={`pip install package-name
pip freeze > requirements.txt`} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#9C27B0">
                        Common Issues
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        • Permission denied: Use <code>sudo</code> or run as admin
                        <br />
                        • Command not found: Add Python to PATH
                        <br />
                        • Module not found: Activate venv first
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
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

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`from kafka import KafkaConsumer
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
`} />

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

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`from pyspark.sql import SparkSession
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
`} />

              <Typography variant="h6" sx={{ color: '#4a7ba7', mt: 4, mb: 2 }}>
                Query Delta Tables
              </Typography>

              <Typography variant="body2" paragraph>
                Once streaming data lands in Delta Lake, query it with SQL:
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                Code Preview:
              </Typography>

              <CodeBlock code={`-- Real-time product performance (last hour)
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
`} />

              <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 3 }}>
                <strong>💡 Production recommendations:</strong> (1) Separate bronze (raw), silver (cleaned), and gold (aggregated) layers; (2) Use Delta Lake's MERGE for CDC instead of append; (3) Run OPTIMIZE on streaming tables weekly; (4) Monitor lag with <code>spark.streams.awaitAnyTermination()</code> metrics; (5) Set appropriate watermarks based on data lateness patterns.
              </Alert>
            </Paper>

          </Container>
        </Box>
      </Box>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Box
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            cursor: 'pointer',
            bgcolor: '#2196F3',
            color: 'white',
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#1976D2',
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            },
          }}
        >
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>↑</Typography>
        </Box>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <Box
          sx={{
            position: 'fixed',
            top: 300,
            right: 32,
            zIndex: 2000,
            bgcolor: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: 'white',
            p: 3,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(255,215,0,0.4)',
            minWidth: 300,
            animation: 'slideIn 0.5s ease-out',
            '@keyframes slideIn': {
              '0%': {
                transform: 'translateX(400px)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmojiEvents sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Achievement Unlocked!
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '32px', mr: 2 }}>{showAchievement.icon}</Typography>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {showAchievement.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {showAchievement.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
