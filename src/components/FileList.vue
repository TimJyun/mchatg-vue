<template>
  <div>
    <div v-for="file in files" :key="file">
      {{ file }}
      <input
        type="button"
        v-if="common.authorization.isAdmin"
        @click="deleteFile(file)"
        value="删除"
      />

      <input type="button" @click="downloadFile(file)" value="下载" />
    </div>
    <div  v-if="common.authorization.isAdmin">
      <label> <input type="file" @change="addFile($event)" /> 上传文件 </label>
    </div>
    <div v-if="uploadProcess > 0">
      进度:
      <progress :value="uploadProcess" max="100" />
    </div>
    <div>
      <input
        type="button"
        v-if="uploadProcess > 0"
        @click="tokenSource.cancel()"
        value="停止上传"
      />

      <input type="button" @click="toPanelComponent" value="返回" />
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { ref, Ref, defineComponent } from "vue";
import apis from "../apis";
import Panel from "./Panel.vue";

export default defineComponent({
  name: "file-list-component",
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
      uploadProcess: 0,
      tokenSource: axios.CancelToken.source(),
    };
  },
  methods: {
    reload() {
      apis.getFiles().then((file_array) => {
        this.files = file_array;
      });
    },
    downloadFile(name: string) {
      apis.downloadFile(name);
    },
    deleteFile(name: string) {
      apis.deleteFile(name).then((success) => {
        if (success) {
          window.alert(name + " 删除成功");
          apis.getFiles().then((file_array) => {
            this.files = file_array;
          });
        } else {
          window.alert(name + " 删除失败");
        }
      });
    },
    addFile(event: any) {
      if (this.uploadProcess > 0) {
        return;
      }
      let file: File = event.target.files[0];



      this.tokenSource = axios.CancelToken.source();
      let name = file.name;
      apis
        .addFile(name, file, {
          onUploadProgress: (progressEvent: ProgressEvent) => {
            this.uploadProcess =
              (progressEvent.loaded / progressEvent.total) * 100;
          },
          cancelToken: this.tokenSource.token,
        })
        .then((success) => {
          if (success) {
            this.uploadProcess = 0;
            window.alert(name + " 上传成功");

            this.reload();
          } else {
            this.uploadProcess = 0;
            window.alert(name + " 上传失败");
          }
        })
        .catch((reason) => {
          if (axios.isCancel(reason)) {
            this.uploadProcess = 0;
          } else {
            this.uploadProcess = 0;
            window.alert("错误：" + reason.message);
          }
        });
    },
    toPanelComponent() {
      this.common.component = Panel.name;
    },
  },
  setup(props) {
    let files: Ref<string[]> = ref(new Array());
    apis.getFiles().then((file_array) => {
      files.value = file_array;
    });
    return {
      files,
    };
  },
});
</script>

<style scoped>
</style>
