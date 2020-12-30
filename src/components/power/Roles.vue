<template>
  <div class="">

    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <!-- 通过for循环 渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6 ">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 展示数据结构 -->
            <pre>{{scope.row}}</pre>
          </template>

        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeRoleById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle size="mini" @click="showSetRightDialog(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 分配权限框
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      //  树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //   默认选中节点ID值
      defKeys: [],
      //当前即将分配权限的Id
      roleId: 0,
      rolesList: [],
      //控制添加角色对话框的显示和隐藏
      addDialogVisible: false,
      //控制编辑权限对话框的显示和隐藏
      editDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色验证规则
      addFormRules: {
        // 验证角色是否合法
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证描述是否合法
        roleDesc: [{ required: true, message: "请输入描述", trigger: "blur" }],
      },
      // 编辑用户验证规则
      editFormRules: {
        // 验证角色是否合法
        roleName: [{ required: true, message: "请输入角色", trigger: "blur" }],
        // 验证描述是否合法
        roleDesc: [{ required: true, message: "请输入描述", trigger: "blur" }],
      },
      editForm: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
    };
  },
  computed: {},
  created() {
    this.getRolesList();
  },
  mounted() {},
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
      //   this.total = res.data.total;
      console.log(res);
    },
    async removeRoleById(id) {
      //   console.log(id);
      const confirmRes = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
        const { data: res } = await this.$http.delete("roles/" + id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("删除角色成功");
        // 重新获取用户列表
        this.getRolesList();
      }
    },
    // 展示编辑角色对话框，展示查询角色数据
    async showEditDialog(id) {
      //   console.log(id);
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm.id = res.data.roleId;
      this.editForm.roleName = res.data.roleName;
      this.editForm.roleDesc = res.data.roleDesc;
      //   this.editForm.mobile = res.data.mobile;
      //   console.log(res);
    },
    // 监听添加角色框关闭事件，重置添加用户表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定，添加角色事件
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加角色成功");
        // 隐藏添加角色对话框
        this.addDialogVisible = false;
        // 重新获取角色列表
        this.getRolesList();
      });
    },
    // 监听编辑角色框关闭事件，重置编辑角色表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定，修改角色
    updateRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.id,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("修改角色成功");
        // 隐藏添加用户对话框
        this.editDialogVisible = false;
        // 重新获取用户列表
        this.getRolesList();
      });
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示 删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== "confirm") {
        this.$message.info("已取消权限删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      role.children = res.data;
      //   不建议使用
      // this.getRolesList()
    },
    // 分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取角色的所有权限
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      //   获取权限树
      this.rightsList = res.data;
      //   console.log(res)
      //   递归获取三级节点的id
      this.getLeafkeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys(node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafkeys(item, arr));
    },
    // 权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 分配权限
    async allotRights(roleId) {
      // 获得当前选中和半选中的Id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功!");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style scoped lang="less">
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
