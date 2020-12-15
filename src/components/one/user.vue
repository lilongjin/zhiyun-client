<template>
  <div class="contents">
    <div class="left">
      <div class="notice">
        <div class="user_img">
          <img v-bind:src="userInfo.userimg" alt=""  @click="centerDialogVisible1 = true">
        </div>
        <div class="user_info">
          <p>昵称：{{userInfo.username}}</p>
          <p>性别：{{userInfo.sex}}</p>
          <p>生日：{{userInfo.age}}</p>
          <p>地区：{{userInfo.address}}</p>
          <p>行业：{{userInfo.hangye}}</p>
          <p>职位：{{userInfo.job}}</p>
          <p>GitHub地址：{{userInfo.git}}</p>
          <p>个性签名：{{userInfo.sign}}</p>
        </div>
        <div class="user_edit" @click="user_edit()">
          修改个人资料
        </div>
      </div>
      <div class="news_list">
        <div class="hot">
          <div class="hot_title">
            热帖排行
          </div>
          <div class="hot_content">
            <div class="news" v-for="item in hot_list" @click="detail(item._id)">
              <div class="img">
                <img src="../../../static/img/notice.jpg" alt="">
              </div>
              <div class="text">{{item.title}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
    <!--更换头像-->
    <el-dialog
      title="更换头像"
      :visible.sync="centerDialogVisible1"
      width="30%"
      center>
      <el-upload
        class="upload-demo"
        action="http://zhiyun_server.lilongjin.cn/admin/user_img"
        accept=".png,.jpg"
        :limit="1"
        :file-list="fileList"
        :on-success="uploads"
        :data="{userid:userInfo.userid}"
        list-type="picture">
        <el-button size="small" type="primary">上传新头像</el-button>
        <div slot="tip" class="el-upload__tip">仅支持上传jpg/png格式图片</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible1 = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data (){
      return{
        userInfo:null,
        hot_list:"",
        centerDialogVisible1: false,
        fileList: [],
      };
    },
    created:function () {
      var userid = localStorage.getItem("userid");
      //验证是否登录
      if(!userid || userid ==""){
        this.$router.push({ name: 'index_content'});
      }
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
        this.userInfo = this.$store.getters.userInfo;
      }else{
        this.userInfo = this.$store.getters.userInfo;
        sessionStorage.setItem("store",JSON.stringify(this.$store.state));
      };
      //获取用户热帖排行
      this.$axios({
        method:'post',
        url:'http://zhiyun_server.lilongjin.cn/main/hot_ranking',
        data:this.qs.stringify({
          userid:this.userInfo.userid,
        })
      }).then((res) => {
        this.hot_list = res.data
      }).catch((error) => {
        console.log(error);
      });
    },
    methods:{
      user_edit(id) {
        this.$router.push({name:'user_edit'});
      },
      detail(id) {
        this.$router.push({name: 'detail', query: {id: id}})
      },
      uploads(res){
        if(res == 0){
          this.$message({
            showClose: true,
            message: "上传服务器成功",
            type: 'success'
          });
          this.$axios({
            method:'post',
            url:'http://zhiyun_server.lilongjin.cn/api/user/userInfo',
            data:this.qs.stringify({
              userid:this.userInfo.userid,
            })
          }).then((res) => {
            if(res.data.code == 0){
              //将获取成功后的用户信息提交存储到vuex中
              this.$store.dispatch("change_userInfo_f",res.data);
              this.userInfo = this.$store.getters.userInfo;
              sessionStorage.setItem("store",JSON.stringify(this.$store.state));
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
        }else{
          this.$message({
            showClose: true,
            message: "上传服务器失败，超出轮播图数量上限",
            type: 'error'
          });
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../static/less/main.less";
  .contents{
    width:60%;
    float: left;
    margin-left: 20%;
    margin-top: .5rem;
    margin-bottom: 2rem;
    display: flex;
    .left{
      flex: 3;
      .notice{
        width: 100%;
        float: left;
        cursor: pointer;
        border-radius: 5px;
        background-color: white;
        .user_img{
          width: 100%;
          float: left;
          img{
            width: 20%;
            float: left;
            margin-left: 40%;
            margin-top: 2rem;
            margin-bottom: 1rem;
            border-radius: 50%;
          }
        }
        .user_info{
          width: 100%;
          float: left;
          margin-bottom: 1rem;
          p{
            width: 80%;
            float: left;
            color:@color_fenlei;
            margin-left: 10%;
            margin-bottom: 1rem;
            font-size: .8rem;
          }
        }
        .user_edit{
          width: 80%;
          float: left;
          text-align: center;
          color:@color_lan;
          margin-left: 10%;
          margin-bottom: 2rem;
          font-size: .8rem;
        }
      }
      .news_list{
        width: 100%;
        float: left;
        margin-top: .5rem;
        .hot{
          padding: 5%;
          float: left;
          border-radius: 5px;
          background-color: white;
          margin-bottom: .5rem;
          .hot_title{
            width: 100%;
            float: left;
            border-left: 2px solid @color_lan;
            height: 1rem;
            line-height: 1rem;
            text-indent: .5rem;
          }
          .hot_content{
            width: 100%;
            float: left;
            cursor: pointer;
            .news{
              width: 100%;
              height: 4rem;
              float: left;
              margin-top: 1rem;
              display: flex;
              .img{
                flex: 3;
                height: 100%;
                overflow: hidden;
                transition: all .5s;
                -moz-transition: all .5s; /* Firefox 4 */
                -webkit-transition: all .5s; /* Safari 和 Chrome */
                -o-transition: all .5s; /* Opera */
                img{
                  width: 100%;
                  height: 100%;
                  border-radius: 5px;
                  &:hover{
                    transform: scale(1.2,1.2);
                    transition: all .5s;
                    -moz-transition: all .5s; /* Firefox 4 */
                    -webkit-transition: all .5s; /* Safari 和 Chrome */
                    -o-transition: all .5s; /* Opera */
                  }
                }
              };
              .text{
                flex: 7;
                line-height: 1.75rem;
                height: 3.5rem;
                margin-top: .25rem;
                padding: 0 2% 0 2%;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                color: @color_fenlei;
                &:hover{
                  color: @color_lan;
                }
              }
            }
            .about_me{
              width: 100%;
              float: left;
              margin-top: 1rem;
              .num{
                width: 100%;
                float: left;
                margin: .5rem 0 .5rem 0;
              }
              .ma{
                width: 45%;
                float: left;
                padding: 2.5%;
                img{
                  width: 100%;
                }
                p{
                  text-align: center;
                  line-height: 2rem;
                  height: 2rem;
                  font-size: .8rem;
                  color: @color_title;
                }
              }
            }
          }
        }
      }
    };
    .right{
      flex: 7;
      .content{
        width: 94%;
        float: left;
        margin-left: 2%;
        padding: 2%;
        border-radius: 5px;
        background-color: white;
      }
    };
    .back-top{
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-color: @color_lan;
      line-height: 3rem;
      text-align: center;
      color: white;
      position: fixed;
      right: 5%;
      bottom: 6rem;
      font-size: 12px;
    };
  }
</style>
