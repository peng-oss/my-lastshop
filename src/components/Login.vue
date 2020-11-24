<template>
  <div class="login_container">
    <div class="login_box">
      <!--  //头像 -->
      <div class="navatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- //表单 -->
      <el-form
        ref="loginform"
        label-width="0px"
        class="logn_form"
        :model="loginform"
        :rules="loginFormrules"
      >
        <!--  用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginform.username"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <!--   密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginform.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!--  按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginform: {
        username: 'admin',
        password: '123456',
      },
      loginFormrules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    resetloginform() {
      this.$refs.loginform.resetFields()
    },
    login() {
      this.$refs.loginform.validate(async (validate) => {
        if (!validate) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginform)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败，密码与用户不匹配')
        } else {
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  .navatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
.logn_form {
  position: absolute;
  bottom: 50px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
