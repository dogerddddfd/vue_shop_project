<template>
   <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>活动管理</el-breadcrumb-item>
         <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card class="box-card">
         <!-- 添加与搜索区域 -->
         <el-row gutter:20>
            <!-- 搜索 -->
            <el-col :span="8">
               <el-input
                  placeholder="请输入内容"
                  clearable
                  v-model="queryInfo.query"
                  @clear="getUserList"
               >
                  <el-button
                     slot="append"
                     icon="el-icon-search"
                     @click="getUserList"
                  ></el-button>
               </el-input>
            </el-col>

            <!-- 添加 -->
            <el-col :span="4">
               <el-button
                  type="primary"
                  @click="addDialogVisable = true"
                  style="margin-left: 30px"
                  >添加用户</el-button
               >
            </el-col>
         </el-row>

         <!-- 用户列表区域 -->
         <template>
            <el-table border stripe :data="userList">
               <el-table-column type="index"> </el-table-column>
               <el-table-column prop="username" label="姓名"> </el-table-column>
               <el-table-column prop="email" label="邮箱"> </el-table-column>
               <el-table-column prop="mobile" label="电话"> </el-table-column>
               <el-table-column prop="role_name" label="角色">
               </el-table-column>
               <!-- 用户状态 -->
               <el-table-column prop="mg_state" label="状态">
                  <template slot-scope="scope">
                     <el-switch
                        v-model="scope.row.mg_state"
                        @change="userStateChanged(scope.row)"
                     >
                     </el-switch>
                  </template>
               </el-table-column>

               <!-- 操作 -->
               <el-table-column label="操作" width="180px">
                  <template slot-scope="scope">
                     <!-- 修改 -->
                     <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="showEditDialog(scope.row.id)"
                     ></el-button>

                     <!-- 删除 -->
                     <el-button
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="remvoeUserById(scope.row.id)"
                     ></el-button>

                     <!-- 分配角色 -->
                     <el-tooltip
                        effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false"
                     >
                        <el-button
                           type="warning"
                           size="mini"
                           icon="el-icon-setting"
                           @click="showAllotRoleDialog(scope.row)"
                        ></el-button>
                     </el-tooltip>
                  </template>
               </el-table-column>
            </el-table>
         </template>

         <!-- 分页区域 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 3, 4, 5]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
         >
         </el-pagination>
      </el-card>

      <!-- 添加用户对话框 -->
      <el-dialog
         title="添加用户"
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
            label-width="70px"
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
            <el-form-item label="电话" prop="mobile">
               <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定 </el-button>
         </span>
      </el-dialog>

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
            <el-form-item label="用户名" prop="username">
               <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
               <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
               <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
         </el-form>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定 </el-button>
         </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
         title="分配权限"
         :visible.sync="allotRoleDialogVisable"
         width="50%"
         @close="allotRoleDialogClosed()"
      >
         <!-- 内容主体区 -->
         <p>当前用户：{{ userInfo.username }}</p>
         <p>当前角色：{{ userInfo.roleName }}</p>
         <p>
            分配新角色
            <el-select v-model="selectRoleId" placeholder="请选择">
               <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
               >
               </el-option>
            </el-select>
         </p>
         <!-- 按钮区 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="allotRoleDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="allotRole()">确 定 </el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   name: 'Users',
   data() {
      // 邮箱校验
      var checkEmail = (rule, value, callback) => {
         const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
         if (reg.test(value)) return callback()

         callback(new Error('请输入合法的邮箱'))
      }
      // 电话校验
      var checkMobile = (rule, value, callback) => {
         const reg = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
         if (reg.test(value)) return callback()

         callback(new Error('请输入正确的电话'))
      }

      return {
         // 获取用户列表参数对象
         queryInfo: {
            query: '',
            // 当前页数
            pagenum: 1,
            // 每页多少条
            pagesize: 2,
         },
         userList: [],
         total: 0,
         // 添加用户对话框可见性
         addDialogVisable: false,
         // 添加用户表单
         addForm: {
            username: '',
            password: '',
            email: '',
            mobile: '',
         },

         // 修改用户对话框可见性
         editDialogVisable: false,
         // 修改用户表单
         editForm: {},
         // 用户信息
         userInfo: '',
         // 角色列表
         rolesList: [],
         // 选中新角色id
         selectRoleId: '',
         //  分配权限对话框可见性
         allotRoleDialogVisable: false,
         // 用户表单规则
         formRules: {
            username: [
               {
                  required: true,
                  message: '请输入用户名',
                  trigger: 'blur',
               },
               {
                  min: 3,
                  max: 10,
                  message: '长度在 3 到 10 个字符',
                  trigger: 'blur',
               },
            ],
            password: [
               {
                  required: true,
                  message: '请输入密码',
                  trigger: 'blur',
               },
               {
                  min: 6,
                  max: 15,
                  message: '长度在 6 到 15 个字符',
                  trigger: 'blur',
               },
            ],
            email: [
               {
                  required: true,
                  message: '请输入邮箱',
                  trigger: 'blur',
               },
               { validator: checkEmail, trigger: 'blur' },
            ],
            mobile: [
               {
                  required: true,
                  message: '请输入电话',
                  trigger: 'blur',
               },
               { validator: checkMobile, trigger: 'blur' },
            ],
         },
      }
   },
   created() {
      this.getUserList()
   },
   methods: {
      // 获取用户列表
      async getUserList() {
         const { data: res } = await this.$http.get('users', {
            params: this.queryInfo,
         })
         if (res.meta.status !== 200)
            return this.$message.error('获取用户列表失败')
         this.userList = res.data.users
         this.total = res.data.total
         // console.log(res)
      },
      // 监听用户状态改变
      async userStateChanged(userInfo) {
         const { data: res } = await this.$http.put(
            `users/${userInfo.id}/state/${userInfo.mg_state}`
         )
         if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error('更新用户状态失败')
         }
         return this.$message.success('更新用户状态成功')
      },
      // 监听pagesize改变
      handleSizeChange(newSize) {
         this.queryInfo.pagesize = newSize
         this.getUserList()
      },
      // 监听页码改变
      handleCurrentChange(newPage) {
         this.queryInfo.pagenum = newPage
         this.getUserList()
      },
      // 监听添加框关闭
      addDialogClosed() {
         this.$refs.addFormRef.resetFields()
      },
      // 添加用户
      addUser() {
         this.$refs.addFormRef.validate(async (valid) => {
            if (!valid) return
            // 发起请求
            const { data: res } = await this.$http.post('users', this.addForm)
            if (res.meta.status !== 201)
               return this.$message.error('添加用户失败')
            this.$message.success('添加用户成功')
            // 隐藏对话框
            this.addDialogVisable = false
            // 重新获取列表
            this.getUserList()
         })
      },
      // 展示 编辑用户数据 的对话框
      async showEditDialog(id) {
         const { data: res } = await this.$http.get('users/' + id)
         if (res.meta.status !== 200)
            return this.$message.error('查询用户数据失败')
         this.editForm = res.data
         this.editDialogVisable = true
      },
      // 修改用户数据
      editUserInfo() {
         this.$refs.editFormRef.validate(async (valid) => {
            if (!valid) return
            // 发起请求
            const form = {
               email: this.editForm.email,
               mobile: this.editForm.mobile,
            }
            const { data: res } = await this.$http.put(
               'users/' + this.editForm.id,
               form
            )
            if (res.meta.status !== 200)
               return this.$message.error('更新用户信息失败')
            this.$message.success('更新用户信息成功')
            // 隐藏对话框
            this.editDialogVisable = false
            // 重新获取列表
            this.getUserList()
         })
      },
      // 监听编辑用户框关闭
      editDialogClosed() {
         this.$refs.editFormRef.resetFields()
      },

      // 分配角色对话框显示
      async showAllotRoleDialog(user) {
         this.userInfo = {
            id: user.id,
            username: user.username,
            roleName: user.role_name,
         }

         const { data: res } = await this.$http.get('roles')
         if (res.meta.status !== 200)
            return this.$message.error('获取角色列表失败')

         this.rolesList = res.data

         this.allotRoleDialogVisable = true
      },
      async allotRole() {
         if (!this.selectRoleId)
            return this.$message.error('请选择要分配的角色！')
         const {
            data: res,
         } = await this.$http.put(`users/${this.userInfo.id}/role`, {
            rid: this.selectRoleId,
         })
         if (res.meta.status !== 200)
            return this.$message.error('更新角色失败！')

         this.$message.success('更新角色成功！')

         this.getUserList()

         this.allotRoleDialogVisable = false
      },
      // 监测分配角色框关闭
      allotRoleDialogClosed() {
         this.selectRoleId = ''
         this.userInfo = {}
         this.rolesList = []
      },

      // 根据id删除用户
      async remvoeUserById(id) {
         // 弹窗询问确定
         const confirmRes = await this.$confirm(
            '确定要永久删除该用户?',
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
         const { data: deleteRes } = await this.$http.delete('users/' + id)
         if (deleteRes.meta.status !== 200) {
            return this.$message.error('删除用户失败')
         }
         this.$message.success('删除用户成功')
         // 重新获取列表
         this.getUserList()
      },
   },
}
</script>





<style lang="less" scoped>
p {
   text-align: left;
}
</style>
