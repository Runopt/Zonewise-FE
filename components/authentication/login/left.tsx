import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';
import Link from 'next/link';
import axios, { API_ENDPOINTS } from '@/utils/axios';

const LeftLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      setAlertMessage('Login successful!');
      console.log('Navigating to /home');
      router.push('/home');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setAlertMessage(error.response.data.detail || error.response.data.message);
      } else {
        setAlertMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="left-signup-container">
      <div className="logo">Runopt</div>

      <div className="form-container">
        <div className="form-title">
          <h3>Sign in to your account</h3>
          <p>
            Don’t have an account yet?<a href="/"> Sign Up</a>
          </p>
        </div>

        {alertMessage && <div className="server-alert">{alertMessage}</div>}

        <form className="form" onSubmit={handleLogin}>
          <div className="field">
            <Label value="Email" />
            <Input
              type="email"
              placeHolder="Enter Your Email Address"
              value={email}
              defaultValue={email}
              name="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>

          <div className="field" id="password">
            <Label value="Password" />
            <Input
              type="password"
              placeHolder="Enter Your Password"
              value={password}
              defaultValue={password}
              name="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <img src="../images/icons/view.svg" alt="" />
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

          <button id="apple">
            <img src="/images/icons/apple-icon.svg" alt="" />
            Continue With Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftLogin;
