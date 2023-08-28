const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const Makephoto = require('../../../assets/js/setting');
Page({
  data: {
    nickName:'',
    avatarUrl:'',
    memberid:'',
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    reeachBottomStatus:true,
    textVal: '',
    personalInfo:'',
    inpPlaceholder: '发表评论',
    read_rule: 0, //规则协议阅读状态
    wenzData: [],
    infoData: [],
    page1: [],
    showFull: [],
    loadend: [],
    savaStatus: true,
    isfenxiang: false,
    isReset: 0, //子页面跳转是否刷新页面,
    showEditBox: false,
    content_id: 0,
    copy_business:0,
    winHeight: "",
    navActive: 1,
    currentTab:0,
    rder:0,
    qwe: 1,
    desc:'',
    share: 0,
    salesImage: '暂无',
    salesPrice: '暂无',
    salesTitle: '暂无',
    sale_name: '',
    sale_phone:'',
    sale_address: '',
    sale_id:0,
    pop2: 0,
    type:0,
    radio_val:false,
    idle_hidden: false,
    makephoto: false,
    makephoto_img: '',
    canIUseGetUserProfile: false,
    switchvalue: false
  },
  onLoad: function(options) {
    console.log(options)
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options) // 这时候就会发现this.options上就会有对应的参数了
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let that = this
    that.setData({
      idle_hidden:false
    })
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    
    if (this.options.member_id) {
      that.setData({
        // member_id: this.options.member_id,
        shangjia_id: this.options.member_id,
        personData: wx.getStorageSync('user_info'),
        idle_hidden:true
      })
    }
    if (this.options.share) {
      console.log(options)
      that.setData({
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
    this.audioCtx = wx.createAudioContext('myAudio');
    let that = this
      publicMethod.zhuan_baidu(this)
      that.setData({
        dataStatus:false,
        pop2: false,
        pop3: false,
        popidx: false,
        member_id: wx.getStorageSync('member_id'),
        configData: wx.getStorageSync('configData'),
        business_id: wx.getStorageSync('business_id'),
        personalInfo: wx.getStorageSync('personalInfo'),
        personData: wx.getStorageSync('user_info'),
        page1: [],
        showFull: []
      });
      that.getData();
    console.log(that.data.personalInfo)
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
    let that = this
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
  //前往闲置详情页
  goToActivity(e) {
    let that = this;
    let idle_id = e.currentTarget.dataset.idle;
    let member_id = that.data.member_id;
    let busnesid = e.currentTarget.dataset.busnesid;
    let content_id = e.currentTarget.dataset.content_id;
    let url = "/packageA/pages/idleDetails_page/index?member_id=" + member_id + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id
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
  // 点击我已同意协议
  readrule(e){
    this.setData({
      radio_val: !(this.data.radio_val)
    })
  },
  // readRuleChange(e) {
  //   console.log(e)
  //   this.setData({
  //     read_rule: e.detail.value,
  //   })
  // },
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
    let discount_id= e.target.dataset.content_id;
    let content_id = e.target.dataset.discount_id;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          common.get('/idle/idleDelete', {
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
      showEditBox:0
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
  onShareAppMessage: function(res) { //分享
    console.log(res)
    let that = this
    if (res.target){
      if (res.from === 'button') {
        let contentId = res.target.dataset.contentid;
        let shareTxt = res.target.dataset.sharetxt;
        let gdImages = res.target.dataset.gdimages;
        let is_list = res.target.dataset.is_list;
        // var shareImage = that.data.infoData.bgimg
        // if (gdImages.length > 0) {
        //   var shareImage = gdImages
        // }
        if(is_list == 1){
          return {
            title: shareTxt,
            path: '/pages/mine/myIdle/index?member_id=' + that.data.member_id + '&contentid=' + contentId,
            imageUrl: gdImages,
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
            title: '我的闲置',
            imageUrl: '',
            path: '/pages/mine/myIdle/index?member_id=' + that.data.member_id,
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
        return
      }
    }
    return {
      title: '我的闲置',
      imageUrl: '',
      path: '/pages/mine/myIdle/index?member_id=' + that.data.member_id,
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
      wenzData: [],
    })
    that.getwenzhang()
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  onReachBottom() { //上拉加载
    var that = this;
    wx.showToast({
      title: '已加载全部...',
      icon:'none'
    })
  setTimeout(function(){
    wx.hideLoading()
  },1500)
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
      wx.reLaunch({ url: "/pages/getalllist/getalllist"});
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
  popLock_itemm(){
    let that = this;
    that.setData({
      pop3 : 0
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
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id;
    var is_sales = e.currentTarget.dataset.is_sales;

    wx.navigateTo({
      url: '/pages/mine/myIdlerelease/index?idle_id=' + id + '&is_sales=' + is_sales,
    })
    that.setData({
      pop3: 0
    })
  },
  // 去我的闲置首页
  // gotoMyIdle(e){
  //   wx.navigateTo({
  //     url: '/pages/mine/myIdle/index?member_id=' + this.data.shangjia_id,
  //   });
  // },
// 去我的闲圈主页
goToMygroupIndex(){
  wx.reLaunch({
    url: '/packageA/pages/idleGroup/myidleGroupIndex/index?member_id=' + this.data.shangjia_id,
  })
},
goTofahuo(e){
  let that = this;
  console.log(e)
  let business_id = e.currentTarget.dataset.business_id;
  let id = e.currentTarget.dataset.id;
  let is_idle = e.currentTarget.dataset.is_idle;
  wx.navigateTo({
    url: '/pages/idlelogistics/idlelogistics?business_id=' + business_id + '&id=' + id + '&is_idle=' + is_idle,
  })
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

  },
  bindKeyName(e) {
    console.log(e)
    let that = this;
    that.setData({
      sale_name: e.detail.value
    })
  },
  bindKeyPhone(e){
    console.log(e)
    let that = this;
    that.setData({
      sale_phone:e.detail.value
    })
  },
  bindKeyAdd(e) {
    console.log(e)
    let that = this;
    that.setData({
      sale_address: e.detail.value
    })
  },
  // 卖家确认代卖信息确认事件
  openCircle() {
    let that = this;
    if (that.data.sale_name == '') {
      wx.showToast({
        title: '请先填写联系姓名!',
        icon: 'none'
      })
      return;
    }
    if (that.data.sale_phone == '') {
      wx.showToast({
        title: '请先填写联系方式!',
        icon: 'none'
      })
      return;
    }
    if (that.data.sale_address == ''){
      wx.showToast({
        title: '请先填写联系地址!',
        icon: 'none'
      })
      return;
    }
    if (!that.data.radio_val) {
      wx.showToast({
        title: '请先勾选代卖规则!',
        icon: 'none'
      })
      return;
    }
    // 登录
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    if (!that.data.member_id) {
      that.setData({
        pop2: true
      })
      return;
    } else {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
      let code = new Date().getTime();
      common.get("/sale/saleConfirm", {
        member_id: that.data.member_id,
        sell_member_id: that.data.share,
        sale_id: that.data.sale_id,
        sale_name: that.data.sale_name,
        sale_phone: that.data.sale_phone,
        sale_address: that.data.sale_address,
        code: code,
      }).then(res => {
        console.log(res.data)
        wx.hideLoading();
        that.getData()
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          share: 0
        })
      }).catch(error => {
        console.log(error);
      })
    }


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
  gotodingdan(){
    let business_id = wx.getStorageSync('member_id');
    let is_idle = 1;
    wx.navigateTo({
      url: '/packageA/pages/idleOrder/index?business_id=' + business_id +'&is_idle=' + is_idle + '&type=2',
    })
  }
})