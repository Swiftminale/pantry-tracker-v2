// app/Components/landingPage/page.js
'use client'; // Ensure this is present

import Link from 'next/link';
import { Button, Typography, Container } from '@material-ui/core';

const LandingPage = () => {
  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Your Pantry Tracker
      </Typography>
      <Typography variant="h6" gutterBottom>
        Keep track of all your pantry items with ease.
      </Typography>
      <Link href="/dashboard" passHref>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </Link>
    </Container>
  );
};

export default LandingPage;
