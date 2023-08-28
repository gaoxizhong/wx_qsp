const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
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
    // ======= 做任务赚积分数据  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title:'绿城•金泰城丽湾'
    })
    that.setData({
      is_comtype: options.is_comtype,
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
  },
  // 积分换书 跳转图书馆
  gotolottery1(){
    wx.navigateTo({
      url: '/packageA/pages/library/index?library_id=754&is_comtype=community',
    })
  },
  // 书换积分 
  gotolottery2(){
    // wx.navigateTo({
    //   url: '/packageA/pages/book_points_class/index?library_id=754&is_comtype=community',
    // })

    this.getlibraryinfo();

  },

  //获取图书馆信息
  getlibraryinfo(){
    let that = this;
    common.get("/library/get_library_info", {
      library_id: 754,
    }).then(res =>{
      if(res.data.code == 0){
        wx.setStorageSync('libraryList_info', res.data.data);
        setTimeout(() =>{
          wx.navigateTo({
            url: '/packageA/pages/submit_library/index?is_comtype=community',
          })
        },1000)
      }else{
        wx.showToast({
          title: res.data.mgs,
          icon:'none'
        })
      }


    }).catch(e =>{

    })
  },


  gotolottery(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

})