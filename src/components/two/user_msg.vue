<template>
    <div>
        <div class="me_title">最新动态</div>
        <div class="me_msg">
            <p>我的博客文章：{{blog.length}}</p>
            <p>我的论坛问答：{{question.length}}</p>
        </div>
        <div class="dongtai" v-for="item in content_list">
            <div class="dongtai_title" @click="detail(item._id)">{{item.title}}</div>
            <div class="dongtai_content" @click="detail(item._id)" v-html="item.content">
            </div>
            <div class="dongtai_msg">
                <div class="date">
                  <p>{{item.addtime | formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
                  <p>
                    <span class="iconfont icon-zan"></span>
                    <span>{{item.zan}}</span>
                  </p>
                  <p>
                    <span class="el-icon-view"></span>
                    <span>{{item.look}}</span>
                  </p>
                  <p>
                    <span class="el-icon-chat-dot-round"></span>
                    <span>{{item.comments_num}}</span>
                  </p>
                </div>
                <div class="msg">
                  <p>
                    <span class="el-icon-edit"></span>
                    <span @click="write_edit(item._id)">编辑</span>
                  </p>
                  <p>
                    <span class="el-icon-delete"></span>
                    <span @click="delete_content(item._id)">删除</span>
                  </p>
                </div>
            </div>
        </div>
        <div class="get_more" @click="get_more()">{{more_text}}</div>
    </div>
</template>
<script>
    export default {
        data (){
            return{
              userInfo:null,
              content_list:[],
              blog:[],
              question :[],
              more_text:"加载更多动态",
              page:2
            };
        },
        created:function () {
          var userid = localStorage.getItem("userid");
          //验证是否登录
          if(!userid || userid ==""){
            this.$router.push({ name: 'index_content'});
          }
          //在页面加载时读取sessionStorage里的状态信息
          this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
          this.userInfo = this.$store.getters.userInfo;
          this.new_content();
        },
        methods:{
          new_content(){
            this.$axios({
              method:'post',
              url:'http://zhiyun_server.lilongjin.cn/main/content',
              data:this.qs.stringify({
                userid:this.userInfo.userid,
              })
            }).then((res) => {
              this.content_list = res.data.more_content;
              //计算我的博客和论坛数
              var contents = res.data.all_content;
              for(var i = 0; i<contents.length; i++){
                if(contents[i].category.name == "博客文章"){
                  this.blog.push(contents[i]);
                }else if(contents[i].category.name == "论坛问答"){
                  this.question.push(contents[i]);
                }
              }
            }).catch((error) => {
              console.log(error);
            });
          },
          detail(id){
            this.$router.push({name:'detail',query: {id:id}})
          },
          write_edit(id){
            this.$router.push({name:'write_edit',query: {id:id}})
          },
          delete_content(id){
              this.$axios({
                  method:'post',
                  url:'http://zhiyun_server.lilongjin.cn/api/content/delete',
                  data:this.qs.stringify({
                      contentid:id,
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
                          message: "删除失败，该内容不存在",
                          type: 'error'
                      });
                  }
              }).catch((error) => {
                  console.log(error);
              });
          },
          get_more(){
            this.$axios({
              method: 'post',
              url: 'http://zhiyun_server.lilongjin.cn/main/content',
              data:this.qs.stringify({
                page:this.page,
              })
            }).then((res) => {
              if(res.data.more_content != ""){
                this.page++;
                var new_content = res.data.more_content;
                for(var i = 0 ;i<new_content.length;i++){
                  this.content_list.push(new_content[i])
                }
              }else{
                this.$message({
                  showClose: true,
                  message: '亲，暂无更多动态',
                  type: 'warning'
                });
                this.more_text = "暂无更多动态"
              }
            }).catch((error) => {
              console.log(error);
            });
          },
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../static/less/main.less";
    .me_title{
        width: 100%;
        float: left;
        min-height: 3rem;
        line-height: 3rem;
        font-size: 1.5rem;
        font-weight: bold;
        color: @color_txt;
    }
    .me_msg{
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
        }
    }
    .dongtai{
        width: 96%;
        padding: 2%;
        float: left;
        background-color: white;
        margin-top: .5rem;
        cursor: pointer;
        border-bottom: 1px solid @color_bg;
        border-radius: 5px;
        &:hover {
            box-shadow: 0 0 5px #c0c1c2;
        };
        &:last-child{
          border: none;
        }
        .dongtai_title{
            width: 96%;
            float: left;
            padding: 2%;
            font-size: 1.2rem;
            font-weight: bold;
            color: @color_title;
            &:hover{
                color:@color_lan;
            }
        };
        .dongtai_content{
            width: 96%;
            float: left;
            padding: 0 2% 0 2%;
            height: 6rem;
            line-height: 2rem;
            font-size: .9rem;
            color: @color_content;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        };
        .dongtai_msg{
            width: 96%;
            float: left;
            padding: 2%;
            .date{
                float: left;
                font-size: .8rem;
                color: @color_title;
                p{
                  float: left;
                  height: 2rem;
                  line-height: 2rem;
                  margin-left: .5rem;
                  span{
                    font-size: 1rem;
                    &:nth-child(1){
                      margin-right: .5rem;
                    }
                  }
                }
            };
            .msg{
                float: right;
                margin-top: .5rem;
                color:@color_date;
                font-size: 1rem;
                p{
                    float: left;
                    padding: 0 .5rem 0 .5rem;
                    span{
                        &:nth-child(1){
                            margin-right: .5rem;
                            color: @color_txt;
                        }
                    }
                }
            }
        };
    }
    .get_more {
      width: 96%;
      padding: 2%;
      float: left;
      border-radius: 5px;
      background-color: white;
      margin-top: .5rem;
      color: @color_lan;
      text-align: center;
      cursor: pointer;
    }
</style>
