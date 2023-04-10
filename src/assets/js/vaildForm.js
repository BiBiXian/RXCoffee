import Vue from 'vue';
import { Notify } from 'vant';

// 全局注册
Vue.use(Notify);
class VaildForm {

    vaild(o) {

        for( let k in o){
            if(!o[k].reg.test(o[k].value)) {
                Notify({ 
                    type: 'danger', 
                    message: o[k].errorMsg 
                });

                return false;
            }
        }

        return true
    }
}

export const vaildForm = new VaildForm()