import React from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Header = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="header-container">
      <div className="logo">
        <img src="/images/logo.svg" alt="Runopt" className="logo-image" />
      </div>
      <div className="nav-links">
        <a href="/home" className={router.pathname === '/home' ? 'active' : ''}>Home</a>
        <a href="/zoning" className={router.pathname === '/zoning' ? 'active' : ''}>Zoning</a>
        <a href="/insights" className={router.pathname === '/insights' ? 'active' : ''}>Insights</a>
      </div>
      <div className="user-section">
        {user && (
          <>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
            <div className="user-avatar">
              {user.firstName ? getInitials(user.firstName + ' ' + (user.lastName || '')) : '00'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header; 