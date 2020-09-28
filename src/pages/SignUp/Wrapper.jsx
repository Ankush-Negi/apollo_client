import React from 'react';
import { Mutation } from '@apollo/react-components';
import { SIGNUP_USER } from './mutation';
import SignUp from './SignUp';

const Wrapper = (props) => (
  <Mutation mutation={SIGNUP_USER}>
    {(signUpUser) => (
      <>
        <SignUp signUpUser={signUpUser} {...props} />
      </>
    )}
  </Mutation>
);

export default Wrapper;
