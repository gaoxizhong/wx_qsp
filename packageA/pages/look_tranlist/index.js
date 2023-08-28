const app = getApp();
const publicMethod = require('../../../assets/js/publicMethod');
let Util = require('../../../assets/js/util');
let Setting = require('../../../assets/js/setting');
let zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business_id:'',
    member_id:'',
    longitude: '',
    latitude: '',
    total_peop:0,
    filter_list:[],
    pageIndex: 1,
    hasMore: true,
    is_dist:2,
    distance_list:[
      {id:3,name:'3公里',dist:6},
      {id:4,name:'5公里',dist:10},
      {id:5,name:'10公里',dist:20},
      {id:6,name:'20公里',dist:40},
    ],
    is_apply:false,
    pathUrl:'',
    pageSize:15,
    initUrl:'/content_personal/integral_market_index1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let member_id = wx.getStorageSync('member_id');
    this.setData({
      member_id,
      business_id:options.business_id
    })
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
    this.onPullDownRefresh();
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
      hasMore:true,
      filter_list:[],
      pathUrl: Setting.apiUrl + that.data.initUrl,
      pageSize:that.data.pageSize,
    })
    that.getgpslist();
    wx.stopPullDownRefresh();
  },
  getFilterlist(){
    const that = this;
    let is_dist = that.data.is_dist;
    let param = {
      member_id:wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat:that.data.latitude,
      away:that.data.distance_list[is_dist].dist,
      pageSize:that.data.pageSize,
    }
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
        let next_page_url = res.data.data.result.next_page_url;
        let total = res.data.data.result.total;
        let to = res.data.data.result.to;
        let newList = that.data.filter_list.concat(res.data.data.result.data);
        let hasMore = to < total; 
        that.setData({
          filter_list:newList,
          total_peop:total,
          hasMore,
          pathUrl:next_page_url,
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
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
    // 转百度定位坐标
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        that.getFilterlist();
      },
      fail: function(res) {
        wx.showModal({
          title: '需要开启手机定位',
          content: '请前去开启GPS服务',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
  },
  select_dist(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let dist = e.currentTarget.dataset.dist;
    let business_id = that.data.business_id;
    if(dist== 6){
      if(!business_id){
        wx.showModal({
          cancelColor: '#666',
          content:'您暂未开通店铺！',
          cancelText:'暂不开通',
          confirmText:'去开通',
          confirmColor:'#e60000',
          cancelColor:'#7a7a7a',
          success (res) {
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/register/register',
              })
            }
          }
        })
      return
      }
    }
    that.setData({
      is_dist:index,
      address:'',
      is_duanxin:false,
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
  gotoall_transaction(){
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      wx.navigateTo({
        url: '/packageA/pages/all_transaction/index',
      })
    }else{
      that.setData({
        is_apply:true
      })
    }

  },
  gotocreate_shop() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
      wx.navigateTo({
        url: '/pages/register/register?member_id='+member_id
      })
      that.setData({
        is_apply:false
      })
  },
  hiddenis_apply(){
    that.setData({
      is_apply:false
    })
  },
  openSetting() {
    let that = this;
    publicMethod.openSetting(that);
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