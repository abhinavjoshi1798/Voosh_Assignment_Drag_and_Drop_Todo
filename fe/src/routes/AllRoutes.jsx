import React from 'react'
import { Route, Routes } from "react-router-dom";
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import Dashboard from '../Pages/Dashboard';
import NotFound from '../Pages/NotFound';
import PrivateRoute from '../components/PrivateRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AllRoutes = () => {
  return (
    <Routes>
   
   
    <Route path={"/login"} element={<GoogleOAuthProvider clientId="43754449983-78lf69o68qspkpt4offo0siksgf4kstd.apps.googleusercontent.com"><Login /></GoogleOAuthProvider>  } />
    <Route path={"/signup"} element={<GoogleOAuthProvider clientId="43754449983-78lf69o68qspkpt4offo0siksgf4kstd.apps.googleusercontent.com">  <SignUp /></GoogleOAuthProvider>} />
    

    {/* Private Route */}
    <Route path={"/dashboard"} element={<PrivateRoute><Dashboard /></PrivateRoute>  } />
   
    


    <Route path={"*"} element={<NotFound />} />
    

  </Routes>
  )
}

export default AllRoutes
