import { gql } from 'apollo-boost';

const GET_MY_PROFILE = gql`
query GetMyProfile {
    getMyProfile {
        _id
        originalId
        name
        email
        role
        dob
        address
        createdAt
        createdBy
    }
}
`;

export {
  GET_MY_PROFILE,
};
