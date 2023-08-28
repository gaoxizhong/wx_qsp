const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoItemList:[],
    is_cler: false,
    selExt_id: 0,
    is_chooseExt: 0,
    old_ext: 0,
    is_chooseExt_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.is_chooseExt){
      console.log(options)
      this.setData({
        is_chooseExt: options.is_chooseExt,
        is_chooseExt_id: options.is_chooseExt_id,
      })
    }
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
    that.getinfoItemList();
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
  fixed_btn(){
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_infoAdd/index',
    })
  },
  more_btn(e){
    let that = this;
    let ext_id = e.currentTarget.dataset.ext_id;
    let is_chooseExt_id = that.data.is_chooseExt_id;
    wx.navigateTo({
      url:'/packageA/pages/home_page/volunacti_infoAdd/index?ext_id=' + ext_id +'&is_chooseExt_id=' + is_chooseExt_id,
    })
  },
  
  getinfoItemList(){
    let that = this;
    common.get('/activity/ext_list',{
      member_id: wx.getStorageSync('member_id'),
    }).then( res=>{
      if(res.data.code == 200){
        that.setData({
          infoItemList: res.data.data.ext_list,
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
  //选择信息
  chooseRecover(e) {
    let that = this;
    console.log(e)
    let ext_id = e.currentTarget.dataset.ext_id;
    that.setData({
      selExt_id: Number(ext_id),
      is_cler: true
    })
  },
  // 点击取消
  cler_marsk(){
    this.setData({
      is_cler: false
    })
  },
  // 点击确认
  submit_btn(){
    let that = this;
    let selExt_id = that.data.selExt_id;
    let infoItemList = that.data.infoItemList;
    infoItemList.forEach(ele =>{
      if(ele.ext_id == selExt_id){
       wx.setStorageSync('selectedExt', ele);
       wx.navigateBack({
         delta: 1,
       })
      }
    })

  }
})