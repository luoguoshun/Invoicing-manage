<template>
  <div class="book_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" round @click="openCreateDialog()">上架</el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteBooks()" round>
          移除
        </el-button>
        <el-upload class="upload" action="" :http-request="importBooks" :auto-upload="true" :limit="1" :show-file-list="false">
          <el-button slot="trigger" size="mini" type="primary" round>
            导入数据
          </el-button>
        </el-upload>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-date-picker
            v-model="queryForm.publicationDates"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          >
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.typeId" placeholder="请选择类别">
            <el-option v-for="item in bookTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectBook()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :data="table.bookData"
      @selection-change="selectRows"
      border
    >
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <el-table-column label="封面" width="100" align="center">
        <template scope="scope" align="center">
          <el-image style="width: 50px; height: 50px" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]"></el-image>
        </template>
      </el-table-column>
      <el-table-column fixed prop="id" label="编号" width="50" align="center"> </el-table-column>
      <el-table-column label="书名" width="170" align="center">
        <template scope="scope">
          <span style=" color:rgb(0, 153, 255)"> 《{{ scope.row.bookName }}》 </span>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="类型" width="80" align="center"> </el-table-column>
      <el-table-column prop="author" label="作者" width="120" align="center"> </el-table-column>
      <el-table-column prop="press" label="出版社" width="120" align="center"> </el-table-column>
      <el-table-column label="出版日期" width="140" align="center">
        <template scope="scope">
          {{ $timeFormat.leaveTime(scope.row.publicationDate) }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="110" align="center">
        <template scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.price" placeholder="价格"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存量" width="110" align="center">
        <template scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.inventory" placeholder="价格"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="descripcion" label="书籍描述" width="550" align="center"> </el-table-column>
      <el-table-column prop="state" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-switch
            class="switch"
            :inactive-value="0"
            :active-value="1"
            active-color="rgb(0, 255, 149)"
            inactive-color="rgb(151, 148, 148)"
            v-model="scope.row.state"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="openUpdateDiolog(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="updateSectionBook(scope.row)" type="text" size="small">修改</el-button>
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
    <!-- 修改书籍信息对话框 -->
    <el-dialog title="书籍信息" center :visible.sync="updateDialog.visible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="bookForm" label-width="80px">
        <el-form-item label="封面">
          <img :src="bookForm.imageUrl" width="100" height="100" />
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :http-request="updateAllBook"
            :auto-upload="false"
            :limit="1"
            :file-list="fileList"
            :on-change="fileOnchange"
          >
            <el-button slot="trigger" size="small" type="primary">
              选取文件
            </el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitFormInfo">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="书籍名称">
          <el-input v-model="bookForm.bookName"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="bookForm.typeId" placeholder="请选择类别">
            <el-option v-for="item in bookTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出版时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="bookForm.publicationDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="价格">
          <el-input type="number" v-model.number="bookForm.price"></el-input>
        </el-form-item>
        <el-form-item label="库存量">
          <el-input type="number" v-model.number="bookForm.inventory"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="6" v-model="bookForm.descripcion"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog.visible = false">取 消</el-button>
        <el-button type="success" @click="submitFormInfo">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 添加书籍信息对话框 -->
    <el-dialog title="上架书籍" center :visible.sync="createDialog.visible" :close-on-click-modal="false" width="35%">
      <el-form ref="createform" :model="bookForm" label-width="80px">
        <el-form-item label="书籍名称">
          <el-input v-model="bookForm.bookName"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="bookForm.author"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="bookForm.typeId" placeholder="请选择类别">
            <el-option v-for="item in bookTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出版时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="bookForm.publicationDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="bookForm.press"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input type="number" v-model.number="bookForm.price"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input type="number" v-model.number="bookForm.inventory"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="8" v-model="bookForm.descripcion"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="createBook()">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resetObject, determinefileType } from '@/utils/tools.js';
