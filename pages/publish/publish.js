const app = getApp()
const common = require('../../assets/js/common');
const setting = require('../../assets/js/setting');
const publicMethod = require('../../assets/js/publicMethod');
import { getLessLimitSizeImage, getBase64} from '../../utils/newImgcomp'
Page({
  data: {
    img_url: app.data.imgUrl,
    index: 0,
    is_business: 0,
    savaStatus: true,
    items: [],
    photos: [], //图片数组
    discount_id: '',
    content_id: '',
    content_config: [],
    content: [],
    gdImages:[],
    share: '',
    showModel: false,
    isDisabled: false,
    shareCode: 0,
    textareaVal:'',
    is_preview: false,
    ad_content:{},
    select_type:0,
    latitude: '',
    longitude: '',

    imagePath: '',
    quality: 0.2,
    cWidth: 750,
    cHeight: 1334,
    timer: null,
    images:[],
    ext_id: '',
    is_activity:'1',
    activity_id:0,
    // ======= 做任务赚积分数据  
    is_Signtask:0,
    task_id: 0,
    is_signTaskMask: false,
    taskMaskpreview_title:'',
    taskMaskpreview_jifen:'',
    is_ad:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    console.log(options)
    if (options.is_activity == '2'){
      that.setData({
        is_activity: options.is_activity,
        activity_id: options.activity_id,
        ext_id: options.ext_id
      })
    }
    // ======= 做任务赚积分数据  
    if(options.is_Signtask){
      that.setData({
        is_Signtask: options.is_Signtask,
        task_id: options.task_id
      })
    }
    // ======= 做任务赚积分数据  

    if (options.business_id) {
      that.setData({
        business_id: options.business_id,
        is_business: 1,  //为1则为商家用户
      })
    } else {
      that.setData({
        is_business: 2
      })
    }
    console.log(that.data.is_business)

    wx.setStorageSync("discount_id",'');
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      txtWord: wx.getStorageSync('configData').txtWord || ''
    })
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    // that.getFansnear();
  },
  onShow: function() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.navigateTo({
        url: '/pages/login_mark/index',
      })
      return
    }
    if (wx.getStorageSync('discount_id')){
      that.setData({
        discount_id: wx.getStorageSync('discount_id'),
        discount_title: wx.getStorageSync('discount_title'),
      })
    }
    
  },
  checkboxChange(e) {
    let checkVal = e.detail.value

    this.setData({
      checkVal: e.detail.value
    })
  },

  chooseImg(e){
    let that = this;
      //拍照、从相册选择上传
    wx.chooseImage({
        sizeType:['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType:['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success:function(res){
          console.log(res)
          // 返回选定图片的本地文件列表，tempFilePaths可以作为img标签的src列表
          let tempFilePaths = res.tempFilePaths; //这个是选择后返回的图片列表
          that.getLessLimitSizeImage(0,tempFilePaths);
        },
        fail:function(err){
            console.log(err)
        }
    })
  },
  getLessLimitSizeImage(index,ts){
    let that = this;
    let maxSize = 1000;
    let dWidth = wx.getSystemInfoSync().windowWidth;
    let num = Number(ts.length);
    //压缩并获取图片，这里用了递归的方法来解决canvas的draw方法延时的问题
    if (index < num){ 
      getLessLimitSizeImage('canvas',ts[index],maxSize, dWidth, function(img){
        let photos = that.data.photos;
        photos.push(img);
        that.setData({
          photos,
        })  
        // that.setData({
        //   photos: that.data.photos.concat(img)
        // })         
        wx.getFileInfo({
            filePath:img,
            success:function(res){
              console.log('3压缩后：'+res.size/1024+'kb')
            }
        })
        index = index + 1;
        that.getLessLimitSizeImage(index,ts)
      })
    }

  },
  openPhoto: function(event) { //打开图片
    let that = this;
    that.setData({
      layer: true,
      preview: event.currentTarget.dataset.url,
      imgname: event.currentTarget.dataset.imgname,
      previewIndex: event.currentTarget.dataset.index
    });
  },
  checkDisabled: function(){
     let that = this
     that.setData({
        isDisabled: false
     })
  },
  closePic: function() { //关闭图片
    let that = this;
    that.setData({
      layer: false
    });
  },
  delPic: function() {
    let that = this;
    if (that.data.isDisabled) {
      return;
    }
    let picsUp = that.data.photos;
    picsUp.splice(that.data.previewIndex, 1);
    that.setData({
      photos: picsUp,
      layer: false
    });
  },
  textareaChange(e) {
    let that = this
    that.setData({
      textareaVal: e.detail.value
    })
  },
  getFansnear() {
    let that = this;
    common.get('/content/fansnear', {
      member_id: that.data.member_id,
      is_business: that.data.is_business
    }).then(res => {
      console.log("是否有通知开关")
      console.log(res)
      if (res.data.errno == 0) {
        if (res.data.data.is_fans == 1) {
          that.data.items.push({
            name: '1',
            value: '通知关注自己的人'
          })
        }
        if (res.data.data.is_near == 1) {
          that.data.items.push({
            name: '2',
            value: '告知周围三公里的用户'
          })
        }
        that.setData({
          items: that.data.items
        })
      }
    }).catch(e => {
      console.log(e)
    })
  },
  filterStr(val) {
    var inputContent = val;
    var arrMg = this.data.txtWord;
    var showContent = inputContent;
    for (var i = 0; i < arrMg.length; i++) {
      var r = new RegExp(arrMg[i], "ig");
      showContent = showContent.replace(r, "**");
    }
    return showContent;
  },
  //积分不足提示
  hideModal: function () {
    this.setData({
      showModel: false,
      savaStatus: true
    })
  },
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
        
    let that = this
    let savaStatus = that.data.savaStatus;
    let words= that.data.textareaVal;
    let photos = that.data.photos;
    let type = that.data.is_activity;
    let activity_id = that.data.activity_id;
    let ext_id = Number(that.data.ext_id);

    if (!savaStatus) {
      wx.showToast({
        title: '请勿重复提交！',
      })
      return
    }
    that.setData({
      savaStatus: false,
    })

    let param = {
      member_id: wx.getStorageSync('member_id'),
      words,
      type,
      business_id: that.data.business_id,
      is_business: that.data.is_business,
      discount_id: that.data.discount_id,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      activity_id,
      ext_id
    }
    if(that.data.content){
      param.content_id =  that.data.content_id
    }
    let code = new Date().getTime();
    that.setData({
      showModel: false,
      code: code
    })
    param.flag = code;
    param.cid  = that.data.cid;

    // 获取微信订阅消息
    wx.requestSubscribeMessage({   // 调起消息订阅界面
      tmplIds: ['6SgyQ6g87NFL7qmPgiQVqvnfszVmmvSzqvxqpfgnI60'],
      complete(res1) {
        console.log(res1);
        if( photos.length <= 0){
          that.createContent(param);
        }else{
          app.uploadOss({
            url: setting.apiUrl + '/file/uploadOss', //这里是你图片上传的接口
            path: that.data.photos, //这里是选取的图片的地址数组
            result_list: [],
            picUpSuccess: function (res) {
                let images = res.result_list;
                that.setData({
                images,
                })
              wx.showLoading({
                title: '提交中...',
              })
              that.createContent(param);
            }
          });
        }
      }
    }) 
  },

  createContent(param){
    let that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    wx.showLoading({
      title: '发表中...',
    })
    common.post('/content/createContent', param).then(res => {
      wx.hideLoading();
      if(pages.length >= 2){
        prevPage.setData({
          isgoback: 1,
        })
      }

      if (res.data.code == 200) {
        that.setData({
          contentid: res.data.content_id
        })
        let type = that.data.is_activity;
        let pics = that.data.images;
        // var pop_ad = res.data.agent_integral;
        if(that.data.is_Signtask){
          that.getDoneTask(that.data.task_id);
        }
        if (pics.length <= 0) {
          wx.hideLoading();
          wx.showToast({
            title: '发表成功',
            icon: "success",
            duration:2500,
            success:function(){
              if(type == '2'){
                wx.navigateBack({
                  delta: 1,
                })
              }else{
                wx.reLaunch({
                  url: '/pages/circle/circle',
                })
              }
            }  
          })
        } else {
          common.post('/content/uploadImageNew',{
            images: pics,
            content_id: res.data.content_id,
          }).then(resdata =>{
            if(resdata.data.code == 200){
              wx.showToast({
                title: '发表成功',
                icon: "success",
                duration:2500,
                success:function(){
                  if(type == '2'){
                    wx.navigateBack({
                      delta: 1,
                    })
                  }else{
                    wx.reLaunch({
                      url: '/pages/circle/circle',
                    })
                  }
                }  
              })
            }else{
              wx.showToast({
                title: resdata.data.msg,
                icon: "none",
                duration:2500,
              })
            }

          }).catch(e =>{
            console.log(e)
          })
        }
      }else{
        console.log(res)
        that.setData({
          savaStatus: true
        })
        app.showToast({
          title: res.data.msg,
        })
        return
      }
    }).catch(e => {
      wx.hideLoading();
      that.setData({
        savaStatus: true,
      })
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })

  },
