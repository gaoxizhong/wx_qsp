const common = require("../../../../assets/js/common");
const publicMethod = require('../../../../assets/js/publicMethod');
var WxParse = require('../../../../wxParse/wxParse.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yhj:0.00,  // 优惠价
    detail:'',
    image_detail:'',
    notice:'',
    p_id:'',
    nav_id:1,
    project:{},
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      p_id:options.p_id
    })
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
    this.getprojectList();
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
  swichNav(e){
    console.log(e)
    let nav_id = e.currentTarget.dataset.nav_id;
    this.setData({
      nav_id
    })
  },
  // 点击购买
  clickBuy(){
    let that = this;
    let id = that.data.project.id;
    let url = '/packageB/pages/livingHall/projectOrderPage/index?p_id=' + id;
    wx.navigateTo({
      url
    })
    return
  },
  getprojectList(){
    let that = this;
    common.get('/life/index?op=project',{
      p_id: that.data.p_id,
    }).then(res =>{
      if(res.data.code == 200){
        let detail = res.data.data.project.detail?res.data.data.project.detail:'';  // 详情
        let image_detail = res.data.data.project.image_detail?res.data.data.project.image_detail:''; // 图文详情
        let notice = res.data.data.project.notice?res.data.data.project.notice:''; // 购买须知
        let yhj = ( Number(res.data.data.project.project_price)-Number(res.data.data.project.price) ).toFixed(2);
        that.setData({
          project: res.data.data.project,
          yhj,
          detail,
          image_detail,
          notice
        })
        console.log(that.data.image_detail)
        WxParse.wxParse('detail', 'html', detail, that, 1);
        WxParse.wxParse('image_detail', 'html', image_detail, that, 1);
        WxParse.wxParse('notice', 'html', notice, that, 1);
        console.log(that.data.image_detail)

      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  }
})