const app = getApp()
const common = require('../../../assets/js/common');
Page({
  data: {
    user_id:'',
    goodnum: '1',
    showEdit: false,
    orderRemark: '',
    pay_sum_mone:'',
    deliveryFold: false,
    currentDelivery: 0,
    pay_total_price:0,
    pay_discount_price:0,
    toBuyWel_goods:'',
    pay_total_price:0,
    cat_show:true,
  },
  onLoad: function(options) {
    let that = this;
    console.log(options)

    that.setData({
      user_id:options.user_id,
      toBuyWel_goods: wx.getStorageSync("toBuyWel_goods"),
      member_id: wx.getStorageSync('member_id'),
    })
  },
  onShow: function() {
    let that = this;
    console.log(that.data.toBuyWel_goods)
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
      pay_total_price: (that.data.toBuyWel_goods.activityInfo.goods_discount_price * that.data.toBuyWel_goods.pay_count).toFixed(2) - 0,
    })

  },

  //输入订单备注
  inputRemark(e) {
    this.setData({
      orderRemark: e.detail.value
    })
  },


  //查看商品送达描述
  deliveryDesc(){
    this.setData({
      deliveryDesc: this.data.deliveryDesc ? false : true
    })
  },

  //提交订单
  confirmBuy() {
    let that = this;
      var param = {
        member_id: that.data.member_id,
        user_id: that.data.toBuyWel_goods.user_id,
        goods_id: that.data.toBuyWel_goods.activityInfo.id,
        pay_sum_jifen: (that.data.toBuyWel_goods.activityInfo.goods_integral * that.data.toBuyWel_goods.pay_count).toFixed(2),
        pay_total_money: that.data.pay_total_price,
        pay_count: that.data.toBuyWel_goods.pay_count,
        remark: that.data.orderRemark,

      }
      if(!that.data.cat_show){
        return
      }
      that.setData({
        cat_show:false
      })
    wx.showModal({
      title: "",
      content: "确定购买吗？",
      success(res) {
        console.log(res)
        if (res.confirm) {
          wx.showLoading({
            title: '正在加载...',
          })
      //唤起摄像头
      wx.scanCode({   
        success(res) {
          console.log("扫码结果", res);
          common.post("/service/to_tuan_order", param).then(res => {
            if (res.data.code == 200) {
              wx.hideLoading();
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'success'
                })
            }else {
              wx.hideLoading();
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
              that.setData({
                cat_show:true
              })
            }
          }).catch(e =>{
            wx.hideLoading();
            console.log(e)
            that.setData({
              cat_show:true
            })
          })

        },
        complete(ret, result) {
          wx.hideLoading();
          console.log('ret', ret);
          console.log('result', result);
          },
        })
      }else {
            that.setData({
              cat_show:true
            })
          }
        }
      })
    },
  onHide() {
  },
  onUnload() {
  },
})