<template>
  <div class="">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 第三方表格 -->
      <tree-table :data="cateList" :columns="columns"></tree-table>
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @close="setRoleDialogClosed">
      <div>
        <p>当前用户名:{{userInfo.username}}</p>
        <p>当前用户角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole(selectedRoleId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;

      if (regEmail.test(value)) {
        // 邮箱合法
        return callback();
      }
      callback(new Error("邮箱不合法"));
    };
    // 自定义手机号验证规则
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^1(3\d|4[5-8]|5[0-35-9]|6[567]|7[01345-8]|8\d|9[025-9])\d{8}$/;

      if (regPhone.test(value)) {
        // 手机号合法
        return callback();
      }
      callback(new Error("手机号不合法"));
    };
    return {
      queryInfo: {
        type: "3",
        pagenum: 1,
        pagesize: 2,
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "name",
          width: "400px",
        },
      ],
      //控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      //控制编辑用户对话框的显示和隐藏
      editDialogVisible: false,
      // 控制分配角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      addForm: {
        username: "",
        email: "",
        mobile: "",
        password: "",
      },
      // 添加用户验证规则
      addFormRules: {
        // 验证用户是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证邮箱是否合法
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        // 验证手机号是否合法
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 编辑用户验证规则
      editFormRules: {
        // 验证邮箱是否合法
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        // 验证手机号是否合法
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      editForm: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      // 分配角色显示的用户信息
      userInfo: {},
      // 所有角色列表数据
      rolesList: [],
      // 已选中的角色id
      selectedRoleId: "",
      // 已选中的用户id
      userId: "",
    };
  },
  computed: {},
  created() {
    this.getCateList();
  },
  mounted() {},
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(res);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    // 修改商品状态
    async changeCateStatus(cateInfo) {
      console.log(cateInfo);
      const { data: res } = await this.$http.put(
        `categories/${cateInfo.cat_id}`,
        {
          cat_name: cateInfo.cat_name,
        }
      );
      if (res.meta.status !== 200) {
        cateInfo.cat_deleted = !cateInfo.cat_deleted;
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
    // 监听添加用户框关闭事件，重置添加用户表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定，添加用户事件
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加用户成功");
        // 隐藏添加用户对话框
        this.addDialogVisible = false;
        // 重新获取用户列表
        this.getCateList();
      });
    },
    // 展示编辑用户对话框，展示查询用户数据
    async showEditDialog(id) {
      console.log(id);
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm.id = res.data.id;
      this.editForm.username = res.data.username;
      this.editForm.email = res.data.email;
      this.editForm.mobile = res.data.mobile;
      console.log(res);
    },
    // 监听编辑用户框关闭事件，重置编辑用户表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定，修改用户
    updateUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("修改用户成功");
        // 隐藏添加用户对话框
        this.editDialogVisible = false;
        // 重新获取用户列表
        this.getCateList();
      });
    },
    async removeUserById(id) {
      //   console.log(id);
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      //   console.log(res);
      if (confirmRes === "confirm") {
        const { data: res } = await this.$http.delete("users/" + id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("删除用户成功");
        // 重新获取用户列表
        this.getCateList();
      }
    },
    // 显示分配角色对话框
    async showSetRoleDialog(userInfo) {
      // console.log(userInfo);
      this.userId = userInfo.id;
      // 获取所有角色列表
      const { data: res } = await this.$http.get("roles/");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.rolesList = res.data;
      this.userInfo = userInfo;
      this.setRoleDialogVisible = true;
    },
    // 分配角色提交
    async saveRole(id) {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择角色!");
      }
      const { data: res } = await this.$http.put(`users/${this.userId}/role`, {
        rid: id,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("更新角色成功");
      // 隐藏修改角色对话框
      this.setRoleDialogVisible = false;
      // 重新获取角色列表
      this.getCateList();
    },
    // 监听分配角色对话框关闭事件，重置对话框，清空数据
    setRoleDialogClosed() {
      this.selectedRoleId = "";
    },
  },
};
</script>

<style scoped lang="less">
</style>
