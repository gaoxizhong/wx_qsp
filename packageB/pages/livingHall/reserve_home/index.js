const common = require("../../../../assets/js/common");
const publicMethod = require('../../../../assets/js/publicMethod');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectList:[], // 项目列表
    projectID:null,
    page: 1,
    imageList:[
      "https://oss.qingshanpai.com/dtshg/shg_1.jpg",
      "https://oss.qingshanpai.com/dtshg/shg_2.jpg",
      "https://oss.qingshanpai.com/dtshg/shg_3.jpg",
      "https://oss.qingshanpai.com/dtshg/shg_4.jpg",
      "https://oss.qingshanpai.com/dtshg/shg_5.jpg",
      "https://oss.qingshanpai.com/dtshg/shg_6.jpg"
    ],
    swiper_shop:false,
    swiper_index:0,
    top_img:[],
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
    this.setData({
      projectID: this.selectComponent("#projectID")
    })
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
    let that = this;
    that.data.projectID.getprojectList();
    setTimeout(function(){
    wx.stopPullDownRefresh()
    },1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 点击预约到店
  gotoChooseTime(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/reserve_chooseTime/index',
    })
  },

  //查询路线
  getRoadLine(e) {
    let that = this;
    console.log(e);
    wx.getLocation({
      type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
      isHighAccuracy: true,
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        wx.openLocation({   
          latitude: Number(40.052341),
          longitude:Number(116.422806),
          name: '青山生态生活馆',
          address: '朝阳区城建N次方底商西09',
          scale: 18
        })
      }
    })
  },
  // 点击轮播图
  previewImage1(e) {
    let that = this;
    console.log(e)
    let swiper_index = e.currentTarget.dataset.subidx;
    that.setData({
      top_img:e.currentTarget.dataset.images,
      swiper_index,
      swiper_shop:true
    })
  },
  close_swiper(){
    let that = this;
    that.setData({
      top_img:[],
      swiper_shop:false
    })
  },
})