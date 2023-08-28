const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const Makephoto = require('../../../assets/js/setting');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeStatus:'1',
    screenHeight:0,
    page: 1,
    wenzData: [],
    popidx: false,
    pop3: false,
    shangjia: 0,
    xiajia: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success : res => {
        console.log(res)
        that.setData({
          screenHeight:res.screenHeight*2
        })
        console.log(that.data.screenHeight)
      }
    })
    that.getwenzhang();
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
    this.setData({
      popidx: false,
      pop3: false,
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
    let that = this;
    that.setData({
      page: 1,
      wenzData: [],
    })
    that.getwenzhang();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { 
    var that = this;
    wx.showToast({
      title: '已加载全部...',
      icon:'none'
    })
  setTimeout(function(){
    wx.hideLoading()
  },1500)
  },
  lower(){
    var that = this;
    wx.showToast({
      title: '已加载全部...',
      icon:'none'
    })
    setTimeout(function(){
      wx.hideLoading()
    },1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res)
    let that = this
    if (res.target){
      if (res.from === 'button') {
        let contentId = res.target.dataset.contentid;
        let shareTxt = res.target.dataset.sharetxt;
        let gdImages = res.target.dataset.gdimages;
        let is_list = res.target.dataset.is_list;
        if(is_list == 1){
          return {
            title: shareTxt,
            path: '/packageA/pages/idleDetails_page/index?member_id=' + that.data.member_id + '&contentid=' + contentId,
            imageUrl: gdImages,
            success: function (res) {
              // 转发成功
              console.log(res)
            },
            fail: function (res) {
              // 转发失败
            }
          }
        }else{
          return {
            title: '我的闲置',
            imageUrl: '',
            path: '/pages/mine/myIdle_baby/index?member_id=' + that.data.member_id,
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
        return
      }
    }
    return {
      title: '我的闲置',
      imageUrl: '',
      path: '/pages/mine/myIdle_baby/index?member_id=' + that.data.member_id,
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
  //头部栏切换
  changeTabItem(e) {
    let that = this;
    that.setData({
      typeStatus: e.currentTarget.dataset.status,
    });
  },
  //商品列表
  getwenzhang() { 
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    let prems = {
      member_id: wx.getStorageSync('member_id'),
      page: that.data.page,
    }
    common.get('/idle/myIdle', prems).then(res => {
      let wenzData = res.data.data;
      wx.hideLoading();
      if (wenzData.length <= 0) {
        setTimeout(function () {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      that.setData({
        wenzData,
        shangjia: res.data.shangjia,
        xiajia: res.data.xiajia
      })
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
    })
  },
    // 修改
    edit(e) {
      console.log(e)
      var that = this
      var id = e.currentTarget.dataset.id;
      var is_sales = e.currentTarget.dataset.is_sales;
      wx.navigateTo({
        url: '/pages/mine/myIdlerelease/index?idle_id=' + id + '&is_sales=' + is_sales,
      })
      that.setData({
        pop3: 0
      })
    },
    openguanli(e) { //打开管理
      publicMethod.openFun(e, this)
    },
    // 点击蒙层
    popLock_itemm(){
      let that = this;
      that.setData({
        pop3 : false
      })
    },
    delCircle(e) { //删除图文
    console.log(e)
      let that = this;
      let discount_id= e.target.dataset.content_id;
      let content_id = e.target.dataset.discount_id;
      let curIdx = e.currentTarget.dataset.curidx;
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            common.get('/idle/idleDelete', {
              member_id: that.data.member_id,
              discount_id,
              content_id
            }).then(res => {
              console.log("删除图文")
              if (res.data.code == 200) {
                that.setData({
                  popidx: false,
                  pop3: false
                })
                let data = that.data.wenzData
                data.splice(curIdx, 1)
                if (data.length <= 0) {
                  that.setData({
                    dataStatus: true
                  })
                }
                that.setData({
                  wenzData: data
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
      //上下架活动
  stand(e) {
    let that = this
    let member_id = that.data.member_id;
    let stand = e.currentTarget.dataset.stand;
    let idle_id = e.currentTarget.dataset.idle;
    let is_idle = e.currentTarget.dataset.is_idle;
    let index = e.currentTarget.dataset.idx;
    let stand_text = stand == 1 ? '上架' : '下架'
    console.log(e)
    wx.showModal({
      content: '确定进行' + stand_text,
      success: function (res) {
        if (res.confirm) {
          common.get("/idle/idleStand", {
            idle_id: idle_id,
            is_idle: is_idle,
            member_id: wx.getStorageSync('member_id'),
            stand: stand
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                icon: 'success',
                duration: 2000,
                title: stand_text + '成功',
                 success: function (res) {
                   that.setData({
                     pop3: false
                   });
                   setTimeout(function () {
                    that.getwenzhang();
                   }, 1500)
                 }
              })
            } else {
              wx.showToast({
                icon: 'fail',
                duration: 1000,
                title: stand_text + '失败'
              })
            }
          })
        }
      }
    })
  },
  relIdle_btn(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      return
    }else{
      wx.navigateTo({
        url: '/pages/mine/myIdlerelease/index?is_sales=1',
        // url:'/packageA/pages/gujiubook/putshelf/index'
      })
    }
  },
})