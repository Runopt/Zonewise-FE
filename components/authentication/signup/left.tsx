import React from 'react';
import Label from '../ui/label';
import Input from '../ui/input';
import Button from '../ui/button';
import Link from 'next/link';

const LeftSignUp = () => {
  return (
    <div className="left-signup-container">
      <div className="logo">Runopt</div>

      <div className="form-container">
        <div className="form-title">
          <h3>Create your account</h3>
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>

        <div className="form">
          <div className="field">
            <Label value="Company Name" />
            <Input
              type="text"
              placeHolder="Enter Company Name"
              value=""
              name="companyName"
              defaultValue=""
              onChange={() => {}}
            />
          </div>

          <div className="field">
            <Label value="Email" />
            <Input
              type="email"
              placeHolder="Enter Your Email Address"
              value=""
              name="email"
              defaultValue=""
              onChange={() => {}}
            />
          </div>

          <div className="field" id="password">
            <Label value="Password" />
            <Input
              type="password"
              placeHolder=""
              value=""
              name="password"
              defaultValue=""
              onChange={() => {}}
            />

            <img src="../images/icons/view.svg" alt="" />
          </div>

          <div className="agree-terms">
            <input type="checkbox" placeholder="t" />
            <p>
              You confirm you’ve read and accepted Runopt <a href=""> terms </a>
              and <a href=""> privacy policy</a>
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

export default LeftSignUp;
