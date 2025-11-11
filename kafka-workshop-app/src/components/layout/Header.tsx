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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            sx={{
              mr: 4,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            Kafka Workshop
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
              sx={{ textTransform: 'none' }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<MenuBook />}
              onClick={() => navigate('/tutorial')}
              sx={{ textTransform: 'none' }}
            >
              Tutorial
            </Button>
            <Button
              color="inherit"
              startIcon={<PlayArrow />}
              onClick={() => navigate('/generators')}
              sx={{ textTransform: 'none' }}
            >
              Generators
            </Button>
            <Button
              color="inherit"
              startIcon={<EmojiEvents />}
              onClick={() => navigate('/challenges')}
              sx={{ textTransform: 'none' }}
            >
              Challenges
            </Button>
          </Box>

          {/* User Info and Logout */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {currentUser?.email}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
