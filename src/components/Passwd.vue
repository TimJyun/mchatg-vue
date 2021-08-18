<template>
  <form>
    <div>
      <input type="password" placeholder="请输入您的密码" v-model="keyPasswd" />
    </div>
    <div>
      <!-- select -->
      <!-- <input
        type="text"
        disabled="disabled"
        placeholder="将要修改密码的用户名"
        v-model="account"
      /> -->
      <select
        size="1"
        v-model="account"
        :disabled="{ disabled: common.authorization.isAdmin }"
      >
        <option
          v-for="accountInfo in accountInfos"
          :key="accountInfo.account"
          :value="accountInfo.account"
          style="height: 5px"
        >
          {{ accountInfo.account }}
        </option>
      </select>
    </div>
    <br />
    <br />
    <div>
      <input type="password" placeholder="新密码" v-model="passwd" />
    </div>
    <br />
    <div>
      <input type="password" placeholder="请重复输入新密码" v-model="passwd2" />
    </div>
    <br />
    <div>
      <span><input type="button" @click="updatePasswd" value="修改" /></span>
      <span>
        <input type="button" @click="toPanelComponent" value="返回" />
      </span>
    </div>
    <div>
      <p>私聊bot发送以下命令绑定帐号</p>
      <p>/bind {{ common.authorization.token }}</p>
    </div>

    <br />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import apis, { AccountInfo } from "../apis";
import Panel from "./Panel.vue";

export default defineComponent({
  name: "passwd-component",
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
      account: this.common.account,
      keyPasswd: "",
      passwd: "",
      passwd2: "",
    };
  },
  methods: {
    updatePasswd() {
      if (this.passwd !== this.passwd2) {
        window.alert("修改失败，两次输入的密码不一致");
        return;
      }
      apis
        .updatePasswd(this.keyPasswd, this.account, this.passwd)
        .then((success) => {
          if (success) {
            window.alert("修改成功");
          } else {
            window.alert("修改失败，密码错误或缺乏权限");
          }
        });
    },
    toPanelComponent() {
      this.common.component = Panel.name;
    },
  },
  setup(props) {
    let accountInfos: Ref<AccountInfo[]> = ref(new Array());
    if (props.common.authorization.isAdmin) {
      apis.getAccounts().then((account_array) => {
        accountInfos.value = account_array;
      });
    }

    return {
      accountInfos,
    };
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
