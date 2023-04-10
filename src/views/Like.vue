<template>
    <div class="like">
        <van-nav-bar title="收藏列表" left-arrow fixed @click-left="goback" />

        <div class="like-bg"></div>

        <div class="like-list-box" v-if="likeData != 0">
            <product-list :products="likeData" :deleteicon="true" @delLikeData='delLikeData'/>
        </div>

        <div class="noData" v-else>
            <van-empty
              class="custom-image"
              description="你还没有相关商品哦，去逛逛吧"
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
    </div>
</template>
<script>
import "../assets/less/like.less";
import { utils } from "../assets/js/utils";
import productList from "../components/Product-list.vue";
export default {
    data() {
        return{
            likeData: []
        }
    },
    components: {
        productList,
    },
    created(){
        this.getLikeData()
    },
    methods: {
        goback() {
            this.$router.go(-1);
        },
        getLikeData(){
            utils.requestAxios({
                method: 'GET',
                url: '/findAllLike',
                paramsKey: "params",
                paramsValue: {},
            }).then(res => {
                if(!res)return;
                if(res.code == 2000){
                    this.likeData = res.result;
                }
            })
        },
        delLikeData(i){

            this.likeData.splice(i, 1);
        }
    }
}
</script>