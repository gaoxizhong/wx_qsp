const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    answerList:[],
    is_return: true,
    canIUseGetUserProfile: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    /**
     * Object.assign(any,any1) 用于对象的合并
     * 获取二维码的参数，绑定到当前this.options对象上
     */
    if(options.scene){
      Object.assign(this.options,this.getScene(options.scene))
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
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
    that.setData({
      is_return: true,
      answerList:[],
    })
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      that.setData({
        pop2:true
      })
    }else{
      that.setData({
        member_id,
        pop2:false
      })
    }

    that.getanswerList();
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
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const index = e.currentTarget.dataset.index;
    const answerList = this.data.answerList;
    const items = answerList[index].data.option;
    answerList[index].data.user_key = e.detail.value;
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].key === e.detail.value;
    }
    this.setData({
      answerList,
    })
    console.log(this.data.answerList)
  },

  

  // 跳转积分礼品页、

  goto_points_gifts(){
    let that = this;
    let data = that.data.answerList;
    console.log(data)
    let is_return = that.data.is_return;
    if(!is_return){
      wx.showToast({
        title: '正在提交中，请勿重复提交',
        icon:'none'
      })
      return
    }
    that.setData({
      is_return: false
    })
    wx.showLoading({
      title: '提交中...',
    })
    common.post('/topic/answer',{
      member_id: wx.getStorageSync('member_id'),
      data,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: '提交成功！',
          icon:'none'
        })
        setTimeout(function(){
          wx.navigateTo({
              url: '/packageA/pages/points_gifts/index',
            })
        },1500)
      }else if(res.data.code == 201){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          is_return: false
        })
        setTimeout(function(){
          wx.navigateTo({
              url: '/packageA/pages/points_gifts/index',
            })
        },1500)
      }else{
        that.setData({
          is_return: false
        })
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      that.setData({
        is_return: false
      })
      wx.hideLoading();
      console.log(e)
    })
  },
  getanswerList(){
    let that = this;
    common.get('/topic/show',{
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      if(res.data.code == 200){
        let answerList = res.data.data?res.data.data.list:[];
        let done = res.data.data?res.data.data.done:[];
        let receive = res.data.data?res.data.data.receive:[];
        that.setData({
          answerList,
          done,
          receive,
        })
        if(receive){
          wx.showToast({
            title:'您已提交过答题！',
            icon:'none'
          })
          setTimeout(function(){
            wx.reLaunch({  // 跳转我的积分礼品页面
              url: '/packageA/pages/myGift_pages/index',
            })
          },1500)
          return
        }
        if(done){
          wx.showToast({
            title:'您已提交过答题！',
            icon:'none'
          })
          setTimeout(function(){
            wx.reLaunch({ // 跳转礼品兑换的页面
              url: '/packageA/pages/points_gifts/index',
            })
          },1500)
          return
        }
      }

    }).catch(e =>{
      console.log(e)
    })
  },




















    /**
   * 获取小程序二维码参数
   * {string} scene 需要转换的参数字符串
   */
  getScene(scene = "") {
    if(scene == "") return {} 
    let res = {}
    let params = decodeURIComponent(scene).split ("&")
    params.forEach( item => {
      let pram = item.split("=")
      res[pram[0]] = parm[1]
    })
    return res
  },

  cancelLogin() {
    this.setData({
      pop2: false
    })
    console.log('取消授权完成')
  },
})