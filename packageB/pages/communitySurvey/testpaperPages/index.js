const app = getApp();
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerList:[],
    is_return: true,
    id:'',
    paper_id:'',   // 试卷id
    project_id:'', // 项目id
    area_list: [],
    need_area: false,
    need_mobile: false,
    need_name: false,
    area_index:0,
    is_pop: false,
    is_jiazai: false,
    name:'', // 姓名
    mobile:'', // 电话
    area:'',  // 社区
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * Object.assign(any,any1) 用于对象的合并
     * 获取二维码的参数，绑定到当前this.options对象上
     */
    if(options.scene){
      Object.assign(this.options,this.getScene(options.scene))
    }
    if(this.options.id){
      this.setData({
        id: this.options.id
      })
    }
    if(this.options.project_id){
      this.setData({
        project_id: this.options.project_id
      })
    }
    if(this.options.paper_id){
      this.setData({
        paper_id: this.options.paper_id
      })
    }
    // 禁止右上角转发
    wx.hideShareMenu();
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
      is_return: true,
      answerList:[],
    })
    // 获取试卷列表
    that.getanswerList();
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

  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const index = e.currentTarget.dataset.index;
    const answerList = this.data.answerList;
    const items = answerList[index].data.option;
    answerList[index].data.user_key = e.detail.value;
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].key === e.detail.value;
    }
    this.setData({
      answerList,
    })
    console.log(this.data.answerList)
  },

  // 获取试卷
  getanswerList(){
    let that = this;
    common.get('/topic/show',{
      member_id: wx.getStorageSync('member_id'),
      id: that.data.paper_id
    }).then(res =>{
      if(res.data.code == 200){
        let answerList = res.data.data?res.data.data.list:[];
        that.setData({
          answerList,
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },

  // 提交答题页
  formSubmit(e){
      let that = this;
      let data = that.data.answerList;
      let project_id = that.data.project_id;  // 项目id
      let paper_id = that.data.paper_id;  // 试卷id
      let pream = {
        member_id: wx.getStorageSync('member_id'),
        paper_id,
        data,
      }
      let value = e.detail.value;
      for(let key in value){
        pream[key] = value[key]
      }
      console.log(pream)
      if(that.data.need_name && pream.name == ''){
        wx.showToast({
          title: '请填写姓名',
          icon:'none'
        })
        return
      }
      if(that.data.need_area && pream.area == ''){
        wx.showToast({
          title: '请选择社区',
          icon:'none'
        })
        return
      }
      if(that.data.need_mobile && pream.mobile == ''){
        wx.showToast({
          title: '请填写电话',
          icon:'none'
        })
        return
      }
      let is_return = that.data.is_return;
      if(!is_return){
        wx.showToast({
          title: '正在提交中，请勿重复提交',
          icon:'none'
        })
        return
      }
      that.setData({
        is_return: false
      })
      wx.showLoading({
        title: '提交中...',
      })
      common.post('/topic/answer',pream).then(res =>{
        wx.hideLoading();
        setTimeout(function(){
          wx.reLaunch({
            url: '/packageB/pages/communitySurvey/fractionPages/index?project_id=' + project_id + '&paper_id=' + paper_id,
          })
          return
        },1500)
      }).catch(e =>{
        that.setData({
          is_return: false
        })
        wx.hideLoading();
        console.log(e)
      })
    },
  // 获取项目详情
  getinfo(){
    let that = this;
    let id = that.data.project_id;
    let pearm = {project_id:id}
    common.get("/topic_project/index?op=detail",pearm).then(res =>{
      if(res.data.code == 200){
        that.setData({
          title: res.data.data.project.paper.title,
          area_list: res.data.data.project.area_list,
          need_area: res.data.data.project.need_area,   // 社区
          need_mobile: res.data.data.project.need_mobile, // 电话
          need_name: res.data.data.project.need_name,  // 姓名
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
  showInfo(){
    let that = this;
    that.setData({
      is_pop:true,
    })
  },
  click_useinter(){
    let that = this;
    that.setData({
      is_pop:false
    })
  },

  bindPickerChange(e){
    let area = this.data.area_list[e.detail.value]
    this.setData({
      area,
    })
  },













    /**
   * 获取小程序二维码参数
   * {string} scene 需要转换的参数字符串
   */
  getScene(scene = "") {
    if(scene == "") return {} 
    let res = {}
    let params = decodeURIComponent(scene).split ("&")
    params.forEach( item => {
      let pram = item.split("=")
      res[pram[0]] = parm[1]
    })
    return res
  },

})