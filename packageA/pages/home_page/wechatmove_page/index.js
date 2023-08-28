const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    code:'',
    encryptedData:'',
    iv:'',
    is_binding:true,
    sessionId:'',
    step:'',  // 今日步数
    step_integral:0,
    latitude: '',
    longitude: '',
    canIUseGetUserProfile: false,
    // ======= 做任务赚积分数据  
    is_Signtask:0,
    task_id: 0,
    is_ad: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // ======= 做任务赚积分数据  
    if(options.is_Signtask){
      that.setData({
        is_Signtask: options.is_Signtask,
        task_id: options.task_id
      })
    }
    // ======= 做任务赚积分数据
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
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        pop2: false
      })
    }
    that.getWeRunData();
  },
//  授权 获取个人信息
getUserInfo: function(e) {
  publicMethod.getUserInfo(e,this);

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
  
  // 获取微信运动步数
  getWeRunData(){
    let that = this;
    wx.login({
      success:function(data){
        console.log(data)
        let code = data.code;
        wx.getWeRunData({  //解密微信运动
          success:function(res){
            that.setData({
              is_binding:true,
            });
            const wRunEncryptedData  = res.encryptedData;
            that.getCodeSession(code,res.iv,wRunEncryptedData);
            that.setData({ 
              code: code,
              encryptedData: wRunEncryptedData,
              iv: res.iv,
             })

          },
          fail: function(res) {
            console.log('fail')
            console.log(res)
            that.setData({
              is_binding:false,
            });
            if (res.err_code == "-12006") {
              wx.showModal({
                title: '提示',
                content:'请先授权开通微信运动',
                showCancel: true,
                success: function (ress) {
                  if (ress.confirm) {  
                    publicMethod.openWeRunSetting(that);
                  }
                }
              })
              // 
            }
            if(typeof f == 'function'){
              return f(res)
            }
          }
        })
      }
    })
  },
  getCodeSession(c,i,ed){
    let that = this;
    common.post('/member/sport', {
      code: c,
      iv: i,
      encryptedData:ed,
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        let todayStep = res.data.data.stepInfoList[29];
        that.setData({
          // is_binding:true,
          step: todayStep.step,
          step_integral:res.data.data._integral,
        });
      }else{
        wx.showToast({
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
  },
  // 转换积分
  conversion_btn(){
    let that = this;
    wx.showLoading({
      title:'转换中...'
    })
    // setTimeout(function(){
    //   that.getrun_integral();
    // },1500)
    let step = that.data.step;
    common.post("/member/sport_get_integral",{
      member_id:wx.getStorageSync('member_id'),
      step,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        that.setData({
          step_integral:res.data.data.integral
        })
        let content_id = res.data.data.content_id;
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration:1500,
        })
        if(that.data.is_Signtask){
          that.getDoneTask(that.data.task_id);
        }
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          complete(res){
            wx.reLaunch({
              url: '/pages/circle/circle?is_circle=0&id=' + content_id,
            })
          }
        })
      }else{
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
    // =========  做任务赚积分 弹窗功能 =======
  // 做任务赚积分跳转过来
  getDoneTask(id){
    let that = this;
    let task_id = id;
    common.get('/mine/index?op=done_task',{
      member_id: wx.getStorageSync('member_id'),
      task_id,
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          is_Signtask:0
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
// =========  做任务赚积分 弹窗功能 =======
  adClose(){
    this.setData({
      is_ad: false
    })
  }
})