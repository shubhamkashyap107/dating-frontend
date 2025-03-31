import React from 'react'
import Navbar from './Components/Navbar'
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './Components/ProtectedRoutes';
import Home from './Components/Home';
import Auth from './Components/Auth';
import Profile from './Components/Profile';
import MyProfile from './Components/MyProfile';
import Connections from './Components/Connections';

const App = () => {
  return (
    <div>
      <Toaster />

      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/connections' element={<Connections />} />
          <Route path='/profile' element={<MyProfile />} />
          <Route path='/profile/edit' element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App