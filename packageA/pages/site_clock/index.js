const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const setting = require('../../../assets/js/setting');
const QQMapWX = require('../../../assets/js/qqmap-wx-jssdk.min');//1、必须引入
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos:[],
    img:[],
    password_layer: false,
    add_password:'',
    site_layer:false,
    site_name:'',
    site_community:'',
    site_subdistrict:'',
    site_serial:'',
    volunteers_layer:false,
    latitude: '',
    longitude: '',
    canIUseGetUserProfile: false,
    vol_status : 0,
    count : 0,
    sum : 0,
    vol_list : [],
    vol_name:'',
    vol_mobile:'',
    password:0,
    inx:0,
    oldNewarray:[],
    community_id: '',
    is_siteinfo:false,
    useinter_info:[],
    site_note:'',
    is_sitenear:false,
    recoverid:-1,
    recoverList:[],
    site_id:0,
    data_name:'',
    manager_layer:false,
    add_manager:'',
    admin_name: '',
    mobile: '',
    community_password: '',
    tips:'',
    now_hour:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 转百度定位坐标
    // publicMethod.zhuan_baidu(this);
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

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
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return
    } else {
      that.setData({
        pop2: false
      })
      that.getvolunteersdata();
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
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
  /*验证编码是否正确 */
  add_password(e){
    let that = this;
    console.log(e)
    let password = e.detail.value.add_password;
    if (password==''){
      app.showToast({
        title: "请输入密码"
      })
      return
    }else{
      common.get('/trash/get_site_address', {
        password,
      }).then(res => {
        if(res.data.code==200){
          let site_subdistrict = wx.getStorageSync('site_subdistrict');
          let community_id = wx.getStorageSync('community_id');
          let site_community = wx.getStorageSync('site_community');
          console.log(site_subdistrict+ '/' + community_id + '/' + site_community)
          that.setData({
            site_name: res.data.data.address,
            password,
            password_layer: false,
            site_layer: true,
            oldNewarray:res.data.data.community,
            site_subdistrict,
            community_id,
            site_community,
          })
        }else{
          app.showToast({
            title: res.data.msg,
          })
          that.setData({
            password: 0
          })
        }

      })
    }
  },
  cover_layer(){
    this.setData({
      password_layer:false
    })
  },
  set_site(){
    this.setData({
      password_layer:true
    })
  },

  site_layer(){
    this.setData({
      site_layer:false
    })
  },
  set_manager(){
    this.setData({
      manager_layer:true
    })
  },
  manager_layer(){
    this.setData({
      manager_layer:false
    })
  },
  set_volunteersform(e){
    let that = this;
    let vol_name = e.detail.value.vol_name;
    let vol_mobile = e.detail.value.vol_mobile;
    let declare_serial = e.detail.value.declare_serial;
    if (!vol_name || vol_name == ''){
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      })
      return
    }
    if (!vol_mobile || vol_mobile == ''){
      wx.showToast({
        title: '请填写手机号',
        icon:'none'
      })
      return
    }
    common.post('/trash/update_member',{
      member_id: wx.getStorageSync('member_id'),
      name: vol_name,
      mobile: vol_mobile,
      declare_serial,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '设置成功！',
          icon:'none'
        })
        that.setData({
          volunteers_layer: false
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  set_volunteers(){
    let that = this;
    common.get('/trash/check_member',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          vol_name: res.data.data.name,
          vol_mobile: res.data.data.mobile,
          declare_serial: res.data.data.declare_serial,
        })
      }
    }).catch(e =>{
      console.log(e)
    })
    that.setData({
      volunteers_layer:true,
    })
  },
  volunteers_layer(){
    this.setData({
      volunteers_layer: false,
    })
  },

  getvolunteersdata(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');

    common.get('/trash/vol',{
      member_id
    }).then(res =>{
      if(res.data.code == 200){
        console.log(res)
        let vol_data = res.data.data;
        that.setData({
          vol_status : vol_data.status,
          count : vol_data.count,
          sum : vol_data.sum,
          tips : vol_data.tips,
          vol_list : vol_data.list,
          data_name: vol_data.name,
          admin_name: vol_data.community?vol_data.community.admin_name:'',
          mobile: vol_data.community?vol_data.community.mobile:'',
          site_community: vol_data.community?vol_data.community.name:'',
          community_password: vol_data.community?vol_data.community.community_password:'',
          now_hour: vol_data.now_hour
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },



  choose: function() { //选取图片
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有删掉'original'则只有压缩上传。
      sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有'album', 'camera'
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
  openPhoto: function(e) { //打开图片
    let that = this;
    console.log(e);
    that.setData({
      layer: true,
      preview: e.currentTarget.dataset.url,
      previewIndex: e.currentTarget.dataset.index
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
    let img = that.data.img;
    img.splice(that.data.previewIndex, 1);
    that.setData({
      img,
      layer: false
    });
  },
  bindPickerChange(e) {
    console.log(e)
    let that = this;
    let oldNewarray = that.data.oldNewarray;
    let site_community = oldNewarray[e.detail.value].name;
    let community_id = oldNewarray[e.detail.value].id;
    wx.setStorageSync('community_id', community_id);
    wx.setStorageSync('site_community', site_community);
    that.setData({
      site_community,
      community_id,
    })
  },
  // 开始按钮
  start_btn(e){
    let that = this;
    if( that.data.latitude ){
      that.getStartLocation();
    }else{
      // 获取定位
      publicMethod.zhuan_baidu(this,that.getStartLocation);
    }
    return
    that.get_gps(e,that,that.getStartLocation);
  },
  // 结束按钮
  end_btn(e){
    let that = this;
    if( that.data.latitude ){
      that.getendLocation();
    }else{
      // 获取定位
      publicMethod.zhuan_baidu(this,that.getendLocation);
    }
    return
    that.get_gps(e,that,that.getendLocation);
  },
  // 设置桶站确定按钮
  set_siteform(e){
    let that = this;
    if( that.data.latitude ){
      that.getsetsiteLocation();
    }else{
      // 获取定位
      publicMethod.zhuan_baidu(this,that.getsetsiteLocation);
    }
    return
    that.get_gps(e,that,that.getsetsiteLocation);
  },
  get_gps(e,t,f){
    let that = t;
    let evn = e;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'MBQBZ-IU4CX-XI34P-75P45-R5O22-XGF67'
    });
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      return f(evn);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          return f(evn)
        } else {
          return f(evn)

        }
      }
    })
  },
  // 获取附近列表
  getStartLocation(){
    let that = this;
    let longitude = that.data.longitude;
    let latitude = that.data.latitude;
    common.get('/trash/check_member',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showLoading({
          title: '加载中...',
        })
        common.get('/trash/get_nearby_site',{
          member_id: wx.getStorageSync('member_id'),
          lat: latitude,
          lng: longitude
        }).then(res =>{
          if(res.data.code == 200){
            wx.hideLoading();
            let recoverList = res.data.data;
            let recoverid = that.data.recoverid;
            console.log(recoverList[recoverid])
            that.setData({
              is_sitenear:true,
              recoverList,
              // recoverid:recoverList.length > 0 && recoverList[recoverid].count < 2  ? recoverid : -1,
              // site_id:recoverList.length > 0 && recoverList[recoverid].count < 2  ? recoverList[recoverid].id : '',
            })
            console.log(that.data.recoverid)
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
      }else if(res.data.code == 403){
        wx.showModal({
          content:'请先填写志愿者信息',
          confirmColor:'#db1010',
          success(res){
            if(res.confirm){
              that.setData({
                volunteers_layer:true
              })
            }
          }
        })
        return
      }else{
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
  // 开始值守信息提交
  getStartLocation_1(){
    let that = this;
    let site_id = that.data.site_id;
    let recoverid = that.data.recoverid;
    if(recoverid == '-1'){
      wx.showToast({
        title: '请先选择要值守的桶站',
        icon: 'none'
      })
      return
    }
    console.log(site_id)
    common.get('/trash/start',{
      member_id: wx.getStorageSync('member_id'),
      site_id,
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '值守开始',
          icon:'none',
          duration: 2000
        })
        setTimeout(function(){
          that.getvolunteersdata();
          that.setData({
            is_sitenear:false,
            recoverid: -1,
          })
        },1500)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          is_sitenear:false,
          recoverid: -1,

        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 结束值守信息提交
  getendLocation(){
    let that = this;
    common.get('/trash/end_check',{
      member_id: wx.getStorageSync('member_id'),
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      if(res.data.code == 200){
        let img = that.data.img;
        if(!img || img.length <= 0){
          wx.showToast({
            title: '请先上传桶站值守照片！',
            icon:'none'
          })
          return
        }
        common.get('/trash/end',{
          member_id: wx.getStorageSync('member_id'),
          lat: that.data.latitude,
          lng: that.data.longitude,
          image: img,
        }).then(res =>{
          if(res.data.code == 200){
            wx.showToast({
              title: '值守结束',
              icon:'none',
              duration: 2000,
            })
            that.setData({
              img:[]
            })
            setTimeout(function(){
              wx.reLaunch({
                url: '/pages/circle/circle',
              })
            },1500)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
        }).catch(e =>{
          console.log(e)
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })

  },
  // 设置桶站信息提交
  getsetsiteLocation(e){
    console.log(e)
    let that = this;
    let site_community = that.data.site_community;
    let site_subdistrict = e.detail.value.site_subdistrict;
    let number = e.detail.value.site_serial;
    let remark = e.detail.value.site_note;
    wx.setStorageSync('site_subdistrict', site_subdistrict);
    if (!site_community || site_community == ''){
      wx.showToast({
        title: '请选择社区',
        icon:'none'
      })
      return
    }
    if (!site_subdistrict || site_subdistrict == ''){
      wx.showToast({
        title: '请填写小区',
        icon:'none'
      })
      return
    }
    if (!number || number == ''){
      wx.showToast({
        title: '请填写编号',
        icon:'none'
      })
      return
    }
    common.get('/trash/set_trash_site',{
      member_id: wx.getStorageSync('member_id'),
      password: that.data.password,
      community_id: that.data.community_id,
      village: site_subdistrict,
      number,
      remark,
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{ 
      if(res.data.code == 200){
        wx.hideLoading();
        wx.showToast({
          title: '恭喜！设置成功，请前往下一个站点！',
          icon:'none',
          duration: 3500
        })
        that.setData({
          site_layer: false
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
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  give_btn(){
    let that = this;
    wx.showModal({
      title:'放弃值守',
      content:'是否放弃值守？放弃值守本次不记录值守信息！',
      success(res){
        if(res.confirm){
          common.get('/trash/abandon',{
            member_id:wx.getStorageSync('member_id'),
          }).then(res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '放弃值守成功',
                icon:'none',
                duration: 2000
              })
              setTimeout(function(){
                that.getvolunteersdata();
              },1500)
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none',
                duration: 2000
              })
            }
          }).catch(e =>{
            console.log(e)
          })
        }
      }
    })
  },
  // 查看设置的桶站
  view_info_btn(){
    let that = this;
    common.get('/trash/get_my_site',{
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          useinter_info: res.data.data,
          is_siteinfo: true
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  siteinfo_layer(){
    this.setData({
      is_siteinfo: false,
    })
  },
  //选择值守人员
  chooseRecover(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let site_id = e.currentTarget.dataset.site_id;
    let count = e.currentTarget.dataset.count;
    console.log(count)
    if( count >= 2 ){
      wx.showToast({
        title: '请选择其它桶站值守',
        icon: 'none'
      })
      return
    }else{
      that.setData({
        recoverid:index,
        site_id,
      })
    }

  },
  sitenear_layer(){
    this.setData({
      is_sitenear:false
    })
  },

  /*社区管理员验证编码是否正确 */
  add_manager(e){
    let that = this;
    console.log(e)
    let password = e.detail.value.add_manager;
    if (password==''){
      app.showToast({
        title: "请输入密码"
      })
      return
    }else{
      common.get('/trash/get_site_address', {
        password,
      }).then(res => {
        if(res.data.code==200){
          let site_subdistrict = wx.getStorageSync('site_subdistrict');
          let community_id = wx.getStorageSync('community_id');
          let site_community = wx.getStorageSync('site_community');
          console.log(site_subdistrict+ '/' + community_id + '/' + site_community)
          that.setData({
            site_name: res.data.data.address,
            manager_layer: false,
            site_manager: true,
            password,
            oldNewarray:res.data.data.community,
          })
        }else{
          app.showToast({
            title: res.data.msg,
          })
          that.setData({
            password: 0
          })
        }

      })
    }
  },
  // 设置管理员信息提交
  set_managerform(e){
    console.log(e)
    let that = this;
    let site_community = that.data.site_community;
    let password = that.data.password;
    let site_name = e.detail.value.site_name;
    let admin_name = e.detail.value.admin_name;
    let mobile = e.detail.value.mobile;
    let community_password = e.detail.value.community_password;
    let community_id = wx.getStorageSync('community_id');

    if (!site_community || site_community == ''){
      wx.showToast({
        title: '请选择社区',
        icon:'none'
      })
      return
    }
    if (!admin_name || admin_name == ''){
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      })
      return
    }
    if (!mobile || mobile == ''){
      wx.showToast({
        title: '请填写电话',
        icon:'none'
      })
      return
    }
    if (!community_password || community_password == ''){
      wx.showToast({
        title: '请设置密码',
        icon:'none'
      })
      return
    }
    common.post('/trash/set_community_info',{
      member_id: wx.getStorageSync('member_id'),
      password,
      admin_name,
      mobile,
      community_id,
      community_password,
    }).then(res =>{ 
      if(res.data.code == 200){
        wx.hideLoading();
        wx.showToast({
          title: '恭喜,设置成功！',
          icon:'none',
          duration: 3500
        })
        that.setData({
          site_manager: false
        })
        that.getvolunteersdata();
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  site_manager(){
    this.setData({
      site_manager:false
    })
  },
  goguide(){
    wx.navigateTo({
      url: '/packageA/pages/operate_guide/index',
    })
  }
})