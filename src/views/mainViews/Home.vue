<template>
  <div class="home">
    <!-- 导航 -->
    <div class="nav-bar clearfix">
      <div class="left-title fl one-text">
        {{ timeText }}, <span>{{ nickName }}</span>
      </div>
      <div class="right-search fr" @click="goSearch">
        <van-search shape="round" placeholder="请输入搜索关键词"  @click="goSearch"/>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="home-banner">
      <van-swipe :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="(image, index) in bannerData" :key="index">
          <router-link :to="'/detail?pid=' + image.pid">
            <img class="auto-img" :src="image.bannerImg" />
            <div class="img-name">{{ image.name }}</div>
          </router-link>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 推荐 -->
    <div class="hot-product">
      <div class="hot-title">热门推荐</div>

      <product-list :products="hotProducts" />
    </div>
  </div>
</template>
<script>
import "../../assets/less/home.less";
import productList from "../../components/Product-list.vue";

import { utils } from "../../assets/js/utils";
export default {
  components: {
    productList,
  },
  data() {
    return {
      timeText: "早上好",
      nickName: "请先登录哟",
      bannerData: [],
      hotProducts: [],
    };
  },
  created() {
    this.getTimeText();
    this.getBannerData();
    this.getHotProducts();
    this.getUserInfo();
  },
  methods: {
    getTimeText() {
      let time = new Date().getHours();

      if (time >= 6 && time < 12) {
        this.timeText = "早上好";
      } else if (time >= 12 && time < 18) {
        this.timeText = "下午好";
      } else if (time >= 18 && time < 24) {
        this.timeText = "晚上好";
      } else {
        this.timeText = "深夜好";
      }
    },
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 300) {
            this.bannerData = res.data.result;
          }
        })
        .catch(() => {
          this.$toast.clear();
        });
    },
    getHotProducts() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 500) {
            this.hotProducts = res.data.result;
          }
        })
        .catch(() => {
          this.$toast.clear();
        });
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
            this.nickName = res.result[0].nickName;
          }
        });
    },
    goSearch(){
      this.$router.push({name: 'Search'})
    }
  },
};
</script>