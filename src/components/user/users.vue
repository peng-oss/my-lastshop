<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="querInfo.query"
            clearable
            @clear="getuserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserlist"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template #default="abc">
            <el-switch
              v-model="abc.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userstatechanged(abc.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default='cde'>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(cde.row.id)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeuserbyId(cde.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="设置角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="parseInt(querInfo.pagenum)"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="parseInt(querInfo.pagesize)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="70px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
     @close="editDialogclosed"
    >
     <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="70px"
        :rules="editFormRules"
      >
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getuserlist()
  },
  data() {
    var checkphone = (rule, value, callback) => {
      const regphone = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regphone.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      querInfo: {
        query: '',
        pagenum: '1',
        pagesize: '2',
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          {
            validator: checkphone,
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false,
      editForm:{
      },
      editFormRules:{
         email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          {
            validator: checkphone,
            trigger: 'blur',
          },
        ],
      }
    }
  },
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get('users', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
      console.log(this.userlist)
      console.log(this.total)
    },
    handleSizeChange(val) {
      this.querInfo.pagesize = val
      console.log(`每页 ${val} 条`)
      this.getuserlist()
    },
    handleCurrentChange(val) {
      this.querInfo.pagenum = val
      console.log(`当前页: ${val}`)
      this.getuserlist()
    },
    async userstatechanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      return this.$message.success('更新用户状态成功')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    adduser() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getuserlist()
      })
    },
   async showEdit(id) {
      const {data:res}= await this.$http.get(`users/${id}`)
     if(res.meta.status!==200) return this.$message.error('查询失败')
         this.editForm=res.data
         console.log(this.editForm)
      this.editDialogVisible=true
    },
editDialogclosed(){
    this.$refs.editFormRef.resetFields()
},
editUserInfo(){
  this.$refs.editFormRef.validate(async (vaild)=>{
   if(!vaild) return
   const {data:res}=await this.$http.put(`users/${this.editForm.id}`,{email:this.editForm.email,
                  mobile:this.editForm.moblie
   })
   if(res.meta.status!==200) return this.$message.error('修改失败')
    this.editDialogVisible=false,
     this.getuserlist()
     this.$message.success('更新用户成功')
  })
},
async removeuserbyId(id){
const configresult= await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
   if(configresult!=='confirm'){
    
    return this.$message.info('已经取消删除')
   }
   const {data:res} = await this.$http.delete(`users/${id}`)
   if(res.meta.status!==200){
     return this.$message.error('删除失败，未连接到后台数据')
   }
   this.$message.success('删除成功')
     
}
  },
}
</script>

<style lang="less" scoped></style>
