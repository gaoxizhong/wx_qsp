const app = getApp()
const common = require('../../../assets/js/common');
var WxParse = require('../../../wxParse/wxParse.js');
const publicMethod = require('../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    poster_tabs:[],
    swiper_index:1,
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    canIUseGetUserProfile: false,
    be_assistant:'',
    topic_status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    that.setData({
      id: options.id,
      name: options.name,
      paper_id: options.paper_id
    })
    publicMethod.zhuan_baidu(this);
    // 禁止右上角转发
    // wx.hideShareMenu();
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
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      member_id,
    })
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        pop2: false,
      })
    }
    that.getdetails();
    that.getinfo();
    // that.my_share();
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
    let that = this;
    // let img = content.images[0].url;
    var url = '/packageA/pages/cloudSchool_pages/index?id=' + id + '&name='+ that.data.name + '&paper_id='+ that.data.paper_id
    return{
      title:'宣传调研！',
      path: url,
      imageUrl: '',
      success: function(res) {
        // 转发成功
        that.submit_btn(id);
       console.log('转发成功1')
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
    // 获取详情信息
    getdetails() { 
      let that = this
      common.get('/activity/detail', {
        member_id: wx.getStorageSync('member_id'),
        id: that.data.id
      }).then(res => {
        if (res.data.code == 200) {
          let article = res.data.data.detail;
          let details_info = res.data.data;
          let activity_tips = res.data.data.activity_tips;
  
          WxParse.wxParse('article', 'html', article, that, 1);
          WxParse.wxParse('activity_tips', 'html', activity_tips, that, 1);
          that.setData({
            details_info,
            topic_status: res.data.data.topic_status,
            poster_tabs: details_info.image,
          })
        }
      }).catch(e => {
        app.showToast({
          title: "数据异常"
        })
      })
    },
    // gototeaching(){
    //   wx.navigateTo({
    //     url: '/packageA/pages/teaching_pages/index?paper_id=' + this.data.details_info.paper_id + '&activity_id='  + this.data.id,
    //   })
    //   return
    // },
    gototeaching(){
      let that = this;
      common.post("/activity/be_assistant",{
        member_id: wx.getStorageSync('member_id'),
        activity_id: that.data.id,
        paper_id: that.data.paper_id,
        is_create: 1,
      }).then(res =>{
        if(res.data.code == 200){
          wx.showToast({
            title: '申请成功！',
            icon:'none'
          })
          let assistant_id = res.data.data.id
          setTimeout(function(){
            wx.navigateTo({
              url: '/packageA/pages/teaching_test/index?paper_id='+ that.data.paper_id + '&activity_id=' + that.data.activity_id + '&assistant_id=' + assistant_id,
            })
          },1500)
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
    gotodati(){
      wx.navigateTo({
        url: '/packageA/pages/cloud_answer/index?paper_id=' + this.data.details_info.paper_id,
      })
      return
    },
    gotozujiao(){
      wx.navigateTo({
        url: '/packageA/pages/assistant_info/index?paper_id=' + this.data.details_info.paper_id + '&activity_id='  + this.data.id,
      })
      return
    },
    // 查看助教信息
    getinfo(){
      let that = this;
      common.post("/activity/be_assistant",{
        member_id: wx.getStorageSync('member_id'),
        activity_id: that.data.id,
        paper_id: that.data.paper_id,
        is_create: 0,
      }).then(res =>{
        if(res.data.code == 200){
          console.log(res.data.data)
          that.setData({
            be_assistant: res.data.data
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
    gotoAnswer(){
      wx.navigateTo({
        url: '/packageA/pages/cloudFraction_pages/index?paper_id=' + this.data.paper_id + '&activity_id=' +  this.data.id,
      })
    },
})