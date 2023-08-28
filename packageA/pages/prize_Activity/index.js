const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    prize_info:{},
    img:[],
    desc: "一分点赞，一份爱；一分钱公益活动开始了！参加本期活动，分享打动人心的故事并收集点赞，超多集赞更有机会获得今日榜单礼品。每份赞都饱含着平台对他们一分钱的帮助，还在等什么？多多分享，多多点赞，让爱传递起来吧！"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let prize_info = app.globalData.apenny_prizedata;
    let img = [];
    img.push(prize_info.prize_pic)
    that.setData({
      prize_info,
      img,
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
  getprizeActivity(){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.get('',{
      id: that.data.id
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){

      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  turnto() {
    wx.navigateBack({delta: -1});
  },
})