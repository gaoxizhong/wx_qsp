const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_acquire: false, // 联系方式弹窗
    top_img:['https://huanbaobi.qingshanpai.com/banner/banner/banner1620875459_93713_.png','https://huanbaobi.qingshanpai.com/banner/banner/banner1620875459_93713_.png'],
    user_name:'', // 联系人
    user_phone:'', // 联系电话
    garden: '', //所在小区
    user_street:'', // 街道
    pa_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    this.getPalist();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.toast = this.selectComponent("#toast");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 获取可选项列表
  getPalist(){
    let that = this;
    common.get('/community/community_function',{}).then(res =>{
      if(res.data.code == 200){
        let pa_list = res.data.data;
        pa_list.forEach(ele =>{
          ele.checked = false;
        })
        that.setData({
          pa_list,
        })
      }else{
        that.toast.showToast({
          msg: res.data.msg,
          duration: 1500
        });
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 姓名
  user_name(e){
    this.setData({
      user_name:e.detail.value
    })
  },
  // 电话
  user_phone(e){
    this.setData({
      user_phone:e.detail.value
    })
  },
  //  省市区
  saveGarden(e) {
    let that = this;
    that.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2]),
    })
  },
  // 街道
  user_street(e){
    this.setData({
      user_street:e.detail.value
    })
  },
  chooseLibrary(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let pa_list = that.data.pa_list;
    let choseChange = "pa_list[" + index + "].checked";
    let pa_list_checked = pa_list[index].checked;
    if(pa_list_checked==true){
      that.setData({
        [choseChange]: false
      })
    }else{
      that.setData({
        [choseChange]: true
      })
    }

  },
  // 点击确认提交
  clickConfirm(){
    let that = this;
    let pa_list = that.data.pa_list;
    let checkboxList = [];
    pa_list.forEach(ele =>{
      if(ele.checked){
        checkboxList.push(ele.id);
      }
    })
    let p = {
      username: that.data.user_name, // 联系人
      mobile: that.data.user_phone, // 联系电话
      community_address: that.data.garden, // 所在地区
      community_name: that.data.user_street, //所在小区街道
      interested_function_id:checkboxList.join('-'), // 感兴趣的功能模块多个用中横线-进行拼接ID
    }
    console.log(p);
    if(p.username == '' || !p.username){
      that.toast.showToast({
        msg: '请填写联系人！',
        duration: 1500
      });
      return
    }
    if(p.mobile == '' || !p.mobile){
      that.toast.showToast({
        msg: '请填写联系电话！',
        duration: 1500
      });
      return
    }
    if(p.community_address == '' || !p.community_address){
      that.toast.showToast({
        msg: '请选择所在社区！',
        duration: 1500
      });
      return
    }
    if(p.community_name == '' || !p.community_name){
      that.toast.showToast({
        msg: '请填写社区街道！',
        duration: 1500
      });
      return
    }
    if(p.interested_function_id.length == ''){
      that.toast.showToast({
        msg: '请选择感兴趣功能！',
        duration: 1500
      });
      return
    }
    common.get('/community/community_apply',p).then( res =>{
      if(res.data.code == 200){
        that.toast.showToast({
          msg: res.data.message,
          duration: 2500
        });
      }else{
        that.toast.showToast({
          msg: res.data.message,
          duration: 1500
        });
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // checkboxChange(e){
  //   console.log(e)
  //   this.setData({
  //     checkboxList: e.detail.value
  //   })
  // },
  // 点击获取联系方式
  clickAcquire(e){
  /**调用电话 */
    let tel = e.currentTarget.dataset.mobile;
    if (tel != null || tel != '') {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    } else {
      wx.showToast({
        title: "暂无联系电话",
        icon:'none'
      })
    }
    return
    this.setData({
      is_acquire: true
    })
  },
  // 点击背景关闭弹窗
  clickMsk(){
    this.setData({
      is_acquire: false
    })
  }
})