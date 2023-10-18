const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    member_id: '',
    library_id:'',
    personalInfo: '',
    business_info: '',
    grade:'暂无等级',
    true_bunn:0,
    realAmount: '',
    unData: {
      unlauds: 0,
      unreads: 0,
      uncomment: 0
    },
    identify: {
      id: '', //身份对应的id
      flag: '', //身份标识 1为普通会员，2为商家，3为回收员
    },
    is_dd:false
  },
  onTabItemTap(item) {
    if (item.index == 3) {
      wx.hideTabBarRedDot({
        index: 3
      })
    }
  },
  onLoad: function(options) {
    let that = this
    // 登录
    wx.login({
      success: function(data) {
        console.log(data)
        that.setData({
          loginData: data
        })
      }
    })
    // 获取定位
    // publicMethod.zhuan_baidu(this);
    // 禁止右上角转发
    wx.hideShareMenu();
  },
  onShow: function() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return
    } else {
      that.setData({
        member_id: wx.getStorageSync('member_id'),
        personData: wx.getStorageSync('user_info'),
        pop2: false
      })
      // 获取数据
    that.getData();
    }
    // 未读
    // publicMethod.getUnreadNum(this);

  },
  onUnload: function() {
    console.log('触发了onunload')
  },
  //下拉刷新
  onPullDownRefresh() {
    let that = this;
    that.getData();
    wx.stopPullDownRefresh();
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  getData() {
    let that = this;
    that.getPersonInfo();
    that.getUserIdentify();
  },
  //获取个人信息
  getPersonInfo() {
    let that = this;
    common.get('/content/getMemberInfo', {
      member_id: that.data.member_id
    }).then(res => {
      if (res.data.code == 200) {
        wx.setStorageSync('business_info', res.data.business_info);
        wx.setStorageSync('personalInfo', res.data.data);
        that.setData({
          business_info: res.data.business_info,
          personalInfo: res.data.data,
          library_id: res.data.library_id,
          true_bunn:1,
          grade:res.data.isRv.grade
        });

      }

    })
  },
  //获取登录人的身份
  getUserIdentify() {
    let that = this;
    common.get("/member/getMemberIdentity", {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res.data)
      if (res.data.code == 200) {
        that.setData({
          ['identify.id']: res.data.id,
          ['identify.flag']: res.data.identity,
          waitOrder: res.data.waitOrder,
          completed: res.data.completed,
          receivedOrder: res.data.receivedOrder,
          image1: res.data.image1,
          image2: res.data.image2,
          image3: res.data.image3,
          image4: res.data.image4,
          image5: res.data.image5,
          image6: res.data.image6,
          name1: res.data.name1,
          name2: res.data.name2,
          name3: res.data.name3,
          name4: res.data.name4,
          name5: res.data.name5,
          name6: res.data.name6,
          url_shop:res.data.url_shop,
          url_liarbry:res.data.url_liarbry,
          avatar: res.data.avatar,
          nickname: res.data.nickname,
        })
      }
    })
  },
  //查询回收订单
  goToOrderPage(e) {
    let that = this;
    let url = '/pages/mine/myOrder/index?id=' + that.data.identify.id + '&flag=' + that.data.identify.flag + '&status=' + e.currentTarget.dataset.status+ '&cur=0';
    wx.navigateTo({
      url: url
    })
  },
  goToMyComment1(e) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    let business_id = that.data.personalInfo.business_id;
    console.log(business_id)
    if (!member_id) {
      console.log('未授权')
      //todo 执行跳转登录页面
      publicMethod.gotoLoginMark();
      return
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url+'&member_id='+member_id +'&business_id='+business_id,

      })
    }
  },
  goToMyComment(e) {
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      console.log('未授权')
      publicMethod.gotoLoginMark();
      return
      //todo 执行跳转登录页面
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }

  },
  clickIsdd_mask(){
    this.setData({
      is_dd: false
    })
  },
  // 个人订单---  商家订单
  gotoshopdd(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  // 商品订单
  clickspdd(e) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      console.log('未授权')
      publicMethod.gotoLoginMark();
      return
      //todo 执行跳转登录页面
    } else {
      let business_id = that.data.business_info.id;
      if(business_id){
        that.setData({
          is_dd: true
        })
      }else{
        //买的订单
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
      }

    }
  },
  goToMyCoupon(e) {
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      console.log('未授权')
      publicMethod.gotoLoginMark();
      return
      //todo 执行跳转登录页面
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
    })
  },

  makeCall() {
    wx.makePhoneCall({
      phoneNumber: "010-84672332"
    })
  },
  goToCheck(e) {
    let that = this;
    let dataset_id = that.data.identify.id
    wx.navigateTo({
      url: '/pages/shop/shop?business_id=' + dataset_id
    })
  },
  goToCheee() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },
  goToWallet() {
    wx.navigateTo({
      url: '/pages/mine/wallet/index'
    })
  },
  gotoBuyintegral_list(){
    wx.navigateTo({
      url: '/packageA/pages/buyintegral_list/index'
    })
  },
  goToIdle() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    let url = '/pages/getalllist/getalllist';
    // let url = '/pages/mine/myIdleIndex/index?member_id=' + member_id;
    wx.navigateTo({
      url: url
    })
  },
  goTono() {
    wx.showToast({
      title: '敬请期待...',
      icon: 'none'
    })
  },
  // 前往浏览记录
  goToBrowsing_history(e) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  // 前往入驻商城
  goToregister() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    wx.navigateTo({
      url: "/pages/register/register?member_id=" + member_id
    })
  },
  goTogoodSales() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    if(that.data.business_info.type == 2){
      wx.navigateTo({
        url: "/pages/mine/goodSales/index?member_id=" + member_id
      })
    }else{
      wx.showToast({
        title: '您暂未注册二级商！',
        icon: 'none'
      })
      return
    }
    
  },
    /**
   * 进入个人图书馆首页 
  */
 goToindex_personal(e){
  console.log(e)
  let that = this;
  let member_id = wx.getStorageSync('member_id');
  if(!member_id){
    publicMethod.gotoLoginMark();
    return
  }
  let library_id = e.currentTarget.dataset.library_id;
  if(library_id){
    wx.navigateTo({
      url: e.currentTarget.dataset.url + library_id 
    })
  }else{
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }

},
gotocircle(){
  let member_id = wx.getStorageSync('member_id');
  if(!member_id){
    publicMethod.gotoLoginMark();
    return
  }
  wx.reLaunch({
    url: '/pages/circle/circle',
  })
},
gotolove_donate(){
  let member_id = wx.getStorageSync('member_id');
  if(!member_id){
    publicMethod.gotoLoginMark();
    return
  }
  wx.navigateTo({
    url: '/packageA/pages/love_donate/index',
  })
},
gotoidleorder(){
  let member_id = wx.getStorageSync('member_id');
  if(!member_id){
    publicMethod.gotoLoginMark();
    return
  }
  wx.navigateTo({
    url: '/packageA/pages/idleorder_list/index',
  })
},
jump_frog(){
  let member_id = wx.getStorageSync('member_id');
  if(!member_id){
    publicMethod.gotoLoginMark();
    return
  }
  wx.navigateTo({
    url: '/packageA/pages/merchant_entrance/index',
  })
},
gotodongao(){
  let member_id = wx.getStorageSync('member_id');
  if(!member_id){
    publicMethod.gotoLoginMark();
    return
  }
  wx.navigateTo({
    // url: '/packageB/pages/winter_olympics/winter_punch/index',
    url: '/packageB/pages/winter_olympics/winter_punchlist/index',
  })
},
// 我的好友
goToMyhy(){
  let member_id = wx.getStorageSync('member_id');
  if(!member_id){
    publicMethod.gotoLoginMark();
    return
  }
  // wx.showToast({
  //   title: '暂未开通！',
  //   icon:'none'
  // })
  // return
  wx.navigateTo({
    url: '/packageB/pages/mygood_friend/index',
  })
},
  getUserProfile(){
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    wx.navigateTo({
      url: '/pages/login_mark/index',
    })
  },
  gotoModifyInfo(){
    wx.navigateTo({
      url: '/pages/modifyInfo/index',
    })
  }
})