import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Logo from '@/public/images/logo.svg';
import Image from 'next/image';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';
import Link from 'next/link';
import { useSignIn, useClerk, useAuth } from '@clerk/nextjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeftLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();

  // Check for existing session and redirect
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/home');
    }
  }, [isLoaded, isSignedIn, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      // Now attempt to sign in
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        toast.success('Login successful! Redirecting...', {
          position: 'top-right',
          autoClose: 2000,
        });

        setTimeout(() => {
          router.push('/home');
        }, 2000);
      } else {
        toast.error('Login failed. Please check your credentials.', {
          position: 'top-right',
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials', {
        position: 'top-right',
      });
    }
  };

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/login',
        redirectUrlComplete: '/home',
      });
    } catch (error: any) {
      toast.error(error.message || 'Google login failed', {
        position: 'top-right',
      });
    }
  };

  // Show loading state while checking auth status
  if (!isLoaded) {
    return <div className="loading-state">Loading...</div>;
  }

  // If already signed in, show redirect message
  if (isSignedIn) {
    return <div className="loading-state">Redirecting to home...</div>;
  }

  return (
    <div className="left-signup-container">
      <ToastContainer />
      <div className="logo">
        <Image src={Logo} alt="logo" width={120} height={48} />
      </div>
      <div className="form-container">
        <div className="form-title">
          <h3>Sign in to your account</h3>
          <p>
            Don't have an account yet?
            <Link href="/signup"> Sign Up</Link>
          </p>
        </div>

        <form className="form" onSubmit={handleLogin}>
          <div className="field">
            <Label value="Email" />
            <Input
              type="email"
              placeHolder="Enter Your Email Address"
              value={email}
              name="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="field" id="password">
            <Label value="Password" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeHolder="Enter Your Password"
              value={password}
              name="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <img
              src={
                showPassword
                  ? '/images/icons/close-view.svg'
                  : '/images/icons/view.svg'
              }
              alt="Toggle password visibility"
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
            />
          </div>

          <div className="forgot-password">
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <Button id="sign-in" type="submit" value="Sign In" />
        </form>

        <div className="or">
          <div className="border"></div>
          <div className="title">OR</div>
          <div className="border"></div>
        </div>

        <div className="other-auth-btn">
          <button type="button" onClick={handleGoogleLogin}>
            <img src="/images/icons/google-icon.svg" alt="Google icon" />
            Continue With Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftLogin;
