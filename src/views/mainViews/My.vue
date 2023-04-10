<template>
  <div class="my">
    <div class="my-user">
      <div class="my-bg">
        <img
          src="../../assets/images/icon/logo-bg.png"
          alt=""
          class="auto-img"
        />
      </div>

      <div class="user-box">
        <div class="user-img">
          <img
            :src="userInfo.userImg ? userInfo.userImg : require('../../assets/images/icon/default-user.png')"
            alt=""
          />
        </div>

        <div class="user-msg">
          <div class="nickname">
            <div v-if="userInfo.nickName" style="font-weight: bold">
              {{ userInfo.nickName }}
            </div>
            <div v-else @click="goLogin">
              登录/注册<van-icon name="arrow" />
            </div>
          </div>
          <div class="desc">
            {{ userInfo.desc }}
          </div>
        </div>
      </div>
    </div>

    <div class="my-list">
      <van-cell
        :title="item.title"
        is-link
        v-for="(item, index) in myList"
        :key="index"
        @click="goOtherPage(item.url)"
      />
    </div>
  </div>
</template>
<script>
import "../../assets/less/my.less";
import { utils} from '../../assets/js/utils';
export default {
  data() {
    return {
      userInfo: {},
      myList: [
        { title: "个人资料", url: { name: "Account" } },
        { title: "我的订单", url: { name: "Order" } },
        { title: "我的收藏", url: { name: "Like" } },
        { title: "收货地址", url: { name: "Address" } },
        { title: "安全中心", url: { name: "Secure" } },
      ],
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    goLogin() {
      this.$router.push({ name: "Login" });
    },
    goOtherPage(url) {
      // let tokenString = localStorage.getItem("MY");
      let tokenString = this.$cookie.get("MY");
      
      if (!tokenString) {
        this.$toast("请先登录");
        return;
      }
      this.$router.push(url);
    },
    getUserInfo() {
      utils.requestAxios({
          method: "GET",
          url: "/findMy",
          paramsKey: "params",
          paramsValue: {},
        })
        .then((res) => {
          if(!res)return;
         
          if (res.code == "A001") {
            this.userInfo = res.result[0];
            if (this.userInfo.desc == "") {
              this.userInfo.desc = "快留下你的个性签名吧！！";
            }
          }
        });
    },
  },
};
</script>