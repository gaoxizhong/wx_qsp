const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    point_sum: 0,
    library_id: 0,
    library_number: 0,
    savaStatus: true,
    bookList: {},
    longitude:'',
    latitude:'',
    is_yzm: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if(options.is_yzm){
      that.setData({
        is_yzm: options.is_yzm
      })
    }
    if(options.id){
      this.setData({
        library_id:  options.id,
        library_number: options.library_number,
      })
    }
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        console.log(res)
        that.setData({
         latitude : Number(res.latitude),
         longitude : Number(res.longitude)
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '需要开启手机定位',
          icon:'none'
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
      }
    })
    that.useScan();
  },
  //保存书名
  saveBookName(e) {
    this.data.bookList.book_name = e.detail.value;
    this.setData({
      bookList:  this.data.bookList
    })
    console.log(this.data.bookList)
  },
  //保存书的积分
  saveBookPoint(e) {
    let that = this;
    let bookList = that.data.bookList;
    bookList.integral_price = e.detail.value;
    that.setData({
      bookList,
      point_sum: Number(bookList.integral_price).toFixed(2)
    })
    console.log(this.data.bookList)

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
  },
  //唤起摄像头
  useScan() {
    let that = this;
    wx.scanCode({
      success (res) {
        console.log("扫码结果",res);
        common.get("/book/sao_isbn", { isbn: res.result }).then(res => {
          console.log(res);
          let bookList = that.data.bookList;
          if (res.data.code == 200) {
            bookList.book_name = res.data.data.book_name;
            bookList.integral_price = res.data.data.integral_price;
            bookList.book_id = res.data.data.book_id;
            that.setData({
              bookList,
              point_sum: Number(bookList.integral_price).toFixed(2)
            })
          console.log(that.data.bookList)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        })
      },
      complete(ret,result){
        console.log('ret',ret);
        console.log('result',result);
        
      },
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //确认购买
  fixed_btn() {
    let that = this;
    let savaStatus = that.data.savaStatus;
    let bookList = that.data.bookList;
    let is_yzm = that.data.is_yzm;
    let books = [];
    books.push(bookList);
    console.log(books)
    // if (JSON.stringify(bookList) == "{}") {
    //   wx.showToast({
    //     title: '请填写书籍信息！',
    //     icon: 'none'
    //   })
    //   return;
    // }
    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    let params = {
      member_id: wx.getStorageSync('member_id'),
      library_id: that.data.library_id,
      library_number: that.data.library_number,
      books,
      integral_price_sum: Number(that.data.point_sum).toFixed(2),
      lat: that.data.latitude,
      lng: that.data.longitude,
    }
    if(is_yzm){
      params.is_yz = is_yzm;
      params.yz_id = wx.getStorageSync('yz_id');
    }
    common.get("/book/exchangeBook",params).then( res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.showToast({
          title: '兑换成功！',
          icon: 'none'
        })
        let buybookstr = JSON.stringify(params.books);
        wx.setStorageSync("books_1", buybookstr);
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          savaStatus: true
        })
      }
    }).catch( error => {
      console.log(error);
      wx.showToast({
        title: '数据异常！',
        icon: 'none'
      })
      that.setData({
        savaStatus: true
      })
    })
  },
})