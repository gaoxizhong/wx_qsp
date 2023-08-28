const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    library_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      library_id:options.library_id,
      member_id: wx.getStorageSync('member_id'),
    })
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
  scanning(){
    let that = this;
    //唤起摄像头
    wx.scanCode({   
    success(res) {
      console.log("扫码结果", res);
      common.get("/book/sao_isbn", { isbn: res.result }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          console.log(2)

          let book_name = res.data.data.book_name
          let book_id = res.data.data.book_id;
          let isbn = res.data.data.isbn;
          let book_price = res.data.data.integral_price;        
          let book_image = res.data.data.book_image;
          let book_author = res.data.data.author;
          let book_publisher = res.data.data.publisher;
          let summary = res.data.data.summary;
          /*跳转页面*/
          wx.navigateTo({
            url: "/packageA/pages/library/addperbook/addperbook?book_name=" + book_name + "&book_id=" + book_id + "&isbn=" + isbn + "&book_price=" + book_price + "&book_image=" + book_image + "&book_author=" + book_author + "&book_publisher=" + book_publisher+"&library_id="+that.data.library_id+"&summary=" + summary
          })
          console.log(1)
        } else {
          let is_title = res.data.msg;
          let is_err = 1;
          wx.navigateTo({
            url: "/packageA/pages/library/addperbook/addperbook?is_err=" + is_err + '&is_title=' + is_title + "&library_id=" + that.data.library_id,
          })
        }
      })
    },
    complete(ret, result) {
      console.log('ret', ret);
      console.log('result', result);
      // if (!result){
      //   wx.showToast({
      //     title: '请扫取书籍条形码',
      //     icon: "none"
      //   })
      // }

    },
  })
  }
})
