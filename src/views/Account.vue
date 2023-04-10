<template>
  <div class="account">
    <van-nav-bar title="个人资料" left-arrow @click-left="goback" />

    <div class="account-box">
      <div class="avatar">
        <van-uploader :after-read="uploaderUserImg">
          <div class="user-img">
            <img :src="accountInfo.userImg" alt="" class="auto-img" />
          </div>
          <div class="avatar-text">更换头像</div>
        </van-uploader>
      </div>

      <div class="account-cell">
        <div class="cell-title">手机号</div>
        <div class="cell-msg">{{ accountInfo.phone }}</div>
      </div>

      <div class="account-cell">
        <div class="cell-title">用户账号</div>
        <div class="cell-msg">{{ accountInfo.userId }}</div>
      </div>

      <div class="account-cell" @click="navToUpdate(1)">
        <div class="cell-title">用户昵称</div>
        <div class="cell-msg">{{ accountInfo.nickName }}</div>
        <div class="cell-icon">
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="account-cell" @click="navToUpdate(0)">
        <div class="cell-title">个性签名</div>
        <div class="cell-msg one-text">{{ accountInfo.desc }}</div>
        <div class="cell-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { utils } from '../assets/js/utils';
import "../assets/less/account.less";
export default {
  data() {
    return {
      accountInfo: {},
      maxSize: 1 * 1024 * 1024,
    };
  },
  created() {
    this.findAccountInfo();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    findAccountInfo() {
     utils.requestAxios({
            method: "GET",
            url: "/findAccountInfo", 
            paramsKey: "params",
            paramsValue: {}
     })
     .then((res) => {
          if(!res)return;
          if (res.code == "B001") {
            this.accountInfo = res.result[0];
          }
      })
        
    },
    uploaderUserImg(file) {
      // 获取文件类型
      let type = file.file.type.split("/")[1];
      let imgTypes = ['png', 'gif', 'jpg', 'jpeg'];
      if(imgTypes.indexOf(type) == -1){
        this.$notify({
            message: '图片类型只支持' + imgTypes.join("、"),
            color: '#fff',
            background: "#0C34BA"
        })
        return;
      }

      // 大小
      if(this.maxSize < file.file.size){
        this.$notify({
            message: '上传图片大小不能超过' + this.maxSize / 1024 + 'KB',
            color: '#fff',
            background: "#0C34BA"
        })
        return;
      }

      // 获取base64
      let base64 = file.content.replace(/data:image\/[A-z]+;base64/, '');

      utils.requestAxios({
        method: "POST",
        url: "/updateAvatar", 
        paramsKey: "data",
        paramsValue: {
          imgType: type,
          serverBase64Img: base64
        }
      }, "上传中...")
      .then(res => {
        if(!res)return;
        if(res.code == 'H001'){
            this.accountInfo.userImg = res.userImg;
        }

      })
    },
    navToUpdate(isName){
        this.$router.push({name: 'UpdateAcc', query: {isName}})
    }
  },
};
</script>