import React from 'react';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';
import Link from 'next/link';

const LeftLogin = () => {
  return (
    <div className="left-signup-container">
      <div className="logo">Runopt</div>

      <div className="form-container">
        <div className="form-title">
          <h3>Sign in to your account</h3>
          <p>
            Don’t have an account yet?<a href=""> Sign In</a>
          </p>
        </div>

        <div className="form">
          <div className="field">
            <Label value="Email" />
            <Input
              type="email"
              placeHolder="Enter Your Email Address"
              value=""
              name=""
            />
          </div>

          <div className="field" id="password">
            <Label value="Password" />
            <Input type="password" placeHolder="" value="" name="" />

            <img src="../images/icons/view.svg" alt="" />
          </div>

          <div className="forgot-password">Forogot Password?</div>
          <Link href="./email-verification">
            <Button id="sign-in" type="submit" value="Sign In" />
          </Link>
        </div>

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
