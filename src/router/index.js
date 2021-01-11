import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import User from "../components/users/User.vue";
// import User1 from "../components/users/User1.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";

Vue.use(VueRouter);

const routes = [{
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
        redirect: "/welcome",
        children: [{
                path: "/welcome",
                name: "Welcome",
                component: Welcome,
            },
            {
                path: "/system/user",
                name: "User",
                component: User,
            },
            {
                path: "/rights",
                name: "Rights",
                component: Rights,
            },
            {
                path: "/roles",
                name: "Roles",
                component: Roles,
            },
            {
                path: "/categories",
                name: "Cate",
                component: Cate,
            }
        ]
    },
];

const router = new VueRouter({
    routes,
});
//导航守卫，类似拦截器
router.beforeEach((to, from, next) => {
    //登录页，允许访问，直接放行
    if (to.path === "/login") return next();
    const tokenStr = window.sessionStorage.getItem("token");
    // console.log(tokenStr);
    //没有token强制跳转登录页
    if (!tokenStr) return next("/login");
    //有token允许访问
    next();
});

export default router;
