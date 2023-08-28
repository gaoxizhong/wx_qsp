const app = getApp();
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
const Makephoto = require('../../../../assets/js/setting');
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
    myCreateGroupList:[],  // 我创建的团组
    jrGroupList:[],   //  我加入的团组
    nearGroupList:[]   //  附近闲置圈
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
      page1: [],
      showFull: [],
      idleList: [],
      myCreateGroupList:[],  // 我创建的团组
      jrGroupList:[],   //  我加入的团组
      nearGroupList:[],   //  附近闲置圈
      dataStatus: false,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    that.getData();
  },
  getData() { //初始化数据
    let that = this
    that.getUserIdentify();
    // 列表
    // that.getwenzhang();
    // 我创建的团组
    that.getmyGroupList();
    // 我加入的团组
    that.getjiaGroupList();

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
  // 我创建的团组
  getmyGroupList(){
    let that = this;
    common.get('/idlegroup/my_group',{
      member_id:wx.getStorageSync('member_id'),
      is_mine:'1',
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      if(res.data.code == 200){
        let myCreateGroupList = res.data.data.list.splice(0,1);
        let nearGroupList = res.data.data.near.splice(0,3);

        that.setData({
          myCreateGroupList,
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
  // 我加入的团组
  getjiaGroupList(){
    let that = this;
    common.get('/idlegroup/my_group',{
      member_id:wx.getStorageSync('member_id'),
      is_mine:'0',
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      if(res.data.code == 200){
        let jrGroupList = res.data.data.list.splice(0,2);
        that.setData({
          jrGroupList,
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

    //前往活动详情
    goToActivity(e) {
      let that = this;
      let idle_id = e.currentTarget.dataset.idle;
      let member_id = that.data.member_id;
      let busnesid = e.currentTarget.dataset.busnesid;
      let url = "/pages/mine/myIdle_good/index?member_id=" + member_id + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id
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
  gotoMyGroup(e){
    console.log(e)
    let is_my = e.currentTarget.dataset.is_my;
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/MyIdleGroupList/index?is_my=' + is_my,
    });
  },
    // 发布闲置物品
    myIdlerelease(e){
      var is_sales = e.currentTarget.dataset.is_sales;
      wx.navigateTo({
        url: '/pages/mine/myIdlerelease/index?is_sales=' + is_sales,
      });
    },
    gotoFjGroupList(){
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/fjGroupList/index',
      })
    },
    // 去我的闲圈主页
    goToMygroupIndex(){
      wx.reLaunch({
        url: '/packageA/pages/idleGroup/myidleGroupIndex/index?member_id=' + this.data.shangjia_id,
      })
    },
    // 去创建团组
  goTomycreate(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/createMyIdleGroup/index',
    })
  },


      // 生成海报
  gotoMakephoto() {
    let types = 'xianzhi';
    let ids = this.data.member_id;
    let page_urls = 'pages/mine/myIdle/index';
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

  // 去团组首页
  goToGroupIndex(e){
    let group_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/GroupIndex/index?group_id=' + group_id,
    })
  },
  // 我发布的
  gotoMyIdle(){
    wx.navigateTo({
      url: '/pages/mine/myIdle/index?member_id=' + wx.getStorageSync('member_id'),
    });
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
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/usecoin/usecoin" });
    }
  },


})
