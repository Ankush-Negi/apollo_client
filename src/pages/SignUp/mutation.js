import { gql } from 'apollo-boost';

const SIGNUP_USER = gql`
   mutation SignUpUser($name: String!, $email: String!, $role: String!, $dob: String!, $address: String!, $password: String!, $number: Int!){
    signUpUser(user: {email: $email, password: $password, name: $name, role: $role, dob: $dob, address: $address})
    }
`;

export {
  SIGNUP_USER,
};
