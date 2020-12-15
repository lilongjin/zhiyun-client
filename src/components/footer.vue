<template>
  <div class="footer">
    {{other_data.footer_msg}}
  </div>
</template>
<script>
  export default {
    data (){
      return{
        other_data:""
      };
    },
    created:function () {
      this.other_msg();
    },
    methods: {
      other_msg(){
        this.$axios({
          method: 'post',
          url: 'http://zhiyun_server.lilongjin.cn/main/other_msg',
        }).then((res) => {
          this.other_data = res.data[0];
        }).catch((error) => {
          console.log(error);
        });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../static/less/main.less";
  .footer{
    width: 100%;
    height: 5rem;
    line-height: 5rem;
    float: left;
    text-align: center;
    color: @color_content;
    background-color: white;
  }
</style>
