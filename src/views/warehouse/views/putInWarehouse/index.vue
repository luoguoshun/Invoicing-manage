<<template>
  <div class="warehouse_container">
    <el-menu :default-active="this.$route.path" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/warehouse/putInWarehouse/purchaseReceipt" >采购入库开单</el-menu-item>
      <el-menu-item index="/warehouse/putInWarehouse/returnReceipt">退货入库开单</el-menu-item>
      <el-menu-item index="/warehouse/putInWarehouse/receiptDoc">入库单管理</el-menu-item>
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
