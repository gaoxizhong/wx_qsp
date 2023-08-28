// packageB/pages/livingHall/reserve_buypages/index.js
const app = getApp()
const common = require('../../../../assets/js/common');
var WxParse = require('../../../../wxParse/wxParse.js');
const setting = require('../../../../assets/js/setting');
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work_id:'',
    goodsInfo:{},
    total_price:0,
    contact_phone:'',
    contact_name:'',
    contact_area:'',
    inv_member_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      work_id: options.id
    })
    if(options.inv_member_id){
      this.setData({
        inv_member_id: options.inv_member_id
      })
    }
    this.getgoodsInfo();
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
    this.getmy_space();
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
  // 商品信息
  getgoodsInfo(){
    let that = this;
    common.get('/life/index?op=work_detail',{
      work_id: that.data.work_id,
    }).then(res =>{
      if(res.data.code == 200){
        let goodsInfo = res.data.data.work;
        that.setData({
          goodsInfo,
          total_price: ( Number(goodsInfo.price) + Number(goodsInfo.parcel_price) ).toFixed(2)
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
  },

  // 购买
  create_order(){
    let that = this;
    if(!that.data.contact_name || !that.data.contact_phone || !that.data.contact_area){
      wx.showToast({
        title: '请先填写个人信息！',
        icon:'none'
      })
      return
    } 
    let p = {
      member_id: wx.getStorageSync('member_id'),
      work_id: that.data.work_id,
      express_way: '2',
      express_member: that.data.contact_name,
      express_mobile: that.data.contact_phone,
      express_address: that.data.contact_area
    };
    let inv_member_id = that.data.inv_member_id;
    if(inv_member_id){
      p.inv_member_id = inv_member_id;
    }
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=create_order',p).then( res=> {
      wx.hideLoading();
      if (res.data.code == 200) {
        var $config = res.data.data;
        wx.requestPayment({
          timeStamp: $config['timeStamp'], //注意 timeStamp 的格式
          nonceStr: $config['nonceStr'],
          package: $config['package'],
          signType: $config['signType'],
          paySign: $config['paySign'], // 支付签名
          success: function (res) {
            // 支付成功后的回调函数
            setTimeout(function () {
              wx.reLaunch({
                url: '/packageB/pages/livingHall/reserve_success/index?is_shang=1&is_buy=1'
              })
            }, 1500)

          },
          fail: function (e) {
            console.log(e)
            wx.showToast({
              title: '支付失败！',
              duration: 1000,
              icon: 'none'
            })
            return;
          }
        });
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }).catch( error=> {
      console.log(error);
      wx.hideLoading();
      wx.showToast({
        title: error.data.message,
        icon:'none'
      })
    })
  },
  //查看我的信息
  getmy_space(){
    let that = this;
    common.get('/life/index?op=my_space',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let space = res.data.data.space;
        that.setData({
          contact_name: space.name?space.name:'',
          contact_phone: space.mobile?space.mobile:'',
          garden: space.garden?space.garden:'',
          contact_area : space.address?space.address:'',
        })
      }else{

      }
    }).catch( e =>{
      console.log(e)
    })
  },
  openEdit(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/membership_add/index?is_xiu=1',
    })
  },
})