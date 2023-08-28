const app = getApp()
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
  data: {
    true: true,
    img_url: app.data.imgUrl,
    midCurrent: 0,
    wenzData: [],
    infoData: [],
    benifitUnion: {},  //公益联盟模块
    buyItem: [],  //购买模块,
    moreCates: [],  //商家，商品，客服等合并模块,
    member_id: 0,
    isshare: 0,
    iscode: 0,
    class_top_list:[],
    class_bottom_list:[],
    latitude: '',
    longitude: '',
    is_true:false,
    isPlay:false,
    is_showlist:false,
    code_id:'',
    is_mark:false,
    is_jifenjiaoyi:true,
    is_remind:'',
    number_r: 0,
    canIUseGetUserProfile: false,
    is_goToSign: true,
    indexTopList:[], // 首页上面列表
    pa_list:[],// 首页 热门活动列表
    is_click: false,
    is_paopao: false,
    page_url:'',
    browse_is_index_count: 0,
    is_sgf: false,
    communityInfoList:[], // 社区大集列表
  },
  onLoad: function(options) {
     let that = this;
     let is_jifenjiaoyi= wx.getStorageSync('is_jifenjiaoyi');
     if(is_jifenjiaoyi == '1'){
      that.setData({
        is_jifenjiaoyi:false,
      })
     }
    that.setData({
      number_r:Math.floor(Math.random()*10000),
      is_remind:app.data.is_remind,
    })
      setTimeout(function(){
        app.data.is_remind = false;
        that.setData({
          is_remind:false
        })
      },4000)
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options);
    if(this.options.code_id){
      that.setData({
        code_id:this.options.code_id,
        integual:this.options.i,
        is_mark:true,
      })
    }
    if ( options.isshare && options.iscode) {
      that.setData({
        isshare: options.isshare,
        iscode: options.iscode
      })
      if (that.data.member_id){
        that.getSharePoint(options.isshare, options.iscode);
      }
    }
    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    that.setData({
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
  },
  onShow() {
    // wx.setStorageSync('member_id', 35);
    let that = this;
    that.setData({
      is_click: false,
      is_paopao: false,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
    let member_id = wx.getStorageSync('member_id');
    if(member_id){
      if(that.data.page_url){
        console.log(that.data.page_url)
        wx.navigateTo({
          url: that.data.page_url
        })
        that.setData({
          page_url:''
        })
        console.log(that.data.page_url)
      }
    }
    that.getData();
  },
  onHide() {
  },
  onUnload() {
  },
  getData() { //初始化数据
    let that = this
    // that.getBuyItems();
    that.getClassmodule();
  },

  swiperMidChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      midCurrent: e.detail.current
    })
  },
