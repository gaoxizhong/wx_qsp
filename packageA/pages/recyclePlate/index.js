const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number_r: 0,
    is_true:false,
    latitude: '',
    longitude: '',
    number_r: 0,
    is_goToSign:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      number_r:Math.floor(Math.random()*10000),
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this,this.data.longitude,this.data.latitude);
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
    that.getData();
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
  getData() { //初始化数据
    let that = this;
    that.getClassmodule();

    //全局配置
  },
  getClassmodule(){
    let that = this;
    common.get('/newhome/index',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200) {
        that.setData({
          is_true:res.data.data.is_true,
        })
      }
    })
  
  },
  gotolottery(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  // 每日签到
  goToSign(){
    publicMethod.goToSign(this,this.data.longitude,this.data.latitude);
  },
  goTobank(){
    publicMethod.goTobank();
  },
  click_bg(){
    this.setData({
      is_preview:false
    })
  },
  // =================== 新增 ===================
  goto_adshop(e){
    publicMethod.goto_adshop(e,this);
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // =================== 新增 ===================
})