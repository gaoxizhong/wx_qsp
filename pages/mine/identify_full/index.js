const app = getApp()
const common = require('../../../assets/js/common');
const QR = require('../../../assets/js/qrcode')
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnTop: 400,
    btnLeft: 300,
    windowHeight: '',
    windowWidth: '',
    ident:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    common.get('/idle/ident',{
      idle_id: options.idle_id
    }).then(res =>{
      if (res.data.code ==200){
        that.setData({
          ident: res.data.data
        })
      }
    })
    /**
    *  获取系统信息
    */
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let btnTop = windowHeight - 134;
        this.setData({
          windowHeight,
          windowWidth,
          btnLeft: windowWidth - 65,
          btnTop
        })
      }
    })

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
  // 按钮开始移动
  buttonStart(e) {
    // 获取起始点
    this.setData({
      startPoint: e.touches[0]
    })
  },
  // 按钮移动中
  buttonMove(e) {
    let {
      startPoint,
      btnTop,
      btnLeft,
      windowWidth,
      windowHeight,
      isIpx
    } = this.data
    // 获取结束点
    let endPoint = e.touches[e.touches.length - 1]
    // 计算移动距离相差
    let translateX = endPoint.clientX - startPoint.clientX
    let translateY = endPoint.clientY - startPoint.clientY
    // 初始化
    startPoint = endPoint
    // 赋值
    btnTop = btnTop + translateY
    btnLeft = btnLeft + translateX

    // 临界值判断
    if (btnLeft + 45 >= windowWidth) {
      btnLeft = windowWidth - 45;
    }
    if (btnLeft <= 0) {
      btnLeft = 0;
    }
    // 根据屏幕匹配临界值
    let topSpace = 100
    if (isIpx) {
      topSpace = 134
    } else {
      topSpace = 100
    }
    if (btnTop + topSpace >= windowHeight) {
      btnTop = windowHeight - topSpace
    }
    // 顶部tab临界值
    if (btnTop <= 43) {
      btnTop = 43
    }
    this.setData({
      btnTop,
      btnLeft,
      startPoint
    })
  },
  // 返回上一步事件
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "" });
    }
  },
})