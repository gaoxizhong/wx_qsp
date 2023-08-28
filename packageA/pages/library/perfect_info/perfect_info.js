const app = getApp();
const common = require('../../../../assets/js/common');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    personalInfo: '',
    infoData: [],
    create_count:'',
    cre_name:'',
    cre_phone:'',
    cre_address:'',
    latitude:'',
    longitude:'',
    big_address:'请选择省市区',
    is_submint:true,
    checked:false,
    is_xieyi:false,
    // library_password:'',
    library_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;

    if(options.library_id){
      that.setData({
        library_id: options.library_id
      })
    }
    wx.hideShareMenu(); //禁止转发
    // 登录
    wx.login({
      success: function (data) {
        console.log(data)
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        member_id: member_id,
        pop2: false
      })
    // 获取微信定位
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
        that.setData({
         latitude : Number(res.latitude),
          longitude : Number(res.longitude)
        })
        console.log(that.data.latitude)
        console.log(that.data.longitude)

        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        console.log(that.data.latitude)
        console.log(that.data.longitude)
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
  }
  that.get_my_info();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
  **/

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    console.log('触发了onshow')
    if (!that.data.member_id) {
      that.setData({
        pop2: true
      })
    }else{
      that.setData({
        pop2: false
      })
    }
    that.setData({
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
    })
  },
getData(){
  let that = this;
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) { //分享
    console.log(res)
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch() {
    return
  },
  // inputCrecount(e){
  //   console.log(e)
  //   let that = this;
  //   that.setData({
  //     create_count:e.detail.value
  //   })
  // },
  // inputCrename(e){
  //   console.log(e)
  //   let that = this;
  //   that.setData({
  //     cre_name:e.detail.value
  //   })
  // },
  inputCrephone(e){
    console.log(e)
    let that = this;
    that.setData({
      cre_phone:e.detail.value
    })
  },
  inputCreaddress(e){
    console.log(e)
    let that = this;
    that.setData({
      cre_address:e.detail.value
    })
  },
  // inputpassword(e){
  //   let that = this;
  //   that.setData({
  //     library_password:e.detail.value
  //   })
  // },
createActivity(){
  let that =this;
  let prems = {
      member_id: wx.getStorageSync('member_id'),
      library_id: that.data.library_id,
      phone : that.data.cre_phone,
      address : that.data.cre_address,
      big_address: that.data.big_address,
      info_status:1,
      library_name : that.data.library_name,
      member_name : that.data.member_name,
      library_img : that.data.library_img,
  }

  if(prems.library_name == ''){
    wx.showToast({
      title: '图书馆名称为空！',
      icon:'none'
    })
    return
  }
  if(prems.member_name == ''){
    wx.showToast({
      title: '姓名不能为空！',
      icon:'none'
    })
    return
  }
  if(prems.phone == ''){
    wx.showToast({
      title: '电话不能为空！',
      icon:'none'
    })
    return
  }
  if (!(/^1[345678]\d{9}$/.test(prems.phone)) ) {
    wx.showToast({
      "title": "请填写正确的联系方式！",
      "icon": "none"
    })
    return
  }
  if(prems.big_address == '' || prems.big_address == '请选择省市区'){
    wx.showToast({
      title: '请选择省市区！',
      icon:'none'
    })
    return
  }
  if(prems.address == ''){
    wx.showToast({
      title: '地址不能为空！',
      icon:'none'
    })
    return
  }
  // if(prems.library_password == ''){
  //   wx.showToast({
  //     title: '书店密码不能为空！',
  //     icon:'none'
  //   })
  //   return
  // }
  // if(!that.data.checked){
    
  //   wx.showToast({
  //     title: '请先同意用户协议！',
  //     icon:'none'
  //   })
  //   return
  // }
  let is_submint = that.data.is_submint;
  console.log(is_submint)
  if (!is_submint){
    wx.showToast({
      title: '请勿重复提交...',
      icon: 'none'
    })
    return
  }
  that.setData({
    is_submint: false
  })
  common.get('/library/make_library',prems).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '创建成功！！！',
        icon:'none',
        duration:2000,
      })
      setTimeout(function(){
        wx.navigateBack({
          delta:1,
        })
      },1500)
    }else{
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })
      that.setData({
        is_submint:true
      })
    }
  }).catch(e =>{
    console.log(e)
    that.setData({
      is_submint: true
    })
  })
},
// 城市三级联动
chooseAddress(e) {
  console.log(e)
  this.setData({
    big_address: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2]),
  })
},
  //选择图书馆
  // chooseLibrary(e) {
  //   let that = this;
  //   console.log(e)
  //   that.setData({
  //     checked : !that.data.checked,
  //   })
  // },
  // xieyi(){
  //   let that = this;
  //   that.setData({
  //     is_xieyi:true,
  //   })
  // },
  // tongyi(){
  //   let that = this;
  //   that.setData({
  //     checked:true,
  //     is_xieyi:false,
  //   })
  // }
  get_my_info(){
    let that = this;
    common.get('/library/get_member_library_detail',{
      member_id: wx.getStorageSync('member_id'),
      library_id: that.data.library_id
    }).then( res =>{
      if(res.data.code == 200){
        that.setData({
          library_name : res.data.data.library_info.library_name,
          member_name :  res.data.data.library_info.member_name,
          library_img :  res.data.data.library_info.library_img,
        })
      }
    })
  }
})