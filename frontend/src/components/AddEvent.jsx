import { useEffect, useState }  from 'react'
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import './Popup.css'
import { addEvent } from '../helpers/api_communicator';
import NavigationLink from './shared/NavigationLink';

const AddEvent = () => {
  const [category, setCategory] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    }
  }, [auth, navigate]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setFormErrors({...formErrors, category: ''});
  };

  const validateForm = (formData) => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    

    const fields = ['name', 'description', 'place', 'city', 'country', 'date', 'capacity'];
    fields.forEach(field => {
      if (!formData.get(field)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    });

    if (!category) {
      errors.category = 'Category is required';
      toast.error('Category is required');
    }
    
    const selectedDate = new Date(formData.get('date'));
    if (selectedDate < today) {
      errors.date = 'Cannot create events with past dates';
      toast.error('Cannot create events with past dates');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    

    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the form errors");
      return;
    }

    const name = data.get("name");
    const description = data.get("description");
    const place = data.get("place");
    const city = data.get("city");
    const country = data.get("country");
    const date = data.get("date");
    const capacity = data.get("capacity");
    const username = auth.user.username;
    const userId = auth.user.id;
    const rating = 0.0;
    
    try {
      const response = await addEvent(name, username, description, place, city, country, date, userId, rating, capacity, category);
      console.log(response);

      toast.success("Event Added Successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Event couldn't be added");
    }
  }

  const categories = ['Concert', 'Conference', 'Festival', 'Sports', 'Workshop', 'Music', 'Tech', 'Other'];

  // Helper function to set min date to today
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    
    return `${year}-${month}-${day}`;
  };

  return (
    <Box
      display={"flex"}
      flex={{ xs: 1, md: 0.5 }}
      justifyContent={"center"}
      alignItems={"center"}
      padding={2}
      ml={"auto"}
      mt={3}
    >
      <form onSubmit={handleSubmit} >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            padding={2}
            fontWeight={600}
            color={'black'}
          >
          New Event
          </Typography>
          <CustomizedInput 
            type="text" 
            name="name" 
            label="Name" 
            required 
            error={!!formErrors.name}
            helperText={formErrors.name}
            onChange={() => setFormErrors({...formErrors, name: ''})}
          />
          <CustomizedInput 
            type="text" 
            name="description" 
            label="Description" 
            required
            error={!!formErrors.description}
            helperText={formErrors.description}
            onChange={() => setFormErrors({...formErrors, description: ''})}
          />
          <CustomizedInput 
            type="text" 
            name="place" 
            label="Place" 
            required
            error={!!formErrors.place}
            helperText={formErrors.place}
            onChange={() => setFormErrors({...formErrors, place: ''})}
          />
          <CustomizedInput 
            type="text" 
            name="city" 
            label="City" 
            required
            error={!!formErrors.city}
            helperText={formErrors.city}
            onChange={() => setFormErrors({...formErrors, city: ''})}
          />
          <CustomizedInput 
            type="text" 
            name="country" 
            label="Country" 
            required
            error={!!formErrors.country}
            helperText={formErrors.country}
            onChange={() => setFormErrors({...formErrors, country: ''})}
          />
          <CustomizedInput 
            type="date" 
            name="date" 
            label="Date" 
            required
            inputProps={{ min: getTodayString() }}
            error={!!formErrors.date}
            helperText={formErrors.date}
            onChange={() => setFormErrors({...formErrors, date: ''})}
          />
          <CustomizedInput 
            type="number" 
            name="capacity" 
            label="Capacity" 
            required
            inputProps={{ min: 1 }}
            error={!!formErrors.capacity}
            helperText={formErrors.capacity}
            onChange={() => setFormErrors({...formErrors, capacity: ''})}
          />

          <FormControl fullWidth sx={{ my: 1 }} error={!!formErrors.category}>
            <InputLabel id="category-select-label">Category *</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              label="Category *"
              onChange={handleCategoryChange}
              sx={{ width: '400px', mb: 1 }}
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
            {formErrors.category && (
              <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                {formErrors.category}
              </Typography>
            )}
          </FormControl>
        
          <Button
            type="submit"
            sx={{
              px: 2,
              py: 1,
              mt: 2,
              width: "400px",
              borderRadius: 2,
              bgcolor: "#AE9D99",
              color: "black",
              ":hover": {
                bgcolor: "white",
                color: "black",
              },
              marginBottom: '24px'
            }}
          >
            Add
          </Button>
          <NavigationLink
              bg="#6D5147"
              to="/dashboard"
              text="Back"
              textColor="black"
            />
        </Box>
      </form>
    </Box>
  )
}

export default AddEvent
