import { createRouter, createWebHistory } from "vue-router";
import TestPlans from "@views/TestPlans.vue";
import TestCases from "@views/TestCases.vue";
import AIConfig from "@views/AIConfig.vue";
import BugReport from "@views/BugReport.vue";

const routes = [
  {
    path: "/",
    redirect: "/test-plans",
  },
  {
    path: "/test-plans",
    name: "TestPlans",
    component: TestPlans,
  },
  {
    path: "/test-cases",
    name: "TestCases",
    component: TestCases,
  },
  {
    path: "/ai-config",
    name: "AIConfig",
    component: AIConfig,
  },
  {
    path: "/bug-report",
    name: "BugReport",
    component: BugReport,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
