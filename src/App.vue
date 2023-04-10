<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<style lang="less">
body{
  background-color: #f5f5f5;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
}
.auto-img{
  width: 100%;
  display: block;
}
.fr{
  float: right;
}
.fl{
  float: left;
}
.clearfix::after{
  content: "";
  display: block;
  clear: both;
}
.one-text{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 隐藏滚动条样式 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  background: transparent;
}

.van-nav-bar .van-icon{
        color: #000;
}

</style>
