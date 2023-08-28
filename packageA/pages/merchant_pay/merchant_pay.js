const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    user_id:'',
    goods_image:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options) // 这时候就会发现this.options上就会有对应的参数了
    this.setData({
      user_id : this.options.user_id,
    })
    this.getmerchantlist();
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
// 获取商家商品列表
getmerchantlist(){
  let that = this;
  let user_id = that.data.user_id;
  common.get('/admin/goods_list',{ user_id }).then(res =>{
    if(res.data.code == 200){
       //  josn 格式转换成数组
      //  let goods_image = JSON.parse( goods_images );
      that.setData({
        list:res.data.data,
      })
    }
  }).catch(e =>{
    console.log(e)
  })
},
// 点击单个商品跳转详情页面
goToActivity(e){
  console.log(e)
  let that = this;
  let user_id = e.currentTarget.dataset.user_id;
  let id = e.currentTarget.dataset.id;
  let url = "/packageA/pages/commodity_detail/commodity_detail?user_id=" + user_id + "&id=" + id;
  wx.navigateTo({
    url: url
  })
},


    /**
   * 获取小程序二维码参数
   * @param {String} scene 需要转换的参数字符串
   */
  getScene: function (scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
  }
})