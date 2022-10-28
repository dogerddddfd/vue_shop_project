<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>订单管理</el-breadcrumb-item>
         <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区 -->
      <el-card>
         <!-- 搜索区 -->
         <el-row gutter:20>
            <el-col :span="8">
               <el-input
                  placeholder="请输入内容"
                  clearable
                  v-model="queryInfo.query"
                  @clear="getOrderList()"
               >
                  <el-button
                     slot="append"
                     icon="el-icon-search"
                     @click="getOrderList()"
                  ></el-button>
               </el-input>
            </el-col>
         </el-row>

         <!-- 表格区 -->
         <el-table border stripe :data="orderList">
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 订单编号 -->
            <el-table-column
               label="订单编号"
               prop="order_number"
               min-width="200px"
            ></el-table-column>
            <!-- 订单价格 -->
            <el-table-column
               label="订单价格"
               prop="order_price"
            ></el-table-column>
            <el-table-column label="是否付款" prop="order_pay">
               <template slot-scope="scope">
                  <el-tag v-if="scope.row.order_pay === 0" type="danger"
                     >未付款</el-tag
                  >
                  <el-tag v-else type="success">已付款</el-tag>
               </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send">
               <template slot-scope="scope">
                  <el-tag v-if="scope.row.is_send === '否'" type="danger"
                     >未发货</el-tag
                  >
                  <el-tag v-else type="success">已发货</el-tag>
               </template>
            </el-table-column>
            <el-table-column label="下单时间" prop="create_time">
               <template slot-scope="scope">
                  {{ scope.row.create_time | dataFormat }}
               </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
               <template slot-scope="scope">
                  <!-- 修改地址 -->
                  <el-tooltip
                     effect="dark"
                     content="修改地址"
                     placement="top"
                     :enterable="false"
                  >
                     <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="showChangeAddressDialog()"
                     ></el-button>
                  </el-tooltip>
                  <!-- 物流信息 -->
                  <el-tooltip
                     effect="dark"
                     content="物流信息"
                     placement="top"
                     :enterable="false"
                  >
                     <el-button
                        type="success"
                        size="mini"
                        icon="el-icon-s-opportunity"
                        @click="showProgress(scope.row.order_id)"
                     ></el-button> </el-tooltip
               ></template>
            </el-table-column>
         </el-table>

         <!-- 分页 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 7, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
         >
         </el-pagination>
      </el-card>

      <!-- 修改地址对话框 -->
      <el-dialog
         :visible.sync="changeAddressDialogVisable"
         title="修改地址"
         @close="changeAddressDialogClosed()"
      >
         <el-form
            :model="addressForm"
            :rules="addressFormRulse"
            ref="addressFormRef"
         >
            <el-form-item label="省市区/县" prop="address1">
               <el-cascader
                  :options="cityData"
                  v-model="addressForm.address1"
               ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
               <el-input
                  v-model="addressForm.address2"
                  style="width: 70%"
               ></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="ChangeAddress()"
               >确 定
            </el-button>
         </span>
      </el-dialog>

       <!-- 物流信息对话框 -->
       <el-dialog
         :visible.sync="progressDialogVisalbe"
         title="物流信息"
         @close="ProgressDialogClosed()"
      >
        
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="ChangeAddress()"
               >确 定
            </el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
import cityData from './citydata.js'

export default {
   data() {
      return {
         // 查询条件
         queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 5,
         },
         // 订单总数
         total: 0,
         // 订单列表
         orderList: [],
         //修改地址对话框可见性
         changeAddressDialogVisable: false,
         // 修改地址表单
         addressForm: {
            // 省市区
            address1: [],
            // 详细地址
            address2: '',
         },
         // 物理信息对话框可见性
         progressDialogVisalbe:false,
         // 物流信息
         progress: [],
         // 地址表单规则
         addressFormRulse: {
            address1: [
               { required: true, message: '请选择地址', trigger: 'blur' },
            ],
            address2: [
               { required: true, message: '请填写地址', trigger: 'blur' },
            ],
         },
         // 城市数据 同名简写
         cityData,
      }
   },
   created() {
      this.getOrderList()
   },
   methods: {
      // 获取订单列表
      async getOrderList() {
         const { data: res } = await this.$http.get(`orders`, {
            params: this.queryInfo,
         })
         if (res.meta.status !== 200) {
            console.log(res.meta.msg)
            this.$message.error('获取订单列表失败')
            return
         }
         this.orderList = res.data.goods
         this.total = res.data.total
      },
      // 展示修改地址对话框
      showChangeAddressDialog() {
         this.changeAddressDialogVisable = true
      },
      // 修改地址
      ChangeAddress() {
         this.changeAddressDialogVisable = false
      },
      // 监听地址对话框关闭
      changeAddressDialogClosed(){
         this.$refs.addressFormRef.resetFields()
      },
      // 监听pagesize改变
      handleSizeChange(newPagesize) {
         this.queryInfo.pagesize = newPagesize
         this.getOrderList()
      },
      // 监听页码改变
      handleCurrentChange(newPage) {
         this.queryInfo.pagenum = newPage
         this.getOrderList()
      },
      // 展示物流情况
      async showProgress(id) {
         this.$message.error('获取物流信息失败')
         // const testid="1106975712662"
         // const { data: res } = await this.$http.get(`/kuaidi/${id}`)
         // if (res.meta.status !== 200) {
         //    console.log(res.meta.msg)
         //    this.$message.error('获取物流信息失败')
         //    return
         // }
         
         // this.progress = res.data
         // console.log(this.progress)
         // this.progressDialogVisalbe = true
      },
      // 监听物流框关闭
      ProgressDialogClosed(){
         this.progress=[]
      },
   },
}
</script>

<style lang="less">
.el-cascader-panel {
   height: 350px !important;
}
</style>