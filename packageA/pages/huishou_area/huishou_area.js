const app = getApp()
const common = require('../../../assets/js/common');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');

Page({
  data: {
    img_url: app.data.imgUrl,
    cate_list: [],  //商家类目
    cateSeleted: '',  //当前选中的商家类目
    shopList: [],  //查询出来的商家列表
    shopList_page: 1,  //查询商家列表当前页
    newlistData:[],
  },
  onLoad: function() {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })

  },
  onShow: function() {
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      // return//todo 备注:此处为了腾讯登录规则变化修改
    }
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
      shopList_page: 1,
      shopList: [],
    })
    
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude : Number(res.latitude),
           longitude : Number(res.longitude)
         })
         console.log(that.data.latitude)
         console.log(that.data.longitude)
         var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
         that.setData({
           longitude: gcj02tobd09[0],
           latitude: gcj02tobd09[1]
         })
         console.log(that.data.latitude)
         console.log(that.data.longitude)
        that.getShopCates();
        that.gettuan_goods_list();
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getShopCates();
        that.gettuan_goods_list();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
  },
  onHide() {
  },
  onUnload() {
  },
  //从商家列表跳转到商家
  goToShop(e) {
    let url = "/pages/shop/shop?business_id=" + e.currentTarget.dataset.id;
    wx.navigateTo({
      url: url
    })
  },
  //获取商家类目
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
    })
    that.getShopByCate();
  },
  //根据类目获取商家信息
  getShopByCate() {
    let that = this;
    common.get('/business/businessList', {
      type: 4,
      category: that.data.cateSeleted,
      page: that.data.shopList_page,
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then( res => {
      if ( res.data.code == 200 ) {
        let sortList = that.data.shopList.concat(res.data.data);
        // if ( that.data.shopList_page > 1 &&  res.data.data.length == 0) {
        //   wx.showToast({
        //     title: '没有更多了！',
        //     icon: 'none',
        //     duration: 1000
        //   })
        // }
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
      console.log(error);
    })
  },
  // 获取商品列表
gettuan_goods_list(){
  let member_id = this.data.member_id;
  let lat = this.data.latitude;
  let lng = this.data.longitude;
  let perm ={
    member_id,
    lat,
    lng,
  }
  common.get('/service/tuan_goods_list',perm).then(res =>{
    if(res.data.code == 200){
      var listData = res.data.data;
      var newlistData = listData.splice(0,3);
      this.setData({
        newlistData,
      })
    }else{
      wx.showToast({
        title: res.data.msg,
        icon:'none',
      })
    }
  })
},




  //触底事件
  onReachBottom() {
    let that = this;
    that.setData({
      shopList_page: ( that.data.shopList_page + 1 )
    })
    that.getShopByCate();
  },
  //下拉刷新
  onPullDownRefresh() {
    let that = this;
    that.setData({
      newlistData:[],
      shopList: [],  //查询出来的商家列表
      shopList_page: 1,  //查询商家列表当前页
    })
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude : Number(res.latitude),
           longitude : Number(res.longitude)
         })
         console.log(that.data.latitude)
         console.log(that.data.longitude)
         var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
         that.setData({
           longitude: gcj02tobd09[0],
           latitude: gcj02tobd09[1]
         })
         console.log(that.data.latitude)
         console.log(that.data.longitude)
        that.getShopCates();
        that.gettuan_goods_list();
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getShopCates();
        that.gettuan_goods_list();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
    wx.stopPullDownRefresh();
  },
  // 点击便民驿站模块
  goTofill_address(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  getlistdata(){
    let that = this;
    let lat = that.data.latitude;
    let lng = that.data.longitude;
    wx.navigateTo({
      url: '/packageA/pages/commoditylist/commoditylist?member_id=' + that.data.member_id + '&lat=' + lat + '&lng=' + lng,
    })
  },
  //前往活动详情
  goToActivity(e) {
    console.log(e)
    let that = this;
    let member_id = that.data.member_id;
    let business_id = e.currentTarget.dataset.business_id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let content_id = e.currentTarget.dataset.content_id;
    let is_tuan = e.currentTarget.dataset.is_tuan;
    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + member_id + "&discount_id=" + discount_id + '&is_tuan=' + is_tuan;
    wx.navigateTo({
      url: url
    })
  },
  goTono(){
    wx.showToast({
      title: '敬请期待...',
      icon:'none'
    })
  }
})