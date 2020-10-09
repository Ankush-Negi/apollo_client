import { gql } from 'apollo-boost';

const SIGNUP_USER = gql`
   mutation SignUpUser($data: UserCreate){
    signUpUser(user: $data)
    }
`;

export {
  SIGNUP_USER,
};
