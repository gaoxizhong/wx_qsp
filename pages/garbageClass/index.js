const app = getApp()
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const Makephoto = require('../../assets/js/setting');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    top_img: [],  //头部轮播图
    makephoto: false,
    makephoto_img: '',
    supe_idx:1,
    pagesUrl:'/pages/huishou/kitchen_waste/index',
    type:'',
    items: [
      {
        id: 1,
        url_1: 'http://oss.qingshanpai.com/banner/recyclable_0.png',
        url_2: 'http://oss.qingshanpai.com/banner/recyclable_2.png',
        pagesUrl:'/pages/huishou/kitchen_waste/index',
        // pagesUrl:'/pages/huishou/types/index',
      }, {
        id: 2,
        url_1: 'http://oss.qingshanpai.com/banner/kitchen_waste_0.png',
        url_2: 'http://oss.qingshanpai.com/banner/kitchen_waste_2.png',
        pagesUrl:'/pages/huishou/kitchen_waste/index',
      }, {
        id: 3,
        url_1: 'http://oss.qingshanpai.com/banner/harmful_garbage_0.png',
        url_2: 'http://oss.qingshanpai.com/banner/harmful_garbage_2.png',
        pagesUrl:'/pages/huishou/kitchen_waste/index',
      },{
        id:4,
        url_1: 'http://oss.qingshanpai.com/banner/other_garbage_0.png',
        url_2: 'http://oss.qingshanpai.com/banner/other_garbage_2.png',
        pagesUrl:'/pages/huishou/kitchen_waste/index',
      },
    ],
    is_jifenjiaoyi:'',
    canIUseGetUserProfile: false,
    // ======= 做任务赚积分数据  
    is_Signtask:0,
    task_id: 0,
    is_signTaskMask: false,
    taskMaskpreview_title:'',
    taskMaskpreview_jifen:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // ======= 做任务赚积分数据  
    if(options.is_Signtask){
      that.setData({
        is_Signtask: options.is_Signtask,
        task_id: options.task_id
      })
      that.getDoneTask(options.task_id,options.jifen);
    }
    // ======= 做任务赚积分数据  
    that.setData({
      is_jifenjiaoyi:app.data.is_jifenjiaoyi,
      member_id:wx.getStorageSync('member_id')
    })
    // if(that.data.supe_idx == 1){
    //   let that = this;
    // that.setData({
    //   pagesUrl:'/pages/huishou/types/index'
    // })
    // }
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        member_id: member_id,
        pop2: false
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

    that.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  getData(){
    this.getBannerUrls();
  },
  getUserInfo: function(e) { //授权 获取个人信息
    publicMethod.getUserInfo(e,this);
  },
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  getUserProfile() {
    publicMethod.getUserProfile(this);
  },
  items_image(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let pagesUrl = e.currentTarget.dataset.pagesurl;
    that.setData({
      supe_idx:id,
      pagesUrl,
    })
  },
  footer_btn(){
    let that = this;
    let supe_idx = that.data.supe_idx;
    let pagesUrl = that.data.pagesUrl;
    let member_id= wx.getStorageSync('member_id');
    wx.navigateTo({
      url: pagesUrl +'?type=' + supe_idx,
      })
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/banner/newInfo', {
      member_id: that.data.member_id,
      type:10
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          top_img: res.data.data,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
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

    }
  },
  isLogin() {
    let that = this
    if (that.data.member_id == 0) {
      wx.showToast({
        title: '请点击底部栏【我的】先进行登录，然后再进行此操作',
        icon: 'none'
      })
    }
  },

  // 生成海报
  gotoMakephoto() {
    let that = this;
    let apiUrls = Makephoto.makeUrl
    wx.showLoading({
      title: "合成中...",
      icon: 'none',
      mark: true,
    })
    wx.hideLoading();
    that.setData({
      makephoto: true,
      makephoto_img: apiUrls + 'huishou.jpg',
    })
  },
  // 保存海报
  saveImage(e) {
    publicMethod.saveImage(e, this);
  },
  //图片预览
  previewImage(e) {
    let image_url = [];
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
  donate_types(){
    wx.navigateTo({
      url: '/packageA/pages/donate_types/index',
    })
  },
  gotojifenjiaoyi(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      that.setData({
        is_jifenjiaoyi:false
      })
    }else{
      common.get("/content_personal/is_jf",{
        member_id,
      }).then(res =>{
        if(res.data.code == 200){
          let is_jf = res.data.data;
          if(!is_jf){
            // 没领取过积分
            app.data.is_jifenjiaoyi = false;
            that.setData({
              is_jifenjiaoyi:false
            })
            wx.navigateTo({
              url: '/packageA/pages/inttran_receive/index?is_huishou=1',
            })
          }else{
            app.data.is_jifenjiaoyi = false;
            that.setData({
              is_jifenjiaoyi:false
            })
          }
          
        }else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e =>{
        wx.showToast({
          title: e.data.message,
          icon:'none'
        })
      })
    }
  },
  hidden_mask(){
    let that = this;
    app.data.is_jifenjiaoyi = false;
    that.setData({
      is_jifenjiaoyi:false
    })
  },
  // =========  做任务赚积分 弹窗功能 =======
  // 做任务赚积分跳转过来
  getDoneTask(id,jifen){
    let that = this;
    let task_id = id;
    let taskMaskpreview_jifen = jifen;
    common.get('/mine/index?op=done_task',{
      member_id: wx.getStorageSync('member_id'),
      task_id,
    }).then(res =>{
      if(res.data.code == 200){
      if(that.data.is_Signtask == '1'){
        that.setData({
          is_signTaskMask: true,
          taskMaskpreview_title:'欢迎了解垃圾分类线上投放',
          taskMaskpreview_jifen,
        })
        setTimeout(function(){
          that.setData({
            is_signTaskMask: false,
            taskMaskpreview_title:'',
            taskMaskpreview_jifen:'',
            is_Signtask: 0
          })
        },2000)
      }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  click_mask(){
    this.setData({
      is_signTaskMask: false,
      taskMaskpreview_title:'',
      taskMaskpreview_jifen:'',
      is_Signtask: 0
    })
  },
// =========  做任务赚积分 弹窗功能 =======
})