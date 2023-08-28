let setting = require('./assets/js/setting');
let common = require('./assets/js/common');
const publicMethod = require('./assets/js/publicMethod.js');
const zhuan_dingwei = require('./assets/js/dingwei.js');

App({
  data: {
    is_jifenjiaoyi:true,
    is_remind:true,
    imgUrl: setting.imgUrl,
    recovery_place : {
      //可拖动按钮的位置
      top : '',
      left : ''
    },
    windowWidth : '',
    windowHeight : '',
    screenHeight:0,
    pixelRatio_phone : '',
    otherActivitis: {
      //厨余，有害，其他回收订单缓存
      goodList: [],  //商品详情
      payStatus: '',  //支付方式
      total: '',  //总额
      types_name:'',
    },
    shopCar: {
      //回收订单缓存
      goodList: [],  //商品详情
      payStatus: '',  //支付方式
      total: '',  //总额
      types_a:'',
      elect:''
    }, 
    welfareGood: {
      id:'',
      num: '',
      total_price:'',
      hbb:'',
      goods_name:''
    },
    selectedRecover:{},
    selectedExt:{}, // 志愿活动选择的地址
    book_info2:[],
    book_info3:[], // 卖古旧书
    // 参与活动任务次数
    garbage_info:[],
    yulan_params:{},
    preview_pream:{},// 服务信息发布预览数据
    select_type:0,
    select_id:0,
    ad_info: {},
    confirm_coupons: {},
    confirm_coupons1: {},
    newThingInfo:{}, // 店铺单个打卡趣事
    signShopInfo:{}, // 签到商品单个数据
    longitude: '',
    latitude: '',
  },
  onShow(){
    let that = this;
    // wx.getLocation({
    //   type: 'wgs84',
    //   success:function(res){
    //     var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
    //     let longitude= gcj02tobd09[0];
    //     let latitude= gcj02tobd09[1];
    //     that.globalData.longitude = longitude;
    //     that.globalData.latitude = latitude;
    //     console.log(longitude)
    //     console.log(latitude)
    //   },
    //   fail: function(res) {
    //     if (res.errMsg == "getLocation:fail auth deny") {
    //       // publicMethod.openSetting(that)
    //     }
        
    //   }
    // })
  },
  //授权
  // getUserInfo: function(n) {
  //   let that = this;
  //   let P = new Promise(function(resolve, reject) {
  //     if (n) {
  //       wx.login({
  //         success: function(o) {
  //           wx.getUserInfo({
  //             lang: 'zh_CN',
  //             success: function(e) {
  //               common.post('/member/oauth', {
  //                 iv: e.iv,
  //                 encryptedData: e.encryptedData,
  //                 code: o.code
  //               }).then(res => {
  //                 if (res.data.err_code == 0) {
  //                   let r = {};
  //                   r.userInfo = e.userInfo;
  //                   r.member_id = res.data.result.member_id;
  //                   resolve(r);
  //                 } else {
  //                   reject(res);
  //                   that.showToast({
  //                     title: res.data.msg,
  //                   })
  //                 }
  //               }).catch(e => {
  //                 app.showToast({
  //                   title: "接口获取数据失败 状态码:" + e.data.status_code,
  //                 })
  //                 console.log(e)
  //               })
  //             },
  //             fail: function(res) {
  //               "function" == typeof n && n(res);
  //             },
  //             complete: function() {}
  //           })
  //         },
  //         fail: function() {
  //           wx.showModal({
  //             title: "获取信息失败",
  //             content: "请允许授权以便为您提供给服务",
  //             success: function(e) {
  //               e.confirm && this.getUserInfo();
  //             }
  //           });
  //         }
  //       })
  //       return
  //     }
  //     wx.getSetting({
  //       success: function(res) {
  //         // debugger
  //         console.log(res)
  //         if (res.authSetting['scope.userInfo']) {
  //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //           wx.getUserInfo({
  //             lang: 'zh_CN',
  //             success: function(res) {
  //               // console.log('已经授权')
  //               that.globalData.userInfo = res.userInfo
  //               wx.setStorageSync("userInfo", res.userInfo);
  //               resolve(res.userInfo);
  //             }
  //           })
  //         }
  //       }
  //     });
  //   })

  //   return P
  // },
  onHide() {
    // wx.pauseBackgroundAudio();
  },
  onLaunch() {
    let remind = true;
    // publicMethod.getPos(this);
    wx.setStorageSync("remind", remind);
    this.checkUpdateVersion();
    wx.getSystemInfo({
      success : res => {
        this.data.windowWidth = res.windowWidth;
        this.data.windowHeight = res.windowHeight;
        this.data.pixelRatio_phone = res.pixelRatio;
        this.data.screenHeight=res.screenHeight*2;
      }
    })
    wx.onNetworkStatusChange((res) => {
      let msg = ''
      console.log(res)
      if (!res.isConnected) {
        msg = '当前网络不可用，请检查你的网络设置'
      } else if (res.networkType === 'none') {
        msg = '网络开小差了,请网络良好后重试'
      }
      if (msg) {
        console.log(msg)
        wx.showToast({
          title: msg,
          icon: 'none',
        })
        return false
      }
    })
    let that = this;
 
    // setInterval( ()=> {
    //   this.timeQuery();
    // },120000)
  },
  onUnload() {
    // wx.pauseBackgroundAudio();
  },

  // timeQuery(){
  //   console.log('定时查询');
  //   let member_id = '';
  //   member_id = wx.getStorageSync('member_id');
  //   console.log(member_id);
  //   if ( !member_id ) {
  //     return;
  //   }
  //   common.get('/chat/getUnreadNum',{
  //     member_id : member_id
  //   }).then( res => {
  //     if ( res.data.errno == 0 ) {
  //       if ( res.data.data.unreads > 0 || res.data.data.uncomment > 0 || res.data.data.unlauds > 0 ) {
  //         wx.showTabBarRedDot({"index":4})
  //       } else if ( res.data.data.unreads == 0 && res.data.data.uncomment == 0 && res.data.data.unlauds == 0 ) {
  //         wx.hideTabBarRedDot({"index":4});
  //       }
  //     }
  //   }).catch ( error => {
  //     console.log(error);
  //   });
  // },
  turnToPage: function turnToPage(url, isRedirect) {
    var tabBarPagePathArr = this.getTabPagePathArr();
    // tabBar中的页面改用switchTab跳转
    if (tabBarPagePathArr.indexOf(url) != -1) {
      this.switchToTab(url);
      return;
    }
    if (!isRedirect) {
      wx.navigateTo({
        url: url
      });
    } else {
      wx.redirectTo({
        url: url
      });
    }
  },
  showModal: function showModal(param) {
    //wx弹窗提示
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function success(res) {
        if (res.confirm) {
          //确定
          //res.stype = param.stype||0;//2017-12-08 14:43:45
          typeof param.confirm == 'function' && param.confirm(param);
        } else {
          //取消
          typeof param.cancel == 'function' && param.cancel(param);
        }
      },
      fail: function fail(res) {
        typeof param.fail == 'function' && param.fail(param);
      },
      complete: function complete(res) {
        typeof param.complete == 'function' && param.complete(param);
      }
    });
  },
  showToast: function(param) {
    wx.showToast({
      title: param.title || '成功',
      icon: param.icon || 'none',
      duration: param.duration || 2000
    })
  },
  turnBack: function turnBack(options) {
    //options.delta 返回页面数
    wx.navigateBack({
      delta: options ? options.delta || 1 : 1
    });
  },
  getTabPagePathArr: function getTabPagePathArr() {
    return JSON.parse(this.globalData.tabBarPagePathArr);
  },
  turnToPage: function turnToPage(url, isRedirect) {
    var tabBarPagePathArr = this.getTabPagePathArr();
    // tabBar中的页面改用switchTab跳转
    if (tabBarPagePathArr.indexOf(url) != -1) {
      this.switchToTab(url);
      return;
    }
    if (!isRedirect) {
      wx.navigateTo({
        url: url
      });
    } else {
      wx.redirectTo({
        url: url
      });
    }
  },
  globalData: {
    apenny_prizedata:{},
    longitude: '',
    latitude: '',
    tabBarPagePathArr: '[]',
    userInfo: null,
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    pop5: false,
    pop6: false,
    remind:true
  },
  popLock: function(id) {
    switch (id) {
      case '1':
        if (!this.globalData.pop1) {
          this.globalData.pop1 = true;
        }
        break;
      case '2':
        if (!this.globalData.pop2) {
          this.globalData.pop2 = true;
        }
        break;
      case '3':
        if (!this.globalData.pop3) {
          this.globalData.pop3 = true;
        }
        break;
      case '4':
        if (!this.globalData.pop4) {
          this.globalData.pop4 = true;
        }
        break;
      case '5':
        if (!this.globalData.pop5) {
          this.globalData.pop5 = true;
        }
        break;
      case '6':
        if (!this.globalData.pop6) {
          this.globalData.pop6 = true;
        }
        break;
      default:
        this.globalData.pop1 = false;
        this.globalData.pop2 = false;
        this.globalData.pop3 = false;
        this.globalData.pop4 = false;
        this.globalData.pop5 = false;
        this.globalData.pop6 = false;
    }
  },
  //上传图片
  uploadOss(data) {
    let that = this;
    let i = data.i ? data.i : 0; //当前上传的哪张图片
    let img = data.path;
    if ( i >= img.length ) {
      return
    }
    // debugger;
    // let txt = '上传中'+(i+1)+'/'+img.length
    let txt = '上传中...'
    wx.showLoading({
      title:txt
    })
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'files[]', //这里根据自己的实际情况改
      url: setting.apiUrl + '/file/uploadOss',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res)
        let resdata = JSON.parse(res.data);
        if ( resdata.code == 0 ) {
          wx.hideLoading();
          if (data.result_list) {
            data.result_list.push(resdata.data.url[0]);
          }
        } else {
          app.showToast({
            title: "上传失败!",
          })
        }
      },
      fail:function() {
        app.showToast({
          title: "上传失败!",
        })
        wx.hideLoading()
      },
      complete: () => {
        wx.hideLoading()
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用 
          console.log('执行完毕');
          typeof data.picUpSuccess == 'function' && data.picUpSuccess(data);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          that.uploadOss(data);
        }
      }
    })
  },
  //多张图片上传
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    console.log("data.path[i]")
    console.log(data.path[i])
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: data.name || "image", //这里根据自己的实际情况改
      // name: 'image', //这里根据自己的实际情况改
      header:{
        'token': wx.getStorageSync('token'),
      },
      formData: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token'),
        image: data.path,
        images: data.path,
        content_id: data.content_id,
        member_id:data.member_id,
        id: data.id,
      }, //这里是上传图片时一起上传的数据
      success: (resp) => {
        console.log("resp")
        console.log(resp)
        let result = JSON.parse(resp.data);
        if ( result.code == 0 || result.code == 200 ) {
          success++; //图片上传成功，图片上传成功的变量+1
          if (data.result_list) {
            data.result_list.push(result.data.url[0]);
          }
        }else{
          fail++; //图片上传失败，图片上传失败的变量+1
          wx.showToast({
            title:result.msg,
            icon:'none'
          })
        }
        console.log(i);
      },
      fail: (res) => {
        console.log('图片上传失败！:::fail');
        // wx.showToast({
        //   title: '图片上传失败！',
        //   icon: 'none'
        // })
        // return
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用 
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          typeof data.picUpSuccess == 'function' && data.picUpSuccess(data);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
    //参与垃圾减量活动多图片上传
  uploadimgs(data) {
      var that = this,
        i = data.i ? data.i : 0, //当前上传的哪张图片
        success = data.success ? data.success : 0, //上传成功的个数
        fail = data.fail ? data.fail : 0; //上传失败的个数
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'files', //这里根据自己的实际情况改
        formData: {
          'content-type': 'multipart/form-data',
          image: data.path,
          member_id:data.member_id,
          id: data.id,
        }, //这里是上传图片时一起上传的数据
        success: (resp) => {
          success++; //图片上传成功，图片上传成功的变量+1
          console.log(resp)
          // let result = JSON.parse(resp.data);
          let result = resp.data;
          if (result.code == 203) {
            wx.showToast({
              title:'图片不合法！',
              icon:'none'
            })
            return
          }
          if ( result.code == 0 || result.code == 200 ) {
            if (data.result_list) {
              data.result_list.push(result.data.url[0]);
            }
            console.log(i);
            i++; //这个图片执行完上传后，开始上传下一张
            if (i == data.path.length) { //当图片传完时，停止调用 
              console.log('执行完毕');
              console.log('成功：' + success + " 失败：" + fail);
              typeof data.picUpSuccess == 'function' && data.picUpSuccess(data);
            } else { //若图片还没有传完，则继续调用函数
              console.log(i);
              data.i = i;
              data.success = success;
              data.fail = fail;
              that.uploadimgs(data);
            }


          }
         
          //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        },
        fail: (res) => {
          fail++; //图片上传失败，图片上传失败的变量+1
          console.log('fail:' + i + "fail:" + fail);
          wx.showToast({
            title: '图片不合法！',
            icon: 'none'
          })
          return
        },
        complete: () => {
          
        }
      });
    },
  /**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
checkUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if(wx.canIUse('getUpdateManager')) {
  //创建 UpdateManager 实例
  const updateManager = wx.getUpdateManager();
  //检测版本更新
  updateManager.onCheckForUpdate(function (res) {
    console.log(res)
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      //监听小程序有版本更新事件
      updateManager.onUpdateReady(function () {
        //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
        wx.showModal({
          title: '有新版本喽~',
          content: '请您及时更新最新版本',
          success:function(res){
            if(res.confirm){
              updateManager.applyUpdate();
            }
          }
        })
      })
      // updateManager.onUpdateFailed(function () {
      //   wx.showModal({
      //     title: '已经有新版本喽~',
      //     content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
      //   })
      // })
    }
  })
} else {
  //TODO 此时微信版本太低（一般而言版本都是支持的）
  wx.showModal({
    title: '溫馨提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
  }
},
guajifen(t,longitude,latitude){
  let that = t;
  let lng = longitude;
  let lat = latitude
  common.get("/content_personal/is_jf",{
    member_id:wx.getStorageSync('member_id'),
    lng,
    lat
  }).then(res =>{
    if(res.data.code == 200){
     }
  }).catch(e =>{
    console.log(e)
  })
}
})