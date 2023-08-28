const app = getApp()
const common = require('../../../../assets/js/common');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_library:'',
    library_member_List:[],
    longitude: '',
    latitude: '',
    library_name:'',
    isShowConfirm:false,
    content_num:0,
    group_see_num:0,
    group_stock:0,
    group_members:0,
    is_leamsg:false,
    group_content:[],
    library_password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    that.setData({
      member_id: wx.getStorageSync('member_id')
    })

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
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    that.getLibrarygeren();
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
  // 获取留言列表
  getgroupleave(){
    let that = this;
    common.get('/newhome/library_tuan_content',{
      member_id:wx.getStorageSync('member_id'),
      library_password:that.data.library_password
    }).then(res =>{
      if(res.data.code == 200){
        console.log(res)
        that.setData({
          group_content:res.data.data.splice(0,1)
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
  //下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    let that = this;
    that.setData({
      library_member_List:[],
    })
    that.getLibrarygeren();
    wx.stopPullDownRefresh();
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
  //查看个人图书馆
  getLibrarygeren() {
    let that = this;
    let params = {
      member_id:that.data.member_id,
      lng: that.data.longitude,
      lat: that.data.latitude,
    }
    wx.showLoading({
      title: '加载中...',
    })
    common.get("/newhome/my_group", params).then( res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading();
        let library_member_List = res.data.data[0].libraryInfo;
           
        that.setData({
          library_member_List,
          content_num:res.data.data[0].liuyan_cishu,
          group_see_num:res.data.data[0].liulan_num,
          group_stock:res.data.data[0].tuan_num,
          group_members:res.data.data[0].tuan,
          my_library: res.data.data[0].my_library,
          library_password:library_member_List[0].library_password,
        })
        that.getgroupleave();
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
  /**
   * 进入个人图书馆首页 
  */
  goToindex_personal(e){
    console.log(e)
    let that = this;
    let library_id = e.currentTarget.dataset.library_id;
    let url = "/packageA/pages/library/personal_index/personal_index?library_id=" + library_id 
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 进入创建图书馆
  */
    goTocreate(){
    let member_id = wx.getStorageSync('mmember_id');
    wx.navigateTo({
      url: '/packageA/pages/library/create_library/create_library',
    })

  },
    //搜索图书馆
    searchLibrary(e) {
      let that = this;
      console.log(e.detail.value);
      this.setData({
        library_name: e.detail.value
      })
      if (e.detail.value == ''){
        that.getLibrarygeren();
      }
    },
      //条件查找图书馆
  getLibraryByConditon() {
    let that = this;
    let params = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      book_name: that.data.library_name,
      member_id: wx.getStorageSync('member_id'),
    }
    if(params.library_name == ''){
      wx.showToast({
        title: '搜索不能为空！',
        icon:'none'
      })
      return
    }
    // 搜索书名。。。
    common.get("/newhome/my_group_search", params).then(res => {
      if (res.data.code == 200) {
        that.setData({
          library_member_List: res.data.data
        })
      } else if (res.data.code == 202){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
  my_attention(){
    wx.navigateTo({
      url: '/packageA/pages/library/my_attention/index',
    })
  },
// 发布留言
release_btn(){
  this.setData({
    is_leamsg:true
  })
},
//查看全部留言
goTolist_detail(){
  let that = this;
  wx.navigateTo({
    url: '/packageA/pages/library/group_leave/index?library_password=' + that.data.library_password,
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
    // member_photo:that.data.user_info.avatarUrl,
    // member_name:that.data.user_info.nickName,
    member_id:that.data.member_id,
    content : that.data.leamsg,
    library_password:that.data.library_password,
  } 
  if(prems.content == ''){
    wx.showToast({
      title: '请填写留言内容...',
      icon:'none'
    })
    return
  }
  common.get('/newhome/library_tuan_content_add',prems).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '提交成功！',
        icon:'success'
      })
      that.setData({
        is_leamsg:false,
        library_member_List:[],
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
})