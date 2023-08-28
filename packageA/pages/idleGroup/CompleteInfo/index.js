const app = getApp();
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({
    data: {
        img_url: app.data.imgUrl,
        swiperCurrent: 0,
        v_head: '',  //头像
        contact_name : '',
        contact_profile : '',
        contact_phone : '',
        contact_area : '',
        bannerUrls: [],
        longitude:'',
        latitude:'',
        garden:'',
        sex:'',
        sex_list:['男','女'],
        date_index:'0',
        type:'',
        group_id:'',
        region:['北京市','北京市','海淀区']
    },
    onLoad: function (options) {
      let that = this
      that.setData({
        type: options.type,
        group_id: options.group_id,
        member_id: wx.getStorageSync('member_id'),
        user_info: wx.getStorageSync('user_info')
      })
      wx.getLocation({
        type: 'wgs84',
        success:function(res){
          console.log(res)
          that.setData({
           latitude : Number(res.latitude),
           longitude : Number(res.longitude)
          })
          // zhuan_dingwei方法转换百度标准
          var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
          that.setData({
            longitude: gcj02tobd09[0],
            latitude: gcj02tobd09[1]
          })
          that.getLibrarygeren();
        },
        fail: function(res) {
          wx.showToast({
            title: '需要开启手机定位',
            icon:'none'
          })
          that.setData({
            latitude: '',
            longitude: ''
          })
          that.getLibrarygeren();
          if (res.errMsg == "getLocation:fail auth deny") {
            that.openSetting(that)
          }
        }
      })
    },
    onShow: function () {
      let that = this;
      that.setData({
        user_info: wx.getStorageSync('user_info'),
        configData: wx.getStorageSync('configData'),
        personalInfo: wx.getStorageSync('personalInfo'),
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
    //保存资料
    savaData: function(e) {
      let that = this;
      console.log(e)
      let formData = e.detail.value;
      let garden = that.data.garden;
      let sex = that.data.sex;
      // if(JSON.stringify(garden)  != '[]' ){
      //    garden = (formData.garden[0] + formData.garden[1] + formData.garden[2]);
      // }
      console.log(garden)
      if (that.data.v_head == '' || garden == '' || formData.contact_name == '' || formData.contact_area == '' || formData.contact_phone == '' ||sex == '') 
      {
        app.showToast({
          title: "请将资料填写完整!",
        })
        return;
      }
      let postmsg = {
        member_id: that.data.member_id,
        group_name: formData.contact_name,
        mobile: formData.contact_phone,
        address: formData.contact_area,
        garden,
        group_image: that.data.v_head,
        lng: that.data.longitude,
        lat: that.data.latitude,
        gender:that.data.sex,
        group_id: that.data.group_id,
        type: that.data.type,
      }
      that.sendRegister(postmsg);
    },
    sendRegister(data) {
      console.log(data);
      common.post('/idlegroup/create', data).then( res=> {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: "完善成功！",
            duration:2000,
          })
          setTimeout(function(){
            wx.navigateBack({ delta: -1 });
          },2000)
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


    saveGarden(e) {
      console.log(e)
      let code1 = e.detail.code[0];
      console.log(code1)
      if(code1 == "110000" || code1 == "120000" ||code1 ==  "310000" ||code1 ==  "500000"){
        console.log('1')
        this.setData({
          garden: (e.detail.value[1] + e.detail.value[2])
        })
      }else{
        console.log('2')
        this.setData({
          garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
        })
      }

    },
    bindPickerChange(e) {
      let that = this;
      console.log('picker发送选择改变，携带值为', e.detail.value)
      that.setData({
        date_index:e.detail.value,
        sex:that.data.sex_list[e.detail.value]
      })
    },
    // 查看团信息
    getLibrarygeren() {
      let that = this;
      let params = {
        member_id:wx.getStorageSync('member_id'),
        lng: that.data.longitude,
        lat: that.data.latitude,
        group_id: that.data.group_id
      }
      wx.showLoading({
        title: '加载中...',
      })
      common.get("/idlegroup/detail", params).then( res => {
        console.log(res)
        if (res.data.code == 200) {
          wx.hideLoading();
          let group = res.data.data.group;
          that.setData({
            contact_name: group.group_name,
            contact_phone: group.mobile,
            contact_area: group.address,
            garden: group.garden,
            v_head: group.group_image,
            sex:group.gender,
            group_id: group.id,
            type: group.type,
          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e =>{
        wx.hideLoading();
        console.log(e)
      })
    },
})