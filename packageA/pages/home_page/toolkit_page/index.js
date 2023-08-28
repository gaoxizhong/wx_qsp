const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number_r: 0,
    is_true:false,
    latitude: '',
    longitude: '',
    number_r: 0,
    is_goToSign:true,
    // ======= 做任务赚积分数据  
    is_Signtask:0,
    task_id: 0,
    is_signTaskMask: false,
    taskMaskpreview_title:'',
    taskMaskpreview_jifen:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      number_r:Math.floor(Math.random()*10000),
    })
    // ======= 做任务赚积分数据  
    if(options.is_Signtask){
      that.setData({
        is_Signtask: options.is_Signtask,
        task_id: options.task_id
      })
      that.getDoneTask(options.task_id,options.jifen);
    }
    // ======= 做任务赚积分数据`   
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this,this.data.longitude,this.data.latitude);
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
    that.getData();
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
  getData() { //初始化数据
    let that = this;
    that.getClassmodule();

    //全局配置
  },
  getClassmodule(){
    let that = this;
    common.get('/newhome/index',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200) {
        that.setData({
          is_true:res.data.data.is_true,
        })
      }
    })
  
  },
  gotolottery(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  // 每日签到
  goToSign(){
    publicMethod.goToSign(this,this.data.longitude,this.data.latitude);
  },
  goTobank(){
    publicMethod.goTobank();
  },
  click_bg(){
    this.setData({
      is_preview:false
    })
  },
  // =================== 新增 ===================
  goto_adshop(e){
    publicMethod.goto_adshop(e,this);
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // =================== 新增 ===================
  // =========  做任务赚积分 弹窗功能 =======
  // 做任务赚积分跳转过来
  getDoneTask(id,jifen){
    let that = this;
    let task_id = id;
    let taskMaskpreview_jifen = jifen;
    common.get('/mine/index?op=done_task',{
      member_id: wx.getStorageSync('member_id'),
      task_id,
    }).then(res =>{
      if(res.data.code == 200){
      if(that.data.is_Signtask == '1'){
        that.setData({
          is_signTaskMask: true,
          taskMaskpreview_title:'欢迎了解图书循环',
          taskMaskpreview_jifen,
        })
        setTimeout(function(){
          that.setData({
            is_signTaskMask: false,
            taskMaskpreview_title:'',
            taskMaskpreview_jifen:'',
            is_Signtask: 0
          })
        },2000)
      }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  click_mask(){
    this.setData({
      is_signTaskMask: false,
      taskMaskpreview_title:'',
      taskMaskpreview_jifen:'',
      is_Signtask: 0
    })
  },
// =========  做任务赚积分 弹窗功能 =======
})