const app = getApp();
const common = require('../../../assets/js/common');
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    startDate: "请选择",
    savaStatus: true,
    tancheng:false,
    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
    contact_name: '', //联系人
    member_tel: '', //联系电话
    address_start: '', //搬出地址省市
    detail_address_start: '', //搬出详细地址,
    address_end:'', // 搬入地址省市
    detail_address_end:'', //搬入详细地址 
    floor_start:'',  // 搬出楼层
    floor_end:'',  // 搬入楼层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member_id = wx.getStorageSync('member_id');
    if(options.type){
      this.setData({
        member_id,
        type:options.type
      })
    }
    
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
  onPullDownRefresh() { 

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

  pickerTap: function () {
    date = new Date();
    console.log(date)
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
      for (var i = currentHours+4+1; i < 19; i++) {
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
      for (var i = currentHours+4; i <= 19; i++) {
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
    if (minute == 0){
      that.setData({
        startDate: startDate + 0,
        startDate1
      })
    }else{
      that.setData({
        startDate: startDate,
        startDate1
      })
    }
    
  },
  member_tel(e) {
  console.log(e.detail.value)
  this.setData({
    member_tel: e.detail.value
  })
},
//搬出地址省市
address_start(e) {
  console.log(e)
  this.setData({
    address_start: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2]),
  })
  console.log(this.data.address_start)
},
// 搬入地址省市
address_end(e){
  this.setData({
    address_end: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2]),
  })
},

//搬出详细地址
detail_address_start(e) {
  this.setData({
    detail_address_start: e.detail.value
  })
},
// 搬入详细地址
detail_address_end(e) {
  this.setData({
    detail_address_end:e.detail.value
  })
},
// 搬出楼层
floor_start(e) {
  this.setData({
    floor_start:e.detail.value
  })
},
// 搬入楼层
floor_end(e) {
  this.setData({
    floor_end:e.detail.value
  })
},
//点击信息弹窗遮罩层
mask1(){
  let that = this;
  that.setData({
    information: false,
  })
},
// 禁止穿透滚动
myCatchTouch(){
  return
},
formReset(e) { //提交
  console.log(e)
    let that = this
    let savaStatus = that.data.savaStatus;

    if(that.data.address_start== ''){
      wx.showToast({
        title: '请输入搬出省市！',
        icon: 'none',
      })
      return
    }
    if(that.data.detail_address_start== ''){
      wx.showToast({
        title: '请输出搬出详细地址！',
        icon: 'none',
      })
      return
    }
    if(that.data.floor_start== ''){
      wx.showToast({
        title: '请输入搬出楼层！',
        icon: 'none',
      })
      return
    }
    if(that.data.address_end== ''){
      wx.showToast({
        title: '请输入搬入省市！',
        icon: 'none',
      })
      return
    }
    if(that.data.detail_address_end== ''){
      wx.showToast({
        title: '请输入搬入详细地址！',
        icon: 'none',
      })
      return
    }
    if(that.data.floor_end== ''){
      wx.showToast({
        title: '请输入搬入楼层！',
        icon: 'none',
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
    if (!(/^1[345678]\d{9}$/.test(that.data.member_tel)) ) {
      wx.showToast({
        title: '请输入正确的电话号码！',
        icon: 'none',
      })
      return
    }

    let param ={
      "member_id": that.data.member_id,
      "type": that.data.type,
      "address_start": that.data.address_start,
      "floor_start":that.data.floor_start,
      "detail_address_start":that.data.detail_address_start,
      "address_end":that.data.address_end,
      "floor_end":that.data.floor_end,
      "detail_address_end":that.data.detail_address_end,
      "booking_time": that.data.startDate1,
      "member_tel": that.data.member_tel,
    };
    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    wx.showNavigationBarLoading();
    common.get('/service/house_moving', param).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功！！！',
          icon:'success'
        })
        wx.redirectTo({
          url: '/packageA/pages/submitState/index',
        })
      } else {
        console.log("错误：" + res)
        that.setData({
          savaStatus: true
        })
        app.showToast({
          title: res.data.msg
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      console.log(e)
    })

  },
  logintest() {
    console.log('校验是否登录');
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      console.log('未授权用户')
      wx.showModal({
        title: '预约，请先登录！',
        success: function (res) {
          if (res.confirm) {
            console.log('点击了确认');
            wx.reLaunch({
              url: '/pages/mine/index/index'
            })
          } else if (res.cancel) {
            console.log('点击了取消')
          }
        }
      })
    }
  },
  hlep_bangzhu(){
    this.setData({
      tancheng:true
    })
  },
  mark(){
    this.setData({
      tancheng:false
    })
  },
  colse(){
    this.setData({
      tancheng:false
    })
  }
})