const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const Makephoto = require('../../../assets/js/setting');
const zhuan_dingwei = require('../../../assets/js/dingwei');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    isPlayingMusic: true,
    privilege_list:[],
    savaStatus: true,
    textVal: '',
    inpPlaceholder: '发表评论',
    wenzData: [],
    page1: [],
    loadend: [],
    showFull: [],
    flag: 0,
    members:{},
    contents:'0',
    follow:'0',
    result:'0',
    top_img:[],
    swiper_shop:false,
    rv:'',
    business_id:'',
    library_id:'',
    is_true:false,
    code_id:0,
    integual:'',
    is_mark:false,
    is_poster:false,
    poster_tabs:[],
    swiper_index:0,
    leavecom_list:[], // 留言数据
    is_leamsg:false,
    leamsg:'',
    is_you:false,
    is_jifenjiaoyi:'',
    latitude: '',
    longitude: '',
    is_preview : false,
    isReset: 0,
    result_yestoday:0,  //昨日获得点赞数
    is_circle:0,
    like_status: true
  },

  onLoad: function(options) {
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options)
    let that = this
    that.setData({
      view_member_id: this.options.member_id,
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('personalInfo'),
      configData: wx.getStorageSync('configData'),
      is_jifenjiaoyi:app.data.is_jifenjiaoyi,
    })
    if(this.options.code_id){
      that.setData({
        code_id:this.options.code_id,
        view_member_id: this.options.m,
        integual:this.options.i,
        is_mark:true,
      })
    }
    if (this.options.is_who) {
      that.setData({
        is_who: this.options.is_who
      })
    }
    if (this.options.id) {
      that.setData({
        view_member_id: this.options.id
      })
    }
    if (this.options.share) {
      let that = this;
      that.setData({
        flag: this.options.sharecode,
        mid: this.options.id
      })
    }
    var member_id = wx.getStorageSync('member_id');
    console.log(member_id)
    if (!member_id){
       that.setData({
         pop2:true
       })
    }else{
      //  that.shareAdd(this.options.sharecode,this.options.id);
      //  if(this.options.is_onShare == 1){
      //   // 自动加入对方环保圈
      //   publicMethod.openCircle(that,that.data.rv.id,that.data.view_member_id);
      //  }
    }
    // 转百度定位坐标
    // publicMethod.zhuan_baidu(this);

  },
  onShow() {
    let that = this;
    this.setData({
      top_img:[],
      swiper_shop:false,
      is_preview:false,
      like_status: true,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
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
    if(that.data.is_circle == 1){
      console.log(that.data.is_circle)
      return false
    }else{
      that.getData();
    }
    this.getcontent_personal();
  },
  onHide() {

  },
  onUnload() {

  },
  getData() { //初始化数据
    let that = this;
    that.getwenzhang();
    that.gettitle_info();
    that.getPersonInfo();
  },

  getwenzhang() { //列表
    let that = this;
    common.get('/content/getMemberContent', {
      member_id: that.data.view_member_id,
      page: 1,
      view_member_id: that.data.member_id,
      flag: that.data.flag,
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res => {
      console.log("环保圈列表")
      console.log(res)
      if(res.data.code == 206){
        console.log(res.data.msg);
      }
      let wenzData = res.data.data
      if (wenzData.length <= 0) {
        setTimeout(function() {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      for (var i = 0; i < wenzData.length; i++) {
        let obj = {}
        that.data.page1.push(1)
        that.data.loadend.push(false)
        obj.leng = wenzData[i].words.length
        obj.status = false
        that.data.showFull.push(obj)
      }

      that.setData({
        showFull: that.data.showFull,
        wenzData
      })
      page = 2

    }).catch(e => {
      wx.hideLoading();
      app.showToast({
        title: e.data.msg,
      })
      console.log(e)
      page = 2
    })

  },
  goChat(e) {
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
  //跳转到活动页面
  goToActivity(e) {
    let business_id = e.currentTarget.dataset.business_id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id +"&discount_id=" + discount_id;
    wx.navigateTo({
      url: url
    })
  },
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  guanzhu() { //关注
    let that = this;
    if ( !that.data.member_id ) {
      return;
    }
    common.post('/memberinfo/clickConcern', {
      member_id: that.data.member_id,
      be_member_id: that.data.view_member_id,
      type:'2'
    }).then(res => {
      if (res.data.code == 200) {
        if (res.data.msg == "已关注") {
          that.setData({
            is_true : true
          })
          
        } else {
          that.setData({
            is_true : false
          })
        }
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
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
    let that = this;
    let id = e.currentTarget.dataset.id;
    let curIdx = e.currentTarget.dataset.curidx;
    let data = that.data.wenzData;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          common.get('/content/selfDelete', {
            member_id: that.data.member_id,
            id
          }).then(res => {
            if (res.data.code == 200) {
              that.setData({
                popidx: false,
                pop3: false
              })
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
              data.splice(curIdx,1);
              that.setData({
                wenzData:data
              })
            }
          }).catch(e => {
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
  bindTextChange(e) { //留言val
    publicMethod.bindTextChange(e, this)
  },
  sendComment(e) { //评论
    publicMethod.sendComment(e, this)
  },
  like(e) {
    publicMethod.like(e, this)
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
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
  onShareAppMessage: function(res) { //分享
    let that = this
    console.log(res)
    var url = 'pages/mine/myContent/index?member_id='+that.data.view_member_id + '&is_onShare=1';
    if (res.from === 'button') {
      let shareTxt = res.target.dataset.sharetxt;
      let earnings = res.target.dataset.earnings;
      let gdImages = res.target.dataset.gdimages;
      let nickname = res.target.dataset.nickname;
      let status   = res.target.dataset.status;
      var url = 'pages/mine/myContent/index?contentid=' + res.target.dataset.contentid + '&member_id=' + that.data.view_member_id + '&is_onShare=1';
      if(parseInt(earnings) == 1){
        return {
          title: nickname + ' 的动态！',
          path: url,
          imageUrl: '',
          success: function(res) {
            // 转发成功
            console.log(res)
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }else{
        if (parseInt(status) == 0){
          let flag = res.target.dataset.flag;
          let member = res.target.dataset.member;
          url = 'pages/mine/myContent/index?id=' + member + '&share=1' + '&sharecode=' + flag + '&is_onShare=1';
        }
        console.log(url)
        var shareImage = ''
        if (gdImages.length > 0) {
          var shareImage = gdImages[0].url
        }
        return {
          title: nickname + ' 发布了一条非常棒的新动态哦，快打开看一下吧！',
          path: url,
          imageUrl: shareImage,
          success: function(res) {
            // 转发成功
            console.log(res)
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }

    }else{
      console.log('右上角')
      console.log(url)

      return {
        title: that.data.members.nickname + '的动态！',
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
    }

  },
  //跳转到详情页面
  goToDetail(e) {
    let url = "/pages/circle_detail/circle_detail?contentid=" + e.currentTarget.dataset.contentid;
    wx.navigateTo({
      url: url
    })
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    that.setData({
      page1: [],
      showFull: [],
      loadend: []
    })
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    that.getwenzhang()
  },
  onReachBottom() { //上拉加载
    var that = this;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/content/getMemberContent', {
      member_id: that.data.view_member_id,
      view_member_id: that.data.member_id,
      page,
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res => {

      wx.hideLoading();
      console.log("环保圈列表")
      console.log(res)
      if (res.data.code == 200) {

        let wenzData = res.data.data;

        let d = that.data.wenzData
        for (var i = 0; i < wenzData.length; i++) {
          d.push(wenzData[i]);
          that.data.page1.push(1)

          let obj = {}
          obj.leng = wenzData[i].words.length
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
      wx.hideLoading();
      console.log(e)
    })
  },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/circle/circle" });
    }
  },
  // 生成海报
  gotoMakephoto(){
    let that = this;
    common.get('/Integral/index_pic',{}).then(res =>{
      if(res.data.code == 200){
        let new_poster_tabs = res.data.data;
        new_poster_tabs.forEach(ele => {
          ele.isActive=false
        });
        that.setData({
          poster_tabs:new_poster_tabs,
          is_poster:true,
        })
      }
    })
    // 生成海报
  },
  // 保存海报
  saveImage(e){
    publicMethod.saveImage(e,this);
  },
  //图片预览
  previewImage(e) { 
    let image_url= [];
    console.log(e)
    image_url.push(e.currentTarget.dataset.img);
    wx.previewImage({
      urls: image_url // 需要预览的图片http链接列表  
    });
  },
  // 关闭海报
  clodmark(){
    this.setData({
      makephoto:false
    })
  },
  /**
     * 获取小程序二维码参数
   */
  getScene(scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
  },
  gettitle_info(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/content/my_content',{
      member_id: that.data.view_member_id,
      my_member_id:  that.data.member_id,
    }).then( res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        that.setData({
          members:res.data.data.members,
          contents:res.data.data.contents,
          follow:res.data.data.follow,
          result:res.data.data.result,
          is_true:res.data.data.is_true,
          business_id:res.data.data.business_id,
          library_id:res.data.data.library_id,
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  previewImage1(e) {
    let that = this;
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
  //获取个人信息
  getPersonInfo() {
    publicMethod.getPersonInfo(this);
  },
  goToPublish() {
    wx.navigateTo({
      url: "/pages/publish/publish"
    })
  },
  // goToIdle() {
  //   let that = this;
  //   let member_id = wx.getStorageSync('member_id');
  //   let url = '/pages/getalllist/getalllist';
  //   wx.navigateTo({
  //     url: url
  //   })
  // },
  goTomyidle(){
    let url = "/pages/mine/myIdleIndex/index?member_id="+ wx.getStorageSync('member_id');
    wx.navigateTo({
      url: url
    })
  },
  gotoxyIdle(){
    wx.navigateTo({
      url: '/pages/mine/myIdle_baby/index?member_id=' + this.data.view_member_id,
    });
  },
  //  进入个人图书馆首页 
  goToindex_personal(){
    let that = this;
    let library_id = that.data.library_id;
    let url = "/packageA/pages/library/personal_index/personal_index?library_id=" + library_id + '&member_id=' + that.data.view_member_id;
      wx.navigateTo({
        url: url
      })
    },
  //  跳转店铺
  goToShop() {
    let that = this;
    let businessid = that.data.business_id;
    let url = "/pages/shop/shop?business_id=" + businessid;
    if(!businessid){
      wx.showToast({
        title: '暂无店铺！',
        icon:'none'
      })
      return
    }else{
      wx.navigateTo({
        url: url
      })
    }
  },
  // 领取积分
  rece_integral(){
    let that = this;
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    common.get("/Integral/content_accept_integral", { 
      "member_id": wx.getStorageSync('member_id'),
      "code_id": that.data.code_id,
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
        duration: 2000,
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
    }
  }).catch(error => {
    console.log(error);
  })
  },
  is_popess(){
    this.setData({
      pop3:false
    })
  },

  // 获取子组件传过来的参数变化
  que_btn(e){
    let that = this;
    let dongtai_id = e.detail.dongtai_id;
    let is_poster = e.detail.is_poster;
    let apiUrl= Makephoto.makeUrl;
    wx.showLoading({
      title: "合成中...",
      icon: 'none',
      mark: true,
    })
    // common.get('/Makephoto/get_photo', {
    common.get('/Makephoto/new_photo', {
        type:'dynamic',
        id: that.data.view_member_id,
        page_url:'pages/mine/myContent/index',
        content:'',
        icon_path:that.data.members.avatar,
        member_id: that.data.view_member_id,
        apiUrl,
        dongtai_id,
    }).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        that.setData({
          is_poster,
          makephoto: true,
          makephoto_img: res.data.data,
        })
      }
    })
  },
  // 发布留言btn
  release_btn(){
    this.setData({
      is_leamsg:true
    })
  },
//查看全部留言
goTolist_detail(){
  let that = this;
  wx.navigateTo({
    url: '/packageA/pages/library/library_content/library_content?member_id=' + that.data.view_member_id + '&is_dongtai=1',
  })
},
release_mrsk(){
  this.setData({
    is_leamsg:false,
    leamsg:''
  })
},
// 提交留言
leamsg_sub() {
  let that = this;
  let user_info = that.data.user_info;
  let prems = {
    member_id: that.data.member_id,
    member_photo: user_info.avatar,
    member_name: user_info.nickname,
    content : that.data.leamsg,
    view_member_id: that.data.view_member_id
  } 
  if(prems.content == ''){
    wx.showToast({
      title: '请填写留言内容...',
      icon:'none'
    })
    return
  }
  common.get('/content_personal/add_message',prems).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '提交成功！',
        icon:'success'
      })
      that.setData({
        is_leamsg:false,
        leamsg:'',
        list_content:[],
      })
      that.onShow();
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
//  显示留言
getcontent_personal(){
  let that = this;
  common.get("/content_personal/index_message",{
    member_id:that.data.view_member_id,
  }).then(res =>{
    if(res.data.code == 200){
      if(res.data.data){
        that.setData({
          is_you:true,
          leavecom_list:res.data.data[0],
        })
      }else{
        that.setData({
          is_you:false,
        })
      }
      
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
leamsg(e){
  this.setData({
    leamsg:e.detail.value
  })
},
gotoper_data(){
  let that = this;
  wx.navigateTo({
    url: '/packageA/pages/personal_data/index?member_id=' + that.data.view_member_id
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
gotoxuanze(){
  let that = this;
  that.click_bg();
},
goto_adshop(e){
  let that = this;
  publicMethod.goto_adshop(e,this);
  // that.click_bg();
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
gotolieks(){
  let that = this;
  that.getCodeSession();
},
getCodeSession(){
  let that = this;
  common.get('/content/getLikes', {
    member_id: wx.getStorageSync('member_id'),
  }).then(res => {
    console.log(res)
    if (res.data.code == 200) {
      let result_yestoday = res.data.data.result_yestoday;
      let result_p = Number(res.data.data.result_yestoday/100);
      wx.showModal({
        content:'昨日获得了'+ result_yestoday +'个赞可兑换'+ result_p +'元，是否前去兑换！',
        confirmColor:'#e90000',
        success(res){
          if(res.confirm){
            wx.navigateTo({
              url: '/packageA/pages/praise_exchange/index',
            })
          }
          if(res.cancel){
            console.log('取消')
          }
        }
      })
    }else{
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })
    }
  }).catch(e => {
    app.showToast({
      title: "数据异常",
    })
    console.log(e)
  })
},
gotojion(e){
  let that = this;
  let source = e.currentTarget.dataset.source;

},
gotojion(e){
  publicMethod.gotojion(e,this);
},
// 跳转活动详情页面
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
// 分享到朋友圈
// onShareTimeline(e){
//   console.log(e)
// }
})