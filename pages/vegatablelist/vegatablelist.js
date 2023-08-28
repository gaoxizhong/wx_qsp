const app = getApp();
const common = require('../../assets/js/common');
var zhuan_dingwei = require('../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    infoData: [],
    dataStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      member_id,
    })
    that.getvegetablelist();
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
    if (res.target) {
      let vegetable_id = res.target.dataset.vegetable_id;
      let earnings = res.target.dataset.earnings;
      let is_songcai = res.target.dataset.is_songcai;
      // debugger
      if (res.from === 'button') {
        let earnings = ''
        if (!earnings) {
          let url = '/packageA/pages/bianmingoods/bianmingoods?member_id=' + that.data.member_id + '&is_songcai=' + is_songcai +'&vegetable_id='+vegetable_id
          let shareTxt = res.target.dataset.sharetxt;
          let gdImages = res.target.dataset.gdimages;
          var shareImage = that.data.infoData.bgimg
          if (gdImages.length > 0) {
            var shareImage = gdImages
          }
          return {
            title: shareTxt,
            path: url,
            imageUrl: shareImage,
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
            title: '新鲜蔬菜',
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
      title: '新鲜蔬菜',
      path: '/pages/vegatablelist/vegatablelist',
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
  getvegetablelist(){
    common.get('/service/vegetable_list',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          listData:res.data.data
        })
        if (listData.length <= 0) {
          setTimeout(function () {
            that.setData({
              dataStatus: true
            })
          }, 500)
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
      }).catch(e => {
        that.setData({
          dataStatus: true
        })
        console.log(e)
      })
  },
    //前往购物详情页
    goToActivity(e) {
      let that = this;
      console.log(e)
      let member_id = wx.getStorageSync('member_id');
      let is_songcai = e.currentTarget.dataset.is_songcai;
      let vegetable_id = e.currentTarget.dataset.vegetable_id;

      let url = "/packageA/pages/bianmingoods/bianmingoods?member_id=" + member_id + "&is_songcai=" + is_songcai +"&vegetable_id="+vegetable_id
      wx.navigateTo({
        url: url
      })
  
    },
})