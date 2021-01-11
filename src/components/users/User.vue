<template>
  <div class="">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- 搜索区域 -->
          <el-input class="search" placeholder="请输入用户名" v-model="queryInfo.username" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <!-- 搜索区域 -->
          <el-input class="search" placeholder="请输入手机号" v-model="queryInfo.mobile" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddEditDialog()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="useList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="roleName" label="角色">
        </el-table-column>
        <el-table-column prop="ssex" label="性别">
        </el-table-column>
        <el-table-column prop="deptName" label="部门">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!--             {{scope.row}}-->
            <el-switch v-model="scope.row.isTab==='1'?true:false" @change="changeUserStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="showEditDialog(scope.row.userId)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="removeUserById(scope.row.userId)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle size="mini"
                         @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="570px" @close="addDialogClosed">
      <!--    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"-->
      <!--               :visible.sync="addDialogVisible" :title="添加用户" width="570px">-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" size="small" label-width="80px">
        <!--      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"/>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"/>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="roleDatas" multiple placeholder="请选择">
            <el-option
                v-for="item in roles"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <treeselect
              v-model="addForm.deptId"
              :options="depts"
              :normalizer="normalizer"
              placeholder="选择部门"
              style="width: 178px"
          />
        </el-form-item>


        <el-form-item label="性别">
          <el-radio-group v-model="addForm.ssex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
            <el-radio label="2">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="addForm.status">
            <el-radio label="1">有效</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据权限" prop="dept">
          <treeselect
              v-model="deptDatas"
              :multiple="true"
              :options="depts"
              :normalizer="normalizer"
              placeholder="选择部门"
              style="width: 178px"
          />
        </el-form-item>

        <!--        <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">-->
        <!--          <el-select-->
        <!--              v-model="roleDatas"-->
        <!--              style="width: 437px"-->
        <!--              multiple-->
        <!--              placeholder="请选择"-->
        <!--          >-->
        <!--            <el-option-->
        <!--                v-for="item in roles"-->
        <!--                :key="item.name"-->
        <!--                :disabled="level !== 1 && item.level <= level"-->
        <!--                :label="item.name"-->
        <!--                :value="item.id"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 添加用户的对话框 -->
    <!--    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">-->
    <!--      &lt;!&ndash; 内容主体区 &ndash;&gt;-->
    <!--      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">-->
    <!--        <el-form-item label="用户名" prop="username">-->
    <!--          <el-input v-model="addForm.username"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="邮箱" prop="email">-->
    <!--          <el-input v-model="addForm.email"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="手机号" prop="mobile">-->
    <!--          <el-input v-model="addForm.mobile"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="用户密码" prop="password">-->
    <!--          <el-input v-model="addForm.password"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="用户密码" prop="password">-->
    <!--          <el-input v-model="addForm.password"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      &lt;!&ndash; 底部区域 &ndash;&gt;-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="addDialogVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="addUser">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->

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
        <p>当前用户名:{{ userInfo.username }}</p>
        <p>当前用户角色:{{ userInfo.role_name }}</p>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {truncate} from 'fs';

