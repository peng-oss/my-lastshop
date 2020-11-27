<template>
   <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card >
    <el-row>
        <el-col>
          <el-button type="primary" @click="addcat">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data='catelist':columns='columns'
      :selection-type="false"  :expand-type='false' show-index
      border 
      >
      <template #isok="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
        <i class="el-icon-error" v-else style="color:red"></i>
      </template>
       <template #order="scope">
       <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
       <el-tag type="success" v-else-if="scope.row.cat_level===1" size="mini">二级</el-tag>
       <el-tag type="warning" v-else size="mini">三级</el-tag>
      </template>
       <template #opt="scope">
       <el-button type="primary" icon="el-icon-edit" size="mini" @click="editcatdialg(scope.row.cat_id)">编辑</el-button>
       <el-button type="danger" icon="el-icon-delete"
       size="mini" @click="open(scope.row.cat_id)"
       >删除</el-button>
      </template>
      </tree-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querinfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<el-dialog
  title="添加分类"
  :visible.sync="addcatdialogVisible"
  width="50%"
  @close="addcatdialogclosed"
>
 <el-form :model="addcatForm" :rules="addcatFormrules" ref="addcatFormref" label-width="100px" >
  <el-form-item label="分类名称：" prop="cat_name">
    <el-input v-model="addcatForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类：" >
   <el-cascader
   clearable
   expandTrigger="hover"
    v-model="selectedkeys"
    :options="parentcatlist"
    :props="cascaderProps"
    @change="parentcatchanged"></el-cascader>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addcatdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="test">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改分类"
  :visible.sync="editcatdialogVisible"
  width="50%"
>
 <el-form :model="editcatForm" :rules="addcatFormrules" ref="editcatFormref" label-width="100px" >
  <el-form-item label="分类名称："  prop="cat_name">
    <el-input v-model="editcatForm.cat_name"></el-input>
  </el-form-item>
 </el-form>
 <span slot="footer" class="dialog-footer">
    <el-button @click="editcatdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editsend">确 定</el-button>
  </span>
  </el-dialog>

   </div>
</template>

<script>
export default {
data(){
  return{
    querinfo:{
      type:3,
      pagenum:1,
      pagesize:5
    },
    catelist:[],
    total:0,
    columns:[
      {
        label:'分类名称',
        prop:'cat_name'
      },{
        label:'是否有效',
        type:'template',
        template:'isok'
      },{
        label:'排序',
        type:'template',
        template:'order'
      },{
        label:'操作',
        type:'template',
        template:'opt'
      }
    ],
    addcatdialogVisible:false,
    addcatForm:{
        cat_pid:0,
        cat_name:'',
        cat_level:0
    },
    addcatFormrules:{
      cat_name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    },
    parentcatlist:[],
    cascaderProps:{
      value:'cat_id',
      label:'cat_name',
      children:'children',
       checkStrictly:true
    },
    selectedkeys:[],
    editcatForm:{
      cat_name:''
    },
    editcatdialogVisible:false,
    loginid:'',
  }
},
created(){
 this.getcatelist()
},
methods:{
async  getcatelist(){
    const {data:res} = await this.$http.get('categories',{params: this.querinfo})
   if(res.meta.status!==200){
     return this.$http.error('获取商品分类失败')
   }
   console.log(res.data)
   this.catelist=res.data.result
   console.log(this.catelist)
   this.total=res.data.total
   console.log(this.total)
  },
  handleSizeChange(newSize){
      this.querinfo.pagesize=newSize
      this.getcatelist()
  },
  handleCurrentChange(newPage){
      this.querinfo.pagenum=newPage
      this.getcatelist()
  },
  addcat(){
    this.getParentcatlist()
    this.addcatdialogVisible=true
  },
 async getParentcatlist(){
      const {data:res} =  await this.$http.get('categories',{params:{ type:2}})
      if(res.meta.status!==200){
        this.$message.error('获取父级分类数据列表失败')
      }
      this.parentcatlist=res.data
      console.log(res.data)
  },
  parentcatchanged(){
    console.log(this.selectedkeys)
    if(this.selectedkeys.length>0){
        this.addcatForm.cat_pid=this.selectedkeys[this.selectedkeys.length-1]
        this.addcatForm.cat_level=this.selectedkeys.length
        return
    }else{
      this.addcatForm.cat_pid=0
       this.addcatForm.cat_level=0
    }
  },
  test(){
    console.log(this.addcatForm)
     this.$refs.addcatFormref.validate(async valid=>{
         if(!valid) return
     const {data:res} =await this.$http.post('categories',this. addcatForm) 
       if(res.meta.status!==201) return this.$message.error('添加分类失败')
       this.$message.success('添加分类成功')
         this.getcatelist()
         this.addcatdialogVisible = false
        
     })
  },
  addcatdialogclosed(){
    this.$refs.addcatFormref.resetFields()
    this.selectedkeys=[]
    this.addcatForm.cat_pid=0
       this.addcatForm.cat_level=0
  },
  async  editcatdialg(id){
      const {data:res} =   await  this.$http.get(`categories/${id}`)
         this.loginid=id
     if(res.meta.status!==200){
       return this.$message.error('查询失败')
     }
     this.editcatForm.cat_name=res.data.cat_name
    this.editcatdialogVisible=true
  },
  
 async editsend(){
        const {data:res} =    await this.$http.put(`categories/${this.loginid}`,{
        cat_name:this.editcatForm.cat_name
        }    
        )
      if(res.meta.status!==200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
         this.getcatelist()
         this.editcatdialogVisible=false
  } ,
async  open(id){
  const configresult= await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err)=>err)
      if (configresult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败，未连接到后台数据')
      }
      this.$message.success('删除成功')
      this.getcatelist()

  }
},
}
</script>

<style lang="less" scoped>
.el-button{
  margin-bottom:20px
}
.el-cascader{
  width: 100%;
}
</style>