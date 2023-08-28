const app = getApp()
const common = require('../../../../assets/js/common');
var WxParse = require('../../../../wxParse/wxParse.js');
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    id:'',   // 项目id
    paper_id:'', // 试卷id
    image:[],
    is_pop:false,
    is_jiazai:true,
    study_img:'',
    area_list: [],
    need_area: false,
    need_mobile: false,
    need_name: false,
    area_index:0,
    member_area:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      /** 
      * object.assign(any,any1); 对象的合并
      * 获取二维码参数，绑定在当前this.options对象上
      */ 
      Object.assign(this.options, this.getScene(options.scene))
    }
    if(this.options.id){
      this.setData({
        id: this.options.id
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
    that.getinfo();
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
    let that = this;
    let id = that.data.id; // 项目id
    let paper_i = that.data.id; // 试卷id
    return {
      title: that.data.title,
      imageUrl: '',
      path: '/packageB/pages/communitySurvey/learningContent/index?id=' + id,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
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
  // 获取公告及学习内容
  getinfo(){
    let that = this;
    let id = that.data.id;
    let pearm = {
      project_id:id,
      member_id: wx.getStorageSync('member_id'),
    }
    common.get("/topic_project/index?op=detail",pearm).then(res =>{
      if(res.data.code == 200){
        let notice = res.data.data.project.notice;
        WxParse.wxParse('notice', 'html', notice, that, 1);
        let paper_id = res.data.data.project.paper_id;
        that.setData({
          // image: res.data.data.image
          study_img: res.data.data.project.study_img,
          paper_id,
          title: res.data.data.project.title
        })
        let can_answer = res.data.data.can_answer;
        if(!can_answer){
          wx.showModal({
            content: '您已完成参与，请勿重复参加',
            confirmText:'结果查看',
            confirmColor:'#ff1111',
            showCancel:false,
            success:function(res){
              if (res.confirm){
                wx.reLaunch({
                  url: '/packageB/pages/communitySurvey/fractionPages/index?project_id=' + id + '&paper_id=' + paper_id,
                })
              }
            }
          })
        }
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

  showInfo(){
    let that = this;
    // that.setData({
    //   is_pop:true,
    // })
    that.gotoTestpaper();

  },
  click_useinter(){
    let that = this;
    that.setData({
      is_pop:false
    })
  },
  // 信息弹窗
  formSubmit(e){
    let that = this;
    console.log(e)
    let pream = {
      member_id: wx.getStorageSync('member_id'),
      update : 1,
    }
    let value = e.detail.value;
    for(let key in value){
      pream[key] = value[key]
    }
    if(that.data.need_name && pream.member_name == ''){
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      })
      return
    }
    if(that.data.need_area && pream.member_area == ''){
      wx.showToast({
        title: '请选择社区',
        icon:'none'
      })
      return
    }
    if(that.data.need_mobile && pream.member_phone == ''){
      wx.showToast({
        title: '请填写电话',
        icon:'none'
      })
      return
    }

    let is_jiazai = that.data.is_jiazai;
    if(!is_jiazai){
      wx.showToast({
        title: '请勿重复提交',
        icon:'none'
      })
      return
    }
    that.setData({
      is_jiazai:false
    })
    wx.showLoading({
      title:'加载中...'
    })
    common.get("",pream).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        setTimeout(function(){
          that.gotoTestpaper();
          that.setData({
            is_pop:false,
            is_jiazai:false
          })
        },1000)
      }else{
        wx.hideLoading();
        that.setData({
          is_jiazai:true
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e);
      wx.hideLoading();
      that.setData({
        is_jiazai:true
      })
    })
  },
  // 跳转试卷
  gotoTestpaper(){
    wx.navigateTo({
      url: '/packageB/pages/communitySurvey/testpaperPages/index?project_id=' + this.data.id +'&paper_id=' + this.data.paper_id,
    })
  },
  bindPickerChange(e){
    let member_area = this.data.area_list[e.detail.value]
    this.setData({
      member_area,
    })
  },
})