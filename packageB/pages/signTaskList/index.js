const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more_integral:[], // 积分任务列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.is_comtype == 'qhysq' ) {
      wx.setNavigationBarTitle({
        title:'清河营中路低碳社区'
      })
    }
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
    this.goToaddintegral(); // 积分任务列表
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
  // 获取赚更多积分任务列表
  goToaddintegral(){
    let that = this;
      common.get('/environmental/bank/get_more_integral',{
        member_id:wx.getStorageSync('member_id')
      }).then( res => {
        if (res.data.ret == 0){
          that.setData({
            more_integral:res.data.data,
          })
        }else if(res.data.ret == 201){
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(e =>{
        console.log(e)
        wx.showToast({
          title: e.data.msg,
          icon:'none'
        })
      })
  },
  goTotask(e){
    let that = this;
    console.log(e)
    let type = e.currentTarget.dataset.type; 
    let task_id = e.currentTarget.dataset.task_id; 
    let jifen = e.currentTarget.dataset.jifen; 
    let url = e.currentTarget.dataset.url;
    if(url.indexOf("?") != -1){
      url = e.currentTarget.dataset.url + 'member_id=' + wx.getStorageSync('member_id') +'&task_id=' + task_id + '&jifen=' + jifen + '&is_Signtask=1';
    }else{
      url = e.currentTarget.dataset.url + '?member_id=' + wx.getStorageSync('member_id') +'&task_id=' + task_id + '&jifen=' + jifen + '&is_Signtask=1';
    }
    if(type == 1){
      wx.reLaunch({
        url: url,
      })
    }else if(type == 2){
      wx.navigateTo({
        url: url,
      })
    }
  },
  goTotask1(e){
    let that = this;
    let type = e.currentTarget.dataset.type; 
    let url = e.currentTarget.dataset.url;
    if(url.indexOf("?") != -1){
      url = e.currentTarget.dataset.url + 'member_id=' + wx.getStorageSync('member_id');
    }else{
      url = e.currentTarget.dataset.url + '?member_id=' + wx.getStorageSync('member_id');
    }
    if(type == 1){
      wx.reLaunch({
        url: url,
      })
    }else if(type == 2){
      wx.navigateTo({
        url: url,
      })
    }
  },
})