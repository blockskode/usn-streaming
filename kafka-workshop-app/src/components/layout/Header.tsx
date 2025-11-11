import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
} from '@mui/material';
import {
  Home,
  MenuBook,
  PlayArrow,
  EmojiEvents,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navButtonStyle = (path: string) => ({
    textTransform: 'none',
    px: 2.5,
    py: 1,
    borderRadius: 2,
    fontWeight: location.pathname === path ? 600 : 400,
    bgcolor: location.pathname === path ? 'rgba(255, 107, 53, 0.15)' : 'transparent',
    borderBottom: location.pathname === path ? '3px solid #FF6B35' : '3px solid transparent',
    transition: 'all 0.3s ease',
    '&:hover': {
      bgcolor: 'rgba(255, 107, 53, 0.1)',
      borderBottom: '3px solid #FF6B35',
      transform: 'translateY(-2px)',
    },
  });

  return (
    <AppBar position="fixed" sx={{
      background: 'linear-gradient(90deg, #000000 0%, #1a1a1a 100%)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo/Brand */}
          <Box
            sx={{
              mr: 4,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => navigate('/dashboard')}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Kafka Workshop
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
              sx={navButtonStyle('/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<MenuBook />}
              onClick={() => navigate('/tutorial')}
              sx={navButtonStyle('/tutorial')}
            >
              Tutorial
            </Button>
            <Button
              color="inherit"
              startIcon={<PlayArrow />}
              onClick={() => navigate('/generators')}
              sx={navButtonStyle('/generators')}
            >
              Generators
            </Button>
            <Button
              color="inherit"
              startIcon={<EmojiEvents />}
              onClick={() => navigate('/challenges')}
              sx={navButtonStyle('/challenges')}
            >
              Challenges
            </Button>
          </Box>

          {/* User Info and Logout */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
              }}
            >
              {currentUser?.email}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                px: 2,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,0,0,0.1)',
                  borderColor: '#ff4444',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