export default {
  data() {
    return {
      //搜索模型
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        typeId: 0,
        publicationDates: [],
      },
      //表格数据
      table: {
        bookData: [],
        total: 0,
      },
      bookIds: [],
      //修改对话框
      updateDialog: {
        visible: false,
      },
      createDialog: {
        visible: false,
      },
      //书籍模型
      bookForm: {
        id: 0,
        bookName: '',
        imageUrl: '',
        author: '',
        typeId: 0,
        press: '',
        publicationDate: '',
        descripcion: '',
        price: 0,
        inventory: 0,
        createTime: '',
      },
      //书籍类别集合
      bookTypes: [{ typeId: 0, typeName: '请选择类别' }],
      fileList: [],
    };
  },
  methods: {
    //导入数据
    importBooks(param) {
      console.log(param);
      if (param.file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.xlsx 的文件',
        });
      } else {
        const formdata = new FormData();
        formdata.append('file', param.file);
        this.$api.book.importBooks(formdata).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message({ message: message, type: 'error' });
          } else {
            this.updateDialog.visible = false;
            this.$message({ message: '导入成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //获取书籍数据
    async getBookList() {
      await this.$api.book
        .getBookList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.typeId, this.queryForm.publicationDates)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          } else {
            this.table.bookData = data.books;
            this.table.total = data.count;
          }
        });
    },
    //获取书籍类型列表
    async getBookTypeList() {
      await this.$api.book.getBookTypeList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.bookTypes = data;
      });
    },
    //加载数据
    loadData() {
      this.getBookList();
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
    //查找书籍
    selectBook() {
      this.queryForm.page = 1;
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.typeId = 0;
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    //获取选中行的数据
    selectRows(selection) {
      this.bookIds = [];
      selection.forEach((element) => {
        this.bookIds.push(element.id);
      });
    },
    //删除书籍
    deleteBooks() {
      if (this.bookIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.book.deleteBooks(this.bookIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败！');
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //打开修改弹窗
    openUpdateDiolog(row) {
      this.fileList = [];
      const length = this.fileList.push({
        name: row.bookName + '.jpg',
        url: row.imageUrl,
      });
      console.log(this.fileList);
      if (length > 0) {
        this.bookForm = { ...row };
        this.updateDialog.visible = true;
      }
    },
    //提交修改书籍
    submitFormInfo() {
      this.$refs.upload.submit();
    },
    //修改书籍部分数据
    updateSectionBook(row) {
      const book = JSON.parse(JSON.stringify({ ...row }));
      this.$api.book.updateSectionBook(book).then((res) => {
        let { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error('修改失败！');
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.loadData();
        }
      });
    },
    fileOnchange(file) {
      // this.fileList = fileList.slice(1);
      this.fileList.push(file);
      // console.log(this.fileList);
    },
    //修改书籍全部数据
    updateAllBook(param) {
      console.log(param);
      if (param.file.type != 'image/png' && param.file.type != 'image/gif' && param.file.type != 'image/jpg' && param.file.type != 'image/jpeg') {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.png .gif .jpg .jpeg的图片',
        });
      } else if (param.file.size / 1024 / 1024 / 2 > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M',
        });
      } else {
        const formdata = new FormData();
        formdata.append('file', param.file);
        for (let item in this.bookForm) {
          if (!formdata.has(item)) {
            formdata.append(item, this.bookForm[item]);
          }
        }
        this.$api.book.updateAllBook(formdata).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          } else {
            this.updateDialog.visible = false;
            this.$message({ message: '修改成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //打开新增弹窗
    openCreateDialog() {
      this.createDialog.visible = true;
      resetObject(this.bookForm);
    },
    //新增书籍
    createBook() {
      let books = [this.bookForm];
      this.$api.book.createBooks(books).then((res) => {
        let { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error('添加失败！');
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.loadData();
        }
      });
    },
  },
  created() {
    this.loadData();
    this.getBookTypeList();
  },
};
</script>

<style lang="less" scoped>
.book_container {
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
}
</style>
