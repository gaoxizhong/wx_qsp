let Util = require('../../../assets/js/util');
let Setting = require('../../../assets/js/setting');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
var publicMethod = require('../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    business_id:'',
    total_peop:0,
    total_integral:0,
    total_price:0,
    newfilter_list:[],
    filter_list:[],
    pageIndex:1,
    hasMore:true,
    is_filter:false,
    is_dist:2,
    is_sex:0,
    is_age:0,
    is_duanxin:false,
    is_yesterday:false,
    address:'',
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
    param:{}
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

    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        wx.setStorageSync('zhuan_dingwei', gcj02tobd09);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        that.getFilterlist();
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          publicMethod.openSetting(that)
        }
      }
    })
    // this.onPullDownRefresh();
    // 禁止右上角转发
    wx.hideShareMenu();
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
    let that = this;
    that.setData({
      is_duanxin:false,
      filter_list:[],
      pathUrl: Setting.apiUrl + that.data.initUrl,
      pageSize:that.data.pageSize,
      hasMore:true,
    })
    that.getgpslist();
    wx.stopPullDownRefresh();
  },

  getFilterlist(){
    const that = this;
    let total_price = 0;
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
    //  that.setData({
    //   param,
    //  })
     wx.showLoading({
       title: '加载中...',
     })
     if (!this.data.hasMore){
      wx.showToast({
        title: '已加载全部...',
        icon:'none'
      })
      return
    }
    let pathUrl = that.data.pathUrl;
    return Util.request({
      url: pathUrl,
      header: {"content-type": "application/json"},
      data: param
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        let danjia= res.data.data.price;
        let next_page_url = res.data.data.result.next_page_url;
        let total = res.data.data.result.total;
        let to = res.data.data.result.to;
        // let people = res.data.data.people;
        let total_integral = total*5;
        let newList = that.data.filter_list.concat(res.data.data.result.data);
        let hasMore = to < total; 
        that.setData({
          danjia,
          filter_list:newList,
          total_peop:total,
          total_integral,
          total_price:(total_integral * danjia).toFixed(2),
          hasMore,
          pathUrl:next_page_url,
        })
        if(that.data.filter_list.length <= 0 || !that.data.filter_list){
          wx.showToast({
            title: '暂无数据',
            icon:'none',
            duration: 2000
          })
          return
        }
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      icon: 'none',
      mark: true,
      success: function(){
        that.getFilterlist();
      }
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 1500)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getgpslist(){
    let that = this;
    that.getFilterlist();
  },
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
    // let param = that.data.param;
    let all_info = {};
    // all_info['param']=param;
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

    console.log(all_info)
    wx.setStorageSync('all_info', all_info);
    wx.navigateTo({
      url: '/packageA/pages/coupon_infopages/index?business_id=' + business_id,
    })

  },
  is_filter(){
    let that = this;
    let is_filter = that.data.is_filter;
    let masking = that.data.masking;
    this.setData({
      is_filter:!is_filter,
      masking: !masking
    })
  },
  select_dist(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      is_dist:index,
      address:'',
      is_duanxin:false,
      filter_list:[],
      pathUrl: Setting.apiUrl + that.data.initUrl,
      pageSize:that.data.pageSize,
      hasMore:true,
    })
    that.getgpslist();
  },
  select_sex(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      is_sex:index,
      filter_list:[],
      pathUrl: Setting.apiUrl + that.data.initUrl,
      pageSize:that.data.pageSize,
      hasMore:true,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    that.getgpslist();

  },
  select_age(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      is_age:index,
      filter_list:[],
      pathUrl: Setting.apiUrl + that.data.initUrl,
      pageSize:that.data.pageSize,
      hasMore:true,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    that.getgpslist();
  },
  is_duanxin(){
    let that = this;
    let is_duanxin = that.data.is_duanxin;
    let total_price = Number(that.data.total_price);
    let total_peop = Number(that.data.total_peop);
    that.setData({
      is_duanxin:!is_duanxin,
    })
    if(that.data.is_duanxin){
      let new_total_price = total_price + total_peop*0.1
      that.setData({
        total_price : new_total_price.toFixed(2)
      })
    }else{
      let new_total_price = total_price - total_peop*0.1
      that.setData({
        total_price : new_total_price.toFixed(2)
      })
      
    }
  },
  is_yesterday(){
    let that = this;
    let is_yesterday = that.data.is_yesterday;
    that.setData({
      is_yesterday:!is_yesterday,
      filter_list:[],
      pathUrl: Setting.apiUrl + that.data.initUrl,
      pageSize:that.data.pageSize,
      hasMore:true,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    that.getgpslist();
  },
  focus_address(){
    let that = this;
    that.setData({
      is_dist:0
    })
  },
  blur_address(){
    let that = this;
    let address = that.data.address;
    that.setData({
      is_address:address
    })
  },
  add_address(e){
    let that = this;
    that.setData({
      address:e.detail.value,
      filter_list:[],
      pathUrl: Setting.apiUrl + that.data.initUrl,
      pageSize:that.data.pageSize,
      hasMore:true,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    that.getgpslist();
  },
  masking(){
    let that = this;
    let is_filter = that.data.is_filter;
    let masking = that.data.masking;
    this.setData({
      is_filter:!is_filter,
      masking: !masking
    })
  },
  goto(e){
    let that = this;
    console.log(e)
    let id = e.currentTarget.dataset.member_id;
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id=' + id,
    })
  }
})