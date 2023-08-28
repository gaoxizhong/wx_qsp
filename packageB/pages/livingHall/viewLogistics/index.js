const common = require("../../../../assets/js/common");
const publicMethod = require('../../../../assets/js/publicMethod');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:0,
    traces:[],  // 快递位置
    shipperCode:"",  //快递公司
    logisticCode: 0, //快递单号
    in_stock: false,
    is_nokd:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if (options.order_id) {
      that.setData({
        order_id: options.order_id,
      })
    }
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
    that.setData({
      dataStatus: false,
    })
    that.getData();
  },
getData(){
  let that = this;
  that.getLogistics();
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
  getLogistics(){
    let that = this;
    let order_id= that.data.order_id;
     common.get("/life/index?op=express",{
      order_id
    }).then(res =>{
      if (res.data.State != 0){
        that.setData({
          traces: res.data.Traces.reverse(),  // 快递位置.reverse()数组颠倒
          shipperCode: res.data.ShipperCode,  //快递公司
          logisticCode: res.data.LogisticCode, //快递单号
        })
        if (traces.length <= 0) {
          setTimeout(function () {
            that.setData({
              dataStatus: true
            })
          }, 500)
        }
      } else if (res.data.State == 0) {
        that.setData({
          logisticCode: res.data.LogisticCode,
          is_nokd: '1',
          dataStatus: true
        })
        // wx.showToast({
        //   title: res.data.Reason,
        //   icon: 'none',
        // })
      } else {
        wx.showToast({
          title: res.data.Reason,
          icon: 'none',
          success: function () {
            setTimeout(function () {
              wx.navigateBack({ delta: -1 });
            }, 2500)
          }
        })
      }
      }).catch(e => {
       
      })
  }
})