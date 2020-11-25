<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="listRoles" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template #default="three">
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in three.row.children"
              :key="item1.id"
            >
              <!--  渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesbyId(three.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="removeRolesbyId(three.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--  渲染三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRolesbyId(three.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="roleDesc"
          label="角色描述"
        >
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template #default="two">
            <el-button
              size="medium "
              type="primary"
              icon="el-icon-edit"
              @click="showED(two.row.id)"
              >编辑</el-button
            >
            <el-button
              size="medium "
              type="danger"
              icon="el-icon-delete"
              @click="removeuserbyId(two.row.id)"
              >删除</el-button
            >
            <el-button
              size="medium "
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(two.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogclosed"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="70px">
        <el-form-item label="角色ID">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="增加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @click="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defkey"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotright"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listRoles: [],
      editForm: {},
      editDialogVisible: false,
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      setRightDialogVisible: false,
      rightslist: [],
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defkey:[],
      roleId:''
    }
  },
  created() {
    this.getlistRoles()
  },
  methods: {
    async getlistRoles() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色失败')
      }
      this.listRoles = res.data
      console.log(this.listRoles)
    },
    async showED(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('查询失败')
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.put(
          `roles/${this.editForm.roleId}`,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        ;(this.editDialogVisible = false),
          this.getlistRoles(),
          this.$message.success('更新用户成功')
      })
    },
    editDialogclosed() {
      this.$refs.editFormRef.resetFields()
    },
    adduser() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getlistRoles()
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    async removeuserbyId(id) {
      const configresult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (configresult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败，未连接到后台数据')
      }
      this.$message.success('删除成功')
    },
    async removeRolesbyId(row, rightId) {
      const confirmresult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmresult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      row.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId=role.id
      const { data: res } = await this.$http.get('rights/tree')
      this.setRightDialogVisible = true
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightslist = res.data
      console.log(this.rightslist)
      this.defkey=[],
      this.getleafKeys(role,this.defkey)

    },
    getleafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>
       this.getleafKeys(item,arr)
      )
    },
  async  allotright(){
       const key=[...this.$refs.treeRef.getCheckedKeys(),
       ...this.$refs.treeRef.getHalfCheckedKeys()
       ]  
      const idstr=key.join(',')
     const {data:res}  =await this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr})
     if(res.meta.status!==200){
       return this.$message.error('更新权限失败')
     }
     this.$message.success('刷新权限数据成功')
     this.getlistRoles(),
     this.setRightDialogVisible = false

    }
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
