const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({
  data: {
    member_id:'',
    date: '1990-11-13',
    date_birthday:'',
    sex_list:['男','女'],
    date_index:'0',
    sex:'',
    phone:'',
    is_addmark:false,
    addinput_name:'',
    profession:'',
    profession_index:'3',
    profession_list:['IT','制造','医疗','金融','教育','商业','文化','其他职业'],
    addinput_name1:'',
    longitude: '',
    latitude: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    that.setData({
      is_huishou:options.is_huishou
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    // 禁止右上角转发
    wx.hideShareMenu();
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
  gotoaddmark(){
    this.setData({
      is_addmark:true
    })
  },
  is_addmark(){
    this.setData({
      is_addmark:false
    })
  },
  addinput_name(e){
    this.setData({
      addinput_name:e.detail.value
    })
  },
  addinput_btn(){
    let that = this;
    that.setData({
      is_addmark:false
    })
  },
  bindDateChange(e) {
    let that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      date: e.detail.value,
      date_birthday: e.detail.value,
    })
  },
  bindPickerChange(e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      date_index:e.detail.value,
      sex:that.data.sex_list[e.detail.value]
    })
  },
  bindProfChange(e){
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      profession:that.data.profession_list[e.detail.value]
    })
  },

  setphone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  btn_box_rg(){
    let that = this;
    let age = that.data.date_birthday;
    let sex = Number(that.data.date_index) + 1;
    let mobile = that.data.phone;
    let job = that.data.profession;
    let address = that.data.addinput_name;
    if(mobile != ''){
      if (!(/^1[3456789]\d{9}$/.test(mobile))) {
        wx.showToast({
          title: '请输入正确的电话号码！',
          icon: 'none',
        })
        return
      }
    }
    that.submit_info(that,age,sex,mobile,job,address);
  },
  btn_box_lf(){
    let that = this;
    let age = '';
    let sex = 0;
    let mobile = '';
    let job = '';
    let address = '';
    that.submit_info(that,age,sex,mobile,job,address);
  },
  submit_info(t,age,sex,mobile,job,address){
    let that = t;
    common.get("/content_personal/chushou",{
      member_id:wx.getStorageSync('member_id'),
      lng: t.data.longitude,
      lat: t.data.latitude,
      age,
      sex,
      job,
      address,
      mobile
    }).then(res =>{
      if(res.data.code == 200){
        // wx.showToast({
        //   title: res.data.msg,
        //   icon:'none'
        // })
        if(that.data.is_huishou == '1'){
          wx.navigateBack({ delta: -1 });
        }else{
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
        
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e,
        icon:'none'
      })
      console.log(e)
    })
  }
})