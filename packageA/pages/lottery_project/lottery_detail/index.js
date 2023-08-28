const app = getApp();
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yao_member_id:'',
    member_id:'',
    pop2:false,
    red_id:'',
    infodata:{},
    is_show:false,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    console.log(options)
    let that = this;
    that.setData({
      red_id : options.red_id,
    })
    if( options.id ){
      that.setData({
        yao_member_id : options.id,
        red_id : options.red_id
      })
    }
    console.log(that.data.yao_member_id)

    // 登录
    wx.login({
      success: function (data) {
        console.log(data)
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      that.setData({
        pop2: true
      })
      return;
    }
  // 禁止右上角转发
  wx.hideShareMenu();
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
    this.getdata();
  },
  getdata(){
    this.getlotdetails();
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
  onShareAppMessage: function (res) {
    console.log(res)
    let that = this;
    let num = that.data.infodata.cha_people;
    let member_id = wx.getStorageSync('member_id');
    let red_id = that.data.red_id;
    let url = '/packageA/pages/lottery_project/lottery_detail/index?id=' + member_id + '&red_id=' + red_id;
      if(res.from === "menu"){
        return {
          title:'快来和我一起抽大奖吧，还差'+ num + '个人！',
          path:url,
        }
      }
      if(res.from == "button"){
        return {
          title:'快来和我一起抽大奖吧，还差'+ num + '个人！',
          path:url,
        }
      }
  },

  getlotdetails(){
    let that = this;
    let red_id = that.data.red_id;
    let yao_member_id = that.data.yao_member_id;
    common.get('/lottery/details',{
      member_id: yao_member_id ? yao_member_id : wx.getStorageSync('member_id'),
      id:red_id,
    }).then(res => {
      if(res.data.code == 200){
        that.setData({
          infodata:res.data.data[0],
          is_show:true
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  join_lottery(){
    let that = this;
    let red_id = that.data.infodata.id;
    let integral = that.data.infodata.integral;
    let price = that.data.infodata.price;
    let people = that.data.infodata.people;
    let yao_member_id = that.data.yao_member_id;
    wx.showLoading({
      title: '加载中...',
    })
    if(!yao_member_id){
      console.log('我是发起人')
      common.get('/lottery/lottery',{
        member_id: wx.getStorageSync('member_id'),
        id:red_id,
        integral,
        price,
        people,
      }).then(res =>{
        wx.hideLoading();
        if(res.data.code == 200){
          wx.showToast({
            title: '参与成功',
            icon: 'success',
            duration: 1500,
          })
          wx.hideToast();
          wx.showToast({
            title: '-30积分',
            icon:'none'
          })
          that.getlotdetails();
        }else{
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(e =>{
        wx.hideLoading();
        console.log(e)
      })
    }else{
      console.log('我是被邀请人')
      common.get('/lottery/invite_lottery',{
        member_id: wx.getStorageSync('member_id'),
        yao_member_id,
        id:red_id,
        integral,
        price,
        people,
      }).then(res =>{
        if(res.data.code == 200){
          wx.hideLoading();
          wx.showToast({
            title: '参与成功',
            icon: 'success'
          })
          that.setData({
            yao_member_id:''
          })
          that.getlotdetails();
        }else{
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(e =>{
        wx.hideLoading();
        console.log(e)
      })
    }

  },
  gettishi(){
    wx.showToast({
      title: '您暂未参与，请先参与抽奖！',
      icon:'none'
    })
  },
  getjifen(){
    let that = this;
    common.get('/lottery/collect_points',{
      member_id:wx.getStorageSync('member_id'),
      integral : 50
    }).then( res => {
      if(res.data.code == 200){
        wx.showToast({
          title: '+50积分',
          icon:'none'
        })
        // that.change();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }).catch(e => {
      console.log(e)
    })
  },
  // 动画
  change() {
    let that = this;
    that.animate('.is-jifen', [
      { opacity: 0, bottom: '100rpx'},
      { opacity: 0.5, bottom: '180rpx'},
      { opacity: 1, bottom: '244rpx'},
    ], 100, function () {
      setTimeout(function(){
        that.clearAnimation('.is-jifen', function () {
        console.log("清除了.is-jifen上的动画属性")
      })
        },1500)
    }.bind(that)
    )
  },

  goToresults(){
    wx.navigateTo({
      url: '/packageA/pages/lottery_project/lottery_results/index',
    })
  }
})