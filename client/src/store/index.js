import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'

import { defaultClient as apolloClient } from '../main.js'

import { GET_CURRENT_USER, GET_CUSTOMERS, SIGNIN_USER, SIGNUP_USER, ADD_CUSTOMER, UPDATE_CUSTOMER } from '../queries.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    customers: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setCustomers: (state, payload) => {
      state.customers = payload
    },
    setUser: (state, payload) => {
      state.user = payload
    },
    setLoading: (state, payload) => {
      state.loading = payload
    },
    setError: (state, payload) => {
      state.error = payload
    },
    clearUser: state => state.user = null,
    clearError: state => state.error = null
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true)
      apolloClient.query({
        query: GET_CURRENT_USER
      }).then(({ data }) => {
        commit('setLoading', false)

        // Add user data to state
        commit('setUser', data.User)
        console.log(data.User)
      }).catch(err => {
        commit('setLoading', false)
        console.error(err)
      })
    },
    getCustomers: ({ commit }) => {
      // use ApolloClient to fire Customers query
      commit('setLoading', true)
      apolloClient.query({
        query: GET_CUSTOMERS
      }).then(({ data }) => {
        commit('setCustomers', data.Customers);
        commit('setLoading', false)
      }).catch(err => {
        commit('setLoading', false)
        console.error(err)
      })
    },
    signUpUser: ({ commit }, payload) => {
      commit('clearError')
      // clear token to prevent error is token is malformed
      localStorage.setItem('token', '')

      apolloClient.mutate({
        mutation: SIGNUP_USER,
        variables: payload
      }).then(({ data }) => {
        localStorage.setItem('token', data.signUpUser.token)

        // to make sure created method is run in main.js (getCurrentUser), reload page
        router.go()
      }).catch(err => {
        commit('setError', err)
        console.error(err)
      })
    },
    signInUser: ({ commit }, payload) => {
      commit('clearError')
      // clear token to prevent error is token is malformed
      localStorage.setItem('token', '')

      apolloClient.mutate({
        mutation: SIGNIN_USER,
        variables: payload
      }).then(({ data }) => {
        localStorage.setItem('token', data.signInUser.token)

        // to make sure created method is run in main.js (getCurrentUser), reload page
        router.go()
      }).catch(err => {
        commit('setError', err)
        console.error(err)
      })
    },
    signOutUser: async ({ commit }) => {
      // clear user in state
      commit('clearUser')
      // remove token inn localStorage
      localStorage.setItem('token', '')
      // end session
      await apolloClient.resetStore()
    },
    updateCustomer: ({ commit, state }, payload) => {
      apolloClient.mutate({
        mutation: UPDATE_CUSTOMER,
        variables: payload
      }).then(({ data }) => {
        // console.log('[state customer]', state.customers)
        // console.log('[updated post]', data.updateCustomer)
        const index = state.customers.findIndex(cust => cust._id === data.updateCustomer._id)
        const customers = [...state.customers.slice(0, index), data.updateCustomer, ...state.customers.slice(index + 1)]
        commit('setCustomers', customers)
      }).catch(err => {
        console.log(err)
      })
    },
    addCustomer: (_, payload) => {
      apolloClient.mutate({
        mutation: ADD_CUSTOMER,
        variables: payload,
        update: (cache, { data: { addCustomer } }) => {
          // read the query you want to update
          const data = cache.readQuery({ query: GET_CUSTOMERS })
          // create updated data
          addCustomer['_id'] = -1
          data.Customers.push(addCustomer)
          // write updated data back to query
          cache.writeQuery({
            query: GET_CUSTOMERS,
            data
          })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addCustomer: {
            __typename: 'Customer',
            _id: -1,
            ...payload
          }
        }
      }).then(({ data }) => {
        console.log(data.addCustomer)
      }).catch(err => {
        console.error(err)
      })
    }
  },
  getters: {
    customers: state => state.customers,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error
  },
  modules: {
  }
})
