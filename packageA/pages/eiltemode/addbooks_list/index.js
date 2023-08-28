const app = getApp()
const common = require('../../../../assets/js/common');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_list: [],
    new_book_list:[],
    new_data:[],
    book_name: '',
    book_image: '',
    book_price: '',
    book_author: '',
    isbn: '',
    book_id: '',
    book_publisher: '',
    library_id: '',
    discount_inx:2,
    inx:2,
    oldNewarray: ['10成新','9.9成新','9.5成新','9成新', '8成新','7成新','6成新','5成新','4成新', '3成新','2成新','1成新'],
    name_rido:'',
    cate_list:[],
    cateSeleted:'8'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if(options.is_err == 1){
      let is_title = options.is_title;
      wx.showToast({
        title: is_title,
        icon:'none'
      })
    }else{
      let stock = 1;
      this.setData({
        book_list: [{
          book_name: options.book_name,
          book_image: options.book_image,
          book_price: options.book_price,
          book_author: options.book_author,
          isbn: options.isbn,
          book_id: options.book_id,
          book_publisher: options.book_publisher,
          book_grade:'9.5成新',
          summary:options.summary,
          stock,
          category_id:options.category_id
          }]
      })
    }
    this.setData({
      library_id: options.library_id,
    })
    this.getShopCates();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
    //获取商家类目
    getShopCates() {
      let that = this;
      common.get('/newhome/category_books', {}).then( res => {
        if ( res.data.code == 200 ) {
          that.setData({
            cate_list: res.data.data,
          })
        }
      })
    },
  saoyisao: function () {
    //唤起摄像头
    let that = this;
    wx.scanCode({
      success(res) {
        console.log("扫码结果", res);
        common.get("/book/sao_isbn", { isbn: res.result }).then(res => {
          console.log(res);
          if (res.data.code == 200) {
            let book_name = res.data.data.book_name
            let book_id = res.data.data.book_id;
            let isbn = res.data.data.isbn;
            let book_price = res.data.data.integral_price;
            let book_image = res.data.data.book_image;
            let book_author = res.data.data.author;
            let book_publisher = res.data.data.publisher;
            let summary= res.data.data.summary;
            let category_id = res.data.data.category_id;
            let new_book_list = [{
              book_name: book_name,
              book_image: book_image,
              book_price: book_price,
              book_author: book_author,
              isbn: isbn,
              book_id: book_id,
              book_publisher: book_publisher,
              book_grade:'9.5成新',
              summary:summary,
              stock:'1',
              category_id:category_id
              }];
            that.setData({
              book_list: new_book_list.concat(that.data.book_list),  // .reverse()数组颠倒
          })
          console.log(that.data.book_list)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        })
      },
      complete(ret, result) {
        console.log('ret', ret);
        console.log('result', result);
      },
    })
  },
  /**确定上架 */
  submit: function (e) {
    let that = this;
    let book_list = that.data.book_list;
    let type = e.currentTarget.dataset.type;
    console.log(type);
    if (Object.keys(that.data.book_list).length === 0){
      wx.showToast({
        title: '请先添加图书...',
        icon: "none"
      })
    }else{
      wx.showLoading({
        title:'上架中...'
      })
      common.post('/newhome/add_book', {
        member_id: wx.getStorageSync('member_id'),
        library_id: that.data.library_id,
        book_info: book_list,
        type,
      }).then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '上架成功',
            icon: "success"
          })
          //返回上一页
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
          
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      })
    }
    
  },
  //删除当前行
  cancel(e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list.splice(index, 1);
    that.setData({
      book_list,
    })
    console.log(that.data.book_list)
  },
  // 修改图书名称
  input_book_name(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list[index].book_name = e.detail.value;
    that.setData({
      book_list
    })
    console.log(that.data.book_list)
  },
  // 修改原价
  setbookprice(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list[index].book_price = e.detail.value;
    that.setData({
      book_list
    })
  },
  // 选择新旧程度
  bindPickerChange: function(e) {
    console.log(e)
    let that = this;
    let oldNewarray = that.data.oldNewarray;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list[index].book_grade = oldNewarray[e.detail.value];
    that.setData({
      book_list
    })
  },
  // 修改库存

  name_stock(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list[index].stock = e.detail.value;
    that.setData({
      book_list
    })
    console.log(that.data.book_list)
  },
  //点击切换类目
  getCateShop(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let indx=  e.currentTarget.dataset.indx;
    let id = e.currentTarget.dataset.id;
    let book_list = that.data.book_list;
    book_list[index].category_id = id;

    that.setData({
      cateSeleted: e.target.dataset.id,
      book_list
    })
    console.log(that.data.book_list)

  },
  name_rido(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let introduce = e.detail.value;
    let book_list = that.data.book_list;
    book_list[index].summary = introduce;
    console.log(e)
    this.setData({
      book_list,
    })
  },

})
