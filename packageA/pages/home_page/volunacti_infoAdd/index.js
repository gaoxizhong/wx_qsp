const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_school: '',
    member_address: '',
    member_garden: '',
    member_mobile: '',
    member_name: '',
    vol_number: '',
    is_cler:false,
    ext_id:'',
    is_chooseExt_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.ext_id){
      that.setData({
        ext_id: options.ext_id,
        is_chooseExt_id: options.is_chooseExt_id
      })
      that.getinfoItemList();
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  fixed_btn(){
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_infoAdd/index',
    })
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
  //信息回显
  getinfoItemList(){
    let that = this;
    let ext_id = that.data.ext_id;
    common.get('/activity/ext_list',{
      member_id: wx.getStorageSync('member_id'),
    }).then( res=>{
      if(res.data.code == 200){
        let infoItemList = res.data.data.ext_list;
        infoItemList.forEach(ele =>{
          if( ele.ext_id === Number(ext_id) ){
            that.setData({
              member_school: ele.member_school?ele.member_school:'',
              member_address: ele.member_address?ele.member_address:'',
              member_garden: ele.member_garden?ele.member_garden:'',
              member_mobile: ele.member_mobile?ele.member_mobile:'',
              member_name: ele.member_name?ele.member_name:'',
              vol_number: ele.vol_number?ele.vol_number:'',
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
      console.log(e)
    })

  },
  saveGarden(e) {
    console.log(e)
    this.setData({
      member_garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //保存资料
  savaData: function(e) {
    let that = this;
    let ext_id = that.data.ext_id;
    let formData = e.detail.value;
    let member_garden = that.data.member_garden;
    if (!(/^1[3456789]\d{9}$/.test(formData.member_mobile)) ) {
      wx.showToast({
        title: '请输入正确的电话号码！',
        icon: 'none',
      })
      return
    }
    if ( formData.vol_number.length > 15 || formData.vol_number.length < 15 ) {
      wx.showToast({
        title: '请输入15位志愿编号！',
        icon: 'none',
      })
      return
    }
    if ( member_garden == '' || formData.member_name == '' || formData.member_mobile == '' || formData.member_address == '') {
      app.showToast({
        title: "请将资料填写完整!",
      })
      return;
    }
    let postmsg = {
      member_id: wx.getStorageSync('member_id'),
      vol_number: formData.vol_number,
      member_name: formData.member_name,
      member_mobile: Number(formData.member_mobile),
      member_address: formData.member_address,
      member_school: formData.member_school,
      member_garden,
    }
    if(ext_id != '' || ext_id){
      postmsg.ext_id = Number(ext_id);
    }
    common.post('/activity/ext', postmsg ).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: ext_id?'修改成功！': '保存成功！',
          duration:1500
        })
        if( that.data.is_chooseExt_id == ext_id ){
          wx.setStorageSync('selectedExt', res.data.data);
         }
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },1500)
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
  // 删除
  cler_btn(){
    let that = this;
    that.setData({
      is_cler:true
    })
  },
  // 点击取消
  cler_marsk(){
    this.setData({
      is_cler: false
    })
  },
  // 点击确认
  submit_btn(){
    let that = this;
    let ext_id = that.data.ext_id;
    common.get('/activity/del_ext',{
      member_id: wx.getStorageSync('member_id'),
      ext_id: Number(ext_id),
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '删除成功！',
          duration: 1500
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },1500)
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