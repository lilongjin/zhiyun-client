<template>
  <div class="contents">
    <div class="left">
      <div class="content">
        <div class="banner">
          <el-carousel trigger="click" height="20rem">
            <el-carousel-item v-for="(item,index) in banner_data" :key="index">
              <img v-bind:src="item.url" alt="">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="content_list">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="notice">
        <a v-bind:herf="other_data.noticeUrl">
          <img v-bind:src="other_data.noticeImg" alt="">
        </a>
      </div>
      <div class="news_list">
        <div class="hot">
          <div class="hot_title">
            热门文章
          </div>
          <div class="hot_content">
            <div class="news" v-for="item in blog" @click="detail(item._id)">
              <div class="img">
                <img src="../../../static/img/banner.jpg" alt="">
              </div>
              <div class="text">
                {{item.title}}
              </div>
            </div>
          </div>
        </div>
        <div class="hot">
          <div class="hot_title">
            关于我们
          </div>
          <div class="hot_content">
            <div class="about_me">
              <div class="num">
                <span>QQ交流群:</span>
                <span>{{other_data.qq}}</span>
              </div>
              <div class="num">
                <span>GitHub地址:</span>
                <span>{{other_data.git}}</span>
              </div>
              <div class="num">
                <span>技术支持:</span>
                <span>{{other_data.support}}</span>
              </div>
              <div class="ma">
                <img v-bind:src="other_data.ma1Img" alt="">
                <p>{{other_data.ma1Title}}</p>
              </div>
              <div class="ma">
                <img v-bind:src="other_data.ma2Img" alt="">
                <p>{{other_data.ma2Title}}</p>
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
      blog:[],
      banner_data:[],
      other_data:""
    };
  },
  created:function () {
    //获取全部轮播图
    this.$axios({
      method: 'post',
      url: 'http://zhiyun_server.lilongjin.cn/admin/banner_list',
    }).then((res) => {
      this.banner_data = res.data;
    }).catch((error) => {
      console.log(error);
    });
    //获取热门文章
    this.$axios({
      method: 'post',
      url: 'http://zhiyun_server.lilongjin.cn/main/content_all_hot',
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
    this.other_msg();
  },
  methods: {
    detail(id) {
      this.$router.push({name: 'detail', query: {id: id}})
    },
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
  @import "../../../static/less/main.less";
  .contents{
    width:60%;
    float: left;
    margin-left: 20%;
    margin-top: .5rem;
    margin-bottom: 2rem;
    display: flex;
    .left{
      flex: 7;
      .content{
        width: 98%;
        float: left;
        .banner{
          width: 100%;
          float: left;
          img{
            width: 100%;
            height: 100%;
          }
          p{
            position: absolute;
            bottom: 2rem;
            left: 2%;
            width: 96%;
            color: white;
            height: 2rem;
            line-height: 2rem;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        };
        .content_list{
          width: 100%;
          float: left;
          margin-bottom: .5rem;
        }
      }
    };
    .right{
      flex: 3;
      .notice{
        width: 100%;
        height: 20rem;
        float: left;
        cursor: pointer;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .news_list{
        width: 100%;
        float: left;
        margin-top: .5rem;
        margin-bottom: 2rem;
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
            .notice_img{
              width: 100%;
              float: left;
              margin: 1rem 0 1rem 0;
              img{
                width: 100%;
              }
            }
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
  }
</style>
