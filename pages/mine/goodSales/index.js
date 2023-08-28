const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
Page({
  data: {
    nickName: '',
    avatarUrl: '',
    memberid: '',
    swiperCurrent: 0,
    textVal: '',
    personalInfo: '',
    wenzData: [],
    infoData: [],
    savaStatus: true,
    isfenxiang: false,
    isReset: 0, //子页面跳转是否刷新页面,
    showEditBox: false,
    content_id: 0,
    copy_business: 0,
    pageIndex:1,
    pageSize:10,
    hasMore: true
  },
  onLoad: function (options) {
    console.log(options)
    let that = this
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    
    if (options.member_id) {
      that.setData({
        member_id: options.member_id,
        shangjia_id: options.member_id,
        memberid: wx.getStorageSync('member_id'),
        personData: wx.getStorageSync('user_info')
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
    that.getUserIdentify();
  },
  onShow() {
    let that = this
    publicMethod.zhuan_baidu(this)
    that.setData({
      dataStatus: false,
      pop2: false,
      pop3: false,
      popidx: false,
      configData: wx.getStorageSync('configData'),
      business_id: wx.getStorageSync('business_id'),
      personalInfo: wx.getStorageSync('personalInfo'),
      personData: wx.getStorageSync('user_info'),
    });
    that.getData();
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
    //初始化下拉刷新加载数据列表
    that.onPullDownRefresh();
    //全局配置
    publicMethod.getConfig(this)
  },
  //获取登录人的身份
  getUserIdentify() {
    let that = this;
    common.get("/member/getMemberIdentity", {
      member_id:that.data.member_id
    }).then(res => {
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
    if (!that.data.hasMore) {
      wx.showToast({
        title: '到底了...',
        icon: 'none',
      })
      return
    }
    common.get('/sale/mySale', {
      member_id: that.data.shangjia_id,
      page: that.data.pageIndex
    }).then(res => {
      let wenzData = that.data.wenzData.concat(res.data.data.res);
      let count = res.data.data.total;
      let flag = that.data.pageIndex * that.data.pageSize < count;
      console.log(flag)
      that.setData({
        wenzData,
        pageIndex: (that.data.pageIndex + 1),
        hasMore: flag,
      })
      wx.hideLoading()
      if (wenzData.length <= 0) {
        setTimeout(function () {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }

    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
    })
  },
  // 搜索 
  searchSubmit(e) {
    console.log(e)
  },
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  //前往活动详情
  goToActivity(e) {
    let that = this;
    let idle_id = e.currentTarget.dataset.idle;
    let is_daimai = e.currentTarget.dataset.is_daimai;
    let is_idle = e.currentTarget.dataset.is_idle;
    let member_id = wx.getStorageSync('member_id');
    let content_id = e.currentTarget.dataset.content_id;
    let copy_business = e.currentTarget.dataset.copy_business;
    let url = "/pages/mine/myIdle_good/index?member_id=" + member_id + "&idle_id=" + idle_id + "&is_daimai=" + is_daimai;
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
  delCircle(e) { //删除图文
    console.log(e)
    let that = this;
    let discount_id = e.target.dataset.content_id;
    let content_id = e.target.dataset.discount_id;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          common.get('/sale/saleDelete', {
            member_id: that.data.member_id,
            discount_id,
            content_id
          }).then(res => {
            console.log("删除图文")
            if (res.data.code == 200) {
              that.setData({
                popidx: false,
                pop3: false
              })
              let data = that.data.wenzData
              data.splice(curIdx, 1)
              if (data.length <= 0) {
                that.setData({
                  dataStatus: true
                })
              }
              that.setData({
                wenzData: data
              })
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })

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
  openguanli(e) { //打开管理
    publicMethod.openFun(e, this)
    let that = this;
    common.get('/business/getBusinessAddInfo', {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
    }).then(res => {
      console.log(res.data)
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
    })
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
        if (!earnings) {
          let contentId = res.target.dataset.contentid;
          let shareTxt = res.target.dataset.sharetxt;
          let discount_price = res.target.dataset.discount_price;
          let gdImages = res.target.dataset.gdimages;
          var shareImage = that.data.infoData.bgimg
          if (gdImages.length > 0) {
            var shareImage = gdImages
          }
          if ( res.target.dataset.confirm ){
            return {
              title:shareTxt,
              path: '/pages/mine/myIdle/index?share=' + that.data.member_id + '&contentid=' + contentId + '&discount_price=' + discount_price + '&shareImage=' + shareImage + '&shareTxt=' + shareTxt,
              imageUrl: shareImage,
              success: function (res) {
                // 转发成功
                console.log(res)
              },
              fail: function (res) {
                // 转发失败
              }
            }
          }else{
            return {
              title: '我的代卖' + shareTxt,
              path: '/pages/mine/goodSales/index?member_id=' + that.data.member_id + '&contentid=' + contentId,
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
    }
    return {
      title: '我的代卖',
      imageUrl: '',
      path: '/pages/mine/goodSales/index?member_id=' + that.data.member_id,
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
    that.setData({
      pageIndex:1,
      hasMore: true,
      wenzData: [],
    })
    that.getwenzhang();
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom() { //上拉加载
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
      success() {
        that.getwenzhang();
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
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
  // 返回上一步按钮
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/getalllist/getalllist" });
    }
  },
  popLock_itemm() {
    let that = this;
    that.setData({
      pop3: 0
    })
  },
  //上下架活动
  stand(e) {
    let that = this
    let member_id = that.data.member_id;
    let stand = e.currentTarget.dataset.stand;
    let sale_id = e.currentTarget.dataset.sale;
    let index = e.currentTarget.dataset.idx;
    let sale_status = e.currentTarget.dataset.sale_status;

    let stand_text = stand == 1 ? '上架' : '下架'
    console.log(e)
    if (sale_status == 1){
      wx.showToast({
        title: '卖家确认信息后才可上架',
        icon:'none'
      })
      return
    }
    wx.showModal({
      content: '确定进行' + stand_text,
      success: function (res) {
        if (res.confirm) {
          common.get("/sale/saleStand", {
            sale_id: sale_id,
            member_id: member_id,
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
                    that.getData();
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
  // 修改
  edit(e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    var is_sales = e.currentTarget.dataset.is_sales;
    wx.navigateTo({
      url: '/pages/mine/myIdlerelease/index?sale_id=' + id + '&is_sales=' + is_sales,
    })
    that.setData({
      pop3: 0
    })
  },
  // 发布代卖物品
  idleRelease(e) {
    let that = this;
    let is_sales = e.currentTarget.dataset.is_sales;
    wx.navigateTo({
      url: '/pages/mine/myIdlerelease/index?is_sales=' + is_sales,
    });
  },
  // 查看物流
  viewLogistics(e) {
    console.log(e)
    let that = this;
    let discount_order_tid = e.currentTarget.dataset.discount_order_tid;
    let order_tid = e.currentTarget.dataset.order_id;
    let in_stock = e.currentTarget.dataset.in_stock;

    let url = "/pages/viewLogistics/viewLogistics?discount_order_tid=" + discount_order_tid + "&order_id=" + order_tid + "&in_stock=" + in_stock;
    wx.navigateTo({
      url: url,
    })

  }
})