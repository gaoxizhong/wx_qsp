const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const md5 = require('../../utils/md5');
var zhuan_dingwei = require('../../assets/js/dingwei.js');
let time1 = null;
let videoAd = null

Page({
  data: {
    lists: [],
    swiperCurrent: 0,   
    amountTitle: '',  //财富标题
    canUseGrandTotal: '',  //环保财富总额
    canUseGrandTotalTitle: '',  //全国总额标题
    memberBankTitle: '',  //环保账户名称
    memberIdBank: '',  //环保id
    memberCode: '',
    realAmount: '',  //环保财富值
    hbb_add:0, //本月收入
    hbb_reduce:0, // 本月支出
    loopShow: 1,
    longitude: app.globalData.longitude,
    latitude: app.globalData.latitude,
    barrageList: [], // 滚动公告
    more_integral:[], // 赚取积分任务列表
    code_id:0,
    result:[],
    result_items:{},
    is_ad:1,
    business_id:'',
    is_put:false,
    set_name:'',
    set_phone:'',
    selec_id:1,
    yulian_selec_id:1,
    selec_name:'',
    selec_distance:0,
    selec_distance_name:'3',
    avatar:'',
    company_name:'',
    yulian_company_name:'',
    integral:'',
    is_preview:false,
    is_yulian:false,
    is_useinter:false,
    useinter_info:{},
    put_distance:[],
    gl_integral:'30',
    is_agent:false,
    fromindex:0,
    view_member_id:'',
    danjia:0,
    m_name:'',
    m_avatar:'',
    m_qian:'',
    jf:0,
    df:0,
    t_money:0.00,
    is_jf:false,
    kou_l:'API',
    is_type:0,
    switchvalue:false,
    canIUseGetUserProfile: false,
    select_type:0,
    select_id:0,
    is_goToSign:true,
    sellRankTab:0,
    acquisitionList:[], // 收购积分列表
    sellBuddyRankList:[], // 好友排行
    sellNearbyRankList:[], // 附近排行
    my_record: null,
    my_rank:null,
    rank_items:null,
    explanation: false,
},
  onLoad: function(options) {
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if(options.is_comtype == 'community'){
      wx.setNavigationBarTitle({
        title:'低碳社区驿站'
      })
    }
    if (options.is_comtype == 'qhysq' ) {
      wx.setNavigationBarTitle({
        title:'清河营中路低碳社区'
      })
      that.setData({
        is_comtype: options.is_comtype
      })
    }

    that.setData({
      select_type: app.data.select_type,
      select_id: app.data.select_id
    })
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options);
    if(this.options.code_id){
      that.setData({
        code_id:this.options.code_id,
        is_mark:true,
      })
    }

    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    that.setData({
      taskHidden: false,
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
    })
    // that.getBarrage();
    if(this.options.fromindex == 1){
      that.goToaddintegral();
    }
      // 在页面onLoad回调事件中创建激励视频广告实例
      if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: 'adunit-f6ea451e26a50fda'
        })
        videoAd.onLoad(() => {
          console.log('onLoad event emit')
        })
        videoAd.onError((err) => {})
        videoAd.onClose((res) => {
          // 用户点击了【关闭广告】按钮
          if (res && res.isEnded) {
            // 正常播放结束，可以下发游戏奖励
          
            common.get('/mine/index?op=ad_point',{
              member_id: wx.getStorageSync('member_id'),
              point: that.data.ad_num, // 积分
            }).then(res =>{
              if(res.data.code == 200){
                wx.showToast({
                  title: '获取' + that.data.ad_num + '积分成功！',
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon:'none',
                })
              }
            }).catch(e=>{
              console.log(e)
            })
          } else {
            // 播放中途退出，不下发游戏奖励
            wx.showToast({
              title: '中途退出，未获取积分',
              icon:'none'
            })
          }
        })
      }
  },
  onShow() {
    this.audioCtx = wx.createAudioContext('myAudio');
    let that = this;
    that.setData({
      taskHidden: false,
      avatar:'',
      company_name:'',
      yulian_company_name:'',
      integral:'',
      is_preview:false,
      is_yulian:false,
      is_useinter:false,
      useinter_info:{},
      is_jf:false,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    if(app.data.select_type != 0 || !app.data.select_type){
      that.setData({
        select_type: app.data.select_type
      })
      console.log(that.data.select_type)

    }
    if(app.data.select_id != 0|| !app.data.select_id){
      that.setData({
        select_id: app.data.select_id
      })
    }
    that.getaccountnumber();
    // that.getbuyintegrallist();
    that.getxiaoxi();
    that.getacquisitionList(that.data.latitude,that.data.longitude);  //  获取商家收购列表数据
    that.getpaimingllist(that.data.latitude,that.data.longitude);
  },
  onHide() {
    clearInterval(time1);
  },
  onUnload() {
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
          amountTitle: res.data.data.amountTitle,
          canUseGrandTotal: res.data.data.canUseGrandTotal,
          canUseGrandTotalTitle: res.data.data.canUseGrandTotalTitle,
          memberBankTitle: res.data.data.memberBankTitle,
          memberIdBank: res.data.data.memberIdBank,
          realAmount: Number(res.data.data.realAmount),
          // hbb_add: res.data.data.hbb_add,
          // hbb_reduce: res.data.data.hbb_reduce,
          m_name:res.data.data.m.nickname,
          m_avatar:res.data.data.m.avatar,
          m_qian:res.data.data.qian,
          jf: res.data.data.jf,
          df: res.data.data.df,
          t_money: res.data.data.t_money,
          memberCode: res.data.data.memberCode?res.data.data.memberCode:'',
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },
  //跳转到排行榜页面
  goToBankRank() {
    let that = this;
    if ( !that.data.member_id ) {
      publicMethod.showLoginConfirm(that);
      return;
    }
    wx.navigateTo({
      url: "/pages/bank_rank/bank_rank"
    })
  },
  //跳转到hbb攻略页面
  goToHbbWalkThrough() {
    wx.navigateTo({
      url: "/pages/hbb_walkthrough/hbb_walkthrough"
    })
  },
  //跳转到账单查询页面
  goToHisOrder() {
    wx.navigateTo({
      url: "/pages/historyorders/historyorders"
    })
  },
  //跳转到收积分页面，展示积分
  goToShowCode() {
    wx.navigateTo({
      url: "/pages/show_wxcode/show_wxcode"
    })
  },
  //跳转到支出积分页面
  goToScanCode() {
    wx.navigateTo({
      url: "/pages/mywealth/mywealth"
    })
  },
  //前往文章页面 按照article_label判断 1跳转文章 2跳转商家 3跳转商品 4跳转回话 5申请入驻
  goToFromArticle(e) {
    let dataset = e.currentTarget.dataset;
    if ( dataset.articlelabel == 1 || !dataset.articlelabel ) {
      //跳转文章
      let url = "/pages/detail/detail?article_id=" + dataset.articlelabelid;
      wx.navigateTo({
        url: url
      })
    } else if ( dataset.articlelabel == 2 ) {
      //跳转商家
      let url = "/pages/shop/shop?business_id=" + dataset.articlelabelid;
      wx.navigateTo({
        url: url
      })
    } else if ( dataset.articlelabel == 3 ) {
      //跳转商品
    } else if ( dataset.articlelabel == 4 ) {
      //跳转会话
    } else if ( dataset.articlelabel == 5 ) {
      //申请入驻
    }
  },
  //打开扫一扫
  openCamera() {
    wx.scanCode({
      success(res) {
        wx.navigateTo({
          url: '/'+res.path
        })
      }
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
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    let that = this;
    that.setData({
      acquisitionList:[], // 收购积分列表
      sellBuddyRankList:[], // 好友排行
      sellNearbyRankList:[], // 附近排行
      my_record: null,
      my_rank:null,
      rank_items:null
    })
    that.getaccountnumber();
    that.getacquisitionList(that.data.latitude,that.data.longitude);  //  获取商家收购列表数据
    that.getpaimingllist(that.data.latitude,that.data.longitude);
    wx.stopPullDownRefresh();
  },
  //获取弹幕
  // getBarrage() {
  //   let that = this;
  //   clearInterval(time1);
  //   that.setData({
  //     barrageList: []
  //   })
  //   common.get("/environmental/bank/environmentalBankHome", {
  //     member_id: that.data.member_id,
  //     type: 8
  //   }).then(res => {
  //     if (res.data.code == 200) {
  //       let gonggao = res.data.data.gonggao;
  //       let barrageList = []
  //       for (var i = 0; i < gonggao.length; i++) {
  //         barrageList.push(gonggao[i].content)
  //       }
  //       that.setData({
  //         barrageList: barrageList,
  //         loopShow: 2
  //       })
  //       let time = that.data.barrageList.length * 5
  //       time1 = setInterval(function () {
  //         that.setData({
  //           loopShow: 1
  //         })
  //         that.getBarrage()
  //       }, (time + 10) * 1000)
  //     }
  //   }).catch(e => {
  //     app.showToast({
  //       title: "数据异常"
  //     })
  //     console.log(e)
  //   })
  // },
  // 跳转到爱心赠送
  goToCricle(e){
    let that = this;
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  // 跳转到上门收书
  goToRecover(e) {
    let that = this;
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  // 获取赚更多积分任务列表
  goToaddintegral(){
    let that = this;
    let member_id = that.data.member_id;
    if (!member_id) {
      wx.showModal({
        title: '登录后才可操作！',
        content: '是否跳转我的页面',
        confirmColor:'#ff1111',
        success:function(res){
          if (res.confirm){
            wx.reLaunch({
              url:'/pages/mine/index/index'
            })
          }
        }
      })
      return
    }else{
      common.get('/environmental/bank/get_more_integral',{
        member_id 
      }).then( res => {
        if (res.data.ret == 0){
          that.setData({
            more_integral:res.data.data,
            taskHidden: true
          })
        }else if(res.data.ret == 201){
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(e =>{
        console.log(e)
        wx.showToast({
          title: e.data.msg,
          icon:'none'
        })
      })
    }

  },

  guanbi_task() {
    this.setData({
      taskHidden: false
    })

  },
  myCatchTouch(){
    return
  },
  // 每日签到
  goToSign(){
    publicMethod.goToSign(this,this.data.longitude,this.data.latitude);
  },
  click_bg(){
    this.gotoindex();
  },
  // =================== 新增 ===================
  goto_adshop(e){
    publicMethod.goto_adshop(e,this);
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // =================== 新增 ===================

  goTotask(e){
    let that = this;
    console.log(e)
    let type = e.currentTarget.dataset.type; 
    let task_id = e.currentTarget.dataset.task_id; 
    let jifen = e.currentTarget.dataset.jifen; 
    let url = e.currentTarget.dataset.url;
    if(url.indexOf("?") != -1){
      url = e.currentTarget.dataset.url + 'member_id=' + wx.getStorageSync('member_id') +'&task_id=' + task_id + '&jifen=' + jifen + '&is_Signtask=1';
    }else{
      url = e.currentTarget.dataset.url + '?member_id=' + wx.getStorageSync('member_id') +'&task_id=' + task_id + '&jifen=' + jifen + '&is_Signtask=1';
    }
    if(type == 1){
      wx.reLaunch({
        url: url,
      })
    }else if(type == 2){
      wx.navigateTo({
        url: url,
      })
    }
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
    common.get("/Integral/accept_integral", { 
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
      that.onShow();
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
      that.onShow();
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
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
    })
  },
  getUserProfile(){
    let that = this;
    publicMethod.getUserProfile(that,that.rece_integral);
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
  getpaimingllist(lat,lng){
    let that = this;
    common.get('/task/index?op=rank',{
      member_id:wx.getStorageSync('member_id'),
      lat,
      lng
    }).then(res =>{
      if(res.data.code == 200){

        let rank_items=res.data.data;
        that.setData({
          rank_items,
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // getbuyintegrallist(){
  //   let that = this;
  //   common.get('/agent/index',{
  //     member_id:wx.getStorageSync('member_id'),
  //   }).then(res =>{
  //     if(res.data.code == 200){
  //       if (res.data.data.status == 2) {
  //         that.setData({
  //           switchvalue: false
  //         })
  //       } else if (res.data.data.status  == 1) {
  //         that.setData({
  //           switchvalue: true
  //         })
  //       }
  //       let result_items=res.data.data.result[0];
  //       that.setData({
  //         result_items,
  //         is_ad:res.data.data.res.is_ad,
  //         is_agent:res.data.data.is_agent,
  //         business_id:res.data.data.business_id,
  //         put_distance:res.data.data.put_distance
  //       })
  //     }
  //   }).catch( e =>{
  //     console.log(e)
  //   })
  // },
  buy_integral(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let integral = e.currentTarget.dataset.integral;
    let money = e.currentTarget.dataset.money;
    let praem = {
      id,
      lng: that.data.longitude,
      lat: that.data.latitude,
      integral,
      money,
      member_id: wx.getStorageSync('member_id'),
    }
    wx.showModal({
      title: "开通推广",
      content: money+"元",
      success(res) {
        if(res.confirm){
          wx.showLoading({
            title: '正在加载...',
          })
          common.get('/agent/pay_integral',praem).then(res =>{
            if (res.data.code == 200) {
              wx.hideLoading()
              if (res.data.data != '') {
                var $config = res.data.data;
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
                    setTimeout(function () {
                      that.getbuyintegrallist();
                    }, 1000)
                    return;
                  },
                  fail: function (e) {
                    wx.showToast({
                      title: '支付失败！',
                      duration: 1000,
                      icon: 'none'
                    })
                    return;
                  }
                });
              } else {
      
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'success'
                })
              }
      
            } else {
              wx.hideLoading();
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
            }
          }).catch(e =>{
            console.log(e)
          })
        }
      }
    })
  },
  goTointegralbuy(){
    wx.navigateTo({
      url: '/packageA/pages/integral_buy/index',
    })
  },
  toufang(){
    publicMethod.toufang(this);
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
  view_usage(){
    let that = this;
    common.get('/agent/ad_usage',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          is_useinter:true,
          useinter_info:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  click_mark(){
    this.setData({
      is_put:false
    })
  },
  click_yulian_bg(){
    this.setData({
      is_yulian:false,
    })
  },
  click_useinter(){
    this.setData({
      is_useinter:false
    })
  },
  goToWallet() {
    wx.navigateTo({
      url: '/pages/mine/wallet/index'
    })
  },
  gotojifenjiaoyi(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    wx.navigateTo({
      url: '/packageA/pages/inttran_receive/index',
    })

  },

  gotofast(){
    let that = this;
    let business_id = that.data.business_id;
      wx.navigateTo({
        url: '/packageA/pages/fastPromote/index?business_id=' + business_id,
      })
  },
  gotoall_transaction(){
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      // wx.navigateTo({
      //   url: '/packageA/pages/fastPromote/index?business_id=' + business_id,
      // })
      // return
      wx.navigateTo({
        url: '/packageA/pages/fastPromote/index?business_id=' + business_id,
      })
    }else{
      wx.navigateTo({
        url: '/packageA/pages/geren_transaction/index?business_id=' + business_id,
      })
    }

  },
  gotoper_data(){
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/personal_data/index?member_id=' + wx.getStorageSync('member_id')
    })
  },
  toufangzanting(){
    wx.showModal({
      cancelColor: 'cancelColor',
      content:'您的积分已不足，请先去获取积分！',
      showCancel:false,
      success(res){
        if(res.confirm){

        }
      }
      
    })
  },
  gotocreate_shop(e) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    let business_id = that.data.business_id;
    if (!business_id) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url+'&member_id='+member_id +'&business_id='+business_id,

      })
    }
  },
  getxiaoxi(){
    let that = this;
    common.get("/content_personal/withdraw_one",{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          is_type: res.data.data
        })
      }else{
        console.log(res.data.msg)
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  switch1Change(e){
    console.log(e)
    let that = this;
    let switchvalue = e.detail.value;
    let status = 0;
    if(switchvalue){
      status = 2
    }else{
      status = 1
    }
    console.log(switchvalue)
    console.log(status)
    common.get('/agent/change_status',{
      member_id: wx.getStorageSync('member_id'),
      status
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
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
      }
    })
  },
  // =============
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
  jump_frog(){
    wx.navigateTo({
      url: '/packageA/pages/merchant_entrance/index',
    })
  },

  // 点击排行榜切换当前页时改变样式
  sellRankNav: function (e) {
    let that = this
    var cur = e.currentTarget.dataset.sellrank;
    if (cur == 1) {
      //附近排行

    } else if (cur == 0) {
      //好友排行

    }
    that.setData({
      sellRankTab: cur
    })
  },
  //  获取商家收购列表数据
  getacquisitionList(lat,lng){
    let that = this;
    console.log(lat)
    console.log(lng)
    common.get('/task/index?op=task_list',{
      member_id: wx.getStorageSync('member_id'),
      lng,
      lat,
      // is_test测试用
    }).then(res =>{
      if(res.data.code == 200){
        let acquisitionList = res.data.data.list;
        acquisitionList.forEach(ele =>{
          ele.is_tsbtn = true;
        })
        that.setData({
          acquisitionList: acquisitionList.splice(0,2),
          my_record: res.data.data.my_record,
        })
      }else{
        console.log(res.data.msg)
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 点击查看更多收购
  goToacquisitionList(){
    wx.navigateTo({
      url: '/packageA/pages/acquisitionList/index',
    })
  },
  goTosellRankList(){
    wx.navigateTo({
      url: '/packageA/pages/sellRankList/index',
    })
  },
  gotosgtask(){
    wx.navigateTo({
      url: '/packageA/pages/dlAcquisition/index',
    })
  },
  // 点击大量收购
  getDlAcquisition(e){
    console.log(e)
    let that = this;
    let my_record = that.data.my_record;
    if( my_record ){
      wx.showToast({
        title: '你有一个任务正在进行中，请先去完成任务',
        icon:'none',
        duration: 2000
      })
      return
    }
    let index = e.currentTarget.dataset.index;
    let acquisitionList = that.data.acquisitionList;
    let taskinfo = acquisitionList[index];
    wx.setStorageSync('taskinfo', taskinfo);
    wx.navigateTo({
      url: '/packageA/pages/dlAcquisition/index',
    })
  },
  // 点击小量收购
  smallAcquisition(e){
    let that = this;
    console.log(e)
    let task_id = e.currentTarget.dataset.id;
    let select_type = e.currentTarget.dataset.select_type;
    let select_id = e.currentTarget.dataset.select_id;
    let business_id = e.currentTarget.dataset.business_id;
    let peram = {
      member_id: wx.getStorageSync('member_id'),
      business_id,
      task_id,
      type: '1'
    };
    common.get('/task/index?op=create_record',peram).then(res =>{
      if(res.data.code == 200){
        // wx.showToast({
        //   title: res.data.msg,
        //   icon:'none'
        // })
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          success (res) { 
            console.log('订阅消息成功');
            // 商品
            if(select_type == '1'){
              wx.navigateTo({
                url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&discount_id=" + select_id  + '&jiage=0.2'+ '&is_smallacqu=1',
              })
            return
            }
            // 优惠券
            if(select_type == '2'){
              wx.navigateTo({
                url: "/packageA/pages/coupon_detail/index?id=" +  select_id + '&jiage=0.2' + '&is_smallacqu=1',
              })
            return
            }
    
          },
          fail (er){
            console.log("订阅消息 失败 ");
            console.log(er);
              // 商品
              if(select_type == '1'){
                wx.navigateTo({
                  url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&discount_id=" + select_id  + '&jiage=0.2'+ '&is_smallacqu=1',
                })
              return
              }
              // 优惠券
              if(select_type == '2'){
                wx.navigateTo({
                  url: "/packageA/pages/coupon_detail/index?id=" +  select_id + '&jiage=0.2' + '&is_smallacqu=1',
                })
              return
              }
    
          }
        })  

      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  clickIscsbtn(e){
    let that = this;
    let acquisitionList = that.data.acquisitionList;
    let index = e.currentTarget.dataset.index;
    acquisitionList[index].is_tsbtn = false;
    that.setData({
      acquisitionList
    })
  },
    // 点击遮罩层
    explanation_bg(){
      let that = this;
      that.setData({
        explanation: false,
      })
    },
    ck_illustrate(){
      let that = this;
      that.setData({
        explanation: true,
      })
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
    },
    goToBay_jf(){
      wx.navigateTo({
        url: '/packageA/pages/points_Buy/index',
      })
    },
    fuzhi_btn(e){
      let that = this;
      let S_info = e.currentTarget.dataset.text;
      wx.setClipboardData({
        data: S_info,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) 
              wx.showToast({
                title: '复制成功！',
              })
            }
          })
        }
      })
    },
    goToGg(){
      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
            wx.showToast({
              title: '激励视频 广告显示失败',
              icon:'none'
            })
          })
        })
      }
    }
})