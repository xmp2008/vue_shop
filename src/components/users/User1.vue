<template>
  <div class="filter-container">
    <el-input v-model="queryParams.username" :placeholder="('table.user.username')"
              class="filter-item search-item"/>
    <el-input v-model="queryParams.deptName" :placeholder="('table.user.dept')" class="filter-item search-item"/>
    <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        :start-placeholder="('table.user.createTime')"
        value-format="yyyy-MM-dd"
        class="filter-item search-item date-range-item"
        type="daterange"
    />
    <el-button class="filter-item" type="primary">
      {{ ('table.search') }}
    </el-button>
    <el-button class="filter-item" type="success">
      {{ ('table.reset') }}
    </el-button>
    <el-dropdown trigger="click"
                 class="filter-item">
      <el-button>
        {{ ('table.more') }}<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ ('table.add') }}</el-dropdown-item>
        <el-dropdown-item>{{
            ('table.delete')
          }}
        </el-dropdown-item>
        <el-dropdown-item>{{
            ('table.resetPassword')
          }}
        </el-dropdown-item>
        <el-dropdown-item>{{
            ('table.export')
          }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "User1",
  data() {
    return {
      dialog: {
        isVisible: false,
        title: ''
      },
      userViewVisible: false,
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      sort: {},
      selection: [],
      pagination: {
        size: 10,
        num: 1
      }
    }
  },
}
</script>

<style scoped>

</style>
