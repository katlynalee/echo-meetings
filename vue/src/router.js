import Vue from 'vue'
import VueRouter from 'vue-router'

// Views
import Dashboard from './views/dashboard'
import Tasks from './views/tasks'
import Meetings from './views/meetings'
import Teams from "./views/teams/teams"
import AddTeam from "./views/teams/add"
import Login from "./views/login"

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Dashboard,
      name: 'Dashboard',
      meta: {
        title: 'Dashboard - echo',
        group: "dashboard"
      }
    }, {
      path: '/login',
      component: Login,
      name: 'Login',
      meta: {
        title: 'Login - echo',
        group: "login"
      }
    }, {
      path: '/tasks',
      component: Tasks,
      name: 'Tasks',
      meta: {
        title: 'Tasks - echo',
        group: "tasks"
      }
    }, {
      path: '/meetings',
      component: Meetings,
      name: 'Meetings',
      meta: {
        title: 'Meetings - echo',
        group: "meetings"
      }
    }, {
      path: "/teams",
      component: Teams,
      name: "Teams",
      meta: {
        title: "Teams - echo",
        group: "teams"
      }
    }, {
      path:"/teams/add",
      component:AddTeam,
      name: "Create a team",
      meta: {
        title: "Create a team - echo",
        group:"teams"
      }
    }
  ]
})

// change document title on routing
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title
  next()
})

export default router
