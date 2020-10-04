import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/flock/:slug",
    name: "Flock",
    props: true,
    component: () => 
      import(/* webpackChunkName: "Flock" */ "../views/Flock.vue")
  },
  {
    path: "/friend/:slug",
    name: "Friend",
    props: true,
    component: () => 
      import(/* webpackChunkName: "Friend" */ "../views/Friend.vue")
  },
  {
    path: "/search",
    name: "Search",
    props: true,
    component: () => 
      import(/* webpackChunkName: "Search" */ "../views/Search.vue")
  }


  //{
  //  path: "/login",
  //  name: "Login",
  //  component: () =>
  //    import(/* webpackChunkName: "login" */ "../views/Login.vue")
  //},
  //{
  //  path: "/signup",
  //  name: "Signup",
  //  component: () =>
  //    import(/* webpackChunkName: "signup" */ "../views/Signup.vue")
  //}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
