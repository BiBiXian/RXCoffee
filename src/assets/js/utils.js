import Vue from 'vue';
import axios from 'axios'
import cookie from 'vue-cookie'
import { Toast } from 'vant';
class Utils {
    constructor() {
        this.axiosNum = 0;
    }

    queryString(o) {
        let params = ''
        for (let k in o) {
            params += `${k}=${o[k]}&`;
        }

        return params.slice(0, -1);
    }

    requestAxios(axiosData, loadingMsg = '加载中...') {
        /* data: {
            axiosData: {
            url: 请求路径
            method: 请求方式,
            paramsKey: 请求参数的属性名
            paramsValue: 请求参数,
            }
            
            loadingMsg: 加载文字
        }*/
        return new Promise((resolve, reject) => {
            // let tokenString = localStorage.getItem("MY");
            let tokenString = cookie.get("MY");
            if (!tokenString) {
                resolve(false);
                return;
            }

            Toast.loading({
                message: loadingMsg,
                forbidClick: true,
                loadingType: "spinner",
                duration: 0,
            });
    
            this.axiosNum++;
            axiosData.paramsValue = {
                appkey: Vue.prototype.appkey,
                tokenString,
                ...axiosData.paramsValue
            }
    
            if (axiosData.method == 'POST') {
                axiosData.paramsValue = this.queryString(axiosData.paramsValue)
            }
            axios({
                method: axiosData.method,
                url: axiosData.url,
                [axiosData.paramsKey]: axiosData.paramsValue
            }).then(res => {
                this.axiosNum--;
                if(this.axiosNum == 0){
                    Toast.clear();
                }
                resolve(res.data)
            }).catch(err => {
                if(this.axiosNum == 0){
                    Toast.clear();
                }
                reject(err)
            })

        })

        

    }

}

export const utils = new Utils