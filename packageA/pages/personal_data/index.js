const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    is_addmark:false,
    addinput_name:'',
    date: '1990-11-13',
    date_birthday:'',
    sex_list:['男','女'],
    date_index:'0',
    sex:'',
    profession:'',
    profession_index:'3',
    profession_list:['IT','制造','医疗','金融','教育','商业','文化','其他职业'],
    addinput_name1:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.setData({
      member_id:options.member_id
    })
    common.get('/content_personal/info',{
      member_id:wx.getStorageSync('member_id')
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          date_index: res.data.data.sex - 1,
          sex: that.data.sex_list[res.data.data.sex - 1],
          date_birthday: res.data.data.age,
          profession: res.data.data.job,
          addinput_name1: res.data.data.address
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
  addinput_btn(){
    let that = this;
    common.get('/content_personal/add',{
      address: that.data.addinput_name,
      sex:Number(that.data.date_index) + 1,
      job: that.data.profession,
      age:that.data.date_birthday,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          addinput_name1:that.data.addinput_name,
          is_addmark:false
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
  addinput_name(e){
    console.log(e)
    this.setData({
      addinput_name:e.detail.value
    })
  },
  bindDateChange(e) {
    let that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    common.get('/content_personal/add',{
      age: e.detail.value,
      sex:Number(that.data.date_index) + 1,
      job: that.data.profession,
      address:that.data.addinput_name1,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          date: e.detail.value,
          date_birthday: e.detail.value,
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
  bindPickerChange(e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    common.get('/content_personal/add',{
      sex:Number(e.detail.value ) + 1,
      job: that.data.profession,
      age:that.data.date_birthday,
      address:that.data.addinput_name1,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          date_index:e.detail.value,
          sex:that.data.sex_list[e.detail.value]
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
  bindProfChange(e){
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    common.get('/content_personal/add',{
      job: that.data.profession_list[e.detail.value],
      sex:Number(that.data.date_index) + 1,
      age:that.data.date_birthday,
      address:that.data.addinput_name1,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          profession:that.data.profession_list[e.detail.value]
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

  }
})