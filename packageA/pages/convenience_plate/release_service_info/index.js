const app = getApp();
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
const publicMethod  = require('../../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items_list:[],
    seled_items:1,
    aptitude_img:[],
    sel_index: 0,
    showFull: false,
    banner_img:[],
    is_btn:'1',
    member_name: '',
    member_mobile: '',
    member_address: '',
    member_time: '',
    info_title: '',
    info_details: '',
    member_garden:'',
    items: [
      {value: '1', name: '允许',checked:true},
      {value: '2', name: '不允许'},
    ],
    comment: 1,
    type_id:'' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    that.getClassmodule();

    // 内容回显
    common.get("/newservice/update",{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == "200"){
        let items = this.data.items;
        let pream_info = res.data.data;
        if(pream_info.length > 0){
          console.log(items)
          for (let i = 0, len = items.length; i < len; ++i) {
            items[i].checked = items[i].value === pream_info.comment
          } 
          that.setData({
            items
          })
        }

        that.setData({
          member_name: pream_info.member_name ? pream_info.member_name : '',
          member_mobile: pream_info.mobile ? pream_info.mobile : '',
          member_address: pream_info.address ? pream_info.address : '',
          member_garden: pream_info.garden ? pream_info.garden : '',
          member_time: pream_info.time ? pream_info.time : '',
          info_title: pream_info.title ? pream_info.title : '',
          info_details: pream_info.detail ? pream_info.detail : '',
          banner_img: pream_info.image ? pream_info.image : [],
          aptitude_img: pream_info.prove ? pream_info.prove : [],
          seled_items: pream_info.type ? pream_info.type : '',
          type_id: pream_info.id ? pream_info.id : '',
        })
      }
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
    // 获取模块项目
    getClassmodule(){
      let that = this;
      common.get('/newservice/typeNoUrl', {}).then(res => {
        if (res.data.code == 200) {
          let items_list = res.data.data.array;
          that.setData({
            items_list,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e => {
        app.showToast({
          title: "数据异常"
        })
      })
    },
  // 选择项目名称
  seled_items(e){
    console.log(e)
    let that = this;
    that.setData({
      seled_items:e.currentTarget.dataset.id
    })
  },
  //上传图片
  choosePic: function(e) { //选取图片
    let that = this;
    let is_btn = e.currentTarget.dataset.is_btn;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        that.upLoadImg(tempFiles, 0,is_btn);
        return;
      }
    })
  },
  //上传图片
  upLoadImg(image,index,is_who) {
    let that = this;
    let i = index;
    let img = image;
    let is_btn = is_who;
    if ( i >= img.length ) {
      return
    }
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
          if(is_btn == '1'){
            that.data.aptitude_img.push(data.data.url[0]);
            that.setData({
              aptitude_img: that.data.aptitude_img
            })
          }else if(is_btn == '2'){
            that.data.banner_img.push(data.data.url[0]);
            that.setData({
              banner_img: that.data.banner_img
            })
          }


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
    let is_btn = e.currentTarget.dataset.is_btn;
    if(is_btn == '1'){
      that.setData({
        preview: that.data.aptitude_img[index],
        is_btn,
      })
    }else if(is_btn == '2'){
      that.setData({
        preview: that.data.banner_img[index],
        is_btn,
      })
    }
    that.setData({
      sel_index: index,
      showFull: true
    })
  },
  //关闭资质图片预览
  closePic() {
    this.setData({
      showFull: false
    })
  },
  //删除资质图片
  delPic() {
    let that = this;
    let index = that.data.sel_index;
    let is_btn = that.data.is_btn;
    if(is_btn == '1'){
      that.data.aptitude_img.splice(index,1);
      that.setData({
        aptitude_img: that.data.aptitude_img
      })
    }else if(is_btn == '2'){
      that.data.banner_img.splice(index,1);
      that.setData({
        banner_img: that.data.banner_img
      })
    }
    that.setData({
      showFull: false,
    })
  },

  formSubmit(e){
    console.log(e)
    let that = this;
    let pream = {
      "member_id": wx.getStorageSync('member_id'),
      "member_name": e.detail.value.member_name,
      "mobile": e.detail.value.member_mobile,
      "address": e.detail.value.member_address,
      "garden": that.data.member_garden,
      "time": e.detail.value.member_time,
      "title": e.detail.value.info_title,
      "detail": e.detail.value.info_details,
      "image": that.data.banner_img,
      "prove": that.data.aptitude_img,
      "type": that.data.seled_items,
      "lat": that.data.latitude,
      "lng": that.data.longitude,
      "comment": that.data.comment,
    }
    if(that.data.type_id){
      pream.id = that.data.type_id
    }
    console.log(pream)
    if(!pream.member_name){
      wx.showToast({
        title: '请填写名称',
        icon:'none'
      })
      return
    }
    if(!pream.mobile){
      wx.showToast({
        title: '请填写手机号',
        icon:'none'
      })
      return
    }
    if(!pream.garden){
      wx.showToast({
        title: '请选择省市区',
        icon:'none'
      })
      return
    }
    if(!pream.address){
      wx.showToast({
        title: '请填写详细地址',
        icon:'none'
      })
      return
    }
    if(!pream.time){
      wx.showToast({
        title: '请填写营业时间',
        icon:'none'
      })
      return
    }
    if(!pream.title){
      wx.showToast({
        title: '请填写标题',
        icon:'none'
      })
      return
    }
    if(!pream.detail){
      wx.showToast({
        title: '请填写详情介绍',
        icon:'none'
      })
      return
    }
    common.get("/newservice/add",pream).then( res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:"none",
          success:function(){
            setTimeout(function(){
              wx.reLaunch({
                url: '/packageA/pages/convenience_plate/plate_lists/index?id=' + that.data.seled_items,
              })
            },1500)
          }
        })

      }else{
        wx.showToast({
          title:res.data.msg,
          icon:'none'
        })
      }
    })
  },
  saveGarden(e){
    console.log(e)
    this.setData({
      member_garden: e.detail.value[0] +  e.detail.value[1] +  e.detail.value[2],
    })
  },
  member_name(e){
    this.setData({
      member_name: e.detail.value,
    })
  },
  member_mobile(e){
    this.setData({
      member_mobile: e.detail.value,
    })
  },
  member_address(e){
    this.setData({
      member_address: e.detail.value,
    })
  },
  member_time(e){
    this.setData({
      member_time: e.detail.value,
    })
  },
  info_title(e){
    this.setData({
      info_title: e.detail.value,
    })
  },
  info_details(e){
    this.setData({
      info_details: e.detail.value,
    })
  },
  preview_btn(){
    let that = this;
    app.preview_pream = {};
    let preview_pream= {
      "member_name": that.data.member_name,
      "member_mobile": that.data.member_mobile,
      "member_address": that.data.member_address,
      "member_garden": that.data.member_garden,
      "member_time": that.data.member_time,
      "info_title": that.data.info_title,
      "info_details": that.data.info_details,
      "banner_img": that.data.banner_img,
      "aptitude_img": that.data.aptitude_img,
      "type_id": that.data.seled_items,
      "comment": that.data.comment,
    }
    app.preview_pream = preview_pream;
    console.log(preview_pream)
    wx.navigateTo({
      url: '/packageA/pages/convenience_plate/preview_page/index',
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items;
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    this.setData({
      comment: e.detail.value,
      items
    })
  }
})