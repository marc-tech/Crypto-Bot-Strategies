import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/displayer/views/Home.vue';
import Test from '@/displayer/views/Test.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
