const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    branchList:[],
    business_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getbuyintegrallist(that.getbranch_list);
  },
  // 获取店铺id
  getbuyintegrallist(f){
    let that = this;
    common.get('/content/getMemberInfo',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          business_info:res.data.business_info,
        })
        return f(res.data.business_info.id)
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  getbranch_list(b){
    let that = this;
    common.get('/businessbranch/index?op=branch_list',{
      main_store:b,
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          branchList:res.data.data.branch,
        })
      }
    }).catch( e =>{
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

  }
})