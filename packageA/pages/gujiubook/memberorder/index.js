const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyer_type: 0,
    showEdit: false,
    buyer_ssq: '',
    book_info: [],
    all_integral: '0.00',
    pay_money:'0.00',
    number:0,
    orderRemark:'',
    items_seld:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      pay_money:options.pay_money,
      number: options.number,

    })
    let book_info = wx.getStorageSync('book_info3'); //获取选中的商品对象
    that.setData({
      book_info: book_info,
    })
    console.log(book_info)
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
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
    })
    common.get('/library/save_address', {
      'member_id': that.data.member_id,
      'type': 'select'
    }).then(res => {
      if (JSON.stringify(res.data.data) != "[]") {
        //获取数据成功
        that.setData({
          buyer_type:1,
          buyer_name: res.data.data[0].contact_name ? res.data.data[0].contact_name : '',
          buyer_phone: res.data.data[0].contact_phone ? res.data.data[0].contact_phone : '',
          buyer_ssq: res.data.data[0].garden ? res.data.data[0].garden : '',
          buyer_addressDetail: res.data.data[0].address ? res.data.data[0].address : ''
        })
      } else {
        that.setData({
          buyer_type:0,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
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
    let member_id= that.data.member_id;
    let  name= that.data.buyer_name;
    let  phone= that.data.buyer_phone;
    let address = that.data.buyer_ssq + that.data.buyer_addressDetail;

    let  type= 1;
    if (!phone) {
      wx.showToast({
        "title": "联系方式不能为空！",
        "icon": "none"
      })
      return
    }
    if (!( /^1[345678]\d{9}$/.test(phone) ) ) {
      wx.showToast({
        "title": "请填写正确的联系方式！",
        "icon": "none"
      })
      return
    }
    if (!name) {
      wx.showToast({
        "title": "请填写姓名！",
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
    if (!that.data.buyer_addressDetail) {
      wx.showToast({
        "title": "请填写详细地址！",
        "icon": "none"
      })
      return
    }
    let perm = {
      member_id: that.data.member_id,
      contact_name: that.data.buyer_name,
      contact_phone: that.data.buyer_phone,
      garden: that.data.buyer_ssq,
      address: that.data.buyer_addressDetail,
    }
    common.get('/library/save_address',perm).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '填写地址成功...',
          icon:'none',
          success:function(){
            that.setData({
              buyer_type: 1,
              showEdit: false
            })
          }
        })
      } else {
  
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
    })
    
  },
  //提交订单
  confirmBuy() {
    let that = this;
    if (that.data.buyer_type == 0 ) {
      wx.showToast({
        title: '请先填写您的收货信息！',
        icon: 'none'
      })
      return;
    }
    let param = {
      member_id: that.data.member_id,
      book_info: [that.data.book_info],
      pay_count: that.data.number,
      pay_money: that.data.pay_money,
      pay_integral: that.data.all_integral,
      pay_member_nickname: that.data.buyer_name,
      pay_tel: that.data.buyer_phone,
      pay_address: that.data.buyer_ssq, 
      pay_address_detail: that.data.buyer_addressDetail,
      order_remark: that.data.orderRemark,
      order_type:4
    }
    common.post("/newhome/pay_old_book", param).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading()
        if (res.data.data != '') {
          var $config = res.data.data;
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
                wx.reLaunch({
                  url: '/packageA/pages/eiltemode/mySubmit/index',
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
        } else {
          wx.showToast({
            title: '支付成功！',
            duration: 1000,
            icon: 'success'
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '/packageA/pages/eiltemode/mySubmit/index'
            })
          }, 1000)
        }

      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none'
        })
      }
    }).catch(e =>{
      xonsole.log(e)
    })
  },

})