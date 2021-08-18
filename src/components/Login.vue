<template>
  <form>
    <div>
      <input type="text" placeholder="用户名" v-model="common.account" />
    </div>
    <br />
    <div>
      <input type="password" placeholder="密码" v-model="passwd" />
    </div>
    <br />
    <div>
      <input type="text" placeholder="邀请码(注册所需)" v-model="invitecode" />
    </div>
    <br />
    <div>
      <span><input type="button" @click="register" value="注册" /></span>
      <span><input type="button" @click="login" value="登录" /></span>
    </div>
    <br />
    <div>
      <input
        type="password"
        placeholder="请重复输入密码"
        v-model="passwd2"
        v-show="passwd2show"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import apis from "../apis";
import Panel from "./Panel.vue";

export default defineComponent({
  name: "login-component",
  props: {
    common: {
      type: Object,
      default: {
        account: "",
        authorization: {
          token: "",
          isAdmin: false,
        },
        component: "",
      },
    },
  },
  data() {
    return {
      passwd: "",
      invitecode: "",
      passwd2: "",
      passwd2show: false,
    };
  },
  methods: {
    async register() {
      if (!this.passwd2show) {
        this.passwd2show = true;
        return;
      }
      if (this.passwd !== this.passwd2) {
        window.alert("注册失败，两次输入的密码不一致");
        return;
      }

      let isSuccess = await apis.register(
        this.common.account,
        this.passwd,
        this.invitecode
      );
      if (isSuccess) {
        this.login();
        window.alert("注册成功，已自动登录");
      } else {
        window.alert("注册失败");
      }
    },
    async login() {
      this.common.authorization = await apis.getToken(
        this.common.account,
        this.passwd
      );
      if (!this.common.authorization.token) {
        window.alert("密码不正确或帐号未注册");
      } else {
        this.common.component = Panel.name;
      }
    },
  },
});
</script>

<style scoped>
/* a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
} */
</style>
