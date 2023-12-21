import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/pages/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const location = useLocation();
  const from = location.state?.pathname || '/';
  const navigate = useNavigate();

  const { login, signUp } = useAuthContext();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    console.log('Signing in:', { username, password });
    login(username, password);
    setUsername('');
    setPassword('');
    navigate(from, { replace: true });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!username || !password || !email) return;
    console.log('Signing up:', { username, password, email });
    signUp(username, password, email);
    setUsername('');
    setPassword('');
    setEmail('');
    navigate(from, { replace: true });
  };

  const toggleSignIn = () => {
    setIsSignIn(true);
  };

  const toggleSignUp = () => {
    setIsSignIn(false);
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1 id="title">{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
        <form onSubmit={isSignIn ? handleSignIn : handleSignUp}>
          <div className="input-group">
            <div className="input-field">
              <i className="fa-solid fa-user" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fa-solid fa-lock" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isSignIn && (
              <div className="input-field">
                <i className="fa-solid fa-envelope" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="btn-field">
            <button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
          </div>
          <p className={isSignIn ? 'signup-text' : 'signin-text'}>
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              type="submit"
              onClick={isSignIn ? toggleSignUp : toggleSignIn}
              className={isSignIn ? 'orange-button' : 'orange-button'}
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
