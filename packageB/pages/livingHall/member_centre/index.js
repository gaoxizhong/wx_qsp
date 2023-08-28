const common = require("../../../../assets/js/common");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getmy_space:{},
    space:{}, // 会员信息
    card:{},
    voucher_sum:0.00, // 优惠券总钱数
    voucher_s:0, // 优惠券总个数
    is_vip: false,
    money: 0, // 可提现余额
    today_sale: 0, // 今日卖出
    today_money: 0, // 今日收益
    my_coin: 0, // 余额
    today_count: 0, // 今日收获赞
    yestoday_count: 0, // 昨日收获赞
    today_m: 0, // 今日可兑换钱
    no_exchange_sale: 0, // 分享付款单数
    sale_num: 0, // 分享付款单数- 可兑换钱数
    all_card_num:0, // 我可使用的次数 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
    that.getmy_space();
    // 可提现金额
    that.tx_jine();
    // 获取点赞信息
    that.getCodeSession();
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
  
  click_mybuy(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    })
  },
  // 会员权益
  memberBenefits(e){
    let url = e.currentTarget.dataset.url;
    let is_vip = this.data.is_vip;
    let is_rt = e.currentTarget.dataset.is_rt;
    if(!is_vip){
      wx.showToast({
        title: '申请开通会员权益！',
        icon:'none'
      })
      return
    }
    if(is_rt == '1'){
      wx.showToast({
        title: '敬请期待！',
        icon:'none'
      })
      return
    }
    
    wx.navigateTo({
      url,
    })
  },
  goToMemberPages(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/membership_open/index',
    })
  },
  click_mybalance(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    })
  },
  // 点击我的内按钮
  click_my(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    })
  },
  // 点击我购买的按钮
  click_mybuyBtn(e){
    let that = this;
    let status = e.currentTarget.dataset.status;
    let express_status = e.currentTarget.dataset.express_status?e.currentTarget.dataset.express_status:'';
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_buyOrder/index?status=' + status + '&express_status=' + express_status + '&dealType=buy',
    })
  },
   //查看我的信息
  getmy_space(){
    let that = this;
    common.get('/life/index?op=my_space',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let getmy_space = res.data.data;
        let space = res.data.data.space;
        let card = res.data.data.card;
        let is_vip = res.data.data.is_vip;
        let voucher_s = res.data.data.voucher.length;
        let voucher_sum = res.data.data.voucher_sum;
        let all_card_num = res.data.data.all_card_num;
        that.setData({
          getmy_space,
          space,
          card,
          is_vip,
          voucher_s,
          voucher_sum,
          all_card_num
        })
      }else{

      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 点击我发布的
  gotoPersonalHome(){
    let is_vip = this.data.is_vip;
    if(!is_vip){
      wx.showToast({
        title: '暂无权限！',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageB/pages/livingHall/personal_home/index?mid=' + wx.getStorageSync('member_id'),
    })
  },
  // 点击我卖出的
  goToSell(){
    let is_vip = this.data.is_vip;
    if(!is_vip){
      wx.showToast({
        title: '暂无权限！',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: "/packageB/pages/livingHall/member_buyOrder/index?status=&express_status=&dealType=sell",
    })
  },
    
  goToruten(){
    wx.showToast({
      title: '暂未开放！',
      icon:'none'
    })
    return
  },
    // 获取点赞信息
    getCodeSession(){
      let that = this;
      common.get('/life/index?op=check_num', {
        member_id: wx.getStorageSync('member_id'),
      }).then(res => {
        if (res.data.code == 200) {
          that.setData({
            my_coin: res.data.data.my_coin, // 余额
            today_count: res.data.data.today_count, // 今日收获赞
            today_m:( Number(res.data.data.today_count) * Number(res.data.data.like_scale) * 0.01).toFixed(2), // 收获赞可兑换钱
            yestoday_count: res.data.data.yestoday_count, // 昨日收获赞
            today_sale: res.data.data.today_sale, // 今日卖出
            today_money: res.data.data.today_money, // 今日收益
            no_exchange_sale: res.data.data.no_exchange_sale, // 分享收益
            sale_num:( Number(res.data.data.no_exchange_sale) * Number(res.data.data.share_scale) * 0.01).toFixed(2), // 分享单可兑换钱
          });
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
})