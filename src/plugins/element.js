import Vue from 'vue'
import { Button, Form, FormItem, Input, Message,
Container,Header,Aside,Main,Menu,Submenu,MenuItem,
Breadcrumb,BreadcrumbItem,Card,Row,Col,TableColumn,Table,
Switch,Tooltip, Pagination,Dialog,MessageBox
} 
from 'element-ui'


Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
/* Vue.use()
Vue.use()
Vue.use() */
Vue.use(Row)
Vue.use(Col)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm