import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

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
        component: () => 
          import(/* webpackChunkName: "FlockView" */ "../views/children/FlockView.vue")
      },
      {
        path: "/friend/:slug",
        name: "Friend",
        props: true,
        component: () => 
          import(/* webpackChunkName: "FriendView" */ "../views/children/FriendView.vue")
      },
      {
        path: "/add",
        name: "AddFriend",
        props: true,
        component: () => 
          import(/* webpackChunkName: "AddFriend" */ "../views/children/AddFriend.vue")
      },
      {
        path: "/activity",
        name: "Activity",
        props: true,
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
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue")
  },
  {
    path: "/signup",
    name: "Signup",
    component: () =>
      import(/* webpackChunkName: "Signup" */ "../views/Signup.vue")
  },
  //{
  //  path "/404",
  //  alias: "*",
  //  name: "404",
  //  component: () =>
  //    import(/* webpackChunkName: "404" */ "../views/NotFound.vue")
  //}
 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
