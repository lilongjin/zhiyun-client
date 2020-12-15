<template>
  <div class="header">
    <div class="navs">
      <div class="logo">
        <img src="../../static/img/logo2.png" alt="logo">
      </div>
      <ul class="nav_list">
        <li class="nav" v-bind:class="{ 'nav_active': isActive == 0 }" @click="index_content(0)">首页</li>
        <li class="nav" v-bind:class="{ 'nav_active': isActive == 1 }" @click="blog_content(1)">博客文章</li>
        <li class="nav" v-bind:class="{ 'nav_active': isActive == 2 }" @click="question_content(2)">论坛问答</li>
        <li class="nav" v-bind:class="{ 'nav_active': isActive == 3 }" @click="hot_content(3)">热门推荐</li>
        <li class="nav" v-bind:class="{ 'nav_active': isActive == 4 }" @click="chat(4)">聊天室</li>
      </ul>
      <div class="search">
        <el-autocomplete
                popper-class="my-autocomplete"
                v-model="in_title"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect">
          <span
                  class="el-icon-search el-input__icon"
                  slot="suffix"
                  @click="handleIconClick()">
          </span>
          <template slot-scope="{ item }">
            <div class="name">
              <span style="padding: 2px;
              padding: 5px;
              border-radius: 50%;
              color: white;
              background-color: #409eff;
              font-size: .6rem;
              margin-right: .5rem;">荐</span>{{ item.title }}</div>
          </template>
        </el-autocomplete>
      </div>
      <div class="userinfo">
        <div class="write">
          <span class="el-icon-edit-outline"></span>
          <span @click="write()">发帖</span>
        </div>
        <div class="user" v-if="!userInfo">
          <span class="el-icon-user-solid"></span>
          <span @click="centerDialogVisible = true">注册/</span>
          <span @click="centerDialogVisible1 = true">登录</span>
        </div>
        <div class="user userInfo" v-if="userInfo">
          <img v-bind:src="userInfo.userimg" alt="" @click="user()">
          <p @click="user()">{{userInfo.username}}</p>
          <p @click="quit_login()">退出</p>
        </div>
      </div>
    </div>
    <!--注册-->
    <el-dialog
      title="用户注册"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" placeholder="提示：用户名注册后不可更改"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="ruleForm.repassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
      </span>
    </el-dialog>
    <!--登录-->
    <el-dialog
      title="用户登录"
      :visible.sync="centerDialogVisible1"
      width="30%"
      center>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username1">
          <el-input v-model="ruleForm.username1"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password1">
          <el-input type="password" v-model="ruleForm.password1" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm1('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm1('ruleForm')">登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data (){
      //注册验证
      var username = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('昵称不能为空'));
        }else{
          callback();
        }
      };
      var password = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var repassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value != this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      //登录验证
      var username1 = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('昵称不能为空'));
        }else{
          callback();
        }
      };
      var password1 = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return{
        isActive:0,
        centerDialogVisible: false,
        centerDialogVisible1: false,
        userInfo:null,
        ruleForm: {
          username: '',
          password: '',
          repassword: '',
          username1: '',
          password1: '',
        },
        rules: {
          username: [
            { validator: username, trigger: 'blur' }
          ],
          password: [
            { validator: password, trigger: 'blur' }
          ],
          repassword: [
            { validator: repassword, trigger: 'blur' }
          ],
          username1: [
            { validator: username1, trigger: 'blur' }
          ],
          password1: [
            { validator: password1, trigger: 'blur' }
          ],
        },
        search_data: [],
        result_content:[],
        in_title: ""
      };
    },
    created:function(){
      var nav_index = sessionStorage.getItem("nav_index");
      if(nav_index && nav_index !=""){
        this.isActive = nav_index;
      }else{
        this.isActive = 0;
      }
      //检查缓存中是否记录了登录状态
      const userid = localStorage.getItem("userid");
      //如果有已登录状态缓存记录，则在刷新页面时将用户信息提交至vuex
      if(userid && userid !=""){
        this.$axios({
          method:'post',
          url:'http://zhiyun_server.lilongjin.cn/api/user/userInfo',
          data:this.qs.stringify({
            userid:userid,
          })
        }).then((res) => {
          if(res.data.code == 0){
            //将获取成功后的用户信息提交存储到vuex中
            this.$store.dispatch("change_userInfo_f",res.data);
            this.userInfo = this.$store.getters.userInfo;
          }else{
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            });
          };
        }).catch((error) => {
          console.log(error);
        });
      };
      //获取热门内容
      this.$axios({
        method: 'post',
        url: 'http://zhiyun_server.lilongjin.cn/main/content_all_hot',
      }).then((res) => {
        this.search_data = res.data;
        this.search_data = this.loadAll();
      }).catch((error) => {
        console.log(error);
      });
    },
    mounted(){
      //回车键发送消息
      let _this = this
      document.onkeydown = function(e) {
        if(e.keyCode === 13){
          _this.handleIconClick()
        }
      }
    },
    methods:{
      user(){
        this.$router.push({name:'user'});
      },
      write(id){
        const userid = localStorage.getItem("userid");
        //验证是否登录
        if(userid && userid !=""){
          this.$router.push({ name: 'write',query: {id:id}});
        }else{
          this.$message({
            showClose: true,
            message: "亲，请先登录",
            type: 'warn'
          });
        }
      },
      index_content(index){
        this.$router.push({ name: 'index_content' });
        //缓存导航索引信息
        sessionStorage.setItem("nav_index",index);
        this.isActive = index
      },
      blog_content(index){
        this.$router.push({ name: 'blog_content'});
        //缓存导航索引信息
        sessionStorage.setItem("nav_index",index);
        this.isActive = index
      },
      question_content(index){
        this.$router.push({ name: 'question_content'});
        //缓存导航索引信息
        sessionStorage.setItem("nav_index",index);
        this.isActive = index
      },
      hot_content(index){
        this.$router.push({ name: 'hot_content'});
        //缓存导航索引信息
        sessionStorage.setItem("nav_index",index);
        this.isActive = index
      },
      chat(index){
        var userid = localStorage.getItem("userid");
        //验证是否登录
        if(userid && userid !=""){
          this.$router.push({ name: 'chat'});
          //缓存导航索引信息
          sessionStorage.setItem("nav_index",index);
          this.isActive = index;
        }else{
          this.$message({
            showClose: true,
            message: "亲，请先登录",
            type: 'warn'
          });
        }
      },
      //注册
      submitForm(formName) {
        this.centerDialogVisible = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios({
              method:'post',
              url:'http://zhiyun_server.lilongjin.cn/api/user/register',
              data:this.qs.stringify({
                username:this.ruleForm.username,
                password:this.ruleForm.password
              })
            }).then((res) => {
              if(res.data.code == 0){
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: 'error'
                });
              };
            }).catch((error) => {
              console.log(error);
            });
          } else {
            console.log('注册失败');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.centerDialogVisible = false;
        this.$refs[formName].resetFields();
      },
      //登录
      submitForm1(formName1) {
        this.centerDialogVisible1 = false;
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            this.$axios({
              method:'post',
              url:'http://zhiyun_server.lilongjin.cn/api/user/login',
              data:this.qs.stringify({
                username:this.ruleForm.username1,
                password:this.ruleForm.password1
              })
            }).then((res) => {
              if(res.data.code == 0){
                this.$message({
                  showClose: true,
                  message: "登陆成功",
                  type: 'success'
                });
                //将登陆成功后的用户信息提交存储到vuex中
                this.$store.dispatch("change_userInfo_f",res.data);
                //缓存登录信息
                localStorage.setItem("userid",this.$store.getters.userInfo.userid);
                this.userInfo = this.$store.getters.userInfo;
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: 'error'
                });
              };
            }).catch((error) => {
              console.log(error);
            });
          } else {
            console.log('登录失败');
            return false;
          }
        });
      },
      resetForm1(formName1) {
        this.centerDialogVisible1 = false;
        this.$refs[formName1].resetFields();
      },
      //退出登录
      quit_login(){
        localStorage.removeItem('userid');
        sessionStorage.removeItem('store');
        sessionStorage.removeItem('nav_index');
        this.$router.push({name:'index_content'});
        location.reload();
      },
      //搜索联想
      querySearch(title,result) {
        //实时获取搜索内容标题联想
        this.$axios({
          method: 'post',
          url: 'http://zhiyun_server.lilongjin.cn/main/content_all_search',
        }).then((res) => {
          //从全部数据中检索标题包含用户输入内容的数据
          var find_data = res.data;
          if(this.in_title != ""){
            var new_search_data = [];
            for(let i = 0; i<find_data.length; i++){
              if(find_data[i].title.indexOf(this.in_title) != -1){
                new_search_data.push(find_data[i]);
                this.search_data = new_search_data;
                this.search_data = this.loadAll();
              };
            };
          }
        }).catch((error) => {
          console.log(error);
        });
        const search_data = this.search_data;
        const result_data = title ? search_data.filter(this.createFilter(title)) : search_data;
        // 调用 callback 返回建议列表的数据
        return result(result_data);
      },
      createFilter() {
        return (search_data) => {
          //返回与用户实时输入的内容标题匹配的文章
          return (search_data.title.indexOf(this.in_title) != -1);
        };
      },
      loadAll() {
        return this.search_data;
      },
      handleSelect(item) {
        this.in_title = item.title;
      },
      // 搜索文章
      handleIconClick() {
        if(this.in_title != ""){
          this.$router.push({ name: 'search_content',params:{content_title:this.in_title}});
        }else{
          this.$message({
            showClose: true,
            message: "请输入搜索内容",
            type: 'warn'
          });
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../static/less/main.less";
  .header{
    width: 100%;
    float: left;
    background-color: white;
    .navs{
      width:60%;
      height: 4rem;
      float: left;
      margin-left: 20%;
      display: flex;
      cursor: pointer;
      .logo{
        flex:1;
        img{
          margin-top: .5rem;
          height: 3rem;
          float: right;
          margin-right: 1rem;
        }
      };
      .nav_list{
        flex: 5;
        overflow: hidden;
        .nav{
          float: left;
          padding: 0 1rem 0 1rem;
          height: 4rem;
          line-height: 4rem;
          text-align: center;
          color: @color_fenlei;
          &:hover{
            color: @color_lan;
            background-color: @color_bg;
          }
        };
        .nav_active{
          box-sizing: border-box;
          color: @color_lan;
          background-color: @color_bg;
          border-bottom: 2px solid @color_lan;
        }
      };
      .search{
        flex: 2;
        height: 2.5rem;
        line-height: 2.5rem;
        margin-top: .75rem;
        border-radius: 5px;
        background-color: @color_bg;
        .search_input{
          width: 85%;
          float: left;
          height: 2.5rem;
          .el-autocomplete{
            .el-input{
              .el-input__inner{
                background-color: @color_bg;
              }
            }
          }
        };
        .my-autocomplete {
          li {
            line-height: normal;
            padding: 7px;

            .name {
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .addr {
              font-size: 12px;
              color: #b4b4b4;
            }

            .highlighted .addr {
              color: #ddd;
            }

          }
        }
      }
      .userinfo{
        flex: 3;
        line-height: 3rem;
        text-align: center;
        margin-top: .5rem;
        display: flex;
        .write{
          flex: 4;
          color: @color_lan;
        }
        .user{
          flex: 6;
          color: @color_fenlei;
          span{
            &:nth-child(1){
              color: @color_fenlei;
            }
          }
        }
        .userInfo{
          img{
            width: 2rem;
            height: 2rem;
            margin-top: 0.5rem;
            float: left;
            border-radius: 50%;
          }
          p{
            float: left;
            &:nth-child(2){
              margin: 0 0.5rem 0 0.5rem;
            }
            &:nth-child(3){
              font-size: .8rem;
              color:@color_lan
            }
          }
        }
      }
    }
  }
</style>
