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
    page:1,
    pagesize:5,
    aaa:false,
    hasMore:true,
    dd:{},
    setPassword:false,
    is_login:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if( that.data.is_login == 1 ){
      that.setData({
        my_library:'',
        library_member_List:[],
        isShowConfirm:false,
        page:1,
        aaa:false,
        hasMore:true,
        dd:{},
        setPassword:false,
      })
      that.getLibrarygeren();
    }

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
      library_member_List:[],
      page:1,
      hasMore:true,
    })
    that.getLibrarygeren();

    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      page:(that.data.page + 1),
    })
    that.getLibrarygeren();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //查看个人图书馆
  getLibrarygeren() {
    let that = this;
    let page = that.data.page;
    let params = {
      member_id:wx.getStorageSync('member_id'),
      lng: that.data.longitude || 0,
      lat: that.data.latitude || 0,
      page,
    }
    wx.showLoading({
      title: '加载中...',
    })
    if (!this.data.hasMore){
      wx.showToast({
        title: '已加载全部...',
        icon:'none'
      })
      return
    }
    common.get("/library/get_member_library_list", params).then( res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading();
        var count = res.data.total;
        var newdata = that.data.library_member_List.concat(res.data.data[0].libraryInfo);
        var flag_full = that.data.page * that.data.pagesize < count;
        that.setData({
          library_member_List: newdata,
          my_library: res.data.data[0].my_library,
          hasMore:flag_full,
          aaa:true,
          dd:res.data.dd
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
   * 进入个人图书馆首页 
  */
  goToindex_personal(e){
    console.log(e)
    let that = this;
    let library_id = e.currentTarget.dataset.library_id;
    let is_password = e.currentTarget.dataset.is_password;
    let url = "/packageA/pages/library/personal_index/personal_index?library_id=" + library_id + '&member_id=' + wx.getStorageSync('member_id');
    if(is_password == 1){
      that.setData({
        library_id,
        isShowConfirm:true,
      })
      return
    }else{
      wx.navigateTo({
        url: url
      })
    }
    // let info_status = that.data.my_library?that.data.my_library.status:0;
    // if(!info_status){
    //  wx.showModal({
    //    title: '请先完善信息',
    //    content: '是否前去完善个人信息',
    //    confirmText:'完善',
    //    cancelText:'暂不',
    //    success (res) {
    //      if(res.confirm){
    //         wx.navigateTo({
    //           url: '/packageA/pages/library/perfect_info/perfect_info?library_id=' + that.data.my_library.id,
    //         })
    //      }
    //    }
    //  })
    // }else{
    //   if(is_password == 1){
    //     that.setData({
    //       library_id,
    //       isShowConfirm:true,
    //     })
    //     return
    //   }else{
    //     wx.navigateTo({
    //       url: url
    //     })
    //   }
    // }

  },
  /**
   * 进入创建图书馆
  */
    goTocreate(){
    let member_id = wx.getStorageSync('mmember_id');
    wx.navigateTo({
      url: '/packageA/pages/library/create_library/create_library',
      //  url: '/packageA/pages/library/perfect_info/perfect_info',
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
        that.setData({
          library_member_List:[],
          page:1,
          hasMore:true
        })
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
    }
    if(params.library_name == ''){
      wx.showToast({
        title: '搜索不能为空！',
        icon:'none'
      })
      return
    }
    // 搜索书名。。。
    common.get("/newhome/search_books", params).then(res => {
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
  aaa(){
    return
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
    /*验证编码是否正确 */

    judge_linbarrnum:function(e){
      let that = this;
      console.log(e)
      let url = "/packageA/pages/library/personal_index/personal_index?library_id=" + that.data.library_id; 
      let library_password = e.detail.value.library_bianma;
      if (library_password==''){
        app.showToast({
          title: "请输入书店密码"
        })
      }else{
        common.get('/newhome/res_password', {
          library_id: that.data.library_id,
          library_password,
        }).then(res => {
          if(res.data.code==200){
            that.setData({
              isShowConfirm: false
            })
            wx.navigateTo({
              url: url,
            })
          }else{
            app.showToast({
              title: res.data.msg,
            })
          }
  
        })
      }
  },
  isShowConfirm(){
    this.setData({
      isShowConfirm:false
    })
  },
  getmygroup(){
    let that = this;

    if(!that.data.aaa){
      return
    }
    if(!that.data.my_library){
      wx.showModal({
        cancelColor: 'cancelColor',
        content:'请先创建个人书店并设置密码，好友或邻居设置相同的密码即可进入同一团组',
        showCancel:false,
        confirmColor:'#ff0000',
        success(res) {
          if(res.confirm){
            wx.navigateTo({
              url: '/packageA/pages/library/create_library/create_library',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }else if(!that.data.my_library.library_password){
      that.setData({
        setPassword: true
      })
      return
    }else{
      wx.navigateTo({
        url: '/packageA/pages/library/my_group/index',
      })
      return
    }

  },
  my_attention(){
    wx.navigateTo({
      url: '/packageA/pages/library/my_attention/index',
    })
  },
  set_library_password(e){
    console.log(e)
    let that = this;
    let library_password = e.detail.value.library_password;
    if(!library_password || library_password == ''){
      wx.showToast({
        title: '请输入密码！',
        icon: 'none'
      })
      return
    }
    common.get('/library/make_library',{ 
      library_id:that.data.my_library.id,
      library_password,
      member_id: wx.getStorageSync('member_id'),
      info_status: 2
    }).then( res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '设置成功！',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          setPassword: false
        })
        wx.navigateTo({
          url: '/packageA/pages/library/my_group/index',
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  setPassword_cover(){
    this.setData({
      setPassword: false
    })
  }
})