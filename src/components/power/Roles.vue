<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">权限列表</a></el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
				</el-col>
			</el-row>

			<el-table :data="roleList" border stripe>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
							v-for="(item1,i1) in scope.row.children" :key="item1.id">
							<!-- 一级权限 -->
							<el-col :span="5">
								<el-tag @close="removeRightById(scope.row,item1.id)" closable>
									{{item1.authName}}
								</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 二三级权限 -->
							<el-col :span="19">
								<el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
									:key="item2.id">
									<el-col :span="6">
										<el-tag type="success" @close="removeRightById(scope.row,item2.id)" closable>
											{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>

									<el-col :span="13">
										<el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id"
											@close="removeRightById(scope.row,item3.id)" closable>
											{{item3.authName}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="roleName" label="角色名称" width="180">
				</el-table-column>
				<el-table-column prop="roleDesc" label="角色描述" width="180">
				</el-table-column>
				<el-table-column label="操作" width="300px ">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
							编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)">删除
						</el-button>
						<el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>

					</template>

				</el-table-column>
			</el-table>

			<el-dialog title="角色信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
				<el-form :model="addForm" ref="addRolesRef" label-width="100px">
					<el-form-item label="角色名称" prop="roleName">
						<el-input v-model="addForm.roleName"></el-input>
					</el-form-item>
					<el-form-item label="角色描述" prop="roleDesc">
						<el-input v-model="addForm.roleDesc"></el-input>
					</el-form-item>

				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addRole">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog title="修改角色" :visible.sync="editDialogVisiable" width="50%" @close="edidDialogClose">
				<el-form :model="editForm" ref="editFormRef" label-width="70px">
					<el-form-item label="角色名称">
						<el-input v-model="editForm.roleName" disabled></el-input>
					</el-form-item>
					<el-form-item label="角色描述">
						<el-input v-model="editForm.roleDesc"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editDialogVisiable = false">取 消</el-button>
					<el-button type="primary" @click="editRolesInfo">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
		<!-- 分配权限对话框 -->
		<el-dialog
		  title="分配权限"
		  :visible.sync="setRightDialogVisible"
		  width="50%"
		  @close="setRightDialogClose"
		  >
		  <!-- 树形控件-->
		 <el-tree ref="treeRef" :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all 
		 :default-checked-keys="defKeys"	
		 ></el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRightDialogVisible = false">取 消</el-button>
		    <el-button @click="allotRights()" type="primary">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				roleList: [],
				addDialogVisible: false,
				addForm: {
					roleName: '',
					roleDesc: ''
				},
				editDialogVisiable: false,
				editForm: {},
				setRightDialogVisible:false,
				//所以权限数据
				rightList:[],
				treeProps:{
					label:'authName',
					children:'children'
				},
				//默认选中的节点的id值数组
				defKeys:[],
				roleId:''
			}
		},
		created() {
			this.getRolesList()
		},
		methods: {
			async getRolesList() {
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败')
				}
				this.roleList = res.data

			},
			async removeRole(id) {
				const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('已取消删除')
				}
				const {
					data: res
				} = await this.$http.delete('roles/' + id)
				if (res.meta.status !== 200) {
					return this.$message.error('删除角色失败')
				}
				this.$message.success('删除角色成功')
				this.getRolesList()
			},
			addDialogClose() {
				this.$refs.addRolesRef.resetFields()
			},
			addRole() {
				this.$refs.addRolesRef.validate(async valid => {
					if (!valid) return
					//可以发送添加用户的网络请求
					const {
						data: res
					} = await this.$http.post('roles', this.addForm)
					if (res.meta.status != 201) {
						this.$message.error('添加角色失败')
					}
					this.$message.success('添加角色成功')
					//关闭对话框
					this.addDialogVisible = false
					//重新获取用户列表
					this.getRolesList()
				})
			},
			async showEditDialog(id) {
				this.editDialogVisiable = true
				const {
					data: res
				} = await this.$http.get('roles/' + id)
				if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
				this.editForm = res.data
				console.log(this.editForm)
			},
			editRolesInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.put('roles/' + this.editForm.roleId, {
						roleName: this.editForm.roleName,
						roleDesc: this.editForm.roleDesc
					})

					console.log(this.editForm)
					console.log(res.meta.status)
					if (res.meta.status !== 200) {
						return this.$message.error('更新用户信息失败')
					}
					this.editDialogVisiable = false
					this.getRolesList()
					this.$message.success('更新用户信息成功')
				})
			},
			edidDialogClose() {
				this.$refs.editFormRef.resetFields()
			},
			async removeRightById(role, rightId) {
				const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('取消了删除')
				}

				const {
					data: res
				} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if (res.meta.status !== 200) {
					this.$message.error('删除权限失败')
				}
				this.$message.success('删除成功')
				role.children = res.data
			},
			//展示分配权限对话框
			async showSetRightDialog(role){
				const {data:res} = await this.$http.get('rights/tree')
				if(res.meta.status!==200){
					return this.$message.error('获取权限数据失败')
				}
				this.rightList = res.data
				console.log(this.rightList)
				this.$message.success('获取权限数据成功')
				this.getLeafKeys(role,this.defKeys)
				this.setRightDialogVisible=true
				this.roleId = role.id
			},
			//通过递归的方式，获取角色下三级权限的id，并且保存在defKeys中
			getLeafKeys(node,arr){
				//如果当前节点不包含children属性，则是三级节点
				if(!node.children){
					return arr.push(node.id)
					
				}
				node.children.forEach(item=>{
					this.getLeafKeys(item,arr)
				})
			},
			setRightDialogClose(){
				this.defKeys=[]
			},
			//点击为角色分配权限
			async allotRights(){
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				const idStr = keys.join(',')
				const {data:res} = await this.$http.post(
				`roles/${this.roleId}/rights`,
				{rids:idStr})
				console.log(res)
				if(res.meta.status!==200){
					return this.$message.error('分配用户角色失败')
				}
				
				this.$message.success('分配用户成功')
				this.getRolesList()
				this.setRightDialogVisible=false
			}
			
		}

	}
</script>

<style lang="less" scoped>
	.bdtop {
		border-top: 1px solid #EEEEEE;
	}

	.bdbottom {
		border-bottom: 1px solid #EEEEEE;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
