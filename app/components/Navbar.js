"use client";

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { styled } from '@mui/system';
import { auth } from '../../firebase'; // Adjust import based on your setup
import { signOut } from 'firebase/auth';

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme?.palette?.primary?.main || '#1976d2',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme?.palette?.divider || '#ddd'}`,
}));

const NavbarContent = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const NavbarLogo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme?.palette?.common?.white || '#fff',
}));

const NavbarButtons = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme?.spacing(2) || '16px',
}));

const Navbar = () => {
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Optionally redirect or show a message after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <NavbarContainer position="static">
      <Container>
        <NavbarContent>
          <NavbarLogo variant="h6">Pantry Tracker</NavbarLogo>
          <NavbarButtons>
            {user ? (
              <>
                <Button color="inherit" component={Link} href="/pantry">Manage Pantry</Button>
                <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} href="/pantry">Manage Pantry</Button>
                <Button color="inherit" component={Link} href="/signup">Sign Up</Button>
                <Button color="inherit" component={Link} href="/login">Log In</Button>
              </>
            )}
          </NavbarButtons>
        </NavbarContent>
      </Container>
    </NavbarContainer>
  );
};

export default Navbar;
