import { useState, useEffect } from 'react';
import { db, collection, doc, deleteDoc, onSnapshot } from '../../firebaseConfig'; // Ensure this path is correct
import { Button, Container, Paper, CardContent, CardMedia, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';
import AddEditPantryItem from './AddEditPantryItem';

const PantryList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    const itemsCollection = collection(db, 'pantryItems');
    const unsubscribe = onSnapshot(itemsCollection, snapshot => {
      const itemList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      const itemDoc = doc(db, 'pantryItems', id);
      await deleteDoc(itemDoc);
      setNotification({ open: true, message: 'Item deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting item: ', error);
      setNotification({ open: true, message: 'Error deleting item', severity: 'error' });
    }
  };

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter(item => category ? item.category === category : true);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ 
            backgroundColor: '#fff', // White background for contrast
            borderRadius: 1,
            boxShadow: 2, // Add shadow to make it pop out
            '& .MuiInputBase-input': {
              padding: '12px', // Increase padding for better spacing
            },
            '& .MuiFormLabel-root': {
              color: '#333' // Dark color for better readability
            },
            '&:hover': {
              boxShadow: 4 // Increase shadow on hover
            }
          }}
        />
        <FormControl sx={{ width: 200 }} margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            sx={{ 
              backgroundColor: '#fff', // White background for contrast
              borderRadius: 1,
              boxShadow: 2, // Add shadow to make it pop out
              '& .MuiSelect-select': {
                padding: '12px', // Increase padding for better spacing
              },
              '& .MuiInputBase-input': {
                padding: '12px', // Increase padding for better spacing
              },
              '&:hover': {
                boxShadow: 4 // Increase shadow on hover
              }
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
        onClick={() => { setEditItem(null); setShowAddEdit(true); }}
        sx={{ mb: 3 }}
      >
        Add New Item
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filteredItems.map(item => (
            <Paper
              elevation={8}
              key={item.id}
              sx={{ 
                width: { xs: '100%', sm: '48%', md: '22%' }, // Responsive width
                p: 2,
                boxShadow: 3, // Add shadow here
                borderRadius: 2,
                boxSizing: "border-box",
                transition: '0.3s', // Smooth transition for hover effect
                '&:hover': {
                  boxShadow: 6 // Increase shadow on hover for effect
                }
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
                <Typography variant="h6" gutterBottom>{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity: {item.quantity} {item.unit}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Details: {item.details}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    onClick={() => { setEditItem(item); setShowAddEdit(true); }}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Paper>
          ))}
        </Box>
      )}
      <Dialog open={showAddEdit} onClose={() => setShowAddEdit(false)}>
        <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <AddEditPantryItem item={editItem} onSave={() => setShowAddEdit(false)} />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PantryList;
