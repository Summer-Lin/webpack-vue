import Vue from "vue"
import VueRouter from "vue-router"


const Layout = () => import(/* webpackChunkName: "home" */ '../pages/component/Layout.vue')
const Home = () => import(/* webpackChunkName: "home" */ '../pages/home/index.vue')
const Product = () => import(/* webpackChunkName: "product" */ '../pages/product/index.vue')

const MerchantAdd = () => import(/* webpackChunkName: "merchantAdd" */ '../pages/merchant/add.vue')
const MerchantDetail = () => import(/* webpackChunkName: "merchantDetail" */ '../pages/merchant/detail.vue')



Vue.use(VueRouter)

const routes = [
    { 
        path: '/', 
        component: Layout ,
        redirect: "/home",
        children: [
            { 
                path: 'home', 
                component: Home
            },
            { 
                path: 'product', 
                component: Product 
            },
            {
                path: 'merchant/add', 
                name: "MerchantAdd",
                component: MerchantAdd 
            },
            {
                path: 'merchant/detail', 
                name: "MerchantDetail",
                component: MerchantDetail 
            }
        ]
    },
    
    
]

export default new VueRouter({
  routes 
})  