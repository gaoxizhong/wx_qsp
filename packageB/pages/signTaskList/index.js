const app = getApp();
const common = require('../../../assets/js/common');
let videoAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    more_integral:[], // 积分任务列表
    ad_num: 20, // 看广告获取积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.is_comtype == 'qhysq' ) {
      wx.setNavigationBarTitle({
        title:'清河营中路低碳社区'
      })
    }
      // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-f6ea451e26a50fda'
      })
      videoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
        
          common.get('/mine/index?op=ad_point',{
            member_id: wx.getStorageSync('member_id'),
            point: that.data.ad_num, // 积分
          }).then(res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '获取' + that.data.ad_num + '积分成功！',
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none',
              })
            }
          }).catch(e=>{
            console.log(e)
          })
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '中途退出，未获取积分',
            icon:'none'
          })
        }
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
  goToGg(){
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
        .then(() => videoAd.show())
        .catch(err => {
          console.log('激励视频 广告显示失败')
          wx.showToast({
            title: '激励视频 广告显示失败',
            icon:'none'
          })
        })
      })
    }
  }
})