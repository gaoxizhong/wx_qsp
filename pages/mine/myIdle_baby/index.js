const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatarUrl:'',
    memberid:'',
    wenzData:[],
    page:1,
    canIUseGetUserProfile: false,
    idle_hidden: false,
    screenHeight:0,
    typeStatus:1,
    all: 0, // 全部
    shangjia: 0,  //  上架（在售）
    xiajia: 0,  // 下架
    browse: 0,  // 浏览量
    groupcount: 0, // 浏览量
    purchasecount: 0, // 浏览量
    chushou:0, // 已售
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.getSystemInfo({
      success : res => {
        console.log(res)
        this.setData({
          screenHeight:res.screenHeight*2
        })
        console.log(this.data.screenHeight)
      }
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
      this.setData({
        // member_id: this.options.member_id,
        shangjia_id: this.options.member_id,
        memberid:wx.getStorageSync('member_id'),
        personData: wx.getStorageSync('user_info'),
        idle_hidden:true
      })
    }
    if (this.options.share) {
      console.log(options)
      this.setData({
        type:1,
        share: this.options.share,
        salesImage: this.options.shareImage,
        salesPrice: this.options.discount_price,
        salesTitle: this.options.shareTxt,
        sale_id: this.options.contentid,
        idle_hidden: true
      })
    }
    if (this.options.business_id) {
      wx.setStorageSync("business_id", this.options.business_id)
      this.setData({
        isfenxiang: true
      })
    } else {
      this.setData({
        isfenxiang: false
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
  getData() { //初始化数据
    let that = this;
    that.getUserIdentify();
    //列表
    that.getwenzhang();
  },
  //获取登录人的身份
  getUserIdentify() {
    let that = this;
    let prems = {
      member_id: that.data.shangjia_id,
    }
    if (that.data.share) {
      prems.member_id = wx.getStorageSync('member_id');
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
      let wenzData = res.data.data;
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
        all: res.data.all,
        shangjia: res.data.shangjia,
        xiajia: res.data.xiajia,
        browse: res.data.browse,
        groupcount: res.data.groupcount,
        purchasecount: res.data.purchasecount,
        chushou: res.data.chushou,
      })
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
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
    let that = this;
    that.setData({
      page: 1,
      wenzData: [],
    })
    that.getwenzhang();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { 
    var that = this;
    wx.showToast({
      title: '已加载全部...',
      icon:'none'
    })
  setTimeout(function(){
    wx.hideLoading()
  },1500)
  },
  lower(){
    var that = this;
    wx.showToast({
      title: '已加载全部...',
      icon:'none'
    })
    setTimeout(function(){
      wx.hideLoading()
    },1500)
  },
  //头部栏切换
  changeTabItem(e) {
    let that = this;
    that.setData({
      typeStatus: e.currentTarget.dataset.status,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gotokongjian(){
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id=' + this.data.shangjia_id,
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
  //上下架活动
  stand(e) {
    let that = this
    let member_id = that.data.member_id;
    let stand = e.currentTarget.dataset.stand;
    let idle_id = e.currentTarget.dataset.idle;
    let is_idle = e.currentTarget.dataset.is_idle;
    let index = e.currentTarget.dataset.idx;
    let stand_text = stand == 1 ? '上架' : '下架'
    console.log(e)
    wx.showModal({
      content: '确定进行' + stand_text,
      success: function (res) {
        if (res.confirm) {
          common.get("/idle/idleStand", {
            idle_id: idle_id,
            is_idle: is_idle,
            member_id: wx.getStorageSync('member_id'),
            stand: stand
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                icon: 'success',
                duration: 2000,
                title: stand_text + '成功',
                  success: function (res) {
                    that.setData({
                      pop3: false
                    });
                    setTimeout(function () {
                    that.getwenzhang();
                    }, 1500)
                  }
              })
            } else {
              wx.showToast({
                icon: 'fail',
                duration: 1000,
                title: stand_text + '失败'
              })
            }
          })
        }
      }
    })
  },
})