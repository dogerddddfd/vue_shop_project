<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区 -->
      <el-card>
         <!-- 题头提示条 -->
         <el-alert
            title="添加商品信息"
            show-icon
            type="info"
            center
            :closable="false"
         ></el-alert>
         <!-- 步骤条 -->
         <el-steps
            :space="200"
            :active="activeIndex - 0"
            finish-status="success"
            align-center
         >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
         </el-steps>
         <!-- 表单区 -->
         <el-form
            :model="addForm"
            :rules="formRules"
            ref="addFormRef"
            label-position="top"
         >
            <!-- 导航 -->
            <el-tabs
               v-model="activeIndex"
               tab-position="left"
               :before-leave="beforeTabLeave"
               @tab-click="tabClicked()"
            >
               <!-- 基本消息 -->
               <el-tab-pane label="基本信息" name="0">
                  <el-form-item label="商品分类" prop="goods_cat">
                     <el-cascader
                        v-model="addForm.goods_cat"
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
                  </el-form-item>

                  <el-form-item label="商品名称" prop="goods_name">
                     <el-input v-model="addForm.goods_name"></el-input>
                  </el-form-item>
                  <el-form-item label="商品价格" prop="goods_price">
                     <el-input v-model.number="addForm.goods_price"></el-input>
                  </el-form-item>
                  <el-form-item label="商品重量" prop="goods_weight">
                     <el-input v-model.number="addForm.goods_weight"></el-input>
                  </el-form-item>
                  <el-form-item label="商品数量" prop="goods_number">
                     <el-input v-model.number="addForm.goods_number"></el-input>
                  </el-form-item>
               </el-tab-pane>

               <!-- 商品参数 -->
               <el-tab-pane label="商品参数" name="1">
                  <el-form-item
                     v-for="item in manyTableData"
                     :key="item.attr_id"
                     :label="item.attr_name"
                  >
                     <!-- 复选框组 -->
                     <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox
                           v-for="(cb, i) in item.attr_vals"
                           :key="i"
                           :label="cb"
                           border
                        ></el-checkbox>
                     </el-checkbox-group>
                  </el-form-item>
               </el-tab-pane>

               <!-- 商品属性 -->
               <el-tab-pane label="商品属性" name="2">
                  <el-form-item
                     v-for="item in onlyTableData"
                     :key="item.attr_id"
                     :label="item.attr_name"
                  >
                     <el-input
                        v-model="item.attr_vals"
                     ></el-input> </el-form-item
               ></el-tab-pane>
               <!-- 商品图片 -->
               <el-tab-pane label="商品图片" name="3">
                  <el-upload
                     action="http://127.0.0.1:8888/api/private/v1/upload"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     list-type="picture"
                     :headers="headerObj"
                     :on-success="handleSuccess"
                  >
                     <el-button size="small" type="primary">点击上传</el-button>
                     <div slot="tip" class="el-upload__tip">
                        只能上传jpg/png文件，且不超过500kb
                     </div>
                  </el-upload>
               </el-tab-pane>
               <!-- 商品内容 -->
               <el-tab-pane label="商品内容" name="4">
                  <!-- 富文本编辑器 -->
                  <quill-editor
                     v-model="addForm.goods_introduce"
                  ></quill-editor>
                  <!-- 确定添加 -->
                  <el-button
                     type="primary"
                     style="margin-top: 15px"
                     @click="addGoods()"
                     >添加商品</el-button
                  >
               </el-tab-pane>
            </el-tabs>
         </el-form>
      </el-card>

      <!-- 图片预览框 -->
      <el-dialog
         title="图片预览"
         :visible.sync="previewdialogVisible"
         width="50%"
         :before-close="handlePreviewDialogClose"
      >
         <img :src="previewPath" alt="" class="previewImg" />
      </el-dialog>
   </div>
</template>

