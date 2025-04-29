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
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    }
  }, [auth, navigate]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = data.get("name"); //we get by name
    const description = data.get("description");
    const place = data.get("place");
    const city = data.get("city");
    const country = data.get("country");
    const date = data.get("date");
    const capacity = data.get("capacity");
    const category = data.get("category");
    const username = auth.user.username;
    const userId = auth.user.id;
    const rating = 0.0;
    
    try {
      const response = await addEvent(name, username, description, place, city, country, date, userId, rating, capacity, category);
      console.log(response);

      toast.loading("Event Added Successfully");
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.loading("Event couldn't be added");
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }

    console.log(username + " and " + name + " " + userId + " category: " + category);
  }

  const categories = ['Concert', 'Conference', 'Festival', 'Sports', 'Workshop', 'Music', 'Tech', 'Other'];

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
          <CustomizedInput type="name" name="name" label="Name" />
          <CustomizedInput type="description" name="description" label="Description" />
          <CustomizedInput type="place" name="place" label="Place" />
          <CustomizedInput type="city" name="city" label="City" />
          <CustomizedInput type="country" name="country" label="Country" />
          <CustomizedInput type="date" name="date" label="Date" />
          <CustomizedInput type="number" name="capacity" label="Capacity" />


          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
              sx={{ width: '400px', mb: 1 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
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