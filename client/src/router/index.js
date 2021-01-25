import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Dashboard from '../components/Auth/Dashboard.vue'
import Register from '../components/Auth/Register.vue'
import Login from '../components/Auth/Login.vue'

import AuthGuard from '../AuthGuard.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: AuthGuard
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
