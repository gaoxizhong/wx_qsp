const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_illustrate: false,
    money: 0,
    debug_submit: true
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
   // 可提现金额
   this.tx_jine();
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
  // 收入明细
  goto_s_etails(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_incomeBreakdown/index?tab=1',
    })
  },
  // 提现明细
  goto_s_etails1(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_incomeBreakdown/index?tab=2',
    })
  },
  catchtouchmove(){
    return false
  },
  openIllustrate(){
    this.setData({
      is_illustrate:true
    })
  },
  infoTextBtn(){
    this.setData({
      is_illustrate:false
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
              // latitude: that.data.latitude,
              // longitude: that.data.longitude,
            }).then(res => {
              console.log(res)
              if (res.data.code == 200) {
                wx.hideLoading();
                wx.showToast({
                  title: '提交审核成功！',
                  icon: 'none',
                  duration: 1500,
                })
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1,
                  })
                },1000)
  
              } else {
                wx.hideLoading();
  
                wx.showToast({
                  title: res.data.msg,
                  icon:'none'
                })
                that.setData({
                  debug_submit:true
                })
              }
            }).catch(e => {
              wx.hideLoading();
              wx.showToast({
                title: e.data.msg,
                icon:'none'
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

})