// 广告弹窗点击背景
click_bg(){
  // this.setData({
  //   is_preview:false
  // })
  // setTimeout(function () {
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // }, 1000)
  this.gotoindex();

},
// =================== 新增 ===================
goto_adshop(e){
  publicMethod.goto_adshop(e,this);
},
// =================== 新增 ===================  
gotoshop(){
  let that = this;
  common.get("/garbage/follow_log",{
    member_id:wx.getStorageSync('member_id'),
    business_id:that.data.business_id,
  }).then(res =>{
    if(res.data.code == 200){
      wx.reLaunch({
        url: '/pages/shop/shop?business_id='+ that.data.business_id,
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
gotoindex(){
  wx.reLaunch({
    url: '/pages/index/index',
  })
},
gotodongtai(){
  wx.reLaunch({
    url: '/pages/mine/myContent/index?member_id='+this.data.view_member_id + '&is_onShare=1',
  })
},
gotoxuanze(){
  let that = this;
  let lx = that.data.lx;
  if(lx == 1){
    that.gotoshop();
  }
  if(lx == 2){
    that.gotoindex();
  }
  if(lx == 3){
    that.gotodongtai();
  }
},
  //分享发布详情
  shareDesc(){
    let url = "/pages/detail/detail?article_id=387";
    wx.navigateTo({
      url: url
    })
  },
  //前往选择活动页面
  goToSelectActivity() {
    let url = "/pages/manage_activity/manage_activity?business_id=" + this.data.business_id;
    wx.navigateTo({
      url: url
    })
  },
  //前往创建活动页面
  goToCreateActivity() {
    let url = "/pages/create_activity/create_activity?business_id=" + this.data.business_id;
    wx.navigateTo({
      url: url
    })
  },
  onShareAppMessage(res){
    let that = this
    if (res.from == 'button') {
      let user_info = wx.getStorageSync('user_info')
      let img = 'http://oss.qingshanpai.com/huanbaobi/161b2384d12501c5f3ebe9ddb470bd7b.png'
      if(that.data.gdImages.length > 0){
        img = that.data.gdImages[0].url
      } else if (that.data.photos.length > 0){
        img = that.data.photos[0]
      }
      console.log('pages/mine/myContent/index?id=' + that.data.member_id + '&share=1' + '&sharecode=' + that.data.code)
      return {
        title: user_info.nickName + ' ' + that.data.textareaVal,
        imageUrl: img,
        path: 'pages/mine/myContent/index?id=' + that.data.member_id + '&share=1' + '&sharecode=' + that.data.code,
        success: function (res) {
          
        }
      }
    }
    
  },
  onHide() {
    wx.setStorageSync("discount_id",'');    
  },
  // =========  做任务赚积分 弹窗功能 =======
  // 做任务赚积分跳转过来
  getDoneTask(id){
    let that = this;
    let task_id = id;
    common.get('/mine/index?op=done_task',{
      member_id: wx.getStorageSync('member_id'),
      task_id,
    }).then(res =>{
      if(res.data.code == 200){
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  // =========  做任务赚积分 弹窗功能 =======
  adClose(){
    this.setData({
      is_ad: false
    })
  }
})