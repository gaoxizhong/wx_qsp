const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invext_id:'', // 志愿信息id
    extInfoList:[],
    pageIndex: 1,
    pageSize: 15,
    hasMore: true,
    list:[],
    identify: {
      status: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      invext_id: options.invext_id,
      ['identify.status']: options.status,
    })
    this.getextInfoList();
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
  
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      list:[],
      extInfoList:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getextInfoList();
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
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getlistData();
      wx.hideLoading()
    }, 1000)
  },

  // 获取我的不同志愿列表
  getextInfoList(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/fmy/inv_list',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.dcode = 200){
        wx.hideLoading();
        let invext_id = that.data.invext_id;
        let lists = res.data.data.list;
        let extInfoList = [];
        lists.forEach(ele =>{
          if(ele.inv_ext_id == invext_id){
            let identify_status = that.data.identify.status;
            if(identify_status == '0'){
              extInfoList.push(ele)
            }else{
              if(identify_status == ele.order_status){
                extInfoList.push(ele)
              }
            }
          }
        })

        let data = extInfoList;// 获取存储总数据
        let pageSize = that.data.pageSize;// 获取每页个数
        that.setData({
          count: data.length,
        })
        if(data.length > 0){
          for (let i = 0; i < data.length; i += pageSize){
            // 分割总数据，每个子数组里包含个数为pageSize
            that.data.list.push(data.slice(i, i + pageSize))
          }
          that.getlistData();
        }
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e =>{
      wx.hideLoading();
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
      let list = that.data.list;
      let count = that.data.count;// 获取数据的总数
    let flag = that.data.pageIndex * that.data.pageSize < count;
    that.setData({
      // 将新获取的数据拼接到之前的数组中
      extInfoList: that.data.extInfoList.concat(list[page]),
      hasMore: flag,
    })
  },
  changeTabItem(e) {
    let that = this;
    that.setData({
      ['identify.status']: e.currentTarget.dataset.status,
      list:[],
      extInfoList:[],
      pageIndex: 1,
      hasMore: true,
    });
    that.getextInfoList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})