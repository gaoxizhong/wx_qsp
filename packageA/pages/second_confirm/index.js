const app = getApp()
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:[],
    is_juli:false,
    savaStatus:true,
    library_id: '',
    lng: '',
    lat: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      library_id: options.library_id,
      lng: options.longitude,
      lat: options.latitude,
      id: options.id
    })
    common.get('/book_integral/service_juli',{
      member_id: wx.getStorageSync('member_id'),
      library_id: options.library_id,
      lng: options.longitude,
      lat: options.latitude,
      id: options.id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          is_juli : res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    });
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
    /**调用电话 */
tel(e) {
    wx.makePhoneCall({
      phoneNumber: '010-84672332',
    })
},
  //上传图片
  choosePic: function() { //选取图片
    let that = this;
    if(!that.data.is_juli){
      wx.showToast({
        title: '请在图书馆200米范围内提交！',
        icon: 'none'
      })
      return
    }
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
  relIdle_btn(e) { //提交
    let that = this
    let savaStatus = that.data.savaStatus;
    if(that.data.img.length < 1){
      wx.showToast({
        title: '最少上传1张图片',
        icon:'none'
      })
      return
    }
    let param ={
      "member_id": wx.getStorageSync('member_id'),
      "images":that.data.img,
      "library_id": that.data.library_id,
      "id": that.data.id
    };
    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    wx.showNavigationBarLoading();
    common.get('/book_integral/service_add_pic', param).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: 'success',
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/index/index',
          })
        },2000)
      } else {
        console.log("错误：" + res)
        that.setData({
          savaStatus: true
        })
        app.showToast({
          title: res.data.msg
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      console.log(e)
    })

  },
})