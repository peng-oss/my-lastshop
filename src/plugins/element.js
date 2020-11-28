import vue from 'vue'
import Button from 'element-ui'
import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {rules} from 'element-ui'
import { Message } from 'element-ui';
import { Container } from 'element-ui';
import { Aside } from 'element-ui';
import { Main } from 'element-ui';
import { Header } from 'element-ui';
import {Menu } from 'element-ui';
import {Submenu  } from 'element-ui';
import {MenuItem} from 'element-ui';
import {Breadcrumb} from 'element-ui';
import {BreadcrumbItem} from 'element-ui';
import {Card} from 'element-ui';
import {Row} from 'element-ui';
import {Col} from 'element-ui';
import {Table} from 'element-ui';
import {TableColumn} from 'element-ui';
import {Switch} from 'element-ui';
import {Tooltip} from 'element-ui';
import {Pagination} from 'element-ui';
import {Dialog} from 'element-ui';
import { MessageBox } from 'element-ui';
import { Tag } from 'element-ui';
import { Tree } from 'element-ui';
import { Select } from 'element-ui';
import { Option} from 'element-ui';
import { Cascader} from 'element-ui';
import { Alert} from 'element-ui';
import { Tabs} from 'element-ui';
import { TabPane} from 'element-ui';
vue.use(Tabs)
vue.use(TabPane)
vue.use(Select)
vue.use( Alert)
vue.use( Cascader)
vue.use(Option)
vue.use(Button)
vue.use(Tree)
vue.use(Form)
vue.use(FormItem)
vue.use(Input)
vue.use(rules)
Vue.prototype.$message=Message
vue.use(Container)
vue.use(Aside )
vue.use(Main )
vue.use( Menu)
vue.use( Submenu )
vue.use( Header )
vue.use( Breadcrumb)
vue.use( MenuItem)
vue.use( BreadcrumbItem)
vue.use( Card)
vue.use( Row)
vue.use( Col)
vue.use( Table)
vue.use(TableColumn)
vue.use(Switch)
vue.use(Tooltip)
vue.use(Pagination)
vue.use(Dialog)
vue.use(Tag)
Vue.prototype.$confirm=MessageBox.confirm