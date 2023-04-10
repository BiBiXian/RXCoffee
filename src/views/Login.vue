<template>
  <div class="login">
    <!-- 登录 -->
    <div class="login-box">
      <!-- 导航条 -->
      <van-nav-bar>
        <template #left>
          <div class="left-nav">
            <div class="logo">
              <img
                src="../assets/images/tabBar/home_active.png"
                class="auto-img"
                alt=""
              />
            </div>
            <div class="left-title">Lukin Coffee</div>
          </div>
        </template>

        <template #right>
            <div class="close-box" @click="goMenu">先逛一逛</div>
        </template>
      </van-nav-bar>
      <!-- 表单 -->
      <div class="login-form">
        <div class="form-title">'欢迎回来</div>
        <div class="form-en-title">Please login to your accounts</div>

        <div class="login-form-box">
          <van-form>
            <van-field
              v-model="loginInfo.phone"
              type="tel"
              label="手机号"
              placeholder="请输入你的手机号"
            />
            <van-field
              v-model="loginInfo.password"
              :type="showLoginPsd ? 'text' : 'password'"
              label="密码"
              placeholder="请输入你的密码"
              :right-icon="showLoginPsd ? 'eye-o' : 'closed-eye'"
              @click-right-icon="changePsdInp('showLoginPsd')"
            />
           
            <div class="login-btn">
              <van-button round block type="info" color="#0C34BA" @click="login"
                >登&nbsp;&nbsp;录</van-button
              >
            </div>

            <div class="login-btn">
              <van-button round block type="default" @click="openRegister"
                >注&nbsp;&nbsp;册</van-button
              >
            </div>
          </van-form>
        </div>

      </div>
    </div>

    <!-- 注册 -->
    <van-popup
      v-model="showPopup"
      position="bottom"
      closeable
      class="popup-box"
    >
      <div class="register">
        <div class="register-title">注册</div>
        <van-form>
            <van-field
              v-model="registerInfo.phone"
              type="tel"
              label="手机号"
              placeholder="请输入你的手机号"
            />
            <van-field
              v-model="registerInfo.nickName"
              label="昵称"
              placeholder="请输入1-10位字符昵称"
            />
            <van-field
              v-model="registerInfo.password"
              :type="showRegPsd ? 'text' : 'password'"
              label="密码"
              placeholder="请输入6-16位且以字母开头的密码"
              :right-icon="showRegPsd ? 'eye-o' : 'closed-eye'"
              @click-right-icon="changePsdInp('showRegPsd')"
            />

            <div class="login-btn">
              <van-button round block type="info" color="#0C34BA" @click="register">注&nbsp;&nbsp;册</van-button
              >
            </div>
          </van-form>
      </div>
    </van-popup>
  </div>
</template>
<script>
import "../assets/less/login.less";
import {vaildForm} from '../assets/js/vaildForm'
import {utils} from '../assets/js/utils'
export default {
  data() {
    return {
      loginInfo: {
        phone: "",
        password: ""
      },
      registerInfo: {
        phone: "",
        password: "",
        nickName: ""
      },
      showLoginPsd: false,
      showRegPsd: false,
      showPopup: false
    };
  },
  methods: {
    goMenu(){
      this.$router.push({name: 'Menu'})
    },
    // 弹出注册面板
    openRegister() {
      this.showPopup = true;
    },
    
    // 显示隐藏密码框文本
    changePsdInp(type){
        this[type] = !this[type]
    },
    // 用户注册注册
    register(){
        let info = this.registerInfo;
        let o = {
            phone: {
                reg: /^1[3-9]\d{9}$/,
                value: info.phone,
                errorMsg: '手机号格式不正确'
            },
            nickName: {
                reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
                value: info.nickName,
                errorMsg: '昵称格式不正确'
            },
            password: {
                reg: /^[A-z]\w{5,15}$/,
                value: info.password,
                errorMsg: '密码格式不正确'
            }
        }

        if(!vaildForm.vaild(o)){
            return; // 验证不通过
        }

        // 发送请求
         this.$toast.loading({
            message: '注册中...',
            forbidClick: true,
            loadingType: 'spinner',
            duration: 0
         })

         let data = utils.queryString({
             ...info,
            appkey: this.appkey
         })


         this.axios({
            method: 'POST',
            url: '/register',
            data
         }).then(res => {
            this.$toast.clear();

            if(res.data.code == 100){
                // 注册成功
                this.showPopup = false;
                this.$toast('注册成功，请登录')
                for(let k in info){
                    info[k] = "";
                }
            }else{
                this.$notify({ 
                    type: 'danger', 
                    message: res.data.msg
                });
            }

         }).catch(err => {
            this.$toast.clear();
            this.$notify({ 
                    type: 'danger', 
                    message: '注册失败,请重新注册' 
            });
         })

        
        

    },
    // 用户登录
    login(){
        let info = this.loginInfo;
        let o = {
            phone: {
                reg: /^1[3-9]\d{9}$/,
                value: info.phone,
                errorMsg: '手机号格式不正确'
            },
            password: {
                reg: /^[A-z]\w{5,15}$/,
                value: info.password,
                errorMsg: '密码格式不正确'
            }
        }

        if(!vaildForm.vaild(o)){
            return; // 验证不通过
        }

        // 发送请求
         this.$toast.loading({
            message: '登录中...',
            forbidClick: true,
            loadingType: 'spinner',
            duration: 0
         })

         let data = utils.queryString({
             ...info,
            appkey: this.appkey
         })

         this.axios({
            method: 'POST',
            url: '/login',
            data
         }).then(res => {
            this.$toast.clear();

            if(res.data.code == 200){
                // 登录成功
                // localStorage.setItem('MY', res.data.token)
                this.$cookie.set('MY', res.data.token, 1);
                this.$router.push({name: 'Home'})
            }else{
                this.$notify({ 
                    type: 'danger', 
                    message: res.data.msg
                });
            }

         }).catch(err => {
            this.$toast.clear();
            this.$notify({ 
                    type: 'danger', 
                    message: '登录失败,请重新登录' 
            });
         })


    }
  },
};
</script>