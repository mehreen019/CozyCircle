import React from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import NavigationLink from './shared/NavigationLink';
import { getAuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Menu from './Menu';

const Header = () => {
  const auth = getAuthContext();
  const navigate = useNavigate();

  const handleNavigation = () => {
    console.log(auth.user);
    navigate("/ExploreEvent");
  };

  return (
    <>
      <AppBar sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        {auth?.isLoggedIn && <Menu />}
          <div>
            {auth?.isLoggedIn ? (
              <>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <NavigationLink
                    bg="#6D5147"
                    textColor="white"
                    to="/"
                    text="Logout"
                    onClick={auth.logout}
                  />
                  {auth.inExplore ? (
                    <NavigationLink
                      bg="#AE9D99"
                      textColor="black"
                      to="/Dashboard"
                      text="Dashboard"
                      onClick={auth.toggleExplore}
                    />
                  ) : (
                    <NavigationLink
                      bg="#AE9D99"
                      textColor="black"
                      to="/ExploreEvent"
                      text="Explore Events"
                      onClick={auth.toggleExplore}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <NavigationLink
                    bg="#AE9D99"
                    to="/login"
                    text="Login"
                    textColor="black"
                  />
                  <NavigationLink
                    bg="#6D5147"
                    textColor="white"
                    to="/signup"
                    text="Signup"
                  />
                </div>
              </>
            )}
          </div>
         

        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
