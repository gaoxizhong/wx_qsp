const app = getApp()
const common = require('../../../assets/js/common');
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    abc:true,
    buyer_address: '',
    welfare:'',
    pay_total_price:'0.00',
    contact_name: '', //联系人
    contact_phone: '', //联系电话
    garden: '', //所在小区
    address: '', //详细地址,
    resdata:0,
    startDate: "请选择",
    orderRemark:'',
    multiArray: [
      ['明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let toBuysongcai = wx.getStorageSync('toBuysongcai');
    console.log(toBuysongcai)
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      welfare:toBuysongcai
    })
    that.getLastOrderInfo();
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
      pay_total_price: (that.data.welfare.activityInfo.goods_price * that.data.welfare.pay_count).toFixed(2) - 0,

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
    openEdit() {
    let that = this;
    that.data.showEdit = !that.data.showEdit;
    that.setData({
      showEdit: that.data.showEdit
    })
  },
  getLastOrderInfo() {
    let that = this;
    console.log(that);
    common.get('/library/save_address', {
      'member_id': that.data.member_id,
      'type': 'select'
    }).then(res => {
      if (JSON.stringify(res.data.data) != "[]") {
        //获取数据成功
        that.setData({
          resdata:1,
          contact_name: res.data.data[0].contact_name ? res.data.data[0].contact_name : '',
          contact_phone: res.data.data[0].contact_phone ? res.data.data[0].contact_phone : '',
          garden: res.data.data[0].garden ? res.data.data[0].garden : '',
          address: res.data.data[0].address ? res.data.data[0].address : ''
        })
      } else {
        that.setData({
          resdata: 0,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
    })
  },
  chooseAddress(e) {
    console.log(e)
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //输入订单备注
  inputRemark(e) {
    this.setData({
      orderRemark: e.detail.value
    })
  },
  inputName(e) {
    this.setData({
      contact_name: e.detail.value
    })
  },
  inputPhone(e) {
    this.setData({
      contact_phone: e.detail.value
    })
  },
  inputAddrDetail(e) {
    this.setData({
      address: e.detail.value
    })
  },
  //保存地址
  saveAddress() {
    let that = this;
    let params = {
      member_id: that.data.member_id,
      contact_name: that.data.contact_name,
      contact_phone: that.data.contact_phone,
      garden: that.data.garden,
      address: that.data.address,
      "type": 1
    }
    console.log(params);
    if (!params.contact_phone) {
      wx.showToast({
        "title": "联系方式不能为空！",
        "icon": "none"
      })
      return
    }
    if (!(/^1[345678]\d{9}$/.test(params.contact_phone)) ) {
      wx.showToast({
        "title": "请填写正确的联系方式！",
        "icon": "none"
      })
      return
    }
    if (!params.contact_name) {
      wx.showToast({
        "title": "请填写姓名！",
        "icon": "none"
      })
      return
    }
    if (!that.data.address) {
      wx.showToast({
        "title": "请填写详细地址！",
        "icon": "none"
      })
      return
    }
    if (!that.data.garden) {
      wx.showToast({
        "title": "请选择省市区！",
        "icon": "none"
      })
      return
    }

    common.get("/library/save_address", params).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          showEdit:false
        })
      }
      if (res.data.code == 201) {
        wx.showToast({
          "title": res.data.msg,
          "icon": "none"
        })
        return
      }
    }).catch( error => {
      console.log(error);
    })
  },
  confirmBuy(){
    var that =this;
    var member_id = wx.getStorageSync('member_id');
    var member_tel = that.data.contact_phone;
    var address = that.data.garden;
    var detail_address = that.data.address;
    var booking_time = that.data.startDate1;
    var pay_price = that.data.pay_total_price;
    var pay_integral = ((that.data.welfare.activityInfo.goods_integral) *  that.data.welfare.pay_count).toFixed(2);
    var num = that.data.welfare.pay_count;
    var vegetable_id = that.data.welfare.activityInfo.id;
    var orderRemark = that.data.orderRemark;
    if (that.data.resdata == 0) {
      wx.showToast({
        "title": "请填写收货地址！",
        "icon": "none"
      })
      return
    }
    if (that.data.startDate == '' || that.data.startDate == '请选择') {
      wx.showToast({
        title: '请选择上门时间！',
        icon: 'none'
      })
      return
    }
    if(!that.data.abc){
      return
    }
    that.setData({
      abc: false
    })
    var parm = {
      member_id,
      member_tel,
      address,
      detail_address,
      booking_time,
      pay_price,
      pay_integral,
      num,
      vegetable_id,
      orderRemark,
    }
    wx.showModal({
      title: "",
      content: "确定购买吗？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在加载...',
          })
            common.get("/service/vegetable_order", parm).then(res => {
              if (res.data.code == 200) {
                wx.hideLoading()
                if (res.data.data != '') {
                  var $config = res.data.data;
                  wx.requestPayment({
                    timeStamp: $config['timeStamp'], //注意 timeStamp 的格式
                    nonceStr: $config['nonceStr'],
                    package: $config['package'],
                    signType: $config['signType'],
                    paySign: $config['paySign'], // 支付签名
                    success: function (res) {
                      // 支付成功后的回调函数
                      wx.showToast({
                        title: '支付成功',
                        duration: 1000,
                        icon: 'success'
                      })
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '/packageA/pages/submitState/index',
                        })
                      }, 1000)
                      return;
                    },
                    fail: function (e) {
                      console.log(e)
                      wx.showToast({
                        title: '支付失败！',
                        duration: 1000,
                        icon: 'none'
                      })
                      that.setData({
                        abc:true
                      })
                      return;
                    }
                  });
                } else {

                  wx.showToast({
                    title: res.data.msg,
                    duration: 1000,
                    icon: 'success'
                  })
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '/packageA/pages/submitState/index',
                    })
                  }, 1000)
                }

              } else if(res.data.code == -1){
                wx.hideLoading()
                wx.showToast({
                  title: '提交失败...',
                  icon:'none'
                })
                that.setData({
                  abc:true
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.mgs,
                  icon:'none'
                })
                that.setData({
                  abc:true
                })
              }
            }).catch(e =>{
              console.log(e)
            })
          
        }
      }
    })

    // common.get('/service/vegetable_order',parm).then(res =>{
      
    //   if(res.data.code == 200 ){
    //     wx.showToast({
    //       title: '提交成功！！！',
    //       icon:'success'
    //     })
    //     wx.redirectTo({
    //       url: '/packageA/pages/submitState/index',
    //     })
    //   }else{
    //     console.log(1)
    //     wx.showToast({
    //       title: '提交失败...',
    //       icon:'none'
    //     })
    //     that.setData({
    //       abc:true
    //     })
    //   }
    // }).catch(error => {
    //   console.log(error);
    //   that.setData({
    //     abc:true
    //   })
    // })
  },
  pickerTap: function () {
    date = new Date();
    var monthDay = ['今天', '明天'];

    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();
    console.log(currentHours);
    if (currentHours + 4 >= 18) {
      monthDay = ['明天'];
    }
    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    if (data.multiIndex[0] === 0 && monthDay[0] == '今天') {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }
    console.log(hours)
    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },
  bindMultiPickerColumnChange: function (e) {
    date = new Date();
    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();
    if (currentHours + 4 > 18) {
      monthDay = ['明天'];
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0 && monthDay[0] == '今天') {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 0 && monthDay[0] == '明天') {
      that.loadHoursMinute(hours, minute);
      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0 && monthDay[0] == '今天') {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0 && monthDay[0] == '今天') {

        // 如果第一列为 '今天'并且第二列为当前时间

        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }

      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },
  loadData: function (hours, minute) {
    date = new Date();
    currentHours = date.getHours();
    currentMinute = date.getMinutes();
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 4 + 1; i < 19; i++) {
        if (i < 7) {
          i = 7;
          hours.push(i);
        } else {
          hours.push(i);
        }
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours + 4; i < 19; i++) {
        if (i < 7) {
          i = 7;
          hours.push(i);
        } else {
          hours.push(i);
        }
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },
  loadHoursMinute: function (hours, minute) {
    date = new Date();
    currentHours = date.getHours();
    currentMinute = date.getMinutes();
    // 时
    for (var i = 7; i < 19; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },
  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 4; i < 19; i++) {
        if (i < 7) {
          i = 7;
        } else {
          hours.push(i);
        }
      }
    } else {
      // 时
      for (var i = currentHours + 4; i < 19; i++) {
        if (i < 7) {
          i = 7;
        } else {
          hours.push(i);
        }
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },
  bindStartMultiPickerChange: function (e) {
    console.log(e)
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var monthDay1 = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];
    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getYear();
      console.log(year)
      monthDay = month + "月" + day + "日";
      monthDay1 = month + "-" + day;

    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
      monthDay1 = (date1.getMonth() + 1) + "-" + date1.getDate();

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
      monthDay1 = month + "-" + day;

    }

    var startDate = monthDay + " " + hours + ":" + minute;
    var startDate1 = monthDay1 + "-" + hours + ":" + minute;
    console.log(startDate)
    console.log(startDate1)
    if (minute == 0) {
      that.setData({
        startDate: startDate + 0,
        startDate1
      })
    } else {
      that.setData({
        startDate: startDate,
        startDate1
      })
    }

  },
})