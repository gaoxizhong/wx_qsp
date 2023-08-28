const app = getApp()
const common = require('../../../assets/js/common');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_library:'',
    member_List:[],
    longitude: '',
    latitude: '',
    library_name:'',
    isShowConfirm:false,
    content_num:0,
    browse:0,
    idle_count:0,
    count:0,
    is_leamsg:false,
    content_list:[],
    library_password:'',
    password:''
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
    })
    console.log(that.data.latitude)
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        console.log(res)
        that.setData({
         latitude : Number(res.latitude),
         longitude : Number(res.longitude)
        })
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        that.getLibrarygeren();
      },
      fail: function(res) {
        wx.showModal({
          title: '需要开启手机定位',
          content: '请前去开启GPS服务',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getLibrarygeren();

        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
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

  //下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    let that = this;
    that.setData({
      member_List:[],
    })
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getLibrarygeren();
      },
      fail: function(res) {
        wx.showModal({
          title: '需要开启手机定位',
          content: '请前去开启GPS服务',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getLibrarygeren();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
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

  getLibrarygeren() {
    let that = this;
    let params = {
      member_id:wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat: that.data.latitude,
    }
    wx.showLoading({
      title: '加载中...',
    })
    common.get("/idle/group", params).then( res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading();
        let member_List = res.data.data.members;
        that.setData({
          member_List,
          browse:res.data.data.browse,
          count:res.data.data.count,
          idle_count:res.data.data.idle_count,
          content_list: res.data.data.content_list.splice(1),
          content_num: Number(res.data.data.content_list.length),
          password: res.data.data.password,
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
  /**
   * 进入个人闲置
  */
  goToindex_personal(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    let url = "/pages/mine/myIdle/index?member_id="+ id;
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
    url: '/packageA/pages/mygroup_leave/index?member_id=' + wx.getStorageSync('member_id'),
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
  let prems = {
    member_id:wx.getStorageSync('member_id'),
    content : that.data.leamsg,
    password :that.data.password,
  } 
  if(prems.content == ''){
    wx.showToast({
      title: '请填写留言内容...',
      icon:'none'
    })
    return
  }
  common.post('/idle/content_add',prems).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '提交成功！',
        icon:'success'
      })
      that.setData({
        is_leamsg:false,
        member_List:[],
        leamsg:'',
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