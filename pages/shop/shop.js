const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const Makephoto = require('../../assets/js/setting');
const zhuan_dingwei = require('../../assets/js/dingwei.js');
const setting = require('../../assets/js/setting');

let page = 2;
Page({
  data: {
    communityinfoData:{},
    realAmount: '',  //环保财富值
    user_name: '',
    user_tel: '',
    buyer_address:{},
    goodnum:1,
    is_communityInfo:false, // 是否点击社区大集商品兑换按钮弹窗状态

    v_back: '',  //背景
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    reeachBottomStatus:true,
    textVal: '',
    personalInfo:'',
    inpPlaceholder: '发表评论',
    wenzData: [],
    xianData:[],
    infoData: [],
    page1: [],
    showFull: [],
    loadend: [],
    savaStatus: true,
    isfenxiang: false,
    isReset: 0, //子页面跳转是否刷新页面,
    content_id: 0,
    copy_business:0,
    winHeight: "",
    navActive: 1,
    currentTab: 1,
    lists:[],
    rder:0,
    qwe: 0,
    desc:'',
    discountid:0,
    makephoto: false,
    makephoto_img: '',
    hidden_infodata:false,
    switchvalue:false,
    is_mark:false,
    is_ad:1,
    is_agent:false,
    is_put:false,
    set_name:'',
    set_phone:'',
    selec_id:1,
    yulian_selec_id:1,
    gl_integral:'30',
    selec_distance:0,
    selec_distance_name:'3',
    put_distance:[],
    latitude: '',
    longitude: '',
    canIUseGetUserProfile: false,
    select_type:0,
    select_id:0,
    is_goToSign:true,
    storyList:[],
    is_footer:false,
    distance: 0.00,
    like_status: true,
    is_index: 0,
    is_yzm: 0
  },
  onLoad: function(options) {
    let that = this;
    console.log('onLoad')
    if(options.is_yzm){
      that.setData({
        is_yzm: options.is_yzm
      })
    }
    console.log(options)
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id');
    console.log(member_id)
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        pop2: false
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if(options.is_circle == 1){
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        is_circle: 1
      })
    }
    if(options.is_index){
      this.setData({
        is_index: options.is_index
      })
    }
    console.log(this.data.this)
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
      wx.setStorageSync("business_id", this.options.b)
      wx.setStorageSync("scancode", 1)
    }
    console.log(this.options) // 这时候就会发现this.options上就会有对应的参数了
    if (options.contentid) {
      wx.setStorageSync("contentid", this.options.contentid)
      that.setData({
        content_id: this.options.contentid
      })
    }
    if (this.options.business_id) {
      wx.setStorageSync("business_id", this.options.business_id)
      that.setData({
        isfenxiang: true
      })
    } else {
      that.setData({
        isfenxiang: false
      })
    }
    if(this.options.c){
      wx.setStorageSync("business_id", this.options.b)
      that.setData({
        code_id:this.options.c,
        business_id:this.options.b,
        integual:this.options.i,
        is_mark:true,
      })
    }
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 200;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    that.setData({
      currentTab: 1,
      qwe: false,
      select_type: app.data.select_type,
      select_id: app.data.select_id,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
  },
  onShow() {
    console.log('onShow')

    publicMethod.zhuan_baidu(this);
    let that = this;
    this.audioCtx = wx.createAudioContext('myAudio');
    let member_id = wx.getStorageSync('member_id');
    if(app.data.select_id != 0|| !app.data.select_id){
      that.setData({
        select_id: app.data.select_id
      })
    }
    that.setData({
      dataStatus:false,
      dataStatu: false,
      member_id: member_id,
      pop2: false,
      page1: [],
      showFull: [],
      like_status: true,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      // business_id: wx.getStorageSync('business_id') || 15,
      business_id: wx.getStorageSync('business_id'),
      personalInfo: wx.getStorageSync('personalInfo')
      
    })
    if (wx.getStorageSync('scancode') == 1) {
      wx.setStorageSync("scancode", 0)
      common.get('/scancode', {
        member_id: wx.getStorageSync('member_id'),
        business_id: wx.getStorageSync('business_id')
      }).then(res => {
        console.log("记录扫码")
        console.log(res)
      }).catch(e => {
        console.log(e)
      })
    }
    that.getData();


  },
  onHide() {
    this.audioCtx.pause()
    let that = this
    that.setData({
      isReset: 0
    })
  },
  onUnload() {
    this.audioCtx.pause()
    let that = this
    that.setData({
      isReset: 0
    })
  },
  getData() { //初始化数据
    let that = this;
    let currentTab = that.data.currentTab;
    that.setData({
      wenzData:[],
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
    // 店铺信息
    that.getBusinessInfo();

    // 获取新鲜事
    that.getStoryList();
    // 优惠券
    // that.getMeConcern();
    if(currentTab == '0'){
      //列表
      that.getwenzhang();
    }else if(currentTab == '1'){
      that.getMeConcern();
    }


  },
  // 打卡趣事
  getStoryList(){
    let that = this;
    common.get("/business/story_list", {
      business_id: that.data.business_id,
    }).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          storyList: res.data.data.list,
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  //查询商家信息
  getBusinessInfo() {
    let that = this;
    let peras =  {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      lng: that.data.longitude,
      lat: that.data.latitude,
    }
    if(that.data.is_index){
      peras.is_index = 1
    }
    common.get("/business/getBusinessInfo",peras).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          is_index: 0
        })
        if (res.data.data.is_password == 2) {
          that.setData({
            switchvalue: false,
          })
        } else if (res.data.data.is_password  == 1) {
          that.setData({
            switchvalue: true
          })
        }
        that.setData({
          infoData: res.data.data,
          v_back: res.data.data.bgimg,
          is_ad:res.data.is_ad,
          is_agent:res.data.is_agent,
          hidden_infodata:true,
          put_distance:res.data.put_distance,
          distance: res.data.distance,
          browse_list: res.data.browse_list.splice(0,3),
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },

  //商品列表
  getwenzhang() { 
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/business/getBusinessContent', {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      page: 1
    }).then(res => {
      wx.hideLoading();
      let wenzData = res.data.contents;

      if (wenzData.length <= 0) {
          that.setData({
            dataStatus: true
          })
      }else{

        that.setData({
          currentTab: 0,
          dataStatus: false,
          wenzData,
          qwe:true
        })
      }
      for (var i = 0; i < wenzData.length; i++) {
        let that=this;
        that.data.page1.push(1)
        that.data.loadend.push(false)
        let obj = {}
        // obj.leng = wenzData[i].words.length
        obj.status = false
        that.data.showFull.push(obj)
      }
      that.setData({
        loadend: that.data.loadend,
        showFull: that.data.showFull,
      })
      page = 2
    }).catch(e => {
      that.setData({
        dataStatus: true
      })
      console.log(e)
      page = 2
    })
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
  guanzhu(e) { //关注
    let that = this;
    publicMethod.guanzhu(e, this, function (res) {
      if (res.data.msg == "已关注") {
        that.setData({
          ['infoData.is_concern']: 1
        })
      } else {
        that.setData({
          ['infoData.is_concern']: 0
        })
      }
    })
  },
  // 前往趣事详情页
  goTonewThing_detail(e){
    console.log(e)
    let that = this;
    app.data.newThingInfo = {};
    let business_id = e.currentTarget.dataset.business_id;
    let id = e.currentTarget.dataset.id;
    let storyList = that.data.storyList;
    let newThingInfo = {};
    storyList.forEach(ele =>{
      if(id == ele.id) {
        newThingInfo = ele
      }
    })
    app.data.newThingInfo = newThingInfo;
    wx.navigateTo({
      url: '/packageA/pages/newThing_detail/index',
    })
  },
  //前往活动详情
  goToActivity(e) {
    console.log(e)
    let that = this;
    let is_yzm = that.data.is_yzm;
    let discountid = that.data.discountid;
    let member_id = that.data.member_id;
    let business_id = e.currentTarget.dataset.business_id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let content_id = e.currentTarget.dataset.content_id;
    let copy_business = e.currentTarget.dataset.copy_business;
    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + member_id + "&discount_id=" + discount_id + '&content_id=' + content_id + "&copy_business=" + copy_business;
    if(is_yzm){
      url = url + '&is_yzm=' + is_yzm
    }
    wx.navigateTo({
      url: url
    })
  },
  //我的优惠券前往详情页
  goToidleActivity(e) {
    let that = this;
    let is_yzm = that.data.is_yzm;
    let id = e.currentTarget.dataset.id;
    let url = "/packageA/pages/coupon_detail/index?id=" + id
    if(is_yzm){
      url = url + '&is_yzm=' + is_yzm;
    }
    wx.navigateTo({
      url: url
    })
  },
  //编辑弹框
  showEdit(e) {
    let that = this;
    let business_id = e.currentTarget.dataset.business_id;
    wx.navigateTo({
      url: '/packageA/pages/shopModify/index?business_id=' + business_id,
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
    if ( phone ) {
      wx.makePhoneCall({
        phoneNumber:phone
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
    let discount_id = e.currentTarget.dataset.id;
    let curIdx = e.currentTarget.dataset.curidx;
    let content_id = e.currentTarget.dataset.content_id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          common.get('/business/delete_discount', {
            member_id: that.data.member_id,
            discount_id,
            content_id
          }).then(res => {

            console.log("删除图文")
            console.log(res)
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
              title: e.data.message,
              icon:'none'
            })
            console.log(e)
          })
        }
      }
    })

  },
  delCirclecoupon(e) { //删除闲置
    publicMethod.delCirclecoupon(e, this)
    console.log(e)
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
    // let that = this;
    // common.get('/business/getBusinessAddInfo', {
    //   member_id: that.data.member_id,
    //   business_id: that.data.business_id,
    // }).then(res => {
    //   console.log(res.data)

    // }).catch(e => {
    //   })
  },
  bindTextChange(e) { //留言val
    publicMethod.bindTextChange(e, this)
  },
  sendComment(e) { //评论
    publicMethod.sendComment(e, this)
  },
  like(e) { //点赞
    publicMethod.like(e, this)
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
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
  popLock: function(event) { // 初始化弹框
    this.setData({
      textVal: '',
      inpPlaceholder: '发表评论',
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

  getUserProfile(){
    let that = this;
    wx.login({
      success: (data) => {
        console.log(data)
        that.setData({
          code: data.code,
        })
      }
    })
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', 
      success: (res) => {
        console.log(res)
        wx.setStorageSync('user_info', res.userInfo);
        that.setData({
          personData: res.userInfo
        })
        common.post('/member/oauth', {
          code: that.data.code,
          encryptedData: res.encryptedData,
          iv: res.iv,
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          gender: res.userInfo.gender,

        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            that.setData({
              member_id: res.data.member_id,
              hasUserInfo: true,
              isAuthorize: false,
              pop2: false
            })
            console.log("授权成功")
            wx.setStorageSync('member_id', res.data.member_id);
            if(res.data.api_token){
              wx.setStorageSync('token', res.data.api_token);
            }

            that.rece_integral();
            that.onShow();
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }).catch(e => {
          console.log(e)
        })
        
      }
    })

  },


  onShareAppMessage: function (res) { //分享
    console.log(res)
    let that = this
    if (res.target) {
      let contentId = res.target.dataset.contentid;
      let copy_business = res.target.dataset.copy_business;
      let shareTxt = res.target.dataset.sharetxt;
      let is_idle = res.target.dataset.is_idle;
      let is_tuan = res.target.dataset.is_tuan;
      let business_id = res.target.dataset.business_id;
      let discount_id = res.target.dataset.discount_id;
      let earnings = res.target.dataset.earnings;
      // debugger
      if (res.from === 'button') {
        if (!earnings) {
          console.log(1)
          let contentId = res.target.dataset.contentid;
          let shareTxt = res.target.dataset.sharetxt;
          let gdImages = res.target.dataset.gdimages;
          var shareImage = that.data.infoData.bgimg
          if (gdImages.length > 0) {
            var shareImage = gdImages
          }
          return {
            title: shareTxt,
            path: '/pages/dicount_good/dicount_good?member_id=' + that.data.member_id + '&contentid=' + contentId + '&business_id=' + business_id + '&discount_id=' + discount_id + '&copy_business=' + copy_business + '&is_idle=' + is_idle + '&is_tuan=' + is_tuan,
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
          console.log(2)
          return {
            title: that.data.infoData.name,
            path: '/pages/shop/shop?business_id=' + that.data.business_id,
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
      title: that.data.infoData.name,
      path: '/pages/shop/shop?business_id=' + that.data.business_id,
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
      page1: [],
      showFull: [],
      loadend: [],
      dataStatus:true,
      dataStatu:true,
      wenzData:[],
      xianData:[],
      currentTab:1,
      qwe:0
    })

    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    that.getwenzhang();
  },
  onReachBottom() { //上拉加载
    var that = this;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    })
    if (!that.data.reeachBottomStatus) {
      wx.showToast({
        title: '到底了...',
        icon: 'none'
      })
      return
    }

    that.setData({ reeachBottomStatus: false })
    common.get('/business/getBusinessContent', {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      page: page
    }).then(res => {
      that.setData({ reeachBottomStatus: true })
      wx.hideLoading()
      console.log("商城列表")
      console.log(res)
      if (res.data.code == 200) {
        let wenzData = res.data.contents;
        let d = that.data.wenzData
        for (var i = 0; i < wenzData.length; i++) {
          d.push(wenzData[i]);
          that.data.page1.push(1)

          let obj = {}
          // obj.leng = wenzData[i].words.length
          obj.status = false
          that.data.showFull.push(obj)
          that.data.loadend.push(false)
        }
        that.setData({
          loadend: that.data.loadend,
          showFull: that.data.showFull,
          wenzData: d,
        })
        page++
      } else if (res.data.code == 206) {
        wx.showToast({
          title: "没有更多数据啦~~",
          icon: "none"
        })
        page++
      }
    }).catch(e => {
      that.setData({ reeachBottomStatus: true })
      console.log(e)
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
    if(pageslist && pageslist.length > 1) {
      wx.navigateBack({delta: -1});
    } else {
      wx.reLaunch({url: "/pages/usecoin/usecoin"});
    }
  },

  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this
    var cur = e.currentTarget.dataset.current;
    if (cur == 1) {
      //优惠券
      that.getMeConcern();
      that.setData({
        qwe: 0
      })
    } else if (cur == 0) {
      //首页
      that.getwenzhang();
      that.setData({
        qwe: 1
      })
    }
    that.setData({
      currentTab: cur
    })
  },

  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  // 获取优惠券列表
  getMeConcern() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/coupon/index',{
      business_id: that.data.business_id,
    }).then(res => {
      let xianData = res.data.data;
      console.log(xianData)
      wx.hideLoading();
      if (xianData.length <= 0) {

        // setTimeout(function () {
          that.getwenzhang();
          that.setData({
            dataStatu: true
          })
        // }, 500)
      }else{
        that.setData({
          xianData,
          qwe: 0,
        })
      }

    }).catch(e => {
      console.log(e)
    })
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
  popLock_itemm(){
    let that = this;
    that.setData({
      pop3 : 0
    })
  },
  //前往商品发布
  goToCreateActivity() {
    let url = "/pages/create_activity/create_activity?business_id=" + this.data.business_id;
    wx.navigateTo({
      url: url
    })
  },
  //上下架活动
  stand(e) {
    let that = this
    let stand = e.currentTarget.dataset.stand
    let discountid = e.currentTarget.dataset.discountid
    let index = e.currentTarget.dataset.idx
    let activityList = that.data.activityList
    let stand_text = stand == 1 ? '上架' : '下架'
    wx.showModal({
      content: '确定进行' + stand_text,
      success: function (res) {
        if (res.confirm) {
          common.post("/business/setBusinessDiscountStand", {
            business_id: that.data.business_id,
            discount_id: discountid,
            stand: stand
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                icon: 'success',
                duration: 2000,
                title: stand_text + '成功',
                 success: function (res) {
                   that.setData({
                     activityList: activityList,
                     pop3: false
                   });
                   setTimeout(function () {
                     that.getData();
                   }, 1500)
                 }
              })
              activityList[index]['stand'] = stand;
            
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
  //优惠券上下架活动
  stand_idle(e) {
    let that = this
    let member_id = that.data.member_id;
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.idx;
    let stand_text = status == 1 ? '上架' : '下架'
    console.log(e)
    wx.showModal({
      content: '确定进行' + stand_text,
      success: function (res) {
        if (res.confirm) {
          common.get("/coupon/stand", {
            id,
            member_id,
            status,
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
                    that.getMeConcern();
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
  edit(e) {
    var that = this
    var discount_id = e.currentTarget.dataset.id;
    var is_tuan = e.currentTarget.dataset.is_tuan;
    wx.navigateTo({
      url: '/pages/create_activity/create_activity?discount_id=' + discount_id + '&business_id=' + that.data.business_id + '&is_tuan=' + is_tuan + '&rate=' + that.data.infoData.rate,
    })
    that.setData({
      pop3: 0
    })
  },
  edit_idle(e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id;
    var is_coupon = e.currentTarget.dataset.is_coupon

    wx.navigateTo({
      url: '/pages/create_activity/create_activity?id=' + id + '&business_id=' + that.data.business_id + '&is_coupon=' + is_coupon,
    })
    that.setData({
      pop3: 0
    })
  },

  // 生成海报
  gotoMakephoto() {
    let types = 'business';
    let page_urls ='pages/shop/shop';
    let ids = this.data.infoData.id;
    let contents = this.data.infoData.name;
    let icon_paths = this.data.infoData.avatar;
    let apiUrls = Makephoto.makeUrl
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
  rece_integral(){
    let that = this;
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return;
    }
    common.get("/Integral/business_accept_integral", { 
      "member_id": wx.getStorageSync('member_id'),
      "code_id": that.data.code_id,
      "library_id": that.data.library_id,
      "integual": that.data.integual,
    }).then(res => {
    if (res.data.code == 200) {
      wx.showToast({
        title: '积分领取成功!',
        icon:'success',
        duration: 2000,
      })
      setTimeout(() =>{
        that.setData({
          is_mark: false
        })
      },2000)
        
    }else if(res.data.code == 202){
      wx.showToast({
        title: res.data.msg,
        icon:'none',
        duration: 3000,
      })
      setTimeout(() =>{
        that.setData({
          is_mark: false
        })
      },2000)
    }else {
      wx.showToast({
        title: res.data.msg,
        icon:'none',
        duration: 2000,
      })
      setTimeout(() =>{
        that.setData({
          is_mark: false
        })
      },2000)
    }
  }).catch(error => {
    console.log(error);
  })
  },
  show_toast(){
    wx.navigateTo({
      url: '/pages/create_activity/create_activity?business_id=' + this.data.business_id + '&rate=' + this.data.infoData.rate,
    })
  },
  switch1Change(e){
    console.log(e)
    let that = this;
    let switchvalue = e.detail.value;
    console.log(switchvalue)
  
    common.get('/business/shop_password',{
      member_id: wx.getStorageSync('member_id'),
      business_id:that.data.business_id,
      is_password:switchvalue
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '修改状态成功',
          icon:'none'
        })
        that.setData({
          switchvalue,
        })
      }
      if (res.data.code == 201){
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.getBusinessInfo();
      }
    })
  },
  //查询路线
  getRoadLine(e) {
    let that = this;
    console.log(e);
    wx.getLocation({
      type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
      isHighAccuracy: true,
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        const latitude = Number(that.data.infoData.latitude)
        const longitude = Number(that.data.infoData.longitude)
        console.log(res)
        console.log(latitude)
        console.log(longitude)
        // 转百度定位坐标
        // let gcj02tobd09 = zhuan_dingwei.wgs84togcj02(longitude , latitude);
        // latitude = gcj02tobd09[1],
        // longitude = gcj02tobd09[0],
        wx.openLocation({//所以这里会显示你当前的位置
          latitude,
          longitude,
          name: that.data.library_name,
          address: that.data.infoData.address,
          scale: 18
        })
      }
    })
  },

  set_phone(e){
    this.setData({
      set_phone:e.detail.value
    })
  },
  set_name(e){
    this.setData({
      set_name:e.detail.value
    })
  },
  toufang(){
    wx.navigateTo({
      url: '/packageA/pages/merchant_entrance/index',
    })
    // publicMethod.toufang(this);
  },
  click_mark(){
    this.setData({
      is_put:false
    })
  },
  getselecid(e){
    let that = this;
    let yulian_selec_id = e.currentTarget.dataset.index;
    let selec_name = e.currentTarget.dataset.name;
    that.setData({
      yulian_selec_id,
      selec_name,
    })
  },
  getselecdistance(e){
    let that = this;
    let selec_distance = e.currentTarget.dataset.index;
    let selec_distance_name = e.currentTarget.dataset.name;
    let gl_integral = e.currentTarget.dataset.integral;
    that.setData({
      selec_distance,
      selec_distance_name,
      gl_integral,
    })
  },
  submit_put(){
    publicMethod.submit_put(this);
  },
  click_yulian_bg(){
    this.setData({
      is_yulian:false,
    })
  },
  catchtouchmove(){
    return
  },
  getshop_selecid(e){
    let that = this;
    let index= e.currentTarget.dataset.index;
    app.data.selec_id = 0;
    that.setData({
      select_id: 0,
      select_type: index,
    })
    wx.navigateTo({
      url: '/packageA/pages/shop_selecid/index?select_type=' + index + '&business_id=' + that.data.business_id,
    })
  },
  /**调用电话 */
  tel(e) {
    console.log(e)
    let tel = e.currentTarget.dataset.calltel;
    if (tel != null || tel != '') {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    } else {
      app.showToast({
        title: "暂无联系电话"
      })
    }
  },
  sezhi(){
    this.setData({
      is_footer: true
    })
  },
  footer_bg(){
    this.setData({
      is_footer: false
    })
  },
  goTonewThing(e){
    let business_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/newThing/index?business_id=' + business_id,
    })
  },
  
  goTorelease_newThing(e){
    let business_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/release_newThing/index?business_id=' + business_id,
    })
  },
  imageerror(e){
    console.log(e)
    this.setData({
      v_back: 'https://oss.qingshanpai.com/banner/shopbg-error.png'
    })
  },
  // =================== 以下社区大集相关功能 ↓ ===================
  // 点击社区大集商品
  goToPay(e){
    console.log(e)
    let that = this;
    let communityinfoData = e.currentTarget.dataset.info;
    that.setData({
      is_communityInfo: true,
      communityinfoData
    })
    // 获取环保银行账户详情
    that.getaccountnumber();
    // 获取买家信息
    that.getBuyInfo();
  },
  clickCommunityInfoPop(){
    this.setData({
      is_communityInfo: false
    })
  },
  minusNum() {
    let that = this;
    that.data.goodnum --;
    if (that.data.goodnum < 1) {
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  addNum() {
    let that = this;
    that.data.goodnum ++;
    if ( that.data.goodnum > (that.data.bal_count - 0) ) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  inputValue(e) {
    let that = this;
    if ( e.detail.value > (that.data.bal_count - 0) ) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    }else if (e.detail.value < 1){
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    }else {
      that.setData({
        goodnum: e.detail.value
      })
    }
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
   // 获取环保银行账户详情
  getaccountnumber(){
    let that = this;
    common.get("/environmental/bank/environmentalBankHome", {
      member_id: wx.getStorageSync('member_id'),
      type: 8
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          realAmount: Number(res.data.data.realAmount),
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },
  // 点击确定
  clickExchangeBtn(){
    let that = this;
    let p = { 
      member_id: wx.getStorageSync('member_id'),
      pay_sum_money: (that.data.communityinfoData.total_price * that.data.goodnum).toFixed(2),
      business_id: that.data.communityinfoData.business_id,
      business_discount_id: that.data.communityinfoData.discount_id,
      pay_sum_jifen: (that.data.communityinfoData.hbb * that.data.goodnum).toFixed(2),
      pay_count : that.data.goodnum,
      pay_total_money: (that.data.communityinfoData.total_price * that.data.goodnum).toFixed(2),
      obtain_type: 1,  // 到店自提
      obtain_name: that.data.user_name,
      obtain_phone: that.data.user_tel,
      obtain_address: '',
      deliveryMethod: '',
      deliveryPrice: 0,
      remark: '参加社区大集的优惠活动下单兑换！',
      is_idle: that.data.communityinfoData.is_idle,
      is_welfare: that.data.communityinfoData.is_welfare,
      is_tuan: that.data.communityinfoData.is_tuan,
    }
    wx.showModal({
      title: "",
      content: "确定兑换吗？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在加载...',
          })
          common.get("/business/create_community_market_discount_order", p).then(res => {
            wx.hideLoading();
            if (res.data.code == 200) {
              if (res.data.data != '') {
                console.log('有支付签名')
                var $config = res.data.data
                wx.requestPayment({
                  timeStamp: $config['timeStamp'], //注意 timeStamp 的格式
                  nonceStr: $config['nonceStr'],
                  package: $config['package'],
                  signType: $config['signType'],
                  paySign: $config['paySign'], // 支付签名
                  success: function (res) {
                    // 支付成功后的回调函数
                    wx.showToast({
                      title: '支付成功',
                      duration: 1000,
                      icon: 'success'
                    })
                    that.setData({
                      is_communityInfo: false
                    })
                    that.getwenzhang();
                    that.saveAddress();
                  },
                  fail: function (e) {
                    console.log(e)
                    wx.showToast({
                      title: '支付失败！',
                      duration: 1000,
                      icon: 'none'
                    })
                    that.setData({
                      is_communityInfo: false
                    })
                    return;
                  }
                });
              } else {
                console.log('没有支付签名')
                wx.showToast({
                  title: res.data.message,
                  duration: 1000,
                  icon: 'success'
                })
                that.setData({
                  is_communityInfo: false
                })
                that.getwenzhang();
                that.saveAddress();
              }
            } else {
              wx.hideLoading()
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
            }
          }).catch(e =>{
            wx.hideLoading();
            console.log(e)
          })
          
        }
      }
    })
  },
  // 获取买家信息
  getBuyInfo(){
    let that = this;
    common.get("/business/getMemberFreightAddress", { "member_id": wx.getStorageSync('member_id') }).then( res => {
      if (res.data.code == 200 && res.data.data.length > 0) {
        let buyer_address =  res.data.data[0];
        that.setData({
          buyer_address,
          user_name: buyer_address.name,
          user_tel: buyer_address.phone,
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  // 设置买家信息
  saveAddress() {
    let that = this;
    let params = {
      "member_id": wx.getStorageSync('member_id'),
      "name": that.data.user_name,
      "phone": that.data.user_tel,
      "address": '',
      "type": 1
    }
    if (!params.phone) {
      wx.showToast({
        "title": "联系方式不能为空！",
        "icon": "none"
      })
      return
    }

    if (!params.name) {
      wx.showToast({
        "title": "请填写姓名！",
        "icon": "none"
      })
      return
    }
    common.get("/business/memberFreightAddress", params).then( res => {
    }).catch( error => {
      console.log(error);
    })
  },
  // =================== 以上社区大集相关功能 ↑ ===================

})