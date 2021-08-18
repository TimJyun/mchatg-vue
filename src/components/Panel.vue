<template>
  <div>
    欢迎 {{ common.account }} 登录,
    <input type="button" @click="toFileListComponent" value="文件列表" />
    <a href="https://adoptopenjdk.net" target="_blank"
      ><button>下载openjdk</button>
    </a>
  </div>
  <div v-if="players.length === 0">
    <h4>您并没有注册任何游戏名</h4>
  </div>
  <div v-else>
    <h4>以下是您的游戏名称</h4>

    <div v-for="player in players" :key="player" id="playerlist">
      {{ player }}
      <input type="button" @click="removePlayer(player)" value="注销" />
      <input type="button" @click="unlock([player])" value="解锁" />
    </div>
    <div>
      <input type="button" @click="unlock(players)" value="解锁全部" />
    </div>
  </div>

  <div>
    <input type="text" placeholder="游戏名" v-model="tragetPlayerName" />
    <input type="button" @click="addPlayer" value="注册" />
  </div>
 
  <div>
    <button @click="toPasswdComponent">修改密码</button>
    <button v-if="common.authorization.isAdmin" @click="toAccountComponent">
      管理用户
    </button>
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from "vue";
import apis from "../apis";
import Passwd from "./Passwd.vue";
import Account from "./Account.vue";
import FileList from "./FileList.vue";
import untils from "../untils";

export default defineComponent({
  name: "panel-component",
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
      tragetPlayerName: "",
    };
  },
  methods: {
    unlock(players: string[]) {
      for (let index = 0; index < players.length; index++) {
        apis.unlock(players[index]).then((success) => {
          if (!success) {
            window.alert(players[index] + "解锁失败");
          }
        });
      }
      window.alert("已尝试解锁目标角色");
    },

    addPlayer() {
      let player = this.tragetPlayerName;
      apis.addPlayer(this.common.account, player).then((success) => {
        if (success) {
          window.alert("注册成功");
          this.players.push(player);
        } else {
          window.alert("注册失败");
        }
      });
    },
    removePlayer(player: string) {
      if (!confirm("确认注销游戏名 " + player + " ?")) {
        return false;
      }

      apis.removePlayer(player).then((success) => {
        if (success) {
          apis.getPlayers(this.common.account).then((player_list) => {
            if (player_list) this.players = player_list;
            //TODO:isCheck:clear
          });
        } else {
          window.alert("注销失败");
        }
      });
    },
    toPasswdComponent() {
      this.common.component = Passwd.name;
    },
    toAccountComponent() {
      this.common.component = Account.name;
    },
    toFileListComponent() {
      this.common.component = FileList.name;
    },
  },
  setup(props) {
    let players: Ref<string[]> = ref(new Array());
    let isChecked: Ref<boolean[]> = ref(new Array());
    apis.getPlayers(props.common.account).then((player_array) => {
      if (player_array) {
        players.value = player_array;
        for (let index = 0; index < player_array.length; index++) {
          isChecked.value[index] = true;
        }
      }
    });
    return {
      players,
      isChecked,
    };
  },
});
</script>

<style scoped>
a {
  color: red;
  background: blue;
  text-decoration: none;
} /* 未被访问的链接 蓝色 */

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

/* #playerlist {
  text-align: left;
} */
</style>
