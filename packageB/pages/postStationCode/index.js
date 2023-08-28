const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_true:false,
    latitude: '',
    longitude: '',
    memberIdBank: 0,
    realAmount: 0,
    is_goToSign: true,
    library_id: '',  // 图书馆id
    business_id:'', // 店铺id
    yz_id:'', // 驿站id
    library_number: '', // 图书馆编号
    beforeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options);
    let l_id = wx.getStorageSync('l_id');
    let b_id = wx.getStorageSync('b_id');
    let yz_id = wx.getStorageSync('yz_id');
    if(yz_id){
      that.setData({
        library_id: l_id,
        business_id: b_id,
        yz_id: yz_id
      })
      that.getlibraryinfo(l_id);
    }else if(this.options.l_id){
      that.setData({
        library_id: this.options.l_id,
        business_id: this.options.b_id,
        yz_id: this.options.yz_id,
      })
      that.getlibraryinfo(this.options.l_id);
      wx.setStorageSync('l_id', this.options.l_id);
      wx.setStorageSync('b_id', this.options.b_id);
      wx.setStorageSync('yz_id', this.options.yz_id);
    }
    that.setData({
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
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
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
    that.getClassmodule();
    that.getaccountnumber();
    that.beforeList();
  },
  //获取图书馆信息
  getlibraryinfo(l_id){
    let that = this;
    common.get("/library/get_library_info", {
      library_id: l_id,
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      that.setData({
        library_name: res.data.data.library_name,
        library_number: res.data.data.number,
      })
    })
  },
  getClassmodule(){
    let that = this;
    common.get('/newhome/index',{
      member_id:wx.getStorageSync('member_id'),
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
    // 每日签到
    goToSign(){
      let that = this;
      let member_id = wx.getStorageSync('member_id');
      if(!member_id){
        publicMethod.gotoLoginMark();
        return
      }
      that.isGoToSign(this,this.data.longitude,this.data.latitude);
    },
    isGoToSign(t,lng,lat){
      let that = t;
      let member_id = wx.getStorageSync('member_id');
      console.log(member_id)
      let peamrs = {
        member_id,
        task_id:1,
        lng: lng,
        lat: lat,
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
          let content_id = res.data.content_id;
          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration:1500,
            success:function(){
              that.setData({
                is_true: true,
              })
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
    // 赚更多积分
    goTobank(){
      publicMethod.goTobank();
    },
    getaccountnumber(){
      let that = this;
      common.get("/environmental/bank/environmentalBankHome", {
        member_id: wx.getStorageSync('member_id'),
        type: 8
      }).then(res => {
        if (res.data.code == 200) {
          that.setData({
            memberIdBank: res.data.data.memberIdBank,
            realAmount: Number(res.data.data.realAmount),
          })
        }
      }).catch(error => {
        console.log(error);
      })
    },
    beforeList(){
      let that = this;
      common.get("/mine/index?op=my_integral_log", {
        member_id: wx.getStorageSync('member_id'),
      }).then(res => {
        if (res.data.code == 200) {
          that.setData({
            beforeList: res.data.data.log,
          })
        }
      }).catch(error => {
        console.log(error);
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
  onShareAppMessage: function () {

  },

  goTodhjf(){
    let url = "/packageB/pages/codeExchangeBooks/index?id=" + this.data.library_id + "&library_number=" + this.data.library_number + '&is_yzm=1';
    wx.navigateTo({
      url: url
    })
  },
  goToShop(){
    let businessid =  this.data.business_id;
    let url = "/pages/shop/shop?business_id=" + businessid + '&is_yzm=1';
    wx.navigateTo({
      url: url
    })
  },
  goToaxzs(){
    wx.navigateTo({
      url: '/packageA/pages/donate_types/index?is_yzm=1'
    })
  },
  goToklhs(){
    wx.showToast({
      title: '暂未开放',
      icon:'none',
    })
    return
  },
    /**
   * 获取小程序二维码参数
   * @param {String} scene 需要转换的参数字符串
   */
  getScene: function (scene = "") {
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