import { useState, useEffect } from "react";
import {
  db,
  collection,
  doc,
  deleteDoc,
  onSnapshot,
} from "../../firebaseConfig";
import {
  Button,
  Container,
  Paper,
  CardContent,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  ThemeProvider,
} from "@mui/material";
import AddEditPantryItem from "./AddEditPantryItem";
import theme from "../../theme";

const PantryList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    itemId: null,
  });

  useEffect(() => {
    const itemsCollection = collection(db, "pantryItems");
    const unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
      const itemList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    setConfirmDelete({
      open: true,
      itemId: id,
    });
  };

  const confirmDeleteItem = async () => {
    try {
      const itemDoc = doc(db, "pantryItems", confirmDelete.itemId);
      await deleteDoc(itemDoc);
      setNotification({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting item: ", error);
      setNotification({
        open: true,
        message: "Error deleting item",
        severity: "error",
      });
    } finally {
      setConfirmDelete({
        open: false,
        itemId: null,
      });
    }
  };

  const calculateDaysFromDate = (date) => {
    const today = new Date();
    const itemDate = new Date(date);
    const timeDiff = today - itemDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (category ? item.category === category : true));

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              boxShadow: 2,
              "& .MuiInputBase-input": {
                padding: "12px",
              },
              "& .MuiFormLabel-root": {
                color: "#333",
              },
              "&:hover": {
                boxShadow: 4,
              },
            }}
          />
          <FormControl sx={{ width: 200 }} margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                boxShadow: 2,
                "& .MuiSelect-select": {
                  padding: "12px",
                },
                "& .MuiInputBase-input": {
                  padding: "12px",
                },
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Vegetables">Vegetables</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Grains">Grains</MenuItem>
              <MenuItem value="Proteins">Proteins</MenuItem>
              <MenuItem value="Drinks">Drinks</MenuItem>
              <MenuItem value="Alcohol">Alcohol</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditItem(null);
            setShowAddEdit(true);
          }}
          sx={{ mb: 3 }}
        >
          Add New Item
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {filteredItems.map((item) => (
              <Paper
                elevation={8}
                key={item.id}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "22%" },
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  boxSizing: "border-box",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                {item.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                    sx={{ borderRadius: 1 }}
                  />
                )}
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#00b4d8", fontWeight: "bold" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {item.quantity} {item.unit}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Details: {item.details}
                  </Typography>
                  {item.date && (
                    <>
                      <Typography variant="body2" color="textSecondary">
                        Date: {new Date(item.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Days In the Pantry: {calculateDaysFromDate(item.date)}{" "}
                        days
                      </Typography>
                    </>
                  )}
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setEditItem(item);
                        setShowAddEdit(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(item.id)} color="error">
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Paper>
            ))}
          </Box>
        )}
        <Dialog open={showAddEdit} onClose={() => setShowAddEdit(false)}>
          <DialogContent>
            <AddEditPantryItem
              item={editItem}
              onSave={() => setShowAddEdit(false)}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, itemId: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this item?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDelete({ open: false, itemId: null })}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteItem} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default PantryList;
