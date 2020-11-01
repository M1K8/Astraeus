import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
//import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: "/activity",
    component: Home,
    children: [
      {
        path: "/flock/:slug",
        name: "Flock",
        props: true,
        meta: { requiresAuth: true},
        component: () => 
          import(/* webpackChunkName: "FlockView" */ "../views/children/FlockView.vue")
      },
      {
        path: "/friend/:slug",
        name: "Friend",
        props: true,
        meta: { requiresAuth: true},
        component: () => 
          import(/* webpackChunkName: "FriendView" */ "../views/children/FriendView.vue")
      },
      {
        path: "/activity",
        name: "Activity",
        props: true,
        meta: { requiresAuth: true},
        component: () => 
          import(/* webpackChunkName: "Activity" */ "../views/children/Activity.vue")
      }
    ]
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "About" */ "../views/About.vue")
  },
  {
    path: "/refer",
    name: "Splash",
    component: () =>
      import(/* webpackChunkName: "Splash" */ "../views/Splash.vue"),
    children: [
      {
        path: "/login",
        name: "Login",
        meta: { noobOnly: true },
        props: {login : false },
        component: () =>
          import(/* webpackChunkName: "Login" */ "../views/children/Login.vue")
      },
      {
        path: "/signup",
        name: "Signup",
        meta: { noobOnly: true },
        component: () =>
          import(/* webpackChunkName: "Signup" */ "../views/children/Signup.vue")
      }
    ]
  },
  {
    path: "/:pathMatch(404)",
    alias: '/:pathMatch(.*)*',
    name: "404",
    component: () =>
      import(/* webpackChunkName: "404" */ "../views/About.vue")
  }
 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
