<template>
  <div id="box">
    <img alt="Mchatg logo" src="./assets/logo.png" />
    <div v-if="common.component == 'login-component'">
      <login-component :common="common" />
    </div>
    <div v-else-if="common.component == 'panel-component'">
      <panel-component :common="common" />
    </div>
    <div v-else-if="common.component == 'passwd-component'">
      <passwd-component :common="common" />
    </div>
    <div v-else-if="common.component == 'account-component'">
      <account-component :common="common" />
    </div>
    <div v-else-if="common.component == 'file-list-component'">
      <file-list-component :common="common" />
    </div>
  </div>
</template>

<script lang="ts">
import Login from "./components/Login.vue";
import Panel from "./components/Panel.vue";
import Passwd from "./components/Passwd.vue";
import Account from "./components/Account.vue";
import FileList from "./components/FileList.vue";

export default {
  name: "App",
  components: {
    "login-component": Login,
    "panel-component": Panel,
    "passwd-component": Passwd,
    "account-component": Account,
    "file-list-component": FileList,
  },

  data() {
    return {
      common: {
        account: "",
        Authorization: {
          token: "",
          isAdmin: false,
        },
        component: Login.name,
      },
    };
  },

  methods: {},
  setup: () => {},
};
</script>

<style>
#app {
  text-align: center;
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
#box {
  margin: auto;
  max-width: 360px;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>