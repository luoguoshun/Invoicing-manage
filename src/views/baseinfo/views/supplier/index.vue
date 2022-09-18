<<template>
  <div class="warehouse_container">
    <el-menu :default-active="this.$route.name" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="supplierdata" >供应商信息</el-menu-item>
      <el-menu-item index="supplierList" disabled>供应商货品</el-menu-item>
    </el-menu>
    <RouterView></RouterView>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.warehouse_container {
  height: 100%;
  width: 100%;
}
</style>