<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
         <!-- 头部提示区 -->
         <el-alert
            show-icon
            title="注意：只允许为第三级分类设置相关参数"
            type="warning"
         >
         </el-alert>
         <!-- 选择分类区 -->
         <el-row>
            <el-col>
               <span>选择商品分类：</span>
               <el-cascader
                  v-model="selectedCateKeys"
                  :options="catelist"
                  :props="{
                     expandTrigger: 'hover',
                     value: 'cat_id',
                     label: 'cat_name',
                     children: 'children',
                  }"
                  @change="handleChange()"
               >
               </el-cascader>
            </el-col>
         </el-row>

         <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!-- 动态参数面板 -->
            <el-tab-pane label="动态参数" name="many">
               <!-- 添加参数按钮 -->
               <el-button
                  type="primary"
                  size="mini"
                  :disabled="isBtnDisabled"
                  @click="showAddDialog"
                  >添加参数
               </el-button>
               <!-- 参数表 -->
               <el-table :data="manyTableData" border stripe>
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                     <template slot-scope="scope">
                        <!-- 渲染tag -->
                        <el-tag
                           v-for="(item, index) in scope.row.attr_vals"
                           :key="index"
                           closable
                           @close="handleClose(index, scope.row)"
                           >{{ item }}</el-tag
                        >
                        <!-- 添加tag -->
                        <el-input
                           class="input-new-tag"
                           v-if="scope.row.inputVisible"
                           v-model="scope.row.inputValue"
                           ref="saveTagInput"
                           size="small"
                           @keyup.enter.native="handleInputEnter(scope.row)"
                           @blur="handleInputBlur(scope.row)"
                        >
                        </el-input>
                        <el-button
                           v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)"
                           >+ New Tag</el-button
                        >
                     </template>
                  </el-table-column>
                  <!-- 索引 -->
                  <el-table-column type="index"></el-table-column>
                  <el-table-column
                     label="参数名称"
                     prop="attr_name"
                  ></el-table-column>
                  <el-table-column label="操作">
                     <template slot-scope="scope">
                        <el-button
                           type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row.attr_id)"
                           >编辑</el-button
                        >
                        <el-button
                           type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="removeParamsById(scope.row.attr_id)"
                           >删除</el-button
                        >
                     </template>
                  </el-table-column>
               </el-table>
            </el-tab-pane>

            <!-- 添加静态属性面板 -->
            <el-tab-pane label="静态属性" name="only">
               <!-- 添加属性 -->
               <el-button
                  type="primary"
                  size="mini"
                  :disabled="isBtnDisabled"
                  @click="showAddDialog"
                  >添加属性
               </el-button>
               <!-- 属性表 -->
               <el-table :data="onlyTableData" border stripe>
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                     <template slot-scope="scope">
                        <!-- 渲染tag -->
                        <el-tag
                           v-for="(item, index) in scope.row.attr_vals"
                           :key="index"
                           closable
                           @close="handleClose(index, scope.row)"
                           >{{ item }}</el-tag
                        >
                        <!-- 添加tag -->
                        <el-input
                           class="input-new-tag"
                           v-if="scope.row.inputVisible"
                           v-model="scope.row.inputValue"
                           ref="saveTagInput"
                           size="small"
                           @keyup.enter.native="handleInputEnter(scope.row)"
                           @blur="handleInputBlur(scope.row)"
                        >
                        </el-input>
                        <el-button
                           v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)"
                           >+ New Tag</el-button
                        >
                     </template>
                  </el-table-column>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column
                     label="属性名称"
                     prop="attr_name"
                  ></el-table-column>
                  <el-table-column label="操作">
                     <template slot-scope="scope">
                        <el-button
                           type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row.attr_id)"
                           >编辑</el-button
                        >
                        <el-button
                           type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="removeParamsById(scope.row.attr_id)"
                           >删除</el-button
                        >
                     </template>
                  </el-table-column>
               </el-table>
            </el-tab-pane>
         </el-tabs>
      </el-card>

      <!-- 添加属性/参数对话框 -->
      <el-dialog
         :title="`添加${getTitle}`"
         :visible.sync="addDialogVisable"
         width="50%"
         @close="addDialogClosed()"
      >
         <!-- 内容主题区 -->
         <!-- 表单区 -->
         <el-form
            :model="addForm"
            :rules="formRules"
            ref="addFormRef"
            label-width="90px"
         >
            <el-form-item :label="`${getTitle}名称`" prop="attr_name">
               <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
         </el-form>

         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="addParams()">确 定 </el-button>
         </span>
      </el-dialog>

      <!-- 修改属性对话框 -->
      <el-dialog
         :title="`修改${getTitle}`"
         :visible.sync="editDialogVisable"
         width="60%"
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
            <el-form-item :label="`修改${getTitle}`" prop="attr_name">
               <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editParams()">确 定 </el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   name: 'Params',
   data() {
      return {
         // 商品分类
         catelist: [],
         // 级联选择的id列表
         selectedCateKeys: [],
         // 被激活标签名
         activeName: 'many',
         //动态属性表
         manyTableData: [],
         // 静态属性表
         onlyTableData: [],
         // 添加对话框可见性
         addDialogVisable: false,
         // 添加表单
         addForm: {
            attr_name: '',
         },
         // 编辑对话框可见性
         editDialogVisable: false,
         // 编辑表单
         editForm: {},
         // 表单规则
         formRules: {
            attr_name: [
               { required: true, message: `请输入内容`, trigger: 'blur' },
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

         this.catelist = res.data
      },
      // 监控级联选择框变化 检测3级分类后发起请求
      handleChange() {
         if (this.selectedCateKeys.length !== 3) {
            this.$message.error('只允许为第三级分类设置相关参数')
            this.selectedCateKeys = []
            this.manyTableData = []
            this.onlyTableData = []
            return
         }

         // 发起请求
         this.getParamsData()
      },
      // 获取分类参数列表
      async getParamsData() {
         const params = { sel: this.activeName }
         const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
               params,
            }
         )
         if (res.meta.status !== 200) {
            return this.$message.error('获取参数列表失败')
         }
         res.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 添加tag状态
            item.inputVisible = false
            // 添加tag内容
            item.inputValue = ''
         })

         if (this.activeName === 'many') {
            this.manyTableData = res.data
         } else {
            this.onlyTableData = res.data
         }
      },

      // 监控标签点击事件
      handleTabClick() {
         if (this.selectedCateKeys.length !== 3)
            return this.$message.error('未选择分类')
         this.getParamsData()
      },

      // 添加框显示
      showAddDialog() {
         this.addDialogVisable = true
      },
      // 添加属性/参数
      addParams() {
         this.$refs.addFormRef.validate(async (valid) => {
            if (!valid) return

            const form = {
               attr_name: this.addForm.attr_name,
               attr_sel: this.activeName,
            }
            const { data: res } = await this.$http.post(
               `categories/${this.cateId}/attributes`,
               form
            )
            if (res.meta.status !== 201) {
               // console.log(res)
               return this.$message.error(`添加${this.getTitle}失败`)
            }
            this.$message.success(`添加${this.getTitle}成功`)
            this.addDialogVisable = false
            this.getParamsData()
         })
      },
      // 监听添加对话框关闭
      addDialogClosed() {
         this.$refs.addFormRef.resetFields()
      },
      // 编辑框显示
      async showEditDialog(attr_id) {
         const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes/${attr_id}`
         )
         if (res.meta.status !== 200) return this.$message.error('查询分类失败')

         this.editForm = res.data
         this.editDialogVisable = true
      },
      // 编辑参数
      editParams() {
         this.$refs.editFormRef.validate(async (valid) => {
            if (!valid) return
            const form = {
               attr_name: this.editForm.attr_name,
               attr_sel: this.editForm.attr_sel,
               attr_vals: this.editForm.attr_vals,
            }
            const { data: res } = await this.$http.put(
               `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
               form
            )
            if (res.meta.status !== 200) return this.$message.error('编辑失败')

            this.$message.success('编辑成功')
            // 隐藏对话框
            this.editDialogVisable = false
            // 重新获取列表
            this.getParamsData()
         })
      },
      // 监听编辑框关闭
      editDialogClosed() {
         this.$refs.editFormRef.resetFields()
      },

      // 根据id删除属性
      async removeParamsById(attr_id) {
         // 弹窗询问确定
         const confirmRes = await this.$confirm(
            '确定要永久删除该属性?',
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
         const { data: deleteRes } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attr_id}`
         )
         if (deleteRes.meta.status !== 200) {
            return this.$message.error('删除属性失败')
         }
         this.$message.success('删除属性成功')
         // 重新获取列表
         this.getParamsData()
      },
      // 添加tag失去焦点触发事件
      handleInputBlur(row) {
         row.inputVisible = false
         row.inputValue = ''
      },
      // 添加tag回车触发事件
      async handleInputEnter(row) {
         if (row.inputValue.trim().length === 0) {
            this.$message.error('请输入有效内容')
            row.inputValue = ''
            row.inputVisible = false
            return
         }

         row.attr_vals.push(row.inputValue)
         this.saveAttrVals(row).then((isSave) => {
            if (!isSave) {
               row.attr_vals.pop()
            }
         })

         row.inputValue = ''
         row.inputVisible = false
      },
      // 关闭tag触发事件
      handleClose(index, row) {
         const lastVal = row.attr_vals.splice(index, 1)

         this.saveAttrVals(row).then((isSave) => {
            if (!isSave) {
               row.attr_vals.splice(index, 0, ...lastVal)
            }
         })
      },
      // 保存tag 发送请求
      async saveAttrVals(row) {
         const form = {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' '),
         }

         const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${row.attr_id}`,
            form
         )
         if (res.meta.status !== 200) {
            console.log(res)
            this.$message.error('修改参数项失败')
            return false
         }

         this.$message.success('修改参数项成功')
         return true
      },
      // 添加tag状态切换
      showInput(row) {
         row.inputVisible = true
         this.$nextTick((_) => {
            this.$refs.saveTagInput.$refs.input.focus()
         })
      },
   },
   computed: {
      // 添加按键可用性
      isBtnDisabled() {
         return this.selectedCateKeys.length !== 3 ? true : false
      },
      // 商品类id
      cateId() {
         if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
         return null
      },
      // 对话框标题，属性/参数
      getTitle() {
         return this.activeName === 'many' ? '参数' : '属性'
      },
   },
}
</script>

<style lang="less" scoped>
.el-tag {
   margin: 5px;
}
.input-new-tag {
   width: 100px;
}
</style>