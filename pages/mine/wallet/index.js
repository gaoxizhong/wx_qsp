const app = getApp()
const common = require('../../../assets/js/common');
Page({
  data: {
    img_url: app.data.imgUrl,
    realAmount: '',
    jine: 0,
    note:'',
    is_type:0,
    money:0,
    done_p: 0,
    refuse_p: 0,
    record_data:[],
    name_value:'',
    debug_submit:true,
    confirm_coupons:{},
    longitude: '',
    latitude: '',
  },
  onTabItemTap(item) {
    if (item.index == 3) {
      wx.hideTabBarRedDot({
        index: 3
      })
    }
  },
  onLoad: function (options) {
    console.log('onLoad')
    let that = this
    // 登录
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id')
    console.log(member_id);
    if (!member_id) {
      that.setData({
        pop2: true
      })
      // wx.hideTabBar()
    } else {
      that.setData({
        member_id: member_id,
        pop2: false
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      explanation: false,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    wx.hideShareMenu();
  },
  onShow: function () {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      member_id,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    that.getData();
  },
  onUnload: function () {
    console.log('触发了onunload')
  },
  getData() {
    let that = this;
    that.jine();  // 余额
    that.getxiaoxi();
    that.tx_jine();  // 可提现金额
    that.getmyGiveaway();
  },
  caption(){
    let that = this;
    that.setData({
      explanation: true,
      animationType: "animated fadeInDown" //别忘了加空格

    })
  },

  //跳转到收入明细页面
  getdetails(e) {
    console.log(e)
    let that = this;
    let menber_id = that.data.member_id;
    let url = "/pages/mine/walletDetails/index?member_id=" + menber_id;
    wx.navigateTo({
      url: url
    })
  },
  //跳转到提现明细页面
  getWithdraw(e) {
    console.log(e)
    let that = this;
    let menber_id = that.data.member_id;
    let url = "/pages/mine/WithDetails/index?member_id=" + menber_id;
    wx.navigateTo({
      url: url
    })
  },
  //提现弹出可提现金额模块
  gettxian_btn(e){
    console.log(e)
    let that = this;
    let menber_id = that.data.member_id;
    let url = '/pages/mine/walletChild/index?menber_id=' + menber_id
    wx.navigateTo({
      url: url,
    })
  },
  // 余额
  jine() {
    let that = this;
    let menber_id = that.data.member_id;
    console.log(menber_id)
    common.get('/memberinfo/getWallet', {
      member_id: that.data.member_id
    }).then(res => {
      console.log(res)
      that.setData({
        jine: res.data.total_price
      })
    }).catch(e => {
      app.showToast({
        title: "错误",
      })
      console.log(e)
    })
  },
  // 可提现金额
  tx_jine() {
    let that = this;
    common.get('/memberinfo/indexWithdraw', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      console.log(res)
      that.setData({
        money: Number(res.data.data.balance),
        done_p: res.data.data.done,
        refuse_p: res.data.data.refuse,
      })
    }).catch(e => {
      app.showToast({
        title: "错误",
      })
      console.log(e)
    })
  },
  // 获取赠送优惠券list
  getmyGiveaway(){
    let that = this;
    common.get('/content_personal/fuli',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.dcode = 200){
        let record_data = res.data.data;
        that.setData({
          record_data,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  setName(e){
    let that = this;
    let name_value = e.detail.value;
    that.setData({
      name_value
    })
  },
  //提现按钮
  gettxian(e) {
    console.log(e)
    let that = this;
    let amount = Number(that.data.money);
    let username = e.detail.value.name;
    let debug_submit = that.data.debug_submit;
    if (amount == 0 ) {
      wx.showToast({
        title: '金额不能为 0',
        icon: 'none'
      })
      return
    }
    if ( amount < 1 ) {
      wx.showToast({
        title: '满1元可提现',
        icon: 'none'
      })
      return
    }
    if (that.data.name_value == ''){
      wx.showToast({
        title: '请输入真实姓名！',
        icon:'none'
      })
      return
    }
    if( !debug_submit ){
      return
    }
    that.setData({
      debug_submit:false
    })
    wx.showModal({
      title: '提现提醒',
      content: '审核通过后1-2个工作日到账微信',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#d3d3d3',
      confirmText: '确认',
      confirmColor: '#65B532',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '提现中...',
          })
          common.get('/memberinfo/confirmWithdraw', {
            member_id: wx.getStorageSync('member_id'),
            username,
            amount,
            latitude: that.data.latitude,
            longitude: that.data.longitude,
          }).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              wx.hideLoading();
              app.showToast({
                title: '提交审核成功！',
                icon: 'none',
                duration: 1500,
              })
              let content_id = res.data.data.content_id;
              if(content_id){
                setTimeout(function(){
                  wx.reLaunch({
                    url: '/pages/circle/circle?is_circle=0&id=' + content_id,
                  })
                },1000)
              }else{
                wx.reLaunch({
                  url: '/pages/circle/circle?is_circle=0'
                })
              }

            } else {
              wx.hideLoading();

              app.showToast({
                title: res.data.msg,
              })
              that.setData({
                debug_submit:true
              })
            }
          }).catch(e => {
            wx.hideLoading();

            app.showToast({
              title: e.data.msg,
            })
            that.setData({
              debug_submit:true
            })
            console.log(e)
          })
        } else if (res.cancel) {
          wx.hideLoading()
          that.setData({
            debug_submit:true
          })
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  // 确认交易按钮事件
  confirm_coupons(e){
    let that = this;
    console.log(e)
    let record_data = that.data.record_data;
    let index = e.currentTarget.dataset.index;
    let confirm_coupons = record_data[index];
    app.data.confirm_coupons = confirm_coupons;
    that.setData({
      confirm_coupons: confirm_coupons
    })
    if(confirm_coupons.tab.select_type == '1'){
      that.audit_btn();
      return
    }
    if(confirm_coupons.tab.select_type == '2'){
      that.xuyao_coupon();
      return
    }
  },
  // 优惠券
  xuyao_coupon(){
    let that = this;
    let confirm_coupons = that.data.confirm_coupons;
    common.get("/content_personal/byfuli",{
      id: confirm_coupons.data.del_id
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        // wx.navigateTo({
        //   url: '/packageA/pages/confirm_coupons/index?jiage=' + jiage + '&is_blindBox=1',
        // })
        wx.navigateTo({
          url: "/packageA/pages/coupon_detail/index?id=" + confirm_coupons.data.id  + '&jiage=' + jiage + '&is_blindBox=1' + '&is_tx=1',
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        cion:'none'
      })
    })
  },
  // 商品
  audit_btn(){
    let that = this;
    let status = '1';
    let confirm_coupons = that.data.confirm_coupons;
    let discount_id = confirm_coupons.data.id;
    let business_id = confirm_coupons.data.business_id;
    common.get('/content_personal/audit',{
      status,
      detail_id: confirm_coupons.data.detail_id,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        wx.navigateTo({
          url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('memner_id') + "&discount_id=" + discount_id  + '&jiage=' + jiage + "&is_audit=1" + '&is_blindBox=1' + '&is_tx=1',
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },














  //返回上一页
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/usecoin/usecoin" });
    }
  },
  // 点击遮罩层
  explanation_bg(){
    let that = this;
    that.setData({
      explanation: false,
    })
  },
  getxiaoxi(){
    let that = this;
    common.get("/content_personal/withdraw",{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          note: res.data.data.res? res.data.data.res.note:'',
          is_type: res.data.data.type
        })
      }else{
        console.log(res.data.msg)
      }
    }).catch(e =>{
      console.log(e)
    })
  }
})