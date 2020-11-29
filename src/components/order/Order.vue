<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
  <el-row :gutter='20'>
    <el-col :span='8'>
      <el-input placeholder="请输入内容" v-model="querinfo.query" clearable @clear='getOrderlists' >
      <el-button slot="append" icon="el-icon-search"  
      @click="getOrderlists"
  ></el-button>
      </el-input>
    </el-col>
  </el-row>
  <el-table :data="orderlist" border stripe>
<el-table-column type='index' label='#'>
</el-table-column>
<el-table-column  label='订单编号' prop="order_number" width="400px">
</el-table-column>
<el-table-column  label='订单价格' prop="order_price"width="100px">
</el-table-column>
<el-table-column  label='是否付款' prop="pay_status"width="100px">
  <template #default='three'>
   <el-tag type="danger" v-if="three.row.pay_status==='0'">未付款</el-tag>
  <el-tag type="success" v-else>已付款</el-tag>
  </template>
  
</el-table-column>
<el-table-column  label='是否发货' prop="is_send" width="100px">
</el-table-column>
<el-table-column  label='下单时间' prop="update_time"width="300px">
     <template #default="two">
        {{two.row.update_time| dataFormat}}
     </template>
</el-table-column>
<el-table-column  label='操作' >
  <template #default='one'>
     <el-button type="primary" icon="el-icon-edit" size="mini" @click="showbox"></el-button>
   <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showprocessbox"></el-button>
  </template>
  
</el-table-column>

  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="querinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
</el-card>
<el-dialog
  title="修改地址"
  :visible.sync="editdialogVisible"
  width="50%"
  @close="addressDiaglogClosed"
  >
  <el-form :model="editForm" :rules="editrules" ref="editrulesRef" label-width="100px" >
  <el-form-item label="省市/区县" prop="dress1">
    <el-cascader
    :options="cityOptions"
    v-model="editForm.adress1"
  >
  </el-cascader>
  </el-form-item>
   <el-form-item label="详细地址" prop="dress2">
    <el-input v-model="editForm.dress2"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="物流进度"
  :visible.sync="processVisible"
  width="50%"
  >
  <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
 
</el-dialog>

  </div>
</template>

<script>
import cityOptions from './city_data2017_element'
export default {
data() {
  return {
      querinfo:{
        query:'',
        pagenum:1,
        pagesize:10,
      },
      orderlist:[],
      total:0,
      editdialogVisible:false,
      editForm:{
        dress1:[],
        dress2:'',
      },
      editrules:{
      dress1:[
         { required: true, message: '请选择省市/区县', trigger: 'blur' }
      ],
       dress2:[
         { required: true, message: '请输入详细地址', trigger: 'blur' }
      ],
      },
       cityOptions: cityOptions,
       processVisible:false,
       progressInfo:[
    {
      "time": "2018-05-10 09:39:00",
      "ftime": "2018-05-10 09:39:00",
      "context": "已签收,感谢使用顺丰,期待再次为您服务",
      "location": ""
    },
    {
      "time": "2018-05-10 08:23:00",
      "ftime": "2018-05-10 08:23:00",
      "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
      "location": ""
    },
    {
      "time": "2018-05-10 07:32:00",
      "ftime": "2018-05-10 07:32:00",
      "context": "快件到达 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-10 02:03:00",
      "ftime": "2018-05-10 02:03:00",
      "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-09 23:05:00",
      "ftime": "2018-05-09 23:05:00",
      "context": "快件到达 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 21:21:00",
      "ftime": "2018-05-09 21:21:00",
      "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 13:07:00",
      "ftime": "2018-05-09 13:07:00",
      "context": "顺丰速运 已收取快件",
      "location": ""
    },
    {
      "time": "2018-05-09 12:25:03",
      "ftime": "2018-05-09 12:25:03",
      "context": "卖家发货",
      "location": ""
    },
    {
      "time": "2018-05-09 12:22:24",
      "ftime": "2018-05-09 12:22:24",
      "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
      "location": ""
    },
    {
      "time": "2018-05-08 21:36:04",
      "ftime": "2018-05-08 21:36:04",
      "context": "商品已经下单",
      "location": ""
    }
  ],
  }
},
created() {
  this.getOrderlists()
},
methods: {
async  getOrderlists(){
    const {data:res} = await this.$http.get('orders',{
       params:this.querinfo
     })
     if(res.meta.status!==200){
     return  this.$message.error('订单数据获取失败')
     }
     this.orderlist=res.data.goods
     this.total=res.data.total
     console.log(this.orderlist)
  },
  handleSizeChange(newsize){
     this.querinfo.pagesize=newsize
     this.getOrderlists()
  },
  handleCurrentChange(newpage){
   this.querinfo.pagenum=newpage
   this.getOrderlists()
  },
  showbox(){
      this.editdialogVisible=true
  },
  addressDiaglogClosed(){
    this.$refs.editrulesRef.resetFields()
  },
 async showprocessbox(){
     /*  const {data:res} =  await this.$http.get('/kuaidi/1106975712662')
      if(res.meta.status!==200){
        return this.$message.error('获取物流失败')
      }
      this.progressInfo=res.data */
  this.processVisible=true  

  }
},

}

</script>
<style lang="less" scoped>
.el-cascader{
    width:100%;
  }
</style>