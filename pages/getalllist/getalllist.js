const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
var zhuan_dingwei = require('../../assets/js/dingwei.js');
Page({
  data: {
    mygrouplist:[],
    reeachBottomStatus: true,
    textVal: '',
    personalInfo: '',
    inpPlaceholder: '发表评论',
    wenzData: [],
    infoData: [],
    page1: [],
    showFull: [],
    loadend: [],
    savaStatus: true,
    isfenxiang: false,
    isReset: 0, //子页面跳转是否刷新页面,
    showEditBox: false,
    content_id: 0,
    copy_business: 0,
    winHeight: "",
    pageIndex: 1,
    pageSize: 10,
    sechs:'',
    idleList:true,
    dataStatus: false,
    fullStatus: false,
    release_marsk:false,
    release_name:'',
    release_phone:'',
    release_text:'',
    cur:0,
    marsk1:false,
    marsk_name: '暂无',
    marsk_tel: '暂无',
    showService:false,
    canIUseGetUserProfile: false,
    setPassword:false,
    longitude: '',
    latitude: '',
    nearGroupList:[],   //  附近闲置圈
    // ======= 做任务赚积分数据  
    is_Signtask:0,
    task_id: 0,
    is_signTaskMask: false,
    taskMaskpreview_title:'',
    taskMaskpreview_jifen:'',
  },
  onLoad: function (options) {
    console.log(options)
    // 获取定位
    publicMethod.zhuan_baidu(this);

    if (options.is_comtype == 'qhysq' ) {
      wx.setNavigationBarTitle({
        title:'清河营中路低碳社区'
      })
    }


    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let that = this
    that.setData({
      hasMore: true,
      hasMore_full:true
    })
    // 登录
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    // ======= 做任务赚积分数据  
    if(options.is_Signtask){
      that.setData({
        is_Signtask: options.is_Signtask,
        task_id: options.task_id
      })
      that.getDoneTask(options.task_id,options.jifen);
    }
    // ======= 做任务赚积分数据  
    if (options.member_id) {
      that.setData({
        member_id: options.member_id
      })
    }
    if (options.business_id) {
      wx.setStorageSync("business_id", options.business_id)
      that.setData({
        isfenxiang: true
      })
    } else {
      that.setData({
        isfenxiang: false
      })
    }
    that.setData({
      currentTab: 0,
      qwe: true
    })
    that.setData({
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    // that.getData();

  },
  onShow() {
    let that = this;
    if(that.data.is_Signtask){
      that.getDoneTask(that.data.task_id,that.data.jifen);
    }
    // publicMethod.zhuan_baidu(this)
    that.setData({
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return
    }
    // if(that.data.is_login == 1){
    //   that.getData();
    // }
    that.getData();



  },
  onHide() {
    let that = this
    that.setData({
      isReset: 0
    })
  },
  onUnload() {
    let that = this
    that.setData({
      isReset: 0
    })
  },
  getData() { //初始化数据
    let that = this;
    //列表
    that.getwenzhang();
    // 附近的团组
    that.getmyGroupList();
    // 附近闲友
    that.getFjxyList();
  },
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  // 微信授权
  getUserProfile() {
    publicMethod.getUserProfile(this,this.getData);
  },

//关闭会话弹框
closePartChat() {
  if ( this.data.showService ) {
    this.setData({
      showService: false
    })
  }
},
  //商品列表
  getwenzhang() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    // if (!this.data.hasMore){
    //   wx.showToast({
    //     title: '已加载全部...',
    //     icon:'none'
    //   })
    //   return
    // }
    common.get('/idle/idleStore', {
      // page: that.data.pageIndex,
      page:1,
      lng: that.data.longitude,
      lat: that.data.latitude,
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      // var newList = this.data.wenzData.concat(res.data.res);
      // // 2.3 获取数据的总数
      // var count = res.data.total;
      // // 2.4 用于判断比较是否还有更多数据
      // var flag = this.data.pageIndex * this.data.pageSize < count;
      this.setData({
        wenzData: res.data.res.splice(0,6),
        // hasMore: flag,
      });
      wx.hideLoading()
      // if (that.data.wenzData.length <= 0) {
      //   setTimeout(function () {
      //     that.setData({
      //       dataStatus: true
      //     })
      //   }, 500)
      // }
      // if (that.data.wenzData.is_idle){
      //   that.setData({
      //     business_id: wenzData.id
      //   })
      // }
      
    }).catch(e => {
      console.log(e)
    })
  },
  // 搜索 
  searchSubmit(e) {
    console.log(e)
  },

  goChat(e) {
    wx.showTabBar()
    this.setData({
      pop3: false,
      popidx: false
    })
    publicMethod.getFormId(e, this)
    let options = e.currentTarget.dataset.options;
    let param = {
      be_member_id: options.member_id,
      name: options.home_nickname,
      type: options.type
    }
    wx.navigateTo({
      url: '/pages/chatDetail/index?param=' + JSON.stringify(param),
    })
  },
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  //前往闲置详情页
  goToActivity(e) {
    let that = this;
    let idle_id = e.currentTarget.dataset.idle;
    let member_id = that.data.member_id;
    let busnesid = e.currentTarget.dataset.busnesid;
    let content_id = e.currentTarget.dataset.content_id;
    let url = "/packageA/pages/idleDetails_page/index?member_id=" + wx.getStorageSync('member_id') + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id
    wx.navigateTo({
      url: url
    })

  },
  //编辑弹框
  showEdit() {
    let that = this;
    that.setData({
      showEditBox: true
    })
  },
  //跳转到详情页面
  goToDetail(e) {
    let url = "/pages/circle_detail/circle_detail?contentid=" + e.currentTarget.dataset.contentid;
    wx.navigateTo({
      url: url
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  onShareAppMessage: function (res) { //分享
  console.log(res)
    let that = this
    return {
      title: '好邻居，好闲置，好 "闲" 交好友！',
      path: '/pages/getalllist/getalllist',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      circle_page:0,
      showFull: [],
      shopList: [],
      wenzData: [],
      pageIndex: 1,
      hasMore: true,
      hasMore_full:true,
      dataStatus: false,
      fullStatus:false,
      loadend: [],
      sechs:'',
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude
    })
    //列表
    that.getwenzhang();
    // 附近的团组
    that.getmyGroupList();
    // 附近闲友
    that.getFjxyList();
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  // 触底函数
  // onReachBottom() {
  //   let that = this;
  //   wx.showLoading({
  //     title: "加载中...",
  //     icon: 'none',
  //     mark: true,
  //     success() {
  //      that.setData({
//           pageIndex: (that.data.pageIndex + 1)
//         })
//         console.log(that.data.pageIndex)
//         that.getData()
  //     }
        
  //   })
  //   setTimeout(function () {
  //     wx.hideLoading()
  //   }, 1500)

  // },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/usecoin/usecoin" });
    }
  },

  myCatchTouch() { //弹框状态禁止滑动
    return;
  },

  // 订单管理跳转
  goToMyComment(e) {
    let member_id = wx.getStorageSync('member_id')
    console.log(e)
    if (!member_id) {
      console.log('未授权')
      //todo 执行跳转登录页面
    } else {
      if (e.currentTarget.dataset.url == "/pages/bank/bank") {
        wx.reLaunch({
          url: e.currentTarget.dataset.url
        })
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  //点击商户头像跳转
  goTomyshop(e){
    console.log(e)
    let member_id = e.currentTarget.dataset.member_id;
    let url = "/pages/mine/myIdle/index?member_id="+ member_id;
    wx.navigateTo({
      url: url
    })
  },
  saveTitleName(e){
    console.log(e)
    let that = this;
    that.setData({
      sechs: e.detail.value
    })
    if (e.detail.value == '') {
      that.onPullDownRefresh();
    }
  },
  clickSearch(){
    let that = this;
    // let sechs_vale = that.data.sechs;
    // if (sechs_vale == ''){
    //   wx.showToast({
    //     title: '搜索不能为空...',
    //     icon:'none'
    //   })
    //   return
    // }
    
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/fjIdleList/index',
    })
    // common.get('/idle/idleSearch',{
    //   title: sechs_vale
    // }).then(res =>{
    //   if (res.data.code == 200) {
    //     that.setData({
    //       wenzData: res.data.res,
    //       hasMore:false
    //     })
    //   } else if (res.data.code == 202) {
    //     wx.showToast({
    //       title: res.data.msg,
    //       icon: 'none'
    //     })
    //   }
    // })
  },
  relIdle_btn(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      return
    }else{
      wx.navigateTo({
        url: '/pages/mine/myIdlerelease/index?is_sales=1',
        // url:'/packageA/pages/gujiubook/putshelf/index'
      })
    }
  },
  release_btn(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      return
    }
    that.setData({
      release_name:'',
      release_phone:'',
      release_text:'',
      release_marsk:true
    })
  },
  inputTitle(e){
    console.log(e)
    let that = this;
    that.setData({
      release_name:e.detail.value
    })
  },
  inputPhone(e){
    let that = this;
    that.setData({
      release_phone: e.detail.value
    })
  },
  inputText(e) {
    let that = this;
    that.setData({
      release_text: e.detail.value
    })
  },
  getinfo_phone(e){
    let that = this;
    let idle_purchase_id= e.target.dataset.id;
    let member_id= wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      return
    }
    common.get('/idle/is_phone',{
      idle_purchase_id,
      member_id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          marsk1: true,
          marsk_name: res.data.data.name,
          marsk_tel: res.data.data.mobile,
        })
      }else if(res.data.code == 206){
        wx.showModal({
          title: '查看电话',
          content: '需支付30积分查看',
          success: function (res) {
            if (res.confirm) {
              common.get('/idle/idle_purchase_phone', {
                idle_purchase_id,
                member_id
              }).then(res => {
                if (res.data.code == 206) {
                  wx.showModal({
                    title: res.data.msg,
                    content: '请先赚取积分',
                    showCancel:false
                  })
                }
                if (res.data.code == 200) {
                  that.setData({
                    marsk1: true,
                    marsk_name: res.data.data.name,
                    marsk_tel: res.data.data.mobile,
                  })
                }

              })
            } else if (res.cancel) {
              console.log('点击了取消')
            }
          }
        })
      }
    })


  },
  left_btn(){
    this.setData({
      marsk1: false,
    })
  },
  /**调用电话 */
  tel: function () {
    if (this.data.marsk_tel != null) {
      wx.makePhoneCall({
        phoneNumber: this.data.marsk_tel,
      })
    } else {
      app.showToast({
        title: "暂无联系电话"
      })
    }
  },
  cancel_marsk(){
    this.setData({
      release_marsk:false
    })
  },
  forbid_marsk(){
    return
  },
    // 点击闲友头像
    gotoxyIdle(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/mine/myIdle_baby/index?member_id=' + id,
      });
    },
    goTomyidle(){
        let url = "/pages/mine/myIdleIndex/index?member_id="+ wx.getStorageSync('member_id');
        wx.navigateTo({
          url: url
        })
      },
    

    getmygroup(){
      let that = this;
      common.post('/idle/password',{ 
        member_id: wx.getStorageSync('member_id'),
      }).then( res =>{
        if(res.data.code == 200){
          if(res.data.data.password == '' || !res.data.data.password){
            wx.showModal({
              cancelColor: 'cancelColor',
              content:'请先设置密码，好友或邻居设置相同的密码即可进入同一团组',
              showCancel:false,
              confirmColor:'#ff0000',
              success(res) {
                if(res.confirm){
                  that.setData({
                    setPassword: true
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return
          }else{
            wx.navigateTo({
              url: '/packageA/pages/myidle_group/index',
            })
            return
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch( e =>{
        console.log(e)
      })
    },
    set_library_password(e){
      console.log(e)
      let that = this;
      let password = e.detail.value.password;
      if(!password || password == ''){
        wx.showToast({
          title: '请输入密码！',
          icon: 'none'
        })
        return
      }
      common.post('/idle/password',{ 
        password,
        member_id: wx.getStorageSync('member_id'),
      }).then( res =>{
        if(res.data.code == 200){
          wx.showToast({
            title: '设置成功！',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            setPassword: false
          })
          that.getmygroup();
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch( e =>{
        console.log(e)
      })
    },
    setPassword_cover(){
      this.setData({
        setPassword: false
      })
    },
  // 去创建团组
  goTomycreate(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/createMyIdleGroup/index',
    })
  },
    // 附近闲置圈
    getmyGroupList(){
      let that = this;
      common.get('/idlegroup/my_group',{
        member_id:wx.getStorageSync('member_id'),
        is_mine:'1',
        lat: that.data.latitude,
        lng: that.data.longitude
      }).then(res =>{
        if(res.data.code == 200){
          let mygrouplist = res.data.data.list;
          let nearGroupList = res.data.data.near.splice(0,3);
          that.setData({
            mygrouplist,
            nearGroupList
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
     // 附近闲友
    getFjxyList(){
      let that = this;
      common.get('/idlegroup/near_member',{
        lat: that.data.latitude,
        lng: that.data.longitude
      }).then(res =>{
        if(res.data.code == 200){
          let fjxyList = res.data.data.splice(0,3);
          that.setData({
            fjxyList,
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
    // 附近闲置
    gotolottery(){
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/fjIdleList/index',
      })
    },
    // 附近闲置圈
    gotoFjGroupList(){
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/fjGroupList/index',
      })
    },
    // 我的闲圈
    goTomyGroup(){
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/myidleGroupIndex/index',
      })
    },
     // 去团组详情页
  goToGroupIndex(e){
    let group_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/GroupIndex/index?group_id=' + group_id,
    })
  },
  // 附近闲友查看更多
  goToflxy(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/fjXyList/index',
    })
  },
  //  点击求购闲置
  myBuyingIndex(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/myBuyingIndex/index?member_id=' + wx.getStorageSync('member_id'),
    })
  },
// =========  做任务赚积分 弹窗功能 =======
  // 做任务赚积分跳转过来
  getDoneTask(id,jifen){
    let that = this;
    let task_id = id;
    let taskMaskpreview_jifen = jifen;
    common.get('/mine/index?op=done_task',{
      member_id: wx.getStorageSync('member_id'),
      task_id,
    }).then(res =>{
      if(res.data.code == 200){
      if(that.data.is_Signtask == '1'){
        that.setData({
          is_signTaskMask: true,
          taskMaskpreview_title:'欢迎了解闲置圈',
          taskMaskpreview_jifen,
        })
        setTimeout(function(){
          that.setData({
            is_signTaskMask: false,
            taskMaskpreview_title:'',
            taskMaskpreview_jifen:'',
            is_Signtask: 0
          })
        },2000)
      }
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
  click_mask(){
    this.setData({
      is_signTaskMask: false,
      taskMaskpreview_title:'',
      taskMaskpreview_jifen:'',
      is_Signtask: 0
    })
  },
// =========  做任务赚积分 弹窗功能 =======
})