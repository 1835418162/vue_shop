import Vue from 'vue'
import { Button, Form, FormItem, Input, Message,
Container,Header,Aside,Main,Menu,Submenu,MenuItem,
Breadcrumb,BreadcrumbItem,Card,Row,Col,TableColumn,Table,
Switch,Tooltip, Pagination,Dialog,MessageBox,Tag,Tree,Select,Option
,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,CheckboxGroup,Upload,Timeline,
TimelineItem
} 
from 'element-ui'

Vue.use(TimelineItem)
Vue.use(Timeline)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
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