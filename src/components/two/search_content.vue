<template>
    <div>
        <div class="article" v-for="item in result">
            <div class="article_title" @click="detail(item._id)">{{item.title}}</div>
            <div class="article_content" v-html="item.content" @click="detail(item._id)"></div>
            <div class="article_msg">
                <div class="user">
                    <img v-bind:src="item.author.userimg" alt="">
                    <p v-if="">{{item.author.username}} 发布于 {{item.addtime | formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
                </div>
                <div class="msg">
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
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                result: [],
            };
        },
        created: function () {
//          console.log(this.$route.params.content_title);
          this.$axios({
            method: 'post',
            url: 'http://zhiyun_server.lilongjin.cn/main/content_all_search',
            data:this.qs.stringify({
              content_title:this.$route.params.content_title,
            })
          }).then((res) => {
            //从全部文章中检索标题包含用户搜索内容的文章
            var find_data = res.data;
            var new_search_data = [];
            for(let i = 0; i<find_data.length; i++){
              if(find_data[i].title.indexOf(this.$route.params.content_title) != -1){
                new_search_data.push(find_data[i]);
                this.result = new_search_data;
              };
            };
          }).catch((error) => {
            console.log(error);
          });
        },
        methods: {
            detail(id) {
                this.$router.push({name: 'detail', query: {id: id}})
            },
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../static/less/main.less";
    .article {
        width: 100%;
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
                };
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
</style>
