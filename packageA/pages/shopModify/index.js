const app = getApp();
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business_id:'',
    v_head: '',  //头像
    v_back: '',  //背景
    contact_name : '',
    contact_profile : '',
    contact_phone : '',
    contact_area : '',
    longitude:'',
    latitude:'',
    garden:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      business_id: options.business_id,
    })
    // 店铺信息
    that.getBusinessInfo();
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
  //查询商家信息
  getBusinessInfo() {
    let that = this;
    common.get("/business/getBusinessInfo", {
      member_id: wx.getStorageSync('member_id'),
      business_id: that.data.business_id,
    }).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        let infoData = res.data.data;
        that.setData({
          contact_name: infoData.name,
          contact_phone: infoData.phone,
          garden: infoData.garden?infoData.garden:'',
          contact_area: infoData.area?infoData.area:'',
          v_head: infoData.avatar?infoData.avatar:'',  //头像
          v_back: infoData.bgimg?infoData.bgimg:'',  //背景
          shop_password: infoData.shop_password?infoData.shop_password:''
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  saveGarden(e) {
    console.log(e)
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //选取头像图片
  chooseHead: function() { 
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        console.log(tempFiles[0]);
        // return;
        wx.showLoading({
          title:"上传图片中..."
        })
        wx.uploadFile({
          url: setting.apiUrl + '/file/uploadOss',
          filePath: tempFiles[0].path,
          name: 'files[]',
          header: {
            'content-type': 'multipart/form-data',
            'token': wx.getStorageSync('token')
          },
          success: function(res) {
            let data = JSON.parse(res.data);
            console.log(data);
            if ( data.code == 0 ) {
              wx.hideLoading();
              that.setData({
                v_head: data.data.url[0]
              })
            } else {
              app.showToast({
                title: "上传失败!",
              })
              wx.hideLoading()
            }
          },
          fail:function() {
            app.showToast({
              title: "上传失败!",
            })
            wx.hideLoading()
          },
          complete:function() {
            wx.hideLoading()
          }
        })
      }
    })
  },
  //选取背景图片
  chooseBack: function() { 
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        console.log(tempFiles[0]);
        // return;
        wx.showLoading({
          title:"上传图片中..."
        })
        wx.uploadFile({
          url: setting.apiUrl + '/file/uploadOss',
          filePath: tempFiles[0].path,
          name: 'files[]',
          header: {
            'content-type': 'multipart/form-data',
            'token': wx.getStorageSync('token')
          },
          success: function(res) {
            let data = JSON.parse(res.data);
            console.log(data);
            if ( data.code == 0 ) {
              wx.hideLoading();
              that.setData({
                v_back: data.data.url[0]
              })
            } else {
              app.showToast({
                title: "上传失败!",
              })
              wx.hideLoading()
            }
          },
          fail:function() {
            app.showToast({
              title: "上传失败!",
            })
            wx.hideLoading()
          },
          complete:function() {
            wx.hideLoading()
          }
        })
      }
    })
  },
  //保存资料
  savaData: function(e) {
    let that = this;
    console.log(e)
    let formData = e.detail.value;
    let garden = that.data.garden;
    if (that.data.v_head == '' || that.data.v_back == '' || garden == '' || formData.contact_name == '' || formData.contact_phone == '' || formData.contact_area == '') {
      app.showToast({
        title: "请将资料填写完整!",
      })
      return;
    }
    let postmsg = {
      member_id: wx.getStorageSync('member_id'),
      business_id: that.data.business_id,
      name: formData.contact_name,
      phone: formData.contact_phone,
      address: garden + formData.contact_area,
      garden,
      area: formData.contact_area,
      avatar: that.data.v_head,
      bgimg: that.data.v_back,
      shop_password:formData.shop_password,
      // desc: formData.contact_profile,
      // lng: that.data.longitude,
      // lat: that.data.latitude,
    }
    that.sendRegister(postmsg);
  },
  //提交修改
  sendRegister(data) {
    console.log(data);
    common.get('/business/updateShop', data).then( res=> {
      console.log(res);
      if (res.data.code == 200) {
        //修改成功
        wx.showToast({
          title: "修改成功",
          duration:1500,
        })
        setTimeout(function(){
          wx.navigateBack({ delta: -1 });
        },1500)
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch( error=> {
      console.log(error);
      app.showToast({
        title: error.data.message,
      })
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
})