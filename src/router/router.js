// 一级路由文件
import index from '../components/one/index.vue'
import detail from '../components/one/detail.vue'
import user from '../components/one/user.vue'
import write from '../components/one/write.vue'
import chat from '../components/one/chat.vue'
// 二级路由文件
import user_msg from '../components/two/user_msg.vue'
import user_edit from '../components/two/user_edit.vue'
import index_content from '../components/two/index_content.vue'
import blog_content from '../components/two/blog_content.vue'
import question_content from '../components/two/question_content.vue'
import hot_content from '../components/two/hot_content.vue'
import search_content from '../components/two/search_content.vue'
import write_new from '../components/two/write_new.vue'
import write_edit from '../components/two/write_edit.vue'

// 路由字典
export const routes=[
  {path:'/',name:"index",component:index,
    redirect:'/index_content', // 设置默认打开的页面
    children:[
      {path:'/index_content',name:"index_content",component:index_content},
      {path:'/blog_content',name:"blog_content",component:blog_content},
      {path:'/question_content',name:"question_content",component:question_content},
      {path:'/hot_content',name:"hot_content",component:hot_content},
      {path:'/search_content',name:"search_content",component:search_content},
    ]
  },
  {path:'/detail',name:"detail",component:detail},
  {path:'/user',name:"user",component:user,
    redirect:'/user_msg',
    children:[
      {path:'/user_msg',name:"user_msg",component:user_msg},
      {path:'/user_edit',name:"user_edit",component:user_edit},
      {path:'/write_edit',name:"write_edit",component:write_edit},
    ]
  },
  {path:'/write',name:"write",component:write,
    redirect:'/write_new',
    children:[
      {path:'/write_new',name:"write_new",component:write_new},
    ]
  },
  {path:'/chat',name:"chat",component:chat},
  // 以上都不匹配默认跳转为首页
  {path:'*',redirect:'/index'},

];

