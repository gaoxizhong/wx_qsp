const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    library_id:'',
    book_info:[],
    is_leamsg:false,
    leamsg:'',
    library_content:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
      that.setData({
        library_password:options.library_password,
        member_id: wx.getStorageSync('member_id')
      })
    // 登录
    wx.login({
      success: function (data) {
        console.log(data)
        that.setData({
          loginData: data
        })
      }
    })
},
 
  /**
   * 生命周期函数--监听页面初次渲染完成
  **/

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    console.log('触发了onshow')

    that.setData({
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
    })
    that.getData();
  },
getData(){
  let that = this;
  that.get_member_library_detail();
},


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) { //分享
    console.log(res)
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch() {
    return
  },
// 获取个人图书馆详情信息
get_member_library_detail(){
  let that = this;
  wx.showLoading({
    title: '加载中...',
  })
  common.get('/newhome/library_tuan_content',{
    member_id:wx.getStorageSync('member_id'),
    library_password:that.data.library_password,
  }).then(res =>{
    if(res.data.code ==200){
      wx.hideLoading();
      that.setData({
        library_content:res.data.data,
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

// 发布留言
release_btn(){
  this.setData({
    is_leamsg:true
  })
},

//  点击遮罩层
release_mrsk(){
  this.setData({
    is_leamsg:false
  })
},

//  编写留言
leamsg(e){
  console.log(e)
  let leamsg = e.detail.value;
  this.setData({
    leamsg,
  })
},

// 提交留言
leamsg_sub() {
  let that = this;
  let user_info = that.data.user_info;
  console.log(user_info)
  let prems = {
    member_id:that.data.member_id,
    member_photo:that.data.user_info.avatarUrl,
    member_name:that.data.user_info.nickName,
    content : that.data.leamsg,
    library_id:that.data.library_id,

  } 
  if(prems.content == ''){
    wx.showToast({
      title: '请填写留言内容...',
      icon:'none'
    })
    return
  }
  common.post('/library/leave_message',prems).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '提交成功！',
        icon:'success'
      })
      that.setData({
        is_leamsg:false,
        book_info:[],
        leamsg:'',
        library_content:[],
      })
      that.onShow();
    }else{
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })
    }
  }).catch(e =>{
    console.log(e)
  })
}
})