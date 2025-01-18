import React, { useState } from 'react';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/images/logo.svg';

const LeftSignUp = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  return (
    <div className="left-signup-container">
      <div className="logo">
        {' '}
        <Image src={Logo} alt="logo" width={150} height={48} />
      </div>

      <div className="form-container">
        <div className="form-title">
          <h3>Create your account</h3>
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>

        <div className="form">
          {/* <div className="field">
            <Label value="Company Name" />
            <Input
              type="text"
              placeHolder="Enter Company Name"
              value={companyName}
              defaultValue={companyName}
              name="companyName"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
            />
          </div> */}

          <div className="field">
            <Label value="Email" />
            <Input
              type="email"
              placeHolder="Enter Your Email Address"
              value={email}
              defaultValue={email}
              name="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />

            <img src="../images/icons/view.svg" alt="view password" />
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
              You confirm you’ve read and accepted Runopt <a href="">terms</a>{' '}
              and <a href="">privacy policy</a>
            </p>
          </div>

          <Link href="./email-verification">
            <Button type="submit" id="create-account" value="Create Account" />
          </Link>
        </div>

        <div className="or">
          <div className="border"></div>
          <div className="title">OR</div>
          <div className="border"></div>
        </div>

        <div className="other-auth-btn">
          <button>
            <img src="/images/icons/google-icon.svg" alt="Google icon" />
            Continue With Google
          </button>

          <button id="apple">
            <img src="/images/icons/apple-icon.svg" alt="Apple icon" />
            Continue With Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSignUp;
