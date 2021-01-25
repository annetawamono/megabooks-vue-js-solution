import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo'
import FormAlert from './components/Shared/FormAlert'

// Register global components
Vue.component('form-alert', FormAlert)

Vue.use(VueApollo)

export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // include auth token with requests to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // check to see if there is a token
    if (!localStorage.token) {
      localStorage.setItem('token', '')
    }

    // adds token to an autherization header which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError)
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err)
      }
    }
  }
})

const apolloProvider = new VueApollo({ defaultClient })

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // execute getCurrentUser
    this.$store.dispatch('getCurrentUser')
  }
}).$mount('#app')
