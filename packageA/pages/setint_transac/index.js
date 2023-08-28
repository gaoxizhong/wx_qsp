const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good_seld:'',
    integral:'',
    value_input:'',
    realAmount:'',
    transac_mark:false,
    phone:'',
    danjia:0,
    total_price:0,
    quan_number:0,
    is_request: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    let zhuan_dingwei = wx.getStorageSync('zhuan_dingwei');
    that.setData({
      realAmount:options.realAmount,
      danjia: options.danjia
    })
    common.get("/content_personal/phone",{
      member_id:wx.getStorageSync('member_id')
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          phone:res.data.data
        })
      }else{
        that.setData({
          phone:''
        })
      }
    }).catch(e =>{
      console.log(e)
    })
    // 禁止右上角转发
    wx.hideShareMenu();
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
      that.setData({
        value_input:'',
      })
    let index = e.currentTarget.dataset.index;
    let integral= Number(e.currentTarget.dataset.integral); 
    let danjia = that.data.danjia;
    if(integral > realAmount){
      wx.showToast({
        title: '超出可用积分！',
        icon:'none'
      })
      return
    }
    that.setData({
      good_seld:index,
      integral,
      total_price:(integral*danjia).toFixed(2),
      quan_number:(integral/5).toFixed(0)
    })
  },
  save_input_num(e) {
    let that = this;
    let realAmount = Number(that.data.realAmount);
    let integral = Number(e.detail.value);
    let danjia = that.data.danjia;
    if(integral > realAmount){
      wx.showToast({
        title: '超出可用积分！',
        icon:'none'
      })
      that.setData({
        value_input:'',
        integral:'',
        total_price:0,
        quan_number:0
      })
      return
    }
    if(integral >= 10000){
      wx.showToast({
        title: '最高可设置10000积分！',
        icon:'none'
      })
      that.setData({
        value_input:10000,
        integral:10000,
      })
      return
    }
    that.setData({
      integral,
      total_price:(integral*danjia).toFixed(2),
      quan_number:(integral/5).toFixed(0)

    })
   
  },
  que_btn(){
    let that = this;
    let integral = Number(that.data.integral);
    if(integral<5 ){
      wx.showToast({
        title: '最小设置5积分！',
        icon:'none'
      })
      return
    }
    that.setData({
      transac_mark:true
    })
  },
  setphone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  transac_inpbtn(){
    let that = this;
    let phone = that.data.phone;
    if(phone != ''){
      if (!(/^1[345678]\d{9}$/.test(phone))) {
        wx.showToast({
          title: '请输入正确的电话号码！',
          icon: 'none',
        })
        return
      }
    }
    let integral = Number(that.data.integral);
    let member_id = wx.getStorageSync('member_id');
    let is_request = that.data.is_request;
    if(!is_request){
      return
    }
    that.setData({
      is_request:false
    })
    common.get("/content_personal/add_integral",{
      lng:that.data.longitude,
      lat: that.data.latitude,
      member_id,
      integral,
      mobile:phone,
    }).then(res =>{
      if(res.data.code == 200){
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          success (res) { 
            console.log('订阅消息 成功 ');
            console.log(res);
            wx.reLaunch({
              url: '/packageA/pages/intsubmit_success/index',
            })
            that.setData({
              transac_mark:false,
            })
          },
          fail (er){
            console.log("订阅消息 失败 ");
            console.log(er);
          }
        }) 
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          is_request: true
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e,
        icon:'none'
      })
      that.setData({
        is_request: true
      })
    })
    
  },
  transac_mark(){
    this.setData({
      transac_mark:false
    })
  }
})