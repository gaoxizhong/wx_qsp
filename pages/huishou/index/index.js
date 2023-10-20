const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
const Makephoto = require('../../../assets/js/setting');
const zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({
  data: {
    formData: {},
    img_url: app.data.imgUrl,
    types_a: '',
    savaStatus: true,
    startDate: "请选择",
    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20],
    ],
    multiIndex: [0, 0, 0],
    cityArray: [
      ['北京'],
      ['北京市'],
      ['朝阳区'],
      ['来广营乡'],
    ],
    cityIndex: [0,0,0,0],
    obj : [],
    sum_price:0,
    sum_hbb: 0,
    goods_name:'',
    contact_name: '', //联系人
    contact_phone: '', //联系电话
    garden: '', //所在小区
    address: '', //详细地址,
    swiperCurrent: 0,
    welfareGoodsList: [], //福利商品列表
    tipsShow: false, //是否展示回收订单简单信息
    sel_welfaregood_list: [], //选取的福利商品
    welfare_page: 0, //福利商品的当前页
    showRecover: false, //是否展现回收人员
    cateList:[], // 废品类型
    selectedRecover:{},
    idx:true,
    makephoto: false,
    makephoto_img: '',
    longitude: '',
    latitude: '',
    is_preview:false,
    company_name:'',
    integral:'',
    avatar:'',
    business_id:'',
    lx:true,
    position:false,
    chengde_name:'',
    chengde_phone:'',
    chengde_school:'',
    chengde_class:'',
    elect:'',
    ad_content:{},
    selectDeta: '',
  },
  onTabItemTap(item) {
    if (item.index == 3) {
      wx.hideTabBarRedDot({
        index: 3
      })
    }
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info')
    })
    that.getData();
    // that.getCategory(); // 废品类型列表
    let goodList = app.data.shopCar.goodList;
    let payStatus = app.data.shopCar.payStatus;
    let total = app.data.shopCar.total;
    let types_a = app.data.shopCar.types_a;
    let elect = app.data.shopCar.elect;
    that.setData({
      // formData:app.data.shopCar,
      goods:goodList,
      pay_mode:payStatus,
      total,
      types_a,
      elect,
    })
    that.getLastOrderInfo();
  },
  onShow: function () {
    let that = this
    console.log(that.data.selectDeta)
    that.setData({
      selectDeta: that.data.selectDeta
    })
    let member_id = wx.getStorageSync('member_id')
    that.hasGoodInCar();
    if (app.data.welfareGood.id) {
      let item = that.data.sel_welfaregood_list.find(ele => {
        return ele.goods_id == app.data.welfareGood.id
      })
      if (item) {
        item.goods_num = app.data.welfareGood.num
      } else {
        that.data.sel_welfaregood_list.push({
          "goods_id": app.data.welfareGood.id,
          "goods_num": app.data.welfareGood.num,
          "total_price": app.data.welfareGood.total_price,
          "hbb": app.data.welfareGood.hbb,
          "goods_name": app.data.welfareGood.goods_name

        })
      }
      that.setData({
        sel_welfaregood_list: that.data.sel_welfaregood_list
      })
      app.data.welfareGood = {
        "id": '',
        "num": '',
        "total_price":'',
        "hbb":'',
        "goods_name":''
      }
    }
    that.setData({
      information: false,
    });
    that.getWelfareGoods();
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];

    console.log(currentPage.data.selectedRecover)
    that.setData({
      selectedRecover:currentPage.data.selectedRecover
    })
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  getData() {
    let that = this;
  },
  //选取福利商品
  selWelfareGoods(e) {
    let that = this;
    let goodid = e.currentTarget.dataset.id;
    let total_price = e.currentTarget.dataset.total_price;
    let hbb = e.currentTarget.dataset.hbb;
    let goods_name = e.currentTarget.dataset.goods_name;
    let bal_count = e.currentTarget.dataset.bal_count;
    let sel_welfaregood_list = that.data.sel_welfaregood_list;
    let welfareGoods = that.data.welfareGoodsList;
    if ( bal_count == 0 ){
      wx.showToast({
        title: '此商品库存不足！',
        icon:'none'
      })
      return
    }
    //在已选好的里面找有没有重复的
    let hasfindindex = sel_welfaregood_list.findIndex(ele => {
      return ele.goods_id == goodid
    })
    if (hasfindindex == -1) {
      //没找到 选中
      sel_welfaregood_list.push({
        "goods_id": goodid,
        "goods_num": 1,
        "total_price": total_price,
        "hbb": hbb,
        "goods_name": goods_name,
      });
      welfareGoods.forEach(ele1 => {
        sel_welfaregood_list.forEach(ele2 => {
          if (ele1.id == ele2.goods_id) {
            ele1.showSel = true;
          }
        })
      })
      that.setData({
        sel_welfaregood_list: sel_welfaregood_list,
        welfareGoodsList: welfareGoods
      })
    } else {
      //找到了  取消
      welfareGoods.forEach(ele => {
        if (ele.id == sel_welfaregood_list[hasfindindex].goods_id) {
          ele.showSel = false;
        }
      })
      sel_welfaregood_list.splice(hasfindindex, 1);
      that.setData({
        sel_welfaregood_list: sel_welfaregood_list,
        welfareGoodsList: welfareGoods
      })
    }

  },
  //前往福利详情
  goToInfo(e) {
    let that = this;
    let goodid = e.currentTarget.dataset.id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let business_id = e.currentTarget.dataset.business_id;
    let item = that.data.sel_welfaregood_list.find(ele => {
      return ele.goods_id == goodid;
    })
    if (item) {
      wx.navigateTo({
        url: ("/pages/welfare_goodinfo/welfare_goodinfo?goodnum=" + item.goods_num + "&goodid=" + goodid + "&business_id=" + business_id)
      })
    } else {
      wx.navigateTo({
        url: ("/pages/welfare_goodinfo/welfare_goodinfo?goodnum=" + 1 + "&goodid=" + goodid + "&business_id=" + business_id)
      })
    }
  },
  swiperChange: function (e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  getLastOrderInfo() {
    let that = this;
    common.get('/library/save_address', {
      member_id: that.data.member_id,
      type: 'select',
      lng:that.data.longitude,
      lat:that.data.latitude
    }).then(res => {
      if (JSON.stringify(res.data.data) != "[]") {
        //获取数据成功
        that.setData({
          contact_name: res.data.data[0].contact_name ? res.data.data[0].contact_name : '',
          contact_phone: res.data.data[0].contact_phone ? res.data.data[0].contact_phone : '',
          garden: res.data.data[0].garden ? res.data.data[0].garden : '',
          address: res.data.data[0].address ? res.data.data[0].address : '',
          chengde_name:res.data.data[0].chengde_name?res.data.data[0].chengde_name:'',
          chengde_phone:res.data.data[0].chengde_phone?res.data.data[0].chengde_phone:'',
          chengde_school:res.data.data[0].chengde_school?res.data.data[0].chengde_school:'',
          chengde_class:res.data.data[0].chengde_class?res.data.data[0].chengde_class:'',
          position:res.data.position,
        })
      } else {

      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
    })
  },
  //保存地址
  saveAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  //阻止滚动穿透
  preventScroll() {
    return;
  },
  // 获取时间
  gotostartDatename(){
    wx.navigateTo({
      url: '/packageB/pages/subscribe_date/index',
    })
  },
  //获取回收人员
  getRecoverStaff(e) {
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/person_select/index',
    })
  },
  logintestGoTo(e) {
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      wx.showModal({
        title: '预约下单，请先登录！',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/mine/index/index'
            })
          } else if (res.cancel) {
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
  savaData(e) { //提交
    let that = this
    let sum_price = 0;
    let sum_hbb = 0;
    let selectedRecover = that.data.selectedRecover;
    console.log(selectedRecover)
    that.data.sel_welfaregood_list.forEach(ele => {
      sum_price += (Number(ele.total_price) * ele.goods_num).toFixed(2) - 0;
      sum_hbb += (Number(ele.hbb) * ele.goods_num).toFixed(2) - 0;
      that.setData({
        sum_price: sum_price,
        sum_hbb: sum_hbb
      })
    })

    if (that.data.contact_name == '' || that.data.contact_phone == '' ){
      wx.showToast({
        title: '请填写用户信息！',
        icon:'none'
      })
      return
    }

    if (that.data.selectDeta == '' || that.data.selectDeta == '请选择') {
      wx.showToast({
        title: '请选择上门时间！',
        icon: 'none'
      })
      return
    }
    if ( JSON.stringify(selectedRecover) == "{}" ) {
      wx.showToast({
        title: '请选择回收专员！',
        icon: 'none'
      })
      return
    }
    if ( that.data.types_a == '' ) {
      wx.showToast({
        title: '请选择废品类型！',
        icon: 'none'
      })
      return
    }
    publicMethod.getFormId(e, this)
    let savaStatus = that.data.savaStatus;
    let formData1 = e.detail.value;
    let formData = that.data.formData;
    let recover_name = that.data.selectedRecover.name;
    let recover_phone = that.data.selectedRecover.phone;
    // let welfare_goods =[];
    let param = Object.assign(formData1, formData,{
      "welfare_goods": that.data.sel_welfaregood_list,
      "goods": that.data.goods,
      "pay_mode": that.data.pay_mode,
      "member_id": that.data.member_id,
      "metting_time":that.data.startDate1,
      "address": that.data.address ,
      "contact_name": that.data.contact_name,
      "garden": that.data.garden,
      "contact_phone": that.data.contact_phone,
      "recover_id": that.data.selectedRecover.id,
      "recover_name": recover_name,
      "recover_phone": recover_phone,
      "longitude": that.data.longitude,
      "latitude": that.data.latitude,
      "elect": that.data.elect,
      chengde_name:that.data.chengde_name,
      chengde_phone:that.data.chengde_phone,
      chengde_school:that.data.chengde_school,
      chengde_class:that.data.chengde_class,
    });

    // return;
    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    wx.setStorageSync('visited_at', param.visited_at);
    wx.setStorageSync('garden', param.garden);
    wx.showNavigationBarLoading();

    if (that.data.sel_welfaregood_list.length > 0) {
      wx.showModal({
        title: "",
        content: "确定购买福利商品吗？",
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '提交中...',
            })
            common.post('/recover/pay_money_order', param).then(res => {
              if (res.data.code == 200) {
                var request_type = res.data.data.request_type
                app.data.shopCar = {
                  goodList: [], //商品详情
                  payStatus: '', //支付方式
                  total: '', //总额
                  types_a: ''
                }
                wx.hideLoading()
                if (res.data.data.data != '') {
                  var $config = res.data.data.data
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
                        icon: 'success',
                        success: function () {
                          param.request_type = request_type;
                          common.post('/recover/createOrder', param).then(res => {
                            if (res.data.code == 200) {
                              app.data.shopCar = {
                                goodList: [], //商品详情
                                payStatus: '', //支付方式
                                total: '', //总额
                                types_a: ''
                              }
                              let pop_ad = res.data.data;
                              wx.showToast({
                                title: res.data.msg,
                                duration: 1000,
                                icon: 'success',
                                duration:1500,
                                success:function(){
                                  setTimeout(function(){
                                    wx.reLaunch({
                                      url: '/pages/circle/circle',
                                    })
                                  },1500)
                                } 
                              })
                            } else {
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
                            app.showToast({
                              title: e.data.message,
                            })
                            console.log(e)
                          })
                        }
                      })

                    },
                    fail: function (e) {
                      wx.showToast({
                        title: '支付失败！',
                        duration: 1000,
                        icon: 'none'
                      })
                      that.setData({
                        savaStatus: true
                      })
                      return;
                    }
                  });
                } else {
                  param.request_type = request_type;
                  common.post('/recover/createOrder', param).then(res => {
                    if (res.data.code == 200) {
                      let pop_ad = res.data.data;
                      wx.showToast({
                        title: res.data.msg,
                        duration: 1000,
                        icon: 'success',
                        duration:1500,
                        success:function(){
                          setTimeout(function(){
                            wx.reLaunch({
                              url: '/pages/circle/circle',
                            })
                          },1500)
                        } 
                      })
                      app.data.shopCar = {
                        goodList: [], //商品详情
                        payStatus: '', //支付方式
                        total: '', //总额
                        types_a: ''
                      }
                    } else {
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
                    app.showToast({
                      title: "数据异常",
                    })
                    console.log(e)
                  })
                }

              } else {
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
              app.showToast({
                title: "数据异常",
              })
              console.log(e)
            })

          } else if (res.cancel){
            that.setData({
              savaStatus: true
            })
          }
        }
      })
    }else{
      wx.showLoading({
        title:'提交中...'
      })
      common.post('/recover/pay_money_order', param).then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          var request_type = res.data.data.request_type
          app.data.shopCar = {
            goodList: [], //商品详情
            payStatus: '', //支付方式
            total: '', //总额
            types_a: ''
          }
          param.request_type = request_type;
          wx.showLoading({
            title: '提交中...',
          })
          common.post('/recover/createOrder', param).then(res => {
            wx.hideLoading();
            if (res.data.code == 200) {
              let pop_ad = res.data.data;
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'success',
                duration:1500,
                success:function(){
                  setTimeout(function(){
                    wx.reLaunch({
                      url: '/pages/circle/circle',
                    })
                  },1500)
                } 
              })
            } else {
              that.setData({
                savaStatus: true
              })
              app.showToast({
                title: res.data.msg
              })
            }
          }).catch(e => {
            wx.hideLoading();
            that.setData({
              savaStatus: true
            })
            console.log(e)
          })

        } else {
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
        wx.hideLoading();
        console.log(e)
      })
    }

  },

  click_bg(){
    this.setData({
      is_preview:false
    })
  },
  // =================== 新增 ===================
  goto_adshop(e){
    publicMethod.goto_adshop(e,this);
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // =================== 新增 ===================

  //获取今日福利
  getWelfareGoods() {
    let that = this;
    common.get("/welfare/revcover_welfare", {
      page: that.data.welfare_page
    }).then(res => {
      if (res.data.code == 200) {
        res.data.data.goods_info.forEach(element => {
          element.showSel = false;
        });
        res.data.data.goods_info.forEach(ele1 => {
          that.data.sel_welfaregood_list.forEach(ele2 => {
            if (ele1.id == ele2.goods_id) {
              ele1.showSel = true;
            }
          })
        })
        that.setData({
          welfareGoodsList: res.data.data.goods_info,
          welfareGoodsCount: res.data.data.all_page
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  //更换今日福利
  changeWealfareGoods() {
    let that = this;
    if (that.data.welfare_page >= (that.data.welfareGoodsCount)){
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
    var monthDay = ['今天', '明天'];

    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();
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
      for (var i = currentHours+4; i < 19; i++) {
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
  //判断表单中是否有商品
  hasGoodInCar() {
    let that = this;
    if (JSON.stringify(that.data.formData) === "{}") {
      that.setData({
        tipsShow: false
      })
    } else {
      that.setData({
        tipsShow: true
      })
    }
  },
  //用户信息修改事件
  info_name_gai(){
    let that = this;
    that.setData({
      information:true,
    })
  },
  contact_name(e) {
    this.setData({
      contact_name: e.detail.value
    })
  },
  contact_phone(e) {
    this.setData({
      contact_phone: e.detail.value
    })
  },
//点击信息弹窗确定按钮
queding(){
  let that = this;
  if ( that.data.contact_name =='' ){
    wx.showToast({
      title: '名字不能为空！',
      icon:'none',
    })
    return
  }
  if (that.data.contact_phone == '') {
    wx.showToast({
      title: '电话号码不能为空！',
      icon: 'none',
    })
    return
  }
  if (!(/^1[345678]\d{9}$/.test(that.data.contact_phone)) ) {
    wx.showToast({
      title: '请输入正确的电话号码！',
      icon: 'none',
    })
    return
  }

  if (that.data.address == '') {
    wx.showToast({
      title: '地址不能为空！',
      icon: 'none',
    })
    return
  }
  let perm = {
    member_id: that.data.member_id,
    contact_name: that.data.contact_name,
    contact_phone: that.data.contact_phone,
    garden: that.data.garden,
    address: that.data.address,
  }
  common.get('/library/save_address',perm).then(res => {
    if (res.data.code == 200) {
      wx.showToast({
        title:'保存成功！',
        icon:'none'
      })
      that.setData({
        information: false,
      })
    } else {
      app.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    }
  }).catch(e => {
    app.showToast({
      title: "数据异常",
      icon:'none'
    })
    console.log(e)
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
  saveGarden(e) {
    console.log(e)
    var cityArray1 = this.data.cityArray[0][e.detail.value[0]];
    var cityArray2 = this.data.cityArray[1][e.detail.value[1]];
    var cityArray3 = this.data.cityArray[2][e.detail.value[2]];
    var cityArray4 = this.data.cityArray[3][e.detail.value[3]];
    this.setData({
      garden: (cityArray1 + cityArray2 + cityArray3 + cityArray4)
    })
  },
    //承德活动
    chengde_name(e){
      this.setData({
        chengde_name:e.detail.value
      })
    },
    chengde_phone(e){
      this.setData({
        chengde_phone:e.detail.value
      })
    },
    chengde_school(e){
      this.setData({
        chengde_school:e.detail.value
      })
    },
    chengde_class(e){
      this.setData({
        chengde_class:e.detail.value
      })
    },

})