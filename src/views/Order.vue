<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow fixed @click-left="goback" />

    <div class="order-bg"></div>

    <div class="order-list-box">
      <van-tabs
        v-model="tabActIndex"
        color="#0C34BA"
        title-active-color="#0C34BA"
        @change="toggleStatus"
      >
        <van-tab
          :name="index"
          :title="item.title"
          v-for="(item, index) in tabTitle"
          :key="index"
        >
          <div class="order-list" v-if="orderData.length != 0">
            <div class="tab-item" v-for="(o, i) in orderData" :key="i">
              <div class="tab-title clearfix">
                <span class="oid fl">{{ o.orderId }}</span>
                <span class="statusText fr">{{
                  o.status == 1 ? "配送中" : "已完成"
                }}</span>
              </div>

              <order-list :orderList="o.products" />

              <div class="date">
                {{ o.date | formatDate("yyyy-MM-dd hh:mm:ss") }}
              </div>

              <div class="count-total clearfix">
                <span class="count fl">共计{{ o.count }}件商品</span>
                <span class="total fr">合计：￥{{ o.total }}</span>
              </div>

              <div class="order-btn">
                <van-button round color="#0C34BA" v-if="o.status == 1" @click="receiveOrder(o.orderId, i)">
                    确认收货
                </van-button>
                <van-button plain round v-else @click="removeOrder(o.orderId, i)">删除订单</van-button>
              </div>
            </div>
          </div>

          <div class="noData" v-else>
            <van-empty
              class="custom-image"
              description="你还没有相关订单哦，去逛逛吧"
            >
              <van-button
                round
                color="#0C34BA"
                class="bottom-button"
                :to="{ name: 'Menu' }"
                >去逛一逛</van-button
              >
            </van-empty>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { utils} from '../assets/js/utils';
import "../assets/less/order.less";
import orderList from "../components/Order-list.vue";
export default {
  data() {
    return {
      tabActIndex: 0,
      tabTitle: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
      orderData: [],
    };
  },
  components: {
    orderList,
  },
  created() {
    this.tabActIndex = this.$route.query.i || 0;
    this.getOrderData(this.tabActIndex);
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getOrderData(status) {
        utils.requestAxios({
            method: "GET",
            url: "/findOrder", 
            paramsKey: "params",
            paramsValue: {status}
        }).then(res => {
            if(!res)return;
            this.orderData = [];
          if (res.code == 70000) {
            let orderObjData = {};
            res.result.map((v) => {
              if (!orderObjData[v.oid]) {
                orderObjData[v.oid] = {
                  orderId: v.oid,
                  date: v.createdAt,
                  count: v.count,
                  price: v.price,
                  total: v.count * v.price,
                  products: [v],
                  status: v.status,
                };
              } else {
                orderObjData[v.oid].products.push(v);
                orderObjData[v.oid].total += v.count * v.price;
                orderObjData[v.oid].count += v.count;
              }
            });
            for (let k in orderObjData) {
              this.orderData.push(orderObjData[k]);
            }

            // 根据时间降序排列
            this.orderData.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
          }
        })
    },
    toggleStatus(name) {
      this.getOrderData(name);
    },
    receiveOrder(oid, i) {
        
        utils.requestAxios({
            method: "POST",
            url: "/receive", 
            paramsKey: "data",
            paramsValue: {oid}
        }).then(res => {
            if(!res)return;
            if(res.code == 80000){
                if(this.tabActIndex == 1){
                    this.orderData.splice(i, 1)
                }else{
                    this.orderData[i].status = 2;
                }
            }
        })
    },
    removeOrder(oid, i){
         utils.requestAxios({
            method: "POST",
            url: "/removeOrder", 
            paramsKey: "data",
            paramsValue: {oid}
        }, "删除中...")
        .then(res => {
            if(!res)return;
            this.$toast(res.msg)
            if(res.code == 90000){    
                this.orderData.splice(i, 1)          
            } 
        })
    }
  },
};
</script>