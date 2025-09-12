'use client';

import { Button, Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Welcome to MUI + Next.js App Router!
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Container>
  );
}
