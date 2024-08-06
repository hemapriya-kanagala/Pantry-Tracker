"use client";

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';
import Navbar from '../app/components/Navbar'; 

const HeroSection = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)', // Adjust height to fit below Navbar
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  background: 'linear-gradient(to right, #00c6ff, #0072ff)',
  color: '#fff',
  padding: theme.spacing(4),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const Footer = styled(Box)(({ theme }) => ({
  background: '#282c34',
  color: '#fff',
  padding: theme.spacing(2),
  textAlign: 'center',
  position: 'absolute',
  width: '100%',
  bottom: 0,
}));

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Pantry Tracker
          </Typography>
          <Typography variant="h5" component="h2" paragraph>
            Manage your pantry efficiently and get recipe suggestions based on the items you have.
          </Typography>
          <ButtonContainer>
            <Link href="/pantry" passHref>
              <Button variant="contained" color="secondary" sx={{ marginRight: 2 }}>
                Manage Pantry
              </Button>
            </Link>
            <Link href="/signup" passHref>
              <Button variant="contained" color="secondary" sx={{ marginRight: 2 }}>
                Sign Up
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button variant="contained" color="secondary">
                Log In
              </Button>
            </Link>
          </ButtonContainer>
        </Container>
      </HeroSection>
      <Footer>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Hemapriya Kanagala. All rights reserved.
        </Typography>
      </Footer>
    </>
  );
};

export default LandingPage;
