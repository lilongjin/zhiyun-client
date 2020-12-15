<template>
  <div class="chats">
    <div class="chat_bg"></div>
    <div class="chat">
      <div class="chat_left">
        <div class="list_header">
          聊天大厅在线人数：{{user_list.length}}
        </div>
        <div class="user_list_bg">
          <div class="user_list">
            <div v-for="item in user_list">
              <img v-bind:src="item.userimg" alt="">
              <p>{{item.username}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="chat_right">
        <div class="chat_header">
          智云社区聊天室
        </div>
        <div class="chat_content">
          <div class="chat_list_bg">
            <div class="chat_list">
              <div v-for="item in chat_list" v-bind:class="item.type ? 'chat_msg_me' : 'chat_msg_other'">
                <div>
                  <img v-bind:src="item.userimg" alt="">
                  <p v-if="item.username">{{item.username}}</p>
                  <!--<p v-if="item.send_time">{{item.send_time | formatDate('hh:mm:ss')}}</p>-->
                </div>
                <div>
                  <p>{{item.msg_content}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="chat_inputs">
            <div class="others">
              <span class="iconfont icon-xiaolian" @click="face()"></span>
              <span class="el-icon-picture-outline" @click="img()"></span>
              <span class="el-icon-folder-opened" @click="files()"></span>
            </div>
            <textarea rows="3" cols="20" v-model="chat_msg" placeholder="想和大家说点什么......"></textarea>
            <button @click="send()" v-on:keyup.enter="send()">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userInfo: "",
        user_list: [],
        chat_list: [],
        chat_msg: ""
      }
    },
    mounted(){
      //回车键发送消息
      let _this = this
      document.onkeydown = function(e) {
        if(e.keyCode === 13){
          _this.send()
        }
      }
    },
    created: function () {
      var userid = localStorage.getItem("userid");
      //验证是否登录
      if(!userid || userid ==""){
        this.$router.push({ name: 'index_content'});
      }
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store")) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
        this.userInfo = this.$store.getters.userInfo;
      } else {
        this.userInfo = this.$store.getters.userInfo;
        sessionStorage.setItem("store", JSON.stringify(this.$store.state));
      };
      this.join();
    },
    sockets: {
      //接收自己进入聊天室服务端返回的欢迎消息
      new_user(res){
        this.$message({
          showClose: true,
          message: res.msg_content,
          type: 'success'
        });
        //筛选出服务器实时传回的用户列表中本地用户列表没有的用户，并组成新数组
        var new_user = this.as_array(this.user_list,res.online_user);
        //将筛选出来的新数组中的每一个用户插入到本地用户列表
        for(var i = 0; i<new_user.length; i++){
          this.user_list.push(new_user[i])
        }
      },
      //接收其他用户进入聊天室服务端返回的欢迎消息
      others_new_user(res){
        this.$message({
          showClose: true,
          message: res.msg_content,
          type: 'success'
        });
        //筛选出服务器实时传回的用户列表中本地用户列表没有的用户，并组成新数组
        var new_user = this.as_array(this.user_list,res.online_user);
        //将筛选出来的新数组中的每一个用户插入到本地用户列表
        for(var i = 0; i<new_user.length; i++){
          this.user_list.push(new_user[i])
        }
      },
      //接收自己自己发送的聊天消息
      new_message(res){
        if(res){
          this.chat_list.push(res);
        }
        console.log(res);
      },
      //接收他用户发送的聊天消息
      others_new_message(res){
        if(res){
          this.chat_list.push(res)
        }
      },
      //接收其他用户退出聊天室消息
      others_user_quit(res){
        //从本地用户列表中找出服务器发回的下线用户的用户id，并从本地用户列表中删除该用户
        for (var key in this.user_list) {
          if (this.user_list[key].id === res.id) {
            this.user_list.splice(key,1)
          }
        };
      }
    },
    methods:{
      //加入聊天室
      join(){
        this.$socket.emit('join',this.userInfo);
      },
      //发送消息
      send(){
        var msg_data = {
          type:"me",
          userimg:this.userInfo.userimg,
          username:this.userInfo.username,
          send_time:new Date(),
          msg_content:this.chat_msg
        }
        this.$socket.emit('send',msg_data);
        this.chat_msg = "";
      },
      //从两个数组中找出其中对象username属性值不同的对象，并返回组合成的新数组方法
      as_array(arr1,arr2){
        var result = [];
        for(var i = 0; i < arr2.length; i++){
          var obj = arr2[i];
          var num = obj.username;
          var isExist = false;
          for(var j = 0; j < arr1.length; j++){
            var aj = arr1[j];
            var n = aj.username;
            if(n == num){
              isExist = true;
              break;
            }
          }
          if(!isExist){
            result.push(obj);
          }
        }
        return result;
      },
      //退出聊天室
//      quit(){
//        this.$socket.emit('quit',this.userInfo.username);
//      },
      face(){
        this.$message({
          showClose: true,
          message: "该功能正在完善中......",
          type: 'warn'
        });
      },
      img(){
        this.$message({
          showClose: true,
          message: "该功能正在完善中......",
          type: 'warn'
        });
      },
      files(){
        this.$message({
          showClose: true,
          message: "该功能正在完善中......",
          type: 'warn'
        });
      },
    },
  }
