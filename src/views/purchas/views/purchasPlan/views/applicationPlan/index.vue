<template>
  <div class="applicationPlan">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-edit" @click="openApplicationPlanDiolog()">
          新建申请
        </el-button>
        <el-button type="primary" size="mini" class="el-icon-check">
          提交
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="cancelPurchaseRequest()">
          撤销
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.warehouseId">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入开单人"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="getPurchasePlanList()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="table.purchasPlanList" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column label="采购编号" width="120" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.purchaseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stateStr" label="状态" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"> </el-table-column>
      <el-table-column prop="applicantName" label="开单人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="transportPrice" label="运输费用" align="center"></el-table-column>
      <el-table-column prop="otherPrice" label="其他费用" align="center"></el-table-column>
      <el-table-column prop="approvalPersonId" label="审批人" align="center"></el-table-column>
      <el-table-column prop="purchasTotalPrice" label="订单总价" align="center"></el-table-column>
      <el-table-column prop="totalCount" label="货品总数" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showEditTable(scope.row)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="table.total"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="queryForm.page"
        :page-size="queryForm.row"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>
    <!-- 操作表格 -->
    <div class="editPlanItem" v-show="editTable.show">
      <el-divider></el-divider>
      <el-button size="mini" type="primary" @click="updatePurchaseDetails()" plain>保存</el-button>
      <el-button size="mini" type="primary" @click="editTable.show = false" plain>关闭</el-button>
      <el-table :data="editTable.detailPlanItems" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="purchaseDetailId" label="采购明细编号" width="120" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.purchaseDetailId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column label="采购明细编号" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.purchasePrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="采购数量" align="center">
          <template slot-scope="scope">
            <el-input type="number" size="mini" v-model.number="scope.row.count" @change="addGoodsCount(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.totalPrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deletePurchaseDetail(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加供应商货品对话框 -->
    <el-dialog title="采购计划申请" center :visible.sync="applicationPlanDiolog.Visible" :close-on-click-modal="false" width="50%">
      <el-form ref="purchasPlanForm" :model="purchasPlanForm" label-width="80px">
        <el-form-item label="申请仓库">
          <el-select size="mini" v-model="purchasPlanForm.warehouseId">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商">
          <el-select size="mini" v-model="purchasPlanForm.suppulierId" @change="selectSuppulier()">
            <el-option v-for="item in suppulierList" :key="item.suppulierId" :label="item.suppulierName" :value="item.suppulierId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input size="mini" type="text" v-model="purchasPlanForm.applicantId"></el-input>
        </el-form-item>
        <el-form-item label="备注"> <el-input type="textarea" v-model="purchasPlanForm.remarks"></el-input> </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="selectInput">
        <el-input size="mini" v-model="applicationPlanDiolog.skuQueryForm.spuId" placeholder="请输入SPU编号"></el-input>
        <el-input size="mini" v-model="applicationPlanDiolog.skuQueryForm.skuId" placeholder="请输入SKU编号"></el-input>
        <el-input size="mini" v-model="applicationPlanDiolog.skuQueryForm.goodsName" placeholder="请输入物品名称"></el-input>
        <el-select size="mini" v-model="applicationPlanDiolog.skuQueryForm.goodsTypeId">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-button type="primary" @click="getAllSKUList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetDialogQueryForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="table.skuList" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="">
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="typeStr" label="类别" align="center"> </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applicationPlanDiolog.Visible = false">取 消</el-button>
        <el-button type="success" @click="addSkuToWarehouse()">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        PublicationDates: [],
        warehouseId: '0',
        approvalName: '',
        state: 1,
      },
      //新建采购计划表
      purchasPlanForm: {
        warehouseId: '',
        suppulierId: '',
        applicantId: '', //申请人
        applicanName: '',
        remarks:'',
        applicanSKUIds:[],
      },
      table: {
        purchasPlanList: [],
        total: 0,
      },
      editTable: {
        editPurchaseId: '',
        show: false,
        detailPlanItems: [],
      },
      //新建采购计划对话框
      applicationPlanDiolog: {
        Visible: false,
        skuQueryForm: {
          page: 1,
          row: 10,
          spuId: '',
          skuId: '',
          goodsName: '',
          goodsTypeId: 0,
        },
        skuTabledata: [],
        tatol: 0,
      },
      dialogObject: {
        updateVisible: false,
        allocationDiolog: false,
      },
      purchasPlanIds: [],
      //仓库列表
      warehouseList: [{ warehouseId: '0', warehouseName: '开单仓库' }],
      //供应商列表
      suppulierList: [],
      //物品类别列表
      goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择类型' }],
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getPurchasePlanList();
    },
    //获取采购计划列表
    async getPurchasePlanList() {
      await this.$api.purchase.getPurchasePlanList(this.queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.purchasPlanList = data.purchase;
        this.table.total = data.count;
      });
    },
    //获取仓库列表数据
    async getWarehouseList() {
      await this.$api.warehouse.getWarehouseList(1, 100, '', 0).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.warehouses.forEach((item) => {
          this.warehouseList.push({ warehouseId: item.warehouseId, warehouseName: item.warehouseName });
        });
      });
    },
    //获取采购计划详细项目列表
    async getDetailPlanListByPurchasId(purchaseId) {
      await this.$api.purchase.getDetailPlanListByPurchasId(purchaseId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.editTable.detailPlanItems = data;
      });
    },
    async constructDropDownData(skuId) {
      await this.$api.supplier.constructDropDownData(skuId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.forEach((item) => {
          this.suppulierList.push({ supplierId: item.supplierId, supplierName: item.supplierName });
        });
      });
    },
    //获取货品数据选择申请采购单
    async getAllSKUList() {
      await this.$api.goods
        .getSKUList(
          this.applicationPlanDiolog.skuQueryForm.page,
          this.applicationPlanDiolog.skuQueryForm.row,
          this.applicationPlanDiolog.skuQueryForm.skuId,
          this.applicationPlanDiolog.skuQueryForm.spuId,   
          this.applicationPlanDiolog.skuQueryForm.goodsName,
          this.applicationPlanDiolog.skuQueryForm.goodsTypeId,
        )
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          this.applicationPlanDiolog.skuTabledata = data.goods;
          this.applicationPlanDiolog.tatol = data.count;
        });
    },
    //获取物品类型列表
    async getGoodInfoType() {
      await this.$api.goods.getGoodInfoType().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.forEach((element) => {
          this.goodsTypes.push({ goodsTypeId: element.goodsTypeId, goodsTypeName: element.goodsTypeName });
        });
      });
    },
    //条数改变
    handleSizeChange(row) {
      this.queryForm.row = row;
      this.loadData();
    },
    //页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.state = 0;
      this.queryForm.approvalName = '';
      this.queryForm.warehouseId = '0';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    //添加采购数据
    addpurchasPlan() {
      const purchasPlan = {
        purchasPlanId: this.purchasPlanForm.purchasPlanId,
        descripcion: this.purchasPlanForm.descripcion,
        name: this.purchasPlanForm.name,
      };
      this.$api.purchas.addpurchasPlan(purchasPlan).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '添加失败！', type: 'error' });
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.loadData();
        }
      });
    },
    //修改采购数据
    updatepurchasPlan() {
      const purchasPlan = {
        purchasPlanId: this.purchasPlanForm.purchasPlanId,
        descripcion: this.purchasPlanForm.descripcion,
        name: this.purchasPlanForm.name,
      };
      this.$api.purchas.updatepurchasPlan(purchasPlan).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },
    //获取选中行的数据
    selectRows(selection) {
      console.log(selection);
      this.purchasPlanIds = [];
      selection.forEach((element) => {
        this.purchasPlanIds.push(element.purchasPlanId);
      });
      console.log(this.purchasPlanIds);
    },
    //撤销采购申请
    cancelPurchaseRequest() {
      if (this.purchasPlanIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.purchas.cancelPurchaseRequest(this.purchasPlanIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('撤销失败，服务器未知错误');
          } else {
            this.$message({ message: '撤销成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //打开申请表模态框
    openApplicationPlanDiolog() {
      this.applicationPlanDiolog.Visible = true;
    },
    //显示采购单子项目
    showEditTable(row) {
      this.editTable.editPurchaseId = row.purchaseId;
      this.getDetailPlanListByPurchasId(row.purchaseId);
      this.editTable.show = true;
    },
    //添加物品数量触发函数
    addGoodsCount(index, row) {
      this.editTable.detailPlanItems[index]['totalPrice'] = row.count * row.purchasePrice;
    },
    //更新采购计划项目
    updatePurchaseDetails() {
      this.$api.purchase.updatePurchaseDetails(this.editTable.editPurchaseId, this.editTable.detailPlanItems).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(message);
        } else {
          this.$message({ message: '保存成功！', type: 'success' });
          this.editTable.show = false;
          this.loadData();
        }
      });
    },
    //移除采购计划单的子项目
    deletePurchaseDetail(index, row) {
      this.$api.purchase.deletePurchaseDetail(this.editTable.editPurchaseId, row.purchaseDetailId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(message);
        } else {
          this.$message({ message: '移除成功！', type: 'success' });
          this.editTable.show = false;
          this.loadData();
        }
      });
    },
  },
  created() {
    this.loadData();
    this.getWarehouseList();
  },
};
</script>

<style lang="less" scoped>
.applicationPlan {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 20px 0px 10px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      .upload {
        margin-left: 10px;
      }
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
      grid-column-gap: 5px;
      .edit_query_1 {
        width: 100%;
        text-align: center;
        div {
          width: 100%;
          color: rgb(0, 153, 255);
        }
      }
    }
  }
  .editPlanItem {
    // background-color: rgb(136, 115, 87);

    position: relative;
    z-index: 999;
    bottom: -120px;
    // border: 1px solid red;
    // width: 100%;
  }
  .selectInput {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
