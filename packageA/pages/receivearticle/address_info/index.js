const app = getApp()
const common = require('../../../../assets/js/common');
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name:'',
    phone:'',
    address:'',
    address_details:'',
    remark:'',
    startDate: "",
    startDate1:'',
    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
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
    that.setData({
      id:options.id
    })
    common.get('/collect_clothes/address_info', {
      'member_id': wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        //获取数据成功
        that.setData({
          name: res.data.data.name ? res.data.data.name : '',
          phone: res.data.data.phone ? res.data.data.phone : '',
          address: res.data.data.address ? res.data.data.address : '',
          address_details: res.data.data.address_details ? res.data.data.address_details : ''
        })
      } else {
        app.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {

      console.log(e)
    })
    console.log(that.data.startDate1)
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
  getinputname(e){
    this.setData({
      name:e.detail.value
    })
  },
  getinputteph(e){
    this.setData({
      phone:e.detail.value
    })
  },
  getinputliuyan(e){
    this.setData({
      address_details:e.detail.value
    })
  },
  getinputbeizhu(e){
    this.setData({
      remark:e.detail.value
    })
  },



  changeWealfareGoods() {
    let that = this;
    if (that.data.welfare_page >= (that.data.welfareGoodsCount)){
      console.log(that.data.welfareGoodsCount)
      console.log(that.data.welfare_page)
      that.setData({
        welfare_page: 0
      })
      that.getWelfareGoods();
      return
    }
    that.setData({
      welfare_page: that.data.welfare_page += 1
    })
    that.getWelfareGoods();
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

  saveGarden(e) {
    console.log(e)
    this.setData({
      address: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },

  submitdata(){
    let that = this;
    let parems = {
      'id':that.data.id,
      'member_id':wx.getStorageSync('member_id'),
      'name':that.data.name,
      'phone':that.data.phone,
      'address':that.data.address,
      'address_details':that.data.address_details,
      'home_time':that.data.startDate1,
      'remark':that.data.remark
    }
    if (parems.name == ''){
      wx.showToast({
        title: '姓名不能为空！',
        icon:'none'
      })
      return
    }
    if (parems.phone == '' ) {
      wx.showToast({
        title: '电话不能为空！',
        icon: 'none',
      })
      return
    }
    if (parems.address == '' ) {
      wx.showToast({
        title: '地址不能为空！',
        icon: 'none',
      })
      return
    }
    if (parems.address_details == '' ) {
      wx.showToast({
        title: '详细地址不能为空！',
        icon: 'none',
      })
      return
    }
    if (!(/^1[345678]\d{9}$/.test(parems.phone)) ) {
      wx.showToast({
        title: '请输入正确的电话号码！',
        icon: 'none',
      })
      return
    }
    if (parems.home_time == '') {
      wx.showToast({
        title: '请选择预约时间！',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      cancelColor: 'cancelColor',
      content:'平台收到物品后，根据实物给出实物二次估价，如果您拒绝实物估价，平台将您的物品到付邮寄给您，接受实物估价，则实物金额到账我的钱包。',
      showCancel:false,
      confirmColor:'#4bc381',
      success(res) {
        if(res.confirm){
          wx.showLoading({
            title: '提交中...',
          })
          common.get('/collect_clothes/add_address', parems).then(res => {
            if (res.data.code == 200) {
              wx.hideLoading();
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
              wx.redirectTo({
                url: '/packageA/pages/receivearticle/submitState/index',
              })
            } else {
              console.log("错误：" + res)
              app.showToast({
                title: res.data.msg
              })
            }
          }).catch(e => {
            console.log(e)
          })
      
        }
      }
    })

  }
})