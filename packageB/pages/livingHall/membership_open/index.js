const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
var WxParse = require('../../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_type:1, //  1、基础卡； 2、畅玩卡
    cardList:[],
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
    that.get_card_list();
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
  pagesTab(e){
    this.setData({
      card_type: e.currentTarget.dataset.card_type
    })
  },
  hyBtn(e){
    let card_price =  e.currentTarget.dataset.card_price;
    let card_type =  e.currentTarget.dataset.card_type;
    let card_num =  e.currentTarget.dataset.card_num;
    let config_id = e.currentTarget.dataset.config_id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/membership_add/index?card_type=' + card_type + '&config_id='+ config_id + '&card_num='+card_num + '&card_price=' + card_price + '&official_type=1',
    })
  },
  // 可以购买的会员卡列表
  get_card_list(){
    let that = this;
    common.get('/life/index?op=get_card_list',{}).then(res =>{
      if(res.data.code == 200){
        let article = res.data.data.card_config.card_notice2;
        WxParse.wxParse('article', 'html', article, that, 1);
        that.setData({
          card_config:res.data.data.card_config,
          cardList: res.data.data.card_list,
        })
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