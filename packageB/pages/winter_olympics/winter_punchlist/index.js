const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[],
    centerX: '', // 当前经纬度
    centerY: '', // 当前经纬度
    playList:[],
    newplayList:[],
    pageSize: 3,
    pageIndex: 1,
    count:0,
    hasMore: true,
    mapId: "myMap", //wxml中的map的Id值
    content_count:0, // 用户打卡次总数
    done_count: 0, //完成人数
    p_count: 0,
    done: [],
    is_login: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        console.log(res)
        let latitude = res.latitude;
        let longitude = res.longitude;
        // let marker = this.createMarker(res);
        this.setData({
          centerX: longitude, // 当前经纬度
          centerY: latitude, // 当前经纬度
          markers: this.getLingyuanMarkers(longitude,latitude),
        })
      }
    });
  },
  // 点击回到原点
  moveTolocation: function () {
    // console.log(123)
    let Id = this.data.mapId
    var mapCtx = wx.createMapContext(Id);
    mapCtx.moveToLocation();
  },
  // 点击标点获取数据
  markertap(e) {
    var id = e.markerId
    var name = this.data.markers[id - 1].name
    console.log(name)
    // this.setData({
    //   lingyuanName: name,
    //   showDialog: true,
    // })
  },
  regionchange(e) {
    // console.log(e.type)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if(that.data.is_login){
      that.setData({
        playList:[],
        newplayList:[],
        pageSize: 3,
        pageIndex: 1,
        count:0,
        hasMore: true,
        content_count:0, // 用户打卡次总数
        done_count: 0, //完成人数
        done: [],
      })
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          console.log(res)
          let latitude = res.latitude;
          let longitude = res.longitude;
          // let marker = this.createMarker(res);
          this.setData({
            centerX: longitude, // 当前经纬度
            centerY: latitude, // 当前经纬度
            markers: this.getLingyuanMarkers(longitude,latitude),
          })
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      is_login: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      is_login: 0
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
  // 点击查看更多
  clickmore(){
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getlistData();
      wx.hideLoading()
    }, 500)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    let that = this;
    let imageUrl = 'https://oss.qingshanpai.com/icon/punch_share.jpg';
    if (res.from === 'button') {
      return {
        title: '助力冬奥，打卡活动！',
        imageUrl: imageUrl,
        path: '/packageB/pages/winter_olympics/winter_punchlist/index',
        success: function (res) {
          that.setData({
            showModel: false
          })
        }
      }
    }
    return {
      title: '助力冬奥，打卡活动！',
      imageUrl: imageUrl,
      path: '/packageB/pages/winter_olympics/winter_punchlist/index',
      success: function (res) {
        that.setData({
          showModel: false
        })
      }
    }
  },
  // 点击导航
  getRoadLine(e) {
    let that = this;
    console.log(e);
    let latitude = e.currentTarget.dataset.lat;
    let longitude = e.currentTarget.dataset.lng;
    let name = e.currentTarget.dataset.name;
    let address = e.currentTarget.dataset.address + ' ( ' + e.currentTarget.dataset.feature + ' ) ';
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name,
      address,
      scale: 18
    })
  },





  getLingyuanMarkers(lng,lat) {
    let that = this;
    let markers = [];
    // lingyuanData 为列表数据
    common.get('/olympic/index?op=site_list',{
      member_id: wx.getStorageSync('member_id'),
      lng, 
      lat,
    }).then(res =>{
      if(res.data.code == 200){
        let lingyuanData = res.data.data.site;
        let count = Number(lingyuanData.length);// 获取数据的总数
        let pageSize = that.data.pageSize;// 获取每页个数
        for (let item of lingyuanData) {
          let marker = that.createMarker(item);
          markers.push(marker)
        }
        for (let i = 0; i < markers.length; i += pageSize){
          // 分割总数据，每个子数组里包含个数为pageSize
          that.data.playList.push(markers.slice(i, i + pageSize))
        }
        that.setData({
          count,
          markers,
          content_count: res.data.data.content_count,
          p_count: res.data.data.count,
          done_count: res.data.data.done_count, //完成人数
          done: res.data.data.done
        })
        console.log(that.data.markers)
        that.getlistData();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e=>{
      console.log(e)
    })

  },
  getlistData(){ // 前端实现一次获取总数据后分页获取数据
    let that = this;
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    let page = (that.data.pageIndex - 1);
    let playList = that.data.playList;
    let count = that.data.count;// 获取数据的总数
    let flag = that.data.pageIndex * that.data.pageSize < count;
    that.setData({
      // 将新获取的数据拼接到之前的数组中
      newplayList: that.data.newplayList.concat(playList[page]),
      hasMore: flag,
    })
    },


  createMarker(point) {
    let latitude = point.lat;
    let longitude = point.lng;
    let marker = {
      iconPath: "/packageB/assets/images/icon_mark.png",
      id: point.id || 0,
      name: point.name || '',
      address: point.address || '',
      feature: point.feature || '',
      my_distance: point.my_distance || '',
      my_status: point.my_status || 0,
      content_count: point.content_count || 0,
      latitude: latitude,
      longitude: longitude,
      width: 30,
      height: 30,
      label: {
        content: point.feature,
        color: '#0388e2',
        fontSize: 10,
        bgColor: "#fff",
        padding: 3
      },
      callout: {
        content: point.name,
        fontSize: 0,
      }
    };
    return marker;
  },

















  // 点击打卡 
  gotowinter_punch(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let feature = e.currentTarget.dataset.feature;
    wx.navigateTo({
      url: '/packageB/pages/winter_olympics/winter_punch/index?id=' + id + '&name=' + name + '&feature=' + feature,
    })
  },
  // 点击打卡奖励
  gotojl(){
    wx.navigateTo({
      url: '/packageB/pages/winter_olympics/winter_punchjl/index',
    })
  },
  // 跳转打卡秀
  gotopunchshow(){
    wx.navigateTo({
      url: '/packageB/pages/winter_olympics/winter_punchshow/index',
    })
  },
  gotots(){
    wx.showToast({
      title: '您已打过卡，请前往其他打卡点打卡！',
      icon:'none'
    })
  }
})