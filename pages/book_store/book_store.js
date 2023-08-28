const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    get_integral:'0.00',
    search_info1:'',
    search_info2:'',
    search_info3:'',
    dataStatus:false,
    savaStatus: true,
    book_list:[],
    top_img:[],
    pageIndex:1,
    pageSize:20,
    btnTop: 400,
    btnLeft: 300,
    windowHeight: '',
    windowWidth: '',
    cart_number:0,
    is_car:'/images/acrt.png',
    is_car_1: '/images/acrt-1.png',
    dataStatus: false,
    hasMore: true,
    cur:0,
    cur1:1,
    startDate: "请选择",
    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
    contact_name: '', //联系人
    contact_phone: '', //联系电话
    garden: '', //所在小区
    address: '', //详细地址,
    longitude: '',
    latitude: '',
    is_preview:false,
    company_name:'',
    integral:'',
    avatar:'',
    business_id:'',
    lx:true,
    // is_tot:false
    remark:'',
    ad_content:{},
    select_type:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
   

    }

    console.log(this.options)
    this.setData({
      member_id
    })
    this.getLastOrderInfo();

    this.setData({
      member_id,
      type:1,
      currentTab1: 1,
      qqq: true

    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let btnTop = windowHeight - 134;
        this.setData({
          windowHeight,
          windowWidth,
          btnLeft: windowWidth - 75,
          btnTop
        })
      },
    })
    this.getData();
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this,this.data.longitude,this.data.latitude);
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
  getData(){
    this.getBannerPic();
  },
    //获取banner图
    getBannerPic() {
      let that = this;
      common.get('/banner/newInfo', {
        type: 13,
        member_id: that.data.member_id
      }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          that.setData({
            top_img: res.data.data,
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //从banner图跳转 1为文章，2为商家，3为会话
    goToFromImg(e) {
      let dataset = e.currentTarget.dataset;
      if (dataset.label == 1) {
        //跳转文章
        let url = "/pages/detail/detail?article_id=" + dataset.labelid;
        wx.navigateTo({
          url: url
        })
      } else if (dataset.label == 2) {
        //跳转商家
        let url = "/pages/shop/shop?business_id=" + dataset.labelid;
        wx.navigateTo({
          url: url
        })
      } else if (dataset.label == 3) {
        //发起会话
        this.setData({
          showService: true
        })
      }
    },

  getLastOrderInfo() {
    let that = this;
    console.log(that);
    common.get('/library/save_address', {
      'member_id': that.data.member_id,
      'type': 'select'
    }).then(res => {
      if (res.data.code ==200 && JSON.stringify(res.data.data) != "[]") {
        //获取数据成功
        that.setData({
          contact_name: res.data.data[0].contact_name ? res.data.data[0].contact_name : '',
          contact_phone: res.data.data[0].contact_phone ? res.data.data[0].contact_phone : '',
          garden: res.data.data[0].garden ? res.data.data[0].garden : '',
          address: res.data.data[0].address ? res.data.data[0].address : ''
        })
      } else if(res.data.code == 202){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })

      }
    }).catch(e => {
      console.log(e)
    })
  },
  search(search_info){
    let that = this;
    if (search_info !== '') {
      common.get('/book/serach_books', {
        member_id:that.data.member_id,
        search_info: search_info
      }).then(res => {
        console.log(res.data)
        if (res.data.code == 202) {
          app.showToast({
            title: "没有找到"
          })
        } else {
          that.setData({
            book_list: res.data.data
          })
        }
      });
    } else {
      app.showToast({
        title: "请输入内容"
      })
    }
  },

  get_fangshi: function (e) {
    let that = this
    var cur1 = e.currentTarget.dataset.index;
    that.setData({
      get_integral:'0.00',
      search_info1:'',
      search_info2:'',
      currentTab1: cur1,
      // is_tot:false,
    })
    if (cur1 == 1) {
      //方法一
      let search_info1 = that.data.search_info1;
      let tem = 0;
      tem =  tem + (search_info1 * 10);
      let tot = tem.toFixed(2);
      that.setData({
        qqq: 1,
        type:1,
        get_integral:tot
      })
    } else if (cur1 == 2) {
      //方法二
      let search_info2 = that.data.search_info2;
      let tem = 0;
      tem =  tem + (search_info2 * 1);
      let tot = tem.toFixed(2);
      that.setData({
        qqq: 0,
        type:2,
        currentTab1: cur1,
        get_integral:tot

      })
    }

  },
// 点击添加到购物车
  add_ShopCart(e){
    console.log(e)
    let that = this;
    let library_id = e.currentTarget.dataset.library_id;
    let library_name= e.currentTarget.dataset.library_name;
    let book_list = that.data.book_list;
    let list_index = e.currentTarget.dataset.index;
    let book_id = e.currentTarget.dataset.book_id;
    let stock = e.currentTarget.dataset.stock;
    let name = e.currentTarget.dataset.name;
    let integral_price = e.currentTarget.dataset.integral_price;
    let images_medium = e.currentTarget.dataset.images_medium;
    let member_id = wx.getStorageSync('member_id');

    if (!member_id) {
      wx.showModal({
        title: '登录后才可添加！',
        content: '是否跳转我的页面',
        confirmColor:'#ff1111',
        success:function(res){
          if (res.confirm){
            wx.reLaunch({
              url:'/pages/mine/index/index'
            })
          }
        }
      })
      return
    }else{

      common.get('/library/EditCar',{
        member_id: wx.getStorageSync('member_id'),
        library_id,
        library_name,
        book_name: name,
        book_id,
        integral_price,
        images_medium,
        type:'add',
        form: 'all',
      }).then(res => {
        console.log(res)
        if(res.data.code == 200){
          wx.showToast({
            title: '添加购物车成功！',
            icon: 'none',
            success: function () {
              let cart_number = that.data.cart_number - 0
              book_list[list_index].is_car = true // 1.改变当前图书的选中状态
              that.setData({
                book_list: book_list,  // 2.重新更新图书列表
                cart_number: cart_number += 1
              })
            }
          })
        }else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }

      })

    }

  },
  // 前往购物车列表页
  goToAcrt(){
    let that = this;
    let url = '/packageA/pages/library/myCart/index?member_id=' + that.data.member_id;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showModal({
        title: '登录后才可跳转！',
        content: '是否跳转我的页面',
        confirmColor: '#ff1111',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/mine/index/index'
            })
          }
        }
      })
      return
    }else{
      wx.navigateTo({
        url: url,
      })
    }
  },
    /*进入图书馆首页 */
  goTolibrary(e){
    console.log(e);
    let that = this;
    let library_id = e.currentTarget.dataset.library_id;
    let url = "/packageA/pages/library/index?library_id=" + library_id
    wx.navigateTo({
      url: url
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
  // 方法一输入框事件
  book_num(e){
    let search_info1 = e.detail.value.replace(/\D/g,'');
    let tem = 0;
    tem =  tem + (search_info1 * 10);

    let tot = tem.toFixed(2);
    if(tot >= 1000){
      this.setData({
        search_info1,
        get_integral:1000,
        // is_tot:true
      })
    }else{
      this.setData({
        search_info1,
        get_integral:tot,
      })
    }

    
  },

 // 方法二输入框事件
 book_cost(e){
  let search_info2 = e.detail.value.replace(/\D/g,'');
  let tem = 0;
  tem =  tem + (search_info2 * 1);
  let tot = tem.toFixed(2);
  if(tot >= 1000){
    this.setData({
      search_info2,
      get_integral:1000,
      // is_tot:true
    })
  }else{
    this.setData({
      search_info2,
      get_integral:tot,
    })
  }

},
 // 方法二输入框事件
 book_cost1(e){
  let search_info3 = e.detail.value.replace(/\D/g,'');
  this.setData({
    search_info3,
  })
},
//用户信息修改事件
info_name_gai(){
  let that = this;
  that.setData({
    information:true,
  })
},
contact_name(e) {
  console.log(e.detail.value)
  this.setData({
    contact_name: e.detail.value
  })
},
contact_phone(e) {
  console.log(e.detail.value)
  this.setData({
    contact_phone: e.detail.value
  })
},
//保存小区
saveGarden(e) {
  this.setData({
    garden: e.detail.value
  })
},
//保存地址
saveAddress(e) {
  this.setData({
    address: e.detail.value
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

    }
  }).catch(e => {
    app.showToast({
      title: "数据异常"
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
relIdle_btn(e) { //提交
  console.log(e)
    let that = this
    let savaStatus = that.data.savaStatus;
    if (that.data.contact_name == '' || that.data.contact_phone == '' ){
      wx.showToast({
        title: '请填写用户信息！',
        icon:'none'
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
    if (that.data.startDate == '' || that.data.startDate == '请选择') {
      wx.showToast({
        title: '请选择上门时间！',
        icon: 'none'
      })
      return
    }
    if(that.data.currentTab1 == 1){
      if(that.data.search_info1 == ''){
        wx.showToast({
          title: '请输入图书数量！',
          icon: 'none'
        })
        return
      }
    }
    if(that.data.currentTab1 == 2){
      if( that.data.search_info2 == ''){
        wx.showToast({
          title: '请输入图书价格！',
          icon: 'none'
        })
        return
      }
    }
    if(that.data.currentTab1 == 2){
      if( that.data.search_info3 == ''){
        wx.showToast({
          title: '请输入图书数量！',
          icon: 'none'
        })
        return
      }
    }
    console.log(that.data.garden)
    let param ={
      "member_id": that.data.member_id,
      "latitude" :that.data.latitude,
      "longitude" :that.data.longitude,
      "type": that.data.type,
      "detail_address": that.data.address,
      "address": that.data.garden,
      "metting_time": that.data.startDate1,
      "member_name": that.data.contact_name,
      "tel": that.data.contact_phone,
      "integral":that.data.get_integral,
      "book_num":that.data.search_info3,
      "remark": that.data.remark
    };
    if(that.data.currentTab1 == 1){
      param.book_num = that.data.search_info1;
    }

    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    wx.showNavigationBarLoading();
    common.post('/recover/recover_book', param).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        let pop_ad = res.data.data;
        wx.showToast({
          title: res.data.msg,
          duration: 4000,
          icon: 'success'
        })
        let business_id = pop_ad.business_id;
        let i = pop_ad.integral;
        let lx = pop_ad.lx;
        if(lx == 1){
          if(pop_ad.select_type == '1'){
            // 跳转商品
            let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('member_id') + "&discount_id=" + pop_ad.ad_content.id + "&integral=" +i+ "&is_cxtg=1";
            if(is_n == 1){
            url = url + "&is_n=1"
          }
          wx.navigateTo({
            url: url
          })
          }
          if(pop_ad.select_type == '2'){
            // 跳转优惠券select_id
            let url = "/packageA/pages/coupon_detail/index?id=" + pop_ad.ad_content.id + "&integral=" +i+ "&is_cxtg=1";
            if(is_n == 1){
              url = url + "&is_n=1"
            }
            wx.navigateTo({
              url: url
            })
          }
        }else{
         return
        }
        // that.setData({
        //   ad_content:pop_ad.ad_content,
        //   select_type: pop_ad.select_type,
        //   company_name : pop_ad.company_name,
        //   integral :pop_ad.integral,
        //   avatar :pop_ad.avatar,
        //   business_id : pop_ad.business_id,
        //   lx : pop_ad.lx,
        //   imagess:pop_ad.image,
        //   is_preview : true,
        //   view_member_id: pop_ad.member_id
        // })

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
  click_bg(){
    // this.setData({
    //   is_preview:false
    // })
    // wx.reLaunch({
    //   url: '/pages/huishou/submitState/index?member_id='+ wx.getStorageSync('member_id'),
    // })
    this.gotoindex();

  },

  // =================== 新增 ===================
  goto_adshop(e){
    publicMethod.goto_adshop(e,this);
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // =================== 新增 ===================
  logintest(e) {
    console.log('校验是否登录');
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      console.log('未授权用户')
      wx.showModal({
        title: '预约送书，请先登录！',
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
  saveGarden(e) {
    console.log(e)
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
    //前往活动详情
    goToActivitylist(e) {
      console.log(e)
      let that = this;
      let member_id = that.data.member_id;
      let id = e.currentTarget.dataset.id;
      let books_id = e.currentTarget.dataset.books_id;

      let is_tuan = e.currentTarget.dataset.is_tuan;
      let url = "/pages/get_good_book/get_good_book?member_id="+ member_id + "&books_id=" + books_id + '&id=' + id;
      wx.navigateTo({
        url: url
      })
    },
  /**
* 获取小程序二维码参数
* @param {String} scene 需要转换的参数字符串
*/
  getScene: function (scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
  },
  remark(e){
    this.setData({
      remark:e.detail.value
    })
  },
})