const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({
  data: {
    top_img: [],  //头部banner图
    longitude: '',
    latitude: '',
    library_id:'',
    showList: true,  //展示所有图书馆
    area_library: [],  //地区图书馆分布
    libraryList: [],  //查询出来的所有图书馆
    selectedLibrary: null,  //被选中的图书馆
    areas_id: 0,  //被选中的区域
    library_name: '',  //搜索图书馆的名字
    book_name: '', //搜索图书的名字
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['按书名查找', '按图书馆查找'],//下拉列表的数据
    selectShow1: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData1: ['按距离排序', '按藏书排序'],//下拉列表的数据
    idx: 0,//选择的下拉列表下标
    sort_num: 0,//选择的下拉列表下标
    showService:false,
    my_library:'',
    star_len:30,
    is_mmk:false,
    is_name:{},
    no_name:{},
    list_page:1,
    is_mark:false,
    steps:0,
    canIUseGetUserProfile: false

  },
  onLoad: function(options) {
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    if(options.steps == '2'){
      this.setData({
        steps: options.steps,
      })
    }
    if(options.library_name){
      this.setData({
        library_name: options.library_name,
        idx:1,
      })
    }
    console.log(this.options);
    if(this.options.code_id){
      that.setData({
        code_id:this.options.code_id,
        library_id:this.options.library_id,
        is_mark:true,
      })
    }
    publicMethod.zhuan_baidu(this)
   
    that.getLibraryPosition();
    that.getRegionLibrary();
    that.getBannerPic();
    if(!that.data.steps){
      wx.showModal({
        showCancel:false,
        content:'欢迎您参加环保公益活动！环保积分可兑换环保共享图书；50积分可以兑换50元图书；每人限兑5本/天（当月累计不超过10本）。环保积分兑换更多福利，在“积分兑换”内查看；感谢您对环保支持！',
        success(res){
          if(res.confirm){
          }else if(res.cancel){
          }
        }
      })
    }else{
      return
    }

  },
  onShow: function() {
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
    }
    let that = this
    that.setData({
      is_mmk:false,
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    wx.createMapContext("map");
  },

  // 点击下拉显示框
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  // 点击下拉列表
  optionTap(e) {
    console.log(e)
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      idx: Index,
      selectShow: !this.data.selectShow
    });
  },
    // 点击排序下拉显示框
    selectTap1() {
      this.setData({
        selectShow1: !this.data.selectShow1
      });
    },
    // 点击排序下拉列表
    optionTap1(e) {
      let that = this;
      console.log(e)
      let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
      that.setData({
        sort_num: Index,
        selectShow1: !that.data.selectShow1
      });
      let params = {
        lng: that.data.longitude,
        lat: that.data.latitude,
        sort_num:Index+=1
      }
      common.get("/library/getLibrary", params).then( res => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            selectedLibrary: res.data.data[0],
            libraryList: res.data.data,
            is_name:res.data.data[0],
            // no_name:res.data.data[0],
  
          })
        }
      })
    },
  //选择区域
  selectArea(e) {
    this.setData({
      areas_id: e.currentTarget.dataset.id,
      library_name: '',
    })
    this.getLibraryByConditon_aa();
  },
  //搜索图书馆
  searchLibrary(e) {
    let that = this;
    console.log(e.detail.value);
    this.setData({
      areas_id: 0,
      library_name: e.detail.value,
      book_name: e.detail.value,
    })
    if (e.detail.value == ''){
      that.getLibraryPosition();
    }
  },
  //查询个人图书馆路线
  getRoadLine_geren(e) {
    console.log(e)
    let that = this;
    wx.getLocation({
      type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
      isHighAccuracy:true,
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
    console.log(res);
        const latitude = Number(e.currentTarget.dataset.latitude) 
        const longitude = Number(e.currentTarget.dataset.longitude)
        wx.openLocation({        //所以这里会显示你当前的位置
          latitude,
          longitude,
          name: e.currentTarget.dataset.name,
          address: e.currentTarget.dataset.address,
          scale: 18
        })
      }
    })
  },
  //查看图书馆
  getLibraryPosition() {
    let that = this;
    let params = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      areas_id: that.data.areas_id,
      library_name: that.data.library_name,
      book_name:that.data.book_name,
      member_id: wx.getStorageSync('member_id')
    }
    wx.showLoading({
      title: '数据加载中...',
    })
    common.get("/library/getLibrary", params).then( res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading();
        that.setData({
          selectedLibrary: res.data.data[0],
          libraryList: res.data.data,
          is_name:res.data.data[1],
          no_name:res.data.data[0],

        })
      }
    }).catch(e =>{
      console.log(e)
      wx.hideLoading();
    })
  },
  //条件查找图书馆
  getLibraryByConditon() {
    let that = this;
    let params = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      areas_id: that.data.areas_id,
      library_name: that.data.library_name,
      book_name:that.data.book_name
    }
    if (that.data.idx == 0){
        // 搜索书名。。。
      common.get("/library/search_library", params).then(res => {
        if (res.data.code == 200) {
          that.setData({
            libraryList: res.data.data
          })
        } else if (res.data.code == 202){
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      })
    } else if (that.data.idx == 1){
      // 搜索馆名。。。
      common.get("/library/getLibrary", params).then(res => {
        if (res.data.code == 200) {
          that.setData({
            libraryList: res.data.data
          })
        }
        else if (res.data.code == 202) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  //城区导航查找
  getLibraryByConditon_aa() {
    let that = this;
    let params = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      areas_id: that.data.areas_id,
      library_name: that.data.library_name,
      book_name: that.data.book_name
    }
    common.get("/library/getLibrary", params).then(res => {
      if (res.data.code == 200) {
        that.setData({
          libraryList: res.data.data
        })
      }
    })
  },
  //获取区域图书馆
  getRegionLibrary() {
    let that = this;
    common.get("/library/getAreaLibrary", {}).then( res => {
      console.log(res);
      if (res.data.code == 200) {
        that.data.area_library = res.data.data;
        that.setData({
          area_library: res.data.data
        })
      }
    })
  },
  //选择图书馆
  chooseLibrary(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.data.libraryList.forEach(element => {
      if (element.id == id) {
        that.setData({
          selectedLibrary: element,
          library_id: element.id,
        })
      }
    });
    console.log(that.data.selectedLibrary);
  },
    //关闭会话弹框
    closePartChat() {
      if ( this.data.showService ) {
        this.setData({
          showService: false
        })
      }
    },
  /**点击查看地图 */
  hideList() {
    this.setData({
      showList: false
    })
  },
  /**
   * 进入图书馆首页 
   */
  goToindex(e){
    console.log(e)
    this.chooseLibrary(e);
    let that = this;
    let url = "/packageA/pages/library/index?library_id=" + that.data.selectedLibrary.id + "&library_opentime=" + that.data.selectedLibrary.operational_hours 
    wx.navigateTo({
      url: url
    })
  },

  //跳转到购买图书
  goToBuyBook() {
    let that = this;
    if ( !that.data.member_id ) {
      publicMethod.showLoginConfirm(that);
      return;
    }
    let url = "/pages/buybook/buybook?id=" + that.data.library_id + "&numberid=" + that.data.library_number;
    that.data.libraryList.forEach( ele => {
      if ( ele.id == that.data.library_id ) {
        wx.setStorageSync("library_name", ele.library_name)
      }
    })
    wx.navigateTo({
      url: url
    })
  },

  //触底事件
  onReachBottom() {

  },
  //下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getShopCates();
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getShopCates();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
    wx.stopPullDownRefresh();
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goTocreate(){
    let member_id = wx.getStorageSync('mmember_id');
    wx.navigateTo({
      url: '/packageA/pages/library/create_library/create_library',
    })

  },
  exchange_book(){
    let that =this;
    that.setData({
      is_mmk:true
    })
  },
  is_mmk(){
    let that = this;
    that.setData({
      is_mmk:false
    })
  },
  aaa(){
    return
  },
/**跳积分兑换 */
gotobuy:function(e){
  let that = this;
  let library_id = e.currentTarget.dataset.library_id;
  let library_number = e.currentTarget.dataset.library_number;
  console.log(e)
  let url = "/pages/buybook/buybook?library_id=" + library_id + "&library_number=" +library_number;
  wx.navigateTo({
    url: url
  });
},
gotobuy1:function(e){
  let that = this;
  that.setData({
    is_mmk:false
  })
  wx.showModal({
    title: '',
    content: '请从以下图书馆中选择',
    showCancel:false,
    confirmColor:'#cf0000',
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      }
    }
  })
},
rece_integral(){
  let that = this;
  wx.login({
    success: function (data) {
      that.setData({
        loginData: data
      })
    }
  })
  let member_id = wx.getStorageSync('member_id');
  if (!member_id) {
    publicMethod.gotoLoginMark();
    return;
  }
  common.get("/Integral/library_accept_integral", { 
    "member_id": wx.getStorageSync('member_id'),
    "code_id": that.data.code_id,
    "library_id": that.data.library_id,
  }).then(res => {
  if (res.data.code == 200) {
    wx.showToast({
      title: '积分领取成功!',
      icon:'success',
      duration: 2000,
    })
    setTimeout(() =>{
      that.setData({
        is_mark: false
      })
    wx.navigateTo({
      url: '/packageA/pages/library/index?library_id=' + that.data.library_id,
    })
    },2000)
      
  }else if(res.data.code == 202){
    wx.showToast({
      title: res.data.msg,
      icon:'none',
      duration: 3000,
    })
    setTimeout(() =>{
      that.setData({
        is_mark: false
      })
    wx.navigateTo({
      url: '/packageA/pages/library/index?library_id=' + that.data.library_id,
    })
    },2000)
  }else {
    wx.showToast({
      title: res.data.msg,
      icon:'none',
      duration: 2000,
    })
  }
}).catch(error => {
  console.log(error);
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
  myCatchTouch(){
    return
  },
//获取banner图
getBannerPic() {
  let that = this;
  common.get('/banner/newInfo', {
    type: 11,
    member_id:wx.getStorageSync('member_id'),
  }).then(res => {
    console.log(res);
    if (res.data.code == 200) {
      that.setData({
        top_img: res.data.data,
      })
    }
  }).catch(error => {
    console.log(error)
  })
},
})