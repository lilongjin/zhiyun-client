<template>
  <div>
    <div class="article" v-for="item in blog">
      <div class="article_title" @click="detail(item._id)">{{item.title}}</div>
      <div class="article_content" v-html="item.content" @click="detail(item._id)"></div>
      <div class="article_msg">
        <div class="user">
          <img v-bind:src="item.author.userimg" alt="">
          <p>{{item.author.username}} 发布于 {{item.addtime | formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
        </div>
        <div class="msg">
          <p>
            <span class="iconfont icon-zan" @click="zan(item._id)"></span>
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
      </div>
    </div>
    <div class="get_more" @click="get_more()">{{more_text}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        blog:[],
        more_text:"加载更多",
        page:2
      }
    },
    created: function () {
      //获取全部文章
      this.$axios({
        method: 'post',
        url: 'http://zhiyun_server.lilongjin.cn/main/content_all',
      }).then((res) => {
        var content_alls = res.data;
        for(var i = 0; i<content_alls.length; i++){
          if(content_alls[i].category.name == "博客文章"){
            this.blog.push(content_alls[i]);
          }
        };
      }).catch((error) => {
        console.log(error);
      });
    },
    methods: {
      detail(id) {
        this.$router.push({name: 'detail', query: {id: id}})
      },
      zan(id){
        //文章点赞
        this.$axios({
          method:'post',
          url:'http://zhiyun_server.lilongjin.cn/api/content_zan',
          data:this.qs.stringify({
            contentid:id
          })
        }).then((res) => {
          if(res) {
            this.$message({
              showClose: true,
              message: "谢谢点赞",
              type: 'success'
            });
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      get_more(){
        this.$axios({
          method: 'post',
          url: 'http://zhiyun_server.lilongjin.cn/main/content_all',
          data:this.qs.stringify({
            page:this.page,
          })
        }).then((res) => {
          if(res.data != ""){
            this.page++;
            var new_content = res.data;
            for(var i = 0; i<new_content.length; i++){
              if(new_content[i].category.name == "博客文章"){
                this.blog.push(new_content[i]);
              }
            };
          }else{
            this.$message({
              showClose: true,
              message: '亲，暂无更多内容',
              type: 'warning'
            });
            this.more_text = "暂无更多内容"
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    },
  }
</script>
<style lang="less" scoped>
  @import "../../../static/less/main.less";
  .article {
    width: 96%;
    padding: 2%;
    float: left;
    border-radius: 5px;
    background-color: white;
    margin-top: .5rem;
    cursor: pointer;
    border-bottom: 1px solid @color_bg;
    &:hover {
      box-shadow: 0 0 5px #c0c1c2;
    };
    .article_title {
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

    .article_content {
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

    .article_msg {
      width: 96%;
      float: left;
      padding: 2%;

      .user {
        float: left;
        font-size: .8rem;
        color: @color_title;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          float: left;
        } ;

        p {
          float: left;
          height: 2rem;
          line-height: 2rem;
          margin-left: .5rem;
        }

      };

      .msg {
        float: right;
        margin-top: .5rem;
        color: @color_date;
        font-size: 1rem;

        p {
          float: left;
          padding: 0 .5rem 0 .5rem;

          span {
            &:nth-child(1) {
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
