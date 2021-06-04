import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { BsBook } from 'react-icons/bs';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';


function Navbar() {
  const {currentUser} = useAuth();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            <BsBook />
            <div style={{ whiteSpace: 'pre' }}>  BookLand </div>
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/services'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Books
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/products'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Prod
              </Link>
            </li>
            {
              currentUser ? (
                <>
                  <li className='nav-item'>
                    <Link to='/my-books'
                      className='nav-links'
                      onClick={closeMobileMenu}
                    >
                      My books
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/logout'
                      className='nav-links'
                      onClick={closeMobileMenu}
                    >
                      Log Out
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className='nav-item'>
                    <Link to='/login'
                      className='nav-links'
                      onClick={closeMobileMenu}
                    >
                      Log In
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/signup'
                      className='nav-links'
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )
            }
            
            
          </ul>
          {/* {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>} */}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
