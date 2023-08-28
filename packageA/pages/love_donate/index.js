const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    listData:[],
    pageIndex: 1,
    pageSize: 15,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getaixinlist();
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
      list:[],
      listData:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getaixinlist();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getaixinlist(){
    let that = this;
    wx.showLoading({
      title: '订单加载中...',
    })
    common.get('/garbage/order_info',{
      member_id:wx.getStorageSync('member_id')
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        // that.setData({
        //   listData:res.data.data
        // })
        let data = res.data.data;// 获取存储总数据
        let pageSize = that.data.pageSize;// 获取每页个数
        for (let i = 0; i < data.length; i += pageSize){
          // 分割总数据，每个子数组里包含个数为pageSize
          that.data.list.push(data.slice(i, i + pageSize))
        }
        that.setData({
          count: data.length,
        })
        
        that.getlistData();
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:none,
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
    console.log(list)
      let count = that.data.count;// 获取数据的总数
    let flag = that.data.pageIndex * that.data.pageSize < count;
      that.setData({
        // 将新获取的数据拼接到之前的数组中
        listData: that.data.listData.concat(list[page]),
        hasMore: flag,
      })
    },




  delCircle(e) { //删除图文
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          common.get('/garbage/delete_gift_order', {
            member_id: wx.getStorageSync('member_id'),
            id
          }).then(res => {
            console.log("删除图文")
            console.log(res)
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
              let data = that.data.listData
              data.splice(index, 1)
              if (data.length <= 0) {
                that.setData({
                  dataStatus: true
                })
              }
              that.setData({
                listData: data
              })
            }else{
              app.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })

  },
})