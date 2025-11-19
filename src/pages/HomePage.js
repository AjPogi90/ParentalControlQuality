import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HomePage = () => {
  const navigate = useNavigate();
  const [productOpen, setProductOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const handleMenuToggle = () => {
    setProductOpen((v) => {
      const next = !v;
      if (next) {
        setLearnOpen(false);
        setSupportOpen(false);
      }
      return next;
    });
  };

  const handleLearnToggle = () => {
    setLearnOpen((v) => {
      const next = !v;
      if (next) {
        setProductOpen(false);
        setSupportOpen(false);
      }
      return next;
    });
  };

  const handleSupportToggle = () => {
    setSupportOpen((v) => {
      const next = !v;
      if (next) {
        setProductOpen(false);
        setLearnOpen(false);
      }
      return next;
    });
  };

  const PlanCard = ({ title, price, subtitle, highlighted }) => (
    <Card
      elevation={highlighted ? 8 : 2}
      sx={{
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        minHeight: 380,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: highlighted ? 16 : 8,
        },
      }}
    >
      {highlighted && (
        <Box sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)' }}>
          <Chip label="BEST VALUE" sx={{ bgcolor: '#ffd54f', color: '#000', fontWeight: 700, fontSize: '0.75rem' }} />
        </Box>
      )}

      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: highlighted ? '#5b4bd6' : '#fff',
          color: highlighted ? '#fff' : 'inherit',
          p: 4,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            {title}
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            {price}
          </Typography>

          <Typography variant="caption" sx={{ opacity: 0.8, mb: 3, display: 'block' }}>
            {subtitle}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {title === 'Basic'
              ? 'The tools you need for core protection.'
              : 'Advanced safety features with full customization.'}
          </Typography>
        </Box>

        <Box>
          <Button
            variant={highlighted ? 'contained' : 'outlined'}
            size="large"
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: highlighted ? '#fff' : 'transparent',
              color: highlighted ? '#5b4bd6' : '#5b4bd6',
              borderColor: '#5b4bd6',
              '&:hover': {
                bgcolor: highlighted ? '#f5f5f5' : 'rgba(91, 75, 214, 0.05)',
              },
              mb: 2,
            }}
          >
            Buy now
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{
              textTransform: 'none',
              color: highlighted ? 'rgba(255,255,255,0.8)' : '#5b4bd6',
            }}
          >
            See what's included
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#000000' }}>
      {/* Header/Navigation */}
      <AppBar position="static" sx={{ bgcolor: '#000000', color: '#fff', boxShadow: 'none' }}>
        <Toolbar>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/HeaderLogo.png"
              alt="Parental Control"
              sx={{ height: { xs: 28, sm: 36 }, display: 'block' }}
              onClick={() => navigate('/')}
              role="button"
            />
          </Box>

          <Button
            color="inherit"
            onClick={handleMenuToggle}
            sx={{
              textTransform: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              px: 0,
              '&:hover': { bgcolor: 'transparent' },
              borderBottom: productOpen ? '3px solid #ff6b6b' : 'none',
              pb: productOpen ? '6px' : 0,
            }}
          >
            Product
            <ExpandMoreIcon fontSize="small" sx={{ transform: productOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', ml: 0.5 }} />
          </Button>

          {/* Pricing removed as requested */}

          <Button
            color="inherit"
            onClick={handleLearnToggle}
            sx={{
              textTransform: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              px: 0,
              '&:hover': { bgcolor: 'transparent' },
              borderBottom: learnOpen ? '3px solid #25a08b' : 'none',
              pb: learnOpen ? '6px' : 0,
            }}
          >
            Learn
            <ExpandMoreIcon fontSize="small" sx={{ transform: learnOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', ml: 0.5 }} />
          </Button>

          <Button
            color="inherit"
            onClick={handleSupportToggle}
            sx={{
              textTransform: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              px: 0,
              '&:hover': { bgcolor: 'transparent' },
              borderBottom: supportOpen ? '3px solid #25a08b' : 'none',
              pb: supportOpen ? '6px' : 0,
            }}
          >
            Support
            <ExpandMoreIcon fontSize="small" sx={{ transform: supportOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', ml: 0.5 }} />
          </Button>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.18)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.28)' },
              }}
            >
              Log in
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                bgcolor: '#ff6b6b',
                color: '#fff',
                '&:hover': { bgcolor: '#ff5a5a' },
                borderRadius: 2,
                px: 3,
              }}
              onClick={() => navigate('/register')}
            >
              TRY NOW
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Inline Mega Menu (pushes content down) */}
      {productOpen && (
        <Box sx={{ width: '100%', bgcolor: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderTop: '1px solid #eee' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <Box sx={{ p: 2.5, borderRight: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>❓</span> Why Qustodio
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Having the right tools to protect your kids' digital lives is more important than ever.
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  Discover more
                </Button>
              </Box>
              <Box sx={{ p: 2.5, borderRight: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>📋</span> Features
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Balance screen time, filter content, and view activity reports in the way that suits your family.
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  View all features
                </Button>
              </Box>
              <Box sx={{ p: 2.5, borderRight: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚀</span> Get started
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Begin protecting and supervising your child within minutes.
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  Learn how
                </Button>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>⬇️</span> Downloads
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Get Qustodio for every device, from smartphones and tablets to desktops, Chromebooks, and more.
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  Go to downloads
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Inline Learn Mega Menu (pushes content down) */}
      {learnOpen && (
        <Box sx={{ width: '100%', bgcolor: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderTop: '1px solid #eee' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <Box sx={{ p: 2.5, borderRight: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>📋</span> Product tips
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  The latest product updates and features plus handy how-tos to help you get the most out of Parental Control.
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  Read product tips
                </Button>
              </Box>
              <Box sx={{ p: 2.5, borderRight: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>💡</span> Parenting tips
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Fact-based information and research on children's health and safety online, with expert insights.
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  Read parenting tips
                </Button>
              </Box>
              <Box sx={{ p: 2.5, borderRight: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>✔️</span> Safety guides
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Summaries, ratings, warnings and recommendations about the apps and games parents need to know about.
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  Read our guides and reviews
                </Button>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem', color: '#000' }}>
                  <span style={{ fontSize: '1.2rem' }}>👨‍👩‍👧</span> Family stories
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  "Parental Control gives me the peace of mind that I have been looking for to ensure my kids are safe"
                </Typography>
                <Button color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, p: 0, fontSize: '0.9rem' }}>
                  Read more family stories
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Hero Section */}
      <Box sx={{ background: '#000000', color: '#fff', minHeight: '72vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2rem', md: '3.75rem' }, lineHeight: 1.05 }}>
                Parent Monitoring App
                for Loving Protection
              </Typography>

              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, fontSize: '1.05rem' }}>
                You deserve a monitoring app for parental control that keeps up with tomorrow's technology. You deserve Parental Control.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button variant="contained" sx={{ bgcolor: '#ff6b6b', color: '#fff', px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                  TRY NOW
                </Button>

                <Button variant="text" sx={{ color: '#ff6b6b', textTransform: 'none', fontWeight: 700 }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid rgba(255,107,107,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      ▶
                    </Box>
                    See it in action
                  </Box>
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Box sx={{ position: 'relative', width: { xs: 300, md: 420 }, height: { xs: 300, md: 420 } }}>
                  {/* Glow effect background */}
                  <Box sx={{ position: 'absolute', right: -60, top: -60, width: 260, height: 260, borderRadius: '50%', bgcolor: 'radial-gradient(circle at 30% 30%, rgba(255,107,107,0.25), rgba(255,107,107,0.05))', filter: 'blur(40px)', zIndex: 0 }} />
                  {/* Image */}
                  <Box
                    component="img"
                    src="/hero-illustration.png.png"
                    alt="Parental Control Hero"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 1,
                      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Resources Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 Product tips
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                The latest product updates and features plus handy how-tos to help you get the most out of Parental Control.
              </Typography>
              <Button color="primary" sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}>
                Read product tips
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: 1,
                borderTop: '4px solid #25a08b',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                💡 Parenting tips
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                Fact-based information and research on children's health and safety online, with expert insights.
              </Typography>
              <Button color="primary" sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}>
                Read parenting tips
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                ✔️ Safety guides
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                Summaries, ratings, warnings and recommendations about the apps and games parents need to know about.
              </Typography>
              <Button color="primary" sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}>
                Read our guides and reviews
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                👨‍👩‍👧 Family stories
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: '#a8d5ba', flexShrink: 0 }}>A</Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666', mb: 1 }}>
                    "Parental Control gives me the peace of mind that I have been looking for to ensure my kids are safe"
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#000' }}>
                    Allison, mom of two
                  </Typography>
                </Box>
              </Box>
              <Button color="primary" sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}>
                Read more family stories
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
