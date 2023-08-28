const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{}, // 卖家信息
    useradd:{}, // 收货人地址 
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
      work_id: options.work_id,
      order_id: options.order_id,
    })
    console.log(options)
    
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
  getData(){
    let that = this;
    that.getbeusedList();
    that.getOrderAddress(); // 获取买家信息 
    that.getmy_space(); // 卖家我的信息
  },
  // 获取卖家信息
  getmy_space(){
    let that = this;
    common.get('/life/index?op=my_space',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let space = res.data.data.space;
        that.setData({
          result:space,
        })
      }else{

      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 获取买家信息
  getOrderAddress(){
    let that = this;
    common.get('/life/index?op=get_order_address',{
      order_id:that.data.order_id
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        that.setData({
          useradd: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 获取快递公司
  getbeusedList(){
    let that = this;
    let p = {
      status: '',
      express_status: '',
      work_member_id: wx.getStorageSync('member_id'),
    };
    common.get('/life/index?op=order_list',p).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let logisticlist = res.data.data.kuaidi_type;
        let infoList = res.data.data.list;
        that.setData({
          logisticlist
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
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
    let express_no = e.detail.value.number; // 快递单号
    let order_id = that.data.order_id;
    let express_type = that.data.expre;
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
          wx.showLoading({
            title: '提交中...',
          })
          common.get('/life/index?op=order_send', {
          express_no,
          order_id,
          express_type,
          member_id: wx.getStorageSync('member_id'),
          }).then(res => {
            console.log(res)
            wx.hideLoading();
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
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }).catch(e => {
            wx.hideLoading();
            app.showToast({
              title: "数据异常"
            })
            console.log(e)
          })


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