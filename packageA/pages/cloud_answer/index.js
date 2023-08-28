const app = getApp()
const common = require('../../../assets/js/common');
var WxParse = require('../../../wxParse/wxParse.js');
const publicMethod = require('../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    poster_tabs:[],
    swiper_index:1,
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    is_jiazai:true,
    longitude:'',
    latitude:'',
    paper_id:'',
    assistant_id:'',
    image:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if (options.scene) {
      /** 
      * object.assign(any,any1); 对象的合并
      * 获取二维码参数，绑定在当前this.options对象上
      */ 
      Object.assign(this.options, this.getScene(options.scene))
    }
    console.log(this.options)
    this.setData({
      activity_id: this.options.activity_id,
      paper_id: this.options.paper_id,
      assistant_id: this.options.assistant_id
    })
    if(this.options.id){
      this.setData({
        assistant_id:this.options.id
      })
    }
    this.getinfo(this.options.assistant_id,this.options.paper_id);

    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
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
    this.setData({
      is_jiazai:true,
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
  gotoAnswer(){
    wx.navigateTo({
      url: '/packageA/pages/cloudAnswer_pages/index?paper_id=' + this.data.paper_id + '&assistant_id=' + this.data.assistant_id,
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
},
getinfo(a,p){
  let that = this;
  let assistant_id = a;
  let paper_id = p;
  let pearm = {}
  if(assistant_id !='undefined' && assistant_id && assistant_id !='' && assistant_id !='0'  && assistant_id != 0 && assistant_id !='null'){
    pearm.assistant_id = assistant_id
  }else{
    pearm.paper_id = paper_id
  }
  common.get("/activity/topic_notice",pearm).then(res =>{
    if(res.data.code == 200){
      let notice = res.data.data.notice;
      WxParse.wxParse('notice', 'html', notice, that, 1);
      that.setData({
        image: res.data.data.image
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
})