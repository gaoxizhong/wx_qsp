const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    selected:0
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
  select_items(e){
    console.log(e)
    this.setData({
      selected: e.currentTarget.dataset.id,
      money: e.currentTarget.dataset.sel_money
    })
  },
  setinput(e){
    console.log(e)
    let that = this;
    let money = e.detail.value;
    that.setData({
      selected:0,
    })
    if(money >= 5999){
      that.setData({
        money: 5999
      })
      retu1rn
    }else{
      that.setData({
        money,
      })
    }
  },
  recharge_btn(){
    let that = this;
    let money = that.data.money;
    console.log(money)
    if(!money || money == '' || money == 0){
      wx.showToast({
        title: '请选择或填写要充值金额',
        icon:'none'
      })
      return
    }
    common.post('/ad/invest',{
      member_id:wx.getStorageSync('member_id'),
      money,
    }).then(res =>{
      if(res.data.code == 200){
        if (res.data.data != '') {
          console.log('有支付签名')
            var $config = res.data.data
            wx.requestPayment({
              timeStamp: $config['timeStamp'],
              nonceStr: $config['nonceStr'],
              package: $config['package'],
              signType: $config['signType'],
              paySign: $config['paySign'],
              success: function (res) {
                wx.showToast({
                  title: '充值成功！',
                  icon:'none',
                  duration:2000
                })
                // 支付成功后的回调函数
                setTimeout(function(){
                  wx.reLaunch({
                    url: '/packageA/pages/merchant_entrance/index',
                  })
                },2000)
                return;
              },
              fail: function (e) {
                console.log(e)
                wx.showToast({
                  title: '支付失败！',
                  duration: 1000,
                  icon: 'none'
                })
                that.setData({
                  is_block:true
                })
                return;
              }
            });
          } else {
            console.log('没有支付签名')
            wx.showToast({
              title: res.data.msg,
              duration: 1000,
              icon: 'none'
            })
          }

      }else{
        wx.showToast({
          title: res.data.mag,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: "010-84672332"
    })
  },
})