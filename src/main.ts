import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {
  Lazyload,
  Swipe,
  ImagePreview,
  Icon,
  Field,
  Button,
  NavBar,
  Popup,
  Tabbar,
  TabbarItem,
  SwipeItem,
  Circle,
  Loading,
  DatetimePicker,
  List,
  Toast,
  Checkbox,
  Progress,
  PullRefresh,
  Tab, 
  Tabs,
  RadioGroup,
  Radio
} from 'vant';
import 'vant/lib/index.css';
import './common/base.css';
// import './index'
Vue.use(Swipe);
Vue.use(ImagePreview);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Button);
Vue.use(NavBar);
Vue.use(Popup);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(SwipeItem);
Vue.use(Circle);
Vue.use(Loading);
Vue.use(DatetimePicker);
Vue.use(List);
Vue.use(Toast);
Vue.use(Checkbox);
Vue.use(Progress);
Vue.use(PullRefresh);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Lazyload, {
  lazyComponent: true
});
Vue.config.productionTip = false;


// import "./mock/home-mock"
// import Vconsole from 'vconsole';
// let vConsole: any = new Vconsole();
// Vue.use(vConsole);
// if (window.location.href.indexOf('localhost') == -1) {
//   let vConsole: any = new Vconsole();
//   Vue.use(vConsole);
// }



// Vue.use((window as any)['vue-cropper'].default)

new Vue({
  router,
  store,
  render: (h:any) => h(App),
}).$mount('#app');
