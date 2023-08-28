const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
const zhuan_dingwei = require('../../../../assets/js/dingwei');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    top_img: [],  //头部轮播图
    is_true: false,
    class_items_list2:[],
    class_items_list: [],
    longitude: '',
    latitude: '',
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
    // 转百度定位坐标
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        wx.setStorageSync('zhuan_dingwei', gcj02tobd09);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        that.getClassmodule(gcj02tobd09[0],gcj02tobd09[1]);
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          publicMethod.openSetting(that)
        }
        if(typeof f == 'function'){
          return f(res)
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
  //初始化数据
  getData() {
    let that = this
    that.getBannerUrls();

  },
  //轮播图地址
  getBannerUrls() {
    let that = this
    common.get('/banner/newInfo', {
      member_id: wx.getStorageSync('member_id'),
      type: 20
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          top_img: res.data.data.banner,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },
  // 获取模块项目
  getClassmodule(lng,lat){
    let that = this;
    common.get('/newservice/type', {
      lng,
      lat,
    }).then(res => {
      if (res.data.code == 200) {
        let class_items = res.data.data.array;
        if(class_items.length > 9){
          that.setData({
            class_items_list: class_items.slice(0,9),
            class_items_list2: class_items.slice(9,class_items.length),
            is_true: true
          })
          
        }else{
          that.setData({
            class_items_list: class_items,
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },
  me_become(){
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/convenience_plate/release_service_info/index',
    })
  },
  // 点击查看更多
  view_more(){
    let that =this;
    let class_items_list = that.data.class_items_list;
    let class_items_list2 = that.data.class_items_list2;
    that.setData({
      class_items_list: class_items_list.concat(class_items_list2),
      is_true: false
    })
  },
  goToclassactical(e){
    let that = this;
    console.log(e)
    let url = e.currentTarget.dataset.url;
    let id = e.currentTarget.dataset.id;

    if(!url){
      wx.navigateTo({
        url: '/packageA/pages/convenience_plate/plate_lists/index?id=' + id,
      })
    }else{
      wx.navigateTo({
        url,
      })
    }
  }
})