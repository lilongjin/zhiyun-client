<template>
  <div class="contents">
    <div class="left">
      <div class="notice">
        <div class="user_img">
          <img v-bind:src="content_detail.author.userimg" alt="">
        </div>
        <div class="user_info">
          <p>昵称：{{content_detail.author.username}}</p>
          <p>性别：{{content_detail.author.sex}}</p>
          <p>生日：{{content_detail.author.age}}</p>
          <p>地区：{{content_detail.author.address}}</p>
          <p>行业：{{content_detail.author.hangye}}</p>
          <p>职位：{{content_detail.author.job}}</p>
          <p>GitHub地址：{{content_detail.author.git}}</p>
          <p>个性签名：{{content_detail.author.sign}}</p>
        </div>
      </div>
      <div class="news_list">
        <div class="hot">
          <div class="hot_title">
            最新文章
          </div>
          <div class="hot_content">
            <div class="news" v-for="item in new_content_list" @click="detail(item._id)">
              <div class="img">
                <img src="../../../static/img/banner.jpg" alt="">
              </div>
              <div class="text">{{item.title}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="content">
        <div class="article_title">{{content_detail.title}}</div>
        <div class="article_msg">
          <p>{{content_detail.author.username}}</p>
          <p>发布于{{content_detail.addtime | formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
          <p>阅读数：{{content_detail.look}}</p>
          <p>点赞数：{{content_detail.zan}}</p>
          <p>评论数：{{content_detail.comments_num}}</p>
        </div>
        <div class="article_content" v-html="content_detail.content"></div>
        <div class="comments">
        <div class="comment_title">评论区</div>
          <div class="inputs" v-if="login">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="想对作者说点什么......"
              v-model="comment">
            </el-input>
          </div>
          <div class="btn" v-show="comment != ''">
            <el-button type="primary" @click="sub()">发表评论</el-button>
            <el-button @click="reset()">清空</el-button>
          </div>
          <div class="comment_list">
            <div class="comment" v-for="(item,index) in comment_list">
              <div class="comment_msg">
                <span>#{{index+1}}楼</span>
                <span>{{item.username}}</span>
                <span>{{item.commentTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
              </div>
              <div class="comment_detail">
                <div class="comment_left">
                  {{item.commentContent}}
                </div>
                <div class="comment_right" @click="answer_f(index)">回复</div>
              </div>
              <div class="inputs" v-show="answer == index">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="想说点什么......"
                  v-model="answer_content">
                </el-input>
              </div>
              <div class="btn" v-show="answer == index">
                <el-button type="primary" @click="answer_sub(item._id,item.username)">提交</el-button>
                <el-button @click="answer_reset()">取消</el-button>
              </div>
              <div class="comment_answer">
                <div class="answer_detail" v-for="answer in item.answerContent">
                  <div class="answer_msg">
                    <span>{{answer.answer_username}}</span>
                    <span>回复</span>
                    <span>{{answer.comment_username}}</span>
                    <span>{{answer.answerTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                  </div>
                  <div class="answer_detail_content">{{answer.content}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return{
        userInfo:"",
        blog:[],
        content_detail:{
          author:{
            username:""
          },
        },
        contentid:"",
        new_content_list:[],
        comment:"",
        answer_content:"",
        answer: -1,
        comment_list:[],
        login:false
      };
    },
    created:function () {
      var userid = localStorage.getItem("userid");
      //验证是否登录
      if(userid && userid !=""){
        this.login = true;
      }
      this.contentid = this.$route.query.id;
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
        this.userInfo = this.$store.getters.userInfo;
      }else{
        this.userInfo = this.$store.getters.userInfo;
        sessionStorage.setItem("store",JSON.stringify(this.$store.state));
      };
      this.get_detail();
    },
    mounted () {
      window.addEventListener('scroll', this.scrollToTop)
    },
    destroyed () {
      window.removeEventListener('scroll', this.scrollToTop)
    },
    methods:{
      detail(id){
        this.$router.push({name:'detail',query: {id:id}})
      },
      get_detail(){
        //获取文章详情
        this.$axios({
          method:'post',
          url:'http://zhiyun_server.lilongjin.cn/main/content_detail',
          data:this.qs.stringify({
            contentid: this.contentid
          })
        }).then((res) => {
          if(res.data.length != 0 ){
            this.content_detail = res.data.content_detail;
            this.comment_list = res.data.comment_list;
            //获取作者最新文章
            this.$axios({
              method:'post',
              url:'http://zhiyun_server.lilongjin.cn/main/content',
              data:this.qs.stringify({
                userid:this.content_detail.author._id,
              })
            }).then((res) => {
              var contents = res.data.all_content;
              for(var i = 0; i<contents.length; i++){
                if(contents[i].category.name == "博客文章"){
                  this.new_content_list.push(contents[i]);
                }
              }
            }).catch((error) => {
              console.log(error);
            });
          }else{
            this.$message({
              showClose: true,
              message: "获取文章详情失败",
              type: 'error'
            });
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      sub(){
        if(this.comment != ""){
          this.$axios({
            method:'post',
            url:'http://zhiyun_server.lilongjin.cn/api/comment_add',
            data:this.qs.stringify({
              username:this.userInfo.username,
              contentid:this.content_detail._id,
              comment:this.comment,
            })
          }).then((res) => {
            if(res){
              this.$message({
                showClose: true,
                message: "评论成功",
                type: 'success'
              });
              this.get_detail();
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
        }else {
          this.$message({
            showClose: true,
            message: "评论内容不能为空",
            type: 'error'
          });
        }
      },
      reset(){
        this.comment = "";
      },
      answer_f(index){
        //验证是否登录
        if(this.login){
          this.answer = index;
        }else{
          this.$message({
            showClose: true,
            message: "亲，请先登录",
            type: 'warn'
          });
        }
      },
      answer_sub(id,comment_username){
        if(this.answer_content != ""){
          this.$axios({
            method:'post',
            url:'http://zhiyun_server.lilongjin.cn/api/comment_answer',
            data:this.qs.stringify({
              comment_username:comment_username,
              answer_username:this.userInfo.username,
              contentid:this.content_detail._id,
              commentid:id,
              answer_content:this.answer_content,
            })
          }).then((res) => {
            if(res){
              this.$message({
                showClose: true,
                message: "回复成功",
                type: 'success'
              });
              this.get_detail();
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
        }else {
          this.$message({
            showClose: true,
            message: "回复内容不能为空",
            type: 'error'
          });
        }
      },
      answer_reset(){
        this.answer_content = "";
        this.answer = -1;
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../static/less/main.less";
  .contents{
    width:60%;
    min-height: 50rem;
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
            width: 30%;
            float: left;
            margin-left: 35%;
            margin-top: 1rem;
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
        .article_title{
          width: 100%;
          float: left;
          min-height: 3rem;
          line-height: 3rem;
          font-size: 1.8rem;
          font-weight: bold;
          color: @color_txt;
        }
        .article_msg{
          width: 100%;
          float: left;
          height: 3rem;
          line-height: 3rem;
          font-size: .8rem;
          margin-bottom: 1rem;
          color: @color_content;
          border-bottom: 1px solid @color_bg;
          p{
            float: left;
            padding-right: 1rem;
            &:nth-child(1){
              color: @color_lan;
            }
          }
        }
        .article_content{
          width: 100%;
          float: left;
          line-height: 2rem;
          color: @color_title;
          img{
            max-width: 90%;
          }
        }
        .inputs{
          width: 98%;
          float: left;
          margin-left: 2%;
        }
        .btn{
          width: 98%;
          float: left;
          margin-left: 2%;
        }
        .comments{
          width: 100%;
          float: left;
          line-height: 2rem;
          color: @color_title;
          margin-top: 1rem;
          border-top: 1px solid @color_bg;
          .comment_title{
            width: 100%;
            float: left;
            min-height: 3rem;
            line-height: 3rem;
            font-size: 1rem;
            font-weight: bold;
            color: @color_txt;
            border-bottom: 1px solid @color_bg;
          }
          .comment_list{
            width: 100%;
            float: left;
            min-height: 3rem;
            line-height: 3rem;
            font-size: 1rem;
            color: @color_txt;
            .comment{
              width: 100%;
              float: left;
              border-bottom: 1px solid @color_bg;
              .comment_msg{
                span{
                  margin: 0 .5rem 0 .5rem;
                  font-size: .8rem;
                  color: @color_fenlei;
                  &:nth-child(1){
                    font-size: .9rem;
                    color: @color_txt;
                    font-weight: bold;
                  }
                }
              }
              .comment_detail{
                width: 100%;
                float: left;
                .comment_left{
                  width: 95%;
                  float: left;
                  font-size: .8rem;
                  color: @color_title;
                  text-indent: 1rem;
                }
                .comment_right{
                  width: 5%;
                  float: left;
                  text-align: center;
                  color:@color_date;
                  cursor: pointer;
                }
              }
              .comment_answer{
                width: 96%;
                float: left;
                margin-left: 2%;
                line-height: 2rem;
                padding: 0 1% 0 1%;
                margin-bottom: 1rem;
                background-color: @color_bg;
                .answer_detail{
                  width: 100%;
                  float: left;
                  .answer_msg{
                    width: 100%;
                    float: left;
                    span{
                      font-size: .8rem;
                      color:@color_fenlei;
                      &:nth-child(2){
                        color: @color_lan;
                        margin: 0 .5rem 0 .5rem;
                      }
                      &:nth-child(3){
                        margin: 0 .5rem 0 0;
                      }
                    }
                  };
                  .answer_detail_content{
                    font-size: .8rem;
                    color:@color_fenlei;
                  }
                }
              }
            }
          }
          .inputs{
            width: 98%;
            float: left;
            margin-top: 1rem;
          }
          .btn{
            width: 100%;
            float: left;
            margin-top: 1rem;
            margin-bottom: 2rem;
          }
        }
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
