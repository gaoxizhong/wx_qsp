const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const Makephoto = require('../../assets/js/setting');
let time1 = null;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    savaStatus: true,
    reeachBottomStatus: true,
    textVal: '',
    inpPlaceholder: '发表评论',
    wenzData: [],
    page1: [],
    loadend: [],
    showFull: [],
    itemsList:[],
    lenght: 0,
    contentid: '',
    unData: {
      unlauds: 0,
      unreads: 0,
      uncomment: 0
    },
    barrageList: [],
    newlist:[],
    privilege_list: [],
    loopShow: 1,
    isAuthorize: false,
    // 以上是之前的变量-----------------------
    cateList: [{id:0,title:'全部',type:'all'},{id:1,title:'查看好友动态',type:'friend'}], //头部类目
    cateid: 0,
    catetype: 'all',
    personalInfo: '', //个人信息
    infoisRv: '',
    circle_page: 1, //当前展示页数
    rule: 0, //规则弹窗
    rul: 0, //新增人数模块规则弹窗
    congra: 0, //成为小圈主弹窗
    read_rule: 0, //规则协议阅读状态
    share: 0,
    sha: 0,
    pop2: 0,
    rv: [],
    rv_name: ' ',
    setVillageName: 1, //修改名称弹窗
    makephoto: false,
    makephoto_img: '',
    marsk2:false,
    swiper_shop:false,
    swiper_index:0,
    top_img:[],
    canIUseGetUserProfile: false,
    banner_img:[],
    is_goToSign: true,
    latitude: '',
    longitude: '',
    is_preview: false,
    isReset:0,
    is_circle: 0,
    is_login: 0,
    like_status: true,
    is_Signtask: 0,
    circleAd: [], // 广告位 在列表中的位置及数量展示
  },
  onLoad: function(options) {
    let that = this;
    if (options.scene) {
      /** 
      * object.assign(any,any1); 对象的合并
      * 获取二维码参数，绑定在当前this.options对象上
      */ 
      Object.assign(this.options, this.getScene(options.scene))
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    console.log(this.options)
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData')
    })
    if(options.is_circle){
      that.setData({
        is_circle:options.is_circle
      })
    }
    if (this.options.nickname) {
      that.setData({
        share: this.options.share,
        view_member_id: this.options.share,
        nickname: this.options.nickname
      })
    }else{

    }
    if (this.options.contentid) {
      common.get("/content/shareContent", {
        content_id: this.options.contentid
      }).then(res => {

      }).catch(error => {
        console.log(error);
      })
      that.setData({
        contentid: this.options.contentid
      })
    }
    if(this.options.is_Signtask){
      this.setData({
        is_Signtask: this.options.is_Signtask
      })
    }
    if (this.options.id) {
      common.get("/content/shareContent", {
        content_id: this.options.id
      }).then(res => {

      }).catch(error => {
        console.log(error);
      })
      that.setData({
        contentid: this.options.id
      })
    }
    that.getData();
    wx.hideShareMenu();
  },
  onShow() {
    console.log('触发了onshow');
    let that = this;
    that.setData({
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      like_status: true
    })

    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        pop2: false,
        is_preview:false,
        member_id: wx.getStorageSync('member_id'),
        user_info: wx.getStorageSync('user_info'),
        configData: wx.getStorageSync('configData'),
      });
    }
    /// 新增弹窗功能
    let isReset = wx.getStorageSync('isReset');
    console.log(isReset);
    if(isReset == 1){
      wx.showModal({
        title: '继续领取环保奖励',
        content: '继续点赞可以获得更多现金奖励!',
        cancelText:'拒绝奖励',
        confirmText:'继续领取',
        success(res){
          if(res.cancel){
            common.get("/content/opne_ad",{
              member_id: wx.getStorageSync('member_id'),
              status: 2
            }).then(res=>{
              if(res.data.code == 200){
                wx.setStorageSync('isReset', 0);
                that.setData({
                  isReset: 0,
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            })

          }
          if(res.confirm){
            common.get("/content/opne_ad",{
              member_id: wx.getStorageSync('member_id'),
              status: 1,
            }).then(res=>{
              if(res.data.code == 200){
                wx.setStorageSync('isReset', 0);
                that.setData({
                  isReset: 0,
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    }
    console.log('is_circle:' + that.data.is_circle);
    if(that.data.is_circle == 1){
      if(that.data.is_login == 1){
        that.setData({
          is_circle:0,
          is_login:0
        })
        that.getData();
      }else{
        that.setData({
          is_circle:0
        })
        return
      }
      return
    }else{
    }
    that.getBannerUrls();
    wx.hideShareMenu();
  },
  onHide() {
    console.log("circle结束");
    clearInterval(time1);
  },
  onUnload() {},
  getData() { //初始化数据
    let that = this;
    // that.getCategory();
    that.getCircleItems();
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
  // 获取圈主的置顶动态数据
  // getprivilege_list(){
  //   let that = this;
  //   common.get('/idle/env_show', {
  //     member_id: wx.getStorageSync('member_id')
  //   }).then(res => {
  //     if (res.data.code == 200) {
  //       let privilege_list = res.data.data;
  //       that.setData({
  //         privilege_list: privilege_list
  //       })
  //     }
  //   })
  // },

  //获取分类
  getCategory() {
    let that = this;
    that.setData({
      showFull: [],
      wenzData: [],
      circleAd: [], // 广告位
      circle_page: 1,
    })
    common.get("/content/getCategory", {
      type: 9
    }).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        console.log("获取成功")
        that.setData({
          cateList: res.data.data.rows,
          cateId: res.data.data.rows[0].id
        })
        that.getCircleItems();
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(error => {
      console.log(error);
      app.showToast({
        title: "",
      })
    })
  },
  //选择头部类目
  selCateId(e) {
    let that = this;
    let catetype = e.currentTarget.dataset.catetype;
    let cateid = e.currentTarget.dataset.cateid;
    that.setData({
      cateid,
      catetype,
      wenzData: [],
      circleAd: [], // 广告位
      circle_page: 1,
      is_circle: 0
    })
    that.getCircleItems();
  },
  //跳转到活动页面
  goToActivity(e) {
    console.log(e)
    let business_id = e.currentTarget.dataset.business_id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let content_id = e.currentTarget.dataset.content_id;
    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&discount_id=" + discount_id + '&content_id=' + content_id;
    wx.navigateTo({
      url: url
    })
  },
  // 获取环保圈信息
  getCircleItems() {
    let that = this;
    common.get("/content/getContents", {
      member_id: that.data.member_id,
      type: that.data.catetype,
      content_id: that.data.contentid,
      page: that.data.circle_page,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }).then(res => {
      if (res.data.code == 200) {
        let wenzData = that.data.wenzData.concat(res.data.contents);
        // 广告位数据
        let circleAd = that.data.circleAd;
        if( that.data.circle_page  % 2 == 0){
          circleAd.push( (that.data.circle_page * 5 + 1) )
        }

        if (that.data.contentid) {
          that.setData({
            contentid: ''
          })
        }
        if(that.data.catetype == "friend" && wenzData.length <= 0){
          that.setData({
            catetype: "all",
            cateid: 0,
            wenzData: [],
            circleAd: [], // 广告位,
            circle_page: 1,
            is_circle: 0
          })
          that.getCircleItems();
          return
        }
        that.setData({
          wenzData,
          circleAd
        })
        for (var i = 0; i < wenzData.length; i++) {
          that.data.loadend.push(false);
          let obj = {};
          obj.leng = wenzData[i].words.length;
          obj.status = false;
          that.data.showFull.push(obj);
        }
        that.setData({
          showFull,
        })
        wx.stopPullDownRefresh();
      }
    })
  },
  goOtherCircle(e) { //去别人的发圈
    publicMethod.getFormId(e, this)
    let that = this;
    if (e.currentTarget.dataset.business_id != 0 && e.currentTarget.dataset.business_id != e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/shop/shop?business_id=' + e.currentTarget.dataset.business_id,
      })
      return
    }
    if(e.currentTarget.dataset.business_id != 0 && e.currentTarget.dataset.business_id == e.currentTarget.dataset.id){
      wx.navigateTo({
        url: '/pages/mine/myIdle/index?member_id=' + e.currentTarget.dataset.id,
      })
      return
    }
    wx.navigateTo({
      url: '/pages/mine/myContent/index?is_who=1&id=' + e.currentTarget.dataset.id,
    })
  },
  //前往发圈 
  goToPublish() {
    wx.navigateTo({
      url: "/pages/publish/publish"
    })
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
  //跳转到详情页面
  goToDetail(e) {
    let url = "/pages/circle_detail/circle_detail?contentid=" + e.currentTarget.dataset.contentid + '&is_n=1';
    wx.navigateTo({
      url: url
    })
  },
  //跳转到详情页面
  getPeople(e) {
    console.log(e)
    let that = this;
    let menber_id = that.data.member_id;
    console.log(menber_id)
    let url = "/pages/circle_people/circle_people?member_id=" + menber_id;
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
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  guanzhu(e) { //关注
    let that = this;
    publicMethod.guanzhu(e, this)
  },
  guanzhus(e) { //关注
    let that = this;
    publicMethod.guanzhus(e, this)
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
  previewImage: function(e) { //图片预览
    publicMethod.previewImage(e, this)
  },
  delCircle(e) { //删除图文
    publicMethod.delCircle(e, this)
  },
  like(e) { //点赞
    publicMethod.like(e,this,app)
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) { // 初始化弹框
    wx.showTabBar()
    this.setData({
      textVal: '',
      inpPlaceholder: '发表评论'
    })
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
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
  onShareAppMessage: function(res) { //分享
    console.log(res)
    let that = this
    let contentId = res.target.dataset.contentid;
    let earnings = ''
    let url = 'pages/circle/circle?contentid=' + contentId + '&share=' + that.data.member_id;
    if (res.from === 'button') {
      console.log(res.target)
      let earnings = res.target.dataset.earnings;
      if (!earnings) {
        let shareTxt = res.target.dataset.sharetxt;
        let gdImages = res.target.dataset.gdimages;
        let nickname = res.target.dataset.nickname;
        var shareImage = ''
        if (gdImages.length > 0) {
           shareImage = gdImages[0].url
        }else{
          shareImage= 'http://oss.qingshanpai.com/huanbaobi/1eeb99cc547dc6ae4a0f74597bf3a1ad.png'
        }
        return {
          title: nickname + ' ' + shareTxt,
          path: url,
          imageUrl: shareImage,
          success: function(res) {
            // 转发成功
           console.log('转发成功1')
          },
          fail: function(res) {
            // 转发失败
          }
        }
      } else {
        return {
          title: that.data.personalInfo.nickname   + '邀请你加入环保圈，原来做环保也可以有收益！',
          path: 'pages/circle/circle?share=' + that.data.member_id + '&nickname=' + that.data.personalInfo.nickname,
          imageUrl: 'http://oss.qingshanpai.com/huanbaobi/1eeb99cc547dc6ae4a0f74597bf3a1ad.png',
          success: function(res) {
            // 转发成功
            console.log(res)
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }

    }
    return {
      title: '青山生态 正在发生…',
      imageUrl: '',
      path: url,
      success: function(res) {
        // 转发成功
        console.log(res)

      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  //触底函数
  onReachBottom() {
    console.log('触底函数')
    let that = this;
    wx.showLoading({
      title:"加载中...",
      icon:'none',
      mark:true,
      success(){
        that.setData({
          circle_page: (that.data.circle_page + 1)
        })
        that.getCircleItems();
      }  
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
  },
  //下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    let that = this;
    that.setData({
      showFull: [],
      wenzData: [],
      circleAd: [], // 广告位
      privilege_list:[],
      circle_page: 1,
      is_circle: 0
    })
    that.getData();
    wx.stopPullDownRefresh();
  },
  setVillageName(e) {
    this.setData({
      rv_name: e.detail.value
    })
  },
  CircleEditHide() {
    this.setData({
      setVillageName: 1
    })
  },
   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  getUserProfile() {
    publicMethod.getUserProfile(this,this.getData);
  },
  //跳转免费送书
  dynamicdian() {
    // wx.navigateTo({
    //   url: '/packageA/pages/eiltemode/class_bookslist/index'
    // })
    wx.showToast({
      title: '此活动已暂停！',
      icon:'none',
    })
    return
  },
  // 小圈主恭喜弹窗
  cancelPups : function(){
    let that = this;
    console.log("点击取消")
      that.setData({
        congra: 0
      })
  },

  // 点击解锁福利跳转
  goToBenefit(e) {
    let that = this;
    if( that.data.personalInfo.grade < 1 ){
      wx.showToast({
        title: '请先升级等级',
        icon: 'none',
        duration: 2000
      })
      return
    }
    console.log(e)
    let url = e.currentTarget.dataset.url + '&member_id=' + wx.getStorageSync('member_id');
    wx.navigateTo({
      url: url,
    })
  },
  denglu(){
    let that = this;
    if (that.data.personalInfo.grade == 0) {
      console.log(that.data.personalInfo)
      wx.showToast({
        title: '请先建立环保圈',
        icon: 'none',
        duration: 2000
      })
    }
  },
  closeCircle() {
    let that = this;
    that.setData({
      share:0
    })
  },
  // 生成海报
  gotoMakephoto() {
    let types = 'huanbaoquan';
    let page_urls = 'pages/circle/circle';
    let ids = this.data.member_id;
    let contents = '';
    let icon_paths = '';
    let apiUrls = Makephoto.makeUrl
    publicMethod.gotoMakephoto(this, types, ids, page_urls, contents, icon_paths, apiUrls);
  },
  // 保存海报
  saveImage(e) {
    publicMethod.saveImage(e, this);
  },
  previewImage1(e) {
    let that = this;
    console.log(e)
    let swiper_index = e.currentTarget.dataset.subidx;
    that.setData({
      top_img:e.currentTarget.dataset.images,
      swiper_index,
      swiper_shop:true
    })
  },
close_swiper(){
    let that = this;
    that.setData({
      top_img:[],
      swiper_shop:false
    })
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
  marsk2_move(){
    return
  },
  dynamicaa(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      lenght:0,
      itemsList:[]
    })

    common.get('/idle/env_list',{
      member_id
    }).then(res =>{
      if(res.data.code == 206){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
      if(res.data.code ==200){
        let itemsList = res.data.data;
        let lenght = res.data.res_count;

        that.setData({
          lenght,
          itemsList,
          marsk2: true,
        })
      }
    })
  },
itemSelected: function (e) {
  let index = e.currentTarget.dataset.index;
  let item = this.data.itemsList[index];
  let newlist = this.data.newlist;
  let lenght = this.data.lenght;
    if (this.data.lenght < 2 && !item.selected) {
      lenght++
      this.setData({
        lenght: lenght
      })
      item.selected = !item.selected;
      this.setData({
        itemsList: this.data.itemsList,
      });
      return
    }
    if (item.selected) {
      lenght--
      this.setData({
        lenght: lenght
      })
      item.selected = !item.selected;
      this.setData({
        itemsList: this.data.itemsList,
      });
      return
    }

  if (this.data.lenght >= 2 && !item.selected) {
      wx.showToast({
        title: '最多选择两条信息',
        icon: 'none'
      })
      return
    }
    console.log(this.data.itemsList)
  },
  cancle_marsk2(){
    this.setData({
      marsk2: false,
    })
  },
  privilege_mask_btn(){
    let that = this;
    let newlist = [];
    let itemsList = that.data.itemsList;
    for (var i in itemsList){
      if (itemsList[i].selected){
        newlist.push(itemsList[i].id - 0)
      }

    }
    if(newlist == ''){
      wx.showToast({
        title: '请最少选择一条数据！',
        icon:'none',
      })
      return
    }
    common.get('/idle/env_select',{
      content_id: newlist,
      member_id:wx.getStorageSync('member_id')
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          success:function(){
            that.setData({
              marsk2: false,
            })
          }
        })
      }else if(res.data.code == 206){
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    })
  },
  goToMyComment(){
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id='+ wx.getStorageSync('member_id'),
    })
  },
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
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
  gotojion(e){
    publicMethod.gotojion(e,this);
  },
  gotoxuanze(){
    let that = this;
    that.click_bg();
  },
  goto_adshop(e){
    let that = this;
    publicMethod.goto_adshop(e,this,1);
    // that.click_bg();
  },
  // 跳转志愿活动详情页面
gotoApplyFor(e){
  publicMethod.gotoApplyFor(e,this);
},
// 长按事件
handleLongPress(e){
  wx.showModal({
    content: '确定保存该图片吗？',
    success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '保存中...',
            mask: true,
          });
          wx.downloadFile({
            url: e.currentTarget.dataset.img,
            success: function (res) {
              console.log(e)
              if (res.statusCode === 200) {
                let img = res.tempFilePath;
                wx.saveImageToPhotosAlbum({
                  filePath: img,
                  success(res) {
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 2000
                    });
                  },
                  fail(res) {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'success',
                      duration: 2000
                    });
                  }
                });
              }
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
    }
  })
},
click_bg(){
  this.setData({
    is_preview : false,
  })
  let isReset = wx.getStorageSync('isReset');
  if(isReset == 1){
    wx.showModal({
      title: '继续领取环保奖励',
      content: '继续点赞可以获得更多现金奖励!',
      cancelText:'拒绝奖励',
      confirmText:'继续领取',
      success(res){
        if(res.cancel){
          common.get("/content/opne_ad",{
            member_id: wx.getStorageSync('member_id'),
            status: 2,
          }).then(res=>{
            if(res.data.code == 200){
              wx.setStorageSync('isReset', 0);
              that.setData({
                isReset: 0,
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          })

        }
        if(res.confirm){
          common.get("/content/opne_ad",{
            member_id: wx.getStorageSync('member_id'),
            status: 1,
          }).then(res=>{
            if(res.data.code == 200){
              wx.setStorageSync('isReset', 0);
              that.setData({
                isReset: 0,
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          })
          pages[0].setData({
            isReset: 0,
          })
        }
      }
    })
  }

},
// 点击轮播红包推广
goToTool_welfare(){ 
  publicMethod.goToTool_welfare(this);
},
})
