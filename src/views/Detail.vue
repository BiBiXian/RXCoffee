<template>
  <div class="detail">
    <van-nav-bar title="商品详情" left-arrow @click-left="goBack" />

    <div class="detail-img">
      <img :src="proDetail.large_img" alt="" class="auto-img" />
    </div>

    <div class="detail-info">
      <div class="name-price">
        <div class="detail-name">
          <div class="name">{{ proDetail.name }}</div>
          <div class="enname">{{ proDetail.enname }}</div>
        </div>

        <div class="price">￥{{ proDetail.price }}</div>
      </div>

      <div class="detail-rules">
        <div
          class="rules-item"
          v-for="(item, index) in proDetail.ruleData"
          :key="index"
        >
          <div class="rule-title">{{ item.title }}</div>

          <div class="rule clearfix">
            <div
              class="rule-item fl"
              :class="{ active: item.isAct == i }"
              v-for="(r, i) in item.rules"
              :key="i"
              @click="toggleRules(index, i)"
            >
              {{ r }}
            </div>
          </div>
        </div>
      </div>

      <div class="count-box">
        <div class="count-title">选择数量</div>

        <div class="count">
          <van-stepper
            v-model="count"
            theme="round"
            button-size="24"
            disable-input
          />
        </div>
      </div>

      <div class="detail-desc">
        <div class="desc-title">商品描述</div>

        <div class="desc-box">
          <div
            class="desc"
            v-for="(item, index) in proDetail.desc"
            :key="index"
          >
            {{ index + 1 }}、{{ item }}
          </div>
        </div>
      </div>

      <van-goods-action>
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="shopbagCount == 0 ? '' : shopbagCount"
          :to="{ name: 'Shopbag' }"
        />
        <van-goods-action-icon
          :color="islike ? '#0C34BA' : '#323233'"
          :icon="islike ? 'like' : 'like-o'"
          :text="islike ? '已收藏' : '收藏'"
          @click="likeAndNolike"
        />
        <van-goods-action-button
          color="#6a91ec"
          text="加入购物车"
          @click="addShopBag(false)"
        />
        <van-goods-action-button
          color="#0C34BA"
          text="立即购买"
          @click="addShopBag(true)"
        />
      </van-goods-action>
    </div>
  </div>
</template>
<script>
import "../assets/less/detail.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      pid: "",
      proDetail: {},
      count: 1,
      islike: false,
      shopbagCount: 0,
    };
  },
  created() {
    this.pid = this.$route.query.pid;
    this.getProductLike();
    this.getShopbagCount();
    this.getProDetail();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getProDetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 600) {
            let result = res.data.result[0];

            let ruleItems = ["tem", "cream", "milk", "sugar"];
            let ruleData = [];

            ruleItems.map((v) => {
              if (result[v] == "") {
                return;
              }

              let o = {
                title: result[v + "_desc"],
                rules: result[v].split("/"),
                isAct: 0,
              };

              ruleData.push(o);
            });

            result.ruleData = ruleData;

            result.desc = result.desc.split(/\n/);

            this.proDetail = result;
          }
        })
        .catch(() => {
          this.$toast.clear();
        });
    },
    toggleRules(index, i) {
      if (this.proDetail.ruleData[index].isAct == i) {
        return;
      }

      this.proDetail.ruleData[index].isAct = i;
    },
    getProductLike() {
      utils.requestAxios({
            method: "GET",
            url: "/findlike", 
            paramsKey: "params",
            paramsValue: {pid: this.pid}
      }).then((res) => {
        if(!res)return;
        
        if (res.code == 1000) {
          if (res.result.length == 1) {
            this.islike = true;
          } else {
            this.islike = false;
          }
        }
      });
    },
    likeAndNolike() {

      let url = this.islike ? "/notlike" : "like";

      utils.requestAxios({
            method: "POST",
            url, 
            paramsKey: "data",
            paramsValue: {pid: this.pid,}
      }).then((res) => {
          if(!res){
            this.$router.push({name: 'Login'})
            return;
          };
          if (res.code == 800) {
            this.islike = true;
          }

          if (res.code == 900) {
            this.islike = false;
          }

          this.$toast(res.msg);
        })
        
    },
    getShopbagCount() {
      utils.requestAxios({
            method: "GET",
            url: "/findAllShopcart", 
            paramsKey: "params",
            paramsValue: {}
      }).then((res) => {
        if(!res)return;
        if ((res.code = 5000)) {
          this.shopbagCount = res.result.length;
        } else {
          this.$toast(res.msg);
        }
      });
    },
    addShopBag(isPay) {
      
      let ruleData = this.proDetail.ruleData;
      let rule = [];

      for (let i = 0; i < ruleData.length; i++) {
        rule.push(ruleData[i].rules[ruleData[i].isAct]);
      }

      utils.requestAxios({
            method: "POST",
            url: "/addShopcart", 
            paramsKey: "data",
            paramsValue: {
              pid: this.pid,
              count: this.count,
              rule: rule.join("/"),
            }
        }, "添加中...")
        .then((res) => {
          if(!res){
            this.$router.push({name: 'Login'})
            return;
          };
          if (res.code == 3000) {
            if (res.status == 1) {
              this.shopbagCount++;
            }
            if (isPay) {
              this.$router.push({ name: "Pay", query: { sids: res.sid } });
            }
          }
        })
        
    },
  },
};
</script>