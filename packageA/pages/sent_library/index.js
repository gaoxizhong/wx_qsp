const app = getApp()
const common = require('../../../assets/js/common');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude : 0,
    longitude : 0,
    page:1,
    libraryList: [],
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取微信定位
    wx.getLocation({  
      type: 'wgs84',
      success: function(res) {
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
        that.getOberInfo();
        that.getLibraryPosition();
      },
      fail: function(res) {
        wx.showModal({
          title: '需要开启手机定位',
          content: '请前去开启GPS服务',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getLibraryPosition();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    });
    wx.hideShareMenu();

  },
  getOberInfo(){
    let that = this;
    common.get('/book_integral/service_info',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let latitude = that.data.latitude;
        let longitude =that.data.longitude;
        if(res.data.aa == 1){
          let library_id = res.data.data.library_id;
          let id = res.data.data.id;
          wx.showModal({
            content: '您有一个订单还未处理...',
            confirmText:'去查看',
            confirmColor:'#cc0000',
            showCancel:false,
            success(res){
              if(res.confirm){
                wx.reLaunch({
                  url: '/packageA/pages/second_confirm/index?member_id=' + wx.getStorageSync('member_id') + '&library_id=' + library_id + '&latitude=' + latitude + '&longitude=' +longitude + "&id=" + id,
                })
              }
            }
          })
          return
        }
      }
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
    let that = this;
    that.setData({
      libraryList: [],
      page: 1,
      hasMore: true,
    })
    that.getLibraryPosition();
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
      success() {
        that.setData({
          pageIndex: (that.data.pageIndex + 1)
        })
          that.getLibraryPosition();
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
    //查看图书馆
    getLibraryPosition() {
      let that = this;
      let params = {
        lng: that.data.longitude,
        lat: that.data.latitude,
        page: that.data.page
      }
      wx.showLoading({
        title: '数据加载中...',
      })
      if (!this.data.hasMore){
        wx.showToast({
          title: '已加载全部...',
          icon:'none'
        })
        return
      }
      common.get("/book_integral/getLibrary", params).then( res => {
        console.log(res)
        if (res.data.code == 200) {
          wx.hideLoading();
          var newList = this.data.libraryList.concat(res.data.data);
          // 2.3 获取数据的总数
          var count = res.data.total;
          // 2.4 用于判断比较是否还有更多数据
          var flag = this.data.pageIndex * this.data.pageSize < count;
          that.setData({
            libraryList: newList,
            hasMore: flag,
          })
        }
      })
    },
      //查询路线
  getRoadLine(e) {
    let that = this;
    console.log(e);
    let name = e.currentTarget.dataset.name;
    let address = e.currentTarget.dataset.address;
    let latitude = e.currentTarget.dataset.latitude;
    let longitude = e.currentTarget.dataset.longitude;
    // zhuan_dingwei方法转换百度标准
    let gcj02tobd09 = zhuan_dingwei.wgs84togcj02(longitude, latitude);
    longitude= Number(gcj02tobd09[0]),
    latitude= Number(gcj02tobd09[1])
    wx.getLocation({
      type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
      isHighAccuracy: true,
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        console.log(res)
        wx.openLocation({        //所以这里会显示你当前的位置
          latitude,
          longitude,
          name,
          address,
          scale: 18
        })
      }
    })
  },
  /**调用电话 */
tel(e) {
  console.log(e)
  let tel = e.currentTarget.dataset.tel;
  if (tel != null || tel != ""){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  }else{
    app.showToast({
      title: "暂无联系电话"
    })
  }
},
  goToindex(e){
    console.log(e.currentTarget.dataset.index);
    let that = this;
    let index = e.currentTarget.dataset.index;
    let libraryList = that.data.libraryList;
    wx.setStorageSync('libraryList_info', libraryList[index]);
    wx.navigateTo({
      url: '/packageA/pages/submit_library/index',
    })
  },
})