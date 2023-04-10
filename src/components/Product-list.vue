<template>
  <div class="product-list clearfix">
    <div
      class="product-item fl"
      v-for="(item, index) in products"
      :key="index"
      @click="navToDetail(item.pid)"
    >
      <!-- <router-link :to="'/detail?pid=' + item.pid"> -->
      <div class="product-img">
        <img class="auto-img" :src="item.smallImg" alt="" />
      </div>
      <div class="product-name one-text">{{ item.name }}</div>
      <div class="product-price">
        ￥{{ item.price }}

        <div class="detele" v-if="deleteicon" @click.stop="deleteLikePro(item.pid, index)">
          <van-icon name="delete-o" />
        </div>
      </div>
      <!-- </router-link> -->
    </div>
  </div>
</template>
<script>
import { utils } from "../assets/js/utils";
export default {
  props: {
    products: {
      type: Array,
    },
    deleteicon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    navToDetail(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },

    deleteLikePro(pid, i) {
      utils.requestAxios({
          method: "POST",
          url: '/notlike',
          paramsKey: "data",
          paramsValue: { pid},
        })
        .then((res) => {
          if (!res)return;
        this.$toast(res.msg);
          if (res.code == 900) {
            this.$emit('delLikeData', i)
          }

          
        });
    },
  },
};
</script>
<style lang="less" scoped>
.product-item {
  width: 50%;
  padding: 0 10px;
  box-sizing: border-box;
  margin-top: 20px;

  .product-img {
    border-radius: 10px;
    overflow: hidden;
  }

  .product-name {
    font-size: 14px;
    font-weight: bold;
    margin: 5px 0;
    padding-left: 10px;
    color: #444;
  }

  .product-price {
    color: #0c34ba;
    font-weight: bold;
    font-size: 16px;
    padding-left: 10px;
    position: relative;
    line-height: 20px;

    .detele {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 18px;
      color: #444;
    }
  }
}
</style>