</script>
<style lang="less" scoped>
  @import "../../../static/less/main.less";
  .chats {
    width: 100%;
    float: left;
    position: relative;
    .chat_bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-image: url("../../../static/img/chat_bg.jpg");
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-filter: blur(5px);
      -moz-filter: blur(5px);
      -o-filter: blur(5px);
      -ms-filter: blur(5px);
      filter: blur(5px);
      z-index: -1;
    }
    .chat {
      width: 60%;
      height: 50rem;
      float: left;
      margin-left: 20%;
      margin-top: 2rem;
      margin-bottom: 2rem;
      display: flex;
      background-color: white;
      border-radius: 5px;
      .chat_left {
        flex: 3;
        background-color: @color_bg;
        border-radius: 5px 0 0 5px;
        overflow: hidden;
        .list_header {
          width: 100%;
          float: left;
          height: 4rem;
          line-height: 4rem;
          text-indent: 1rem;
          color: @color_lan;
        }
        .user_list_bg{
          width: 97%;
          float: left;
          height: 46rem;
          position: relative;
          overflow: hidden;
          .user_list {
            position: absolute;
            width: 100%;
            top: 0;
            right: -0.75rem;
            height: 46rem;
            overflow: auto;
            div {
              width: 96%;
              float: left;
              line-height: 4rem;
              text-indent: .5rem;
              border-radius: 5px;
              margin: 0.5rem 0.75rem 0 0;
              background-color: white;
              &:last-child {
                margin-bottom: 1rem;
              }
              p{
                float: left;
              }
              img{
                width: 3rem;
                height: 3rem;
                float: left;
                border-radius: 2px;
                margin-left: .5rem;
                margin-top: .5rem;
              }
            }
          }
        }
      }
      .chat_right {
        flex: 7;
        .chat_header {
          width: 100%;
          float: left;
          height: 4rem;
          line-height: 4rem;
          text-indent: 1rem;
          border-bottom: 1px solid @color_bg
        }
        .chat_content {
          width: 100%;
          height: 46rem;
          float: left;
          .chat_list_bg {
            width: 98%;
            height: 28rem;
            float: left;
            margin: 1rem 2% 1rem 0;
            overflow: hidden;
            .chat_list{
              width: 100%;
              height: 100%;
              float: left;
              margin-left: 1.1rem;
              overflow: auto;
              .chat_msg_me {
                width: 60%;
                float: right;
                margin-right: 1.1rem;
                margin-bottom: 1rem;
                div{
                  line-height: 2rem;
                  padding: .5rem;
                  border-radius: 5px;
                  float: right;
                  &:nth-child(1){
                    position: relative;
                    width: 100%;
                    text-align: right;
                    padding: 0;
                    img{
                      width: 2.5rem;
                      height: 2.5rem;
                      border-radius: 50%;
                      position: absolute;
                      top: 1rem;
                      right: 0;
                    }
                    p{
                      width: auto;
                      float: right;
                      margin-right: 3rem;
                    }
                  };
                  &:nth-child(2){
                    background-color: @color_lan;
                    margin-right: 3rem;
                    p{
                      float: right;
                      word-wrap:break-word;
                      word-break:break-all;
                    }
                  }
                }
              }
              .chat_msg_other {
                width: 60%;
                float: left;
                margin-bottom: 1rem;
                div{
                  line-height: 2rem;
                  padding: .5rem;
                  border-radius: 5px;
                  float: left;
                  &:nth-child(1){
                    position: relative;
                    width: 100%;
                    text-align: left;
                    padding: 0;
                    img{
                      width: 2.5rem;
                      height: 2.5rem;
                      border-radius: 50%;
                      position: absolute;
                      top: 1rem;
                      left: 0;
                    }
                    p{
                      width: auto;
                      float: left;
                      margin-left: 3rem;
                    }
                  };
                  &:nth-child(2){
                    background-color: @color_bg;
                    margin-left: 3rem;
                    p{
                      float: left;
                      word-wrap:break-word;
                      word-break:break-all;
                    }
                  }
                }
              }
            }
          }
          .chat_inputs {
            width: 100%;
            height: 16rem;
            float: left;
            border-top: 1px solid @color_bg;
            .others {
              width: 100%;
              float: left;
              height: 3rem;
              line-height: 3rem;
              border-bottom: 1px solid @color_bg;
              span{
                font-size: 1.5rem;
                color: @color_fenlei;
                padding-left: 1rem;
              }
            }
            textarea {
              width: 93%;
              margin-left: 3%;
              margin-top: 1rem;
              height: 8rem;
              float: left;
              resize: none;
              border: none;
              outline: none;
            }
            button {
              float: right;
              margin-right: 3%;
              margin-top: .5rem;
              background-color: @color_lan;
              color: white;
              line-height: 1rem;
              padding: .5rem 1rem .5rem 1rem;
              border: none;
              outline: none;
            }
          }
        }
      }
    }
  }
</style>
