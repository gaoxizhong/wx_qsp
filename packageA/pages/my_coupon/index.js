const app = getApp()
const common = require('../../../assets/js/common');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({
  data: {
    cate_list: [],  //商家类目
    cateSeleted: '',  //当前选中的商家类目
    columnSeleted: 2, //当前选中的一级栏目
    shopList: [],  //查询出来的商家列表
    shopList_page: 1,  //查询商家列表当前页
    likeList_page: 1,
    likeList: [],//查询出来的商品列表
    listData:[],
    isShowConfirm:false,
    businessid:'',
    avatar : '',
    business_count:'',
    mem_count:'',
    total_money:'',
    memberwidth : 90,
    memberheight : 90,
    windowHeight:0,
    windowWidth:0,
    boxheight:604,
    pageSize:10,
    hasMore:true,
    is_position:false,
    longitude:'',
    latitude:'',
    is_shops: 1,
    aaa:false,
    shop_name:'',
  },
  onLoad: function() {
    let member_id = wx.getStorageSync('member_id');
    console.log(member_id)
    if (!member_id) {
      // return//todo 备注:此处为了腾讯登录规则变化修改
    }
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
    })
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        this.setData({
          windowHeight,
          windowWidth,
        })
      }
    })
  },
  onShow: function() {

  },
  onReady(){
    let that = this;
    that.onPullDownRefresh();
  },
  onHide() {
  },
  onUnload() {
  },
  //从商家列表跳转到商家
  goToShop(e) {
    let businessid =  e.currentTarget.dataset.id;
    let url = "/pages/shop/shop?business_id=" + businessid;
    if(e.currentTarget.dataset.is_password == 1){
      this.setData({
        businessid,
        isShowConfirm:true
      })
      return
    }else{
      wx.navigateTo({
        url: url
      })
    }

  },
  //2.点击切换一级类目
  getcolumnShop(e) {
    let that = this;
     let columnSeleted = e.currentTarget.dataset.id;
    that.setData({
      columnSeleted,
      hasMore:true,
      likeList_page: 1,
      likeList: [],
      shopList_page: 1,
      shopList: [],
    })
    if(columnSeleted == 1){
      that.getShopBylike();
    }
    if(columnSeleted == 2){
      //获取商家类目
      that.getShopCates();
    }
  },
  //3.获取商家类目
  getShopCates() {
    let that = this;
    common.get('/business/category', { type: 4 }).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          cate_list: res.data.data.rows,
          cateSeleted: res.data.data.rows[0].id
        })
        that.getShopByCate();
      }
    })
  },
  //点击切换类目
  getCateShop(e) {
    let that = this;
    that.setData({
      cateSeleted: e.target.dataset.id,
      shopList_page: 1,
      shopList: [],
      shop_name:''
    })
    that.getShopByCate();
  },
  //根据类目获取商家信息
  getShopByCate() {
    let that = this;
    let p ={
      type: 4,
      category: that.data.cateSeleted,
      page: that.data.shopList_page,
      lat: that.data.latitude,
      lng: that.data.longitude
    }
    if(that.data.shop_name){
      p.name = that.data.shop_name
    }
    wx.showLoading({
      title:'加载中...'
    })
    common.get('/business/businessList', p).then( res => {
      wx.hideLoading();
      if ( res.data.code == 200 ) {
        let sortList = that.data.shopList.concat(res.data.data);
        if ( that.data.shopList_page > 1 &&  res.data.data.length == 0) {
          wx.showToast({
            title: '已加载全部...',
            icon: 'none',
            duration: 1000
          })
        }
        that.setData({
          shopList: sortList
        })
      } else if ( res.data.code == 206 ) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    }).catch( error => {
      wx.hideLoading();
      console.log(error);
    })
  },


  // 附近优惠券
  getShopBylike(){
    let that = this;
    if (!this.data.hasMore){
      wx.showToast({
        title: '已加载全部...',
        icon:'none'
      })
      return
    }
    common.get('/redeem/nearby_coupon', {
      page: that.data.likeList_page,
      lat: that.data.latitude,
      lng: that.data.longitude,
      member_id: wx.getStorageSync('member_id'),
    }).then( res => {
      if ( res.data.code == 200 ) {
        let sortList = that.data.likeList.concat(res.data.data.r);
        var count = res.data.data.total;
        var flag = that.data.likeList_page * that.data.pageSize < count;
        that.setData({
          likeList: sortList,
          hasMore: flag,
        })
      } else if ( res.data.code == 206 ) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  //触底事件
  onReachBottom() {
    let that = this;
    if(that.data.columnSeleted == 1){
      that.setData({
        likeList_page: ( that.data.likeList_page + 1 )
      })
      that.getShopBylike();
    }
    if(that.data.columnSeleted == 2){
      that.setData({
        shopList_page: ( that.data.shopList_page + 1 )
      })
      that.getShopByCate();
    }
    
  },
  //下拉刷新
  onPullDownRefresh() {
    let that = this;
    that.setData({
      cate_list: [],  //商家类目
      shopList: [],  //查询出来的商家列表
      shopList_page: 1,  //查询商家列表当前页
      shop_name:'',
      likeList_page: 1,
      likeList: [],//查询出来的商品列表
      hasMore:true
    })
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
         var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),Number(res.latitude));
         that.setData({
           longitude: gcj02tobd09[0],
           latitude: gcj02tobd09[1]
         })
        if(that.data.columnSeleted == 1){
          that.getShopBylike();
        }
        if(that.data.columnSeleted == 2){
          //获取商家类目
          that.getShopCates();
        }
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
    wx.stopPullDownRefresh();
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
  /*验证编码是否正确 */
  judge_linbarrnum:function(e){
    let that = this;
    console.log(e)
    let url = "/pages/shop/shop?business_id=" + that.data.businessid; 
    let shop_password = e.detail.value.library_bianma;
    if (shop_password==''){
      app.showToast({
        title: "请输入书店密码"
      })
    }else{
      common.get('/business/res_password', {
        business_id: that.data.businessid,
        shop_password,
      }).then(res => {
        if(res.data.code==200){
          that.setData({
            isShowConfirm: false
          })
          wx.navigateTo({
            url: url,
          })
        }else{
          app.showToast({
            title: res.data.msg,
          })
        }

      })
    }
  },
  isShowConfirm(){
    this.setData({
      isShowConfirm:false
    })
  },
  // 返回 min（包含）～ max（不包含）之间的数字：
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  },
    //前往活动详情
  goToActivity(e) {
    console.log(e)
    let that = this;
    let id = e.detail.id;
    let url = "/packageA/pages/coupon_detail/index?id=" + id;
    wx.navigateTo({
      url: url
    })
  },
    /**
   * 页面滚动距离
   */
  onPageScroll: function (e) {
    if( Number(e.scrollTop) >=  340){
      this.setData({
        is_position:true
      })
    }else{
      this.setData({
        is_position:false
      })
    }

  },
  //搜索店铺
  searchLibrary(e) {
    let that = this;
    this.setData({
      shop_name: e.detail.value
    })
    if (e.detail.value == ''){
      that.setData({
        shopList:[],
        shopList_page:1,
        hasMore:true,
      })
      that.getShopByCate();
    }
  },
  getLibraryByConditon() {
    let that = this;
    that.setData({
      hasMore:true,
      shopList_page: 1,
      shopList: [],
    })
    let params = {
      lng: that.data.longitude,
      lat: that.data.latitude,
      name: that.data.shop_name,
      type: 4,
      category: that.data.cateSeleted,
      page: that.data.shopList_page,
    } 
    if(params.name == ''){
      wx.showToast({
        title: '搜索不能为空！',
        icon:'none'
      })
      return
    }
    // 搜索书名。。。
    common.get("/business/businessList", params).then(res => {
      if ( res.data.code == 200 ) {
        let sortList = that.data.shopList.concat(res.data.data);
        if ( that.data.shopList_page > 1 &&  res.data.data.length == 0) {
          wx.showToast({
            title: '已加载全部...',
            icon: 'none',
            duration: 1000
          })
        }
        that.setData({
          shopList: sortList
        })
      } else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  aaa(){
    return
  },
  binderrorimg(e){
    let errorImgIndex= e.target.dataset.errorimg //获取循环的下标
    let shopList=this.data.shopList;
    shopList[errorImgIndex].avatar_url = shopList[errorImgIndex].avatar;
    this.setData({
      shopList
    })
  }
})
