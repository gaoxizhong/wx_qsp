const app = getApp();
const common = require('../../assets/js/common');
const setting = require('../../assets/js/setting');
const publicMethod = require('../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
    data: {
        img_url: app.data.imgUrl,
        swiperCurrent: 0,
        v_head: '',  //头像
        v_back: '',  //背景
        contact_name : '',
        contact_profile : '',
        contact_phone : '',
        contact_area : '',
        isAgree: false,
        bannerUrls: [],
        isAgreeShow: false,
        longitude:'',
        latitude:'',
        garden:''
    },
    onLoad: function (options) {
      let that = this
      that.setData({
        member_id: wx.getStorageSync('member_id'),
        user_info: wx.getStorageSync('user_info')
      })
      that.getBannerUrls();
      
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this,this.data.longitude,this.data.latitude);
    },
    // 获取轮播图
    getBannerUrls() { //轮播图地址
      let that = this
      common.get('/banner/info', {
        member_id: that.data.member_id,
        type: 2
      }).then(res => {
        console.log("banner图")
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            bannerUrls: res.data.data
          })
        }
      }).catch(e => {
        app.showToast({
          title: "数据异常"
        })
        console.log(e)
      })
    },
    chooseHead: function() { //选取图片
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
    chooseBack: function() { //选取图片
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
    checkboxChange(e) {
      let that = this;
      console.log(e.detail.value,'change事件');
      let agree = e.detail.value;
      if( agree.length > 0 && agree[0] == 1 ) {
        console.log("同意了");
        that.setData({
          isAgree : true
        })
      } else {
        console.log("不同意");
        that.setData({
          isAgree : false
        })
      }
    },
    //保存资料
    savaData: function(e) {
      let that = this;
      console.log(e)
      let formData = e.detail.value;
      let garden = that.data.garden;
      // if(JSON.stringify(garden)  != '[]' ){
      //    garden = (formData.garden[0] + formData.garden[1] + formData.garden[2]);
      // }
      console.log(garden)
      if (that.data.v_head == '' || 
          that.data.v_back == '' ||
          garden == '' ||
          formData.contact_name == '' ||
          // formData.contact_profile == '' ||
          formData.contact_phone == '' ||
          formData.contact_area == '') 
      {
        app.showToast({
          title: "请将资料填写完整!",
        })
        return;
      }
      if ( !that.data.isAgree ) {
        app.showToast({
          title: "请同意协议!",
        })
        return;
      }
      let postmsg = {
        member_id: that.data.member_id,
        name: formData.contact_name,
        // desc: formData.contact_profile,
        phone: formData.contact_phone,
        address: garden + formData.contact_area,
        garden,
        area: formData.contact_area,
        avatar: that.data.v_head,
        bgimg: that.data.v_back,
        lng: that.data.longitude,
        lat: that.data.latitude,
      }
      that.sendRegister(postmsg);
    },
    //提交大V申请
    sendRegister(data) {
      console.log(data);
      common.post('/member/apply', data).then( res=> {
        console.log(res);
        if (res.data.code == 200) {
          //注册成功
          app.showToast({
            title: "已申请完成，等待平台审核!",
            duration:2000,
            success:function(){
              wx.navigateBack({ delta: -1 });
            }
          })
        } else {
          app.showToast({
            title: res.data.msg,
          })
        }
      }).catch( error=> {
        console.log(error);
        app.showToast({
          title: "数据异常!",
        })
      })
    },
    //弹出协议
    showAgreement() {
      let that = this;
      console.log("展现协议")
      that.setData({
        isAgreeShow: true
      })
    },
    //确认协议
    comfirmAgree() {
      let that = this;
      console.log("确认了");
      that.setData({
        isAgreeShow: false
      })
    },
    saveGarden(e) {
      console.log(e)
      this.setData({
        garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
      })
    },
})