import React, { useEffect } from 'react';
import SignUpContainer from '@/components/authentication/signup';
import { SignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/router';

const SignupPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/home');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return <div className="loading-state">Loading...</div>;
  }

  // Show redirecting state when signed in
  if (isSignedIn) {
    return <div className="loading-state">Redirecting to home...</div>;
  }

  return (
    <div className="signup-page">
      <SignUpContainer />
      <div style={{ display: 'none' }}>
        <SignUp 
          signInUrl="/login"
          afterSignUpUrl="/home"
          redirectUrl="/home"
          appearance={{
            elements: {
              rootBox: "hidden",
              card: "hidden"
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignupPage;
