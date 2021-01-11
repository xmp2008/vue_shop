<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="../assets/logo.png" alt=""> -->
        <span>VUE后台权限系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' :'200px'">
        <div class=" toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#313743" text-color="#fff" active-text-color="#359BFF" unique-opened
                 :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconObjects[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.title }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subitem.href" v-for="subitem in item.childs" :key="subitem.id"
                          @click="saveNavState(subitem.href)">
              <template slot="title">
                <!-- 二级菜单图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subitem.title }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menu: {},
      // 左侧菜单数据
      menuList: [],
      iconObjects: {
        1: "el-icon-s-custom",
        2: "el-icon-s-flag",
        101: "el-icon-s-shop",
        137: "el-icon-s-order",
        115: "el-icon-s-data",
      },
      isCollapse: false,
      activePath: "",
    };
  },
  computed: {},
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  mounted() {
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear();
      //重定向到登录页
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList() {
      // const {data: res} = await this.$http.get("admin/menu/build");
      const {data: res} = await this.$http.post("/admin/menu/tree", this.menu);
      // console.log(res);
      if (res.returnCode !== 1000) return this.$message.error(res.message);
      this.menuList = res.dataInfo.childs;
    },
    // 点击切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath
    },
  },
};
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}

.el-header {
  background-color: #343a3d;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #313743;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e9edf1;
}

.toggle-button {
  background-color: #475163;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
