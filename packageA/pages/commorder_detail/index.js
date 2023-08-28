const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    id:'',
    discount_order_tid:'',
    result:{},
    res_info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      id: options.id,
      discount_order_tid: options.discount_order_tid,
      type: options.type,
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
    this.getorder_detail();
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
  getorder_detail(){
    let that = this;
    common.get('/member/order_details',{
      id: that.data.id,
      discount_order_tid: that.data.discount_order_tid,
    }).then(res =>{
      if(res.data.code == 200){
        let res_info = res.data.data.res;
        if(res_info.length == 0){
          res_info = ''
        }else{
          res_info = res_info[res_info.length-1].AcceptStation
        }
        that.setData({
          res_info,
          result: res.data.data.result,
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
  // 查看物流
  viewLogistics(e){
    console.log(e)
    let that = this;
    let discount_order_tid = e.currentTarget.dataset.discount_order_tid;
    let order_tid = e.currentTarget.dataset.id;
    let in_stock = e.currentTarget.dataset.in_stock;

    let url = "/pages/viewLogistics/viewLogistics?discount_order_tid=" + discount_order_tid + "&order_tid=" + order_tid + "&in_stock=" + in_stock;
    wx.navigateTo({
      url: url,
    })

  },
  obtainCall(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
})