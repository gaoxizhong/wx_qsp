const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    release_text:'',
    img:[],
    release_name:'',
    release_phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
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
  //输入描述
  inputDesc(e) {
    this.setData({
      release_text: e.detail.value
    })
  },
  //输入姓名
  inputBalDiscname(e) {
    this.setData({
      release_name: e.detail.value
    })
  },
  inputPhone(e) {
    this.setData({
      release_phone: e.detail.value
    })
  },
  //上传图片
  choosePic: function() { //选取图片
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        console.log(tempFiles[0]);
        console.log(tempFiles);
        that.upLoadImg(tempFiles, 0);
        return;
      }
    })
  },
  //上传图片
  upLoadImg(image,index) {
    let i = index;
    let img = image;
    let that = this;
    if ( i >= img.length ) {
      return
    }
    // debugger;
    let txt = '上传中'+(i+1)+'/'+img.length
    wx.showLoading({
      title:txt
    })
    wx.uploadFile({
      url: setting.apiUrl + '/file/uploadOss',
      filePath: img[i].path,
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
          that.data.img.push(data.data.url[0]);
          that.setData({
            img: that.data.img
          })
        } else {
          app.showToast({
            title: "上传失败!",
          })
        }
        wx.hideLoading();
        i++;
        that.upLoadImg(image, i);
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
  },
  //打开图片预览
  openPhoto(e) {
    console.log(1)
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      preview: that.data.img[index],
      sel_index: index,
      showFull: true
    })
  },
  //关闭图片预览
  closePic() {
    this.setData({
      showFull: false
    })
  },
  //删除图片
  delPic() {
    let that = this;
    let index = that.data.sel_index;
    that.data.img.splice(index,1);
    that.setData({
      showFull: false,
      img: that.data.img
    })
  },
  createActivity(e){
    let that = this;
    if (that.data.release_text === '') {
      wx.showToast({
        title: "请填写描述！",
        icon: 'none',
      })
      return;
    }
    if (that.data.release_name === '') {
      wx.showToast({
        title: "请填入联系人！",
        icon: 'none',
      })
      return;
    }
    if (that.data.release_phone == '') {
      wx.showToast({
        title: "请填写联系方式！",
        icon: 'none',
      })
      return;
    }
    // if (!(/^1[345678]\d{9}$/.test(that.data.release_phone))) {
    //   wx.showToast({
    //     title: '请输入正确的电话号码！',
    //     icon: 'none',
    //   })
    //   return
    // }
    let params = {
      member_id: wx.getStorageSync('member_id'),
      img:that.data.img,
      introduce: that.data.release_text,
      mobile: that.data.release_phone,
      name: that.data.release_name,
      lat: that.data.latitude,
      lng: that.data.longitude
    }
    wx.showLoading({
      title: '发表中...',
    })
    common.get("/idle/idle_purchase_add", params).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: "success",
          duration: 1000,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)

      }else{
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          duration: 1000,
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
})