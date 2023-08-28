const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:"",
    work_list:[], // 作品推荐
    is_sale: 1, //0全部 1售卖 2展示
    space:{},
    is_vip: false,
    space_list:[],
    v_back:''
  },
  getspaceList(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=space_list',{
      is_vip:'1',
      member_id: wx.getStorageSync('member_id'),
      page: 1,
      is_sale: 0,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let newspaceList = res.data.data.space_list;
        that.setData({
          space_list: newspaceList,
        })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
    this.imageerror();
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
      member_id: wx.getStorageSync('member_id')
    })
    that.getworkList();
    that.getmy_space();
    // 刷新组件
    // this.selectComponent("#userList").getspaceList();
    that.getspaceList();

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
  // 点击查看更多人作品
  gotoAll(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/everyone_workList/index',
    })
  },
  // 点击作品推荐全部
  gotoAllcom(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/all_commodity/index',
    })
  },
  // 点击发布按钮
  gotoCreate(){
    let that = this;
    let is_vip = that.data.is_vip;
    if(!is_vip){
      wx.showToast({
        title: '非会员暂无法使用！',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageB/pages/livingHall/create_work/index',
    })
  },
  gotoReserveHome(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/reserve_home/index',
    })
  },
  // 点击会员权益跳转
  gotoMemberCentre(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_centre/index',
    })
  },
   // 获取作品
  getworkList(){
    let that = this;
    common.get('/life/index?op=work_list',{
      page: 1,
      page_size:5,
      is_sale: 1, //0全部 1售卖 2展示
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          work_list: res.data.data.work_list
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  //查看我的信息
  getmy_space(){
    let that = this;
    common.get('/life/index?op=my_space',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let space = res.data.data.space;
        let is_vip = res.data.data.is_vip;
        that.setData({
          space,
          is_vip
        })
      }else{

      }
    }).catch( e =>{
      console.log(e)
    })
  },
  clickBuy(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      // url: '/packageB/pages/livingHall/reserve_buypages/index?id=' + id,
      url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
    })
  },
  gotoPersonalHome(e){
    let mid = e.currentTarget.dataset.member_id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/personal_home/index?mid=' + mid,
    })
  },
  clickSx(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/projectList/index',
    })
  },
  imageerror(e){
    console.log(e)
    this.setData({
      v_back: 'https://oss.qingshanpai.com/banner/shopbg-error.png'
    })
  },
})