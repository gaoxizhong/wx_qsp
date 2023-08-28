const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    library_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      library_id:options.library_id,
      member_id:wx.getStorageSync('member_id'),

    })
    this.get_seedata();
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
  get_seedata(){
    let that = this;
    common.get('/library/get_library_seedata',{
      library_id:that.data.library_id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          library_see_list:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  goTosee_lidrary(e){
    console.log(e)
    let member_library_id = e.currentTarget.dataset.member_library_id;
    if(member_library_id > 0){
      let url = "/packageA/pages/library/personal_index/personal_index?library_id=" + member_library_id 
      wx.navigateTo({
        url: url
      })
    }else{
      wx.showToast({
        title: '对方暂无图书馆！',
        icon:'none'
      })
      return

    }
  }

})