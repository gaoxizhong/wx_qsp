const app = getApp()
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact_name: '', //联系人
    contact_phone: '', //联系电话
    img:[],
    top_img:[],
    member_id:'',
    currentTab1:1,
    get_integral:'0.00',
    search_info1:'',
    search_info2:'',
    search_info3:'',
    savaStatus: true,
    remark:'',
    S_name:'小青老师',
    S_tel:'010-84672332',
    S_add:'北京市朝阳区来广营乡水岸南街城建N次方',
    is_infos:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      member_id,
      type:1,
      currentTab1: 1,

    })
    that.getdata();
    wx.hideShareMenu();
    
  },
  onShow: function () {

  },
    //从banner图跳转 1为文章，2为商家，3为会话
    goToFromImg(e) {
      console.log(e)
      let dataset = e.currentTarget.dataset;
      if ( dataset.label == 1) {
        //跳转文章
        let url = "/pages/detail/detail?article_id=" + dataset.labelid;
        wx.navigateTo({
          url: url
        })
      } else if ( dataset.label == 2 ) {
        //跳转商家
        let url = "/pages/shop/shop?business_id=" + dataset.labelid;
        wx.navigateTo({
          url: url
        })
      } else if ( dataset.label == 3 ) {
        //发起会话
  
      }
    },
  // 点击复制
  fuzhi_btn(){
    let that = this;
    let S_info = that.data.S_name + that.data.S_tel + that.data.S_add;
    wx.setClipboardData({
      data: S_info,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) 
            wx.showToast({
              title: '复制成功！',
            })
          }
        })
      }
    })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  getdata(){
    this.getBannerUrls();
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/banner/newInfo', {
      member_id: that.data.member_id,
      type:17
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          top_img: res.data.data,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
    })
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
      "member_id": that.data.member_id,
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
    common.get('/book_integral/mail_add', param).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: 'success',
          success:function(){
            wx.reLaunch({
              url: '/packageA/pages/mailing_submit/index?member_id='+ wx.getStorageSync('member_id'),
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
    console.log(e.detail.value)
    this.setData({
      contact_name: e.detail.value
    })
  },
  contact_phone(e) {
    console.log(e.detail.value)
    this.setData({
      contact_phone: e.detail.value
    })
  },
  get_view_list(){
    let that = this;
    that.setData({
      is_infos: true
    })
  },
  hidden_infos(){
    let that = this;
    that.setData({
      is_infos: false
    })
  },
  buyNow(){
    let that = this;
    that.setData({
      is_infos: false
    })
  }
})