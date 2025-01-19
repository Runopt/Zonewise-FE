import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Logo from '@/public/images/logo.svg';
import Image from 'next/image';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';
import Link from 'next/link';
import axios from '@/utils/axios';
import { API_ENDPOINTS } from '@/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeftLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      console.log('Login successful:', response.data);

      toast.success('Login successful! Redirecting...', {
        position: 'top-right',
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push('/home');
      }, 3000);
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.response?.data) {
        toast.error(error.response.data.detail || error.response.data.message, {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

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
            Don’t have an account yet?
            <Link href="/"> Sign Up</Link>
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

          <div className="forgot-password">Forgot Password?</div>
          <Button id="sign-in" type="submit" value="Sign In" />
        </form>

        <div className="or">
          <div className="border"></div>
          <div className="title">OR</div>
          <div className="border"></div>
        </div>

        <div className="other-auth-btn">
          <button>
            <img src="/images/icons/google-icon.svg" alt="" />
            Continue With Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftLogin;
