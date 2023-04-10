<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
        <!-- include="Home,Menu" Home组件和Menu组件被缓存 -->
        <keep-alive include="Home,Menu">
          <router-view></router-view>
        </keep-alive>
    </div>
    

    <!-- 底部栏 -->
    <van-tabbar v-model="tabbarIndex" active-color="#0C34BA" route>
      <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.actImgIcon : item.imgIcon" />
        </template>
      </van-tabbar-item>
      
    </van-tabbar>
  </div>
</template>

<script>
export default {
    data() {
        return{
            tabbarIndex: 0,
            tabbarData: [
                {
                    title: '首页',
                    imgIcon: require('../assets/images/tabBar/home.png'),
                    actImgIcon:  require('../assets/images/tabBar/home_active.png'),
                    url: {name: 'Home'}
                },
                {
                    title: '菜单',
                    imgIcon: require('../assets/images/tabBar/menu.png'),
                    actImgIcon:  require('../assets/images/tabBar/menu_active.png'),
                    url: {name: 'Menu'}
                },
                {
                    title: '购物袋',
                    imgIcon: require('../assets/images/tabBar/shopbag.png'),
                    actImgIcon:  require('../assets/images/tabBar/shopbag_active.png'),
                    url: {name: 'Shopbag'}
                },
                {
                    title: '我的',
                    imgIcon: require('../assets/images/tabBar/my.png'),
                    actImgIcon:  require('../assets/images/tabBar/my_active.png'),
                    url: {name: 'My'}
                }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
.main{
    padding-bottom: 50px;
}
</style>