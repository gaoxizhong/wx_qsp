const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[],
    centerX: app.globalData.longitude,// 当前经纬度
    centerY: app.globalData.latitude,
    playList:[],
    newplayList:[],
    pageSize: 10,
    pageIndex: 1,
    count:0,
    hasMore: true,
    mapId: "myMap", //wxml中的map的Id值
    content_count:0, // 用户打卡次总数
    done_count: 0, //完成人数
    p_count: 0,
    done: [],
    is_login: 0,
    is_signUp: null, // 用户报名信息 
    is_shopsignUp: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      markers: that.getLingyuanMarkers(),
    })
    //获取报名信息
    this.getSignUp();
    //获取会员打卡次数
    this.getPunchCount();
  },
  // 点击回到原点
  moveTolocation: function () {
    // console.log(123)
    let Id = this.data.mapId
    var mapCtx = wx.createMapContext(Id);
    mapCtx.moveToLocation();
  },
  // 点击标点获取数据
  markertap(e) {
    var id = e.markerId
    var name = this.data.markers[id - 1].name
    console.log(name)
    // this.setData({
    //   lingyuanName: name,
    //   showDialog: true,
    // })
  },
  regionchange(e) {
    // console.log(e.type)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        console.log(res)
        let latitude = res.latitude;
        let longitude = res.longitude;
        // let marker = this.createMarker(res);
        that.setData({
          centerX: longitude, // 当前经纬度
          centerY: latitude, // 当前经纬度
        })
      },
      fail:(e) =>{
        console.log(e)
        wx.showToast({
          title: e.errMsg,
          icon:'none'
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      is_login: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      is_login: 0
    })
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
  //获取报名信息
  getSignUp(){
    let that = this;
    common.get('/long_march_roule/sign_up/' + wx.getStorageSync('member_id'),{
    }).then(res =>{
      that.setData({
        is_signUp: res.data.data
      })
    }).catch(e =>{
      console.log(e)
    })
  },
  //获取会员打卡次数
  getPunchCount(){
    let that = this;
    common.get('/long_march_roule/get_punch_in_count/' + wx.getStorageSync('member_id'),{
    }).then(res =>{
      that.setData({
        content_count: res.data.data.count
      })
    }).catch(e =>{
      console.log(e)
    })
  },
  //获取打卡地点列表
  getLingyuanMarkers() {
    let that = this;
    // lingyuanData 为列表数据
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    let markers = [];
    common.get('/long_march_roule/get_punch_in_address_list',{
      page: that.data.pageIndex,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let lingyuanData = res.data.data.data;
        let count = res.data.data.total;// 获取数据的总数
        let pageSize = that.data.pageSize;// 获取每页个数
        let flag = that.data.pageIndex * pageSize < count;
        for (let item of lingyuanData) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
        that.setData({
          newplayList: lingyuanData,
          markers,
          hasMore: flag,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e=>{
      wx.hideLoading();
      console.log(e)
    })
  },

  clickSifnMark(){
    this.setData({
      is_shopsignUp: false
    })
  },
  // 点击报名提交按钮
  changer_address_marsk(){
    let that = this;
    let user_name = that.data.user_name;
    let user_tel = that.data.user_tel;
    if(!user_name || user_name == '' || !user_tel || user_tel == '' ){
      wx.showToast({
        title: '请先填写信息！',
        icon:'none'
      })
      return
    }
    common.post('/long_march_roule/sign_up',{
      member_id: wx.getStorageSync('member_id'),
      mobile: user_tel,
      name: user_name,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.message,
        })
        that.setData({
          is_shopsignUp: false
        })
        that.onLoad();
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  user_name(e){
    this.setData({
      user_name: e.detail.value
    })
  },
  getPhoneNumber (e) {
    console.log(e)
    let that = this;
    let code = e.detail.code;
    common.post('/community_market/get_member_auth_mobile',{
      code,
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          user_tel: res.data.data.phone_info.phoneNumber
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  // 点击报名按钮
  clickSignUp(){
    this.setData({
      is_shopsignUp: true
    })
  },


















  // 点击查看更多
  clickmore(){
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getLingyuanMarkers();
      wx.hideLoading()
    }, 500)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    let that = this;
    let imageUrl = 'https://oss.qingshanpai.com/icon/punch_share.jpg';
    if (res.from === 'button') {
      return {
        title: '打卡活动！',
        imageUrl: imageUrl,
        path: '/packageB/pages/retraceLongMarch/home/index',
        success: function (res) {
          that.setData({
            showModel: false
          })
        }
      }
    }
    return {
      title: '打卡活动！',
      imageUrl: imageUrl,
      path: '/packageB/pages/retraceLongMarch/home/index',
      success: function (res) {
        that.setData({
          showModel: false
        })
      }
    }
  },
  // 点击导航
  getRoadLine(e) {
    let that = this;
    console.log(e);
    let latitude = e.currentTarget.dataset.lat;
    let longitude = e.currentTarget.dataset.lng;
    let name = e.currentTarget.dataset.name;
    let address = e.currentTarget.dataset.address + ' ( ' + e.currentTarget.dataset.feature + ' ) ';
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name,
      address,
      scale: 18
    })
  },



  createMarker(point) {
    let latitude = Number(point.latitude);
    let longitude = Number(point.longitude);
    let marker = {
      iconPath: "https://oss.qingshanpai.com/retraceLongMarch/r-dd.png",
      id: point.id || 0,
      name: point.name || '',
      address: point.address || '',
      feature: point.feature || '',
      my_distance: point.my_distance || '',
      my_status: point.my_status || 0,
      content_count: point.content_count || 0,
      latitude: latitude,
      longitude: longitude,
      width: 24,
      height: 30,
      label: {
        content: point.name,
        color: '#0388e2',
        fontSize: 10,
        bgColor: "#fff",
        padding: 3
      },
      callout: {
        content: point.name,
        fontSize: 0,
      }
    };
    return marker;
  },

  // 点击打卡 
  gotowinter_punch(e){
    let that = this;
    let newplayInfo = JSON.stringify(e.currentTarget.dataset.info);
    let is_signUp = this.data.is_signUp;
    if(!is_signUp){
      wx.showToast({
        title: '请先报名参加！',
        icon:'none'
      })
      return
    }
    common.post('/long_march_roule/member_punch_in',{
      member_id: wx.getStorageSync('member_id'),
      longitude: that.data.centerX,
      latitude: that.data.centerY,
      punch_in_address_id: e.currentTarget.dataset.info.id
    }).then(res =>{
      if(res.data.code == 200){
        wx.navigateTo({
          url: '/packageB/pages/retraceLongMarch/retrace_punch/index?newplayInfo=' + newplayInfo,
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })

  },
  // 点击打卡奖励
  gotojl(){
    wx.navigateTo({
      url: '/packageB/pages/retraceLongMarch/retrace_punchjl/index',
    })
  },
  // 跳转打卡秀
  gotopunchshow(){
    wx.navigateTo({
      url: '/packageB/pages/retraceLongMarch/retrace_punchshow/index',
    })
  },
  gotots(){
    wx.showToast({
      title: '您已打过卡，请前往其他打卡点打卡！',
      icon:'none'
    })
  },

})