<template>
    <div class="search">
        <van-nav-bar title="搜索商品" left-arrow fixed @click-left="goback" />
        <div class="search-box">
          <van-search v-model="searchName" shape="round" placeholder="请输入搜索关键词" @input='searchPro'/>
        </div>
        
        <menuProduct v-if="searchProduct.length != 0" :products="searchProduct" :loading="loading"/>


        <div class="noData" v-else>
            <van-empty
              class="custom-image"
              description="你还没有搜索任何商品哦！！"
            >
            </van-empty>
          </div>

        </div>
</template>
<script>
import "../assets/less/search.less";
import menuProduct from "../components/Menu-product.vue";
export default {
    data(){
        return{
            searchName: '',
            searchProduct: [],
            loading: true
        }
    },
    components: {
      menuProduct
    },
    methods: {
        goback() {
            this.$router.go(-1);
        },
        searchPro(){
            if(this.searchName == ''){
                return;
            }

            this.loading = true;
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                loadingType: "spinner",
                duration: 0,
            });
            this.axios({
                method: 'GET',
                url: "/search",
                params: {
                    appkey: this.appkey,
                    name: this.searchName
                }
            }).then(res => {
                this.$toast.clear();
                this.loading = false;
                if(res.data.code == "Q001"){
                    this.searchProduct = res.data.result;
                }
            }).catch(() => {
                this.$toast.clear();
            })
        }
    }
}
</script>