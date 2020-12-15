<template>
    <div>
      <div class="user_edit_title">
        <p>发帖类型</p>
        <el-radio v-model="radio" label="0">{{edit_title0.name}}</el-radio>
        <el-radio v-model="radio" label="1">{{edit_title1.name}}</el-radio>
      </div>
      <div class="user_edit_title">
          <p>发帖标题</p>
          <el-input v-model="title" placeholder="请输入标题"></el-input>
      </div>
      <div id="wangeditor" class="wangeditor">
        <div class="editorElem" ref="editorElem"></div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="sub()">提交</el-button>
        <el-button type="primary" @click="rest()">重置</el-button>
      </div>
    </div>
</template>
<script>
  import Wangeditor from 'wangeditor';
  export default {
    data() {
      return {
        userInfo:null,
        radio: '',
        editor: null,
        title:"",
        editorContent: "",
        edit_title0:{
          name:"",
          _id:""
        },
        edit_title1:{
          name:"",
          _id:""
        },
        categoryType:""
      }
    },
    mounted:function() {
      var userid = localStorage.getItem("userid");
      //验证是否登录
      if(!userid || userid ==""){
        this.$router.push({ name: 'index_content'});
      }
      this.editor = new Wangeditor(this.$refs.editorElem);
      // 编辑器的事件，每次改变会获取其html内容
      this.editor.customConfig.onchange = html => {
        this.editorContent = html;
      };
      this.editor.customConfig.menus = [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];
      this.editor.create(); // 创建富文本实例
      //设置编辑器默认内容
      this.editor.txt.html('<p>请在此编辑内容......</p>')
    },
    created:function () {
      //在页面加载时读取sessionStorage里的状态信息
      this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
      this.userInfo = this.$store.getters.userInfo;
      //获取分类列表
      this.$axios({
        method:'post',
        url:'http://zhiyun_server.lilongjin.cn/api/content/add',
      }).then((res) => {
        if(res.data.length != 0 ){
          this.edit_title0 = res.data[0];
          this.edit_title1 = res.data[1]
        }else{
          this.$message({
            showClose: true,
            message: "获取分类信息异常",
            type: 'error'
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    methods: {
      sub(){
        if(this.radio == ""){
          this.$notify.error({
            title: '请选择发帖类型',
          });
        }else if(this.title == ""){
          this.$notify.error({
            title: '标题不能为空',
          });
        }else if(this.editorContent == ""){
            this.$notify.error({
                title: '内容不能为空',
            });
        }else{
          if(this.radio == 0){
            this.categoryType = this.edit_title0._id;
          }else if(this.radio == 1){
            this.categoryType = this.edit_title1._id;
          };
          this.$axios({
            method:'post',
            url:'http://zhiyun_server.lilongjin.cn/api/content/add_save',
            data:this.qs.stringify({
              author:this.userInfo.userid,
              contentid:this.contentid,
              title:this.title,
              categoryType:this.categoryType,
              editorContent:this.editorContent,
              num:this.radio
            })
          }).then((res) => {
            if(res){
              this.$message({
                showClose: true,
                message: res.data,
                type: 'success'
              });
            }else{
              this.$message({
                showClose: true,
                message: "发帖失败",
                type: 'error'
              });
            }
          }).catch((error) => {
            console.log(error);
          });
        }
      },
      rest(){
        this.editorContent = "";
        this.editor.txt.html('<p>请在此编辑内容......</p>');
      }
    },
  }
</script>
<style lang="less" scoped>
  @import "../../../static/less/main.less";
  .user_edit_title{
    width: 100%;
    float: left;
    min-height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
    color: @color_txt;
  }
  .wangeditor{
    width: 100%;
    float: left;
    .editorElem{
      text-align:left;
    }
  }
  .btn{
    width: 100%;
    float: left;
    margin-top: 1rem;
    margin-bottom: 1rem;
    button{
      width: 20%;
      &:nth-child(1){
        margin-left: 27.5%;
        margin-right: 5%;
      }
    }
  }
</style>
