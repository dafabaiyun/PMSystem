import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login", // 一进页面就重定向到登录页面
    },
    {
      path: "/login",
      component: () => import("../components/login.vue"),
    },
    {
      path: "/directory", // 将directory作为主路由
      component: () => import("../components/directory.vue"),
      children: [
        {
          path: "attendance",
          component: () => import("../components/attendance.vue"),
        },
        {
          path: "recruit",
          component: () => import("../components/recruit.vue"),
        },
        {
          path: "resume",
          component: () => import("../components/resume.vue"),
        },
        {
          path: "salary",
          component: () => import("../components/salary.vue"),
        },
        {
          path: "userManage",
          component: () => import("../components/userManage.vue"),
        },
        {
          path: "interview",
          component: () => import("../components/interview.vue"),
        },
      ],
    },
  ],
});

export default router;
