<template>
    <div>
        <div class="user_edit_title">修改个人资料</div>
        <el-form :model="userform" status-icon :rules="rules" ref="userform" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名：" prop="username">
                <el-input type="text" v-model="userform.username" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
                <el-input type="text" v-model="userform.sex" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="生日：" prop="age">
                <el-input type="text" v-model="userform.age"></el-input>
            </el-form-item>
            <el-form-item label="地区：" prop="address">
                <el-input type="text" v-model="userform.address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="行业：" prop="hangye">
                <el-input type="text" v-model="userform.hangye" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="职位：" prop="job">
                <el-input type="text" v-model="userform.job" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="GitHub地址：" prop="git">
                <el-input type="text" v-model="userform.git"></el-input>
            </el-form-item>
            <el-form-item label="个性签名：" prop="sign">
                <el-input type="text" v-model="userform.sign"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('userform')">提交</el-button>
                <el-button @click="resetForm('userform')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            var username = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('昵称不能为空'));
                }else{
                    callback();
                }
            };
            var sex = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('性别不能为空'));
                }else{
                    callback();
                }
            };
            var age = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('年龄不能为空'));
                }else{
                    callback();
                }
            };
            var address = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('地址不能为空'));
                }else{
                    callback();
                }
            };
            var hangye = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('行业不能为空'));
                }else{
                    callback();
                }
            };
            var job = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('职位不能为空'));
                }else{
                    callback();
                }
            };
            var git = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('GitHub地址不能为空'));
                }else{
                    callback();
                }
            };
            var sign = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('个人签名不能为空'));
                }else{
                    callback();
                }
            };
            return {
              userInfo:null,
              userform:null,
              rules: {
                    username: [
                        { validator: username, trigger: 'blur' }
                    ],
                    sex: [
                        { validator: sex, trigger: 'blur' }
                    ],
                    age: [
                        { validator: age, trigger: 'blur' }
                    ],
                    address: [
                        { validator: address, trigger: 'blur' }
                    ],
                    hangye: [
                        { validator: hangye, trigger: 'blur' }
                    ],
                    job: [
                        { validator: job, trigger: 'blur' }
                    ],
                    git: [
                        { validator: git, trigger: 'blur' }
                    ],
                    sign: [
                        { validator: sign, trigger: 'blur' }
                    ],
                }
            };
        },
        created:function (){
          var userid = localStorage.getItem("userid");
          //验证是否登录
          if(!userid || userid ==""){
            this.$router.push({ name: 'index_content'});
          }
          this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
          this.userInfo = this.$store.getters.userInfo;
          this.userform = this.$store.getters.userInfo;
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      this.$axios({
                        method:'post',
                        url:'http://zhiyun_server.lilongjin.cn/api/user/user_edit',
                        data:this.qs.stringify({
                          userform:this.userform,
                        })
                      }).then((res) => {
                        if(res.data.code == 0){
                          this.$message({
                            showClose: true,
                            message: "修改个人信息成功",
                            type: 'success'
                          });
                          //将获取成功后的用户信息提交存储到vuex中
                          this.$store.dispatch("change_userInfo_f",res.data);
                          //更新sessionStorage用户信息
                          sessionStorage.setItem("store",JSON.stringify(this.$store.state));
                          //更新当前页面用户信息
                          location.reload();
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
                        this.$message.error('请完善个人信息后再提交');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../static/less/main.less";
    .user_edit_title{
        width: 100%;
        float: left;
        min-height: 3rem;
        line-height: 3rem;
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        color: @color_txt;
    }
</style>
