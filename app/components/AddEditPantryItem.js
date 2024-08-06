import { useState, useEffect } from "react";
import {
  db,
  storage,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../firebaseConfig";
import {
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  ThemeProvider,
} from "@mui/material";
import PantryImage from "../asset/Pantry.jpg"; // Ensure this path is correct
import theme from "../../theme";

const AddEditPantryItem = ({ item, onSave }) => {
  const [name, setName] = useState(item ? item.name : "");
  const [quantity, setQuantity] = useState(item ? item.quantity : "");
  const [category, setCategory] = useState(item ? item.category : "");
  const [unit, setUnit] = useState(item ? item.unit : "pkd");
  const [details, setDetails] = useState(item ? item.details : "");
  const [image, setImage] = useState(item ? item.image : "");
  const [imageFile, setImageFile] = useState(null);
  const [date, setDate] = useState(item ? item.date : "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setDetails(item.details);
      setCategory(item.category);
      setUnit(item.unit);
      setImage(item.image);
      setDate(item.date);
    }
  }, [item]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = "";

      if (imageFile) {
        const imageRef = ref(
          storage,
          `pantryItems/${new Date().toISOString()}_${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const itemRef = doc(
        db,
        "pantryItems",
        item ? item.id : new Date().toISOString()
      );
      await setDoc(itemRef, {
        name,
        quantity,
        category,
        unit,
        details,
        date,
        image: imageUrl || image,
      });

      onSave();
    } catch (error) {
      console.error("Error saving item: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component={Paper}
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 600,
          mx: "auto",
          backgroundImage: `url(${PantryImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#000", // Ensure text color contrasts with the background image
          minHeight: "400px", // Optional: Ensure the container has some minimum height
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
          {item ? "Edit Item" : "Add New Item"}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{ mb: 2, backgroundImage: `url(${PantryImage})` }}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              margin="dense"
              variant="outlined"
              sx={{ width: 300, mb: 1 }}
            />
            <FormControl sx={{ width: 100 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                label="Unit"
              >
                <MenuItem value="pkd">Pkd</MenuItem>
                <MenuItem value="pcs">Pcs</MenuItem>
                <MenuItem value="kg">Kg</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Vegetables">Vegetables</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Grains">Grains</MenuItem>
              <MenuItem value="Proteins">Proteins</MenuItem>
              <MenuItem value="Drinks">Drinks</MenuItem>
              <MenuItem value="Alcohol">Alcohol</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: "16px" }}
            />
            {image || imageFile ? (
              <img
                src={image || URL.createObjectURL(imageFile)}
                alt="Item"
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              />
            ) : null}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button onClick={onSave} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AddEditPantryItem;
