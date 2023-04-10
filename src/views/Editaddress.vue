<template>
  <div class="editAddress">
    <van-nav-bar
      :title="aid ? '编辑收货地址' : '添加收货地址'"
      left-arrow
      @click-left="goback"
    />

    <van-address-edit
      show-postal
      show-set-default
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="!!aid"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="saveAddress"
      @delete="deteleAddress"
    />
  </div>
</template>
<script>
import areaList from "../assets/js/arealist";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      aid: "",
      areaList,
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false,
      },
    };
  },
  created() {
    this.aid = this.$route.query.aid;
    if (this.aid) {
      this.getAddress(this.aid);
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    saveAddress(address) {
      if (this.aid) {
        // 编辑地址
        let isEdit = false;
        for (let k in this.addressInfo) {
          if (address[k] != this.addressInfo[k]) {
            isEdit = true;
            break;
          }
        }
        if (!isEdit) {
          return this.$router.go(-1);
        }
        this.editAddress(address, "/editAddress")
          
      } else {
        // 添加地址
        this.editAddress(address, "/addAddress")
         
      }
    },
    editAddress(address, url) {
     
      let info = Object.assign({}, address);
      delete info.id;
      delete info.country;

      info.isDefault = Number(info.isDefault);

       utils.requestAxios({
            method: "POST",
            url, 
            paramsKey: "data",
            paramsValue: {...info}
        }).then((res) => {
            if(!res)return;
            this.$toast(res.msg);
            if (res.code == 9000 || 30000) {
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            }
          })
    },
    getAddress(aid) {
     utils.requestAxios({
            method: "GET",
            url: "/findAddressByAid", 
            paramsKey: "params",
            paramsValue: {aid}
      }).then((res) => {
          if(!res)return;
          if (res.code == 40000) {
            this.addressInfo = {
              ...res.result[0],
              isDefault: Boolean(res.result[0].isDefault),
              id: res.result[0].aid,
            };
          }
        })
    },
    deteleAddress() {

      utils.requestAxios({
            method: "POST",
            url: "/deleteAddress",
            paramsKey: "data",
            paramsValue: {aid: this.aid}
      }, '删除中...')
        .then((res) => {
          if(!res)return;
          this.$toast(res.msg);
          if (res.code == 10000) {
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          }
        })
    },
  },
};
</script>
<style lang="less">
.editAddress{
    .van-button--danger,
    .van-switch--on{
        background-color: #0C34BA;
        border-color: #0C34BA;
    }
}
</style>