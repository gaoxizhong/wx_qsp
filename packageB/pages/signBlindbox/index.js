const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_img:[],
    latitude: '',
    longitude: '',
    member_id: '',
    record_data:[],  // 盲盒数据
    record_num:0, // 待拆盲盒数量
    jiage:'0.00',
    is_blindBox: false,
    business_name:'',
    // 进度条动画数据
    is_progress: false, // 进度条显示
    bar_number: 2,
    djs_number: 5,
    bar_text: '盲盒正在打开, 请稍后.....',
    timer:{}, // 进度条
    djs_timer:{},   // 倒计时
    confirm_coupons:{},
    shopInfo:{}, // 商品数据
    goodnum: '1',  //购买数量
    business_discount_id:'',
    is_returns: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    that.setData({
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      member_id: wx.getStorageSync('member_id'),
    })
    that.getmyGiveaway();
    that.getBannerUrls();
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
  //  点击拆盲盒按钮
  clickBlindboxBtn(){
    let that = this;
    let record_data = that.data.record_data;
    let confirm_coupons = record_data[0];
    if(!confirm_coupons){
      wx.showToast({
        title: '暂无盲盒可拆....',
        icon:'none'
      })
      return
    }
    let is_returns = that.data.is_returns;
    if(!is_returns){
      wx.showToast({
        title: '请勿重复点击....',
      })
      return
    }
    that.setData({
      is_returns:false,
      bar_text: '盲盒正在打开, 请稍后.....',
      confirm_coupons,
      business_name:confirm_coupons.data.business_name,
    })
    let select_type = confirm_coupons.tab.select_type;
    if(select_type == '1'){
      // 商品
      that.audit_btn();
    }
    if(select_type == '2'){
      // 优惠券
      that.xuyao_coupon();
    }

  },
  // 商品
  audit_btn(){
    let that = this;
    let status = '1';
    let confirm_coupons = that.data.confirm_coupons;
    let discount_id = confirm_coupons.data.id;
    common.get('/content_personal/audit',{
      status,
      detail_id: confirm_coupons.data.detail_id,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      that.setData({
        is_returns: true,
      })
      if(res.data.code == 200){
        let jiage = res.data.money;
        that.setData({
          jiage
        })
        that.getOneDiscount(discount_id);
        // =======  进度条动画 ======
        let progressBar = {
          that: that,
          text: '盲盒打开成功！',
          tag: 'is_blindBox',
          jiage: 0.15,
          f:that.getmyGiveaway
        }
        publicMethod.progress_bar(progressBar);
        // =======  进度条动画 ======

      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    }).catch(e =>{
      console.log(e)
      that.setData({
        is_returns: true,
      })
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
        let record_num = Number(res.data.data.length);
        that.setData({
          record_data,
          record_num,
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

  //banner广告数据
  getBannerUrls() { 
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



  //获取单个的活动/商品
  getOneDiscount(d_id) {
    let that = this;
    let param = {
      discount_id: d_id,
    }
    common.get("/business/getBusinessDiscount", param).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          shopInfo: res.data.data[0],
          discount_price: res.data.data[0].discount_price?res.data.data[0].discount_price.toFixed(2):0,
          business_discount_id: res.data.data[0].id,
          need_num: res.data.data.need_num,
        })
        if ( res.data.data.need_num == 0){
          this.setData({
            is_type: 'mark',
          })
        }
        wx.setStorageSync('delivery', res.data.data[0].delivery)
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1500,
          icon: 'none'
        })
      }
    })
  },
  // 点击进店逛逛
  gotoshop(e){
    let business_id = e.currentTarget.dataset.business_id;
    wx.navigateTo({
        url: '/pages/shop/shop?business_id='+business_id,
    })
  },
  //点击立即购买
  buyNow() {
    let that = this;
    that.setData({
      butType: 0
    })
    let param = {
      member_id: wx.getStorageSync('member_id'),
      business_id: that.data.shopInfo.business_id,
      business_discount_id: that.data.business_discount_id,
      pay_sum_jifen: (that.data.shopInfo.hbb * that.data.goodnum).toFixed(2),
      pay_count: that.data.goodnum,
      activityInfo: that.data.shopInfo,
    }
    if (param.pay_count < 1) {
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    wx.setStorageSync("toBuyWel", (param));
    let url = "/pages/tobuy_welfare/tobuy_welfare?business_id=" + param.business_id + "&discount_id=" + that.data.shopInfo.id; 
    wx.navigateTo({
      url,
    })
  },
})