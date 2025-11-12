import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import LoginPage from './page/LoginPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // proveri da li je user u localStorage
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  return (
    <>
      <h1 className='text-amber-600'>Olaaa Amigooooo</h1>

      {user ? (
        <Chat />
      ) : (
        <LoginPage onLogin={(username) => setUser(username)} />
      )}

      <Outlet />
    </>
  );
}

export default App;
