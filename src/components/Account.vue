<template>
  <div style="clear: both">
    <select size="10" v-model="selected" style="min-width: 48px">
      <option
        v-for="(accountInfo, index) in accountInfos"
        :key="accountInfo.account"
        :value="index"
        @click="accountSelected(accountInfo.account)"
        style="height: 5px"
      >
        {{ accountInfo.isAdmin ? "管理员" : "用户名" }} ：
        {{ accountInfo.account }}
      </option>
    </select>
    <select size="10" style="min-width: 48px">
      <option v-for="player in players" :key="player" style="height: 5px">
        {{ player }}
      </option>
    </select>
  </div>
  <div style="clear: both">
    <input type="button" @click="toPanelComponent" value="返回" />
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from "vue";
import apis from "../apis";
import { AccountInfo } from "../apis";
import Panel from "./Panel.vue";

export default defineComponent({
  name: "account-component",
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
    let players: string[] = [" "];
    return {
      selected: -1,
      players: players,
    };
  },
  computed: {},
  methods: {
    accountSelected(account: string) {
      console.log(account);
      this.players = [" "];
      if (account) {
        apis.getPlayers(account).then((player_list: string[]) => {
          console.log("player_list:" + player_list);
          if (player_list) {
            this.players = player_list;
          }
        });
      }
    },
    toPanelComponent() {
      this.common.component = Panel.name;
    },
  },
  setup(props) {
    let accountInfos: Ref<AccountInfo[]> = ref(new Array());
    apis.getAccounts().then((account_array) => {
      accountInfos.value = account_array;
    });
    return {
      accountInfos,
    };
  },
});
</script>

<style scoped>
</style>
