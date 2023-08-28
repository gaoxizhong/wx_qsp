const app = getApp();
const common = require('../../../assets/js/common');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityInfo:'',
    goodnum:'1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.is_songcai){
      this.setData({
        is_songcai:options.is_songcai,
        vegetable_id:options.vegetable_id,
        member_id:wx.getStorageSync('member_id'),
      })
    }
    this.getvegetable_detail();
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
  onShareAppMessage: function (res) { //分享
    console.log(res)
    let that = this
    let shareTxt = that.data.title;
    let vegetable_id = that.data.vegetable_id;
    let is_songcai = that.data.is_songcai;
    if (res.target) {
      let earnings = res.target.dataset.earnings;
      let vegetable_id = res.target.dataset.vegetable_id;
      let is_songcai = res.target.dataset.is_songcai;
      // debugger
      if (res.from === 'button') {
        let earnings = ''
        if (!earnings) {
          let url = '/packageA/pages/bianmingoods/bianmingoods?member_id=' + that.data.member_id + '&is_songcai=' + is_songcai +'&vegetable_id='+vegetable_id;
          let shareTxt = res.target.dataset.sharetxt;
          let gdImages = res.target.dataset.gdimages;
          return {
            title: shareTxt,
            path: url,
            imageUrl: gdImages,
            success: function (res) {
              // 转发成功
              console.log(res)
            },
            fail: function (res) {
              // 转发失败
            }
          }
        } else {
          return {
            title: shareTxt,
            path: '/packageA/pages/bianmingoods/bianmingoods?member_id=' + member_id + '&is_songcai=' + is_songcai +'&vegetable_id='+vegetable_id,
            success: function (res) {
              // 转发成功
              console.log(res)
            },
            fail: function (res) {
              // 转发失败
              console.log(res)
            }
          }
        }
      }
    }
    return {
      title: shareTxt,
      path: '/packageA/pages/bianmingoods/bianmingoods?member_id=' + that.data.member_id + '&is_songcai=' + is_songcai +'&vegetable_id='+vegetable_id,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  getvegetable_detail(){
    var that = this;
    var vegetable_id = that.data.vegetable_id;
    var member_id = wx.getStorageSync('member_id');
    var pram = {
      member_id,
      vegetable_id
    }
    common.get('/service/vegetable_detail',pram).then(res =>{
      if(res.data.code == 200){
        that.setData({
          activityInfo: res.data.data[0],
          title: res.data.data[0].goods_name,
          bal_count: res.data.data[0].stock,
          hbb: res.data.data[0].goods_integral,
          total_price: res.data.data[0].goods_price,
          desc: res.data.data[0].goods_detail,
          img:res.data.data[0].image,
          bought:res.data.data[0].saled,
          vegetable_id:res.data.data[0].id,
        })
      }

    })
  },
  //前去购买
  buyNow() {
    let that = this;
    that.setData({
      butType: 0
    })
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return;
    }
    let param = {
      member_id: that.data.member_id,
      business_discount_id: that.data.vegetable_id,
      pay_sum_jifen: (that.data.hbb * that.data.goodnum).toFixed(2),
      pay_count: that.data.goodnum,
      activityInfo: that.data.activityInfo,
    }
    if (param.pay_count < 1) {
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    wx.setStorageSync("toBuysongcai", (param));
    wx.navigateTo({
      url: "/packageA/pages/tobuy_songcai/tobuy_songcai?is_songcai=1"+ "&discount_id=" + that.data.vegetable_id
    })
    
  },
  inputValue(e) {
    let that = this;
    if (e.detail.value > (that.data.bal_count - 0)) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    }
    // else if (e.detail.value < 1){
    //   that.setData({
    //     goodnum: 1
    //   })
    //   wx.showToast({
    //     title: '最少兑换1个！',
    //     duration: 1000,
    //     icon: 'none'
    //   })
    // } 
    else {
      that.setData({
        goodnum: e.detail.value
      })
    }
  },
  minusNum() {
    let that = this;
    that.data.goodnum--;
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
    that.data.goodnum++;
    if (that.data.goodnum > (that.data.bal_count - 0)) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
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
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/huishou_area/huishou_area" });
    }
  },
})