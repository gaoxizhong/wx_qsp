const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    volunacti_list:[],
    member_id:'',
    latitude: '',
    longitude: '',
    canIUseGetUserProfile: false,
    id:'',
    dynamic:{},    
    is_preview: false,
    click_sele:1,
    banner_img:[],
    like_status: true,
    is_zyhd_box: true,
    is_zyhd: true,
    // 进度条动画数据
    bar_number: 2,
    djs_number: 5,
    bar_text: '',
    tb_leflt: -2,
    is_progress: false,
    timer:{}, // 进度条
    djs_timer:{},   // 倒计时
    is_ad: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options)
    if(this.options.contentid || this.options.id){
      that.setData({
        id:this.options.contentid ? this.options.contentid : this.options.id,
        member_id: wx.getStorageSync('member_id')
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
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      member_id: wx.getStorageSync('member_id'),
      is_preview: false,
      like_status: true,
    })

    that.getShareContents();
    that.getdetails();
    that.getBannerUrls();
  },
  getShareContents(){
    let that = this;
    common.get("/content/getShareContents", {
      member_id: wx.getStorageSync('member_id'),
      content_id: that.data.id
    }).then(res => {
      if(res.data.code == 200){
        that.setData({
          dynamic: res.data.data.shareContent
        })
        console.log(that.data.dynamic)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(error => {
      console.log(error);
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
  //点赞
  like(e) {
    let that = this;
    let lat = that.data.latitude;
    let lng = that.data.longitude;
    let source = e.currentTarget.dataset.source;
    let business_id =  e.currentTarget.dataset.business_id;
    if (that.data.member_id == e.currentTarget.dataset.mid){
        wx.showToast({
          title: "不可点赞自己发布的!",
          icon:'none'
        })
        return;
    }
  //  ======================== 新增重复点击判断提示 =============== 
      let like_status = that.data.like_status;
      if(!like_status){
        wx.showToast({
          title: '正在加载，请勿频繁点击！',
          icon:'none'
        })
        return
      }
      that.setData({
        like_status: false
      })
// ======================== 新增重复点击判断提示 ===============
    common.get('/content/praise', {
      member_id: that.data.member_id,
      content_id: e.currentTarget.dataset.zxid,
      lat,
      lng
    }).then(res => {
      if(res.data.code == 200){
        publicMethod.gotosetint_transac(that);
// =============================== ↓ =====================================
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          complete (res) { 
            that.setData({
              is_zyhd_box: false,
              bar_text: '正在加载数据，请稍候...',
            })
            let progressBar = {
              that: that,
              text: '点赞成功！',
              tag: 'is_zyhd_box',
              integral: '',
              f: that.getShareContents
            }
            publicMethod.progress_bar(progressBar);
          },
        })  
// ================================= ↑ =======================================
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
        that.setData({
          like_status: true
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      that.setData({
        like_status: true
      })
      console.log(e)
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
  click_bg(){
    this.setData({
      is_preview : false,
    })
  },
  gotojion(e){
    publicMethod.gotojion(e,this);
  },
  gotoxuanze(){
    let that = this;
    that.click_bg();
  },
  goto_adshop(e){
    let that = this;
    publicMethod.goto_adshop(e,this);
  },
  // 跳转志愿活动详情页面
  gotoApplyFor(e){
    let activity_id = e.currentTarget.dataset.activity_id;
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_details/index?id=' + activity_id,
    })
  },
    // 获取活动信息
    getdetails() { 
      let that = this
      common.get('/activity/index', {
        member_id: wx.getStorageSync('member_id'),
      }).then(res => {
        if (res.data.code == 200) {
          let array = res.data.data.array;
          that.setData({
            volunacti_list:array,
          })
        }
      }).catch(e => {
        app.showToast({
          title: "数据异常"
        })
      })
    },
    
  gotovolunac_details(e){
    let that = this;
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_details/index?id=' + id + '&name='+ name,
    })
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/referraltraffic/index2', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          banner_img: res.data.data.type_list,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },
  // 点击banner广告商品
  goToFromImg(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    let select_id = dataset.select_id;
    let select_type =  dataset.select_type;
    let traffic_id =  dataset.id;
      common.post("/referraltraffic/record",{
        traffic_id,
        member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
      })
      let url = '';
      if(select_type == 1){
        url = '/pages/dicount_good/dicount_good?discount_id=' + select_id
      }else if(select_type == 2){
        url = '/packageA/pages/coupon_detail/index?id=' + select_id
      }
      wx.navigateTo({
        url,
      })
    }).catch(e =>{
      console.log(e)
    })
  },
  // 跳转旧衣回收
  goToclassactical(){
    wx.navigateTo({
      url: '/packageA/pages/recyclePlate/recyclePlateClothes/index',
    })
  },
  adClose(){
    this.setData({
      is_ad: false
    })
  }
})