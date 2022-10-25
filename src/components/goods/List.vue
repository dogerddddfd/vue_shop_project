<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区 -->
      <el-card>
         <!-- 添加与搜索区域 -->
         <el-row gutter:20>
            <!-- 搜索 -->
            <el-col :span="8">
               <el-input
                  placeholder="请输入内容"
                  clearable
                  v-model="queryInfo.query"
                  @clear="getGoodsList()"
               >
                  <el-button
                     slot="append"
                     icon="el-icon-search"
                     @click="getGoodsList()"
                  ></el-button>
               </el-input>
            </el-col>

            <!-- 添加 -->
            <el-col :span="4">
               <el-button
                  type="primary"
                  @click="goAddPage()"
                  style="margin-left: 30px"
                  >添加商品</el-button
               >
            </el-col>
         </el-row>
         <!-- 主体区 -->
         <!-- 表格区 -->
         <el-table border stripe :data="goodsList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
               prop="goods_name"
               label="商品名称"
               min-width="400px"
            ></el-table-column>
            <el-table-column
               prop="goods_price"
               label="商品价格(元)"
               min-width="70px"
            ></el-table-column>
            <el-table-column
               prop="goods_weight"
               label="商品重量"
               min-width="50px"
            ></el-table-column>
            <el-table-column prop="add_time" label="创建时间" >
               <template slot-scope="scope">
                  {{ scope.row.add_time | dataFormat }}
               </template>
            </el-table-column>
            <el-table-column label="操作">
               <template slot-scope="scope">
                  <el-button
                     type="primary"
                     size="mini"
                     icon="el-icon-edit"
                     @click="showEditDialog()"
                     disabled
                  ></el-button>
                  <el-button
                     type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click="remvoeGoodsById(scope.row.goods_id)"
                  ></el-button>
               </template>
            </el-table-column>
         </el-table>
         <!-- 页码区 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
         >
         </el-pagination>
      </el-card>


      <!-- 修改用户对话框 -->
      <el-dialog
         title="修改数据"
         :visible.sync="editDialogVisable"
         width="50%"
         @close="editDialogClosed"
      >
         <!-- 内容主体区 -->
         <!-- 表单区 -->
         <el-form
            :model="editForm"
            :rules="formRules"
            ref="editFormRef"
            label-width="70px"
         >
            <el-form-item label="" prop="">
               <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editGoodsInfo">确 定 </el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   data() {
      return {
         // 查询、换页参数
         queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 10,
         },
         // 总条数
         total: 0,
         // 商品列表
         goodsList: [],
         // 编辑框可见性
         editDialogVisable: false,
         // 修改表单
         editForm: {},
         // 表单规则
         formRules: {},
      }
   },
   created() {
      this.getGoodsList()
   },
   methods: {
      // 获得商品列表
      async getGoodsList() {
         const { data: res } = await this.$http.get(`goods`, {
            params: this.queryInfo,
         })
         // console.log(res)

         if (res.meta.status !== 200) {
            this.$message.error('获取商品列表失败！')
            return
         }
         this.goodsList = res.data.goods
         this.total = res.data.total
      },
      // 监控pagesize改变
      handleSizeChange(newSize) {
         this.queryInfo.pagesize = newSize
         this.getGoodsList()
      },
      // 监控页码改变
      handleCurrentChange(newPage) {
         this.queryInfo.pagenum = newPage
         this.getGoodsList()
      },

      // 转跳添加页
      goAddPage(){
         this.$router.push('/goods/add')
      },

      // 展示修改框
      showEditDialog() {
         this.editDialogVisable = true
      },
      // 修改商品信息
      editGoodsInfo() {
         this.editDialogVisable = false
      },
      // 监听编辑框关闭
      editDialogClosed() {},
      // 删除商品
      async remvoeGoodsById(id) {
         // 弹窗询问确定
         const confirmRes = await this.$confirm(
            '确定要永久删除该商品?',
            '警告',
            {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning',
            }
         ).catch((err) => err)
         // 确定confirm 取消cancal
         // 取消删除
         if (confirmRes !== 'confirm') return this.$message.info('已取消删除')

         // 确定删除
         const {data:res} = await this.$http.delete(`goods/${id}`)
         if(res.meta.status !==200){
            this.$message.error('删除商品失败')
            return
         }

         this.$message.success('删除商品成功')
         // 重新获取列表
         this.getGoodsList()
      },
   },
}
</script>

<style lang="less" scoped>
</style>