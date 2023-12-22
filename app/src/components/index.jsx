import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { addToCart, selectCartLength } from '../data/cart';
import products from '../data/products'; // Import your products data
import formatCurrency from '../utils/money'; // Import your utility functions
import '../styles/pages/kwuva.css'; // Import your CSS files
import '../styles/shared/general.css';
import '../styles/shared/kwuva-header.css';
import { useAuthContext } from '../context/AuthContext';
import searchIcon from '../images/icons/search-icon.png';
import cartIcon from '../images/icons/cart-icon.png';
import checkmarkIcon from '../images/icons/checkmark.png';
import kwuvaLogo from '../images/kwuva-logo-white.png';
import kwuvaMobileLogo from '../images/kwuva-mobile-logo-white.png';

const ProductGrid = () => {
  const dispatch = useDispatch();
  const cartQuantity = useSelector(selectCartLength);
  const { user, logout } = useAuthContext();
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuantityChange = (productId, event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedQuantity((prevSelectedQuantities) => ({
      ...prevSelectedQuantities,
      [productId]: value !== 0 ? value : 1, // Ensure a minimum quantity of 1
    }));
  };

  const updateCartQuantity = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = 0;
    cart.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;
    });
    console.log('Total Quantity:', totalQuantity);
  };
  const handleAddToCart = (productId, selectedQuantity) => {
    dispatch(addToCart({ productId, quantity: selectedQuantity || 1, deliveryOptionId: '1' }));
    updateCartQuantity();
  };
  const updateWalletStatus = () => {
    if (walletAddress && walletAddress.length > 0) {
      return `Connected: ${walletAddress.substring(0, 6)} ...${walletAddress.substring(38)}`;
    }
    return 'Connect Wallet';
  };

  const handleSetWalletAddress = (address) => {
    setWalletAddress(address);
    updateWalletStatus();
  };
  const getCurrentlyWalletConnect = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length > 0) {
          handleSetWalletAddress(accounts[0]);
        } else {
          console.log('Connect to MetaMask using Connect Wallet');
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log('Please install MetaMask');
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleSetWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log('Please install MetaMask');
    }
  };

  const handleConnectButtonClick = () => {
    connectWallet();
  };

  const addWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        handleSetWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      handleSetWalletAddress('');
    }
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const handleAddToCartClick = (productId) => {
    const quantityToAdd = selectedQuantity[productId] || 1;
    if (!user) {
      navigate('/login');
    } else {
      handleAddToCart(productId, quantityToAdd);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      updateCartQuantity();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    updateCartQuantity();
  }, []);

  useEffect(() => {
    getCurrentlyWalletConnect();
    addWallet();
  }, []);
  useEffect(() => {
    console.log('Cart Quantity Changed:', cartQuantity);
  }, [cartQuantity]);
  return (
    <div>
      <header className="kwuva-header">
        <NavLink to="/" className="header-link">
          <img className="kwuva-logo" src={kwuvaLogo} alt="Logo" />
          <img className="kwuva-mobile-logo" src={kwuvaMobileLogo} alt="Mobile Logo" />
        </NavLink>

        <div className="kwuva-header-middle-section">
          <input className="search-bar" type="text" placeholder="Search" />
          <button type="submit" className="search-button">
            <img className="search-icon" src={searchIcon} alt="Search Icon" />
          </button>
        </div>

        <div className="loginpage">
          {!user ? (
            <NavLink to="/login" className="sign-btn">Sign In</NavLink>
          ) : (
            <button type="submit" className="sign-btn" onClick={handleLogout}>Log Out</button>
          )}
        </div>

        {user ? (
          <>
            <NavLink
              to={user ? '/checkout' : '/login'}
              className={`cart-link header-link ${!user ? 'disabled-link' : ''}`}
              onClick={handleCartClick}
            >
              <img className="cart-icon" src={cartIcon} alt="Cart Icon" />
              <div className="cart-quantity js-cart-quantity">{cartQuantity}</div>
              <div className="cart-text">Cart</div>
            </NavLink>
          </>
        ) : null}

        <div>
          <button type="submit" className="sign-btn" id="connectWalletButton" onClick={handleConnectButtonClick}>
            <span id="walletStatus">{updateWalletStatus()}</span>
          </button>
        </div>
      </header>

      <div className="main">
        <div className="products-grid js-products-grid">
          {products.map((product) => (
            <div className="product-container" key={product.id}>
              <div className="product-image-container">
                <img className="product-image" src={product.image} alt="Product" />
              </div>
              <div className="product-name limit-text-to-2-lines">{product.name}</div>
              <div className="product-rating-container">
                <div className="product-rating-count link-primary">{product.rating.count}</div>
              </div>
              <div className="product-price">
                $TLOS
                {formatCurrency(product.priceCents)}
              </div>
              <div className="product-quantity-container">
                <select
                  onChange={(event) => handleQuantityChange(product.id, event)}
                  value={selectedQuantity[product.id] || 1}
                >
                  {[...Array(10).keys()].map((index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="product-spacer" />
              <div className="added-to-cart">
                <img src={checkmarkIcon} alt="Checkmark" />
                Added
              </div>
              <button
                type="submit"
                className="add-to-cart-button button-primary js-add-to-cart"
                onClick={() => handleAddToCartClick(product.id)}
                data-product-id={product.id}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
