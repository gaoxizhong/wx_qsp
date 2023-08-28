const app = getApp();
const common = require('../../../../assets/js/common');
var WxParse = require('../../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList:[],
    can_dh:false,
    count:0,
    config_count: 0,
    config_notice:'',
    time_place:'',
    mobile:'',
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
    that.getgiftList();
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
  getgiftList(){
    let that = this;
    common.get('/olympic/index?op=gift_list',{member_id:wx.getStorageSync('member_id')}).then(res =>{
      if(res.data.code == 200){
        let config_notice =  res.data.data.config_notice;
        WxParse.wxParse('config_notice', 'html', config_notice, that, 1);


        that.setData({
          count: res.data.data.count,
          can_dh: res.data.data.can_dh,
          config_count: res.data.data.config_count,
          giftList: res.data.data.list,
          time_place:res.data.data.time_place?res.data.data.time_place:'',
          mobile:res.data.data.mobile?res.data.data.mobile:'',
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
  // 点击核销
  writeClick(e){
    let that = this;
    console.log(e)
    common.post('/olympic/index?op=get_gift',{
      gift:e.currentTarget.dataset.gift,
      member_id: wx.getStorageSync('member_id')
    }).then( res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '核销成功！',
          icon:'none'
        })
        setTimeout(() => {
          that.getgiftList();
        }, 1500);
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
  /**调用电话 */
  tel: function (e) {
    let tel = e.currentTarget.dataset.mobile;
    if (tel != null || tel != '') {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    } else {
      app.showToast({
        title: "暂无联系电话"
      })
    }
  },
})