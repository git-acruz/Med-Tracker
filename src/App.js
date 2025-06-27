import React, { useState } from 'react';
import TrackerPage from './pages/TrackerPage';
import LoginForm from './components/LoginForm';

import './App.css';


function App() {

  // const userId = 1; // Global declare of userId since there is no account user yet its just me
  const [user, setUser] = useState(null); // This state will hold user data if logged in, otherwise it's null.

  // This function will be passed to the LoginForm.
  // LoginForm will call it on a successful API response.
  const handleLoginSuccess = (userData) => {
    setUser(userData); // { message: '. . .', userId }
  }

  // This function will be passed to the TrackerPage to handle logout.
  const handleLogout = () => {
    setUser(null);
  };


  return (
    <div className='main-container'>
      {!user && <LoginForm onLoginSuccess={handleLoginSuccess}/>}
      {user && <TrackerPage userId={user.userId} onLogout={handleLogout}/>}
      
    </div>
  );
}

export default App;