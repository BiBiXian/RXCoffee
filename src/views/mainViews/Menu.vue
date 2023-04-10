<template>
  <div class="menu">
    <div class="menu-search">
      <van-search shape="round" placeholder="请输入搜索关键词"  @click="goSearch"/>
    </div>

    <div class="menu-msg">
      <!-- 菜单类 -->
      <div class="menu-type">
        <div class="type-item" v-for="(item,index) in menuType" :key="index" @click="toggleType(item)">
            <div class="type-icon">
                <img class="auto-img" :src="item.isAct ? item.actIcon : item.icon" alt="">
            </div>
            <div class="type-name " :class="{active: item.isAct}">
                {{item.typeDesc}}
            </div>
        </div>
      </div>
      <!-- 菜单商品 -->
      <menu-product :products="menuProduct" :loading="loading"/>
    </div>
  </div>
</template>
<script>
import "../../assets/less/menu.less";
import menuProduct from "../../components/Menu-product.vue";
export default {
  data() {
    return {
      menuType: [
        {
          type: "isHot",
          typeDesc: "推荐",
          icon: require("../../assets/images/icon/icons_01.png"),
          actIcon: require("../../assets/images/icon/icons_02.png"),
          isAct: true,
        },
        {
          type: "latte",
          typeDesc: "拿铁",
          icon: require("../../assets/images/icon/icons_03.png"),
          actIcon: require("../../assets/images/icon/icons_04.png"),
          isAct: false,
        },
        {
          type: "coffee",
          typeDesc: "咖啡",
          icon: require("../../assets/images/icon/icons_05.png"),
          actIcon: require("../../assets/images/icon/icons_06.png"),
          isAct: false,
        },
        {
          type: "rena_ice",
          typeDesc: "瑞纳冰",
          icon: require("../../assets/images/icon/icons_07.png"),
          actIcon: require("../../assets/images/icon/icons_08.png"),
          isAct: false,
        },
        {
          type: "fruit_tea",
          typeDesc: "水果茶",
          icon: require("../../assets/images/icon/icons_09.png"),
          actIcon: require("../../assets/images/icon/icons_10.png"),
          isAct: false,
        }
      ],
      menuProduct: [],
      loading: true
    };
  },
  components: {
    menuProduct
  },
  created() {
    this.getMenuProduct(this.menuType[0])
  },
  methods: {
    toggleType(item){
        if(item.isAct){
            return;
        }

        for(let i = 0; i < this.menuType.length; i++){
            if(this.menuType[i].isAct){
                this.menuType[i].isAct = false;
                break;
            }
        }

        item.isAct = true;

        this.getMenuProduct(item);


    },
    getMenuProduct(item) {
        this.menuProduct = [];

        let data = localStorage.getItem(item.type);
        if(data){
            this.menuProduct = JSON.parse(data);
            this.loading = false;
            return;
        }

      this.loading = true;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });

      let params = {
        appkey: this.appkey,
        key: 'type',
        value: item.type
      }

      if(item.type == 'isHot'){
        params.key = 'isHot';
        params.value = 1
      }

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then((res) => {
          this.$toast.clear();
          if(res.data.code == 500){
            this.menuProduct = res.data.result;
            this.loading = false;
            localStorage.setItem(item.type, JSON.stringify(this.menuProduct))
            
          }
          
        })
        .catch(() => {
          this.$toast.clear();
        });
    },
    navToDetail(pid){
      this.$router.push({name: 'Detail', query: {pid}})
    },
    goSearch(){
      this.$router.push({name: 'Search'})
    }
    
  },
};
</script>