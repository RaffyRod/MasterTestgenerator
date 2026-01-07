import { createRouter, createWebHistory } from 'vue-router'
import TestPlans from '@views/TestPlans.vue'
import TestCases from '@views/TestCases.vue'

const routes = [
  {
    path: '/',
    redirect: '/test-plans'
  },
  {
    path: '/test-plans',
    name: 'TestPlans',
    component: TestPlans
  },
  {
    path: '/test-cases',
    name: 'TestCases',
    component: TestCases
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
