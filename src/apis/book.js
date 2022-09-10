import ajax from '../utils/ajax';

export default {
  /**
   * @description: 获取书籍列表
   * @param {page} 类别id
   * @param {row} 类别id
   * @param {conditions} bookName.author.description
   * @param {typeId} 类别id
   * @param {publicationDates} 出版时间
   * @return {BookList}
   */
  getBookList(page, row, conditions, typeId, publicationDates) {
    return ajax.post('/api/Background/Book/GetBookList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      TypeId: typeId,
      PublicationDates: publicationDates,
    });
  },
  /**
   * @description: 获取书籍类型列表
   * @param {*}
   * @return {BookTypeList}
   */
  getBookTypeList() {
    return ajax.post('/api/Background/Book/GetBookTypeList');
  },
  /**
   * @description: 删除书籍列表
   * @param {书籍id集合} bookIds
   * @return {*}
   */
  deleteBooks(bookIds) {
    return ajax.post('/api/Background/Book/DeleteBooks', { BookIds: bookIds });
  },
  /**
   * @description: 修改部分书籍信息
   * @param {书籍模型} bookForm
   * @return {*}
   */
  updateSectionBook(bookForm) {
    // const book={
    //   Id:bookForm.id,
    //   BookName:bookForm.bookName,
    //   TypeId:bookForm.typeId,
    //   PublicationDate:bookForm.publicationDate,
    //   Price:bookForm.price,
    //   Inventory:bookForm.inventory,
    //   Descripcion:bookForm.descripcion,
    // };
    return ajax.post('/api/Background/Book/UpdateSectionBook', { ...bookForm });
  },
  /**
   * @description:修改全部书籍信息
   * @param {file} 图片文件 其他信息从
   * @return {*}
   */
  updateAllBook(formdata) {
    return ajax.post('/api/Background/Book/UpdateAllBook', formdata);
  },
  /**
   * @description:
   * @param {books} 书籍列表集合
   * @return {*}
   */
  createBooks(books) {
    return ajax.post('/api/Background/Book/CreatesBook', [...books]);
  },
  importBooks(file) {
    return ajax.post('/api/Background/Book/ImportBooks', file);
  },
};
