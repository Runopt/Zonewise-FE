import React, { useState } from 'react';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/images/logo.svg';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeftSignUp = () => {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setEmailError(false);
    setPasswordError(false);

    if (!isValidEmail(email)) {
      setEmailError(true);
      toast.error('Invalid email format. Example: example@domain.com', {
        position: 'top-right',
      });
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError(true);
      toast.error(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.',
        { position: 'top-right' },
      );
      return;
    }

    if (!agreeTerms) {
      toast.error('You must agree to the terms and conditions', {
        position: 'top-right',
      });
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setPendingVerification(true);
      setIsVerifying(true);
      toast.info('Please check your email for the verification code', {
        position: 'top-right',
      });
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred', {
        position: 'top-right',
      });
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !pendingVerification) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        toast.success('Account created successfully! Redirecting...', {
          position: 'top-right',
          autoClose: 2000,
        });
        
        // Force redirect to home page
        setTimeout(() => {
          window.location.replace('/home');
        }, 2000);
      } else {
        toast.error('Verification failed. Please try again.', {
          position: 'top-right',
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code', {
        position: 'top-right',
      });
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/home`
      });
    } catch (error: any) {
      toast.error(error.message || 'Google signup failed', {
        position: 'top-right',
      });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="left-signup-container">
      <ToastContainer />
      <div className="logo">
        <Image src={Logo} alt="logo" width={120} height={48} />
      </div>
      <div className="form-container">
        <div className="form-title">
          <h3>Create your account</h3>
          <p>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>

        {!isVerifying ? (
          <form className="form" onSubmit={handleSignUp}>
            <div className="field">
              <Label value="Email" />
              <Input
                type="email"
                placeHolder="Enter Your Email Address"
                value={email}
                name="email"
                className={emailError ? 'error' : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
              />
            </div>

            <div className="field" id="password">
              <Label value="Password" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeHolder="Enter Your Password"
                value={password}
                name="password"
                className={passwordError ? 'error' : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
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

            <div className="agree-terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                title="Accept terms and conditions"
                aria-label="Accept terms and conditions"
              />
              <p>
                You confirm you've read and accepted Runopt <a href="">terms</a>{' '}
                and <a href="">privacy policy</a>
              </p>
            </div>

            <Button type="submit" id="create-account" value="Create Account" />
          </form>
        ) : (
          <form className="form" onSubmit={handleVerification}>
            <div className="field">
              <Label value="Verification Code" />
              <Input
                type="text"
                placeHolder="Enter verification code from your email"
                value={verificationCode}
                name="verificationCode"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVerificationCode(e.target.value)
                }
              />
            </div>
            <Button type="submit" id="verify-email" value="Verify Email" />
          </form>
        )}

        <div className="or">
          <div className="border"></div>
          <div className="title">OR</div>
          <div className="border"></div>
        </div>

        <div className="other-auth-btn">
          <button onClick={handleGoogleSignUp}>
            <img src="/images/icons/google-icon.svg" alt="Google icon" />
            Continue With Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSignUp;
