import Vue from "vue";
import Router from "vue-router";
import store from './store.js'

Vue.use(Router);

const base = "/"

let router = new Router({
  mode: "history",
  base,

  routes: [
    {
      path: "/",
      name: "home",
      meta: { 
        title: "Home",
      },
      component: require("@/components/Home.vue").default // load sync home
    },
    {
      path: "/search",
      name: "search",
      meta: { 
        title: "Search",
        requiresAuth: true,
      },
      component: require("@/components/Search.vue").default // load sync home
    },
    {
      path: "/my_profile",
      name: "Profile",
      meta: { 
        title: "My Profile",
        requiresAuth: true,
      },
      component: require("@/components/MyProfile.vue").default // load sync home
    },
    {
      path: "/friends",
      name: "My Friends",
      meta: { 
        title: "Friends",
        requiresAuth: true,
      },
      component: require("@/components/Friends/Friends.vue").default // load sync home
    },
    {
      path: "/friends_of_friends/:id",
      name: "Friends Of Friends",
      meta: { 
        title: "Friends' friends",
        requiresAuth: true,
      },
      component: require("@/components/Friends/FriendsOfFriends.vue").default // load sync home
    },
    {
      path: "/sent_requests",
      name: "Sent Requests",
      meta: { 
        title: "Send Requests",
        requiresAuth: true,
      },
      component: require("@/components/Friends/SentRequests.vue").default // load sync home
    },
    {
      path: "/recieved_requests",
      name: "Recieved Requests",
      meta: { 
        title: "Recieved Requests",
        requiresAuth: true,
      },
      component: require("@/components/Friends/RecievedRequests.vue").default // load sync home
    },
    {
      path: "/chat",
      name: "Chat Component",
      meta: { 
        title: "Chat",
        requiresAuth: true,
      },
      component: require("@/components/Chat/Chat.vue").default // load sync home
    },
    {
      path: "/user/:id",
      name: "User Profile",
      meta: { 
        title: "Profile",
      },
      component: require("@/components/Profile.vue").default // load sync home
    },
    { path: '/post/:id',
      name: 'Post Details',
      meta: { 
        title: "Details",
        requiresAuth: true
      },
     component: require("@/components/PostDetails.vue").default // load sync home 
    },
    {
      path: "/notifications",
      name: "notifications",
      meta: { 
        title: "Notifications",
        requiresAuth: true
      },
      component: require("@/components/Notifications.vue").default // load sync home
    },
    {
      path: "/settings",
      name: "settings",
      meta: { 
        title: "Settings",
        requiresAuth: true,
      },
      component: require("@/components/Settings.vue").default // load sync home
    },
    {
      path: "/reset-password",
      name: "reset password",
      meta: { 
        title: "Reset Password",
        requiresAuth: true,
        layout: "auth" 
      },
      component: require("@/components/Auth/Reset.vue").default // load sync home
    },
    {
      path: "/change-number",
      name: "Change Phone",
      meta: { 
        title: true,
        requiresAuth: true,
        layout: "auth" 
      },
      component: require("@/components/Auth/ChangeNumber.vue").default // load sync home
    },
    {
      path: "/privacy",
      name: "Privacy",
      meta: { 
        title: "Privacy",
        requiresAuth: true,
      },
      component: require("@/components/Privacy.vue").default // load sync home
    },
    {
      path: "/block-list",
      name: "Block List",
      meta: { 
        title: "BlockList",
        requiresAuth: true,
      },
      component: require("@/components/Blocklist.vue").default // load sync home
    },
    {
      path: "/login",
      name: "login",
      meta: { 
        title: "Login",
        layout: "auth"
       },
      component: () => import("@/components/Auth/Login.vue")
    },
    {
      path: "/register",
      name: "register",
      meta: { 
        title: "Register",
        layout: "auth"
       },
      component: () => import("@/components/Auth/Register.vue")
    },
    {
      path: "/forget",
      name: "Forget Password",
      meta: { 
        title: "Forget Password",
        layout: "auth"
       },
      component: () => import("@/components/Auth/Forget.vue")
    },
    {
      path: "/404",
      name: "notfound",
      meta: { 
        title: "Error",
      },
      component: () => require("@/components/Errors/Notfound.vue").default
    },
    {
      path: "*",
      name: "404*",
      redirect: '/404'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if(nearestWithTitle) document.title = "Swalyf | " + nearestWithTitle.meta.title;
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }

})

export default router