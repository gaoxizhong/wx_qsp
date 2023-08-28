const app = getApp();
const common = require('../../../assets/js/common');
var publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business_id:'',
    switchvalue: false,
    dmList: [], // 弹幕数组
    beList:[],// 初始 弹幕数组
    size:0, // 四分之一数值
    setInter:'',
    is_put: false,  //  持续推广弹窗
    is_ad:1,
    is_agent:false,
    lng: '',
    lat: '',
    set_name:'',  // 持续推广数据
    set_phone:'',// 持续推广数据
    selec_id:1,// 持续推广数据
    yulian_selec_id:1,// 持续推广数据
    selec_name:'',// 持续推广数据
    selec_distance:0,// 持续推广数据
    selec_distance_name:'3',// 持续推广数据
    gl_integral:'30',// 持续推广数据
    select_type:0,
    select_id:0,
    ad_info:{},
    HBBArticle:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      select_type: app.data.select_type,
      select_id: app.data.select_id
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this,this.data.longitude,this.data.latitude);
    that.getDmList(that,that.setDM);
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
    that.setData({
      setInter: setInterval(() => {
        that.setData({
          dmList: [], // 弹幕数组
          beList:[],// 初始 弹幕数组
        })
        that.getDmList(that,that.setDM);
      }, 305000)
    })
  },
  // 获取弹幕数据
  getDmList(t,f){
    let that = t;
    common.get('/activity/chat',{}).then(res =>{
      if(res.data.code == 200){
        that.setData({
          beList: res.data.data.chat
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
    //  无序弹幕
    for (let i = 0; i < _b.length; i++) {
      const time = Math.floor(Math.random() * 20);
      const time1 = Math.floor(Math.random() * 6);
      const _time = time < 6 ? 6 + time1 : time;
      // const top = Math.floor(Math.random() * 180) + 10;
      const topArr = [6,24,42,74,98,121,144,168,198,223,256,282,314,348,364,402,421,458,481,502];
      const topIndex = parseInt(Math.random() * 20);
      const top = topArr[topIndex];
      const color = that.randomColor();
      const _p = {
        avater: _b[i].avater,
        content: _b[i].content,
        member_id: _b[i].member_id,
        color,
        top,
        time: _time,
      };
      dmArr.push(_p);
    }
    that.setData({
      dmList: dmArr
    });

    // 有序弹幕
    // for (let i = 0; i < _b.length; i++) {
    //   const color = that.randomColor();
    //   const _p = {
    //     avater: _b[i].avater,
    //     content: _b[i].content,
    //     member_id: _b[i].member_id,
    //     color,
    //   };
    //   dmArr.push(_p);
    // }
    // const size = Math.floor(dmArr.length/4);
    // that.setData({
    //   dmList: dmArr,
    //   size,
    // });
  },
  // 随机弹幕颜色
  randomColor(){
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    return `rgb(${red}, ${green}, ${blue})`
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
  onShareAppMessage: function () {

  },
  getbuyintegrallist(){
    let that = this;
    common.get('/agent/index',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        // 持续推广的状态
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
          business_id:res.data.data.business_id,
          pay_notice:res.data.data.pay_notice,
          put_distance:res.data.data.put_distance
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },


  // 点持续
  toufang(){
    publicMethod.toufang(this);
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
    wx.navigateTo({
      url: '/packageA/pages/merchant_list/index',
    })
  },
  //  点击开通持续
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
  // 点击轮播广告
  goRedenveDrainage(){
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      wx.navigateTo({
        url: '/packageA/pages/redenve_drainage/index',
      })
    }else{
      that.clickts();
    }

  },
  // 点击置顶广告
  goDynamicDrainage(){
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      wx.navigateTo({
        url: '/packageA/pages/dynamic_drainage/index',
      })
    }else{
      that.clickts();
    }
  },
  //点击内容广告
  goToPublish() {
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      wx.navigateTo({
        url: "/packageA/pages/publish_tool/index"
      })
    }else{
      that.clickts();
    }

  },
  gotorxdb(){
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      wx.navigateTo({
        url: '/packageA/pages/apenny_shopPub/index?business_id=' + business_id,
      })
    }else{
      that.clickts();
    }
  },
  // 点击以点带面
  goTocreateMerchantBuy(){
    let that = this;
    let business_id = that.data.business_id;
    if(business_id){
      wx.navigateTo({
        url: '/packageA/pages/createMerchantBuy/index?business_id=' + business_id,
      })
    }else{
      that.clickts();
    }

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
      that.clickts();
    }

  },
  clickts(){
    wx.showToast({
      title: '请先开通展厅！',
      icon:'none'
    })
    return
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
    click_yulian_bg(){
      this.setData({
        is_yulian:false,
      })
    },
})