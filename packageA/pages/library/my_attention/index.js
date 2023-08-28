const app = getApp()
const common = require('../../../../assets/js/common');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_library:'',
    library_member_List:[],
    longitude: '',
    latitude: '',
    library_name:'',
    isShowConfirm:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id')
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
    that.setData({
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    that.getLibrarygeren();

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

  //下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    let that = this;
    that.setData({
      library_member_List:[],
    })
    that.getLibrarygeren();

    wx.stopPullDownRefresh();
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
  //查看个人图书馆
  getLibrarygeren() {
    let that = this;
    let page = that.data.list_page;
    let params = {
      member_id:that.data.member_id,
      lng: that.data.longitude,
      lat: that.data.latitude,
    }
    wx.showLoading({
      title: '加载中...',
    })
    common.get("/newhome/follow_index", params).then( res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading();
        that.setData({
          library_member_List: res.data.data,
        })
      }else{
        wx.hideLoading();
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
  /**
   * 进入个人图书馆首页 
  */
  goToindex_personal(e){
    console.log(e)
    let that = this;
    let library_id = e.currentTarget.dataset.library_id;
    let is_password = e.currentTarget.dataset.is_password;
    let url = "/packageA/pages/library/personal_index/personal_index?library_id=" + library_id 
    if(is_password == 1){
      that.setData({
        library_id,
        isShowConfirm:true,
      })
      return
    }else{
      wx.navigateTo({
        url: url
      })
    }
  },
  /**
   * 进入创建图书馆
  */
    goTocreate(){
    let member_id = wx.getStorageSync('mmember_id');
    wx.navigateTo({
      url: '/packageA/pages/library/create_library/create_library',
    })

  },
    //搜索图书馆
    searchLibrary(e) {
      let that = this;
      console.log(e.detail.value);
      this.setData({
        library_name: e.detail.value
      })
      if (e.detail.value == ''){
        that.getLibrarygeren();
      }
    },
      //条件查找图书馆
  getLibraryByConditon() {
    let that = this;
    let params = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      book_name: that.data.library_name,
    }
    if(params.library_name == ''){
      wx.showToast({
        title: '搜索不能为空！',
        icon:'none'
      })
      return
    }
    // 搜索书名。。。
    common.get("/newhome/search_books", params).then(res => {
      if (res.data.code == 200) {
        that.setData({
          library_member_List: res.data.data
        })
      } else if (res.data.code == 202){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  aaa(){
    return
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
    /*验证编码是否正确 */

    judge_linbarrnum:function(e){
      let that = this;
      console.log(e)
      let url = "/packageA/pages/library/personal_index/personal_index?library_id=" + that.data.library_id; 
      let library_password = e.detail.value.library_bianma;
      if (library_password==''){
        app.showToast({
          title: "请输入书店密码"
        })
      }else{
        common.get('/newhome/res_password', {
          library_id: that.data.library_id,
          library_password,
        }).then(res => {
          if(res.data.code==200){
            that.setData({
              isShowConfirm: false
            })
            wx.navigateTo({
              url: url,
            })
          }else{
            app.showToast({
              title: res.data.msg,
            })
          }
  
        })
      }
  },
  isShowConfirm(){
    this.setData({
      isShowConfirm:false
    })
  },
  getmygroup(){
    wx.navigateTo({
      url: '/packageA/pages/library/my_group/index',
    })
  },
})