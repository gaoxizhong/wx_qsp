const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    paper_id:'',   // 试卷id
    project_id:'', // 项目id
    title: '',
    member:{},
    area_list: [],
    need_area: false,
    need_mobile: false,
    need_name: false,
    need_promise: false, // 承诺书
    area_index:0,
    promise: '',
    is_promise:false,
    name:'', // 姓名
    mobile:'', // 电话
    area:'',  // 社区
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.project_id){
      this.setData({
        project_id: options.project_id
      })
    }
    if(options.paper_id){
      this.setData({
        paper_id: options.paper_id
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
    that.getmemberfs();
  },
  // 获取项目详情
  getinfo(){
    let that = this;
    let project_id = that.data.project_id;
    let pearm = { 
      project_id,
      member_id: wx.getStorageSync('member_id')
     }
    common.get("/topic_project/index?op=detail",pearm).then(res =>{
      if(res.data.code == 200){
        that.setData({
          title: res.data.data.project.paper.title,
          need_promise: res.data.data.project.need_promise, // 承诺书
          promise: res.data.data.project.promise,
          area_list: res.data.data.project.area_list,
          need_area: res.data.data.project.need_area,   // 是否显示社区
          need_mobile: res.data.data.project.need_mobile, // 是否显示电话
          need_name: res.data.data.project.need_name,  // 是否显示姓名
          name: res.data.data.done.name?res.data.data.done.name:'', // 姓名
          mobile: res.data.data.done.mobile?res.data.data.done.mobile:'', // 电话
          area: res.data.data.done.area?res.data.data.done.area:'',  // 社区
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
  getmemberfs(){
    let that = this;
    let paper_id = that.data.paper_id;
    common.get("/activity/student",{
      member_id: wx.getStorageSync('member_id'),
      paper_id
    }).then(res =>{
      if(res.data.code == 200){
        this.setData({
          num: Number(res.data.data.my_i),
          member: res.data.data.member,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  showInfo(){
    this.setData({
      is_promise: true,
      need_promise: false
    })
  },
  
  formSubmit(e){
    let that = this;
    common.get("/topic_project/index?op=promise",{
      member_id: wx.getStorageSync('member_id'),
      paper_id: that.data.paper_id,
      name: that.data.name,
      mobile: that.data.mobile,
      area: that.data.area
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '知晓成功！',
          icon: 'none'
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/index/index',
          })
        },1000)
      }
    }).catch(e =>{
      console.log(e)
    })
  }

})