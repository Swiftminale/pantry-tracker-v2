// app/Components/dashboard/page.js
'use client';
// app/Components/dashboard/page.js
import { Container, Typography } from '@material-ui/core';
import PantryList from '../PantryList'; // Adjust the path if necessary

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pantry Dashboard
      </Typography>
      <PantryList />
    </Container>
  );
};

export default Dashboard;
