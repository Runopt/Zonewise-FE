import React from 'react'
import LeftSignUp from './left'
import Signup from '@/pages/signup'
import RightSignup from './right'
const SignUpContainer = () => {
  return (
    <div className='signup-container'>
      <LeftSignUp />
      <RightSignup />
    </div>
  );
}

export default SignUpContainer