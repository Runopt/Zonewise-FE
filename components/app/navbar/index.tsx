import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '@/public/images/logo.svg'

const Navbar = () => {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const getIconSrc = (
    path: string,
    activeIcon: string,
    inactiveIcon: string,
  ) => {
    return pathname === path ? activeIcon : inactiveIcon;
  };

  return (
    <div className="navbar-container">
      <div className="logo">
        <Image src={Logo} alt='logo' width={100} height={36}/>
      </div>

      <ul>
        <li>
          <a href="./home" className={pathname === '/home' ? 'active' : ''}>
            <img
              src={getIconSrc(
                '/home',
                '../images/icons/home-active.svg',
                '../images/icons/home.svg',
              )}
              alt=""
            />
            <p>Home</p>
          </a>
        </li>

        <li>
          <a href="./zoning" className={pathname === '/zoning' ? 'active' : ''}>
            <img
              src={getIconSrc(
                '/home',
                '../images/icons/zoning.svg',
                '../images/icons/zoning-active.svg',
              )}
              alt=""
            />
            <p>Zoining</p>
          </a>
        </li>

        <li>
          <a href="" className={pathname === '/insight' ? 'active' : ''}>
            <img src="../images/icons/insight.svg" alt="" />
            <p>Insights</p>
          </a>
        </li>
      </ul>

      <div className="navbar-actions">

        <div className="notification">
          <button title="notification">
            <img src="../images/icons/notification.svg" alt="" />
          </button>
        </div>

        <div className="user-profile-icon">OO</div>
      </div>
    </div>
  );
};

export default Navbar;
