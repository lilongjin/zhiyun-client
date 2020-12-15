<template>
  <div id="app">
    <Nav></Nav>
    <router-view></router-view>
    <Footer></Footer>
    <transition name="el-fade-in-linear">
      <div v-show="btnFlag" @click="backTop" class="back-top">回顶部</div>
    </transition>
  </div>
</template>

<script>
import Nav from "./components/nav.vue"
import Footer from "./components/footer.vue"

export default {
  name: 'App',
  components: {
    Nav,
    Footer
  },
  data (){
    return{
      btnFlag:false
    };
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  methods: {
    // 点击回到顶部方法，利用计时器实现柔性过渡
    backTop () {
      const that = this
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5)
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        if (that.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
    },
    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop () {
      const that = this
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      that.scrollTop = scrollTop
      if (that.scrollTop > 60) {
        that.btnFlag = true
      } else {
        that.btnFlag = false
      }
    },
  }
}
</script>
<style scoped>
  .back-top{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #409eff;
    line-height: 3rem;
    text-align: center;
    color: white;
    position: fixed;
    right: 5%;
    bottom: 6rem;
    font-size: 12px;
  }
</style>