//  授权 获取个人信息
  getUserInfo: function(e) {
    publicMethod.getUserInfo(e,this);

  },
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  getUserProfile() {
    publicMethod.getUserProfile(this,this.getData1);
  },
  getData1(){
    app.guajifen(this,app.globalData.longitude,app.globalData.latitude);
    publicMethod.zhuan_baidu(this);
  },
  //获取购买栏信息
  getBuyItems() {
    let that = this;
    let arr = [
      {
        title: '图书馆',
        content: 'http://oss.qingshanpai.com/huanbaobi/a05386c901db801d14d6a0de06e7fa89.png',
        page: '/packageA/pages/library/library/library'
      },
      {
        title: '便民服务',
        content: '/images/binmin_fenmian.png',
        page: '/pages/getalllist/getalllist?member_id='+ that.data.member_id
        // page: '/packageA/pages/huishou_area/huishou_area'

      }
    ]
    that.setData({
      buyItem: arr
    })
  },
  //前往支付页面
  goToScanCode() {
    wx.navigateTo({
      url: "/pages/book_store/book_store"
    })
  },

  //从banner图跳转 1为文章，2为商家，3为会话
  goToFromImg(e) {
    let dataset = e.currentTarget.dataset;
    if ( dataset.label == 1) {
      //跳转文章
      let url = "/pages/detail/detail?article_id=" + dataset.labelid;
      wx.navigateTo({
        url: url
      })
    } else if ( dataset.label == 2 ) {
      //跳转商家
      let url = "/pages/shop/shop?business_id=" + dataset.labelid;
      wx.navigateTo({
        url: url
      })
    } else if ( dataset.label == 3 ) {
      //发起会话

    }else if ( dataset.label == 4 ) {
      //跳转商品
      let url = '/pages/dicount_good/dicount_good?discount_id=' + dataset.labelid;
      wx.navigateTo({
        url: url
      })
   }else if ( dataset.label == 5 ) {
     //跳转小程序
     wx.navigateToMiniProgram({
       appId: dataset.labelid,
       path: '',
       envVersion: 'release',
       success(res) {
         // 打开成功
         console.log('打开成功')
       },
       fail(res){
         // 打开失败
         wx.showToast({
           title: res.errMsg,
           icon:'none'
         })
       }
     })
   }
  },

  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  //分享得积分
  getSharePoint(id, code) {
    common.get("/article/shareFriend", {
      member_id: id,
      parent_member_id: id,
      code:code
    }).then( res => {
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( error => {
      console.log(error)
    })
  },
  isLogin(){
    let that = this
    if(that.data.member_id == 0){
       wx.showToast({
         title: '请点击底部栏【我的】先进行登录，然后再进行此操作',
         icon: 'none'
       })
    }
  },
  onShareAppMessage: function(res) { //分享
    let that = this;
    let code = new Date().getTime();
    return {
      title: '青山生态 真正的环保派…',
      imageUrl: '',
      path: '/pages/index/index?isshare='+that.data.member_id+'&iscode='+code,
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
  //下拉刷新
  onPullDownRefresh() {
    let that = this;
    that.getData();
    wx.stopPullDownRefresh();
  },
  cancelLogin() {
    this.setData({
      pop2: false
    })
    console.log('取消授权完成')
  },

getClassmodule(){
  let that = this;
  common.get('/newhome/index',{
    member_id:wx.getStorageSync('member_id'),
  }).then(res =>{
    if(res.data.code == 200) {
      that.setData({
        pa_list:res.data.data.new.pa_list,
        indexTopList:res.data.data.new.indexTopList,
        is_true:res.data.data.is_true,
        is_showlist:true,
        browse_is_index_count: res.data.data.browse_is_index_count,
        is_sgf: res.data.data.is_sgf,
        communityInfoList: res.data.data.community_info_list,
      })
    }else{
      app.showToast({
        title: res.data.msg,
        icon:'none'
      })
    }
  }).catch(e =>{
    app.showToast({
      title: "数据异常"
    })
  })

},

//跳转到商家
goToclassactical(e) {
  let that = this;
  let member_id = wx.getStorageSync('member_id');
  let page = e.currentTarget.dataset.page;
  if(!member_id){
    that.setData({
      page_url: page
    })
    publicMethod.gotoLoginMark();
    return
  }
  wx.navigateTo({
    url: page
  })
  // if(page == "/pages/book_store/book_store?tab=1"){
  //   wx.navigateTo({
  //     url: "/packageA/pages/book_points_class/index"
  //   })
  // }else{
  //   wx.navigateTo({
  //     url: page
  //   })
  // }
},
//跳转到社区首页
goTosq(e) {
  let id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: "/packageB/pages/qhyRally/home/index?id=" + id
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
  // 领取积分
  rece_integral(){
    let that = this;
    common.get("/Integral/index_accept_integral", { 
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
    wx.showToast({
      title: error.data.message,
      icon:'none',
      duration: 2000,
    })
    console.log(error);
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
        lng:app.globalData.longitude,
        lat: app.globalData.latitude,
      }).then(res =>{
        if(res.data.code == 200){
          let is_jf = res.data.data;
          // 授权订阅消息
          wx.requestSubscribeMessage({   // 调起消息订阅界面
            tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
            success (res) { 
              console.log('订阅消息成功');
              console.log(res);
              if(!is_jf){
                // 没领取过积分
                wx.setStorageSync('is_jifenjiaoyi', '1')
                that.setData({
                  is_jifenjiaoyi:false
                })
                wx.navigateTo({
                  url: '/packageA/pages/inttran_receive/index',
                })
              }else{
                // 领取过积分
                wx.setStorageSync('is_jifenjiaoyi', '1')
                that.setData({
                  is_jifenjiaoyi:false
                })
              }
            },
            fail (er){
              console.log("订阅消息 失败 ");
              console.log(er);
              if(!is_jf){
                // 没领取过积分
                wx.setStorageSync('is_jifenjiaoyi', '1')
                that.setData({
                  is_jifenjiaoyi:false
                })
                wx.navigateTo({
                  url: '/packageA/pages/inttran_receive/index',
                })
              }else{
                // 领取过积分
                wx.setStorageSync('is_jifenjiaoyi', '1')
                that.setData({
                  is_jifenjiaoyi:false
                })
              }
            }
          })  
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
    wx.setStorageSync('is_jifenjiaoyi', '1');
    that.setData({
      is_jifenjiaoyi:false
    })
  },
  catchtouchmove(){
    return
  },
  // 跳转便民驿站
  goToconvenience(){
    wx.navigateTo({
      url: '/packageA/pages/convenience_plate/plate_items/index',
    })
  },
  // 每日签到
  goToSign(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    publicMethod.goToSign(this,this.data.longitude,this.data.latitude);
  },
  // 赚更多积分
  // goTobank(){
  //   publicMethod.goTobank();
  // },
  goTobank(){
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }

    wx.navigateTo({
      url: '/packageB/pages/signIndex/index?m_id=' + member_id,
    })
  },
  click_bg(){
    this.setData({
      is_preview:false
    })
  },
  // =================== 新增 ===================
  goto_adshop(e){
    publicMethod.goto_adshop(e,this);
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // =================== 新增 ===================


  gotoAnswer(){
    wx.navigateTo({
      url: '/packageA/pages/answer_pages/index',
    })
  },
  is_click(){
    let that = this;
    that.setData({
      is_click: true,
      is_paopao: true
    })
    setTimeout(function(){
      that.setData({
        is_paopao: false
      })
      wx.navigateTo({
        url: '/pages/shop/shop?business_id=2438' + '&is_index=1',
      })
    },1000)
  },
  greenPoints_click(e){
    let page = e.currentTarget.dataset.page;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    wx.reLaunch({
      url: page,
    })
  },
  // 点击低碳生活馆按钮
  clickLiving(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/livingHall_home/index',
      // url: '/packageB/pages/communityFunction/home/index',
    })
  },
  clickSx(e){
    wx.navigateTo({
      // 清河营社区
      url: '/packageB/pages/qhyRally/home/index?id=4', 
      // 重走长征路
      // url: '/packageB/pages/retraceLongMarch/home/index',
      // 冬奥打卡
      // url: '/packageB/pages/winter_olympics/winter_punchlist/index',
      // 扫码核销
      // url: '/packageB/pages/livingHall/codeVer/index',
    })
  },
  goToCreate(){
    wx.navigateTo({
      url: '/packageB/pages/qhyRally/apply/index',
    })
  },
  click_remind(){
    this.setData({
      is_remind: false
    })
  }
})