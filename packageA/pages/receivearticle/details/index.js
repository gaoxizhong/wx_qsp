const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    hasFinds:false,
    getdatalist:[],
    yuyue:'',
    popss_box:false,
    actual_price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id:options.id,
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
    this.getdatadetails();

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
  getdatadetails(){
    let that =this;
    let id = that.data.id;
    common.get('/collect_clothes/details',{
      id,
      member_id:wx.getStorageSync('member_id')
    }).then( res =>{
      if(res.data.code == 200){
        let getdatalist = res.data.data.list;
        that.setData({
          getdatalist,
          yuyue:res.data.data.yuyue
        })
      }
    })
  },
  estimated_price_yes(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let getdatalist = that.data.getdatalist;
    wx.showModal({
      content:'收到物品后的实际估价可能会跟初步估价有差异，最终以实际估价为准。',
      confirmText:'接受',
      confirmColor:'#ff0000',
      success(res){
        if(res.confirm){
          common.get('/collect_clothes/accept_estimated_price',{
            id,
            status,
            member_id:wx.getStorageSync('member_id')
          }).then( res =>{
            if(res.data.code = 200){
      
              wx.showToast({
                title: '接受成功！',
                icon:'none'
              })
              getdatalist[index].status = '1';
              let hasFinds = getdatalist.find( ele => {
                return ele.status == '1';
              })
              if(hasFinds){
                that.setData({
                  yuyue:'1'
                })
              }
              that.setData({
                getdatalist,
              })
      
            }
          })
        }
      }
    })

  },
  estimated_price_no(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let getdatalist = that.data.getdatalist;
    common.get('/collect_clothes/accept_estimated_price',{
      id,
      status,
      member_id:wx.getStorageSync('member_id')
    }).then( res =>{
      if(res.data.code = 200){

        wx.showToast({
          title: '您已拒绝！',
          icon:'none'
        })
        getdatalist[index].status = '2';
        that.setData({
          getdatalist,
        })
      }
    })
  },
  actual_price_yes(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let getdatalist = that.data.getdatalist;
    common.get('/collect_clothes/accept_actual_price',{
      id,
      status,
      member_id:wx.getStorageSync('member_id')
    }).then( res =>{
      if(res.data.code = 200){

        wx.showToast({
          title: '接受成功！',
          icon:'none',
        })
        setTimeout(function(){
          getdatalist[index].status = '3';
          that.setData({
            getdatalist,
            actual_price:res.data.data,
            popss_box:true
          })

        },2000)


      }
    })
  },
  actual_price_no(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let getdatalist = that.data.getdatalist;
    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel:false,
      content:'按先前约定，我们会在3--5天内将您的物品快递到付邮寄给您，请注意查收。',
      confirmText:'知道了',
      confirmColor:'#4bc381',
      success(res){
        if(res.confirm){
          common.get('/collect_clothes/accept_actual_price',{
            id,
            status,
            member_id:wx.getStorageSync('member_id')
          }).then( res =>{
            if(res.data.code = 200){
      
              wx.showToast({
                title: '您已拒绝！',
                icon:'none'
              })
              getdatalist[index].status = '4';
              that.setData({
                getdatalist,
              })
            }
          })
        }
      }
    })

  },
  gotoaddress(){
    wx.navigateTo({
      url: '/packageA/pages/receivearticle/address_info/index?id='+ this.data.id,
    })
  },
  queding(){
    this.setData({
      popss_box:false
    })
  },
  getsign(e){
    let that = this;
    console.log(e)
    let sign = e.currentTarget.dataset.sign;
    if(sign == ''){
      sign = '暂无信息！'
    }
    wx.showModal({
      cancelColor: 'cancelColor',
      content:sign,
      showCancel:false,
      confirmText:'知道了',
      confirmColor:'#4bc381',
      success(res){
        if(res.confirm){
        }
      }
    })
  },
  gotoqianbao(){
    wx.navigateTo({
      url: '/pages/mine/wallet/index',
    })
  }
})