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

const GET_ALL_USER = gql`
query GetAllUser($skip: Int, $limit: Int){
    getAllUser(options:{skip: $skip,limit: $limit}){
        records {
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
        count,
    }
}
`;

const GET_ALL_ORDER = gql`
query GetAllOrder($skip: Int, $limit: Int){
    getAllOrder(options:{skip: $skip,limit: $limit}){
        record {
          _id
          originalId
          product
          price
          createdAt
          createdBy
        }
        count,
    }
}
`;

const GET_ALL_PRODUCT = gql`
query GetAllProduct($skip: Int, $limit: Int, $all: Boolean!){
    getAllProduct(options:{skip: $skip,limit: $limit,all: $all}){
        records {
          _id
          originalId
          name
          price
          description
          createdAt
          createdBy
        }
        count,
    }
}
`;

export {
  GET_MY_PROFILE, GET_ALL_USER, GET_ALL_ORDER, GET_ALL_PRODUCT
};
