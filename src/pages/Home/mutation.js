import { gql } from 'apollo-boost';

const CREATE_USER = gql`
mutation CreateUser($name: String!, $email: String!, $role: String!, $dob: String!, $address: String!, $password: String!){
      createUser(user: {name: $name, email: $email, role: $role, dob: $dob, address: $address, password: $password})
}
`;

const UPDATE_USER = gql`
mutation UpdateUser($id: ID!, $name: String, $email: String){
      updateUser(id: $id, dataToUpdate: {email: $email, name: $name})
}
`;

const DELETE_USER = gql`
mutation DeleteUser($id: ID!){
      deleteUser(id: $id)
}
`;

const CREATE_ORDER = gql`
mutation CreateOrder($product: String!, $price: Int!){
      createOrder(order: {product: $product, price: $price})
}
`;

const DELETE_ORDER = gql`
mutation DeleteOrder($id: ID!){
      deleteOrder(id: $id)
}
`;

const CREATE_PRODUCT = gql`
mutation CreateProduct($name: String!, $price: Int!, $description: String!){
      createProduct(product: {name: $name, price: $price, description: $description})
}
`;

const UPDATE_PRODUCT = gql`
mutation UpdateProduct($id: ID!, $name: String, $description: String, $price: Int){
      updateProduct(id: $id, dataToUpdate: {name: $name, price: $price, description: $description})
}
`;

const DELETE_PRODUCT = gql`
mutation DeleteProduct($id: ID!){
      deleteProduct(id: $id)
}
`;

export { CREATE_USER, UPDATE_USER, DELETE_USER, CREATE_ORDER, DELETE_ORDER, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT };
