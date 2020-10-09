import { gql } from 'apollo-boost';

const CREATE_USER = gql`
mutation CreateUser($data: userCreateInput){
      createUser(user: $data)
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
mutation CreateProduct($data: productCreateInput){
      createProduct(product: $data)
}
`;

const UPDATE_PRODUCT = gql`
mutation UpdateProduct($id: ID!, $data: productUpdateInput){
      updateProduct(id: $id, dataToUpdate: $data)
}
`;

const DELETE_PRODUCT = gql`
mutation DeleteProduct($id: ID!){
      deleteProduct(id: $id)
}
`;

export { CREATE_USER, UPDATE_USER, DELETE_USER, CREATE_ORDER, DELETE_ORDER, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT };
