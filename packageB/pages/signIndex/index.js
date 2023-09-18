const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
let videoAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signCircle:{}, // 签到动态数据
    longitude: '',
    latitude: '',
    like_status: true,
    m_id:'',  //此条动态的那个人的member_id
    member_id:'', // 当前查看人的member_id
    more_integral:[], // 积分任务列表
    signtList:[], // 签到好友列表
    is_true:false,  // 是否签到状态
    is_goToSign: true,
    is_fx: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options)
    let that = this;
    if(this.options.m_id){
      that.setData({
        m_id: options.m_id
      })
    }
    if(options.is_fx){
      that.setData({
        is_fx: options.is_fx
      })
    }
    // wx.getLocation({
    //   type: 'wgs84',
    //   success:function(res){
    //     that.setData({
    //       longitude: Number(res.longitude),
    //       latitude: Number(res.latitude),
    //     })
    //   },
    //   fail: function(res) {
    //     console.log('未获取到定位')
    //     that.setData({
    //       latitude: '',
    //       longitude: ''
    //     })
    //   }
    // })
      // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-f6ea451e26a50fda'
      })
      videoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
         
           // 每日签到
          that.goToSign();
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '中途退出，未签到成功',
            icon:'none'
          })
        }
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
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      latitude : app.globalData.latitude,
      longitude : app.globalData.longitude,
    })
    console.log(this.data.member_id)
    this.getsignCircle(); // 签到首页数据
    this.goToaddintegral(); // 积分任务列表
    this.getSigntList(); // 签到好友列表
    this.getClassmodule(); // 签到状态
  },
  //  获取首页数据
  getsignCircle(){
    let that = this;
    let peams = {
      member_id: that.data.m_id,
      // member_id: 166758,
      lat: that.data.latitude,
      lng: that.data.longitude
    }
    if(that.data.is_fx){
      peams.is_fx = that.data.is_fx;
    }
    common.get('/mine/index?op=sign_home',peams).then(res =>{
      if(res.data.code == 200){
        that.setData({
          signCircle: res.data.data,
          is_fx: 0,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  getSigntList(){
    let that = this;
    common.get('/mine/index?op=friend_content',{
      member_id: wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat: that.data.latitude
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          signtList: res.data.data.friend_content.splice(0,3)
        })
      }else{
        wx.showToast({
          title: res.data.msg,
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
  onShareAppMessage: function (e) {
    let that = this;
    let signCircle = that.data.signCircle;
    let url = '/packageB/pages/signIndex/index?m_id=' + signCircle.content.member_id + '&is_fx=1';
    return {
      title: '签到有福利、结识好朋友！',
      imageUrl: signCircle.content.images[0].url,
      path: url,
      success: function(res) {
        // 转发成功
        console.log('转发成功')

      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  // 点击点赞按钮
  signLike(){
    let that = this;
    let signCircle = that.data.signCircle;
    console.log(signCircle)
    let lat = that.data.latitude;
    let lng = that.data.longitude;
    let is_like =  '2'; // 点赞按钮
    // if (that.data.member_id == signCircle.content.member_id){
    //   wx.showToast({
    //     title: "不可点赞自己发布的！",
    //     icon:'none'
    //   })
    //   return;
    // }
    // let like_status = that.data.like_status;
    // if(!like_status){
    //   wx.showToast({
    //     title: '请勿频繁点击！',
    //     icon:'none'
    //   })
    //   return
    // }
    that.setData({
      like_status: false
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    common.get('/content/praise', {
      member_id: that.data.member_id,
      content_id: signCircle.content.id,
      lat,
      lng,
      is_like,
    }).then(res => {
      wx.hideLoading();
      if(res.data.code == 200){
        let signCircle = that.data.signCircle;
        publicMethod.gotosetint_transac(that);
        // signCircle.content.laud_count = parseFloat(that.data.signCircle.content.laud_count) + 1;
        // signCircle.content.laud_status = 1;
        // that.setData({
        //   signCircle,
        // })
        that.getsignCircle();
        that.setData({
          like_status: true
        })
// =============================== ↓ =====================================
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls','1neA-pyIpkUR4Asv__QNuyCbM4rVIvaoluNlc6XdCJo'],
          complete (res) { 
          },
        })  
// ================================= ↑ =======================================
      }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration: 2000
          })
          that.setData({
            like_status: true
          })

      }
    }).catch(e => {
      wx.hideLoading();
      app.showToast({
        title: "数据异常",
      })
      that.setData({
        like_status: true
      })
      console.log(e)
    })
  },
  // 获取赚更多积分任务列表
  goToaddintegral(){
    let that = this;
      common.get('/environmental/bank/get_more_integral',{
        member_id:that.data.m_id
      }).then( res => {
        if (res.data.ret == 0){
          that.setData({
            more_integral:res.data.data.splice(0,3),
          })
        }else if(res.data.ret == 201){
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(e =>{
        console.log(e)
        wx.showToast({
          title: e.data.msg,
          icon:'none'
        })
      })
  },
  // 点击去提现
  goToWallet() {
    wx.navigateTo({
      url: '/pages/mine/wallet/index'
    })
  },
  // 点击今日收到的赞
  goTojrsddz(){
    let that = this;
    wx.navigateTo({
      url: '/packageB/pages/todayLike/index',
    })

  },
  // 点击今日收到的礼物
  goTojrsdlw(){
    let that = this;
    wx.navigateTo({
      url: '/packageB/pages/today_receiveGift/index',
    })
  },

  goTotask(e){
    let that = this;
    console.log(e)
    let type = e.currentTarget.dataset.type; 
    let task_id = e.currentTarget.dataset.task_id; 
    let jifen = e.currentTarget.dataset.jifen; 
    let url = e.currentTarget.dataset.url;
    if(url.indexOf("?") != -1){
      url = e.currentTarget.dataset.url + 'member_id=' + wx.getStorageSync('member_id') +'&task_id=' + task_id + '&jifen=' + jifen + '&is_Signtask=1';
    }else{
      url = e.currentTarget.dataset.url + '?member_id=' + wx.getStorageSync('member_id') +'&task_id=' + task_id + '&jifen=' + jifen + '&is_Signtask=1';
    }
    if(type == 1){
      wx.reLaunch({
        url: url,
      })
    }else if(type == 2){
      wx.navigateTo({
        url: url,
      })
    }
  },
  goTotask1(e){
    let that = this;
    let type = e.currentTarget.dataset.type; 
    let url = e.currentTarget.dataset.url;
    if(url.indexOf("?") != -1){
      url = e.currentTarget.dataset.url + 'member_id=' + wx.getStorageSync('member_id');
    }else{
      url = e.currentTarget.dataset.url + '?member_id=' + wx.getStorageSync('member_id');
    }
    if(type == 1){
      wx.reLaunch({
        url: url,
      })
    }else if(type == 2){
      wx.navigateTo({
        url: url,
      })
    }
  },
  // 点击签到交友更多
  goTosignFriend(){
    wx.navigateTo({
      url: '/packageB/pages/signFriend/index',
    })
  },
  // 签到免费兑换
  goTosignFree(){
    wx.navigateTo({
      url: '/packageB/pages/signFreeCommodity/index',
    })
  },
  // 跳转拆盲盒
  goToBlindbox(){
    wx.navigateTo({
      url: '/packageB/pages/signBlindbox/index',
    })
  },
  // 跳转更多任务
  goTotastList(){
    wx.navigateTo({
      url: '/packageB/pages/signTaskList/index',
    })
  },
  // 点击签到观看激励广告
  goToSign_vd(){
    let that = this;
    wx.showModal({
      title: '签到打卡',
      content: '成功观看30s激励广告后即可签到成功获取积分！',
      cancelText:'取消',
      confirmText:'观看',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          // 点击确认观看
          // 用户触发广告后，显示激励视频广告
          if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
              .then(() => videoAd.show())
              .catch(err => {
                console.log('激励视频 广告显示失败')
                wx.showToast({
                  title: '激励视频 广告显示失败',
                  icon:'none'
                })
              })
            })
          }
        }
      }
    })

  },
  // 每日签到
  goToSign(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    let peamrs = {
      member_id,
      task_id:1,
      lng: that.data.longitude,
      lat: that.data.latitude,
    }
    let is_goToSign = that.data.is_goToSign;
    if(!is_goToSign){
      wx.showToast({
        title: '请勿重复提交',
        icon:'none'
      })
      return
    }
    that.setData({
      is_goToSign:false
    })
    common.get('/environmental/bank/do_card',peamrs).then( res => {
      console.log(res)
      if(res.data.ret == 0){
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration:1500,
          success:function(){
            that.setData({
              is_true: true,
            })
            setTimeout(function(){
              wx.reLaunch({
                url: '/packageB/pages/signIndex/index?m_id=' + wx.getStorageSync('member_id'),
              })
            },1000)
          } 
        })
      }else if(res.data.ret == 202){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          is_goToSign:true,
          task_sign: false,
          is_true:true
        })
      }
    }).catch(e =>{
      console.log(e)
      that.setData({
        is_goToSign:true,
      })
    })
  },
  goTobank(){
    wx.reLaunch({
      url: '/packageB/pages/signIndex/index?m_id=' + wx.getStorageSync('member_id'),
    })
  },

  getClassmodule(){
    let that = this;
    common.get('/newhome/index',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200) {
        that.setData({
          is_true:res.data.data.is_true,
        })
      }else{
        app.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      app.showToast({
        title: "数据异常"
      })
    })
  
  },
  cler_marsk(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },



    /**
     * 获取小程序二维码参数
   */
  getScene(scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
  },
})