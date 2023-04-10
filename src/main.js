import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookie'
import 'lib-flexible/flexible'

import { 
  NavBar,
  Form,
  Field,
  Button,
  Popup,
  Notify,
  Toast,
  Tabbar, 
  TabbarItem,
  Search,
  Swipe, 
  SwipeItem,
  Icon,
  Skeleton,
  Stepper,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  Cell,
  AddressEdit,
  AddressList,
  Uploader,
  Tab, 
  Tabs,
  Dialog 
 } from 'vant';

Vue.use(NavBar)
   .use(Form)
   .use(Field)
   .use(Button)
   .use(Popup)
   .use(Notify)
   .use(Toast)
   .use(Tabbar)
   .use(TabbarItem)
   .use(Search)
   .use(Swipe)
   .use(SwipeItem)
   .use(Icon)
   .use(Skeleton)
   .use(Stepper)
   .use(GoodsAction)
   .use(GoodsActionIcon)
   .use(GoodsActionButton)
   .use(Empty)
   .use(SwipeCell)
   .use(Checkbox)
   .use(SubmitBar)
   .use(Cell)
   .use(AddressEdit)
   .use(AddressList)
   .use(Uploader)
   .use(Tab)
   .use(Tabs)
   .use(Dialog)
   

Vue.use( VueAxios, axios)
Vue.use(VueCookies);

axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

// 给vue添加一个原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';


// 全局注册过滤器， 一般用于格式化数据
Vue.filter('formatDate', (value, format) => {
  // value: 需要格式化的数据
  // format: 指定格式 'yyyy-MM-dd hh:mm:ss'

  let date = new Date(value);
  
  let year = date.getFullYear();
  if(/(y+)/.test(format)){
    let content = RegExp.$1;

    format = format.replace(content, year.toString().slice(4 - content.length));
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  for(let k in o){
    let reg = new RegExp(`(${k}+)`);

    if(reg.test(format)){
      let content = RegExp.$1;
      let key = o[k] >= 10 ? o[k] : content.length == 2 ? '0' + o[k] : o[k];

      format = format.replace(content, key)
    }
    
  }

  return format;

})

// 关闭生产环境提示
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
