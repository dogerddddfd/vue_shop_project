<template>
   <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
         <div @click="toHeader()" style="cursor: pointer;">
            <img src="../assets/logo.png" alt="logo" style="height: 60px"  />
            <span>电商后台管理系统</span>
         </div>
         <el-button type="info" @click="logout">退出登录</el-button>
      </el-header>
      <!-- 主体 -->
      <el-container>
         <!-- 侧边 -->

         <el-aside :width="isCollapse ? '64px' : '200px'">
            <!-- 最小化侧边键 -->
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 菜单 -->
            <el-menu
               background-color="#333744"
               text-color="#fff"
               active-text-color="#409eff"
               unique-opened
               :collapse="isCollapse"
               :collapse-transition="false"
               router
               :default-active="activePath"
            >
               <!-- 一级菜单 -->
               <el-submenu
                  :index="item.id + ''"
                  v-for="item in menulist"
                  :key="item.id"
               >
                  <!-- 一级菜单模板 -->
                  <template slot="title">
                     <!-- 图标 -->
                     <i
                        :class="iconsObj[item.id]"
                        style="margin-right: 10px"
                     ></i>
                     <!-- 文本 -->
                     <span>{{ item.authName }}</span>
                  </template>

                  <!-- 二级菜单 -->
                  <el-menu-item
                     :index="'/' + subItem.path + ''"
                     v-for="subItem in item.children"
                     :key="subItem.id"
                     @click="saveNavState('/' + subItem.path)"
                  >
                     <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu" style="margin-right: 10px"></i>
                        <!-- 文本 -->
                        <span>{{ subItem.authName }}</span>
                     </template>
                  </el-menu-item>
               </el-submenu>
            </el-menu>
         </el-aside>
         <!-- 内容主题 -->
         <el-main>
            <router-view></router-view>
         </el-main>
      </el-container>
   </el-container>
</template>

<script>
export default {
   name: 'Home',
   data() {
      return {
         menulist: [],
         iconsObj: {
            125: 'el-icon-user-solid',
            103: 'el-icon-key',
            101: 'el-icon-s-goods',
            102: 'el-icon-tickets',
            145: 'el-icon-data-line',
         },
         // 是否折叠
         isCollapse: false,
         // 激活导航
         activePath: '',
      }
   },
   created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
   },
   methods: {
      // 登出
      logout() {
         window.sessionStorage.clear()
         this.$router.push('/login')
      },
      // 点击标题
      toHeader() {
         this.$router.push('/welcome')
      },
      // 更新菜单
      async getMenuList() {
         const { data: res } = await this.$http.get('menus')
         // console.log(res)
         if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
         this.menulist = res.data
      },
      // 菜单折叠
      toggleCollapse() {
         this.isCollapse = !this.isCollapse
      },
      // 保存导航激活状态
      saveNavState(activePath) {
         window.sessionStorage.setItem('activePath', activePath)
         this.activePath = activePath
      },
   },
}
</script>



<style lang="less" scoped>
.home-container {
   height: 100%;
}
.el-header {
   background-color: #373d41;
   display: flex;
   justify-content: space-between;
   padding-left: 0;
   align-items: center;

   color: #fff;
   font-size: 20px;
   > div {
      display: flex;
      align-items: center;
      > span {
         margin-left: 15px;
      }
   }
}

.el-aside {
   background-color: #333744;
   .el-menu {
      border: none;
      .el-menu-item {
         padding-left: 50px !important;
      }
      .el-submenu :deep(.el-submenu__title)  {
         padding-left: 0 !important;
         padding-right: 30px !important;
      }
   }
}

.el-main {
   background-color: #eaedf1;
}

.toggle-button {
   background-color: #4a5064;
   font-size: 10px;
   line-height: 24px;
   color: #fff;
   text-align: center;
   letter-spacing: 0.2em;
   user-select: none;
   cursor: pointer;
}
</style>>

