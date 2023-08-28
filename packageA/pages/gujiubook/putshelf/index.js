const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:[],
    id:'',
    book_oriprice:'',
    book_sellprice:'',
    book_name:'',
    book_author:'',
    book_press:'',
    book_time:'',
    book_summary:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.id){
      this.setData({
        id:options.id,
      })
    }
    this.setData({
      member_id:wx.getStorageSync('member_id'),
    })
    this.getinfododify();

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

    // 信息回显
    getinfododify(){
      let that =this;
      let id = that.data.id;
      common.get('/newhome/edit_old_book',{
        id,
      }).then(res =>{
        if(res.data.code == 200){
          let image1=res.data.data[0].img;
          that.setData({
            book_name:res.data.data[0].name,
            book_author:res.data.data[0].author,
            book_oriprice:res.data.data[0].price,
            book_discount:res.data.data[0].book_discount,
            book_sellprice:res.data.data[0].discount_price,
            book_grade:res.data.data[0].book_grade,
            book_press:res.data.data[0].publisher,
            book_time:res.data.data[0].pubdate,
            stock:res.data.data[0].stock,
            id:res.data.data[0].id,
            book_summary:res.data.data[0].summary,
            img:image1,

          })
        }
      }).catch(e =>{
        console.log(e)
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
book_oriprice(e){
  console.log(e)
  this.setData({
    book_oriprice:e.detail.value
  })
},
book_sellprice(e){
  this.setData({
    book_sellprice:e.detail.value
  })
},
book_name(e){
  this.setData({
    book_name:e.detail.value
  })
},
book_author(e){
  this.setData({
    book_author:e.detail.value
  })
},
book_press(e){
  this.setData({
    book_press:e.detail.value
  })
},
book_time(e){
  this.setData({
    book_time:e.detail.value
  })
},
book_summary(e){
  this.setData({
    book_summary:e.detail.value
  })
},
createActivity(){
  let that = this;
  if (that.data.img.length == 0) {
    wx.showToast({
      title: "请上传活动图片！",
      icon: 'none',
    })
    return;
  }
  if (that.data.book_oriprice == '') {
    wx.showToast({
      title: "请填写图书原价！",
      icon: 'none',
    })
    return;
  }
  if (that.data.book_sellprice == '') {
    wx.showToast({
      title: "请填写图书售价！",
      icon: 'none',
    })
    return;
  }
  if (that.data.book_name == '') {
    wx.showToast({
      title: "请填写图书名称！",
      icon: 'none',
    })
    return;
  }
  if (that.data.book_author == '') {
    wx.showToast({
      title: "请填写图书作者！",
      icon: 'none',
    })
    return;
  }
  if (that.data.book_press == '') {
    wx.showToast({
      title: "请填写出版社！",
      icon: 'none',
    })
    return;
  }
  if (that.data.book_time == '') {
    wx.showToast({
      title: "请填写出版时间！",
      icon: 'none',
    })
    return;
  }
  let peram = {
    id:that.data.id,
    member_id:wx.getStorageSync('member_id'),
    img:that.data.img, 
    price:that.data.book_oriprice,
    discount_price:that.data.book_sellprice,
    name:that.data.book_name,
    author:that.data.book_author,
    publisher:that.data.book_press,
    pubdate:that.data.book_time,
    summary:that.data.book_summary
  }
  common.get('/newhome/add_old_book',peram).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: res.data.msg,
        icon: "success",
        duration: 1000
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }
  }).catch(e =>{
    console.log(e)
  })
}






})