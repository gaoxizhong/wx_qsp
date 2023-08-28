const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    business_id:'',
    is_ad:1,
    is_agent:false,
    lng: '',
    lat: '',
    set_name:'',
    set_phone:'',
    selec_id:1,
    yulian_selec_id:1,
    selec_name:'',
    selec_distance:0,
    selec_distance_name:'3',
    gl_integral:'30',
    switchvalue:false,
    fast_switchvalue:false,
    canIUseGetUserProfile: false,
    select_type:0,
    select_id:0,
    ad_info:{},
    is_xin:1,
    beList:[],
    dmList:[],
    setInter:'',
    HBBArticle:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    /**
     * Object.assign(any,any1) 用于对象的合并
     * 获取二维码的参数，绑定到当前this.options对象上
     */
    if(options.scene){
      Object.assign(this.options,this.getScene(options.scene))
    }
    console.log(this.options)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    that.setData({
      select_type: app.data.select_type,
      select_id: app.data.select_id
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this,this.data.longitude,this.data.latitude);
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      that.setData({
        pop2:true
      })
    }else{
      that.setData({
        member_id
      })
    that.getDmList(that,that.setDM);
    }
    // 禁止右上角转发
    // wx.hideShareMenu();
  },
  getData(){
    let that = this;
    that.getbuyintegrallist();
    that.getad_balance();
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
    if(app.data.select_type != 0 || !app.data.select_type){
      that.setData({
        select_type: app.data.select_type
      })
    }
    if(app.data.select_id != 0|| !app.data.select_id){
      that.setData({
        select_id: app.data.select_id
      })
    }
    that.setData({
      setInter: setInterval(() => {
        that.setData({
          dmList: [], // 弹幕数组
          beList:[],// 初始 弹幕数组
        })
        that.getDmList(that,that.setDM);
      }, 95000)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
    var that =this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    that.setData({
			setInter: null
		})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that =this;
    console.log('onUnload')

    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    that.setData({
			setInter: null
		})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if(res.from === 'button'){
      console.log('来自页面内转发按钮')
      // return {
      //     title:'',
      //     imageUrl:'',
      //     path : ''
      // }
    }
    return {
      title: '青蛙推广',
      imageUrl:'http://oss.qingshanpai.com/banner/qingwa123.png',
      path : '/packageA/pages/merchant_entrance/index',
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
  /**
   * 获取小程序二维码参数
   * {string} scene 需要转换的参数字符串
   */
  getScene(scene = "") {
    if(scene == "") return {} 
    let res = {}
    let params = decodeURIComponent(scene).split ("&")
    params.forEach( item => {
      let pram = item.split("=")
      res[pram[0]] = parm[1]
    })
    return res
  },
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
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
  toufang(){
    publicMethod.toufang(this);
  },
  getbuyintegrallist(){
    let that = this;
    common.get('/agent/index',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        if (res.data.data.status == 2) {
          that.setData({
            switchvalue: false
          })
        } else if (res.data.data.status  == 1) {
          that.setData({
            switchvalue: true
          })
        }
        let result_items=res.data.data.result[0];
        wx.setStorageSync('business_id', res.data.data.business_id);
        that.setData({
          result_items,
          is_ad:res.data.data.res.is_ad,
          is_agent:res.data.data.is_agent,
          pay_notice:res.data.data.pay_notice,
          business_id:res.data.data.business_id,
          put_distance:res.data.data.put_distance
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
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
            wx.showToast({
              title: e.data.message,
              icon:'none'
            })
          })
        }
      }
    })
  },
  gotoall_transaction(){
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      // wx.navigateTo({
      //   url: '/packageA/pages/all_transaction/index?business_id='+ business_id,
      // })
      wx.navigateTo({
        url: '/packageA/pages/fastPromote/index?business_id=' + business_id,
      })
    }else{
      wx.showToast({
        title: '请先开通展厅！',
        icon:'none'
      })
    }

  },
  click_mark(){
    this.setData({
      is_put:false
    })
  },
  set_name(e){
    this.setData({
      set_name:e.detail.value
    })
  },
  set_phone(e){
    this.setData({
      set_phone:e.detail.value
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
    let business_id = that.data.business_id;
    if (!business_id) {
      wx.showToast({
        title: '请先开通展厅！',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/merchant_list/index',
    })
  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: "010-84672332"
    })
  },
  click_yulian_bg(){
    this.setData({
      is_yulian:false,
    })
  },
  // goto_transaction(){
  //   let that = this;
  //   let business_id = that.data.business_id;
  //   wx.navigateTo({
  //     url: '/packageA/pages/look_tranlist/index?business_id=' + business_id,
  //   })
  // },
  openSetting() {
    let that = this;
    publicMethod.openSetting(that);
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
  fast_switch1Change(e){
    console.log(e)
    let that = this;
    let fast_switchvalue = e.detail.value;
    let status = 0;
    if(fast_switchvalue){
      status = 2
    }else{
      status = 1
    }
    common.get('',{
      member_id: wx.getStorageSync('member_id'),
      status
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          fast_switchvalue,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          fast_switchvalue: !fast_switchvalue,
        })
      }
    }).catch(e =>{
      console.log(e)
      that.setData({
        fast_switchvalue: !fast_switchvalue,
      })
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
  goTotopup(){
    wx.navigateTo({
      url: '/packageA/pages/topup_pages/index',
    })
  },
  goto_index(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  gotointegral_page(){
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/buy_integral/index',
    })
  },
  promote_page(){
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/promote_quota/index',
    })
  },
  getad_balance(){
    let that = this;
    common.get('/ad/index',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let ad_info = res.data.data;
        that.setData({
          HBBArticle: ad_info.HBBArticle,
          ad_info
        })
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

  // 跳转发布商家收购页面
  goTocreateMerchantBuy(){
    let business_id = this.data.business_id;
    wx.navigateTo({
      url: '/packageA/pages/createMerchantBuy/index?business_id=' + business_id,
    })
  },
  // 获取弹幕数据
  getDmList(t,f){
    let that = t;
    common.get('/activity/chat',{}).then(res =>{
      if(res.data.code == 200){
        that.setData({
          beList: res.data.data.chat.splice(0,30)
        })
        if (typeof f == "function") {
          return f()
        }
      }
    }).catch(e=>{
      console.log(e)
    })
  },
    // 处理弹幕位置
    setDM() {
      let that = this;
      // 处理弹幕参数
      const dmArr = [];
      const _b = that.data.beList; // 接口数据
      // 有序弹幕
      for (let i = 0; i < _b.length; i++) {
        const time = Math.floor(Math.random() * 20);
        const time1 = Math.floor(Math.random() * 6);
        const _time = time < 6 ? 6 + time1 : time;
        // const top = Math.floor(Math.random() * 180) + 10;
        const color = that.randomColor();
        const _p = {
          avater: _b[i].avater,
          content: _b[i].content,
          member_id: _b[i].member_id,
          color,
          time: _time,
        };
        dmArr.push(_p);
      }
      that.setData({
        dmList: dmArr
      });
    },
  // 随机弹幕颜色
  randomColor(){
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    return `rgb(${red}, ${green}, ${blue})`
  },
  gotoadsubpsge(e){
    let that = this;
    let business_id = that.data.business_id;
    if (!business_id) {
      wx.showToast({
        title: '请先开通展厅！',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/adSubpage/index',
    })

  },
  goto_gjqx(){
    // wx.showToast({
    //   title: '暂未开通！',
    //   icon:'none'
    // })
   let business_id = this.data.business_id;
   if(!business_id){
    wx.showToast({
      title: '请先开通展厅！',
      icon:'none'
    })
    return
   }else{
    wx.navigateTo({
      url: '/packageB/pages/advanced_permission/index',
    })
   }

  },
  //跳转到hbb攻略页面
  goToHbbWalkThrough() {
    wx.navigateTo({
      url: "/pages/hbb_walkthrough/hbb_walkthrough"
    })
  },
  //前往文章页面 按照article_label判断 1跳转文章 2跳转商家 3跳转商品 4跳转回话 5申请入驻
  goToFromArticle(e) {
    let dataset = e.currentTarget.dataset;
    if ( dataset.articlelabel == 1 || !dataset.articlelabel ) {
      //跳转文章
      let url = "/pages/detail/detail?article_id=" + dataset.id;
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
})