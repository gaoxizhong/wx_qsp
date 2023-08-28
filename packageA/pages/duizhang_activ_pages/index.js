const app = getApp();
const common = require('../../../assets/js/common');
var WxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: ''
      }]
    }],
    volunacti_list: [],
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1)
    this.getList();
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
    // 获取活动信息
    getList() { 
      let that = this
      common.get('/activity/index', {
        has_goods:'1',
        member_id: wx.getStorageSync('member_id'),
      }).then(res => {
        if (res.data.code == 200) {
          let article = res.data.data.share_notice;
          let array = res.data.data.array[3];
          array.forEach(ele =>{
            ele.checked = false
          })
          let nav_choose = [];
          WxParse.wxParse('article', 'html', article, that, 1);
          that.setData({
            volunacti_list:array,
            nav_choose,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(e => {
        app.showToast({
          title: "数据异常"
        })
      })
    },
    radioChange(e) {
      console.log(e)
  
      const volunacti_list = this.data.volunacti_list;
      for (let i = 0, len = volunacti_list.length; i < len; ++i) {
        volunacti_list[i].checked = volunacti_list[i].id === e.currentTarget.dataset.id
      }
  
      this.setData({
        volunacti_list,
        id:e.currentTarget.dataset.id
      })
    },
    confirm_btn(){
      let that = this;
      let volunacti_list = that.data.volunacti_list;
      console.log(volunacti_list)
      let id = '';
      let name = '';
      volunacti_list.forEach(ele =>{
        if(ele.checked){
          id = ele.id;
          name = ele.name
        }
      })
      if(id == ''){
        wx.showToast({
          title: '请选择一个活动！',
          icon: 'none'
        })
        return
      }
      wx.showLoading({
        title: '发起中...',
        icon: 'none'
      })
      common.get('/activity/share',{
        member_id: wx.getStorageSync('member_id'),
        activity_id: id
      }).then(res =>{
        wx.hideLoading();
        if(res.data.code == 200){
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
          setTimeout(function(){
            wx.navigateTo({
              url: '/packageA/pages/home_page/volunacti_details/index?id=' + id + '&name='+ name + '&is_duizhang=1',
            })
          },1500)
        }else{
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
        }
      }).catch(e =>{
        wx.hideLoading();
        console.log(e)
      })

    }
})