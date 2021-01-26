import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'

import { defaultClient as apolloClient } from '../main.js'

import { GET_CURRENT_USER, GET_CUSTOMERS, SIGNIN_USER, SIGNUP_USER } from '../queries.js'

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
