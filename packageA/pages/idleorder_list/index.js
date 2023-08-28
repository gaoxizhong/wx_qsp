const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
    orderlists: [],  //查询到的订单列表
    discount_order_tid:'',
    order_tid:'',
    is_show:false,
    is_title:false,
    title_text:[],
    currentTab:0
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info'),
      status: options.status,
      
    })
  },
  onShow: function() {
    let that = this;
    that.setData({
      status: 0
    })
    that.getOrderInfo();
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
    //头部栏切换
    changeTabItem(e) {
      let that = this;
      that.setData({
        status: e.currentTarget.dataset.status,
        orderlists: [],
      });
      that.getOrderInfo();
    },
  //查询订单
  getOrderInfo() {
    let that = this;
    let postmsg = {
      status: that.data.status,
      member_id: wx.getStorageSync('member_id')
    }
    wx.showLoading({
      title: '订单加载中...',
    })
    common.get("/member/idle_order", postmsg).then( res => {
      if ( res.data.code == 200 ) {
        wx.hideLoading();
        that.setData({
          orderlists: res.data.data,
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  //取消订单
  cancelOrder(e){
    let that = this;
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let orderlists = that.data.orderlists
    wx.showModal({
      content: '确定取消该订单吗？',
      success:function(res){
        if(res.confirm){
          //删除订单
          common.get("/business/setBusinessDiscountOrder", {
            member_id: that.data.member_id,
            status: 5,
            order_id: id,
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '取消订单成功',
                icon: 'success'
              })
              orderlists.splice(index, 1);
              that.setData({
                orderlists: orderlists
              })
            }
          })
        }
        
      }
    })
  },

  //支付订单
  payOrder(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    wx.showModal({
      content: '确定支付该订单吗？',
      success: function (res) {
        if(res.confirm){
          wx.showLoading({
            title: '加载中...',
          })
          common.get("/business/setBusinessDiscountOrder", {
            member_id: that.data.member_id,
            status: 2,
            order_id: id,
          }).then(res => {
            wx.hideLoading()
            if (res.data.code == 200) {
              var $config = res.data.data
              wx.requestPayment({
                timeStamp: $config['timeStamp'], //注意 timeStamp 的格式
                nonceStr: $config['nonceStr'],
                package: $config['package'],
                signType: $config['signType'],
                paySign: $config['paySign'], // 支付签名
                success: function (res) {
                  // 支付成功后的回调函数
                  wx.showToast({
                    title: '支付成功',
                    duration: 1000,
                    icon: 'success'
                  })
                  that.setData({
                    status: 2
                  })
                  that.getOrderInfo();
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/tobuy_welfare/pay_succcess'
                    })
                  }, 1000)
                  return;
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
            } else if (res.data.code == 202) {
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
              that.setData({
                status: 2
              })
              that.getOrderInfo();
            } else {
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
            }
          })
        }
        
      }
    })
  },

  //订单去发货
  shipmentsOrder(e) {
    let that = this;
    console.log(e)
    let discount_id = e.currentTarget.dataset.discount_id;
    let discount_order_tid = e.currentTarget.dataset.discount_order_tid;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确定该订单已发货吗？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/idlelogistics/idlelogistics?discount_id=' + discount_id + '&id=' + id + '&discount_order_tid=' + discount_order_tid + '&order_type=ture',
          })
        }
      }
    })
  },

  //订单确认收货
  takeOrder(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    wx.showModal({
      content: '确定该订单已收到货吗？',
      success: function (res) {
        if (res.confirm){
          common.get("/business/setBusinessDiscountOrder", {
            member_id: that.data.member_id,
            status: 4,
            order_id: id,
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '收货成功',
                icon: 'success'
              })
              that.setData({
                status: 4
              })
              that.getOrderInfo();
            } else {
              wx.showToast({
                title: '收货失败',
                icon: 'success'
              })
            }
          })
        }
        
      }
    })
  },


  makeCall(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  obtainCall(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  
  savaData(e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    let txt = e.currentTarget.dataset.txt;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定' + txt + '吗？',
      success: function(res) {
        if (res.confirm) {
          common.post('/recover/changeOrderStatus', {
            member_id: that.data.member_id,
            status,
            order_id:id
          }).then(res => {

            console.log("修改状态")
            console.log(res)
            if (res.data.errno == 0) {
              that.getData()
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    wx.stopPullDownRefresh()
    that.getData()
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
  onShareAppMessage: function (res) { //分享
    console.log(res)
      let that = this
      if (res.target) {
        if (res.from === 'button') {
          return {
            
          } 

        } else {
          return {
            
          }
        }
      }
    },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },

  gotocommdetail(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let discount_order_tid = e.currentTarget.dataset.discount_order_tid;
    console.log(e)
    wx.navigateTo({
      url: '/packageA/pages/idleorder_detail/index?id=' + id + '&discount_order_tid=' + discount_order_tid,
    })
  },
  gotoidleshop(e){
    let member_id = e.currentTarget.dataset.member_id;
    let url = "/pages/mine/myIdle/index?member_id="+ member_id;
    wx.navigateTo({
      url: url
    })
  },
  // 点击买卖切换按钮
  swichNav(e){
    console.log(e)
    let that = this;
    let current = e.currentTarget.dataset.current;
    that.setData({
      currentTab:current
    })
  }
})