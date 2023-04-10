<template>
  <div class="shopbag">
    <van-nav-bar
      title="购物袋"
      :right-text="shopbagData.length == 0 ? '' : isEdit ? '完成' : '编辑'"
      @click-right="editProduct"
    />

    <div v-if="shopbagData.length != 0">
      <div class="shopbag-bg">
        <img
          src="../../assets/images/icon/shopbag_bg.png"
          alt=""
          class="auto-img"
        />
      </div>

      <div class="shopbagData-list">
        <van-swipe-cell v-for="(item, index) in shopbagData" :key="index">
          <div class="shopbagData-item">
            <div class="selete">
                <van-checkbox v-model="item.isSelect" checked-color="#0C34BA" @click="SingleSelect"/>
            </div>
            
            <div class="shopbag-msg">
                <div class="shopbag-img">
                    <img :src="item.small_img" class="auto-img" alt="">
                </div>

                <div class="shopbag-info">
                    <div class="info-top">
                        <span class="info-name">{{item.name}}</span>
                        <span class="info-rule">{{item.rule}}</span>
                    </div>

                    <div class="info-middle one-text">{{item.enname}}</div>

                    <div class="info-bottom">
                        <div class="price">￥{{item.price}}</div>
                        <div class="count ">
                            <van-stepper v-model="item.count" theme="round" button-size="22" disable-input @change="changeProCount(item)"/>
                        </div>
                    </div>
                </div>

            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除" @click="deleteOnePro(item.sid, index)"/>
          </template>
        </van-swipe-cell>
      </div>

      <div class="shopbag-bottom">
        <van-submit-bar button-text="删除" button-color="#0C34BA" v-show="isEdit" @submit="deleteMorePro">
            <van-checkbox checked-color="#0C34BA" v-model="allSelect" @click="allSelectChange">全选</van-checkbox>
        </van-submit-bar>

        <van-submit-bar :price="total" button-text="提交订单" button-color="#0C34BA" v-show="!isEdit" @submit="submitOrder">
            <van-checkbox checked-color="#0C34BA" v-model="allSelect" @click="allSelectChange">全选</van-checkbox>
        </van-submit-bar>

        
      </div>
    </div>

    <div class="noShopbagData" v-else>
      <van-empty
        class="custom-image"
        :image="require('../../assets/images/icon/kong.png')"
        description="购物车空空如也，去逛逛吧"
      >
        <van-button round color="#0C34BA" class="bottom-button" @click="goMenu"
          >去逛一逛</van-button
        >
      </van-empty>
    </div>
  </div>
</template>
<script>
import { utils } from '../../assets/js/utils';
import "../../assets/less/shopbag.less";
export default {
  data() {
    return {
      isEdit: false,
      shopbagData: [],
      allSelect: false,
      total: 0
    };
  },
  created() {
    this.getShopbagData();
  },
  methods: {
    goMenu() {
      this.$router.push({ name: "Menu" });
    },
    editProduct() {
      this.isEdit = !this.isEdit;
    },
    getShopbagData() {
     utils.requestAxios({
            method: "GET",
            url: "/findAllShopcart", 
            paramsKey: "params",
            paramsValue: {}
        })
        .then(res => {
          if(!res)return;
          if (res.code == 5000) {
            res.result.map(v => {
                v.isSelect = false;
            })
            this.shopbagData = res.result;
          } else {
            this.$toast(res.msg);
          }
        })
    },
    // 单选
    SingleSelect(){
      this.sum();
      for(let i = 0; i < this.shopbagData.length; i++){
        if(!this.shopbagData[i].isSelect){
          this.allSelect = false;
          return;
        }
      }
      this.allSelect = true;

    },
    // 全选
    allSelectChange(){
      
      this.shopbagData.map(v => {
        v.isSelect = this.allSelect;
      })

      this.sum();
    },
    // 计算金额
    sum(){
      this.total = 0;
      this.shopbagData.map(v => {
        if(v.isSelect){
          this.total += v.count * v.price;
        }
      })

      this.total *= 100;
    },
    // 修改数量
    changeProCount(item){
      utils.requestAxios({
            method: "POST",
            url: "/modifyShopcartCount", 
            paramsKey: "data",
            paramsValue: {
              sid: item.sid,
              count:item.count,
            }
      })
      .then(res => {
        if(!res)return;
        this.sum();
        if(res.code != 6000){
          this.$toast(res.msg);
        }
      })


    },
    // 删除单个
    deleteOnePro(sid, index){
        this.deleteShopcart([sid])
        .then(res => {
        
        if(res.code == 7000){
          this.shopbagData.splice(index, 1);
          
        }else{
          this.$toast(res.msg)
        }
        this.sum();

      })
      
    },
    // 删除多个
    deleteMorePro(){
      let sids = [];

      this.shopbagData.map(v => {
        if(v.isSelect){
          sids.push(v.sid);
        }
      })

      if(sids.length == 0){return};

      this.deleteShopcart(sids)
      .then(res => {
        if(!res)return;
        if(res.code == 7000){
          for(let i = this.shopbagData.length - 1; i >= 0; i--){
            if(this.shopbagData[i].isSelect){
              this.shopbagData.splice(i, 1);
            }
          }
        }else{
          if(!res)return;
          this.$toast(res.msg)
        }
        this.sum();

      })

    },
    deleteShopcart(sidArr){
    return utils.requestAxios({
            method: "POST",
            url: "/deleteShopcart", 
            paramsKey: "data",
            paramsValue: {
              sids: JSON.stringify(sidArr)
            }
      })
    },
    // 结算
    submitOrder(){
      // let tokenString = localStorage.getItem('MY');
      let tokenString = this.$cookie.get("MY");
      if(!tokenString){
        return;
      }
      let sids = [];
      this.shopbagData.map(v => {
        if(v.isSelect){
          sids.push(v.sid);
        }
      })

      if(sids.length == 0){
        this.$toast("请选择要购买的商品");
        return;
      }

      sids = sids.join("-");
      this.$router.push({name: 'Pay', query: {sids}}); 
    }
  },
};
</script>