const app = getApp();
const common = require('../../../../assets/js/common');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appendixList:[
      {id:1,name:'家庭'},
      {id:2,name:'同事'},
      {id:3,name:'邻居'},
      {id:4,name:'社区'}
    ],
    appendix_sel:0,
    nickName:'',
    avatarUrl:'',
    canIUseGetUserProfile: false,
    dataStatus: false,
    longitude: '',
    latitude: '',
    appendix_name:'',
    nearGroupList:[]   //  附近闲置圈

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
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
    let that = this;
    that.setData({
      member_id:wx.getStorageSync('member_id'),
      nearGroupList:[],   //  附近闲置圈
    })
    that.getData();
  },
getData(){
  let that = this;
  that.getUserIdentify();
  wx.getLocation({
    type: 'wgs84',
    success:function(res){
      console.log(res)
      that.setData({
       latitude : Number(res.latitude),
       longitude : Number(res.longitude)
      })
      // zhuan_dingwei方法转换百度标准
      var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
      that.setData({
        longitude: gcj02tobd09[0],
        latitude: gcj02tobd09[1]
      })
      that.getmyGroupList();
    },
    fail: function(res) {
      wx.showToast({
        title: '需要开启手机定位',
        icon:'none'
      })
      that.setData({
        latitude: '',
        longitude: ''
      })
      that.getmyGroupList();
      if (res.errMsg == "getLocation:fail auth deny") {
        that.openSetting(that)
      }
    }
  })
},
  // 团组
  getmyGroupList(){
    let that = this;
    common.get('/idlegroup/my_group',{
      member_id:wx.getStorageSync('member_id'),
      is_mine:'1',
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      if(res.data.code == 200){
        let nearGroupList = res.data.data.near.splice(0,3);
        that.setData({
          nearGroupList
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  //获取登录人的身份
  getUserIdentify() {
    let that = this;
    let prems = {
      member_id: wx.getStorageSync('member_id'),
    }
    common.get("/member/getMemberIdentity", prems).then(res => {
      if (res.data.code == 200) {
        that.setData({
          avatarUrl: res.data.avatar,
          nickName: res.data.nickname
        })
      }
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
  // 选择类型
  appendix_sel(e){
    let that = this;
    let appendixList = that.data.appendixList;
    appendixList.forEach(ele =>{
      if(e.currentTarget.dataset.id == ele.id){
        this.setData({
          appendix_sel: e.currentTarget.dataset.id,
          appendix_name: ele.name
        })
      }
    })

  },
  // 创建团组
  createMyGroup(){
    let that = this;
    let appendix_sel = that.data.appendix_sel;
    if(!appendix_sel || appendix_sel == 0){
      wx.showToast({
        title: '请先选择类型',
        icon:'none'
      })
      return
    }
    common.post('/idlegroup/create',{
      member_id: wx.getStorageSync('member_id'),
      group_name: that.data.nickName,
      group_image: that.data.avatarUrl,
      lat: that.data.latitude,
      lng: that.data.longitude,
      type: that.data.appendix_name,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '创建成功！',
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
      
    }).catch(e =>{
      console.log(e)
    })
  },
  gotoFjGroupList(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/fjGroupList/index',
    })
  },
    // 去团组首页
    goToGroupIndex(e){
      let group_id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/GroupIndex/index?group_id=' + group_id,
      })
    },
})