const app = getApp()
const common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[],
    useradd:[],
    express:[],
    logisticlist:[],
    select: false,
    tihuoWay: '选择快递公司',
    expre:'',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      is_idle: options.is_idle,
    })
    console.log(options)
    if (options.order_type){
      that.setData({
        order_type: options.order_type,
        discount_id: options.discount_id,
        discount_order_tid: options.discount_order_tid,
        id: options.id
      })
    }else{
      that.setData({
        business_id: options.business_id,
        mm_id: options.id
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
    that.getData();
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
  // 商店商品订单物流信息
  getbothside(){
    let that = this;
    common.get("/idle/SaleLogistics", {
      discount_id: that.data.discount_id,
      discount_order_tid: that.data.discount_order_tid,
      id: that.data.id
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        //卖家信息
        let result = res.data.data.result;
        //买家信息
        let useradd = res.data.data.user_address;
        let logisticlist = res.data.data.data_select;
        that.setData({
          result,
          useradd,
          id: res.data.data.user_address.id,
          logisticlist: logisticlist
        })
      }else if(res.code == 206){
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        }
      }).catch(res =>{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
    })
  },
  // 我的闲置订单物流信息
  getbothsides(){
      let that = this;
    common.get("/idle/logistics", {
        business_id: that.data.business_id,
        id: that.data.mm_id,
        is_idle: that.data.is_idle
      }).then(res => {
        if (res.data.code == 200) {
          //卖家信息
          let result = res.data.data.result;
          //买家信息
          let useradd = res.data.data.user_address;
          let logisticlist = res.data.data.data_select;
          that.setData({
            result,
            useradd,
            id: res.data.data.user_address.id,
            logisticlist: logisticlist
          })
        }
      })
  },

  getData(){
    let that = this;
    if ( that.data.order_type ){
      //商店商品物流信息
      that.getbothside();
    }else{
      //我的闲置物流信息
      that.getbothsides();
    }
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
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name;
    var express = e.currentTarget.dataset.express;
    this.setData({
      tihuoWay: name,
      expre: express,
      select: false
    })
  },
  swichNav(e){
    let that = this;
    let order_number = e.detail.value.number;
    let order_id = that.data.id;
    let express = that.data.expre;
    let is_idle = that.data.is_idle;
    let business_discount_id = e.detail.target.dataset.discount_id;
    let business_id = e.detail.target.dataset.business_id;
    let discount_order_tid = e.detail.target.dataset.order_tid;
  console.log(e)
    wx.showModal({
      title: '是否提交',
      content: '确认无误后请点击确定',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#d3d3d3',
      confirmText: '确认',
      confirmColor: '#65B532',
      success: function(res) {
        if(res.confirm){
          
          if( that.data.order_type ){
              //商店商品
            common.get('/idle/SaleExpressAdd', {
              order_number,
              order_id,
              express,
              business_discount_id,
              discount_order_tid
            }).then(res => {
              console.log(res)
              wx.showLoading({
                title: '提交中...',
              })
              if (res.data.code == 200) {
                wx.hideLoading();
                wx.showToast({
                  title: '提交成功.',
                })
                setTimeout(() => {
                  // 返回
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2600)
              } else if (res.data.code == 206) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }).catch(e => {
              app.showToast({
                title: "数据异常"
              })
              console.log(e)
            })
          }else{
            //我的闲置
            common.get('/idle/expressAdd', {
              order_number,
              order_id,
              express,
              is_idle,
              business_discount_id,
              business_id,
              discount_order_tid
            }).then(res => {
              console.log(res)
              wx.showLoading({
                title: '提交中...',
              })
              if (res.data.code == 200) {
                wx.hideLoading();
                wx.showToast({
                  title: '提交成功.',
                })
                setTimeout(() => {
                  // 返回
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2600)
              } else if (res.data.code == 206) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }).catch(e => {
              app.showToast({
                title: "数据异常"
              })
              console.log(e)
            })
          }


        } else if (res.cancel){
          wx.hideLoading()
        }
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
   
  },
  quxiaobg(){
    let that = this;
    that.setData({
      select:false,
    })
  },
})