import { gql } from 'apollo-boost';

const UPDATE_USER_SUB = gql`
  subscription {
    userUpdated
  }
`;

const DELETE_USER_SUB = gql`
  subscription{
    userDeleted
  }
`;

const ADD_USER_SUB = gql`
  subscription{
    userAdded
  }
`;

const UPDATE_PRODUCT_SUB = gql`
  subscription {
    productUpdated
  }
`;

const DELETE_PRODUCT_SUB = gql`
  subscription{
    productDeleted
  }
`;

const ADD_PRODUCT_SUB = gql`
  subscription{
    productAdded
  }
`;

const DELETE_ORDER_SUB = gql`
  subscription{
    orderDeleted
  }
`;

const ADD_ORDER_SUB = gql`
  subscription{
    orderAdded
  }
`;

export {
    ADD_ORDER_SUB,
    ADD_PRODUCT_SUB,
    ADD_USER_SUB,
    DELETE_ORDER_SUB,
    DELETE_PRODUCT_SUB,
    DELETE_USER_SUB,
    UPDATE_PRODUCT_SUB,
    UPDATE_USER_SUB
};
