


<template>
  <div class="login">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">
        XMP-ADMIN 后台管理系统
      </h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" prefix-icon="el-icon-user">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" prefix-icon="el-icon-unlock">
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
        记住我
      </el-checkbox>
      <!-- 按钮 -->
      <el-form-item class="btns" style="width:100%;">
        <el-button type="primary" @click="login">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <el-button type="info" @click="restLoginForm">重置</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>
import { encrypt } from "@/utils/rsaEncrypt";
export default {
  components: {},
  data() {
    return {
      loading: false,
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "123456",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  created() {
    this.getCode();
  },
  mounted() {},
  methods: {
    restLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // console.log(this);
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        this.loading = true;
        this.loginForm.password = encrypt(this.loginForm.password);
        // console.log(this.loginForm.password);
        const { data: res } = await this.$http.post(
          "/auth/login",
          this.loginForm
        );
        // console.log(res);
        if (res.returnCode !== 1000) return this.$message.error("登录失败!");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.dataInfo);
        this.$router.push("/home");
      });
    },
    async getCode() {
      console.log("获取验证码");
      const { data: res } = await this.$http.get("/auth/code");
      console.log(res);
      if (res.returnCode !== 1000) return this.$message.error(res.message);
      // this.menuList = res.data;
      this.codeUrl = res.dataInfo.img;
      this.loginForm.uuid = res.dataInfo.uuid;
    },
  },
};
</script>

<style scoped lang="less">
.btns {
  display: flex;
  justify-content: center;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  background-color: #2b4b6b;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>
