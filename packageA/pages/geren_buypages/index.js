const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good_seld:'',
    realAmount:'',
    member_id:'',
    id:'',
    dess:true,
    price:0,
    total_price:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    let zhuan_dingwei = wx.getStorageSync('zhuan_dingwei');
    console.log(zhuan_dingwei)
    that.setData({
      realAmount:options.integral,
      member_id: wx.getStorageSync('member_id'),
      view_member_id: options.member_id,
      id: options.id,
      price: options.price,
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
  // 活动数量列表点击事件
  changere(e){
    let that = this;
    let realAmount = Number(that.data.realAmount);
    let price = that.data.price;
    let index = e.currentTarget.dataset.index;
    let integral= Number(e.currentTarget.dataset.integral); 
    that.setData({
      value_input:'',
    })
    if(integral > realAmount){
      wx.showToast({
        title: '超出可购买积分！',
        icon:'none'
      })
      return
    }
    that.setData({
      good_seld:index,
      integral,
      total_price: integral*price
    })
  },
  save_input_num(e) {
    let that = this;
    let price = that.data.price;
    let realAmount = Number(that.data.realAmount);
    let integral = Number(e.detail.value);
    if(integral > realAmount){
      wx.showToast({
        title: '超出可购买积分！',
        icon:'none'
      })
      that.setData({
        value_input:'',
        integral:0,
        total_price:0
      })
      return
    }
    that.setData({
      integral,
      total_price: integral*price
    })
   
  },
  que_btn(){
    let that = this;
    let integral = Number(that.data.integral);
    let total_price = that.data.total_price;
    if(integral<5){
      wx.showToast({
        title: '最低购买5积分！',
        icon:'none'
      })
      return
    }
    let dess = that.data.dess;
    if(!dess){
      wx.showToast({
        title: '请勿重复提交！',
        icon:'none'
      })
      return
    }
    that.setData({
      dess:false
    })
    common.post("/content_personal/pay_personal_integral",{
      member_id: that.data.view_member_id,
      pay_member_id: wx.getStorageSync('member_id'),
      integral,
      total_price
    }).then(res =>{
      if(res.data.code == 200){
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
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/packageA/pages/geren_buysuccess/index',
                  })
                }, 1000)
                return;
              },
              fail: function (e) {
                console.log(e)
                wx.showToast({
                  title: '支付失败！',
                  duration: 1000,
                  icon: 'none'
                })
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/packageA/pages/geren_buysuccess/index',
                  })
                }, 1000)
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
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          dess:true
        })
      }
    }).catch(e =>{
      that.setData({
        dess:true
      })
      console.log(e)
    })
  },


})