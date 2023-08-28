const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getexchangeList();
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
  getexchangeList(){
    let that =this;
    common.get("/topic/my_gift",{
      member_id:wx.getStorageSync('member_id'),
    }).then( res =>{
      if(res.data.code == 200){
        that.setData({
          exchangeList: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e=>{
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })
    })
  },
  write_btn(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      cancelColor: '#666',
      content:'确定核销吗？',
      confirmText:'确定',
      cancelText:'取消',
      success (res) {
        if(res.confirm){
          common.post("/topic/check_gift",{
            id,
            member_id:wx.getStorageSync('member_id'),
          }).then( res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '核销成功',
                icon:'success'
              })
              setTimeout(function() {
                that.getexchangeList();
              },1000)
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          }).catch(e=>{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          })
        }else{

        }
      }
    })
  },
})