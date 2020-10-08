import { gql } from 'apollo-boost';

const LOGIN_USER = gql`
   mutation LoginUser($data: InputCredentials){
    loginUser(payload: $data )
    }
`;

export {
  LOGIN_USER,
};
