<template>
      <div class="order-list">
        <div
          class="order-list-item clearfix"
          v-for="(item, index) in orderList"
          :key="index"
        >
          <div class="order-list-img fl">
            <img :src="item.small_img || item.smallImg" alt="" class="auto-img" />
          </div>

          <div class="order-list-msg fl">
            <div class="pro-text-msg">
              <div class="name-rule">
                <span class="name">{{ item.name }}</span>
                <span class="rule">{{ item.rule }}</span>
              </div>
              <div class="enname">{{ item.enname }}</div>
            </div>
            <div class="pro-num-msg">
              <div class="price fl">￥{{ item.price }}</div>
              <div class="count fr">×{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
</template>
<script>
export default {
    props: {
        orderList: {
            type: Array
        }
    }
}
</script>
<style lang="less">
@theme-color: #0C34BA;
.order-list-item{
    margin-bottom: 15px;
    .order-list-img{
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }
    .order-list-msg{
        width: calc(100% - 90px);
    }
    .pro-text-msg{
        height: 60px;
        line-height: 20px;

        .name{
            font-size: 14px;
            margin-right: 8px;
        }

        .rule,.enname{
            font-size: 12px;
            color: #999;
        }
    }

    .pro-num-msg{
        width: 100%;
        height: 20px;
        line-height: 20px;

        .price{
            font-size: 14px;
            font-weight: bold;
            color: @theme-color;
        }

        .count{
            font-size: 14px;
            color: #999;
        }
    }
    
}
</style>