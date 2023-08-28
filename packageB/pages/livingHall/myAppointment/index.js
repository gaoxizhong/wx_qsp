const common = require("../../../../assets/js/common")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    pageIndex: 1,
    pageSize: 20,
    hasMore: true,
    list:[],
    beusedList: [],  // 预约记录列表
    orderList: [],  // 留言记录
    my_likeList:[], // 点赞记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getMyAppList();
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

  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      beusedList:[],
      orderList:[],
      my_likeList:[],
      pageIndex: 1,
      pageSize: 20,
      hasMore: true,
      list:[],
    })
    if(that.data.currentTab == '0'){
      //预约到店的
      that.getMyAppList();
    }
    if(that.data.currentTab == '1'){
      // 留言记录
      that.getLiuyanList();
    }
    if(that.data.currentTab == '2'){
      // 点赞列表
      that.getLikeList();
    }
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
  // 获取预约记录
  getMyAppList(){
    let that = this;
    wx.showLoading();
    common.get('/life/index?op=schedule_list',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){

        // that.setData({
        //   beusedList:res.data.data.schedule
        // })
        let data = res.data.data.schedule;// 获取存储总数据
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
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 留言列表
  getLiuyanList(){
    let that = this;
    wx.showLoading({
      title:'加载中...'
    })
    common.get("/life/index?op=my_like",{
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        // that.setData({
        //   orderList: res.data.data.comment
        // })
        let data = res.data.data.comment;// 获取存储总数据
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
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 点赞列表
  getLikeList(){
    let that = this;
    wx.showLoading({
      title:'加载中...'
    })
    common.get("/life/index?op=my_like",{
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let data = res.data.data.like;// 获取存储总数据
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
        wx.showToast({
          title: res.data.msg,
          icon:'none'
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
      hasMore: flag,
    })
    if(that.data.currentTab == '0'){
      that.setData({
        // 将新获取的数据拼接到之前的数组中
        beusedList: that.data.beusedList.concat(list[page]),
      })
    }
    if(that.data.currentTab == '1'){
      that.setData({
        // 将新获取的数据拼接到之前的数组中
        orderList: that.data.orderList.concat(list[page]),
      })
    }
    // 点赞列表
    if(that.data.currentTab == '2'){
      that.setData({
        // 将新获取的数据拼接到之前的数组中
        my_likeList: that.data.my_likeList.concat(list[page]),
      })
    }
  },


  // 取消预约
  clickQx(e){
    let that = this;
    let s_id = e.currentTarget.dataset.s_id;
    wx.showModal({
      title: '取消预约',
      content: '是否要取消预约！',
      success(res) {
        if (res.confirm) {
          common.get('/life/index?op=cancel_schedule',{
            member_id:wx.getStorageSync('member_id'),
            s_id
          }).then(res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
              setTimeout(() => {
                that.getMyAppList();
              }, 1500);
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          }).catch(e =>{
            console.log(e)
          })
        } else if (res.cancel) {
          console.log('点击了取消')
        }
      }
    })
  },

  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this;
    var cur = e.currentTarget.dataset.current;
    that.setData({
      beusedList:[],
      orderList:[],
      my_likeList:[],
      currentTab: cur,
      pageIndex: 1,
      pageSize: 20,
      hasMore: true,
      list:[],
    })
    if(cur == '2'){
      // 点赞列表
      that.getLikeList();
    }else if (cur == '1') {
      // 留言记录
      that.getLiuyanList();
    } else if (cur == '0') {
      //预约到店的
      that.getMyAppList();
    }

  },

  gotogoodsdetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
    })
    
  }


})