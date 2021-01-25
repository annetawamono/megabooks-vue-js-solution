import { gql } from 'apollo-boost'

/* Customer Queries */
export const GET_CUSTOMERS = gql`
query {
  Customers {
    _id
    name
    surname
    email
    phone
    bookDescription
    bookPrice
    purchaseDate
    isbn
  }
}
`

/* User Queries */
export const GET_CURRENT_USER = gql`
  query {
    User {
      name
      surname
    }
  }
`

/* Customer Mutations */

/* User Mutations */
export const SIGNIN_USER = gql`
mutation($email: String!, $password: String!) {
  signInUser(email: $email, password: $password) {
    token
  }
}
`

export const SIGNUP_USER = gql`
mutation($name: String!, $surname: String!, $email: String!, $password: String!) {
  signUpUser(name: $name, surname: $surname, email: $email, password: $password ) {
    token
  }
}
`