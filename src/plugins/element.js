import vue from 'vue'
import button from 'element-ui'
import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {rules} from 'element-ui'
import { Message } from 'element-ui';

vue.use(button)
vue.use(Form)
vue.use(FormItem)
vue.use(Input)
vue.use(rules)
Vue.prototype.$message=Message