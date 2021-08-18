import axios, { AxiosRequestConfig } from "axios";
import untils from "./untils";
export default {


  register: async function (account: string, passwd: string, invitecode: string): Promise<boolean> {

    const { data } = await axios.post("/api/registeraccount", { account: account, passwd: untils.hash(passwd), invitecode: invitecode })

    console.log(data.result)

    if (data.result) return true
    return false


  },

  getToken: async function (account: string, passwd: string): Promise<Authorization> {
    const { data } = await axios.post("/api/gettoken", { account: account, passwd: untils.hash(passwd), })
    console.log(data.result)
    if (data.result) {
      console.log(data.result.token)
      axios.defaults.headers.Authorization = data.result.token
      // axios.defaults.auth = data.result.token
      return data.result
    }
    return {
      token: "",
      isAdmin: false
    }


  },


  getPlayers: async function (account: string): Promise<string[]> {

    const { data } = await (await axios.post("/api/getplayers", { account: account }))
    console.log(data.result)

    if (data.result) return data.result
    return []



  },
  addPlayer: async function (account: string, player: string): Promise<boolean> {

    const { data } = await axios.post("/api/addplayer", { account: account, player: player })
    console.log(data.result)
    if (data.result) return true
    return false

  },

  removePlayer: async function (player: string): Promise<boolean> {

    const { data } = await axios.post("/api/removeplayer", { player: player })

    console.log(data.result)
    if (data.result) return true
    return false

  },

  unlock: async function (player: string): Promise<boolean> {
    const { data } = await axios.post("/api/unlock", { player: player })
    console.log(data.result)
    if (data.result) return true
    return false

  },

  updatePasswd: async function (tokenPasswd: string, account: string, passwd: string): Promise<boolean> {
    const { data } = await axios.post("/api/updatepasswd", {
      tokenPasswd: untils.hash(tokenPasswd), account: account, passwd: untils.hash(passwd)
    })
    console.log(data.result)
    if (data.result) return true
    return false

  },

  getAccounts: async function (): Promise<AccountInfo[]> {
    const { data } = await axios.post("/api/getaccounts")
    console.log(data.result)
    if (data.result) return data.result
    return []
  },


  //TODO:文件功能
  addFile: async function (name: string, file: File, config: AxiosRequestConfig): Promise<boolean> {
    //TODO:test
    const { data } = await axios.post("/api/addfile?name=" + name + "&length=" + file.size,
      await file.arrayBuffer(), config)
    console.log(data.result)
    if (data.result) return true
    return false
  },

  deleteFile: async function (name: string): Promise<boolean> {
    const { data } = await axios.post("/api/deletefile",
      { name: name })
    console.log(data.result)
    if (data.result) return true
    return false
  },
  getFiles: async function (): Promise<string[]> {
    const { data } = await axios.post("/api/getfiles")
    console.log(data.result)
    if (data.result) return data.result
    return []
  },
  downloadFile: function (name: string) {
    let ele = document.createElement('a');
    ele.setAttribute('href', "/api/downloadfile?name=" + name); //设置下载文件的url地址
    ele.setAttribute('download', name);//用于设置下载文件的文件名
    ele.click();
  },
}

export interface Authorization {
  token: string,
  isAdmin: boolean,
}
export interface AccountInfo {
  account: string,
  telegramUID: string //number值，避免被近似
  isAdmin: boolean,
}



// getPlayers: function (account: String, result: Ref<String[]>) {
//   axios({
//     method: "post",
//     url: "/api/getplayers",
//     data: {
//       account: account,
//     },
//   }).then((response) => {
//     console.log(response);
//     if (response.data.success === true) {
//       result = response.data.players;
//       // console.log("获取玩家名成功");

//     }
//   }

//   );

// }