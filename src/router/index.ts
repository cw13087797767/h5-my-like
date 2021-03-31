import Vue from 'vue';
import VueRouter from 'vue-router';
import vappRoutes from './vapp'
import homeRoutes from './home'
import userRoutes from './user'
import dayjs from 'dayjs'

Vue.use(VueRouter);
const userConfig:any = window.localStorage.getItem('userConfig')
const isTimeOut = () => {
  const flag = !!userConfig && dayjs().subtract(5,'second') < dayjs(JSON.parse(userConfig).loginTime)
  flag && window.localStorage.removeItem("userConfig")
  return flag
}

const routes = [
  ...vappRoutes,
  ...homeRoutes,
  ...userRoutes,
  {
    path:'/',
    name:'main',
    redirect: !!userConfig ? `/home` : '/user/login'
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
