<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>权限管理</el-breadcrumb-item>
         <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片 -->
      <el-card>
         <!-- 添加 -->
         <el-col :span="1" gutter:20 style="margin-bottom: 10px">
            <el-button type="primary" @click="addDialogVisable = true"
               >添加角色</el-button
            >
         </el-col>
         <!-- 角色列表 -->
         <el-table border stripe :data="roleList">
            <!-- 展开列 -->
            <el-table-column type="expand">
               <template slot-scope="scope">
                  <el-row
                     v-for="(item1, i1) in scope.row.children"
                     :key="item1.id"
                  >
                     <!-- 一级权限 -->
                     <el-col :span="5">
                        <el-tag
                           closable
                           @close="remveRightByid(scope.row, item1.id)"
                           >{{ item1.authName }}</el-tag
                        >
                        <i class="el-icon-caret-right"></i>
                     </el-col>
                     <!-- 二三级权限 -->
                     <el-col :span="19">
                        <el-row
                           v-for="(item2, i2) in item1.children"
                           :key="item2.id"
                           :class="['no-bdtop-bot']"
                        >
                           <el-col :span="6">
                              <el-tag
                                 type="success"
                                 closable
                                 @close="remveRightByid(scope.row, item2.id)"
                                 >{{ item2.authName }}</el-tag
                              >
                              <i class="el-icon-caret-right"></i>
                           </el-col>
                           <el-col :span="18">
                              <el-tag
                                 v-for="(item3, i3) in item2.children"
                                 :key="item3.id"
                                 type="warning"
                                 closable
                                 @close="remveRightByid(scope.row, item3.id)"
                                 >{{ item3.authName }}</el-tag
                              >
                           </el-col>
                        </el-row>
                     </el-col>
                  </el-row>
               </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px" prop="level">
               <template slot-scope="scope">
                  <!-- 修改 -->
                  <el-button
                     type="primary"
                     size="mini"
                     icon="el-icon-edit"
                     @click="showEditDialog(scope.row.id)"
                     >编辑</el-button
                  >

                  <!-- 删除 -->
                  <el-button
                     type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click="remvoeRoleById(scope.row.id)"
                     >删除</el-button
                  >

                  <!-- 分配角色 -->

                  <el-button
                     type="warning"
                     size="mini"
                     icon="el-icon-setting"
                     @click="showSetRightDialog(scope.row)"
                     >分配权限</el-button
                  >
               </template>
            </el-table-column>
         </el-table>
      </el-card>

      <!-- 添加角色对话框 -->
      <el-dialog
         title="添加角色"
         :visible.sync="addDialogVisable"
         width="50%"
         @close="addDialogClosed"
      >
         <!-- 内容主题区 -->
         <!-- 表单区 -->
         <el-form
            :model="addForm"
            :rules="formRules"
            ref="addFormRef"
            label-width="80px"
         >
            <el-form-item label="角色名称" prop="roleName">
               <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
               <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定 </el-button>
         </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
         title="修改数据"
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
            <el-form-item label="角色名称" prop="roleName">
               <el-input v-model="editForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
               <el-input v-model="editForm.roleDesc"></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editRoleInfo()">确 定 </el-button>
         </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
         title="分配权限"
         :visible.sync="setRightDialogVisable"
         width="50%"
         @close="SetRightDialogClosed()"
      >
         <!-- 内容主题区 -->
         <!-- 树形控件 -->
         <el-tree
            :data="rightList"
            :props="treeProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defKeys"
            ref="treeRef"
         >
         </el-tree>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="allotRights()"
               >确 定
            </el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   data() {
      return {
         roleList: [],
         // 添加角色框可见性
         addDialogVisable: false,
         // 添加角色表单
         addForm: {
            roleName: '',
            roleDesc: '',
         },

         // 角色id 编辑用
         roleId:'',
         // 树形控件属性绑定对象
         treeProps: {
            label: 'authName',
            children: 'children',
         },
         // 默认选中节点Id值
         defKeys: [],
         // 编辑角色框可见性
         editDialogVisable: false,
         // 编辑表单
         editForm: {},
         

         // 分配权限框可见性
         setRightDialogVisable: false,
         rightList: [],

         // 表单规则
         formRules: {
            roleName: [
               {
                  required: true,
                  message: '请输入角色名称',
                  trigger: 'blur',
               },
            ],
            roleDesc: [
               {
                  required: true,
                  message: '请输入角色描述',
                  trigger: 'blur',
               },
            ],
         },
      }
   },
   created() {
      this.getRoleList()
   },
   methods: {
      // 获取角色列表
      async getRoleList() {
         const { data: res } = await this.$http.get('roles')
         if (res.meta.status !== 200)
            return this.$message.error('获取角色列表失败')

         this.roleList = res.data
      },
      // 添加角色
      addRole() {
         this.$refs.addFormRef.validate(async (valid) => {
            if (!valid) return
            // 发起请求
            const { data: res } = await this.$http.post('roles', this.addForm)
            if (res.meta.status !== 201)
               return this.$message.error('添加角色失败')
            this.$message.success('添加角色成功')
            // 隐藏对话框
            this.addDialogVisable = false
            // 重新获取列表
            this.getRoleList()
         })
      },
      // 监听添加框关闭
      addDialogClosed() {
         this.$refs.addFormRef.resetFields()
      },

      // 展示编辑角色框
      async showEditDialog(id) {
         const { data: res } = await this.$http.get('roles/' + id)
         if (res.meta.status !== 200)
            return this.$message.error('查询角色数据失败')
         // console.log(res)
         this.editForm = res.data
         this.editDialogVisable = true
      },
      // 编辑角色
      editRoleInfo() {
         this.$refs.editFormRef.validate(async (valid) => {
            if (!valid) return
            // 发起请求
            const form = {
               roleName: this.editForm.roleName,
               roleDesc: this.editForm.roleDesc,
            }
            const { data: res } = await this.$http.put(
               'roles/' + this.editForm.roleId,
               form
            )
            if (res.meta.status !== 200) {
               this.$message.error('更新角色信息失败')
               // console.log(res)
               return
            }
            this.$message.success('更新角色信息成功')
            // 隐藏对话框
            this.editDialogVisable = false
            // 重新获取列表
            this.getRoleList()
         })
      },
      // 监听编辑框关闭
      editDialogClosed() {
         this.$refs.editFormRef.resetFields()
      },

      // 根据id删除角色
      async remvoeRoleById(id) {
         // 弹窗询问确定
         const confirmRes = await this.$confirm(
            '确定要永久删除该角色?',
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
         const { data: deleteRes } = await this.$http.delete('roles/' + id)
         if (deleteRes.meta.status !== 200) {
            return this.$message.error('删除用户失败')
         }
         this.$message.success('删除用户成功')
         // 重新获取列表
         this.getRoleList()
      },

      // 展示分配权限框
      async showSetRightDialog(role) {
         this.roleId = role.id
         const { data: res } = await this.$http.get('rights/tree')
         if (res.meta.status !== 200)
            return this.$message.error('获取权限列表失败')

         this.rightList = res.data

         this.getLeafKeys(role, this.defKeys)

         this.setRightDialogVisable = true
      },
      // 获取角色所有三级权限id
      getLeafKeys(node, arr) {
         if (!node.children) {
            return arr.push(node.id)
         }
         node.children.forEach((item) => {
            this.getLeafKeys(item, arr)
         })
      },
      // 分配权限
      async allotRights(){
         const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
         ]
         const idStr= keys.join(',')

         const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})

         if(res.meta.status !== 200)return this.$message.error("分配权限失败")

         this.$message.success('分配权限成功')
         this.getRoleList()
         this.setRightDialogVisable=false

      },
      // 监听分配权限关闭
      SetRightDialogClosed() {
         this.defKeys=[]
      },

      // 删除权限
      async remveRightByid(role, rightId) {
         const confirmRes = await this.$confirm('确定要移除该权限?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
         }).catch((err) => err)
         // 取消删除
         if (confirmRes !== 'confirm') return this.$message.info('已取消移除')

         // 确定删除
         const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
         )
         if (res.meta.status !== 200) {
            return this.$message.error('移除权限失败')
         }
         this.$message.success('移除权限成功')
         // 重新获取列表
         role.children = res.data
      },
   },
}
</script>

<style lang="less" scoped>
.el-tag {
   margin: 7px;
}

.el-row {
   border-bottom: 1px solid #eee;
   display: flex;
   align-items: center;
}
.el-row:first-child {
   border-top: 1px solid #eee;
}
.no-bdtop-bot {
   border-top: none !important;
}
.no-bdtop-bot:last-child {
   border-bottom: none !important;
}
</style>