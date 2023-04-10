<template>
  <div class="updateacc">
    <van-nav-bar
      :title="isName == 1 ? '用户昵称' : '个性签名'"
      right-text="保存"
      left-arrow
      @click-left="goback"
      @click-right="updateInfo"
    />

    <div v-if="isName == 1">
      <van-field v-model="nickName" label="昵称" placeholder="请输入用户昵称" />
    </div>

    <div v-else class="desc">
      <textarea
        v-model="desc"
        placeholder="介绍一下自己，让大家了解和关注你~"
        maxlength="200"
        @input="textChange"
      ></textarea>
      <div class="text-length">{{ textLength }} / 200</div>
    </div>
  </div>
</template>
<script>
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      isName: "",
      nickName: "",
      desc: "",
      textLength: 0,
    };
  },
  created() {
    this.isName = this.$route.query.isName;
    this.findAccountInfo();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    findAccountInfo() {
      // let tokenString = localStorage.getItem("MY");
       let tokenString = this.$cookie.get("MY");
      if (!tokenString) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == "B001") {
            if (this.isName) {
              this.nickName = res.data.result[0].nickName;
            } else {
              this.desc = res.data.result[0].desc;
            }
          }
        })
        .catch(() => {
          this.$toast.clear();
        });
    },
    textChange() {
      this.textLength = this.desc.length;
    },
    updateInfo() {
     
      let o = {}

      let url = '/updateDesc';
      if(this.isName == 1){
        o.nickName = this.nickName;
        url = "/updateNickName"
      }else{
        o.desc = this.desc;
      }
      utils.requestAxios({
            method: "POST",
            url, 
            paramsKey: "data",
            paramsValue: {...o}
        },'修改中...')
        .then(res => {
          if(!res)return;
        this.$toast.clear();
        this.$router.go(-1);
      })
    },
  },
};
</script>
<style lang="less">
.updateacc {
  .van-nav-bar__text {
    color: #0c34ba;
    font-size: 16px;
  }

  .desc {
    height: 200px;
    padding: 10px;
    background-color: #fff;
    position: relative;

    textarea {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      padding: 0;
      font-size: 14px;
    }

    .text-length {
      position: absolute;
      bottom: 20px;
      right: 20px;
      font-size: 16px;
      color: #999;
    }
  }
}
</style>