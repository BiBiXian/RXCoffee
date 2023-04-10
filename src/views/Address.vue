<template>
  <div class="address">
    <van-nav-bar title="我的收货地址" left-arrow fixed @click-left="goback" />
    <div class="address-list-box">
      <div class="address-list" v-if="addressList.length != 0">
        <div
          class="address-item"
          v-for="(item, index) in addressList"
          :key="index"
        >
          <div class="address-icon">
            <van-icon name="wap-home" v-if="item.isDefault" />
            <span v-else>{{ item.firstName }}</span>
          </div>
          <div class="address-info">
            <div class="info-user clearfix">
              <div class="name fl">{{ item.name }}</div>
              <div class="phone fl">{{ item.tel }}</div>
              <div class="default fl" v-if="item.isDefault">默认</div>
            </div>

            <div class="address-detail">
              {{ item.address }}
            </div>
          </div>
          <div class="edit">
            <van-icon name="edit" @click="goEdit(item.id)" />
          </div>
        </div>
      </div>

       <div class="noData" v-else>
            <van-empty
              class="custom-image"
              description="你还没有相关地址哦，去添加一个吧"
            >
      
            </van-empty>
          </div>
    </div>

    <div class="addBtn">
      <van-button
        type="default"
        icon="plus"
        color="#0C34BA"
        block
        round
        :to="{ name: 'Editaddress' }"
        >添加收货地址</van-button
      >
    </div>
  </div>
</template>
<script>
import "../assets/less/address.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      addressList: [],
    };
  },
  created() {
    this.getAddressList();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getAddressList() {
      utils
        .requestAxios({
          method: "GET",
          url: "/findAddress",
          paramsKey: "params",
          paramsValue: {},
        })
        .then((res) => {
          if(!res)return;
          if (res.code == 20000) {
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
              } else {
                this.addressList.push(info);
              }
            });
          }
        });
    },
    goEdit(aid) {
      this.$router.push({ name: "Editaddress", query: { aid } });
    },
  },
};
</script>