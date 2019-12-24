import Vue from "vue"
import VueRouter from "vue-router"

// import Home from "../pages/home/index.vue"
// import Product from "../pages/product/index.vue"
const Home = () => import(/* webpackChunkName: "home" */ '../pages/home/index.vue')
const Product = () => import(/* webpackChunkName: "product" */ '../pages/product/index.vue')

Vue.use(VueRouter)

const routes = [
    { 
        path: '/home', 
        component: Home 
    },
    { 
        path: '/product', 
        component: Product 
    },
    
]

export default new VueRouter({
  routes 
})  