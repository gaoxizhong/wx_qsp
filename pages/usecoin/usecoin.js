
// =========================================
const app = getApp()
const common = require('../../assets/js/common');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupondata:[],
    buy_coupon:false,
    tab_view_id:'3',
    coupon_list:[],
    view_id:0,
    a_coupon:0,
    b_coupon:0,
    is_show:false,
    total_price:0,
    is_true: false,
    class_items_list2:[],
    class_items_list: [],
    longitude: '',
    latitude: '',
  },
  onLoad: function (options) {
    let that = this;
    if( options.tab_id ){
      that.setData({
        tab_view_id:options.tab_id
      })
    }
    if (options.is_comtype == 'qhysq' ) {
      wx.setNavigationBarTitle({
        title:'清河营中路低碳社区'
      })
      that.setData({
        is_comtype: options.is_comtype
      })
    }

    // 禁止右上角转发
    wx.hideShareMenu();
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
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    // 刷新组件
    if(that.data.tab_view_id == '3'){
      this.selectComponent("#test").getWelfareGoods();
    }
    
      // 获取福利券列表
      // that.getmyGiveaway();
      // 获取优惠券列表
      // that.getmycouponlist();
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
  //我的优惠券前往详情页
  goToidleActivity(e) {
    let that = this;
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let url = "/packageA/pages/coupon_detail/index?id=" + id;
    wx.navigateTo({
      url: url
    })
  },
  gotoshop(e){
    let business_id =  e.currentTarget.dataset.business_id;
    let url = "/pages/shop/shop?business_id=" + business_id;
    wx.navigateTo({
      url: url
    })
  },
  tab_view(e){
    let that = this;
    that.setData({
      swiper_data:[],
      text:''
    })
    let tab_view_id = e.currentTarget.dataset.index;
    if(tab_view_id =='1'){
      that.getmyGiveaway();
    }else if(tab_view_id =='2'){
      // that.getmycouponlist();
    }else if(tab_view_id == '4'){
      that.getClassmodule();
    }
    this.setData({
      tab_view_id
    })
  },
  // 获取赠送优惠券list
  getmyGiveaway(){
    let that = this;
    common.get('/content_personal/fuli',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.dcode = 200){
        let swiper_data = res.data.data;
        let a_coupon = res.data.data.length;
        swiper_data.forEach(ele =>{
          ele.anim = 1
        })
        that.setData({
          swiper_data,
          a_coupon,
          is_show:true
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 获取优惠券列表
  getmycouponlist(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/coupon/my_coupon',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.dcode = 200){
        wx.hideLoading();
        that.setData({
          coupon_list:res.data.data,
          b_coupon:res.data.aaa
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  //前往活动详情
  goToActivity(e) {
    console.log(e)
    let that = this;
    let id = '';
    let order_number = '';
    let stock = '';
    if(that.data.tab_view_id == 1){
      id = e.currentTarget.dataset.id;
    }
    if(that.data.tab_view_id == 2){
      id = e.detail.id;
      order_number = e.detail.order_number;
      stock = e.detail.stock;
    }
    let url = "/packageA/pages/coupon_detail/index?order_id=" + id + "&order_number=" + order_number + "&stock=" + stock;
    wx.navigateTo({
      url: url
    })
  },
  xuyao_coupon(){
    let that = this;
    let swiper_data = that.data.swiper_data;
    common.post("/content_personal/pay_yhq",{
      del_id: swiper_data[0].data.del_id,
      coupon_price: swiper_data[0].data.coupon_price,
      coupon_integral: swiper_data[0].data.coupon_integral,
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        that.setData({
          jiage,
        })
        that.getWallet();
        that.change_right();
        that.change();
        let id = swiper_data[0].data.id;
        setTimeout(function(){
          wx.navigateTo({
            url: "/packageA/pages/coupon_detail/index?id=" + id  + '&jiage=' + jiage + '&is_blindBox=1',
          })
        },2000)

        return;
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.getmyGiveaway();
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        cion:'none'
      })
    })
  },
  delt_coupon(){
    let that = this;
    let swiper_data = that.data.swiper_data;
    common.get("/content_personal/byfuli",{
      id: swiper_data[0].data.del_id
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        that.getWallet();
        that.change_left();
        that.change1();
        let id = swiper_data[0].data.id;
        setTimeout(function(){
          wx.navigateTo({
            url: "/packageA/pages/coupon_detail/index?id=" + id  + '&jiage=' + jiage + '&is_blindBox=1',
          })
        },2000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.getmyGiveaway();
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        cion:'none'
      })
    })
    console.log(that.data.swiper_data)
  },
  // 删除动画
  change_left() {
    let that = this;
    let a_coupon = Number(that.data.a_coupon);
    let swiper_data = that.data.swiper_data;
    that.animate('.is-jifen', [
      { opacity: 1, left: '0'},
      { opacity: 0, left: '-544rpx'},
    ], 800, function () {
      setTimeout(function(){
        that.clearAnimation('.is-jifen', function () {
        console.log("清除了.is-jifen上的动画属性")
      })
      swiper_data.splice(0,1);
      that.setData({
        swiper_data,
        a_coupon:a_coupon - 1
      })
        },500)
    }.bind(that)
    )

  },
  // 添加动画
  change_right() {
    let that = this;
    let a_coupon = Number(that.data.a_coupon);
    let b_coupon = Number(that.data.b_coupon);
    let swiper_data = that.data.swiper_data;
    that.animate('.is-jifen', [
      { opacity: 1, left: '30rpx'},
      { opacity: 0, left: '644rpx'},
    ], 1000, function () {
      wx.showToast({
        title: '福利券已经在您的券包内！',
        icon:'none'
      })
      setTimeout(function(){
        that.clearAnimation('.is-jifen', function () {
        console.log("清除了.is-jifen上的动画属性")
      })
      swiper_data.splice(0,1);
      that.setData({
        swiper_data,
        a_coupon:a_coupon - 1,
        b_coupon:b_coupon + 1
      })
        },500)
    }.bind(that)
    )

  },
  // 加0.21元动画
  change() {
    let that = this;
    that.animate('.jia-jifen', [
      { opacity: 0, bottom: '60rpx'},
      { opacity: 1, bottom: '150rpx'},
    ], 100, function () {
      setTimeout(function(){
        that.clearAnimation('.jia-jifen', function () {
        console.log("清除了动画属性")
      })
        },1000)
    }.bind(that)
    )
  },
  // 加0.1元动画
  change1() {
    let that = this;
    that.animate('.jia-jifen2', [
      { opacity: 0, bottom: '60rpx'},
      { opacity: 1, bottom: '150rpx'},
    ], 100, function () {
      setTimeout(function(){
        that.clearAnimation('.jia-jifen2', function () {
        console.log("清除了动画属性")
      })
        },1000)
    }.bind(that)
    )
  },
  goto_usecoin(){
    wx.navigateTo({
      url: '/packageA/pages/my_coupon/index?tab_id=1',
    })
  },
  audit_btn(e){
    let that = this;
    console.log(e)
    let status = e.currentTarget.dataset.status;
    let swiper_data = that.data.swiper_data;
    common.get('/content_personal/audit',{
      status,
      detail_id: swiper_data[0].data.detail_id,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.getWallet();
        if(status == 1){
          let discount_id = swiper_data[0].data.id;
          let business_id = swiper_data[0].data.business_id;
          that.change();
          setTimeout(function(){
            wx.navigateTo({
              url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('memner_id') + "&discount_id=" + discount_id,
            })
          },1500)
        }else if(status == 2){
          that.change_left();
          that.change1();
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        that.getmyGiveaway();
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  getWallet(){
    let that = this;
    common.get("/memberinfo/getWallet",{
      member_id:wx.getStorageSync('member_id')
    }).then(res =>{
      console.log(res.data)
        that.setData({
          total_price: res.data.total_price
        })
    })
  },
    //提现弹出可提现金额模块
    gettxian_btn(e){
      console.log(e)
      let that = this;
      let menber_id = that.data.member_id;
      let url = '/pages/mine/walletChild/index?menber_id=' + menber_id
      wx.navigateTo({
        url: url,
      })
    },
    // 跳转便民驿站
    goToconvenience(){
      wx.navigateTo({
        url: '/packageA/pages/convenience_plate/plate_items/index',
      })
    },
    // =====================   便民服务模块功能以下   ====================
    // 获取模块项目
    getClassmodule(){
      let that = this;
      common.get('/newservice/type', {
        lng: that.data.longitude,
        lat: that.data.latitude,
      }).then(res => {
        if (res.data.code == 200) {
          let class_items = res.data.data.array;
          if(class_items.length > 9){
            that.setData({
              class_items_list: class_items.slice(0,9),
              class_items_list2: class_items.slice(9,class_items.length),
              is_true: true
            })
            
          }else{
            that.setData({
              class_items_list: class_items,
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e => {
        app.showToast({
          title: "数据异常"
        })
      })
    },
    me_become(){
      let that = this;
      wx.navigateTo({
        url: '/packageA/pages/convenience_plate/release_service_info/index',
      })
    },
    // 点击查看更多
    view_more(){
      let that =this;
      let class_items_list = that.data.class_items_list;
      let class_items_list2 = that.data.class_items_list2;
      that.setData({
        class_items_list: class_items_list.concat(class_items_list2),
        is_true: false
      })
    },
    goToclassactical(e){
      let that = this;
      console.log(e)
      let url = e.currentTarget.dataset.url;
      let id = e.currentTarget.dataset.id;

      if(!url){
        wx.navigateTo({
          url: '/packageA/pages/convenience_plate/plate_lists/index?id=' + id,
        })
      }else{
        wx.navigateTo({
          url,
        })
      }
    },
    // =====================   便民服务模块功能以上   ====================

})