const app = getApp()
const common = require('../../../assets/js/common');
const zhuan_dingwei = require('../../../assets/js/dingwei.js');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    garden: '', //所在小区
    address: '', //详细地址,
    latitude: '',
    longitude: '',
    recoverList: [{ id: -1, name: "智能机器人回收车",thumb:'/packageA/assets/images/robot-image.png',quyu:'智能回收车' }], //回收人员列表
    selectedRecover:{},
    recoverid:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    let that = this;
    // 转百度定位坐标
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),Number(res.latitude));
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        // 获取地址
        that.getLastOrderInfo();
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          publicMethod.openSetting(that);
        }
        // 获取地址
        that.getLastOrderInfo();
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.toast = this.selectComponent("#toast");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 2];
    currentPage.data.selectedRecover = {}
  },
  getLastOrderInfo() {
    let that = this;
    common.get('/library/save_address', {
      member_id: wx.getStorageSync('member_id'),
      type: 'select',
      lng:that.data.longitude,
      lat:that.data.latitude
    }).then(res => {
      if (JSON.stringify(res.data.data) != "[]") {
        //获取数据成功
        that.setData({
          garden: res.data.data[0].garden ? res.data.data[0].garden : '',
          address: res.data.data[0].address ? res.data.data[0].address : '',
        })
      } else {

      }
      that.getRecoverStaff();
    }).catch(e => {
      app.showToast({
        title: "数据异常"
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
  //获取回收人员
  getRecoverStaff(e) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get("/recover/getRecover", {
      address: that.data.address,
      garden: that.data.garden,
      lng: that.data.longitude,
      lat: that.data.latitude
    }).then(res => {
      wx.hideLoading();
      if (res.data.code == 200) {
        let recoverList = that.data.recoverList.concat(res.data.data);
        that.setData({
          recoverList,
          selectedRecover: recoverList[1],
          recoverid: recoverList[1].id
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },  
  //选择回收人员
  chooseRecover(e) {
    let recoverid = e.currentTarget.dataset.id;
    let that = this;
    if (recoverid == -1) {
        this.toast.showToast('此区域功能暂未开放');
        return
    }
      that.data.recoverList.forEach(ele => {
        if (ele.id == recoverid) {
          // app.data.selectedRecover = ele;
          that.setData({
            recoverid,
            selectedRecover: ele,
          })
        }
      })
  },
  determine_info(){
    let that = this;
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 2];
    let selectedRecover = that.data.selectedRecover;
    if(JSON.stringify(selectedRecover) == "{}"){
      wx.showToast({
        title: '请先选择回收员！',
        icon:'none'
      })
      return
    }else{
      currentPage.data.selectedRecover = selectedRecover;
      wx.navigateBack();
    }
  },
  system_distr(){
    let that = this;
        const pages = getCurrentPages();
    const currentPage = pages[pages.length - 2];
    currentPage.data.selectedRecover = {id:0, name:'系统分配(由客服为您指派回收员)'}
    wx.navigateBack();
  }
})