<script>
import _ from 'lodash'
export default {
   data() {
      return {
         // 活动表情索引
         activeIndex: 0,
         // 分类列表
         catelist: [],

         // 添加表单
         addForm: {
            goods_name: '',
            goods_price: '',
            goods_weight: '',
            goods_name: '',
            goods_number: '',
            goods_cat: [],
            pics: [],
            goods_introduce: '',
            attrs:[],
         },
         // 分类参数数据
         manyTableData: [],
         // 分类属性数据
         onlyTableData: [],
         // 请求头 上传图片用
         headerObj: {
            Authorization: window.sessionStorage.getItem('token'),
         },
         // 预览图片路径
         previewPath: '',
         // 预览框可见性
         previewdialogVisible: false,

         // 表单规则
         formRules: {
            goods_name: [
               { required: true, message: '请输入商品名称', trigger: 'blur' },
            ],
            goods_price: [
               { required: true, message: '请输入商品价格', trigger: 'blur' },
               { type: 'number', message: '必须为数字值'}
            ],
            goods_weight: [
               { required: true, message: '请输入商品重量', trigger: 'blur' },
               { type: 'number', message: '必须为数字值'}
            ],
            goods_number: [
               { required: true, message: '请输入商品数量', trigger: 'blur' },
               { type: 'number', message: '必须为数字值'}
            ],
            goods_cat: [
               { required: true, message: '请选择商品分类', trigger: 'blur' },
            ],
         },
      }
   },
   created() {
      this.getCateList()
   },
   methods: {
      // 获取分类列表
      async getCateList() {
         const { data: res } = await this.$http.get(`categories`, {
            params: this.queryInfo,
         })
         if (res.meta.status !== 200)
            return this.$message.error('获取商品分类失败！')

         this.catelist = res.data
      },
      // 监听级联选择框变化 检测3级分类
      handleChange() {
         if (this.addForm.goods_cat.length !== 3) {
            this.$message.error('只允许选择三级分类')
            this.selectedCateKeys = []
            return
         }
      },
      // 监听标签页改变
      beforeTabLeave(activeName, oldActiveName) {
         if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
            this.$message.error('请选择商品分类！')
            return false
         }
      },
      // 监听标签点击
      async tabClicked() {
         // 访问参数面板
         if (this.activeIndex === '1') {
            const { data: res } = await this.$http.get(
               `categories/${this.cateId}/attributes`,
               {
                  params: { sel: 'many' },
               }
            )

            if (res.meta.status !== 200) {
               this.$message.error('获取参数失败！')
               return
            }
            res.data.forEach((item) => {
               item.attr_vals =
                  item.attr_vals.length === 0
                     ? []
                     : (item.attr_vals = item.attr_vals.split(' '))
            })
            this.manyTableData = res.data
         }
         // 访问属性面板
         if (this.activeIndex === '2') {
            const { data: res } = await this.$http.get(
               `categories/${this.cateId}/attributes`,
               {
                  params: { sel: 'only' },
               }
            )

            if (res.meta.status !== 200) {
               this.$message.error('获取属性失败！')
               return
            }

            this.onlyTableData = res.data
         }
      },
      // 处理图片预览
      handlePreview(file) {
         this.previewPath = file.response.data.url
         this.previewdialogVisible = true
      },
      // 处理图片移除
      handleRemove(file) {
         const filepath = file.response.data.tmp_path
         const i = this.addForm.pics.findIndex((x) => {
            x.pic === filepath
         })
         this.addForm.pics.splice(i, 1)
         console.log(this.addForm.pics)
      },
      // 上传图片成功
      handleSuccess(response) {
         const picInfo = { pic: response.data.tmp_path }
         this.addForm.pics.push(picInfo)
      },
      // 监听预览框关闭
      handlePreviewDialogClose() {
         this.previewdialogVisible = false
      },
      // 添加商品
      addGoods() {
         this.$refs.addFormRef.validate(async (valid) => {
            if (!valid) {
               this.$message.error('请填写必要的表单项')
               return
            }
            // 添加
            const form = _.cloneDeep(this.addForm) //深拷贝
            form.goods_cat = form.goods_cat.join(',')
            // 动态参数
            this.manyTableData.forEach((item) => {
               const newInfo = {
                  attr_id: item.attr_id,
                  attr_value: item.attr_vals.join(' '),
               }
               this.addForm.attrs.push(newInfo)
            })
            // 静态属性
            this.onlyTableData.forEach((item) => {
               const newInfo = {
                  attr_id: item.attr_id,
                  attr_value: item.attr_vals,
               }
               this.addForm.attrs.push(newInfo)
               
            })
            form.attrs = this.addForm.attrs

            // 发起请求
            const {data:res} = await this.$http.post('goods',form)
            if(res.meta.status !== 201){
               this.$message.error(`添加失败,${res.meta.msg}`)
               return
            }
            this.$message.success('添加成功')
            this.$router.push('/goods')
         })
      },
   },
   computed: {
      // 分类id
      cateId() {
         if (this.addForm.goods_cat.length === 3) {
            return this.addForm.goods_cat[2]
         }
         return null
      },
   },
}
</script>


<style lang="less" scoped>
.el-checkbox {
   margin: 0 5px 0 0 !important;
}
.previewImg {
   width: 100%;
}
</style>