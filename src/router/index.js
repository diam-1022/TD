import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import ScheduleDetail from '@/views/ScheduleDetail.vue'
import ScheduleManagement from '@/views/ScheduleManagement.vue'
import GroupOverview from '@/views/GroupOverview.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/schedule',
    name: 'ScheduleManagement',
    component: ScheduleManagement
  },
  {
    path: '/schedule/:id',
    name: 'ScheduleDetail',
    component: ScheduleDetail,
    props: true
  },
  {
    path: '/group/:id',
    name: 'GroupOverview',
    component: GroupOverview,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
