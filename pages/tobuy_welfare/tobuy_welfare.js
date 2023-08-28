const app = getApp()
const common = require('../../assets/js/common');
var WxParse = require('../../wxParse/wxParse.js');
const setting = require('../../assets/js/setting');
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    goodInfo: '',  //福利商品详情
    goodnum: '1',
    obtainType: 2,
    showEdit: false,
    buyer_address: '',
    buyer_ssq: '',
    orderRemark: '',
    delivery:'',
    pay_sum_mone:'',
    deliveryMethod: '', //邮寄配送方式
    deliveryPrice: 0, //邮寄价格
    deliveryDesc: false, //商品送达方式描述
    deliverySel:'请选择',
    deliveryFold: false,
    currentDelivery: 0,
    startDate: "请选择",
    pay_total_price:0,
    types: '',
    multiArray: [
      ['明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
    formData: {},
    discount_id:0,
    is_welfare:0,
    is_tuan: 0,
    is_duoren: 0,
    is_type:'',
    daze:0,
    is_duizhang: 0,
    is_duiyuan: 0,
    is_mian: 0,
    activity_id: 0,
    share_id:0,
    is_yzm: 0
  },
  onLoad: function(options) {
    let that = this;
    console.log(options)
    if(options.is_yzm){
      that.setData({
        is_yzm: options.is_yzm
      })
    }
    if (options.is_tuan == '1') {
      that.setData({
        is_tuan: options.is_tuan,
        business_id: options.business_id,
        obtainType:1,
      })
    }
    if (options.is_duoren == '1') {
      console.log(options.is_duoren)
      that.setData({
        is_duoren: options.is_duoren,
      })
    }
    console.log(that.data.is_duoren)

    if(options.is_idle){
      that.setData({
        is_idle:options.is_idle,
        business_id: options.business_id,
        
      })
    }
    if (options.is_welfare) {
      that.setData({
        is_welfare: options.is_welfare,
      })
    }
    if(options.id){
      that.setData({
        discount_id: options.id
      })
    }
    if (options.discount_id){
      that.setData({
        discount_id: options.discount_id
      })
    }
    if (options.is_type){
      that.setData({
        is_type: options.is_type,
        tuan_order_id:options.tuan_order_id,
      })
    }
    if(options.is_duizhang){
      that.setData({
        daze: Number(options.daze),
        is_duizhang: options.is_duizhang,
        is_duiyuan: options.is_duiyuan,
        activity_id: options.activity_id,
        share_id: options.share_id
      })
    }
    if(options.is_mian){
      that.setData({
        is_mian: options.is_mian,
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
  },
  onShow: function() {
    let that = this;
    let delivery = wx.getStorageSync("delivery")
    console.log(delivery)
    if (delivery){
      let delivery1 = JSON.parse(wx.getStorageSync("delivery")) 
      let deliveryNew = delivery1.filter(item => item.status == 1)
      delivery1 = deliveryNew
      that.setData({
        delivery: delivery1,
      })
    }else{
      that.setData({
        delivery,
      })
    }
    that.setData({
      currentDelivery: 0,
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
      welfare: wx.getStorageSync("toBuyWel"),
    })
    console.log(that.data.welfare)
    let obtain_typeList = JSON.parse(that.data.welfare.activityInfo.obtain_type);
    obtain_typeList.sort(function(a,b){
        return a-b;
    });
    this.setData({
      obtain_typeList: obtain_typeList,
      pay_total_price: (that.data.welfare.activityInfo.total_price * that.data.welfare.pay_count).toFixed(2) - 0,
    })
    if(that.data.is_duoren == 1){
      this.setData({
        pay_total_price: (that.data.welfare.activityInfo.tuan_price * that.data.welfare.pay_count).toFixed(2) - 0,

      })
    }
    console.log(that.data.obtain_typeList)
    if ( obtain_typeList.length == 1 && that.data.is_tuan == 0) {
      this.setData({
        obtainType: obtain_typeList[0],
        deliverySel: obtain_typeList[0] == 1 ? '到店自提' : '请选择邮寄方式'
      })
    }
    if (obtain_typeList.length > 1 && that.data.is_tuan == 1) {
      this.setData({
        obtainType: obtain_typeList[0],
        deliverySel: obtain_typeList[0] == 1 ? '到店自提' : '送货上门'
      })
    }
    if (that.data.obtainType == 2) {
      let that = this;
      let delivery = that.data.delivery[0];
      console.log(that.data.delivery)
      console.log(delivery)
      let method = {
        'id': delivery.id,
        'name': delivery.name,
        'price': delivery.price,
        'showPrice': delivery.showprice
      }
      this.setData({
        deliveryMethod: method,
        deliveryPrice: parseFloat(delivery.price),
        deliverySel: delivery.name.replace(/&emsp;&emsp;&emsp;/g, '') + ' ' + delivery.showPrice
      })
    }
    common.get("/business/getMemberFreightAddress", { "member_id": that.data.member_id }).then( res => {
      console.log(res)
      if (res.data.code == 200 && res.data.data.length > 0) {
        that.setData({
          buyer_address: res.data.data[0]
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  obtainTypeChange(e) {
    let that = this;
    if (e.detail.value == 1){
      this.setData({
        deliveryPrice: 0,
        deliveryMethod:'',
        deliverySel: '到店自提'
      })
    } else if(e.detail.value == 2){
      let that = this;
      let delivery = that.data.delivery[0];
      let method = {
        'id': delivery.id,
        'name': delivery.name,
        'price': delivery.price,
        'showPrice': delivery.showprice
      }
      this.setData({
        currentDelivery: 0,
        deliveryMethod: method,
        deliveryPrice: parseFloat(delivery.price),
        deliverySel: delivery.name.replace(/&emsp;&emsp;&emsp;/g, '') + ' ' + delivery.showPrice
      })
    }
    if (e.detail.value == 3){
      this.setData({
        deliveryPrice: 0,
        deliveryMethod: '',
        deliverySel: '送货上门'
      })
    }
    this.setData({
      obtainType: e.detail.value
    })
  },
  deliveryfold(){
    this.setData({
      deliveryFold: this.data.deliveryFold ? false : true
    })
  },
  //选择付费邮寄方式
  deliveryListChange(e){
    console.log(e)
    let that = this
    let method = { 
      'id': e.currentTarget.dataset.id,
      'name': e.currentTarget.dataset.name, 
      'price': e.currentTarget.dataset.price, 
      'showPrice': e.currentTarget.dataset.showprice
    }
    that.setData({
      currentDelivery: e.currentTarget.dataset.index,
      deliveryPrice: parseFloat(e.currentTarget.dataset.price),
      deliveryMethod: method,
      deliverySel: e.currentTarget.dataset.name.replace(/&emsp;&emsp;&emsp;/g, '') + ' ' + e.currentTarget.dataset.showprice
    })
    console.log(that.data.currentDelivery)
  },
  openEdit() {
    let that = this;
    that.data.showEdit = !that.data.showEdit;
    that.setData({
      showEdit: that.data.showEdit
    })
  },
  chooseAddress(e) {
    console.log(e)
    this.setData({
      buyer_ssq: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
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
      buyer_name: e.detail.value
    })
  },
  inputPhone(e) {
    this.setData({
      buyer_phone: e.detail.value
    })
  },
  inputAddrDetail(e) {
    this.setData({
      buyer_addressDetail: e.detail.value
    })
  },
  //保存地址
  saveAddress() {
    let that = this;
    let params = {
      "member_id": that.data.member_id,
      "name": that.data.buyer_name,
      "phone": that.data.buyer_phone,
      "address": that.data.buyer_ssq + that.data.buyer_addressDetail,
      "type": 1
    }
    console.log(params);
    if (!params.phone) {
      wx.showToast({
        "title": "联系方式不能为空！",
        "icon": "none"
      })
      return
    }
    if ( !(/^1[3456789]\d{9}$/.test(params.phone)) ) {
      wx.showToast({
        "title": "请填写正确的联系方式！",
        "icon": "none"
      })
      return
    }
    if (!params.name) {
      wx.showToast({
        "title": "请填写姓名！",
        "icon": "none"
      })
      return
    }
    if (!that.data.buyer_addressDetail) {
      wx.showToast({
        "title": "请填写详细地址！",
        "icon": "none"
      })
      return
    }
    if (!that.data.buyer_ssq) {
      wx.showToast({
        "title": "请选择省市区！",
        "icon": "none"
      })
      return
    }
    common.get("/business/memberFreightAddress", params).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          buyer_address: params,
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
  
  //查看商品送达描述
  deliveryDesc(){
    this.setData({
      deliveryDesc: this.data.deliveryDesc ? false : true
    })
  },
  pickerTap: function () {
    let date = new Date();
    var monthDay = ['明天'];

    var hours = [];
    var minute = [];

    let currentHours = date.getHours();
    let currentMinute = date.getMinutes();
    console.log(currentHours);
    if (currentHours + 4 > 18) {
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
      date: date,
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
  loadData: function (hours, minute) {
    var date = new Date();
    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();
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
    var date = new Date();
    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();
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
    var that = this;
    var date = that.data.date;
    console.log(date)
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];
    
    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      startDate: startDate
    })
  },
  //获取废品类型
  logintestGoTo() {
    console.log('校验是否登录');
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      console.log('未授权用户')
      wx.showModal({
        title: '预约下单，请先登录！',
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
      // return;
    } else {
      wx.navigateTo({
        url: '/pages/huishou/types/index'
      })
    }
  },
  logintest() {
    console.log('校验是否登录');
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      console.log('未授权用户')
      wx.showModal({
        title: '预约下单，请先登录！',
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
      // return;
    }
  },
  //提交订单
  confirmBuy() {
    let that = this;
    let is_yzm = that.data.is_yzm;
    if (that.data.obtainType == '') {
      wx.showToast({
        title: '请选择送达方式',
        icon: 'none'
      })
      return;
    }
  
    if (that.data.obtainType >= 1 &&  that.data.buyer_address == '') {
      wx.showToast({
        title: '请先设置您的收货地址！',
        icon: 'none'
      })
      return;
    }
    if (that.data.obtainType == 2) {
      if (that.data.deliveryMethod == ''){
        wx.showToast({
          title: '请选择付费邮寄方式',
          icon: 'none'
        })
        return;
      }
      if (that.data.deliveryMethod.id == 3 && that.data.startDate == '请选择') {
        wx.showToast({
          title: '请选择上门时间',
          icon: 'none'
        })
        return;
      }
      if (that.data.deliveryMethod.id == 3 && that.data.types == '') {
        wx.showToast({
          title: '请选择废品类型',
          icon: 'none'
        })
        return;
      }
    }
    that.setData({
      pay_sum_mone: (that.data.welfare.activityInfo.total_price * that.data.welfare.pay_count + parseFloat(that.data.deliveryPrice)).toFixed(2)
    })
    if (that.data.welfare.activityInfo.tuan_price > 0 && that.data.is_duoren == 1){
      console.log('total_price > 0 && is_duoren == 1')
      that.setData({
          pay_sum_mone: (that.data.welfare.activityInfo.tuan_price * that.data.welfare.pay_count + parseFloat(that.data.deliveryPrice)).toFixed(2)
      })
      }
    if(that.data.is_duoren == 0){
      var param = {
        member_id: that.data.member_id,
        business_id: that.data.welfare.business_id,
        copy_business: that.data.welfare.copy_business,
        business_discount_id: that.data.welfare.business_discount_id,
        pay_sum_jifen: (that.data.welfare.activityInfo.hbb * that.data.welfare.pay_count).toFixed(2),
        pay_total_money: that.data.pay_sum_mone,
        pay_sum_money: that.data.pay_sum_mone,
        pay_count: that.data.welfare.pay_count,
        obtain_type: that.data.obtainType,
        obtain_name: that.data.buyer_address.name,
        obtain_phone: that.data.buyer_address.phone,
        obtain_address: that.data.buyer_address.address,
        deliveryMethod: that.data.deliveryMethod,
        deliveryPrice: that.data.deliveryPrice,
        remark: that.data.orderRemark,
        is_idle: that.data.is_idle,
        is_welfare: that.data.is_welfare,
        is_tuan: that.data.is_tuan,

      }
      if(that.data.is_duizhang == '1' && that.data.is_duiyuan == '1' ){
        param.share_id = that.data.share_id;
      }
      if(that.data.is_duizhang == '1' && that.data.is_mian == '1'){
        param.my_share = that.data.share_id;
      }
      if (that.data.is_idle) {
        console.log(that.data.is_idle)
        param.business_id = that.data.business_id
        param.business_discount_id = that.data.discount_id
      }
        
    var formData = ''
    if (that.data.formData && that.data.types){
      formData = that.data.formData
      formData.wastetime = that.data.startDate
      formData.wastetypes = that.data.types
    }
    param.formData = formData
    }else if(that.data.is_duoren == 1){
      console.log('is_duoren:'+that.data.is_duoren)
      var param = {
        member_id: that.data.member_id,
        business_id: that.data.welfare.business_id,
        discount_id: that.data.welfare.business_discount_id,
        pay_sum_jifen: (that.data.welfare.activityInfo.hbb * that.data.welfare.pay_count).toFixed(2),
        pay_total_money: that.data.pay_sum_mone,
        pay_sum_money: that.data.pay_sum_mone,
        pay_count: that.data.welfare.pay_count,
        tuan_num: that.data.welfare.activityInfo.tuan_num,
        type:'make',
        obtain_type: that.data.obtainType,
        obtain_name: that.data.buyer_address.name,
        obtain_phone: that.data.buyer_address.phone,
        obtain_address: that.data.buyer_address.address,
        deliveryMethod: that.data.deliveryMethod,
        deliveryPrice: that.data.deliveryPrice,
        remark: that.data.orderRemark,
        is_tuan: that.data.is_tuan,
      }
      if(is_yzm){
        param.is_yz = is_yzm;
        param.yz_id = wx.getStorageSync('yz_id');
      }
      if(that.data.is_type == 'join'){
        param.type='join',
        param.tuan_order_id = that.data.tuan_order_id
      }
        
    var formData = ''
    if (that.data.formData && that.data.types){
      formData = that.data.formData
      formData.wastetime = that.data.startDate
      formData.wastetypes = that.data.types
    }
    param.formData = formData
    }
    wx.showModal({
      title: "",
      content: "确定购买吗？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在加载...',
          })
          if(that.data.is_duoren == 0){
            common.get("/business/createDiscountOrder", param).then(res => {
              wx.hideLoading();
              if (res.data.code == 200) {
                if (res.data.data != '') {
                console.log('有支付签名')

                  var $config = res.data.data

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
                      if(is_yzm){
                        setTimeout(function () {
                          wx.reLaunch({
                            url: 'packageB/pages/postStationCode/index'
                          })
                        }, 1500)
                      }else{
                        if(that.data.is_duizhang == '1'){
                          let activity_id = that.data.activity_id;
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '/packageA/pages/home_page/volunacti_details/index?id=' + activity_id
                            })
                          }, 1500)
                          return;
                        }else{
                          setTimeout(function () {
                            wx.navigateTo({
                              url: '/pages/tobuy_welfare/pay_succcess'
                            })
                          }, 1000)
                          return;
                        }
                      }


                    },
                    fail: function (e) {
                      console.log(e)
                      wx.showToast({
                        title: '支付失败！',
                        duration: 1000,
                        icon: 'none'
                      })
                      return;
                    }
                  });
                } else {
                  console.log('没有支付签名')

                  wx.showToast({
                    title: res.data.msg,
                    duration: 1000,
                    icon: 'success'
                  })
                  if(is_yzm){
                    setTimeout(function () {
                      wx.reLaunch({
                        url: 'packageB/pages/postStationCode/index'
                      })
                    }, 1500)
                  }else{
                    if(that.data.is_duizhang == '1'){
                      let activity_id = that.data.activity_id;
                      setTimeout(function () {
                        wx.navigateTo({
                          url: '/packageA/pages/home_page/volunacti_details/index?id=' + activity_id
                        })
                      }, 1500)
                      return;
                    }else{
                      setTimeout(function () {
                        wx.navigateTo({
                          url: '/pages/tobuy_welfare/pay_succcess'
                        })
                      }, 1000)
                      return;
                    }
                  }

                }

              } else {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'none'
                })
              }
            }).catch(e =>{
              wx.hideLoading();
              console.log(e)
            })
          }else if(that.data.is_duoren == 1){
            common.post("/service/to_tuan_order", param).then(res => {
              wx.hideLoading();
              if (res.data.code == 200) {
                if (res.data.data.data != '') {
                  var $config = res.data.data.data;
                  var tuan_order_id = res.data.data.tuan_order_id;
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
                        wx.navigateTo({
                          url: '/packageA/pages/tuan_success/tuan_success?business_id='+that.data.welfare.business_id +'&discount_id='+ that.data.welfare.business_discount_id + '&is_tuan='+that.data.is_tuan + '&tuan_order_id=' + tuan_order_id
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
                    wx.navigateTo({
                      url: '/pages/tobuy_welfare/pay_succcess?business_id='+that.data.welfare.business_id +'&discount_id='+ that.data.welfare.business_discount_id + '&is_tuan='+that.data.is_tuan
                    })
                  }, 1000)
                }

              } else if(res.data.code == -1){
                wx.hideLoading()
                wx.showToast({
                  title: res.data.mgs,
                  duration: 1000,
                  icon: 'none'
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.mgs,
                  duration: 1000,
                  icon: 'none'
                })
              }
            }).catch(e =>{
              wx.hideLoading();
              console.log(e)
            })
          }
          
        }
      }
    })
  },
  onHide() {
  },
  onUnload() {
  },
})