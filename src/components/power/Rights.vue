<template>
  <div>
    <el-breadcrumb >
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card >
  <template>
    <el-table
      :data="rightslist"
      style="width: 100%"
      border
      stripe
      >
      <el-table-column
      type='index'
      >
         
        </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        >
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
       >
      </el-table-column>
      <el-table-column
        prop="level"
        label="权限等级">
        <template #default='one'>
          <el-tag v-if="one.row.level==='0'">一级权限</el-tag>
           <el-tag type="success"v-else-if="one.row.level==='1'" >二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
      </el-table-column>
    </el-table>
  </template>
</el-card>
  </div>
</template>

<script>
export default {
      data(){
        return{
          rightslist:[]
        }
      },
      created(){
        this.getrightslist()
      },
      methods:{
     async getrightslist(){
      const {data:res}  =  await this.$http.get(`rights/list`)
       if(res.meta.status!==200) return this.$message.error('获取用户权限失败')
         this.rightslist=res.data
        }
      }
}
</script>

<style lang="less" scope>

</style>