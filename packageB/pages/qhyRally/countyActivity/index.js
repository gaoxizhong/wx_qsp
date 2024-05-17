const common = require("../../../../assets/js/common");
const app = getApp();
// packageB/pages/qhyRally/countyActivity/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoData:{},
    realAmount: '',  //环保财富值
    buyer_address:{},
    goodnum:1,
    is_communityInfo:false, // 是否点击社区大集商品兑换按钮弹窗状态

    business_id:'',
    shopList:[],
    is_signUp:false,
    is_gg:false,
    user_name:'', // 联系人
    user_tel:'', // 联系电话
    end: '',    // 目标日期时间戳
    start:'',// 开始日期时间戳
    c_day: '00',
    c_hr: '00',
    c_min: '00',
    c_sec: '00',
    community_info_id:'', // 社区id
    community_market_id:'', //社区大集ID
    marketInfo:{}, // 大集信息
    pageSize:10,
    page:1,
    boothCountInfo:{}, // 获取社区大集摊位剩余数信息
    signPage: 1,
    signPageSize: 10,
    marketSignList:[], //获取报名社区大集会员列表
    marketMemberStrol:[], //统计社区大集去逛逛的人数
    // msgList: [
    //   { title: '你有一笔奖励待发放' },
    //   { title: '1.8元津贴到账，快点去打车吧' },
    //   { title: '单单八折赢iPhone，一路迎春“发”' }
    // ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var marketInfo = JSON.parse(options.marketInfo);
    wx.setNavigationBarTitle({
      title: marketInfo.market_name
    })
    // 目标日期时间戳
    const end = Date.parse(marketInfo.end_time);
    // 开始日期时间戳
    const start = Date.parse(marketInfo.start_time);
    // 当前时间戳
    const now = new Date();
    // const now = Date.parse(new Date());
    this.setData({
      marketInfo,
    })
    // 相差的毫秒数
    const msec = start - now;
    console.log(msec)
    if( Number(msec) > 0 ){
      this.countdown( now,marketInfo.start_time );
    }
    // 获取社区大集商家活动福利
    // this.getActivityWelfare();
  },
  //倒计时
  countdown(c,n) {
    let that = this;
    let n_date = n;
    let s_date = c;
    // 目标日期时间戳
    const end =n_date? Date.parse(n_date):0;
    // 开始日期时间戳
    const start = s_date?Date.parse(s_date):0;
    // 相差的毫秒数
    const msec = end - start;
    if( Number(msec) <= 0 ){
      that.setData({
        c_day:'00',
        c_hr:'00',
        c_min:'00',
        c_sec:'00',
      })
      setTimeout(()=>{
        wx.showToast({
          title: '报名活动已结束！',
          icon:'none',
          duration:2000
        })
      },1500)
      
      clearTimeout(countdownTimeout);

      return
    }
    // 计算时分秒数
    let c_day = parseInt(msec / 1000 / 60 / 60 / 24)
    let c_hr = parseInt(msec / 1000 / 60 / 60 % 24)
    let c_min = parseInt(msec / 1000 / 60 % 60)
    let c_sec = parseInt(msec / 1000 % 60)
    // 个位数前补零
    c_day = c_day > 9 ? c_day : '0' + c_day;
    c_hr = c_hr > 9 ? c_hr : '0' + c_hr;
    c_min = c_min > 9 ? c_min : '0' + c_min;
    c_sec = c_sec > 9 ? c_sec : '0' + c_sec;
    // 控制台打印
    // console.log(`${c_day}天 ${c_hr}小时 ${c_min}分钟 ${c_sec}秒`)
    that.setData({
      c_day:c_day?c_day:'00',
      c_hr:c_hr?c_hr:'00',
      c_min:c_min?c_min:'00',
      c_sec:c_sec?c_sec:'00',
    })
    // 一秒后递归
    let countdownTimeout = setTimeout(function () {
      that.countdown(new Date(),n_date )
    }, 1000)
  },

  // 获取大集活动福利
  getActivityWelfare(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/community_market/community_market_business_discount_list?page='+ that.data.page,{
      community_info_id: that.data.marketInfo.community_info_id,
      community_market_id: that.data.marketInfo.id, //社区大集ID
      pageSize: that.data.pageSize,
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let newList = res.data.data.data;
        newList.forEach(ele =>{
          ele.business_discount[0].img =  JSON.parse(ele.business_discount[0].img)
        })
        console.log(newList)
        let shopList = that.data.shopList.concat(newList);
        that.setData({
          shopList,
          current_page: res.data.data.last_page
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
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
    this.setData({
      page:1,
      shopList:[],
    })
    // 获取社区大集摊位剩余数
    this.getBoothCount();
    // 获取报名社区大集会员列表
    this.getMarketSignList();
    // 统计社区大集去逛逛的人数
    this.getMarketMemberStrol();
    // 获取社区大集商家活动福利
    this.getActivityWelfare();
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
    let that = this;
    let current_page = that.data.current_page;
    let page = that.data.page;
    if(current_page <= page){
      wx.showToast({
        title: '已加载全部！',
        icon:'none'
      })
      return
    }
    that.setData({
      page: that.data.page+1
    })
    that.getActivityWelfare();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.marketInfo.market_name,
      imageUrl:'',
      path : '/packageB/pages/qhyRally/countyActivity/index?marketInfo=' + JSON.stringify(that.data.marketInfo),
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
  goTomyidle(){
    let url = "/pages/mine/myIdleIndex/index?member_id="+ wx.getStorageSync('member_id');
    wx.navigateTo({
      url: url
    })
  },
  // 我的闲圈
  goTomyGroup(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/myidleGroupIndex/index',
    })
  },
  // 查看往期
  goToDynamic(){
    let m = this.data.marketInfo;
    let marketInfo = JSON.stringify(m);
    let url = '/packageB/pages/qhyRally/pastDynamic/index?marketInfo=' + marketInfo;
    wx.navigateTo({
      url,
    })
  },
  // 点击去逛逛
  clickSign(){
    let that = this;
    let community_info_id = that.data.marketInfo.community_info_id;  //社区ID
    let community_market_id = that.data.marketInfo.id;  //社区大集ID
    common.post('/community_market/add_market_member_stroll',{
      member_id:wx.getStorageSync('member_id'),
      community_info_id,
      community_market_id,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '欢迎来逛逛!',
          icon:'none'
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  clickGgMark(){
    this.setData({
      is_gg: false,
    })
  },
  clickSifnMark(){
    this.setData({
      is_signUp: false
    })
  },
  getPhoneNumber (e) {
    console.log(e)
    let that = this;
    let code = e.detail.code;
    common.post('/community_market/get_member_auth_mobile',{
      code,
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          user_tel: res.data.data.phone_info.phoneNumber
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  changerMarsk(){
    this.setData({
      is_gg: false,
      is_signUp: true,
    })
  },
  // 点击报名提交按钮
  changer_address_marsk(){
    let that = this;
    let user_name = that.data.user_name;
    let user_tel = that.data.user_tel;
    let community_info_id = that.data.marketInfo.community_info_id;  //社区ID
    let community_market_id = that.data.marketInfo.id;  //社区大集ID
    if(!user_name || user_name == '' || !user_tel || user_tel == '' ){
      wx.showToast({
        title: '请先填写信息！',
        icon:'none'
      })
      return
    }
    common.post('/community_market/community_market_sign_up',{
      community_info_id,
      community_market_id,
      member_id: wx.getStorageSync('member_id'),
      mobile: user_tel,
      name: user_name,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.message,
        })
        that.setData({
          is_signUp: false
        })
        that.onShow();
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  // 点击抢摊位
  clickRobBooth(){
    this.setData({
      is_gg:true,
      is_signUp: false,
    })
  },
  // 获取社区大集摊位剩余数
  getBoothCount(){
    let that = this;
    common.get('/community_market/get_community_market_booth_count',{
      community_info_id: that.data.marketInfo.community_info_id,
      community_market_id: that.data.marketInfo.id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          boothCountInfo: res.data.data
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 获取报名社区大集会员列表
  getMarketSignList(){
    let that = this;
    common.get('/community_market/get_community_market_sign_up_list',{
      community_info_id: that.data.marketInfo.community_info_id,
      community_market_id: that.data.marketInfo.id,
      page: that.data.signPage,
      pageSize: that.data.signPageSize
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          marketSignList: res.data.data
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  //  marketMemberStrol统计社区大集去逛逛的人数
  getMarketMemberStrol(){
    let that = this;
    common.get('/community_market/statistics_market_member_stroll',{
      community_info_id: that.data.marketInfo.community_info_id,
      community_market_id: that.data.marketInfo.id,
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          marketMemberStrol: res.data.data
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  //前往活动详情
  goToActivity(e) {
    console.log(e)
    let that = this;
    let is_yzm = that.data.is_yzm;
    let discountid = that.data.discountid;
    let member_id = that.data.member_id;
    let business_id = e.currentTarget.dataset.business_id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let content_id = e.currentTarget.dataset.content_id;
    let copy_business = e.currentTarget.dataset.copy_business;
    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + member_id + "&discount_id=" + discount_id + '&content_id=' + content_id + "&copy_business=" + copy_business;
    if(is_yzm){
      url = url + '&is_yzm=' + is_yzm
    }
    wx.navigateTo({
      url: url
    })
  },
  user_name(e){
    this.setData({
      user_name: e.detail.value
    })
  },

    // =================== 以下社区大集相关功能 ↓ ===================
  // 点击社区大集商品
  goToPay(e){
    console.log(e)
    let that = this;
    let infoData = e.currentTarget.dataset.info;
    that.setData({
      is_communityInfo: true,
      infoData
    })
    // 获取环保银行账户详情
    that.getaccountnumber();
    // 获取买家信息
    that.getBuyInfo();
  },
  clickCommunityInfoPop(){
    this.setData({
      is_communityInfo: false
    })
  },
  minusNum() {
    let that = this;
    that.data.goodnum --;
    if (that.data.goodnum < 1) {
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  addNum() {
    let that = this;
    that.data.goodnum ++;
    if ( that.data.goodnum > (that.data.bal_count - 0) ) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  inputValue(e) {
    let that = this;
    if ( e.detail.value > (that.data.bal_count - 0) ) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    }else if (e.detail.value < 1){
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    }else {
      that.setData({
        goodnum: e.detail.value
      })
    }
  },
  user_name(e){
    this.setData({
      user_name: e.detail.value
    })
  },
  getPhoneNumber (e) {
    console.log(e)
    let that = this;
    let code = e.detail.code;
    common.post('/community_market/get_member_auth_mobile',{
      code,
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          user_tel: res.data.data.phone_info.phoneNumber
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
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
          realAmount: Number(res.data.data.realAmount),
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },
  // 点击确定
  clickExchangeBtn(){
    let that = this;
    let p = { 
      member_id: wx.getStorageSync('member_id'),
      pay_sum_money: (that.data.infoData.business_discount[0].total_price * that.data.goodnum).toFixed(2),
      business_id: that.data.infoData.business_discount[0].business_id,
      business_discount_id: that.data.infoData.business_discount_id,
      pay_sum_jifen: (that.data.infoData.business_discount[0].hbb * that.data.goodnum).toFixed(2),
      pay_count : that.data.goodnum,
      pay_total_money: (that.data.infoData.business_discount[0].total_price * that.data.goodnum).toFixed(2),
      obtain_type: 1,  // 到店自提
      obtain_name: that.data.user_name,
      obtain_phone: that.data.user_tel,
      obtain_address: '',
      deliveryMethod: '',
      deliveryPrice: 0,
      remark: '参加社区大集的优惠活动下单兑换！',
      is_idle: that.data.infoData.business_discount[0].is_idle,
      is_welfare: that.data.infoData.business_discount[0].is_welfare,
      is_tuan: that.data.infoData.business_discount[0].is_tuan,
    }
    wx.showModal({
      title: "",
      content: "确定兑换吗？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在加载...',
          })
          common.get("/business/create_community_market_discount_order", p).then(res => {
            wx.hideLoading();
            if (res.data.code == 200) {
              if (res.data.data != '') {
                console.log('有支付签名')
                var $config = res.data.data
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
                    that.setData({
                      is_communityInfo: false,
                      shopList:[],
                      page:1,
                    })
                    that.getActivityWelfare();
                    that.saveAddress();
                  },
                  fail: function (e) {
                    console.log(e)
                    wx.showToast({
                      title: '支付失败！',
                      duration: 1000,
                      icon: 'none'
                    })
                    that.setData({
                      is_communityInfo: false,
                    })
                    return;
                  }
                });
              } else {
                console.log('没有支付签名')
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'success'
                })
                that.setData({
                  is_communityInfo: false,
                })
                that.getActivityWelfare();
                that.saveAddress();
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
            wx.hideLoading();
            console.log(e)
          })
          
        }
      }
    })
  },
  // 获取买家信息
  getBuyInfo(){
    let that = this;
    common.get("/business/getMemberFreightAddress", { "member_id": wx.getStorageSync('member_id') }).then( res => {
      if (res.data.code == 200 && res.data.data.length > 0) {
        let buyer_address =  res.data.data[0];
        that.setData({
          buyer_address,
          user_name: buyer_address.name,
          user_tel: buyer_address.phone,
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  // 设置买家信息
  saveAddress() {
    let that = this;
    let params = {
      "member_id": wx.getStorageSync('member_id'),
      "name": that.data.user_name,
      "phone": that.data.user_tel,
      "address": '',
      "type": 1
    }
    if (!params.phone) {
      wx.showToast({
        "title": "联系方式不能为空！",
        "icon": "none"
      })
      return
    }

    if (!params.name) {
      wx.showToast({
        "title": "请填写姓名！",
        "icon": "none"
      })
      return
    }
    common.get("/business/memberFreightAddress", params).then( res => {
    }).catch( error => {
      console.log(error);
    })
  },
  // =================== 以上社区大集相关功能 ↑ ===================

})