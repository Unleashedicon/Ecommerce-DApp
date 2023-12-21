import React, {
  useState, createContext, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  function getUser() {
    const temp = localStorage.getItem('user');
    const savedUser = JSON.parse(temp);
    return savedUser || null;
  }

  const [user, setUser] = useState(getUser());

  const login = (username, password) => {
    const loggedInUser = { username, password, email: 'example@example.com' };
    setUser(loggedInUser);
    console.log('Logged in:', loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    console.log('Logged out');
  };

  const signUp = (username, password, email) => {
    const newUser = { username, password, email };
    setUser(newUser);
    console.log('Signed up:', newUser);
  };

  useEffect(() => {
    const temp = JSON.stringify(user);
    localStorage.setItem('user', temp);
    console.log('User updated:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, login, logout, signUp,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => useContext(AuthContext);
