<template>
  <div class="pay">
    <van-nav-bar title="订单结算" left-arrow fixed @click-left="goback" />

    <div class="pay-address" @click="showPopup">
      <div class="address-box" v-if="addressList.length != 0">
        <div class="pay-address-info">
          <span class="name">{{ orderAddress.receiver }}</span>
          <span class="tel">{{ orderAddress.phone }}</span>
        </div>

        <div class="pay-address-msg">{{ orderAddress.address }}</div>
      </div>

      <div class="no-address" v-else>还没有地址，添加一个吧</div>

      <div class="address-icon">
        <van-icon name="location" />
      </div>
    </div>

    <div class="pay-order-box">
      <div class="order-title">订单信息</div>

      <order-list :orderList="orderList" />

      <div class="order-info">
        <div class="order-info-count">共计 {{ orderInfo.count }} 件</div>
      </div>
    </div>

    <van-submit-bar
      :price="this.orderInfo.total"
      button-color="#0C34BA"
      button-text="立即结算"
      @submit="pay"
    />

    <van-popup v-model="isShowPopup" position="bottom" closeable>
      <div class="popup-title">选择地址</div>
      <div class="pay-address-list">
        <van-address-list
          v-model="orderAddress.id"
          :list="addressList"
          @add="goAdd"
          @edit="goEdit"
          @select="selectAddress"
        />
      </div>
    </van-popup>
  </div>
</template>
<script>
import "../assets/less/pay.less";
import {utils} from '../assets/js/utils';
import orderList from '../components/Order-list.vue';
export default {
  data() {
    return {
      isShowPopup: false,
      sids: [],
      orderList: [],
      orderInfo: {
        count: 0,
        total: 0,
      },
      addressList: [],
      orderAddress: {
        id: "",
        receiver: "",
        phone: "",
        address: "",
      },
    };
  },
  components: {
    orderList
  },
  created() {
    this.sids = this.$route.query.sids.split("-");

    this.getAddressList();
    this.getOrderList(this.sids);
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getOrderList(sids) {
      utils.requestAxios({
            method: "GET",
            url: "/commitShopcart", 
            paramsKey: "params",
            paramsValue: { sids: JSON.stringify(sids)}
        })
        .then((res) => {
          if(!res)return;
          if (res.code == 50000) {
            if (res.result.length == 0) {
              return this.$router.push({ name: "Menu" });
            }

            res.result.map((v) => {
              this.orderInfo.count += v.count;
              this.orderInfo.total += v.count * v.price;
            });

            this.orderInfo.total *= 100;
            this.orderList = res.result;
          }
        })
    },
    getAddressList() {
      utils.requestAxios({
            method: "GET",
            url: "/findAddress", 
            paramsKey: "params",
            paramsValue: {}
      })
      .then((res) => {
        if(!res)return;
          if (res.code == 20000) {
            console.log(res.result)
            if(res.result.length == 0){
              return;
            }
            res.result.map((v) => {
              let address = `${v.province} ${v.city} ${v.county} ${v.addressDetail}`;
              let info = {
                id: v.aid,
                address,
                name: v.name,
                tel: v.tel,
                isDefault: Boolean(v.isDefault),
                firstName: v.name[0],
              };
              if (v.isDefault) {
                this.addressList.unshift(info);
                this.orderAddress = {
                  id: info.id,
                  receiver: info.name,
                  phone: info.tel,
                  address: info.address,
                };
              } else {
                this.addressList.push(info);
              }
            });
            // 没有默认地址则默认获取地址列表的第一个地址
            if (this.orderAddress.id == "") {
              this.orderAddress = {
                id: this.addressList[0].id,
                receiver: this.addressList[0].name,
                phone: this.addressList[0].tel,
                address: this.addressList[0].address,
              };
            }
          }
        })
    },
    showPopup() {
      this.isShowPopup = true;
    },
    goAdd() {
      this.$router.push({ name: "Editaddress" });
    },
    goEdit(item) {
      let aid = item.id;
      this.$router.push({ name: "Editaddress", query: { aid } });
    },
    selectAddress(item) {
      this.orderAddress = {
        id: item.id,
        receiver: item.name,
        phone: item.tel,
        address: item.address,
      };

      this.isShowPopup = false;
    },
    pay(){
      if(this.orderAddress.id == ""){
        this.$toast("请添加收货地址");
        return;
      }
      utils.requestAxios({
        method: "POST",
        url: "/pay", 
        paramsKey: "data",
        paramsValue: {
          sids: JSON.stringify(this.sids),
          phone: this.orderAddress.phone,
          address: this.orderAddress.address,
          receiver: this.orderAddress.receiver
        }
      }).then(res => {
        if(!res)return;
        this.$toast(res.msg);

        if(res.code == 60000){
            this.$router.replace({name: 'Order', query: {i: 1}})
        }
      })
    }
  },
};
</script>