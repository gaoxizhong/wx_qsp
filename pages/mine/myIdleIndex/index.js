const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const Makephoto = require('../../../assets/js/setting');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatarUrl:'',
    canIUseGetUserProfile: false,
    wenzData:[],
    dataStatus: false,
    idleList:[],
    longitude: '',
    latitude: '',
    windowHeight:0,
    is_login:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      windowHeight: app.data.windowHeight,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options) // 这时候就会发现this.options上就会有对应的参数了
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if (this.options.member_id) {
      that.setData({
        member_id: wx.getStorageSync('member_id'),
        shangjia_id: this.options.member_id,
        personData: wx.getStorageSync('user_info'),
        idle_hidden:true
      })
    }
    that.getData();

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
      member_id: wx.getStorageSync('member_id'),
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    if(that.data.is_login == 1){
      that.getData();
    }
  },
  getData() { //初始化数据
    let that = this
    that.getUserIdentify();
    // 列表
    // that.getwenzhang();
    // 附近闲置
    that.getidleList();

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
  //商品列表
  getwenzhang() { 
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    let prems = {
      member_id: that.data.shangjia_id,
      page: 1
    }
    if ( that.data.type == 1 ){
      prems.member_id = wx.getStorageSync('member_id');
    }
    common.get('/idle/myIdle', prems).then(res => {
      let wenzData = res.data;
      wx.hideLoading();
      if (wenzData.length <= 0) {
        setTimeout(function () {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      that.setData({
        wenzData,
      })
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
    })
  },
  // 附近闲置
  getidleList() {
    let that = this;
    common.get('/idle/idleStore', {
      page: 1,
      lng: that.data.longitude,
      lat: that.data.latitude,
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      that.setData({
        idleList: res.data.res.splice(0,4),
      })
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },

 //前往闲置详情页
 goToActivity(e) {
  let that = this;
  let idle_id = e.currentTarget.dataset.idle;
  let member_id = that.data.member_id;
  let busnesid = e.currentTarget.dataset.busnesid;
  let url = "/packageA/pages/idleDetails_page/index?member_id=" + member_id + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id
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
  gotoMyIdle(){
    wx.navigateTo({
      url: '/pages/mine/myIdle_wfbd/index?member_id=' + wx.getStorageSync('member_id'),
    });
  },
    // 发布闲置物品
    myIdlerelease(e){
      var is_sales = e.currentTarget.dataset.is_sales;
      wx.navigateTo({
        url: '/pages/mine/myIdlerelease/index?is_sales=' + is_sales,
      });
    },
    // 附近闲置
    gotolottery(){
      wx.navigateTo({
        // url: '/pages/getalllist/getalllist',
        url: '/packageA/pages/idleGroup/fjIdleList/index',
      })
    },
    // 去我的闲圈主页
    goToMygroupIndex(){
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/myidleGroupIndex/index?member_id=' + this.data.shangjia_id,
      })
    },
    // 生成海报
  gotoMakephoto() {
    let types = 'xianzhi';
    let ids = this.data.member_id;
    let page_urls = 'pages/mine/myIdle_baby/index';
    let contents = '';
    let icon_paths = '';
    let apiUrls = Makephoto.makeUrl
    if (this.data.shangjia_id){
      ids = this.data.shangjia_id;
    }
    publicMethod.gotoMakephoto(this, types, ids, page_urls, contents, icon_paths, apiUrls);
  },
  // 保存海报
  saveImage(e) {
    publicMethod.saveImage(e, this);
  },
  //图片预览
  previewImage(e) {
    let image_url = [];
    console.log(e)
    image_url.push(e.currentTarget.dataset.img);
    wx.previewImage({
      urls: image_url // 需要预览的图片http链接列表  
    });
  },
  // 关闭海报
  clodmark() {
    this.setData({
      makephoto: false
    })
  },

  //  我的求购
  myBuyingIndex(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/myBuyingIndex/index?member_id=' + this.data.shangjia_id,
    })
  },




  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if(pageslist && pageslist.length > 1) {
      wx.navigateBack({delta: -1});
    } else {
      wx.reLaunch({ url: "/pages/getalllist/getalllist"});
    }
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
  gotodingdan(){
    let business_id = wx.getStorageSync('member_id');
    wx.navigateTo({
      url: '/packageA/pages/idleOrder/index?business_id=' + business_id +'&is_idle=1',
    })
  },
  gotodingdan1(){
    let business_id = wx.getStorageSync('member_id');
    wx.navigateTo({
      url: '/packageA/pages/idleOrder/index?business_id=' + business_id +'&is_idle=1' + '&c=2',
    })

  },
  goToMyIdleBaby(){
    wx.navigateTo({
      url: '/pages/mine/myIdle_baby/index?member_id=' + wx.getStorageSync('member_id'),
    })
  }
})
