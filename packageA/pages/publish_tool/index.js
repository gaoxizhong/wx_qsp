const app = getApp()
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisabled: false,
    textareaVal:'',
    photos:[],
    latitude: '',
    longitude: '',
    select_type_moving: 0,
    sele_info_moving:'',
    select_number:'',
    is_limit:false,
    items: [
      {value: '10', name: '自动10条，每60分钟发一次；'},
      {value: '20', name: '自动20条，每30分钟发一次；'},
      {value: '30', name: '自动30条，每20分钟发一次；'},
      {value: '40', name: '自动40条，每15分钟发一次；'},
    ],
    is_block:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
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
    let sele_info_moving = wx.getStorageSync('sele_info_moving3');
    let select_type_moving = wx.getStorageSync('select_type_moving3');
    that.setData({
      sele_info_moving,
      select_type_moving,
    })
    if(select_type_moving == 1){
      console.log(sele_info_moving.name)
      that.setData({
        copywrite: sele_info_moving.content?sele_info_moving.content:''
      })
    }else if(select_type_moving == 2){
      that.setData({
        copywrite: sele_info_moving.name
      })
    }
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
  textareaChange(e) {
    let that = this
    that.setData({
      textareaVal: e.detail.value
    })
  },
  openPhoto: function(event) { //打开图片
    let that = this;
    console.log(event);
    that.setData({
      layer: true,
      preview: event.currentTarget.dataset.url,
      imgname: event.currentTarget.dataset.imgname,
      previewIndex: event.currentTarget.dataset.index
    });
  },
  closePic: function() { //关闭图片
    let that = this;
    that.setData({
      layer: false
    });
  },
  delPic: function() {//删除图片
    let that = this;
    let picsUp = that.data.photos;
    picsUp.splice(that.data.previewIndex, 1);
    that.setData({
      photos: picsUp,
      layer: false
    });
  },
  choose: function() { //选取图片
    let that = this;
    let photos = that.data.photos;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        that.upLoadImg(tempFilePaths, 0);
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
      filePath: img[i],
      name: 'files[]',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        console.log(data);
        if ( data.code == 0 ) {
          that.data.photos.push(data.data.url[0]);
          that.setData({
            photos: that.data.photos
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
        wx.hideLoading();
      },
      complete:function() {
        wx.hideLoading();
      }
    })
  },
    // 推广期限弹窗确认按钮
    limit_btn(){
      let that = this;
      let select_number = that.data.select_number;
      if(select_number == 0){
        wx.showToast({
          title: '请先选择',
          icon:'none',
        })
        return
      }else{
        that.submint_info();
      }
    },
    submint_info(){
      let that = this;
      let photos = that.data.photos;
      let textareaVal = that.data.textareaVal;
      let select_number = that.data.select_number; // 推广条数
      let all_info = wx.getStorageSync('sele_info_moving3'); // 商品对象数据
      let select_type = wx.getStorageSync('select_type_moving3');// 商品或者优惠券 1 商品 2 优惠券
      let select_id = all_info.discount_id || all_info.id; // 商品或者优惠券id
      let is_block = that.data.is_block;
      if(!is_block){
        wx.showToast({
          title: '请勿重复提交！',
          none:'none'
        })
        return
      }
      that.setData({
        is_block:false,
      })
      wx.showLoading({
        title: '提交中...',
        icon: 'none'
      })
      common.post('/referraltraffic/add',{
        select_id,
        select_type,
        member_id: wx.getStorageSync('member_id'),
        select_number,
        type: 3,
        content: textareaVal,
        image: photos,
        lat: that.data.latitude,
        lng: that.data.longitude
      }).then(res =>{ 
        wx.hideLoading();
        if(res.data.code == '200'){
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
          wx.setStorageSync('sele_info_moving3', {});
          wx.setStorageSync('select_type_moving3', '');
          wx.reLaunch({
            url: '/pages/circle/circle',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            is_block:true,
          })
        }
      }).catch(e =>{
        wx.hideLoading();
        that.setData({
          is_block:true,
        })
        console.log(e)
      })
    },
  shareSub(){
    let that = this;
    let photos = that.data.photos;
    let textareaVal = that.data.textareaVal;
    let select_type_moving = that.data.select_type_moving;
    if(textareaVal == '' || !textareaVal){
      wx.showToast({
        title: '请填写内容',
        icon:'none'
      })
      return
    }
    if(photos.length <= 0 || !photos){
      wx.showToast({
        title: '请上传图片',
        icon:'none'
      })
      return
    }
    if(!select_type_moving){
      wx.showToast({
        title: '请先选择要推广的商品/优惠券',
        icon: 'none'
      })
      return
    }else{
      that.setData({
        is_limit:true
      })
      return
    }

  },
  gotosele(){
    wx.navigateTo({
      url: '/packageA/pages/tool_choosepages/index?is_text=1',
    })
  },
  gotosele(){
    wx.navigateTo({
      url: '/packageA/pages/tool_choosepages/index?is_text=1',
    })
  },
  // 设置推广有效期弹窗
  radioChange(e) {
    let that = this;
    const items = that.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    that.setData({
      items,
      select_number:e.detail.value,
    })
    console.log(that.data.select_number)
  },
  is_limit_layer(){
    this.setData({
      is_limit:false
    })
  }
})