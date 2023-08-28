const app = getApp()
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
    business_id:'',
    index: 0,
    is_business: 0,
    savaStatus: true,
    items: [],
    content: [],
    share: '',
    showModel: false,
    isDisabled: false,
    shareCode: 0,
    textareaVal:'',
    is_preview: false,
    is_activity:'1',
    ad_content:{},
    select_type:0,
    latitude: '',
    longitude: '',
    activity_id:0,
    img: [],  //活动图片，
    showFull: false,  //全屏
    sel_index: '',  //当前选中的图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options)
    if (options.business_id) {
      that.setData({
        business_id: options.business_id,
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
  },
  onShow: function() {
    let that = this;
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




  // 文本
  textareaChange(e) {
    let that = this
    that.setData({
      textareaVal: e.detail.value
    })
  },
  // 确定按钮
  shareSub: function (e) {
    let that  = this
    let content = that.data.textareaVal;
    console.log(that.data.textareaVal)
    if (content==""){
      wx.showToast({
        title:'内容不能为空！',
        icon:'none'
      })
      return
    }
    that.savaData1();
  },
  savaData1(e){
    let that = this;
    let savaStatus = that.data.savaStatus;
    let content = that.data.textareaVal;
    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false,
    })
    let param = {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      image: that.data.img,
      content,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
    }
    that.createContent(param)
  },
  createContent(param){
    let that = this
    wx.showLoading({
      title: '发表中...',
    })
    common.post('/business/add_story',param).then(res => {
      wx.hideLoading();
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }else{
        that.setData({
          savaStatus: true
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        return
      }
    }).catch(e => {
      wx.hideLoading();
      that.setData({
        savaStatus: true,
      })
      wx.showToast({
        title: "数据异常",
        icon: 'none'
      })
      console.log(e)
    })
  },
  onHide() {
  }
})