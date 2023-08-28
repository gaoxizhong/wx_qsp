const app = getApp()
const common = require('../../assets/js/common');
var WxParse = require('../../wxParse/wxParse.js');
const publicMethod = require('../../assets/js/publicMethod');


Page({
  data: {
    img_url: app.data.imgUrl,
    goodInfo: '',  //福利商品详情
    goodnum: '1',
    total_price:0,
    hbb:0,
    goods_name:''
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
    let param = {
      business_id: options.business_id,
    }
    if (options.goodid) {
      console.log("福利商品id",options.goodid);
      param.discount_id = options.goodid,
      
      that.setData({
        goodnum: options.goodnum
      })
    }

    // common.get("/recover/getGoodsInfo", {"id":options.goodid}).then( res => {
    common.get("/business/getBusinessDiscount", param ).then(res => {  
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          goodInfo: res.data.data[0],
          total_price: res.data.data[0].total_price,
          hbb: res.data.data[0].hbb,
          goods_name: res.data.data[0].title

        })
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1000
        })
        setTimeout(()=>{
          wx.navigateBack(1);
        },1000)
      }
    }).catch( error => {
      console.log(error);
    })
  },
  onShow: function() {
    let member_id = wx.getStorageSync('member_id');
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
    })
  },
  inputValue(e) {
    let that = this;
    if ( e.detail.value > (that.data.goodInfo.stock - 0) ) {
      that.setData({
        goodnum: (that.data.goodInfo.stock - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    } else if (e.detail.value < 1){
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: e.detail.value
      })
    }
  },
  minusNum() {
    let that = this;
    that.data.goodnum --;
    if (that.data.goodnum < 1) {
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  addNum() {
    let that = this;
    that.data.goodnum ++;
    if ( that.data.goodnum > (that.data.goodInfo.stock - 0) ) {
      that.setData({
        goodnum: (that.data.goodInfo.stock - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  //兑换
  confirmBuy() {
    let that = this;
    wx.showModal({
      title: '确定兑换吗？',
      success(res){
        if (res.confirm) {
          app.data.welfareGood.id = that.data.goodInfo.id;
          app.data.welfareGood.num = that.data.goodnum;
          app.data.welfareGood.total_price = that.data.total_price;
          app.data.welfareGood.hbb = that.data.hbb;
          app.data.welfareGood.goods_name = that.data.goods_name;

          wx.navigateBack();
        }
      }
    })
  },
  onHide() {
  },
  onUnload() {
  },
})