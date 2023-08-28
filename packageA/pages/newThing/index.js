const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoData:{},
    business_id:'',
    storyList:[],
    pageIndex: 1,
    pageSize: 15,
    hasMore: true,
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      business_id: options.business_id
    })
    this.getBusinessInfo();
    // 打卡趣事
    this.getStoryList();
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
    //查询商家信息
    getBusinessInfo() {
      let that = this;
      common.get("/business/getBusinessInfo", {
        member_id: wx.getStorageSync('member_id'),
        business_id: that.data.business_id,
      }).then( res => {
        console.log(res);
        if ( res.data.code == 200 ) {
          if (res.data.data.is_password == 2) {
            that.setData({
              switchvalue: false
            })
          } else if (res.data.data.is_password  == 1) {
            that.setData({
              switchvalue: true
            })
          }
          that.setData({
            infoData: res.data.data,
            hidden_infodata:true,
            put_distance:res.data.put_distance,
          })
        }
      }).catch( error => {
        console.log(error);
      })
    },
  // 打卡趣事
  getStoryList(){
    let that = this;
    common.get("/business/story_list", {
      business_id: that.data.business_id,
    }).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        // that.setData({
        //   storyList: res.data.data.list,
        // })
        let data = res.data.data.list;// 获取存储总数据
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
      }
    }).catch( error => {
      console.log(error);
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
      storyList: that.data.storyList.concat(list[page]),
      hasMore: flag,
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
    let that = this;
    that.setData({
      list:[],
      storyList:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getStoryList();

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
   //删除
  delt(e) {
    let that = this;
    let business_id = that.data.business_id;
    let id = e.currentTarget.dataset.id;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      confirmColor:'#ff0000',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          common.post('/business/delete_story', {
            member_id: wx.getStorageSync('member_id'),
            business_id,
            story_id:id,
          }).then(res => {
            if (res.data.code == 200) {
              that.setData({
                popidx: false,
                pop3: false
              })
              let data = that.data.storyList
              data.splice(curIdx, 1)
              that.setData({
                storyList: data
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
  // 前往趣事详情页
  goTonewThing_detail(e){
    console.log(e)
    let that = this;
    app.data.newThingInfo = {};
    let business_id = e.currentTarget.dataset.business_id;
    let id = e.currentTarget.dataset.id;
    let storyList = that.data.storyList;
    let newThingInfo = {};
    storyList.forEach(ele =>{
      if(id == ele.id) {
        newThingInfo = ele
      }
    })
    app.data.newThingInfo = newThingInfo;
    wx.navigateTo({
      url: '/packageA/pages/newThing_detail/index',
    })
  },
  goTorelease_newThing(e){
    let business_id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: '/packageA/pages/release_newThing/index?business_id=' + business_id,
    })
  },
})