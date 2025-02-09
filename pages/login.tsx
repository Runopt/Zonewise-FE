import React from 'react'
import LoginContainer from '@/components/authentication/login'
import { SignIn } from "@clerk/nextjs"

const LoginPage = () => {
  return (
    <div className="login-page">
      <LoginContainer />
      <div style={{ display: 'none' }}>
        <SignIn 
          signUpUrl="/signup"
          afterSignInUrl="/"
          redirectUrl="/"
          appearance={{
            elements: {
              rootBox: "hidden",
              card: "hidden"
            }
          }}
        />
      </div>
    </div>
  )
}

export default LoginPage