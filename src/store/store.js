import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  //设置全局访问state对象
  state:{
    userInfo:null,
    content_detail:"",
  },

  //实时监听state内值的变化
  getters:{
    userInfo(state){
      return state.userInfo
    },
    content_detail(state){
      return state.content_detail
    },
  },

  //实时接收各组件中提交修改值请求并更改state中的值
  mutations:{
    change_userInfo(state,userInfo){
      state.userInfo= userInfo;
    },
    change_content_detail(state,content){
      state.content_detail= content;
    },
  },

  //实时接收各组件中提交修改值请求(actions与mutations区别是actions提交的是 mutation中的方法，而不是直接更改state中的值)
  actions:{
    change_userInfo_f(f,userInfo){
      f.commit("change_userInfo",userInfo)
    },
    change_content_detail_f(f,content){
      f.commit("change_content_detail",content);
    },
  }
});
