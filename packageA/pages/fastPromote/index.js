const common = require('../../../assets/js/common');
let Util = require('../../../assets/js/util');
let Setting = require('../../../assets/js/setting');
var QQMapWX = require('../../../assets/js/qqmap-wx-jssdk.min');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dmList: [], // 弹幕数组
    beList:[],// 初始 弹幕数组
    exhibitAddress:'',
    navItems_active:2,
    navItems:[
      {id:1,name:'店铺位置',image1:'/packageA/assets/images/fastPromote/fastPromote_dm_1.png',image2:'/packageA/assets/images/fastPromote/fastPromote_dm_2.png'},
      {id:2,name:'当前位置',image1:'/packageA/assets/images/fastPromote/fastPromote_dw_1.png',image2:'/packageA/assets/images/fastPromote/fastPromote_dw_2.png'},
      {id:3,name:'地图搜索',image1:'/packageA/assets/images/fastPromote/fastPromote_map_1.png',image2:'/packageA/assets/images/fastPromote/fastPromote_map_2.png'}
    ],
    infoData:{},
    member_id:'',  // 用户id
    business_id:'',  // 店铺id
    total_peop:0,    // 人数
    total_integral:0,   // 合计积分
    total_price:0,  // 合计钱数
    newfilter_list:[], 
    filter_list:[],
    pageIndex:1,
    hasMore:true,
    is_filter:false,
    is_dist:2,  // 距离下标
    is_sex:0,  // 性别下标
    is_age:0,  // 年龄下标
    is_duanxin:false,  // 发送短信选择
    is_yesterday:false, // 平台回购
    address:'',   // 区域
    distname:'',
    distance_list:[
      {id:1,name:'不限',dist:10000},
      {id:2,name:'2公里',dist:4},
      {id:3,name:'3公里',dist:6},
      {id:4,name:'5公里',dist:10},
      {id:5,name:'10公里',dist:20},
      {id:6,name:'15公里',dist:30},
      {id:7,name:'20公里',dist:40},
      {id:8,name:'全域',dist:10000},
    ],
    sex_list:[
      {id:1,name:'不限',sex:0},
      // {id:2,name:'男',sex:1},
      // {id:3,name:'女',sex:2},
    ],
    age_list:[
      {id:1,name:'不限',age:0},
      // {id:2,name:'18 ~ 28',age:1},
      // {id:3,name:'28 ~ 38',age:2},
      // {id:3,name:'38 ~ 48',age:3},
    ],
    masking:false,
    danjia:0,
    is_address:'',
    pathUrl:'',
    pageSize:15,
    initUrl:'/content_personal/integral_market_index1',
    is_location:true,  // 位置选择box
    is_kilometerItems: false, // 选择公里box
    lat:'', // 记录当前定位
    lng:'', // 记录当前定位
    extAdd:'', // 记录当前定位
    size:0, // 四分之一数值
    setInter:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      member_id,
      business_id: options.business_id,
      pathUrl: Setting.apiUrl + that.data.initUrl,
    })
    that.getDmList(that,that.setDM);
    that.mapCtx = wx.createMapContext('myMap')
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'MBQBZ-IU4CX-XI34P-75P45-R5O22-XGF67'
    });
    // 获取当前定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude,
          longitude,
        })
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            that.setData({
              exhibitAddress: res.result.address_component.city + res.result.address_component.district + res.result.address_component.street + res.result.address_component.street_number,
              lat:latitude, // 记录当前位置
              lng: longitude, // 记录当前位置
              extAdd: res.result.address_component.city + res.result.address_component.district + res.result.address_component.street + res.result.address_component.street_number, // 记录当前位置
            })
            that.getCurrentInfo(that,that.getFilterlist)
          },
        });
      },
      fail(err) {
        //console.log(err)
        wx.hideLoading({});
        wx.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
    // 禁止右上角转发
    wx.hideShareMenu();
  },
  // 获取弹幕数据
  getDmList(t,f){
    let that = t;
    common.get('/activity/chat',{}).then(res =>{
      if(res.data.code == 200){
        that.setData({
          beList: res.data.data.chat
        })
        if (typeof f == "function") {
          return f()
        }
      }
    }).catch(e=>{
      console.log(e)
    })
  },

  // 处理弹幕位置
  setDM() {
    let that = this;
    // 处理弹幕参数
    const dmArr = [];
    const _b = that.data.beList; // 接口数据
    //  无序弹幕
    for (let i = 0; i < _b.length; i++) {
      const time = Math.floor(Math.random() * 20);
      const time1 = Math.floor(Math.random() * 6);
      const _time = time < 6 ? 6 + time1 : time;
      // const top = Math.floor(Math.random() * 180) + 10;
      const topArr = [6,24,42,74,98,121,144,168,198,223,256,282,314,348,364,402,421,458,481,500];
      const topIndex = parseInt(Math.random() * 20);
      const top = topArr[topIndex];
      const color = that.randomColor();
      const _p = {
        avater: _b[i].avater,
        content: _b[i].content,
        member_id: _b[i].member_id,
        color,
        top,
        time: _time,
      };
      dmArr.push(_p);
    }
    that.setData({
      dmList: dmArr
    });

    // 有序弹幕
    // for (let i = 0; i < _b.length; i++) {
    //   const color = that.randomColor();
    //   const _p = {
    //     avater: _b[i].avater,
    //     content: _b[i].content,
    //     member_id: _b[i].member_id,
    //     color,
    //   };
    //   dmArr.push(_p);
    // }
    // const size = Math.floor(dmArr.length/4);
    // that.setData({
    //   dmList: dmArr,
    //   size,
    // });
  },
  // 随机弹幕颜色
  randomColor(){
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    return `rgb(${red}, ${green}, ${blue})`
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
    let navItems_active = that.data.navItems_active;
    let is_dist = that.data.is_dist;
    let distance_list = that.data.distance_list;
    let distname = distance_list[is_dist].name;
    that.setData({
      distname,
    })
    if(navItems_active == 3){
      let storeAddress = wx.getStorageSync('storeAddress');
      console.log(storeAddress)
      that.setData({
        storeAddress,
        exhibitAddress:storeAddress.addr,
        latitude: storeAddress.latitude,
        longitude: storeAddress.longitude
      })
      if(storeAddress){
        that.getFilterlist();
      }

    }
    that.setData({
      setInter: setInterval(() => {
        that.setData({
          dmList: [], // 弹幕数组
          beList:[],// 初始 弹幕数组
        })
        that.getDmList(that,that.setDM);
      }, 305000)
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
    var that =this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    that.setData({
			setInter: null
		})

  },
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
  // 点击选择
  navItems(e){
    let that = this;
    let navItems_active = e.currentTarget.dataset.id;
    console.log(navItems_active)
    if(navItems_active == 1){
      // 点击店铺位置按钮
      that.getBusinessInfo();
    }else if(navItems_active == 2){
      // 点击当前位置按钮
      that.getCurrentInfo(that,that.getFilterlist);
    }else if(navItems_active == 3){
      // 点击地图搜索按钮
      wx.navigateTo({
        url: '/packageA/pages/shopMap/index',
      })
    }
    that.setData({
      navItems_active,
    })
  },
   // 点击店面位置按钮 获取地址及店铺坐标
  getBusinessInfo(){
    let that = this;
    let f = that.getFilterlist;
    common.get("/business/getBusinessInfo", {
      member_id: wx.getStorageSync('member_id'),
      business_id: that.data.business_id,
    }).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        let infoData = res.data.data;
        that.setData({
          infoData,
          exhibitAddress:infoData.address,
          latitude: infoData.latitude,
          longitude: infoData.longitude
        })
        if (typeof f == "function") {
          return f()
        }
      }else{
        console.log(res.data.msg)
      }
    }).catch( error => {
      console.log(error);
    })
  },
   // 获取当前的位置坐标
  getCurrentInfo(t,f){
    let that = t;
    that.setData({
      latitude: that.data.lat,
      longitude: that.data.lng,
      exhibitAddress: that.data.extAdd
    })
    if (typeof f == "function") {
      return f()
    }
  },
  // 获取推广数据
  getFilterlist(){
    const that = this;
    let is_dist = that.data.is_dist;
    let is_age = that.data.is_age;
    let address = that.data.address;
    let is_duanxin = that.data.is_duanxin;
    let is_yesterday = that.data.is_yesterday;
    let duanxin = 0;
    let yesterday = 0;
    let param = {
      member_id:wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat:that.data.latitude,
      away: that.data.distance_list[is_dist].dist,
      sex: that.data.is_sex,
      age: that.data.age_list[is_age].name,
      address,
      duanxin,
      yesterday,
      pageSize:that.data.pageSize,
    }
     if(is_duanxin){
      param.duanxin = 1;
     }else{
      param.duanxin = 2;
     }
     if(is_yesterday){
      param.yesterday = 1;
     }else{
      param.yesterday = 2;
     }
     wx.showLoading({
       title: '加载中...',
     })
    let pathUrl = that.data.pathUrl;
    return Util.request({
      url: pathUrl,
      header: {"content-type": "application/json"},
      data: param
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        let danjia= res.data.data.price;
        let total = res.data.data.people;
        let total_integral = total*0.2;
        that.setData({
          danjia,
          total_peop:total,
          total_integral,
          total_price:(total * 0.3 * 0.3).toFixed(2),
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 点击开始推广
  fixed_btn(){
    let that = this;
    let business_id = that.data.business_id;
    let danjia = that.data.danjia;
    let newfilter_list = that.data.newfilter_list;
    let total_peop = that.data.total_peop;
    let total_integral = that.data.total_integral;
    let total_price = that.data.total_price;
    let duanxin = that.data.is_duanxin;
    let yesterday = that.data.is_yesterday;
    let lng = that.data.longitude;
    let lat = that.data.latitude;
    let is_dist = that.data.is_dist;
    let away = that.data.distance_list[is_dist].dist;
    let exhibitAddress = that.data.exhibitAddress;
    let distname = that.data.distname;
    let all_info = {};
    all_info['newfilter_list']=newfilter_list;
    all_info['total_peop']=total_peop;
    all_info['total_integral']=total_integral;
    all_info['danjia']=danjia;
    all_info['total_price']=total_price;
    all_info['duanxin']=duanxin;
    all_info['yesterday']=yesterday;
    all_info['lng']=lng;
    all_info['lat']=lat;
    all_info['away']=away;
    all_info['exhibitAddress'] = exhibitAddress;
    all_info['distname'] = distname;
    console.log(all_info)
    wx.setStorageSync('all_info', all_info);
    wx.navigateTo({
      url: '/packageA/pages/coupon_infopages/index?business_id=' + business_id,
    })
  },

  // 点击筛选距离
  filterDis(){
    this.setData({
      is_location: false,
      is_kilometerItems: true
    })
  },
  // 点击距离选项确定按钮
  distBtn(){
    this.setData({
      is_kilometerItems: false,
      is_location: true,
    })
    this.getFilterlist();
  },
  // 点击选择距离列表
  select_dist(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let distance_list = that.data.distance_list;
    let distname = distance_list[index].name;
    that.setData({
      distname,
      is_dist:index,
      is_duanxin:false,
    })
  },

})