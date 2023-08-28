const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    listData:[],
    personalInfo: '',
    pageIndex:0,
    // pageSize:5,
    hasMore: true,
    infoData: [],
    is_circle:'',
    grade: '',
    real_amount:'0',
    dataStatus:false,
    canIUseGetUserProfile: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    console.log('onLoad')
    // 登录
    wx.login({
      success: function (data) {
        console.log(data)
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        member_id: member_id,
        pop2: false
      })
      if (this.options.is_circle){
        that.setData({
          is_circle: options.is_circle,
          grade: options.grade,
          member_id: options.member_id,
        })
      }
      that.getData();
    }

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
    if (that.data.member_id){
      that.getData();
    }
    that.setData({
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
    })
  },
getData(){
  let that = this;
  if (that.data.is_circle == 1) {
    wx.hideShareMenu(); //禁止转发
    // 从朋友圈解锁福利进来获取
    this.getBoonCommoList('/welfare/quan_welfare');
  } else {
    // 从环保币页面今日福利进来获取
    this.getBoonCommoList('/welfare/index');
  }
},
  //获取个人信息
  getPersonInfo() {
    let that = this;
    common.get('/content/getMemberInfo', {
      member_id: that.data.member_id
    }).then(res => {
      if (res.data.code == 200) {
        wx.setStorageSync('business_info', res.data.business_info)
        wx.setStorageSync('personalInfo', res.data.data)
        that.setData({
          business_info: res.data.business_info,
          personalInfo: res.data.data
        });

      }

    })
  },
// 获取环保积分详情

  //商品列表
  getBoonCommoList(url){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    if (!that.data.hasMore){
      wx.showToast({
        title: '已加载全部商品...',
        icon:'none',
      })
      return
    }
    let prems = {
      page: that.data.pageIndex,
      member_id: wx.getStorageSync('member_id')
    }
    if ( that.data.is_circle == 1 ) {
      prems.quan_grade = that.data.grade
    }
    common.get(url, prems ).then(res => {
      if(res.data.code == 200){
        wx.hideLoading();
        let listData = that.data.listData.concat(res.data.data.goods_info);
        let flag = (res.data.data.all_page > res.data.data.now_page);
        let real_amount = res.data.data.real_amount;
        console.log(flag)
        that.setData({
          listData,
          hasMore: flag,
          real_amount: real_amount
        })
        if (listData.length <= 0) {
          setTimeout(function () {
            that.setData({
              dataStatus: true
            })
          }, 500)
        }
      }else if(res.data.code == 202){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
      
    }).catch(e => {
      that.setData({
        dataStatus: true
      })
      console.log(e)
    })
  },
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
    })
    console.log('取消授权完成')
  },

  // 去赚积分
  goTotask(e){
    console.log(e)
    let is_task = e.currentTarget.dataset.is_task;
    let url = "/pages/bank/bank?member_id=" + this.data.member_id + "&is_task=" + is_task;
    wx.reLaunch({
      url: url,
    })

  },

  goTono(){
    wx.showToast({
      title: '敬请期待...',
      icon:'none',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      hasMore: true,
      pageIndex:0,
      listData:[]
    })
    that.getData();

    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
      success() {
        that.setData({
          pageIndex: (that.data.pageIndex + 1)
        })
        console.log(that.data.pageIndex)
        if (that.data.is_circle == 1) {
          // 从朋友圈解锁福利进来获取
          that.getBoonCommoList('/welfare/quan_welfare');
        } else {
          // 从环保币页面今日福利进来获取
          that.getBoonCommoList('/welfare/index');
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
  },
  //一键复制
  copy(e) {
    let that = this
    setTimeout(function () {
      common.get("/content/copyContents", {
        content_id: e.currentTarget.dataset.contentid,
        member_id: that.data.personalInfo.id,
        copy_business: that.data.personalInfo.business_id,
        id: e.currentTarget.dataset.id
      }).then(res => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }).catch(error => {
        console.log(error);
      })
    }, 100)
  },
  //前往购物详情页
  goToActivity(e) {
    let that = this;
    console.log(e)
    let member_id = wx.getStorageSync('member_id');
    let is_wrlfare = e.currentTarget.dataset.is_wrlfare;
    let open_type = e.currentTarget.dataset.open_type;
    let discount_id = e.currentTarget.dataset.id;
    let copy_business = e.currentTarget.dataset.copy_business;
    let business_id = e.currentTarget.dataset.business_id;
    if ( open_type ){
      console.log(1)
      return
    }
    let url = "/pages/dicount_good/dicount_good?member_id=" + member_id + "&is_wrlfare=" + is_wrlfare + "&copy_business=" + copy_business + "&discount_id=" + discount_id + "&business_id=" + business_id
    wx.navigateTo({
      url: url
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) { //分享
    console.log(res)
    let that = this
    if (res.target) {
      let contentId = res.target.dataset.id;
      let earnings = res.target.dataset.earnings;
      let is_wrlfare = res.target.dataset.is_wrlfare;
      // debugger
      if (res.from === 'button') {
        let earnings = ''
        if (!earnings) {
          let url = '/pages/mine/myIdle_good/index?is_wrlfare=' + is_wrlfare + '&id=' + contentId;
          let shareTxt = res.target.dataset.sharetxt;
          let gdImages = res.target.dataset.gdimages;
          var shareImage = that.data.infoData.bgimg
          if (gdImages.length > 0) {
            var shareImage = gdImages
          }
          return {
            title: shareTxt,
            path: url,
            imageUrl: shareImage,
            success: function (res) {
              // 转发成功
              console.log(res)
            },
            fail: function (res) {
              // 转发失败
            }
          }
        } else {
          return {
            title: '今日福利',
            path: '/pages/mine/myIdle_good/index?is_wrlfare=' + is_wrlfare + '&id=' + contentId,
            success: function (res) {
              // 转发成功
              console.log(res)
            },
            fail: function (res) {
              // 转发失败
              console.log(res)
            }
          }
        }
      }
    }
    return {
      title: '今日福利',
      path: '/packageA/pages/today_benefit/index',
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
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch() {
    return
  },
  goTocircle(){
    wx.showToast({
      title: '请升级圈主等级解锁福利',
      icon: 'none'
    })
  },
  goTopoint(){
    wx.showModal({
      title: "此福利为环保圈等级福利",
      content: "请跳转环保圈升级等级",
      showCancel:false,
    })
  },
  goToHuishou() {
    wx.showModal({
      title: "此福利为上门回收福利",
      content: "是否跳转上门回收",
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/huishou/types/index'
          })
        } else if (res.cancel) {
          console.log('点击了取消')
        }
      }
    })
  }
})