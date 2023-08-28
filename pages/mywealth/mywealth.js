const app = getApp()
const common = require('../../assets/js/common');
const QR = require('../../assets/js/qrcode')
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    is_shouOrder: false,
    page:1,
    showOrderList:[], 
    is_tab:1,// 1、'确定申请' 2、'确定支出'
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    winHeight: "",
    navActive: 1,
    currentTab: 0,
    wealth_sum: 0,
    wealth_rank: 0,
    desc_myWealth: '',
    desc_inCome: '',
    desc_payout: '',
    inCome_title: '',
    orderList: [],
    user_id:'',
    user_name: '',
    deal_count: '',
    imagePath: '',  //二维码路径
    note: '',
    bannerUrlsHead: [],
    bannerUrlsFoot: [],
    bannerUrlsInCome: [],
    bannerUrlsOutPay: [],
    payOutType_index: 1,
    payOutType: [
      {id: 1, name: '普通积分'},
      {id: 2, name: '活动积分'}
    ],
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })
    if (options.scene) { //小程序码参数解码
      let scene = decodeURIComponent(options.scene);
      let scene_key = scene.split("&")[0];
      let member_id = scene_key.split("=")[1];
      wx.showLoading({
        title: '正在获取...'
      })
      console.log(member_id);
      common.get("/environmental/bank/getMemberNickName",{member_id: member_id}).then( res => {
        wx.hideLoading();
        if ( res.data.code == 200 ) {
          that.setData({
            user_id: member_id,
            user_name: res.data.data.nickname.nickname
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
    // this.createQrCode(JSON.stringify(memobj),"mycanvas",400,400);
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow: function(){
    this.setData({
      member_id: wx.getStorageSync('member_id'),
    })
    // if(!member_id){
    //   wx.showModal({
    //     title:'未登录，是否前往登录？',
    //     success: function(res) {
    //       if(res.confirm){
    //         console.log('点击了确认');
    //         wx.reLaunch({
    //           url:'/pages/mine/index/index'
    //         })
    //       } else if(res.cancel) {
    //         console.log('点击了取消')
    //         wx.reLaunch({
    //           url:"/pages/bank/bank"
    //         })
    //       }
    //     }
    //   })
    //   return
    // }
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    let that = this;
   
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    publicMethod.getFormId(e, this)
    let that = this
    var cur = e.currentTarget.dataset.current;
    this.setData({
      currentTab: cur
    })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  swiperChange: function (e) { //获取当前第几张图片，并切换dot
    this.setData({
        swiperCurrent: e.detail.current
    })
  },
  //获取我的财富信息
  getMyWealthy() {
    let that = this;
    common.get("/environmental/bank/myWealth",{member_id: that.data.member_id}).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        console.log("获取成功");
        that.setData({
          wealth_rank:res.data.data.myRanking,
          wealth_sum: res.data.data.myWealth,
          orderList: res.data.data.memberAllInfo,
          bannerUrlsHead: res.data.data.bannerList,
          bannerUrlsFoot: res.data.data.footBannerList
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  //获取支付信息
  getPayInfo() {
    let that = this;
    common.get("/environmental/bank/getPayTip",{member_id: that.data.member_id}).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        console.log("获取成功");
        that.setData({
          bannerUrlsOutPay: res.data.data.bannerList
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  //收款码界面信息
  getInComeInfo() {
    let that = this;
    common.get("/environmental/bank/getQrcode",{member_id: that.data.member_id}).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        console.log("获取成功");
        that.setData({
          inCome_title: res.data.data.title,
          imagePath: res.data.data.incomeImg,
          bannerUrlsInCome: res.data.data.bannerList
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  //跳转到查询订单页面
  turnToOrders() {
    console.log("跳转");
    wx.navigateTo({url: "/pages/historyorders/historyorders"})
  },
  //扫码识别
  scanCoded() {
    let that = this;
    console.log('准备扫码识别');
    wx.scanCode({
      success (res) {
        console.log("扫码结果",res);
        let scene = decodeURIComponent(res.path);
        // console.log(scene);
        // console.log(scene.split("&")[1].split("=")[1]);
        let member_id = scene.split("&")[1].split("=")[1]
        common.get("/environmental/bank/getMemberNickName",{member_id: member_id}).then( res => {
          if ( res.data.code == 200 ) {
            console.log("获取成功");
            that.setData({
              user_id: member_id,
              user_name: res.data.data.nickname.nickname
            })
          }
        })
      },
      complete(ret,result){
        console.log('ret',ret);
        console.log('result',result);
        
      },
    })
  },
  //选择积分类型
  bindPickerChange(e) {
    console.log(e.detail.value,'积分类型');
    this.setData({
      payOutType_index: e.detail.value
    })
  },
  //设置用户账号
  setUserId(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      user_id: e.detail.value
    })
    common.get("/environmental/bank/getMemberNickName",{member_id: e.detail.value}).then( res => {
      if ( res.data.code == 200 ) {
        console.log("获取成功");
        that.setData({
          user_name: res.data.data.nickname.nickname
        })
        app.showToast({
          title: "获取成功！",
          duration:1000
        })
      } else {
        app.showToast({
          title: res.data.msg
        })
        that.setData({
          user_id: '',
          user_name: ''
        })
      }
    }).catch( error => {
      app.showToast({
        title: "数据异常！",
        duration:1000
      })
      that.setData({
        user_id: '',
        user_name: ''
      })
    })
  },
  //设置用户名
  setUserName(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      user_name: e.detail.value
    })
  },
  // 设置积分
  setDealCount(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      deal_count: e.detail.value
    })
  },
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url,canvasId,cavW,cavH);
    setTimeout(() => { this.canvasToTempImage();},1000);
    
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          // that.setData({
          //     imagePath:tempFilePath,
          //    // canvasHidden:true
          // });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  },
  //编辑备注
  editRemark(e) {
    console.log(e.detail.value)
    this.setData({
      note: e.detail.value
    })
  },
  //准备支出
  submitExpenditure(){
    let that = this;
    // if (that.data.payOutType_index === '') {
    //   app.showToast({
    //     title: "请选择账号！"
    //   })
    //   return
    // }
    let postmsg = {
      member_id : wx.getStorageSync('member_id'),
      to_id : that.data.user_id,
      amount : that.data.deal_count,
      note: that.data.note,
      type: 1
    }
    if ( !postmsg.to_id ) {
      app.showToast({
        title: "请输入对方账户！"
      })
      return
    }
    if ( !postmsg.amount ) {
      app.showToast({
        title: "请输入积分！"
      })
      return
    }
    wx.showModal({
      content: '确定交易？',
      success: function(res) {
        console.log(res)
        if (res.confirm) {
          common.get('/environmental/bank/confirmPay',postmsg).then( res=> {
            console.log(res);
            if ( res.data.code == 200 ) {
              that.setData({
                user_id: '',
                user_name: '',
                deal_count: '',
                note: '',
              })
              app.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000
              })
              that.setData({
                currentTab: 0
              })
              // that.getMyWealthy();
              setTimeout( function() {
                wx.navigateTo({
                  url: "/pages/historyorders/historyorders"
                })
              },1000)
            } else {
              app.showToast({
                title: res.data.msg
              })
            }
          }).catch( error => {
            console.log(error);
            app.showToast({
              title: "数据异常！"
            })
          })
        }
        
      }
    })
  },
    // 索取
  submitAskFor(){
    let that = this;
    let postmsg = {
      member_id : wx.getStorageSync('member_id'),
      from_member_id : Number(that.data.user_id),
      points_num : Number(that.data.deal_count),
      info: that.data.note,
    }
    if ( !postmsg.from_member_id ) {
      app.showToast({
        title: "请输入对方账户！"
      })
      return
    }
    if ( !postmsg.points_num ) {
      app.showToast({
        title: "请输入积分！"
      })
      return
    }
    common.post('/community_market/submit_activity_obtain_points',postmsg).then( res=> {
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          user_id: '',
          user_name: '',
          deal_count: '',
          note: '',
        })
        app.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 1000
        })
        that.setData({
          currentTab: 0
        })
        // that.getMyWealthy();
        setTimeout( function() {
          wx.navigateTo({
            url: "/pages/index/index"
          })
        },1000)
      } else {
        app.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    }).catch( error => {
      console.log(error);
      app.showToast({
        title: "数据异常！"
      })
    })
  },
  readyToDeal(e) {
    let that = this;
    let is_tab = e.currentTarget.dataset.is_tab;
    if(is_tab == 2){
      // 支出
      that.submitExpenditure();
    }
    if(is_tab == 1){
      // 索取
      that.submitAskFor();
    }
    return
  
  

  },


  //打开扫一扫
  openCamera() {
    let that = this;
    wx.scanCode({
      success(res) {
        console.log(res);
        let member_id = res.path.split("%3D")[1];
        common.get("/environmental/bank/getMemberNickName",{member_id: member_id}).then( res => {
          wx.hideLoading();
          if ( res.data.code == 200 ) {
            that.setData({
              user_id: member_id,
              user_name: res.data.data.nickname.nickname
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if(pageslist && pageslist.length > 1) {
      wx.navigateBack({delta: -1});
    } else {
      wx.reLaunch({url: "/pages/bank/bank"});
    }
  },
  clickTab(e){
    this.setData({
      is_tab: e.currentTarget.dataset.index
    })
  },
  getactivityInfo(e){
    let that = this;
    wx.showLoading({
      title: '加载中...'
    })
    let status = Number(e.currentTarget.dataset.status); // 状态 0:查全部 1:待支付 2:已支付 3:拒绝支付
    common.get('/community_market/get_activity_obtain_points_list?page='+that.data.page,{
      pageSize: 150,
      member_id: wx.getStorageSync('member_id'),
      status, 
    }).then( res=> {
      wx.hideLoading();
      console.log(res);
      if ( res.data.code == 200 ) {
        that.setData({
          showOrderList: res.data.data.data,
          is_shouOrder: true
        })
        // app.showToast({
        //   title: res.data.msg,
        //   icon: 'success',
        //   duration: 1000
        // })
      } else {
        app.showToast({
          title: res.data.msg
        })
      }
    }).catch( error => {
      wx.hideLoading();
      console.log(error);
      app.showToast({
        title: "数据异常！"
      })
    })
  },
  setStatus(e){
    let that = this;
    let status = Number(e.currentTarget.dataset.status);
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      content: status == 2?'同意支付？':'拒绝支付？',
      success: function(res) {
        console.log(res)
        if (res.confirm) {
          common.post('/community_market/update_activity_obtain_points_status',{
            member_id: wx.getStorageSync('member_id'),
            id,
            status, 
          }).then( res=> {
            wx.hideLoading();
            console.log(res);
            if ( res.data.code == 200 ) {
              that.setData({
                is_shouOrder: true
              })
              let showOrderList = that.data.showOrderList;
              if(status == 2){
                showOrderList[e.currentTarget.dataset.index].status = 2;
              }
              if(status == 3){
                showOrderList[e.currentTarget.dataset.index].status = 3;
              }
              that.setData({
                showOrderList
              })
              app.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000
              })
            } else {
              app.showToast({
                title: res.data.msg
              })
            }
          }).catch( error => {
            wx.hideLoading();
            console.log(error);
            app.showToast({
              title: "数据异常！"
            })
          })
        }
        
      }
    })

  }

})