<template>
    <div class="secure">
        <van-nav-bar title="安全中心" left-arrow fixed @click-left="goback" />

        <div class="secure-content">
            <van-cell title="修改密码" is-link @click="openPopup"/>
            <van-cell title="注销账号" is-link @click="destroyAccount"/>
        </div>

        <div class="out-login">
             <van-button type="default" color="#0C34BA" block round @click="outLogin">
                退出登录
            </van-button>
        </div>

        <van-popup v-model="isShowPopup" position="bottom" class="popup-box" closeable>
            <div class="popup-psd">
                <div class="psd-title">修改密码</div>
            <van-form>
                <van-field
                  v-model="oldPassword"
                  :type="showOldPsd ? 'text' : 'password'"
                  label="旧密码"
                  placeholder="请输入原先的密码"
                  :right-icon="showOldPsd ? 'eye-o' : 'closed-eye'"
                  @click-right-icon="changeInp('showOldPsd')"
                />
                <van-field
                  v-model="password"
                  :type="showNewPsd ? 'text' : 'password'"
                  label="新密码"
                  placeholder="请输入6-16位且以字母开头的新密码"
                  :right-icon="showNewPsd ? 'eye-o' : 'closed-eye'"
                  @click-right-icon="changeInp('showNewPsd')"
                />

            <div class="btn">
              <van-button round block type="info" color="#0C34BA" @click="updatePassword">确认修改</van-button
              >
            </div>
          </van-form>
            </div>
        </van-popup>

    </div>
</template>
<script>
import {vaildForm} from '../assets/js/vaildForm'
import { utils } from "../assets/js/utils";
export default {
    data(){
        return{
            isShowPopup: false,
            showOldPsd: false,
            showNewPsd: false,
            password: '',
            oldPassword: ''
        }

    },
    methods: {
        goback() {
            this.$router.go(-1);
        },
        // 弹出注册面板
        openPopup() {
          this.isShowPopup = true;
        },
        changeInp(type){
            this[type] = !this[type]
        },
        updatePassword(){
            let o = {
                oldPassword: {
                    reg: /^[A-z]\w{5,15}$/,
                    value: this.oldPassword,
                    errorMsg: '旧密码格式不正确'
                },
                password: {
                    reg: /^[A-z]\w{5,15}$/,
                    value: this.password,
                    errorMsg: '新密码格式不正确'
                }  
            }

            if(!vaildForm.vaild(o)){
                return; // 验证不通过
            }
            if(this.password == this.oldPassword){
                this.$toast("新旧密码不可以相同")
                return;
            }
            utils.requestAxios({
                    method: "POST",
                    url: "/updatePassword",
                    paramsKey: "data",
                    paramsValue: {
                        password: this.password,
                        oldPassword: this.oldPassword,
                    },
               }).then(res => {
                    if(!res){
                        this.$router.push({name: "Login"});
                        return;
                    };

                    if(res.code == "E001"){
                        this.$toast(res.msg);
                        // localStorage.removeItem("MY");
                        this.$cookie.delete("MY");
                        setTimeout(() => {
                            this.$router.push({name: "Login"})
                        },600)
                    }else{
                        this.$notify({
                            type: 'danger', 
                            message: res.msg 
                        })
                    }

               })

        },
        destroyAccount(){
            this.$dialog.confirm({
                title: '注销账号',
                message: '是否确认注销账号，一旦确认无法恢复',
                confirmButtonColor: "#0C34BA"
            }).then(() => {
               utils.requestAxios({
                    method: "POST",
                    url: "/destroyAccount",
                    paramsKey: "data",
                    paramsValue: {},
               }).then(res => {
                    if(!res)return;
                    this.$toast(res.msg);
                    if(res.code == 'G001'){
                        // localStorage.removeItem("MY");
                        this.$cookie.delete("MY");
                        setTimeout(() => {
                            this.$router.push({name: "Login"})
                        },600)
                    }
               })
            })
        },
        outLogin(){
            this.$dialog.confirm({
                title: '退出登录',
                message: '是否确认退出登录！',
                confirmButtonColor: "#0C34BA"
            }).then(() => {
               this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    loadingType: 'spinner',
                    duration: 0
                })

                // localStorage.removeItem("MY");
                this.$cookie.delete("MY");
                setTimeout(() => {
                    this.$toast.clear();
                    this.$router.push({name: "Login"})
                },1000)
            })
        }
    }
}
</script>
<style lang="less">
.secure{
    padding-top: 50px;

    .out-login{
        width: calc(100% - 60px);
        padding: 0 30px;
        position: fixed;
        bottom: 40px;
    }

    .popup-box{
        min-height: 300px;
        border-radius: 20px 20px 0 0;
    }

    .popup-psd{
        padding: 20px 10px;
        
        .van-field__label{
            width: 50px;
        }

        .psd-title{
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 30px;
        }

        .btn{
            margin-top: 40px;
        }
    }
 
}

</style>