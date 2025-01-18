import React, { useState, useRef, ChangeEvent } from 'react';
import Button from '../ui/button';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface OTPInputProps {
  length: number;
}

const EmailVerificationContainer: React.FC<OTPInputProps> = ({ length }) => {
  const [otp, setOTP] = useState<string[]>(new Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newOTP = [...otp];
    newOTP[index] = event.target.value;
    setOTP(newOTP);

    if (event.target.value !== '' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && index > 0 && !otp[index]) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back(); // Navigates back to the previous page
  };

  const userEmail = 'olak******@gmail.com';
  const refreshSecs = 22;

  return (
    <div className="email-verification-container">
      <div className="logo">Runopt</div>

      <div className="form-container">
        <button title="back-btn" className="back-btn" onClick={handleClick}>
          <img src="../images/icons/arrow-left.svg" alt="Back" />
        </button>

        <div className="form-title">
          <h3>Verify Email</h3>
          <p>
            OTP has been sent to <a href="#">{userEmail}</a>, check your email.
          </p>
        </div>
        <div className="form">
          <div className="otp-input">
            {Array.from({ length }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index]}
                placeholder="-"
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(input) => {
                  inputsRef.current[index] = input;
                }}
              />
            ))}
          </div>
        </div>

        <div className="resend-otp">
          <img
            className="refresh-icon"
            src="/images/icons/refresh.svg"
            alt="Refresh"
          />
          <p>Resend Code in {refreshSecs} Secs</p>
        </div>

        <Link href="home">
          <Button type="submit" id="verify-btn" value="Verify Email" />
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationContainer;
