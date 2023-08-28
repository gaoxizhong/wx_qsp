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
      this.setData({
        book_list: [{
          book_name: options.book_name,
          book_image: options.book_image,
          book_price: options.book_price,
          book_author: options.book_author,
          isbn: options.isbn,
          book_id: options.book_id,
          book_publisher: options.book_publisher,
          checked:true,
          }]
      })
    }
    this.setData({
      library_id: options.library_id,
    })
    console.log(this.data.book_list);
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
            let new_book_list = [{
              book_name: book_name,
              book_image: book_image,
              book_price: book_price,
              book_author: book_author,
              isbn: isbn,
              book_id: book_id,
              book_publisher: book_publisher,
              checked: true,
              }];
            that.setData({
              book_list: that.data.book_list.concat(new_book_list).reverse(),  // .reverse()数组颠倒
          })
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
  /**选择图书 */
  chooseBook(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let choseChange = "book_list[" + index + "].checked";
    let book_list_checked = that.data.book_list[index].checked;
    console.log(book_list_checked)
    if (book_list_checked==true){
      that.setData({
        [choseChange]: ''
      })
    }else{
      that.setData({
        [choseChange]: true
      })
    }
  },
  /**确定上架 */
  submit: function () {
    let that = this;
    let new_data = [];
    for (var i in that.data.book_list){
      if (that.data.book_list[i].checked == true) {
        let arr = that.data.book_list[i];
        console.log(arr)
        that.setData({
          new_data: that.data.new_data.concat(arr)
        })  
      }
    }
    if (Object.keys(that.data.new_data).length === 0){
      wx.showToast({
        title: '请选择图书',
        icon: "none"
      })
    }else{
      let member_id = wx.getStorageSync('member_id')
      if (!member_id) {
        wx.showToast({
          title: '请先登陆后再操作',
          icon: "none"
        })
        return;
      }
      wx.showLoading({
        title:'上架中...'
      })
      common.post('/library/add_book', {
        member_id: wx.getStorageSync('member_id'),
        book_info: this.data.new_data,
        library_id: this.data.library_id
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
})