export default {
  components: {Treeselect},
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
      // 后台返回的数据和VueTreeselect要求的数据结构不同，需要进行转换
      normalizer(node) {
        //去掉children=[]的children属性
        if (node.children && !node.children.length) {
          delete node.children;
        }
        //去掉children=null的属性
        if (node.children == null || node.children == 'null') {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },

      roles: [],
      roleDatas: [],
      dict: [],
      depts: [],
      deptDatas: null,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
        username: "",
        mobile: "",
        enabled: "",
      },
      user: {
        enabled: "",
        userId: "",
        isTab: ""
      },
      useList: [],
      total: 0,
      //控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      //控制编辑用户对话框的显示和隐藏
      editDialogVisible: false,
      // 控制分配角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      addForm: {
        username: "",
        deptId: null,
        email: "",
        mobile: "",
        status: "",
        ssex: "",
        isTab: "",
        theme: "",
        avatar: "",
        description: "",
        roleIds: "",
        deptIds: ""
      },
      // 添加用户验证规则
      addFormRules: {
        // 验证用户是否合法
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证邮箱是否合法
        email: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"},
        ],
        // 验证手机号是否合法
        mobile: [
          {required: true, message: "请输入手机号", trigger: "blur"},
          {validator: checkPhone, trigger: "blur"},
        ],
        // 验证密码是否合法
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
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
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"},
        ],
        // 验证手机号是否合法
        mobile: [
          {required: true, message: "请输入手机号", trigger: "blur"},
          {validator: checkPhone, trigger: "blur"},
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
    this.getUserList();
  },
  mounted() {
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.post("/admin/user/page", this.queryInfo);
      if (res.returnCode !== 1000) return this.$message.error(res.message);
      this.useList = res.records;
      this.total = res.total;
      // console.log(res);
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
    async changeUserStatus(userInfo) {
      console.log(userInfo);
      this.user.userId = userInfo.userId;
      userInfo.isTab === '1' ? this.user.isTab = '0' : this.user.isTab = '1';
      const {data: res} = await this.$http.post("/admin/user/update", this.user);
      if (res.returnCode !== 1000) {
        this.user.isTab === '1' ? userInfo.isTab = '0' : userInfo.isTab = '1';
        return this.$message.error(res.message);
      }
      userInfo.isTab === '1' ? userInfo.isTab = '0' : userInfo.isTab = '1';
      this.$message.success(res.message);
    },
    // 监听添加用户框关闭事件，重置添加用户表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.roleDatas = null;
      this.deptDatas = null;
      this.addForm.deptId = null;
      this.addForm.ssex = null;
      this.addForm.status = null;
    },
    // 点击确定，添加用户事件
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        //封装请求参数
        this.addForm.roleIds = this.roleDatas.join(",");
        this.addForm.deptIds = this.deptDatas.join(",");
        const {data: res} = await this.$http.post("/admin/user/add", this.addForm);
        if (res.returnCode !== 1000) return this.$message.error(res.message);
        this.$message.success("添加用户成功");
        // 隐藏添加用户对话框
        this.addDialogVisible = false;
        // 重新获取用户列表
        this.getUserList();
      });
    },
    // 展示编辑用户对话框，展示查询用户数据
    async showEditDialog(id) {
      console.log(id);
      this.editDialogVisible = true;
      const {data: res} = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm.id = res.data.id;
      this.editForm.username = res.data.username;
      this.editForm.email = res.data.email;
      this.editForm.mobile = res.data.mobile;
      console.log(res);
    },
    // 展示添加用户对话框，查询角色、部门数据
    async showAddEditDialog() {
      this.addDialogVisible = true;
      const {data: res} = await this.$http.post("/admin/role/list", this.queryInfo);
      const {data: res1} = await this.$http.post("/admin/dept/list", this.queryInfo);
      console.log(res);
      console.log(res1);
      if (res.returnCode !== 1000) return this.$message.error(res.message);
      //角色数据
      this.roles = res.dataInfo;
      this.depts = res1.dataInfo;

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
        const {data: res} = await this.$http.put(
            "users/" + this.editForm.id,
            {email: this.editForm.email, mobile: this.editForm.mobile}
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("修改用户成功");
        // 隐藏添加用户对话框
        this.editDialogVisible = false;
        // 重新获取用户列表
        this.getUserList();
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
        this.user.userId = id;
        const {data: res} = await this.$http.post("/admin/user/delete", this.user);
        if (res.returnCode !== 1000) return this.$message.error(res.$message);
        this.$message.success("删除用户成功");
        // 重新获取用户列表
        this.getUserList();
      }
    },
    // 显示分配角色对话框
    async showSetRoleDialog(userInfo) {
      // console.log(userInfo);
      this.userId = userInfo.id;
      // 获取所有角色列表
      const {data: res} = await this.$http.get("roles/");
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
      const {data: res} = await this.$http.put(`users/${this.userId}/role`, {
        rid: id,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("更新角色成功");
      // 隐藏修改角色对话框
      this.setRoleDialogVisible = false;
      // 重新获取角色列表
      this.getUserList();
    },
    // 监听分配角色对话框关闭事件，重置对话框，清空数据
    setRoleDialogClosed() {
      this.selectedRoleId = "";
    },
  },
};
</script>

<style scoped lang="less">
.search {
  margin-bottom: 5px;
}

::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}

.el-input {
  height: 38px;
  width: auto;

  input {
    height: 38px;
  }
}
</style>
