const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    welfare_goods: '',  //福利商品详情
    goodnum: '1',
    obtainType: 2,
    showEdit: false,
    deliveryMethod: '', //邮寄配送方式
    deliveryPrice: 0, //邮寄价格
    deliveryDesc: false, //商品送达方式描述
    deliverySel:'请选择',
    deliveryFold: false,
    currentDelivery: 0,
    startDate: "请选择",
    pay_sum_mone: 0,
    orderRemark:'',
    buyer_ssq: '',
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
    that.setData({
      currentDelivery: 0,
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      welfare_goods: wx.getStorageSync("praise_welfare_goods"),
    })
    console.log(that.data.welfare_goods)
    let delivery = that.data.welfare_goods.delivery;
    console.log(delivery)
    if (delivery){
      console.log(JSON.parse(delivery));
      let deliveryNew = JSON.parse(delivery).filter(item => item.status == 1);
      that.setData({
        delivery: deliveryNew,
      })
    }else{
      that.setData({
        delivery,
      })
    }
    let obtain_typeList = JSON.parse(that.data.welfare_goods.obtain_type);
    obtain_typeList.sort(function(a,b){
        return a-b;
    });
    this.setData({
      obtain_typeList: obtain_typeList,
      total_price: that.data.welfare_goods.total_price.toFixed(2) - 0,
    })
    if ( obtain_typeList.length == 1) {
      this.setData({
        obtainType: obtain_typeList[0],
        deliverySel: obtain_typeList[0] == 1 ? '到店自提' : '请选择邮寄方式'
      })
    }
    if (that.data.obtainType == 2) {
      let that = this;
      let delivery = that.data.delivery[0];
      let method = {
        'id': delivery.id,
        'name': delivery.name,
        'price': delivery.price,
        'showPrice': delivery.showprice
      }
      this.setData({
        deliveryMethod: method,
        deliveryPrice: parseFloat(delivery.price),
        deliverySel: delivery.name.replace(/&emsp;&emsp;&emsp;/g, '') + ' ' + delivery.showPrice
      })
    }
    common.get("/business/getMemberFreightAddress", {
       "member_id": wx.getStorageSync('member_id'),
      }).then( res => {
      console.log(res)
      if (res.data.code == 200 && res.data.data.length > 0) {
        that.setData({
          buyer_address: res.data.data[0]
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  obtainTypeChange(e) {
    let that = this;
    if (e.detail.value == 1){
      this.setData({
        deliveryPrice: 0,
        deliveryMethod:'',
        deliverySel: '到店自提'
      })
    } else if(e.detail.value == 2){
      let that = this;
      let delivery = that.data.delivery[0];
      let method = {
        'id': delivery.id,
        'name': delivery.name,
        'price': delivery.price,
        'showPrice': delivery.showprice
      }
      this.setData({
        currentDelivery: 0,
        deliveryMethod: method,
        deliveryPrice: parseFloat(delivery.price),
        deliverySel: delivery.name.replace(/&emsp;&emsp;&emsp;/g, '') + ' ' + delivery.showPrice
      })
    }
    if (e.detail.value == 3){
      this.setData({
        deliveryPrice: 0,
        deliveryMethod: '',
        deliverySel: '送货上门'
      })
    }
    this.setData({
      obtainType: e.detail.value
    })
  },
  deliveryfold(){
    this.setData({
      deliveryFold: this.data.deliveryFold ? false : true
    })
  },
  //选择付费邮寄方式
  deliveryListChange(e){
    console.log(e)
    let that = this
    let method = { 
      'id': e.currentTarget.dataset.id,
      'name': e.currentTarget.dataset.name, 
      'price': e.currentTarget.dataset.price, 
      'showPrice': e.currentTarget.dataset.showprice
    }
    that.setData({
      currentDelivery: e.currentTarget.dataset.index,
      deliveryPrice: parseFloat(e.currentTarget.dataset.price),
      deliveryMethod: method,
      deliverySel: e.currentTarget.dataset.name.replace(/&emsp;&emsp;&emsp;/g, '') + ' ' + e.currentTarget.dataset.showprice
    })
    console.log(that.data.currentDelivery)
  },
  openEdit() {
    let that = this;
    that.data.showEdit = !that.data.showEdit;
    that.setData({
      showEdit: that.data.showEdit
    })
  },
  chooseAddress(e) {
    console.log(e)
    this.setData({
      buyer_ssq: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //输入订单备注
  inputRemark(e) {
    this.setData({
      orderRemark: e.detail.value
    })
  },
  inputName(e) {
    this.setData({
      buyer_name: e.detail.value
    })
  },
  inputPhone(e) {
    this.setData({
      buyer_phone: e.detail.value
    })
  },
  inputAddrDetail(e) {
    this.setData({
      buyer_addressDetail: e.detail.value
    })
  },
  //保存地址
  saveAddress() {
    let that = this;
    let params = {
      "member_id": that.data.member_id,
      "name": that.data.buyer_name,
      "phone": that.data.buyer_phone,
      "address": that.data.buyer_ssq + that.data.buyer_addressDetail,
      "type": 1
    }
    console.log(params);
    if (!params.phone) {
      wx.showToast({
        "title": "联系方式不能为空！",
        "icon": "none"
      })
      return
    }
    if ( !(/^1[345678]\d{9}$/.test(params.phone)) ) {
      wx.showToast({
        "title": "请填写正确的联系方式！",
        "icon": "none"
      })
      return
    }
    if (!params.name) {
      wx.showToast({
        "title": "请填写姓名！",
        "icon": "none"
      })
      return
    }
    if (!that.data.buyer_addressDetail) {
      wx.showToast({
        "title": "请填写详细地址！",
        "icon": "none"
      })
      return
    }
    if (!that.data.buyer_ssq) {
      wx.showToast({
        "title": "请选择省市区！",
        "icon": "none"
      })
      return
    }
    common.get("/business/memberFreightAddress", params).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          buyer_address: params,
          showEdit:false
        })
      }
      if (res.data.code == 201) {
        wx.showToast({
          "title": res.data.msg,
          "icon": "none"
        })
        return
      }
    }).catch( error => {
      console.log(error);
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
    console.log(that.data.buyer_address)
    if (that.data.obtainType == '') {
      wx.showToast({
        title: '请选择送达方式',
        icon: 'none'
      })
      return;
    }
  
    if (that.data.obtainType >= 1 &&  that.data.buyer_address == '') {
      wx.showToast({
        title: '请先设置您的收货地址！',
        icon: 'none'
      })
      return;
    }
    if (that.data.obtainType == 2) {
      if (that.data.deliveryMethod == ''){
        wx.showToast({
          title: '请选择付费邮寄方式',
          icon: 'none'
        })
        return;
      }
    }
    let pay_sum_mone = (that.data.welfare_goods.total_price + parseFloat(that.data.deliveryPrice)).toFixed(2);
    var param = {
      member_id: wx.getStorageSync('member_id'),
      business_id: that.data.welfare_goods.business_id,
      business_discount_id: that.data.welfare_goods.id,
      pay_sum_jifen: (that.data.welfare_goods.hbb).toFixed(2),
      pay_total_money: pay_sum_mone,
      pay_sum_money: pay_sum_mone,
      buy_like: that.data.welfare_goods.buy_like,
      pay_count: 1,
      obtain_type: that.data.obtainType,
      obtain_name: that.data.buyer_address.name,
      obtain_phone: that.data.buyer_address.phone,
      obtain_address: that.data.buyer_address.address,
      deliveryMethod: that.data.deliveryMethod,
      deliveryPrice: that.data.deliveryPrice, // 运费
      remark: that.data.orderRemark,
    }
    wx.showModal({
      title: "",
      content: "确定购买吗？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在加载...',
          })
          common.get("/business/createDiscountOrder", param).then(res => {
            if (res.data.code == 200) {
              wx.hideLoading();
              if (res.data.data != '') {
              console.log('有支付签名')

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
                    setTimeout(function () {
                      wx.navigateTo({
                        url: '/pages/tobuy_welfare/pay_succcess'
                      })
                    }, 1000)
                    return;
                  },
                  fail: function (e) {
                    wx.hideLoading();
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
                console.log('没有支付签名')

                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'success'
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/tobuy_welfare/pay_succcess'
                  })
                }, 1000)
              }

            } else {
              wx.hideLoading();
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
            }
          }).catch(e =>{
            console.log(e)
            wx.hideLoading();
          })
        }
      }
    })
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
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/index/index" });
    }
  },
})