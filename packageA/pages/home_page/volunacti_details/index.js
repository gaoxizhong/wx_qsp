const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
var WxParse = require('../../../../wxParse/wxParse.js');
const publicMethod = require('../../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    poster_tabs:[],
    swiper_index:1,
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    id:'',
    name:'',
    details_info:{},
    is_pop:false,
    declare_name:'', // 申报姓名
    declare_serial:'', // 志愿者编号
    declare_phone:'', // 手机号
    // declare_title:'', // 标题
    img:[],
    showFull:false,
    garden: '', //所在小区
    address: '', //详细地址,
    pream: {},
    placeho_text:'我是一名志愿者，我奉献我一点点的爱心~让我们传递爱的小火苗，温暖整个世界',
    longitude:'',
    latitude:'',
    view_member_id: '',
    is_preview : false,
    remark:'',
    pop2: false,
    is_notice:false,
    is_materiel_text:false,
    is_clock_img:false,
    canIUseGetUserProfile: false,
    is_clock_text2: false,
    content: {},
    like:0,
    activityid:4,
    is_succss:false,
    isgoback: 0,
    is_jiazai:true,
    is_duizhang: 0,
    notice:"",
    my_share:{},
    discount: 100,
    share_id: '',
    share_info:'',
    statuis: 0,
    total_price: 0.00,
    daze: 0.00,
    count: 0,  //  活动限制次数
    my_count: 0, //  我参与的次数
    activity_status: 1,
    ext_list: [],
    recover_index:0,
    selectedExt: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if(options.isgoback){
      that.setData({
        isgoback: options.isgoback
      })
    }
    if(options.is_duizhang){
      that.setData({
        is_duizhang: options.is_duizhang,
        share_id: options.share_id?options.share_id:''
      })
    }

    that.setData({
      id: options.id,
      name: options.name?options.name:''
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    let id = that.data.id;
    if(wx.getStorageSync('activityid_'+id+'_step')){
      that.setData({
        activityid: wx.getStorageSync('activityid_'+id+'_step'),
      })
    }else{
      that.setData({
        activityid: 4,
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
    that.setData({
      member_id,
    })
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        pop2: false,
        is_jiazai:true
      })
    }
    if(that.data.isgoback == '1'){
     that.click_declare();
    }
    that.getdetails();
    if(that.data.share_id){
      that.my_share();
    }
    let selectedExt = wx.getStorageSync('selectedExt');
    if(!selectedExt){
      common.get('/activity/ext_list',{
        member_id: wx.getStorageSync('member_id'),
      }).then(res =>{
        if (res.data.code == 200){
          that.setData({
            ext_list: res.data.data.ext_list,
            selectedExt: res.data.data.ext_list[0],
          })
          wx.setStorageSync('selectedExt', res.data.data.ext_list[0])
        }
      })
    }else{
      that.setData({
        selectedExt
      })
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
  onShareAppMessage: function(res) {
    let that = this;
    console.log(res)
    if (res.from === 'button') {
      if(res.target.dataset.is_duizhang == "1"){
        let imageUrl = res.target.dataset.gdimages;
        let share_id = res.target.dataset.id;
        return {
          title: '我正在参加青山生态志愿活动，非常的有意义，你也来一起参加吧！',
          path: '/packageA/pages/home_page/volunacti_details/index?id=' + res.target.dataset.activity_id + '&member_id=' + wx.getStorageSync('member_id') + '&share_id=' + share_id + '&is_duizhang=1',
          imageUrl,
          success: function(res) {
            // 转发成功
            console.log(res)
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }else{
        let words = res.target.dataset.sharetxt;
        let gdImages = res.target.dataset.gdimages;
        let member_id = res.target.dataset.member_id;
        var shareImage = gdImages[0];
        var url = '/packageA/pages/vol_act_pages/index?contentid=' + res.target.dataset.contentid + '&member_id=' + member_id + '&is_onShare=1';
        return {
          title: '我正在参加青山生态志愿活动，请为我点赞;' + words,
          path: url,
          imageUrl: shareImage,
          success: function(res) {
            // 转发成功
            console.log(res)
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }

    }else{
      console.log('右上角')
      return {
        title: '青山生态志愿活动',
        imageUrl: '',
        path: '/packageA/pages/home_page/volunacti_details/index?id=' + that.data.id,
        success: function(res) {
          // 转发成功
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
          console.log(res)
        }
      }
    }

  },

  moveServerProSwiper(e){
    this.setData({
      swiper_index:e.detail.current,
    })
  },
  // 获取详情信息
  getdetails() { 
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      publicMethod.gotoLoginMark();
      return
    }
    common.get('/activity/detail', {
      member_id: wx.getStorageSync('member_id'),
      id: that.data.id
    }).then(res => {
      if (res.data.code == 200) {
        let article = res.data.data.detail;
        let details_info = res.data.data;
        let activity_tips = res.data.data.activity_tips;
        let count = details_info.count;
        let my_count = details_info.my_count;
        let activity_status = details_info.activity_status;
        WxParse.wxParse('article', 'html', article, that, 1);
        WxParse.wxParse('activity_tips', 'html', activity_tips, that, 1);
        that.setData({
          details_info,
          poster_tabs: details_info.image,
          count,  //  活动限制次数
          my_count, //  我参与的次数
          activity_status,
        })
        if(my_count === count){
          wx.showModal({
            content:'您已达到此活动参与限制次数，请参加其他活动！',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                // wx.navigateTo({
                //   url,
                // })
              }
            }
          })
        }

      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },
  // 点击报名申报
  instructions(){
    let that = this;
    let id = that.data.id;
    that.setData({
      is_notice:true,
    })
  },
  notice_btn(){
    let that = this;
    let id = that.data.id;
    that.setData({
      is_notice:false,
      activityid: 1
    })
    wx.setStorageSync('activityid_'+id+'_step', 1);
  },
  // 跳转打卡页面
  goto_clock(e){
    let that = this;
    let id = that.data.id;
    let activityid =  wx.getStorageSync('activityid_'+id+'_step');
    let my_count = that.data.my_count;
    let count = that.data.count;
    if(my_count === count){
      wx.showModal({
        content:'您已达到此活动参与限制次数，请参加其他活动！',
        showCancel:false,
        success: function (res) {
        }
      })
      return
    }
    that.setData({
      is_pop:true,
    })
    return
  },
  // 跳转打卡页面
  clock_text_btn(e){
    let that = this;
    let url = e.currentTarget.dataset.clock_url;
    let ext_id = that.data.selectedExt.ext_id;

    if(url){
      that.setData({
        is_clock_img:false,
        activityid: 3
      })
      wx.setStorageSync('activityid_'+  that.data.id +'_step', 3);

      wx.navigateTo({
        url: url + "?is_activity=2&activity_id=" + that.data.id + '&ext_id=' + ext_id,
      })
    }else{
      that.setData({
        is_clock_img:false,
        activityid: 3
      })
      wx.setStorageSync('activityid_'+  that.data.id +'_step', 3);

    }
  },
  // 跳转获取物料页面
  get_material_url(e){
    let that = this;
    let id = that.data.id;
    let activityid =  wx.getStorageSync('activityid_'+id+'_step');

    let my_count = that.data.my_count;
    let count = that.data.count;
    if(my_count === count){
      wx.showModal({
        content:'您已达到此活动参与限制次数，请参加其他活动！',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            // wx.navigateTo({
            //   url,
            // })
          }
        }
      })
      return
    }
    console.log(activityid);
    that.setData({
      is_materiel_text:true,
    })
  },
  // 跳转获取物料页面
  materiel_text_btn(e){
    let that = this;
    let url = e.currentTarget.dataset.material_url;
    if(url){
      that.setData({
        is_materiel_text:false,
        activityid: 2
      })
      wx.setStorageSync('activityid_'+  that.data.id +'_step', 2);
      if(url.indexOf("?") != -1){
        url = e.currentTarget.dataset.material_url + '&steps=2';
      }else{
        url = e.currentTarget.dataset.material_url + '?steps=2';
      }
      wx.navigateTo({
        url,
      })
    }else{
      that.setData({
        is_materiel_text:false,
        activityid: 2
      })
      wx.setStorageSync('activityid_'+  that.data.id +'_step', 2);
    }
  },
  click_declare(){
    let that = this;
    that.setData({
      img:[],
      is_pop:false,
    })
    let id = that.data.id;
    common.get("/activity/can_record",{
      member_id:wx.getStorageSync('member_id'),
      activity_id: that.data.id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          img: res.data.image,
          // is_pop:true,
        })
      }else{
        if(res.data.content){
          that.setData({
            content: res.data.content?res.data.content:'',
            like: res.data.like?res.data.like:0,
            notice: res.data.notice?res.data.notice:'暂无',
            is_clock_text2: true,
            activityid: 3,
          })
          wx.setStorageSync('activityid_'+id+'_step', 3);
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
        
      }
    }).catch(e =>{
      console.log(e)
    })

  },
  formSubmit(e){
    console.log(e)
    let that = this;
    let url = that.data.details_info.url;
    let pream = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      member_id: wx.getStorageSync('member_id'),
      // activity_id: that.data.id,
      member_name:e.detail.value.declare_name,
      vol_number:e.detail.value.declare_serial,
      member_mobile:e.detail.value.declare_phone,
      member_garden:that.data.garden,
      member_address:that.data.address,
      record_remark: e.detail.value.remark,
      update : 1,
    }
    if(!pream.member_name){
      wx.showToast({
        title: '请填写志愿者姓名！',
        icon:'none'
      })
      return
    }
    if(!pream.vol_number){
      wx.showToast({
        title: '请填写志愿者编号！',
        icon:'none'
      })
      return
    }
    if(!pream.member_mobile){
      wx.showToast({
        title: '请填写联系方式！',
        icon:'none'
      })
      return
    }
    if(!pream.member_garden){
      wx.showToast({
        title: '请选择省市区！',
        icon:'none'
      })
      return
    }
    if(!pream.member_address){
      wx.showToast({
        title: '请填写详细地址！',
        icon:'none'
      })
      return
    }
    let is_jiazai = that.data.is_jiazai;
    if(!is_jiazai){
      wx.showToast({
        title: '请勿重复提交',
        icon:'none'
      })
      return
    }
    that.setData({
      is_jiazai:false
    })
    wx.showLoading({
      title:'加载中...'
    })
    // common.get("/activity/record",pream).then(res =>{
    common.get("/activity/ext",pream).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        // wx.showToast({
        //   title: res.data.msg,
        //   icon:'none',
        //   duration:2000,
        // })
        setTimeout(function(){
          if(url){
            that.setData({
              is_pop:false,
              activityid: 3,
              is_jiazai:false
            })
            wx.setStorageSync('activityid_'+  that.data.id +'_step', 3);
      
            wx.navigateTo({
              url: url + "?is_activity=2&activity_id=" + that.data.id,
            })
          }else{
            that.setData({
              is_pop:false,
              activityid: 3,
              is_jiazai:false
            })
            wx.setStorageSync('activityid_'+  that.data.id +'_step', 3);
          }
        },1000)
      }else{
        wx.hideLoading();
        that.setData({
          is_jiazai:true
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        
      }
    }).catch(e =>{
      console.log(e);
      wx.hideLoading();
      that.setData({
        is_jiazai:true
      })
    })
  },
  newformSubmit(){
    let that = this;
    let url = that.data.details_info.url;
    let ext_id = that.data.selectedExt.ext_id;
    if(url){
      that.setData({
        is_pop:false,
        activityid: 3,
      })
      wx.setStorageSync('activityid_'+  that.data.id +'_step', 3);
      wx.navigateTo({
        url: url + "?is_activity=2&activity_id=" + that.data.id + '&ext_id=' + ext_id,
      })
    }else{
      that.setData({
        is_pop:false,
        activityid: 3,
      })
      wx.setStorageSync('activityid_'+  that.data.id +'_step', 3);
    }
  },
  click_useinter(){
    let that = this;
    that.setData({
      is_pop:false
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
  //保存小区
  saveGarden(e) {
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //保存地址
  saveAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  click_bg(){
    this.setData({
      is_preview:false
    })
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // 填写备注
  remark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  cle_marek2(){
    let that = this;
    that.setData({
      is_clock_text2:false
    })
  },
  clock_img(){
    this.setData({
      is_clock_img:false
    })
  },
  clock_succss(){
    this.setData({
      is_succss: false
    })
  },
  cancelLogin(){
    this.setData({
      pop2:false
    })
  },
  gotoMakephoto(e){
    console.log(e)
    let that = this;
    let contentid = e.currentTarget.dataset.contentid;
    let activity_id = e.currentTarget.dataset.activity_id;
    let notice = e.currentTarget.dataset.notice;
    wx.navigateTo({
      url: '/packageA/pages/volunteer_poster/index?activity_id=' + activity_id + '&contentid=' + contentid + '&notice=' + notice,
    })
  },
    // 展示队长详情
    my_share(){
      let that = this;
      common.get('/activity/my_share',{
        member_id:wx.getStorageSync('member_id'),
        share_id: that.data.share_id
      }).then(res =>{
        if(res.data.code == 200){
          if(res.data.data.share){
            if(res.data.data.share.status == 3){
              let text = '此次组团已过期，请选择参加其他新的团队!';
              that.guoqistatus(text);
            }
          }else{
            if(res.data.data.my_share.status == 3){
              let text = '此次组团已过期，请重新选择活动开始组团!';
              that.guoqistatus(text);
            }
          }
          let share_notice = res.data.data.share_notice;
          WxParse.wxParse('share_notice', 'html', share_notice, that, 1);
          that.setData({
            discount: res.data.data.discount,
            my_share: res.data.data.my_share,
            share_id: res.data.data.share?res.data.data.share.id:res.data.data.my_share.id,
            share_info: res.data.data.share,
            total_price: res.data.data.goods.total_price.toFixed(2),
            daze:Number( res.data.data.goods.total_price.toFixed(2) * res.data.data.discount/100).toFixed(2),
          })

        }else{
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
        }
      }).catch(e =>{
        console.log(e)
      })
    },
    // 用户去参加
    gotocanyu(e){
      let that = this;
      let url = e.currentTarget.dataset.url;
      let id = e.currentTarget.dataset.activity_id;
      let discount = e.currentTarget.dataset.discount;
      let share_id = e.currentTarget.dataset.share_id;
      wx.showModal({
        content: '感谢您参加环保公益活动，活动需要物料，产生的物料费和快递费由志愿者自己承担，因4人组队，1人免费，故物料费不退',
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            if(url.indexOf("?") != -1){
              url = url + '&id=' +id + '&discount=' +discount + '&share_id=' +share_id + '&is_duizhang=1' + '&is_duiyuan=1';
            }else{
              url = url + '?id=' +id + '&discount=' +discount + '&share_id=' +share_id + '&is_duizhang=1' + '&is_duiyuan=1';
            }
            wx.navigateTo({
              url,
            })
          }
        }
      })
    },
    // 免费领取
    gotoduizhangcanyu(e){
      let url = e.currentTarget.dataset.url;
      let id = e.currentTarget.dataset.activity_id;
      let share_id = e.currentTarget.dataset.share_id;

        if(url.indexOf("?") != -1){
          url = url + '&id=' +id + '&share_id=' +share_id + '&is_duizhang=1' + '&is_mian=1';
        }else{
          url = url + '?id=' +id + '&share_id=' +share_id + '&is_duizhang=1' + '&is_mian=1';
        }
        wx.navigateTo({
          url,
        })
    },
    guoqistatus(te){
      let text = te;
      wx.showModal({
        content: text,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#ff0000',
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    },
      // 点击路径复制
  fuzhi_btn(e){
    let that = this;
    console.log(e)
    let S_info = e.currentTarget.dataset.url;
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
  fuzhi_wxText(e){
    let that = this;
    console.log(e)
    let S_info = e.currentTarget.dataset.wxtext;
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
  //点击信息
  chooseExt(e) {
      let that = this;
      console.log(e);
      let is_chooseExt_id = e.currentTarget.dataset.ext_id;
      wx.navigateTo({
        url: '/packageA/pages/home_page/volunacti_infomanagement/index?is_chooseExt=1' + '&is_chooseExt_id=' + is_chooseExt_id,
      })
    },
})