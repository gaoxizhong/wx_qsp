const common = require("../../../../assets/js/common");
const publicMethod = require('../../../../assets/js/publicMethod');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p_id:'',
    project:{},
    contact_name : '',
    contact_phone : '',
    garden:'',
    contact_area : '',
    is_member:false, // 购买会员卡弹窗
    c_id:'',
    c_name:'',
    switchvalue:false,
    my_coin: 0,
    price:0,
    is_illustrate: false,
    m_c: 0, // 选择使用的余额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      p_id:options.p_id
    })
    that.getprojectList();
    // 获取可用余额
    that.getCodeSession();
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
    that.getmy_space();
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
  getprojectList(){
    let that = this;
    common.get('/life/index?op=project',{
      p_id: that.data.p_id,
    }).then(res =>{
      if(res.data.code == 200){
        let yhj = ( Number(res.data.data.project.project_price)-Number(res.data.data.project.price) ).toFixed(2);
        that.setData({
          project: res.data.data.project,
          price: Number(res.data.data.project.price),
          m_c: 0,
          yhj
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
      exchange_coin: that.data.m_c,
      project_id: that.data.p_id,
      official_type: '2'
    };
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=create_order_official',p).then( res=> {
      wx.hideLoading();
      if (res.data.code == 200) {
        var $config = res.data.data.config;
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
                url: '/packageB/pages/livingHall/reserve_success/index?is_type=xm'
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
  useMember(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_beused/index?is_member=1',
    })
  },
  switch1Change(e){
    let that = this;
    let price = that.data.price;
    let my_coin = Number(that.data.my_coin);

    let m = 0;
    if(my_coin > 20){
      m = 20;
    }else{
      m = my_coin;
    }

    that.setData({
      switchvalue: !that.data.switchvalue,
    })
    if(that.data.switchvalue){
      price =  ( Number(price)- Number(m) ).toFixed(2);
      that.setData({
        price,
        m_c: Number(m)
      })
    }else{
      that.getprojectList();
    }
  },
  // 获取可用余额
  getCodeSession(){
    let that = this;
    common.get('/life/index?op=check_num', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          my_coin:res.data.data.my_coin, // 我的余额
        });
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  catchtouchmove(){
    return false
  },
  openIllustrate(){
    this.setData({
      is_illustrate:true
    })
  },
  infoTextBtn(){
    this.setData({
      is_illustrate:false
    })
  },
})