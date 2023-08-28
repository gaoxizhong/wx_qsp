const app = getApp()
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    bookList: [],
    point_sum: '',
    dayLimit: 0,  //每日限制
    monthLimit: 0,  //每月限制
    library_id:'',
    library_number:'',
    savaStatus: true,
    latitude: '',
    longitude: '',

  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      library_id: options.library_id,
      library_number:options.library_number,
    })
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
    if ( options.id && options.numberid ) {
      that.setData({
        library_id: options.id,
        library_number: options.numberid
      })
    }
  },
  onShow: function() {
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      // return//todo 备注:此处为了腾讯登录规则变化修改
    }
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
    })
    common.get("/library/getMemberBookCount", {
      member_id: that.data.member_id
    }).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          dayLimit: res.data.data.day,
          monthLimit: res.data.data.month
        })
      }
    })
  },
  onHide() {
  },
  onUnload() {
  },
  //增加书本数
  addBookList() {
    let newItem = { book_id : 0 };
    if (this.data.bookList.length < (5 - this.data.dayLimit-0) && this.data.bookList.length < (10 - this.data.monthLimit-0)) {
      this.data.bookList.push(newItem);
      this.setData({
        bookList: this.data.bookList
      })
    } else {
      wx.showToast({
        title: "超过限购数量",
        icon: "none"
      })
    }

  },
  //唤起摄像头
  useScan() {
    let that = this;
    wx.scanCode({
      success (res) {
        console.log("扫码结果",res);
        common.get("/book/sao_isbn", { isbn: res.result }).then(res => {
          console.log(res);
          if (res.data.code == 200) {
            that.addBookList();
            let len = that.data.bookList.length;
            let sum = 0;
            that.data.bookList[len - 1].book_name = res.data.data.book_name;
            that.data.bookList[len - 1].integral_price = res.data.data.integral_price;
            that.data.bookList[len - 1].book_id = res.data.data.book_id;
            that.setData({
              bookList:  that.data.bookList
            })
            that.data.bookList.forEach(element => {
              if ( element.integral_price && parseFloat(element.integral_price) ) {
                sum += parseFloat(element.integral_price);
              }
            });
            that.setData({
              point_sum: sum.toFixed(2)
            })
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
  //删除当前行
  delCurItem(e) {
    let index = e.currentTarget.dataset.index;
    let sum = 0;
    this.data.bookList.splice(index, 1);
    this.setData({
      bookList: this.data.bookList
    })
    this.data.bookList.forEach(element => {
      if (element.integral_price && parseFloat(element.integral_price)) {
        sum += parseFloat(element.integral_price);
      }
    });
    this.setData({
      point_sum: sum.toFixed(2)
    })
  },
  //保存书名
  saveBookName(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.data.bookList[index].book_name = e.detail.value;
    this.setData({
      bookList:  this.data.bookList
    })
  },
  //保存书的积分
  saveBookPoint(e) {
    let index = e.currentTarget.dataset.index;
    let sum = 0;
    this.data.bookList[index].integral_price = e.detail.value;
    this.setData({
      bookList:  this.data.bookList
    })
    this.data.bookList.forEach(element => {
      if ( element.integral_price && parseFloat(element.integral_price) ) {
        sum += parseFloat(element.integral_price);
      }
    });
    this.setData({
      point_sum: sum.toFixed(2)
    })
  },
  //确认购买
  confirmBuy() {
    let that = this;
    let savaStatus = that.data.savaStatus;
    let sum = 0;
    if (that.data.bookList.length == 0) {
      wx.showToast({
        title: '请填写书籍信息！',
        icon: 'none'
      })
      return;
    }
    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    that.data.bookList.forEach(element => {
      if (element.book_name && element.integral_price && parseFloat(element.integral_price)) {
        sum += parseFloat(element.integral_price);
      } else {
        return;
      }
    });
    let params = {
      member_id: that.data.member_id,
      library_id: that.data.library_id,
      library_number: that.data.library_number,
      books: that.data.bookList,
      integral_price_sum: sum.toFixed(2),
      lat: that.data.latitude,
      lng: that.data.longitude
    }
    console.log(params);
    common.get("/book/exchangeBook",params).then( res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.navigateTo({
          url: ('/pages/buybooksuccess/buybooksuccess?point=' + params.integral_price_sum)
        })
        let buybookstr = JSON.stringify(params.books);
        wx.setStorageSync("books", buybookstr);
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
  //触底事件
  onReachBottom() {

  },
})