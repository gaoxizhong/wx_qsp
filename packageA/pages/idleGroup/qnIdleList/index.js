const app = getApp()
const common = require('../../../../assets/js/common');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wenzData: [],
    page1: [],
    showFull: [],
    savaStatus: true,
    pageIndex: 1,
    pageSize: 10,
    dataStatus: false,
    longitude: '',
    latitude: '',
    sechs:'',
    gorup_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if (wx.getUserProfile) {
      that.setData({
        canIUseGetUserProfile: true
      })
    }
    that.setData({
      hasMore: true,
      hasMore_full:true,
      group_id: options.group_id
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
    let that = this;
    that.getData();
  },
  getData() { //初始化数据
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        console.log(res)
        that.setData({
         latitude : Number(res.latitude),
         longitude : Number(res.longitude)
        })
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        //列表
        that.getwenzhang();
      },
      fail: function(res) {
        wx.showToast({
          title: '需要开启手机定位',
          icon:'none'
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
        //列表
        that.getwenzhang();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })

  },
  //商品列表
  getwenzhang() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    if (!this.data.hasMore){
      wx.showToast({
        title: '已加载全部...',
        icon:'none'
      })
      return
    }
    common.get('/idle/idleStore', {
      page: that.data.pageIndex,
      lng: that.data.longitude,
      lat: that.data.latitude,
      member_id: wx.getStorageSync('member_id'),
      group_id: that.data.group_id
    }).then(res => {
      var newList = this.data.wenzData.concat(res.data.res);
      // 2.3 获取数据的总数
      var count = res.data.total;
      // 2.4 用于判断比较是否还有更多数据
      var flag = this.data.pageIndex * this.data.pageSize < count;
      this.setData({
        wenzData: newList,
        hasMore: flag,
      });
      wx.hideLoading()
      if (that.data.wenzData.length <= 0) {
        setTimeout(function () {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      if (that.data.wenzData.is_idle){
        that.setData({
          business_id: wenzData.id
        })
      }
      
    }).catch(e => {
      app.showToast({
        title: "数据异常",
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

  onPullDownRefresh() { //下拉刷新
    let that = this
    that.setData({
      wenzData: [],
      pageIndex: 1,
      hasMore: true,
      dataStatus: false,
      sechs:'',
    })
    that.getData();
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  // 触底函数
  onReachBottom() {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
      success() {
        that.setData({
          pageIndex: (that.data.pageIndex + 1)
        })
        console.log(that.data.pageIndex)
        that.getData()
      }
        
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
   //前往闲置详情页
 goToActivity(e) {
  let that = this;
  let idle_id = e.currentTarget.dataset.idle;
  let member_id = that.data.member_id;
  let busnesid = e.currentTarget.dataset.busnesid;
  let url = "/packageA/pages/idleDetails_page/index?member_id=" + member_id + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id
  wx.navigateTo({
    url: url
  })
},
clickSearch(){
  let that = this;
  let sechs_vale = that.data.sechs;
  if (sechs_vale == ''){
    wx.showToast({
      title: '搜索不能为空...',
      icon:'none'
    })
    return
  }
  common.get('/idle/idleSearch',{
    title: sechs_vale
  }).then(res =>{
    if (res.data.code == 200) {
      that.setData({
        wenzData: res.data.res,
        hasMore:false
      })
    } else if (res.data.code == 202) {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    }
  })
},
saveTitleName(e){
  console.log(e)
  let that = this;
  that.setData({
    sechs: e.detail.value
  })
  if (e.detail.value == '') {
    that.onPullDownRefresh();
  }
},
})