<template>
	<el-container>
	  <el-header>
		  <div>
			  <img class="logo" src="../assets/logo.png" >
			  <span class="fonts">电商后台管理系统</span>
		  </div>
		  <el-button type="info" @click="logout">退出</el-button>
		  </el-header>
	  <el-container>
	    <el-aside :width="isCollapse?'64px':'200px'">
			<div class="toggle-button" @click="toggleCollapse()">|||</div>
			<el-menu
			:default-active="activePath"
			router
			:collapse-transition="false"
			:collapse="isCollapse"
			background-color="#333744"
			text-color="#fff"
			active-text-color="#409EFF"
			unique-opened
			>
			      <el-submenu :index="item.id+''" v-for="item in menuslist" :key="item.id">
			        <template slot="title">
			          <i :class="iconsObj[item.id]"></i>
			          <span>{{item.authName}}</span>
			        </template>
					<!-- 二级菜单 -->
			          <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id"
						@click="saveNavState('/'+subitem.path)"				
					  > 
						  <template slot="title">
						    <i class="el-icon-menu"></i>
						    <span>{{subitem.authName}}</span>
						  </template>
					  </el-menu-item>
			        
			      </el-submenu>
			     
			    </el-menu>
		</el-aside>
	    <el-main>
		<router-view></router-view>
		</el-main>
	  </el-container>
	</el-container>
</template>

<script>
export default {
	data(){
		return{
			menuslist:[],
			iconsObj:{
				'125':'iconfont icon-user',
				'103':'iconfont icon-tijikongjian',
				'101':'iconfont icon-shangpin',
				'102':'iconfont icon-danju',
				'145':'iconfont icon-baobiao'
			},
			isCollapse : false,
			activePath:''
		}
	},
   created(){
	   this.getMenuList()
	   this.activePath = window.sessionStorage.getItem('activePath')
   },	 
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
	async getMenuList(){
		const {data:res} = await this.$http.get('menus')
		if(res.meta.status!==200) return this.$message.error(res.meta.msg)
		this.menuslist = res.data

	},
	toggleCollapse(isCollapse){
		this.isCollapse = !this.isCollapse
	},
	saveNavState(activePath){
		window.sessionStorage.setItem('activePath',activePath)
		this.activePath = activePath
	}
	
	
  }
  
}
</script>

<style lang="less" scoped>
	.el-container{
		height: 100%;
	}
	.el-header{
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		padding: 0px;
		align-items: center;
		color: white;
		font-size: 20px;
		line-height: 60px;
		>div{
			display: flex;
			align-items: center;
		img{
			height: 60px;
			width: 60px;
		}
		span{
			margin-left:20px ;
		}	
		}	
	}
	.el-aside{
		background-color:#333744 ;
		.el-menu{
			border-right: none;
		}
	}
	.el-main{
		background-color: #eaedf1;
	}
	.iconfont{
		margin-right:10px ;
	}
	.toggle-button{
		background-color: #4A5064;
		font-size: 10px;
		line-height: 24px;
		color: #fff;
		text-align: center;
		letter-spacing: 0.4em;
		cursor: pointer;
	}
</style>
