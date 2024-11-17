<template>
  <div class="index">
    <div class="form animated-form" v-if="!showRegisterForm">
      <h2>登录</h2>
      <el-form :model="form" label-width="auto" class="loginForm">
        <el-form-item label="账号">
          <el-input v-model="form.userid" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.psw" placeholder="请输入密码" type="password" />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login" class="loginBtn">登录</el-button>
      <el-button type="text" @click="toggleForm">没有账号？去注册</el-button>
    </div>
    <div class="form animated-form" v-else>
      <h2>注册</h2>
      <el-form :rules="registerRules" :model="registerForm" label-width="auto" class="loginForm">
        <el-form-item label="账号">
          <el-input v-model="registerForm.userid" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.psw" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="registerForm.confirmPsw" placeholder="请确认密码" type="password" />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="register" class="loginBtn">注册</el-button>
      <el-button type="text" @click="toggleForm">已有账号？去登录</el-button>
    </div>
    <el-dialog :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-model="form.loginFlag"
      title="登录成功！" width="280">
      <p>请选择你要登录的角色：</p>
      <div class="choose">
        <!-- <el-button type="primary" @click="chooseRole(0)">系统管理员</el-button>
        <el-button type="primary" @click="chooseRole(1)">员工</el-button>
        <el-button type="primary" @click="chooseRole(2)">人事专员</el-button>
        <el-button type="primary" @click="chooseRole(3)">财政专员</el-button>
        <el-button type="primary" @click="chooseRole(4)">技术部主管</el-button>
        <el-button type="primary" @click="chooseRole(5)">人事经理</el-button>
        <el-button type="primary" @click="chooseRole(6)">招聘助理</el-button>
        <el-button type="primary" @click="chooseRole(7)">应聘者</el-button> -->
        <el-button type="primary" v-for="item in (user.roleList || [])" :key="item" @click="chooseRole(item)">{{
          Role[item] }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { useUserStore } from '../stores/user';
import { ref } from "vue";
import { ElMessage } from 'element-plus'
import { Role, userRegisterServe } from '@/api/user';
const router = useRouter();
const { loginFunc, user, setRole } = useUserStore()
interface FormType {
  userid: string;
  psw: string;
  loginFlag: boolean
}

const form: FormType = reactive({
  userid: "",
  psw: "",
  loginFlag: false
});
const registerForm = reactive({
  userid: "",
  psw: "",
  confirmPsw: ""
});
// 注册表单的验证规则
const registerRules = {
  userid: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { pattern: /^\d{3,10}$/, message: '账号必须是3-10位的数字', trigger: 'blur' }
  ],
  psw: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
  ],
  confirmPsw: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

// 确认密码的自定义验证器
function validateConfirmPassword(rule, value, callback) {
  if (value !== registerForm.psw) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
}
// 注册函数
async function register() {
  const res = await registerFunc({
    userid: registerForm.userid,
    psw: registerForm.psw
  });
  if (res.success) {
    ElMessage({
      message: '注册成功！请登录',
      type: 'success',
    });
    registerForm.userid = "";
    registerForm.psw = "";
    registerForm.confirmPsw = "";
    toggleForm(); // 切换回登录表单
  }
  else {
    console.log(JSON.stringify(res));
    
    ElMessage({
      message: res.errMsg,
      type: 'error',
    });
  }
}

// 切换表单显示
const showRegisterForm = ref(false);
function toggleForm() {
  showRegisterForm.value = !showRegisterForm.value;
}

// 假设的注册函数（需要根据实际后端API实现）
async function registerFunc({ userid, psw }) {
  return await userRegisterServe({ userid, psw });
}
async function login() {
  console.log("form=" + form.userid, form.psw);
  const res = await loginFunc({
    'userid': form.userid,
    'psw': form.psw
  })
  console.log("res", res);
  if (res.success) {
    console.log("登录成功：" + res);
    // 登录成功后，角色列表应该已经更新
    // 登录成功后显示提示框
    // loginSuccess.value = true;
    if(user.roleList.length===0){
      chooseRole(7)
    }
    else form.loginFlag = true;
  }
  else {
    ElMessage({
      message: res.errMsg||'登录失败！请重试',
      type: 'error',
    })
    form.userid = ""
    form.psw = ""
    console.log("登录失败：" + res);
  }
  // form.loginFlag=res;
  // router.push('/recruit');
}
// 用于控制 alert 提示框的显示
const loginSuccess = ref(false);

async function chooseRole(role) {
  setRole(role);
  router.push('/directory/index');
}
</script>

<style scoped>
.index {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/loginBg.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  width: 350px;
  height: 350px;
  color: #1969ff;
  /* background-color: #5eb4ee;  */
  background: linear-gradient(to bottom, #fff, rgb(154, 209, 241));
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.form:hover {
  transform: translateY(-0.125rem);
}

.animated-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  animation: gradientAnimation 5s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.loginForm {
  margin-top: 20px;
  width: 100%;
}

.loginBtn {
  width: 100%;
  margin-top: 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.loginBtn:hover {
  background-color: #409EFF;
  border-color: #409EFF;
}

.choose {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
}

.choose>button {
  width: 90%;
  margin-top: 13px;
  margin-left: 0px;
  border-radius: 6px;
}

/deep/ .el-dialog__header {
  padding-bottom: 10px;
}
</style>