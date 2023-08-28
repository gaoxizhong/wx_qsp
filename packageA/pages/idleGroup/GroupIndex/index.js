const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    my_library:'',
    member_List:[],
    longitude: '',
    latitude: '',
    library_name:'',
    isShowConfirm:false,
    content_num:0,
    browse:0,
    idle_count:0,
    count:0,
    is_leamsg:false,
    library_password:'',
    password:'',
    group:{}, // 团组信息
    mine:false,  // 是否加入这个团组
    group_id:'',
    saleCount:0, // 成交数
    idleCount:0, // 闲置数
    wenzData:[], // 圈友闲置
    content_list:[],  // 一条留言
    contentList: [],   //  所有留言
    content_count: 0, // 留言条数
    ly_status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options)
    if(this.options.id){
      that.setData({
        group_id: this.options.id,
        member_id: wx.getStorageSync('member_id')
      })
    }
    if(this.options.group_id){
      that.setData({
        group_id: this.options.group_id,
        member_id: wx.getStorageSync('member_id')
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
    that.setData({
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
    })
    console.log(that.data.latitude)
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
        // 圈内闲置
        that.getwenzhang();
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
        // 圈内闲置
        that.getwenzhang();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
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

  //下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    let that = this;
    that.setData({
      member_List:[],
      wenzData:[]
    })
    that.onShow();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) { //分享
    console.log(res)
    let that = this;
    let group_id = that.data.group_id;
    if (res.from === 'button') {
      return {
        title: '好邻居好闲置，好“闲”交好友！',
        imageUrl: '',
        path: '/packageA/pages/idleGroup/GroupIndex/index?group_id=' + group_id,
        success: function (res) {
          // 转发成功
          console.log(res)
  
        },
        fail: function (res) {
          // 转发失败
          console.log(res)
        }
      }
    }
    return {
      title: '快来加入团组吧！',
      imageUrl: '',
      path: '/packageA/pages/idleGroup/GroupIndex/index?group_id=' + group_id,
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
        let member_List = res.data.data.members;
        let group = res.data.data.group;
        that.setData({
          group,
          member_List,
          saleCount: res.data.data.saleCount, // 成交数
          idleCount: res.data.data.idleCount, // 闲置数
          mine: res.data.data.mine,  // 是否加入这个团组状态
          browse:res.data.data.browse, // 浏览量
          contentList: group.content,   //  所有留言
          content_list: group.content.slice(0,1), //  截取第一条留言  splice()改变了原数组， slice() 不改变原数组
          content_count: group.content_count, //  留言条数
          // count:res.data.data.count,
          // idle_count:res.data.data.idle_count,
          // content_num: Number(res.data.data.content_list.length),
          // password: res.data.data.password,
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
  /**
   * 进入个人闲置
  */
  goToindex_personal(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    let url = "/pages/mine/myIdle/index?member_id="+ id;
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 进入创建图书馆
  */
    goTocreate(){
    let member_id = wx.getStorageSync('mmember_id');
    wx.navigateTo({
      url: '/packageA/pages/library/create_library/create_library',
    })

  },
    //搜索图书馆
    searchLibrary(e) {
      let that = this;
      console.log(e.detail.value);
      this.setData({
        library_name: e.detail.value
      })
      if (e.detail.value == ''){
        that.getLibrarygeren();
      }
    },
      //条件查找图书馆
  getLibraryByConditon() {
    let that = this;
    let params = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      book_name: that.data.library_name,
      member_id: wx.getStorageSync('member_id'),
    }
    if(params.library_name == ''){
      wx.showToast({
        title: '搜索不能为空！',
        icon:'none'
      })
      return
    }
    // 搜索书名。。。
    common.get("/newhome/my_group_search", params).then(res => {
      if (res.data.code == 200) {
        that.setData({
          library_member_List: res.data.data
        })
      } else if (res.data.code == 202){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
  my_attention(){
    wx.navigateTo({
      url: '/packageA/pages/library/my_attention/index',
    })
  },
// 发布留言
release_btn(){
  this.setData({
    is_leamsg:true
  })
},
//查看全部留言
goTolist_detail(){
  let that = this;
  wx.navigateTo({
    url: '/packageA/pages/mygroup_leave/index?member_id=' + wx.getStorageSync('member_id'),
  })
},
//  点击遮罩层
release_mrsk(){
  this.setData({
    is_leamsg:false
  })
},

//  编写留言
leamsg(e){
  console.log(e)
  let leamsg = e.detail.value;
  this.setData({
    leamsg,
  })
},

// 提交留言
leamsg_sub() {
  let that = this;
  let prems = {
    member_id:wx.getStorageSync('member_id'),
    content : that.data.leamsg,
    group_id: that.data.group_id
  } 
  if(prems.content == ''){
    wx.showToast({
      title: '请填写留言内容...',
      icon:'none'
    })
    return
  }
  common.post('/idlegroup/content',prems).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '提交成功！',
        icon:'success'
      })
      that.setData({
        is_leamsg:false,
        member_List:[],
        wenzData:[],
        leamsg:'',
      })
      that.onShow();
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
  //圈内闲置列表
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
      group_id: that.data.group_id
    }).then(res => {
      // var newList = this.data.wenzData.concat(res.data.res);
      // // 2.3 获取数据的总数
      // var count = res.data.total;
      // // 2.4 用于判断比较是否还有更多数据
      // var flag = this.data.pageIndex * this.data.pageSize < count;
      that.setData({
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
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
    //前往闲置详情页
    goToActivity(e) {
      let that = this;
      let idle_id = e.currentTarget.dataset.idle;
      let member_id = that.data.member_id;
      let busnesid = e.currentTarget.dataset.busnesid;
      let content_id = e.currentTarget.dataset.content_id;
      let url = "/packageA/pages/idleDetails_page/index?member_id=" + member_id + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id
      wx.navigateTo({
        url: url
      })
    },
    // 完善信息按钮
    CompleteBtn(e){
      console.log(e)
      let group_id = e.currentTarget.dataset.group_id;
      let type = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/CompleteInfo/index?group_id=' + group_id + '&type=' + type,
      })
    },
    gotojiar(e){
      let that = this;
      let group_id = e.currentTarget.dataset.group_id;
      common.get('/idlegroup/join',{
        member_id:wx.getStorageSync('member_id'),
        group_id,
      }).then(res =>{
        if(res.data.code == 200){
          wx.showToast({
            title: '成功加入环保圈',
            icon:'none'
          })
          setTimeout(function(){
            that.onShow();
          },1500)
        }
      }).catch(e =>{
        console.log(e)
      })
    },
    // 查看积分详情
    goTomemberindex(e){
      let group_id = e.currentTarget.dataset.group_id;
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/memberjoinIndex/index?group_id=' + group_id,
      })
    },
    // 查看圈友闲置更多
    goTotyList(){
      wx.navigateTo({
        url: '/packageA/pages/idleGroup/tyList/index?group_id=' + this.data.group_id,
      })
    },

    // 生成海报
    gotoMakephoto() {
      let that = this;
      let type = 'idlecircle';
      let id = that.data.group_id;
      let page_url = 'packageA/pages/idleGroup/GroupIndex/index';
      let content = '';
      let icon_path = '';
      let member_id = that.data.group.member_id;
      publicMethod.gotoMakephoto(that,type,id,page_url,content,icon_path,member_id);
    },
    // 保存海报
    saveImage(e) {
      publicMethod.saveImage(e, this);
    },
    //图片预览
    previewImage(e) {
      let image_url = [];
      console.log(e)
      image_url.push(e.currentTarget.dataset.img);
      wx.previewImage({
        urls: image_url // 需要预览的图片http链接列表  
      });
    },
    // 关闭海报
    clodmark() {
      this.setData({
        makephoto: false
      })
    },
    /**
   * 获取小程序二维码参数
   * @param {String} scene 需要转换的参数字符串
   */
  getScene: function (scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
  },
  // 查看更多留言
  gotoly(){
    let that = this;
    let ly_status = that.data.ly_status;
      that.setData({
        ly_status: !ly_status,
      })
  },
  gotoQnIdleList(e){
    let that = this;
    console.log(e)
    let group_id = e.currentTarget.dataset.group_id;
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/qnIdleList/index?group_id=' + group_id,
    })
  }
})