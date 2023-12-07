import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './Pages/Home';
import About from './Pages/About';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Header from './Components/Header';
import PrivateProfileRoute from './Components/PrivateProfileRoute';
import CreateListing from './Pages/CreateListing';
import UpdateListings from './Pages/UpdateListings';
import Listing from './Pages/Listing';
import Search from "./Pages/Search"

const App = () => {
  return (
    
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/search" element ={<Search/>}/>
        <Route element={<PrivateProfileRoute/>}>
        <Route path="/profile" element={<Profile/>}/>
        <Route  path="/create-listing" element={<CreateListing/>} />
        <Route  path="/update-listing/:listId" element={<UpdateListings/>} />
        </Route>
        <Route path="/listings/:listingId" element={<Listing/>} />

      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
