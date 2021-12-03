<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>

			<!-- 表格 -->
			<tree-table class="treetable" :data="catelist" :columns="columns" :selection-type="false"
				:expand-type="false" show-index border>
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green"></i>
					<i class="el-icon-error" v-else style="color:red"></i>
				</template>

				<template slot="order" slot-scope="scope">
					<el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
					<el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
					<el-tag type="warning" size="mini" v-else>三级</el-tag>
				</template>

				<template slot="option" slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
				</template>
			</tree-table>

			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 20]" :page-size="querInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

		<!-- 添加分类的对话框 -->
		<el-dialog @close="addCateDiglogClose" title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
			<el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
				<el-form-item label="分类名称:" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类:">
					<!-- options用来指定数据源 -->
					 <el-cascader
						style="width: 100%;"
						clearable
					    v-model="selectedkeys"
					    :options="parentCateList"
					    :props="cascaderProps"
					    @change="parentCateChanged"></el-cascader>
				</el-form-item>
			</el-form>	
				<span slot="footer" class="dialog-footer">
					<el-button @click="addCateDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addCate">确 定</el-button>
				</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {

		data() {
			return {
				catelist: [],
				querInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				total: 0,
				//为table指定列的定义
				columns: [{
						label: '分类名称',
						prop: 'cat_name',

					},
					{
						label: "是否有效",
						type: "template",
						template: 'isok'
					},
					{
						label: "排序",
						type: "template",
						template: 'order'
					},
					{
						label: "操作",
						type: "template",
						template: 'option'
					}
				],
				addCateDialogVisible: false,
				//添加分类的表单数据项
				addCateForm:{
					cat_name:'',
					cat_pid:0,
					cat_level:0
				},
				addCateFormRules:{
					
				},
				parentCateList:[],
				cascaderProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children',
					checkStrictly:true
				},
				//选中的父级分类的id数组
				selectedkeys:[]
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: this.querInfo
				})
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品列表失败')
				}
				this.catelist = res.data.result
				this.total = res.data.total
				console.log(this.catelist)
				console.log(this.total)
			},
			handleSizeChange(newSize) {
				this.querInfo.pagesize = newSize
				this.getCateList()
			},
			handleCurrentChange(newPage) {
				this.querInfo.pagenum = newPage
				this.getCateList()
			},
			showAddCateDialog() {
				this.getParentCateList()
				this.addCateDialogVisible = true
			},
			async getParentCateList(){
				const {data:res} = await this.$http.get('categories',{params:{type:2}})
				if(res.meta.status!==200){
					return this.$message.error('获取父级分类数据失败')
				}
				this.parentCateList = res.data
				console.log(this.parentCateList)
			},
			parentCateChanged(){
				console.log(this.selectedkeys)
				if(this.selectedkeys>0){
					this.addCateForm.cat_pid=this.selectedkeys[this.selectedkeys.length-1]
					this.addCateForm.cat_level = this.selectedkeys.length
					return
				}else{
					this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0
				}
			},
			addCate(){
				this.$refs.addCateFormRef.validate(async valid=>{
					if(!valid) return
					const {data:res} = await this.$http.post('categories',{
						cat_pid:addCateForm.cat_pid
					})
					console.log(this.addCateForm.cat_name)
					if(res.meta.status!==201){
						return this.$message.error('添加商品分类失败')
					}
					this.$message.success('添加商品分类成功')
					this.getCateList()
					this.addCateDialogVisible = false
				})
			},
			addCateDiglogClose(){
				this.$refs.addCateFormRef.resetFields()
				this.selectedkeys = []
				this.addCateForm.cat_pid = 0
				this.addCateForm.cat_level = 0
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.treetable {
		margin-top: 15px;
	}
</style>
