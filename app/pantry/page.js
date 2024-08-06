"use client";

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, List, ListItem, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { db, auth } from '../../firebase'; // Ensure you have the correct imports
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from '../components/Navbar';

// Styled components for the page layout
const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh', // Ensure the wrapper takes at least the full viewport height
}));

const Content = styled(Container)(({ theme }) => ({
  flex: 1, // Allows the content to grow and push the footer down
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius || 4,
  boxShadow: theme.shadows ? theme.shadows[5] : '0px 3px 5px rgba(0, 0, 0, 0.2)',
  backgroundColor: theme.palette?.background?.paper || '#fff',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Footer = styled(Box)(({ theme }) => ({
  background: '#282c34',
  color: '#fff',
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const PantryPage = () => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1); // Initial quantity
  const [pantryItems, setPantryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const [recipesFetched, setRecipesFetched] = useState(false); // State to track if recipes have been fetched
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login'); // Redirect to login if not authenticated
      } else {
        setUser(currentUser); // Set user state if authenticated
        fetchPantryItems(currentUser.uid); // Fetch user-specific data
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredItems(pantryItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredItems(pantryItems);
    }
  }, [searchQuery, pantryItems]);

  // Handle adding a new item to the pantry
  const handleAddItem = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'pantryItems'), { name: item, quantity });
      setItem('');
      setQuantity(1); // Reset quantity
      fetchPantryItems(user.uid);
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  // Handle deleting an item from the pantry
  const handleDeleteItem = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'pantryItems', id));
      fetchPantryItems(user.uid);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  // Handle updating the quantity of an item
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'pantryItems', id), { quantity: newQuantity });
      fetchPantryItems(user.uid);
    } catch (error) {
      console.error("Error updating quantity: ", error);
    }
  };

  // Fetch pantry items from Firestore
  const fetchPantryItems = async (userId) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users', userId, 'pantryItems'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPantryItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error("Error fetching items: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRecipes = async () => {
    setRecipeLoading(true);
    setRecipesFetched(false); // Reset the fetched state before making the request
    try {
      const ingredients = pantryItems.map(item => `${item.name} (${item.quantity})`).join(', ');
      const response = await axios.post('/api/getRecipe', {
        prompt: `
        Create a detailed recipe using only the following ingredients: ${ingredients}. 
        Ensure the recipe includes:
        - A clear and descriptive recipe title
        - A detailed list of ingredients with their quantities
        - Step-by-step cooking instructions
        - Preparation time
        - Cooking time
        - Serving size
        - A brief description of the dish
        - Any dietary considerations (e.g., vegetarian, vegan, gluten-free) if applicable.
  
        Consider the following scenarios:
        1. **Multiple Proteins**: If there are multiple types of protein (e.g., fish, chicken, beef), prioritize one type for the recipe. Choose based on:
           - The first protein listed
           - The protein with the highest quantity
           - The protein that best complements other ingredients
  
        2. **Drinks and Non-Food Items**: Exclude any non-food items or drinks (e.g., vanilla milkshake, soda) from the recipe. Focus only on ingredients that can be used in cooking. If drinks are included, provide a message indicating they are not used in the recipe.
  
        3. **Insufficient Ingredients**: If the list of ingredients is insufficient to create a balanced recipe, provide recommendations for which ingredients can be omitted or substituted.
  
        4. **Substitution Suggestions**: If an ingredient is missing or less than optimal, suggest possible substitutions based on common alternatives.
  
        5. **Dietary Restrictions**: Adapt the recipe to accommodate any dietary restrictions provided. If no specific restrictions are mentioned, make the recipe versatile enough to fit general dietary needs.
  
        6. **Cooking Method Adaptations**: Adjust cooking methods if certain ingredients require special techniques or if alternative methods are more suitable given the ingredients.
  
        7. **Balancing Flavors**: Ensure the recipe balances flavors and textures even with the limited or varied ingredients. 
  
        Provide a recipe that is not only feasible with the available ingredients but also appetizing and practical for everyday cooking. Ensure that drinks or non-food items are not included in the recipe instructions.
        `
      });
      setRecipes(response.data.split('\n')); // Adjust based on API response structure
      setRecipesFetched(true); // Mark recipes as fetched
    } catch (error) {
      console.error("Error fetching recipes: ", error);
      setRecipesFetched(true); // Mark recipes as fetched even if there was an error
    } finally {
      setRecipeLoading(false);
    }
  };

  return (
    <Wrapper>
      <Navbar />
      <Content>
        <FormContainer>
          <Typography variant="h4" gutterBottom align="center">
            Manage Pantry Items
          </Typography>
          <StyledTextField
            label="New Item"
            variant="outlined"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <StyledTextField
            label="Quantity"
            type="number"
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }} // Prevent negative or zero values
          />
          <ButtonContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              disabled={loading}
            >
              Add Item
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFetchRecipes}
              disabled={recipeLoading}
            >
              Fetch Recipe
            </Button>
          </ButtonContainer>
          <Box mt={4}> {/* Add margin-top to create space */}
            <StyledTextField
              label="Search Pantry Items"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an item..."
            />
          </Box>
          <List>
            {filteredItems.length > 0 ? (
              filteredItems.map(({ id, name, quantity }) => (
                <ListItem key={id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                  <Typography sx={{ flexGrow: 1 }}>
                    {name} (Quantity: {quantity})
                  </Typography>
                  <IconButton onClick={() => handleUpdateQuantity(id, quantity - 1)} disabled={quantity <= 1}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleUpdateQuantity(id, quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteItem(id)} sx={{ ml: 2 }}>
                    Delete
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography>No items match the search query.</Typography>
            )}
          </List>
          <Box mt={3}>
            <Typography variant="h5" gutterBottom>
              {/* Note: For Recipe Suggestion, click "Fetch Recipe" */}
            </Typography>
            {recipeLoading ? (
              <Typography>Loading recipes...</Typography>
            ) : recipesFetched ? (
              recipes.length > 0 ? (
                <List>
                  {recipes.map((recipe, index) => (
                    <ListItem key={index}>
                      <Typography>{recipe}</Typography> {/* Adjust based on recipe data structure */}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No recipes found.</Typography>
              )
            ) : null}
          </Box>
        </FormContainer>
      </Content>
      <Footer>
        <Typography variant="body2">© {new Date().getFullYear()} Hemapriya Kanagala. All rights reserved.</Typography>
      </Footer>
    </Wrapper>
  );
};

export default PantryPage;
