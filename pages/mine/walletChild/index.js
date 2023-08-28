const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    money:0,
    name_value:'',
    debug_submit:true,
    explanation:false,
    record_data:[],
    is_info_mark:false,
    done_p: 0,
    refuse_p: 0,
    latitude: '',
    longitude: '',
    jine:'0.00',
    confirm_coupons:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return
    } else {
      that.setData({
        member_id,
        pop2: false
      })
    }
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    wx.hideShareMenu();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      member_id,
    })
    if(!member_id){
      return
    }else{
      that.getData();
    }
  },
  getData(){
    this.jine();
    this.jine_1();
    this.getmyGiveaway();
  },
  setName(e){
    let that = this;
    let name_value = e.detail.value;
    console.log(name_value)
    that.setData({
      name_value
    })
  },

  //提现
  gettxian(e) {
    console.log(e)
    let that = this;
    let amount = Number(e.detail.value.money);
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
              let content_id = res.data.data.content_id;
              app.showToast({
                title: '提交审核成功！',
                icon: 'none',
                duration: 1500,
              })
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/circle/circle?is_circle=0&id=' + content_id
                })
              },1000)

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
  jine() {
    let that = this;
    common.get('/memberinfo/indexWithdraw', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      console.log(res)
      that.setData({
        money: res.data.data.balance,
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  mark_tishi(){
    let that = this;
    that.setData({
      explanation:true
    })
  },
  // 点击遮罩层
  explanation_bg(){
    let that = this;
    that.setData({
      explanation: false,
    })
  },
  catchtouchmove(){
    return
  },
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
  // 获取赠送优惠券list
  getmyGiveaway(){
    let that = this;
    common.get('/content_personal/fuli',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.dcode = 200){
        let record_data = res.data.data;
        // record_data.forEach(ele =>{
        //   ele.anim = 1
        // })
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
  jine_1() {
    let that = this;
    common.get('/memberinfo/getWallet', {
      member_id: wx.getStorageSync('member_id')
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
        // wx.navigateTo({
        //   url: '/packageA/pages/confirm_coupons/index?jiage=' + jiage + '&is_blindBox=1',
        // })
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
})