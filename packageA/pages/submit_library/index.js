const app = getApp()
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    library_info:{},
    currentTab1:1,
    contact_name: '', //联系人
    contact_phone: '', //联系电话
    img:[],
    member_id:'',
    currentTab1:1,
    get_integral:'0.00',
    search_info1:'',
    search_info2:'',
    search_info3:'',
    savaStatus: true,
    remark:'',
    type:1,
    longitude: '',
    latitude: '',
    is_comtype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.is_comtype == 'community'){
      wx.setNavigationBarTitle({
        title:'绿城•金泰城丽湾'
      })
      that.setData({
        is_comtype: options.is_comtype,
      })
    }

    let library_info = wx.getStorageSync('libraryList_info');
    console.log(library_info)
    that.setData({
      library_info,
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
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '需要开启手机定位',
          content: '请前去开启GPS服务',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    });
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
  get_fangshi: function (e) {
    let that = this
    var cur1 = e.currentTarget.dataset.index;
    that.setData({
      get_integral:'0.00',
      search_info1:'',
      search_info2:'',
      search_info3:'',
      currentTab1: cur1,
    })
    if (cur1 == 1) {
      //方法一
      let search_info1 = that.data.search_info1;
      let tem = 0;
      tem =  tem + (search_info1 * 10);
      let tot = tem.toFixed(2);
      that.setData({
        type:1,
        get_integral:tot
      })
    } else if (cur1 == 2) {
      //方法二
      let search_info2 = that.data.search_info2;
      let tem = 0;
      tem =  tem + (search_info2 * 1);
      let tot = tem.toFixed(2);
      that.setData({
        type:2,
        currentTab1: cur1,
        get_integral:tot

      })
    }

  },
    // 方法一输入框事件
    book_num(e){
      let search_info1 = e.detail.value.replace(/\D/g,'');
      let tem = 0;
      tem =  tem + (search_info1 * 10);
      let tot = tem.toFixed(2);
      if(tot >= 1000){
        this.setData({
          search_info1,
          get_integral:1000,
        })
      }else{
        this.setData({
          search_info1,
          get_integral:tot,
        })
      }
    },
   // 方法二输入框事件
   book_cost(e){
    let search_info2 = e.detail.value.replace(/\D/g,'');
    let tem = 0;
    tem =  tem + (search_info2 * 1);
    let tot = tem.toFixed(2);
    if(tot >= 1000){
      this.setData({
        search_info2,
        get_integral:1000,
      })
    }else{
      this.setData({
        search_info2,
        get_integral:tot,
      })
    }
  
  },
   // 方法二输入框事件
   book_cost1(e){
    let search_info3 = e.detail.value.replace(/\D/g,'');
    this.setData({
      search_info3,
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
remark(e){
  this.setData({
    remark:e.detail.value
  })
},
relIdle_btn(e) { //提交
    let that = this
    let savaStatus = that.data.savaStatus;
    if(that.data.currentTab1 == 1){
      if(that.data.search_info1 == ''){
        wx.showToast({
          title: '请输入图书数量！',
          icon: 'none'
        })
        return
      }
    }
    if(that.data.currentTab1 == 2){
      if( that.data.search_info2 == ''){
        wx.showToast({
          title: '请输入图书价格！',
          icon: 'none'
        })
        return
      }
    }
    if(that.data.currentTab1 == 2 && that.data.search_info3 == ''){
        wx.showToast({
          title: '请输入图书数量！',
          icon: 'none'
        })
        return
    }
    if(that.data.img.length < 2){
      wx.showToast({
        title: '最少上传2张图片',
        icon:'none'
      })
      return
    }
    if (that.data.contact_name == '' || that.data.contact_phone == '' ){
      wx.showToast({
        title: '请填写用户信息！',
        icon:'none'
      })
      return
    }
    if (!(/^1[345678]\d{9}$/.test(that.data.contact_phone)) ) {
      wx.showToast({
        title: '请输入正确的电话号码！',
        icon: 'none',
      })
      return
    }

    let param ={
      "member_id": wx.getStorageSync('member_id'),
      "library_name": that.data.library_info.library_name,
      "library_id": that.data.library_info.id,
      "pay_type": that.data.type,
      "name": that.data.contact_name,
      "mobile": that.data.contact_phone,
      "integral":that.data.get_integral,
      "book_num":that.data.search_info3,
      "remark": that.data.remark,
      "thumb":that.data.img,
    };
    if(that.data.currentTab1 == 1){
      param.book_num = that.data.search_info1;
    }

    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    wx.showNavigationBarLoading();
    common.get('/book_integral/service_add', param).then(res => {
      if (res.data.code == 200) {
        let id = res.data.data;
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: 'success',
          success:function(){
            wx.reLaunch({
              url: '/packageA/pages/second_confirm/index?member_id='+ wx.getStorageSync('member_id') + '&library_id=' + that.data.library_info.id + '&longitude=' + that.data.longitude + '&latitude=' + that.data.latitude + "&id=" + id,
            })
          }
        })
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
  contact_name(e) {
    this.setData({
      contact_name: e.detail.value
    })
  },
  contact_phone(e) {
    this.setData({
      contact_phone: e.detail.value
    })
  },
    /**调用电话 */
tel(e) {
  if (this.data.library_info.phone != null || this.data.library_info.phone != ""){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  }else{
    app.showToast({
      title: "暂无联系电话"
    })
  }
},
congxuan(){
  wx.navigateTo({
    url: '/packageA/pages/sent_library/index',
  })
},
      //查询路线
      getRoadLine(e) {
        let that = this;
        console.log(e);
        let name = e.currentTarget.dataset.name;
        let address = e.currentTarget.dataset.address;
        let latitude = e.currentTarget.dataset.latitude;
        let longitude = e.currentTarget.dataset.longitude;
        // zhuan_dingwei方法转换百度标准
        let gcj02tobd09 = zhuan_dingwei.wgs84togcj02(longitude, latitude);
        longitude= Number(gcj02tobd09[0]),
        latitude= Number(gcj02tobd09[1])
        wx.getLocation({
          type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
          isHighAccuracy: true,
          success: function (res) {  //因为这里得到的是你当前位置的经纬度
            console.log(res)
            wx.openLocation({        //所以这里会显示你当前的位置
              latitude,
              longitude,
              name,
              address,
              scale: 18
            })
          }
        })
      },
})