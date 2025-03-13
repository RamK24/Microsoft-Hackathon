import React, {useState, useEffect} from 'react';
import './App.css'
import SignIn from './views/auth/signin'
import {
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate,
} from 'react-router-dom'
import SignUp from './views/auth/signup'
// import Votes from './views/dashboard/votes'
// import UploadCandidacy from './views/dashboard/upload-candidacy'
// import MyVotes from './views/dashboard/my-votes'
// import { getProfile } from './services/auth'

const PrivateRoute =  ({ children }) => {
  const token = localStorage.getItem('token');
  if(!token) return <Navigate to="/" />
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* auth routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        Dashboard 
        {/* <Route
          path="/votes"
          element={
            <PrivateRoute>
              <Votes />
            </PrivateRoute>
          }
        /> */}

        {/* <Route
          path="/upload-candidacy"
          element={
            <PrivateRoute>
              <UploadCandidacy />
            </PrivateRoute>
          }
        /> */}

        {/* <Route
          path="/my-votes"
          element={
            <PrivateRoute>
              <MyVotes />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </Router>
  )
}

export default App