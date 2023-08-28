const common = require("../../../../assets/js/common")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSize: 20,
    list: [],
    meprojectList: [],
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   // 购买项目列表
   this.getMeprojectList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
 
  },
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      list:[],
      meprojectList:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getMeprojectList();
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
  // 购买项目列表
  getMeprojectList(){
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    common.get('/life/index?op=order_list',{
      member_id: wx.getStorageSync('member_id'),
      official_type: '2'
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let data = res.data.data.list;// 获取存储总数据
        let pageSize = that.data.pageSize;// 获取每页个数

        let arr = [];
        data.forEach( ele =>{
          if(ele.status == 1|| ele.status == 2){
            arr.push(ele)
          }
        })
        that.setData({
          count: arr.length,
        })
        if(arr.length > 0){
          for (let i = 0; i < arr.length; i += pageSize){
            // 分割总数据，每个子数组里包含个数为pageSize
            that.data.list.push(arr.slice(i, i + pageSize))
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
      // 将新获取的数据拼接到之前的数组中
      meprojectList: that.data.meprojectList.concat(list[page]),
      hasMore: flag,
    })
  },
  // 点击项目列表 核销按钮
  clickHx(e){
    let that = this;
    console.log(e)
    let order_id = e.currentTarget.dataset.p_id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认核销',
      content: '到店请工作人员当面核销！',
      success(res) {
        if (res.confirm) {
          common.get('/life/index?op=confirm_project_order',{
            member_id:wx.getStorageSync('member_id'),
            order_id
          }).then(res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '核销成功',
              })
              setTimeout(() => {
                let meprojectList = that.data.meprojectList;
                meprojectList.forEach(ele =>{
                  if(ele.id == order_id){
                    ele.status = 2;
                  }
                })
                that.setData({
                  meprojectList
                })
              }, 1000);

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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})