const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    their_story:[],
    theirFull:[],
    circle_page:1,
    open_active:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHelist();
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
    this.getPennyinfo();
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
    // 他们的故事列表
    getHelist() { 
      let that = this;
      wx.showLoading({
        title: '加载中...',
      })
      common.get('/public_welfare/storyList', {
        member_id: wx.getStorageSync('member_id'),
        page: that.data.circle_page,
      }).then(res => {
        wx.hideLoading();
        let their_story = res.data.data.storyList;
        for (var i = 0; i < their_story.length; i++) {
          let obj = {}
          obj.leng = their_story[i].content.length
          obj.status = false
          that.data.theirFull.push(obj)
        }
        that.setData({
          theirFull: that.data.theirFull,
          their_story,
          their_id: their_story[0].id
        })
      }).catch(e => {
        wx.hideLoading();
        console.log(e)
      })
    },
    signActivityBtn(){
      let that = this;
      setTimeout(function(){
        wx.navigateTo({
          url: '/packageA/pages/choosedynamic/index',
        })
      },2000)
    },
    getPennyinfo(){
      let that = this;
      common.get('/public_welfare/index',{
        member_id: wx.getStorageSync('member_id')
      }).then(res =>{
        if(res.data.code == 200){
          let open_active = res.data.data.open_active;
          that.setData({
            open_active,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e =>{
        console.log(e)
      })
    },
       //打开他们的故事全文
  openFulltxt1(e) {
    publicMethod.openFulltxt1(e, this)
  },
})