
const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    reeachBottomStatus: true,
    textVal: '',
    personalInfo: '',
    inpPlaceholder: '发表评论',
    wenzData: [],
    wenzDatalist:[],
    newWenzData:[],
    infoData: [],
    page1: [],
    showFull: [],
    loadend: [],
    savaStatus: true,
    isfenxiang: false,
    isReset: 0, //子页面跳转是否刷新页面,
    showEditBox: false,
    content_id: 0,
    copy_business: 0,
    winHeight: "",
    pageIndex:1,
    pageSize:20,
    hasMore: true,
    canIUseGetUserProfile: false

  },
  onLoad: function (options) {
    console.log(options)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let that = this
    // 登录
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })

    if (options.member_id) {
      wx.setStorageSync("member_id", options.member_id)
      that.setData({
        member_id: options.member_id
      })
    }
    if (options.business_id) {
      wx.setStorageSync("business_id", options.business_id)
      that.setData({
        isfenxiang: true
      })
    } else {
      that.setData({
        isfenxiang: false
      })
    }
  },
  onShow() {
    let that = this
    publicMethod.zhuan_baidu(this)
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return
    } else {
      that.setData({
        pop2: false,
      })
     that.getData();

    }
    that.setData({
      dataStatus: false,
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
      circle_page: 1,
      showFull: []
    })
  },
  onHide() {
    let that = this
    that.setData({
      isReset: 0
    })
  },
  onUnload() {
    let that = this
    that.setData({
      isReset: 0
    })
  },
  getData() { //初始化数据
    let that = this
    //列表
    that.getwenzhang();
    //全局配置
    publicMethod.getConfig(this)
  },
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  // 微信授权
  getUserProfile() {
    publicMethod.getUserProfile(this,this.getData);
  },
  //商品列表
  getwenzhang() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/idle/selfStore', {
    }).then(res => {

      let wenzDatalist = res.data;//获取存储总数据 
      that.setData({
        wenzDatalist
      })
      wx.hideLoading()
      if (wenzDatalist.length <= 0) {
        setTimeout(function () {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      let pageSize = that.data.pageSize;// 获取每页个数
      for (let i = 0; i < wenzDatalist.length; i += pageSize) {
        // 分割总数据，每个子数组里包含个数为pageSize
        that.data.newWenzData.push(wenzDatalist.slice(i, i + pageSize))
      }
      that.getlistData();
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  getlistData() { // 前端实现一次获取总数据后分页获取数据
    let that = this;
    if (!that.data.hasMore) {
        wx.showToast({
          title: '到底了...',
          icon: 'none'
        })
      return
    }
    let page = (that.data.pageIndex - 1);
    let newWenzData = that.data.newWenzData;
    let count = that.data.wenzDatalist.length; //获取数据的总数长度
    let flag = that.data.pageIndex * that.data.pageSize < count;
    that.setData({
      // 将新获取的数据拼接到之前的数组中
      wenzData: that.data.wenzData.concat(newWenzData[page]),
      hasMore: flag,
    })
    console.log(that.data.wenzData)
  },
  // 搜索 
  searchSubmit(e) {
    console.log(e)
  },

  goChat(e) {
    wx.showTabBar()
    this.setData({
      pop3: false,
      popidx: false
    })
    publicMethod.getFormId(e, this)
    let options = e.currentTarget.dataset.options;
    let param = {
      be_member_id: options.member_id,
      name: options.home_nickname,
      type: options.type
    }
    wx.navigateTo({
      url: '/pages/chatDetail/index?param=' + JSON.stringify(param),
    })
  },
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  //前往活动详情
  goToActivity(e) {
    console.log(e)
    let that = this;
    let discountid = that.data.discountid;
    let member_id = that.data.member_id;
    let business_id = e.currentTarget.dataset.business_id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let content_id = e.currentTarget.dataset.content_id;
    let copy_business = e.currentTarget.dataset.copy_business;
    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + member_id + "&discount_id=" + discount_id + '&content_id=' + content_id + "&copy_business=" + copy_business;
    wx.navigateTo({
      url: url
    })
  },
  //编辑弹框
  showEdit() {
    let that = this;
    that.setData({
      showEditBox: true
    })
  },
  //跳转到详情页面
  goToDetail(e) {
    let url = "/pages/circle_detail/circle_detail?contentid=" + e.currentTarget.dataset.contentid;
    wx.navigateTo({
      url: url
    })
  },
  //打电话
  openCall(e) {
    let phone = e.currentTarget.dataset.phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    } else {
      wx.showToast({
        title: '暂无联系方式！',
        icon: 'none'
      })
    }

  },
  openFun(e) { //打开私信和拨打电话
    publicMethod.openFun(e, this)
  },
  callTel(e) { //打电话
    publicMethod.callTel(e, this)
  },
  openFulltxt(e) { //打开全文
    publicMethod.openFulltxt(e, this)
  },
  previewImage: function (e) { //图片预览
    publicMethod.previewImage(e, this)
  },

  loadMore(e) { //加载更多评论
    publicMethod.loadMore(e, this)
  },
  hfComment(e) { //回复评论
    publicMethod.hfComment(e, this)
  },
  openComment(e) { //打开评论弹框
    publicMethod.openComment(e, this)
  },
  bindTextChange(e) { //留言val
    publicMethod.bindTextChange(e, this)
  },
  sendComment(e) { //评论
    publicMethod.sendComment(e, this)
  },
  swiperChange: function (e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swiperChange: function (e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function (event) { // 初始化弹框
    this.setData({
      textVal: '',
      inpPlaceholder: '发表评论',
      showEditBox: 0
    })
    wx.showTabBar()
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },

  onShareAppMessage: function (res) { //分享
    console.log(res)
    let that = this
    if (res.target) {
      let contentId = res.target.dataset.contentid;
      let earnings = res.target.dataset.earnings;
      // debugger
      if (res.from === 'button') {
        let earnings = ''
        if (!earnings) {
          let business_id = res.target.dataset.business_id;
          let discount_id = res.target.dataset.discount_id;
          let content_id = res.target.dataset.content_id;
          let copy_business = res.target.dataset.copy_business;
          let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + that.data.member_id + "&discount_id=" + discount_id + '&content_id=' + content_id + "&copy_business=" + copy_business;
          let shareTxt = res.target.dataset.sharetxt;
          let gdImages = res.target.dataset.gdimages;
          var shareImage = that.data.infoData.bgimg
          if (gdImages.length > 0) {
            var shareImage = gdImages
          }
          return {
            title: shareTxt,
            path: url,
            imageUrl: shareImage,
            success: function (res) {
              // 转发成功
              console.log(res)
            },
            fail: function (res) {
              // 转发失败
            }
          }
        } else {
          return {
            title: '自营仓库',
            path: '/pages/getallself/getallself',
            success: function (res) {
              // 转发成功
              console.log(res)
            },
            fail: function (res) {
              // 转发失败
              console.log(res)
            }
          }
        }
      }
    }
    return {
      title: '自营仓库',
      path: '/pages/getallself/getallself',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    // 下拉刷新页面
    // 把数据先设置回默认值
    this.setData({
      pageIndex: 1,
      showFull: [],
      wenzData:[],
      loadend: [],
      hasMore: true,
    });
    that.getlistData()
    //记得停止，否则在手机端一直存在
    wx.stopPullDownRefresh()
  },
  // 触底函数
  onReachBottom() {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
      success:function(){
        setTimeout(function () {
          that.setData({
            pageIndex: (that.data.pageIndex + 1)
          })
          wx.hideLoading()
          that.getlistData();
        }, 1000)
      }
    })
      
  },
  //一键复制
  copy(e) {
    let that = this
    setTimeout(function () {
      common.get("/content/copyContents", {
        content_id: e.currentTarget.dataset.contentid,
        member_id: that.data.personalInfo.id,
        copy_business: that.data.personalInfo.business_id,
        id: e.currentTarget.dataset.id
      }).then(res => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }).catch(error => {
        console.log(error);
      })
    }, 100)
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

  myCatchTouch() { //弹框状态禁止滑动
    return;
  },

  // 订单管理跳转
  goToMyComment(e) {
    let member_id = wx.getStorageSync('member_id')
    console.log(e)
    if (!member_id) {
      console.log('未授权')
      //todo 执行跳转登录页面
    } else {
      if (e.currentTarget.dataset.url == "/pages/bank/bank") {
        wx.reLaunch({
          url: e.currentTarget.dataset.url
        })
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
})