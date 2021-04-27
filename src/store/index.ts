import Vue from 'vue';
import Vuex from 'vuex';
import footerModule from './common/footer/footer-module';
import headerModule from './common/header/header-module';
import homeModule from './home/home-module'
import musicModule from './home/music/music-module'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    globalLoading:false
  },
  mutations: {
    set_globalLoading(state:any,payload:any){
      state.globalLoading = payload
    }
  },
  actions: {
  },
  modules: {
    footerModule,
    headerModule,
    homeModule,
    musicModule
  },
});
