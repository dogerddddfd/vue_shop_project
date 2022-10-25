<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片区 -->
      <el-card>
         <!-- 添加分类 -->
         <el-col :span="1" gutter:20 style="margin-bottom: 10px">
            <el-button type="primary" @click="showAddDialog()">
               添加分类
            </el-button>
         </el-col>

         <!-- 表格 -->
         <tree-table
            :data="catelist"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            index-text="#"
            border
            :show-row-hover="false"
         >
            <!-- 是否有效 -->
            <template slot="isok" slot-scope="scope">
               <i
                  class="el-icon-success"
                  v-if="scope.row.cat_deleted === false"
                  style="color: green"
               ></i>
               <i class="el-icon-error" v-else style="color: red"></i>
            </template>

            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
               <el-tag mini v-if="scope.row.cat_level === 0">一级</el-tag>
               <el-tag mini type="success" v-else-if="scope.row.cat_level === 1"
                  >二级</el-tag
               >
               <el-tag mini type="warning" v-else>三级</el-tag>
            </template>

            <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
               <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.cat_id)"
                  >编辑</el-button
               >
               <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)"
                  >删除</el-button
               >
            </template>
         </tree-table>

         <!-- 分页 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
         >
         </el-pagination>
      </el-card>

      <!-- 添加分类对话框 -->
      <el-dialog
         title="添加分类"
         :visible.sync="addDialogVisable"
         width="50%"
         @close="addDialogClosed"
      >
         <!-- 内容主体区 -->
         <!-- 表单区 -->
         <el-form
            :model="addForm"
            :rules="formRules"
            ref="addFormRef"
            label-width="90px"
         >
            <el-form-item label="分类名称" prop="cat_name">
               <el-input v-model="addForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
               <el-cascader
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="{
                     expandTrigger: 'hover',
                     value: 'cat_id',
                     label: 'cat_name',
                     children: 'children',
                     checkStrictly: true,
                  }"
                  @change="parentCaeChanged()"
                  clearable
                  size="medium"
               ></el-cascader
            ></el-form-item>
         </el-form>

         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定 </el-button>
         </span>
      </el-dialog>

      <!-- 修改分类对话框 -->
      <el-dialog
         title="修改分类"
         :visible.sync="editDialogVisable"
         width="30%"
         @close="editDialogClosed"
      >
         <!-- 内容主体区 -->
         <!-- 表单区 -->
         <el-form
            :model="editForm"
            :rules="formRules"
            ref="editFormRef"
            label-width="80px"
         >
            <el-form-item label="分类名称" prop="cat_name">
               <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editInfo()">确 定 </el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   name: 'Cate',
   data() {
      return {
         // 查询条件
         queryInfo: {
            tpye: 3,
            pagenum: 1,
            pagesize: 5,
         },
         // 商品分类
         catelist: [],
         total: 0,
         columns: [
            { label: '分类名称', prop: 'cat_name' },
            { label: '是否有效', type: 'template', template: 'isok' },
            { label: '排序', type: 'template', template: 'order' },
            { label: '操作', type: 'template', template: 'opt' },
         ],
         // 添加对话框可见性
         addDialogVisable: false,
         // 父级分类列表
         parentCateList: [],
         // 已选择父级分类id数组
         selectedKeys: [],
         // 添加表单
         addForm: {
            cat_name: '',
            // 父分类
            cat_pid: 0,
            // 分类等级
            cat_level: 0,
         },
         // 修改框可见性
         editDialogVisable: false,
         // 修改表单
         editForm: {},

         // 表单规则
         formRules: {
            cat_name: [
               { required: true, message: '请输入分类名称', trigger: 'blur' },
            ],
         },
      }
   },
   created() {
      this.getCateList()
   },
   methods: {
      // 获取商品分类表
      async getCateList() {
         const { data: res } = await this.$http.get(`categories`, {
            params: this.queryInfo,
         })
         if (res.meta.status !== 200)
            return this.$message.error('获取商品分类失败！')
            
         this.catelist = res.data.result
         this.total = res.data.total
      },
      // 监听pagesize改变
      handleSizeChange(newSize) {
         this.queryInfo.pagesize = newSize
         this.getCateList()
      },
      // 监听页码改变
      handleCurrentChange(newPage) {
         this.queryInfo.pagenum = newPage
         this.getCateList()
      },
      // 展示添加对话框
      showAddDialog() {
         this.getParentCateList()
         this.addDialogVisable = true
      },
      // 获取父级分类列表
      async getParentCateList() {
         const { data: res } = await this.$http.get('categories', {
            params: { type: 2 },
         })
         if (res.meta.status !== 200)
            return this.$message.error('获取父级分类失败')

         this.parentCateList = res.data
      },
      // 检测父级分类变化
      parentCaeChanged() {
         if (this.selectedKeys.length > 0) {
            // 父级分类id 取selectedkeys最后一项
            this.addForm.cat_pid = this.selectedKeys[
               this.selectedKeys.length - 1
            ]
            this.addForm.cat_level = this.selectedKeys.length
            return
         } else {
            this.addForm.cat_pid = 0
            this.addForm.cat_level = 0
         }
      },
      // 添加分类
      addCate() {
         this.$refs.addFormRef.validate(async (valid) => {
            if (!valid) return
            // 发起请求
            const { data: res } = await this.$http.post(
               'categories',
               this.addForm
            )
            if (res.meta.status !== 201)
               return this.$message.error('添加分类失败')
            this.$message.success('添加分类成功')
            // 隐藏对话框
            this.addDialogVisable = false
            // 重新获取列表
            this.getCateList()
         })
      },
      // 监控添加框关闭
      addDialogClosed() {
         this.$refs.addFormRef.resetFields()
         this.selectedKeys = []
         this.addForm.cat_level = 0
         this.addForm.cat_pid = 0
      },

      // 展示修改框
      async showEditDialog(id) {
         const { data: res } = await this.$http.get('categories/' + id)
         if (res.meta.status !== 200) return this.$message.error('查询分类失败')

         this.editForm = res.data
         this.editDialogVisable = true
      },
      // 编辑
      editInfo() {
         this.$refs.editFormRef.validate(async (valid) => {
            if (!valid) return
            // 发起请求
            const form = {
               cat_name: this.editForm.cat_name,
            }
            const { data: res } = await this.$http.put(
               'categories/' + this.editForm.cat_id,
               form
            )
            if (res.meta.status !== 200)
               return this.$message.error('编辑分类失败')

            this.$message.success('编辑分类成功')
            // 隐藏对话框
            this.editDialogVisable = false
            // 重新获取列表
            this.getCateList()
         })
      },
      // 监听编辑框关闭
      editDialogClosed() {
         this.$refs.editFormRef.resetFields()
      },
      // 根据id删除角色
      async removeCateById(id) {
         // 弹窗询问确定
         const confirmRes = await this.$confirm(
            '确定要永久删除该分类?',
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
         const { data: deleteRes } = await this.$http.delete('categories/' + id)
         if (deleteRes.meta.status !== 200) {
            return this.$message.error('删除用户失败')
         }
         this.$message.success('删除用户成功')
         // 重新获取列表
         this.getCateList()
      },
   },
}
</script>

<style  lang="less" scoped>
.el-cascader {
   width: 100%;
}
</style>

<style lang="less">
.el-cascader-panel {
   height: 350px !important;
}
</style>