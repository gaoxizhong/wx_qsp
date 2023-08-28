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
    content_count: 0, // 会员打卡次数
    count:0,
    config_count: 0,
    punch_in_rule:'',
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
    // 获取奖品列表
    that.getGoods();
    //获取会员打卡次数
    that.getPunchCount();
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
  //获取会员打卡次数
  getPunchCount(){
    let that = this;
    common.get('/long_march_roule/get_punch_in_count/' + wx.getStorageSync('member_id'),{
    }).then(res =>{
      that.setData({
        content_count: res.data.data.count
      })
    }).catch(e =>{
      console.log(e)
    })
  },
  // 获取规则信息
  getgiftList(){
    let that = this;
    common.get('/long_march_roule/get_warde_rule',{}).then(res =>{
      if(res.data.code == 200){
        let punch_in_rule =  res.data.data.punch_in_rule;
        WxParse.wxParse('punch_in_rule', 'html', punch_in_rule, that, 1);
        that.setData({
          count: res.data.data.count,
          punch_in_num: res.data.data.punch_in_num, // 兑换商品打卡次数
          time_place:res.data.data.time_place?res.data.data.time_place:'',
          mobile:res.data.data.mobile?res.data.data.mobile:'',   // 联系电话
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
  getGoods(){
    let that = this;
    common.get('/long_march_roule/get_reward_goods',{}).then(res =>{
      if(res.data.code == 200){
        that.setData({
          giftList: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:"none"
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
    common.post('/long_march_roule/exchange_reward_goods',{
      member_id: wx.getStorageSync('member_id'), 
      reward_goods_id:e.currentTarget.dataset.id, //兑换商品ID
      exchange_num:1,  //兑换数量(默认1)
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
          title: res.data.message,
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