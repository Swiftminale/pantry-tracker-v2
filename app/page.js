"use client";
import PantryList from "./components/PantryList";
import {
  Button,
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import theme from "../theme";

const HomePage = () => {
  return (
    <Container
      sx={{
        mt: 0.25,
        mb: 4,
        p: 1,
        backgroundColor: theme.palette.background.default, // Optional: Background color for the container
      }}
    >
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 0.25, // Increased margin-bottom for better spacing
          p: 1,
          backgroundColor: theme.palette.primary.main, // Background color for Paper
          color: theme.palette.common.white, // Text color
          textAlign: "center", // Center text alignment
          boxShadow: 8, // Increase shadow for depth
          borderRadius: 2, // Rounded corners
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold", // Make text bold
            letterSpacing: 2, // Add letter spacing
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Add text shadow
            color: "white", // Ensure text color contrasts with Paper background
          }}
        >
          Welcome to ማጀት / ጓዳ
        </Typography>
      </Paper>
      <PantryList />
    </Container>
  );
};

export default HomePage;
