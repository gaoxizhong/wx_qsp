const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
const zhuan_dingwei = require('../../../../assets/js/dingwei.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info_5data: {},
    infoData: [],
    longitude: '',
    latitude: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this;

    that.getlotterylist();

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

  getlotterylist(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get("/lottery/index",{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        let length = res.data.data.list.length;
        let info_5data = res.data.data.list[0];
        let infoData = res.data.data.list.splice(1,length - 1);
        for(var i = 0;i<infoData.length;i++){
          if(i==0){
            if( info_5data.is_kaijiang == true ){
              infoData[0].is_jiesuo = true
            }
            if( info_5data.is_kaijiang == true && infoData[0].is_kaijiang == true ){
              infoData[1].is_jiesuo = true
            }
          }else{
            if( infoData[i].is_kaijiang == true && infoData[i-1].is_kaijiang == true ){
              infoData[i+1].is_jiesuo = true
            }
          }
        }
        that.setData({
          info_5data,
          infoData
        })
        console.log(infoData)
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 赚更多积分
  goTobank(){
    publicMethod.goTobank();
  },
  gotolottery_detail(e){
    let that = this;
    console.log(e)
    let red_id = e.currentTarget.dataset.red_id;
    wx.navigateTo({
      url: '/packageA/pages/lottery_project/lottery_detail/index?red_id=' + red_id ,
    })
  },
  gotoa(){
    // wx.showToast({
    //   title: '暂未解锁！',
    //   icon: 'none'
    // })
    wx.showModal({
      title:'暂未解锁！',
      content:'20元以及更大红包，可以多人一起参与，一起邀请，到达人数，立即开奖！邀请的人越多，中奖概率越大！',
      showCancel:false,
      success(res){
        if(res.confirm){

        }
      }
    })
  },
  goToresults(){
    wx.navigateTo({
      url: '/packageA/pages/lottery_project/lottery_results/index',
    })
  }
})