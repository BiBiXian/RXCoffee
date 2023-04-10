<template>
    <div class="menu-product">
        <van-skeleton avatar avatar-shape='square' avatar-size="50px" :row="6" :loading="loading">
        
        <div class="menu-product-item" v-for="(item, index) in products" :key="index" @click="navToDetail(item.pid)">
            <div class="pro-img">
                <img :src="item.smallImg" alt="" class="auto-img">
            </div>
            <div class="pro-name">
                <div class="name">{{item.name}}</div>
                <div class="enname one-text">{{item.enname}}</div>
            </div>
            <div class="pro-price">
                ￥{{item.price}}
            </div>
        </div>
        </van-skeleton>
      </div>
  
</template>

<script>
export default {
    props: {
    products: {
      type: Array,
    },
    loading: {
        type: Boolean,
        default: true
    }
  },
  methods: {
    navToDetail(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
  }
}
</script>
<style lang="less">
.menu-product{
    padding: 0 15px;
}
.menu-product-item{
    display: flex;
    align-items: center;
    margin-top: 15px;

    .pro-img{
        width: 25%;
        border-radius: 15px;
        overflow: hidden;
    }

    .pro-name{
        width: 55%;
        padding-left: 15px;
        box-sizing: border-box;

        .name{
            font-size: 18px;
        }

        .enname{
            font-size: 14px;
            color: #999;
            margin-top: 5px;
        }
    }

    .pro-price{
        width: 20%;
        text-align: center;
        color: #0c34ba;
        font-weight: bold;
        font-size: 16px;
    }
}
</style>