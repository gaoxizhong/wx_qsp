const app = getApp()
const common = require('../../assets/js/common');
var WxParse = require('../../wxParse/wxParse.js');
const publicMethod = require('../../assets/js/publicMethod');
const setting = require('../../assets/js/setting');


Page({
  data: {
    img_url: app.data.imgUrl,
    coolStatus:false,
    rate: '',
    tid: '',
    photos: [], //图片数组,
    comment_box : '',  //勾选标签得到的评论
    comment: '',  //输入得到的评论
    comment_list : [
      {id: 1, value: "工作人员很热心！"},
      {id: 2, value: "上门非常迅速！"},
      {id: 3, value: "这次活动很棒！"},
      {id: 4, value: "青山生态太棒了！"}
    ]
  },
  onLoad: function(options) {
    console.log(options,'url参数?');
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      wx.hideTabBar()
      this.setData({
        isAuthorize: true
      })
      return
    }
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      tid : options.tid || ''
    })
  },
  textareaChange(e) {
    let that = this
    that.setData({
      comment: e.detail.value
    })
  },
  checkboxChange(e) {
    let that = this;
    console.log(e.detail.value);
    let str = '';
    let arr = e.detail.value;
    arr.forEach(item => {
      str += item
    });
    that.setData({
      comment_box : str
    })
  },
  handleChange: function (e) {
    let that = this;
    this.setData({
      rate: e.detail.value
    })
  },
  choose: function() { //选取图片
    let that = this;
    let photos = that.data.photos;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        photos = photos.concat(tempFilePaths);
        wx.showLoading({
          title:"上传图片中..."
        })
        console.log(that.data.photos)
        // return;
        app.uploadimg({
          url: setting.apiUrl + '/file/uploadOss',
          path: photos,
          name: 'files[]',
          result_list: [],
          picUpSuccess: function(res) {
            wx.hideLoading()
            app.showToast({
              title: '上传成功!',
            })
            console.log(res);
            that.setData({
              photos: res.result_list
            });
          }
        })
      }
    })
  },
  openPhoto: function(event) { //打开图片
    let that = this;
    console.log(event);
    // wx.previewImage({
    //   current: e.currentTarget.dataset.url, // 当前显示图片的http链接
    //   urls: that.data.pics // 需要预览的图片http链接列表
    // })
    that.setData({
      layer: true,
      preview: event.currentTarget.dataset.url,
      previewIndex: event.currentTarget.dataset.index
    });
  },
  closePic: function() { //关闭图片
    let that = this;
    that.setData({
      layer: false
    });
  },
  delPic: function() {
    let that = this;
    let picsUp = that.data.photos;
    picsUp.splice(that.data.previewIndex, 1);
    that.setData({
      photos: picsUp,
      layer: false
    });
    console.log(11);
  },
  //提交评价
  submitComment() {
    let that = this;
    let postmsg = {
      "order_id" : that.data.tid,
      "score" : that.data.rate,
      "img" : that.data.photos,
      "comment" : that.data.comment + that.data.comment_box,
      "member_id" : that.data.member_id
    }
    console.log(postmsg);
    // return;
    common.post('/recover/orderAssess',postmsg).then( res => {
      console.log(res)
      if ( res.data.errno == 1 ) {
        app.showToast({
          title: '评价成功！',
        })
        setTimeout(() => {
          wx.navigateTo({url:"/pages/mine/myOrder/index?who=2"});
        }, 1000);
      } else {
        app.showToast({
          title: res.data.message,
        })
      }
    }).catch( error => {
      console.log(error)
      app.showToast({
        title: "数据异常！",
      })
    })
  }
})