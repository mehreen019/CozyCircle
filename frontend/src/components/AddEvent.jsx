import React, { useState, useEffect }  from 'react'
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomizedInput from './shared/CustomizedInput';
import { Box, Typography, Button } from '@mui/material'
import './Popup.css'
import { addEvent } from '../helpers/api_communicator';
import NavigationLink from './shared/NavigationLink';
import { getAuthToken } from '../helpers/axios_helper';

const AddEvent = () => {

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    }
  }, [auth, navigate]);


  const handleSubmit = async (e)=>{

    e.preventDefault();
    const data = new FormData(e.currentTarget)

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
      const response = await addEvent(name, username, description, place, city, country, date,userId,rating,capacity,category);
      console.log(response)

      toast.loading("Event Added Successfuly");
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

    //props.setTrigger(false)
    console.log(username + " and " + name + " "+userId);
  }

  return (
    (
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
            <CustomizedInput type="category" name="category" label="Category" />
            <CustomizedInput type="description" name="description" label="Description" />
            <CustomizedInput type="place" name="place" label="Place" />
            <CustomizedInput type="city" name="city" label="City" />
            <CustomizedInput type="country" name="country" label="Country" />
            <CustomizedInput type="date" name="date" label="Date" />
            <CustomizedInput type="number" name="capacity" label="Capacity" />
          
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
  )

 /* return (
    (props.trigger) ?
    (
    <div className='popup'>
      <div className='popup-inner'>
      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5 }}
        justifyContent={"center"}
        alignItems={"center"}
        padding={2}
        ml={"auto"}
        mt={16}
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
              }}
              
            >
              Add
            </Button>
            <Button 
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
            }}
            onClick={()=> props.setTrigger(false)}> Close </Button>
          </Box>
        </form>
      </Box>
      </div>
    </div>
    )
    :
    ""
  )*/
}

export default AddEvent
