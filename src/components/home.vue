<template>
  <!-- 头部 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出</el-button>
    </el-header>
    <el-container>
      <!--  导航栏 -->
      <el-aside :width="iscollapse?'64px':'200px'">
        <!--  侧边栏菜单区 -->
         <div class="togglebutton" @click="toggleCollapse" >|||</div>
        <el-menu
          background-color="rgb(51,55,68)"
          text-color="#fff"
          active-text-color="#409EFF"
          height="100%"
          unique-opened
          :collapse='iscollapse'
          :collapse-transition="false"
               :router="true"
               :default-active="activepath"
              
        >
          <el-submenu
            :index="item.id+''"
            v-for="item in menulist"
            :key="item.id"
            
             
          >
            <template slot="title">
              <i :class="iconsobj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="savenavstate('/'+subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--  主体 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getmenulist(),
      this.activepath=window.sessionStorage.getItem('activepath');
  },
  data: function() {
    return {
      menulist: [],
      iconsobj:{
        "125":'iconfont icon-users',
        "103":'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      iscollapse:false,
      activepath:'',
   
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getmenulist() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      
    },
    toggleCollapse(){
     this.iscollapse=!this.iscollapse
    },
    savenavstate(active){
    window.sessionStorage.setItem("activepath",active);
     this.activepath=active
    }
    
  },
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
  border-right: none;
}
}
.el-main {
  background-color: #eaedfa;
}
.iconfont{
  margin-right: 10px;
}
.togglebutton{
  background-color:#4A5064;
  font-size:15px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  cursor: pointer;

}

</style>
