const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    my_member_id:'',
    library_id:'',
    book_info:[],
    is_leamsg:false,
    leamsg:'',
    library_content:[],
    is_dongtai:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
      if(options.library_id){
        that.setData({
          library_id:options.library_id,
          member_id: wx.getStorageSync('member_id'),
        })
      }
      if(options.is_dongtai == 1){
        that.setData({
          member_id: wx.getStorageSync('member_id'),
          my_member_id:options.member_id,
          is_dongtai:options.is_dongtai,
        })
      }
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
  if(that.data.is_dongtai == 1){
    that.getdongtai_list();
  }else{
    that.get_member_library_detail();
  }
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
  let library_id = that.data.library_id;
  wx.showLoading({
    title: '加载中...',
  })
  common.get('/library/get_member_library_detail',{
    library_id,
  }).then(res =>{
    if(res.data.code ==200){
      wx.hideLoading();
      that.setData({
        library_content:res.data.data.library_content,
        my_member_id: res.data.data.library_info.member_id,
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
// 动态留言
getdongtai_list(){
  let that = this;
  wx.showLoading({
    title: '加载中...',
  })
  common.get("/content_personal/index_message",{
    member_id:that.data.my_member_id,
  }).then(res =>{
    if(res.data.code == 200){
      wx.hideLoading();
      that.setData({
        library_content:res.data.data
      })
    }else{
      wx.hideLoading();
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })
    }
  }).catch(e =>{
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
},
delCircle(e) { //删除图文
  let that = this;
  let id = e.currentTarget.dataset.id;
  let index = e.currentTarget.dataset.index;
  wx.showModal({
    title: '提示',
    content: '确定删除吗？',
    success: function (res) {
      if (res.confirm) {
        common.get('/library/delete_library_content', {
          member_id: wx.getStorageSync('member_id'),
          library_id: that.data.library_id,
          id
        }).then(res => {
          console.log("删除图文")
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
            let data = that.data.library_content
            data.splice(index, 1)
            that.setData({
              library_content: data
            })
          }else{
            app.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
        }).catch(e => {
          app.showToast({
            title: "数据异常",
          })
          console.log(e)
        })
      }
    }
  })

},
deldongtai(e) { //删除个人动态图文
  let that = this;
  let id = e.currentTarget.dataset.id;
  let index = e.currentTarget.dataset.index;
  wx.showModal({
    title: '提示',
    content: '确定删除吗？',
    success: function (res) {
      if (res.confirm) {
        common.get('/content_personal/delete_index_message', {
          member_id: wx.getStorageSync('member_id'),
          id
        }).then(res => {
          console.log("删除图文")
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
            let data = that.data.library_content
            data.splice(index, 1)
            that.setData({
              library_content: data
            })
          }else{
            app.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
        }).catch(e => {
          app.showToast({
            title: "数据异常",
          })
          console.log(e)
        })
      }
    }
  })

},
})