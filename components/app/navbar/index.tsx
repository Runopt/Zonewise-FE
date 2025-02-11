import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '@/public/images/logo.svg';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [pathname, setPathname] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

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

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force a full page redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if there's an error
      window.location.href = '/login';
    }
  };

  const getInitials = () => {
    if (user?.firstName) {
      // Get initials from first and last name
      return (user.firstName + ' ' + (user.lastName || ''))
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    } else if (user?.emailAddresses[0]?.emailAddress) {
      // Get initials from email (first two characters)
      const email = user.emailAddresses[0].emailAddress;
      return email.substring(0, 2).toUpperCase();
    }
    return ''; // Guest User fallback
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

        <div className="user-menu-container">
          <div 
            className="user-profile-icon" 
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {getInitials()}
          </div>
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-name">
                  {user?.firstName 
                    ? `${user.firstName} ${user.lastName || ''}`
                    : user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
                </div>
                {user?.emailAddresses[0]?.emailAddress && (
                  <div className="user-email">{user.emailAddresses[0].emailAddress}</div>
                )}
              </div>
              <div className="menu-divider"></div>
              <button onClick={handleSignOut} className="sign-out-btn">
                <img src="/images/icons/logout.png" width={18} height={18} alt="Sign out" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
