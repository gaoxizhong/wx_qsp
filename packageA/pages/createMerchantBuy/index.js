const app = getApp();
const common = require('../../../assets/js/common');
var QQMapWX = require('../../../assets/js/qqmap-wx-jssdk.min');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type_moving: 0,
    sele_info_moving:'',
    business_id:'',
    exhibitAddress:'', // 地址
    address:'',   // 区域
    distname:'',
    dist:4,
    distance_list:[
      {id:1,name:'不限',dist:10000},
      {id:2,name:'2公里',dist:4},
      {id:3,name:'3公里',dist:6},
      {id:4,name:'5公里',dist:10},
      {id:5,name:'10公里',dist:20},
      {id:6,name:'15公里',dist:30},
      {id:7,name:'20公里',dist:40},
      {id:8,name:'全域',dist:10000},
    ],
    is_dist:2,  // 距离下标
    is_location:true,  // 位置选择box
    is_kilometerItems: false, // 选择公里box
    lat:'', // 记录当前定位
    lng:'', // 记录当前定位
    extAdd:'', // 记录当前定位
    chooseAmountList:[
      {id:1,money:180},
      {id:2,money:600},
      {id:3,money:3000},
      {id:4,money:15000},
    ],
    select_money:0, // 选择金额下标
    money:'',
    inputMoney:'',
    daysItems:[
      {value: '3', name: '3天'},
      {value: '7', name: '7天'},
      {value: '14', name: '14天'},
      {value: '30', name: '30天'},
      {value: '60', name: '60天'},
    ],
    select_time:0,  // 选择的天数
    is_time:0,  // 选择天数得下标
    navItems_active:2,
    navItems:[
      {id:1,name:'店铺位置',image1:'/packageA/assets/images/fastPromote/fastPromote_dm_1.png',image2:'/packageA/assets/images/fastPromote/fastPromote_dm_2.png'},
      {id:2,name:'当前位置',image1:'/packageA/assets/images/fastPromote/fastPromote_dw_1.png',image2:'/packageA/assets/images/fastPromote/fastPromote_dw_2.png'},
      {id:3,name:'地图搜索',image1:'/packageA/assets/images/fastPromote/fastPromote_map_1.png',image2:'/packageA/assets/images/fastPromote/fastPromote_map_2.png'}
    ],
    is_promlines:false,
    is_block: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
     // 禁止右上角转发
     wx.hideShareMenu();
     console.log(options)
    if(options.business_id){
      that.setData({
        business_id: options.business_id
      })
    }
    let chooseAmountList = that.data.chooseAmountList;
    let select_money = that.data.select_money;
    let newchooseAmountList = [];
    chooseAmountList.forEach(el =>{
      newchooseAmountList.push({
        id: el.id,
        money: el.money,
        people: Math.ceil(el.money/0.3)
      })
    })
    that.setData({
      chooseAmountList: newchooseAmountList,
      money: newchooseAmountList[select_money].money
    })
    console.log(that.data.money)

    let daysItems = that.data.daysItems;
    let is_time = that.data.is_time;// 选择天数得下标
    that.setData({
      select_time: daysItems[is_time].value,  // 选择天数
    })

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'MBQBZ-IU4CX-XI34P-75P45-R5O22-XGF67'
    });
    // 获取当前定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude,
          longitude,
        })
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            that.setData({
              exhibitAddress: res.result.address_component.city + res.result.address_component.district + res.result.address_component.street + res.result.address_component.street_number,
              lat:latitude, // 记录当前位置
              lng: longitude, // 记录当前位置
              extAdd: res.result.address_component.city + res.result.address_component.district + res.result.address_component.street + res.result.address_component.street_number, // 记录当前位置
            })
            that.getCurrentInfo(that,that.getFilterlist)
          },
        });
      },
      fail(err) {
        //console.log(err)
        wx.hideLoading({});
        wx.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
    // 禁止右上角转发
    wx.hideShareMenu();
  },
  // 设置推广有效期弹窗
  select_time(e) {
    let that = this;
    let daysItems = that.data.daysItems;
    let is_time = e.currentTarget.dataset.index;
    that.setData({
      is_time,
      select_time:daysItems[is_time].value,
    })
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
    let navItems_active = that.data.navItems_active;
    let is_dist = that.data.is_dist;
    let distance_list = that.data.distance_list;
    let distname = distance_list[is_dist].name;
    let dist = distance_list[is_dist].dist;
    that.setData({
      distname,
      dist,
    })

    if(navItems_active == 3){
      let storeAddress = wx.getStorageSync('storeAddress');
      console.log(storeAddress)
      that.setData({
        storeAddress,
        exhibitAddress:storeAddress.addr,
        latitude: storeAddress.latitude,
        longitude: storeAddress.longitude
      })
    }
    // 获取商品/优惠券数据
    let sele_info_moving = wx.getStorageSync('sele_MerchantBuy_info');
    let select_type_moving = wx.getStorageSync('sele_MerchantBuy_type');
    console.log(select_type_moving)
    that.setData({
      sele_info_moving,
      select_type_moving
    })
    console.log(that.data.sele_info_moving)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('storeAddress', {})
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
  // 点击选择
  navItems(e){
    let that = this;
    let navItems_active = e.currentTarget.dataset.id;
    console.log(navItems_active)
    if(navItems_active == 1){
      // 点击店铺位置按钮
      that.getBusinessInfo();
    }else if(navItems_active == 2){
      // 点击当前位置按钮
      that.getCurrentInfo(that);
    }else if(navItems_active == 3){
      // 点击地图搜索按钮
      wx.navigateTo({
        url: '/packageA/pages/shopMap/index',
      })
    }
    that.setData({
      navItems_active,
    })
  },
    // 点击店面位置按钮 获取地址及店铺坐标
  getBusinessInfo(){
    let that = this;
    common.get("/business/getBusinessInfo", {
      member_id: wx.getStorageSync('member_id'),
      business_id: that.data.business_id,
    }).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        let infoData = res.data.data;
        that.setData({
          infoData,
          exhibitAddress:infoData.address,
          latitude: infoData.latitude,
          longitude: infoData.longitude
        })
      }else{
        console.log(res.data.msg)
      }
    }).catch( error => {
      console.log(error);
    })
  },
    // 获取当前的位置坐标
  getCurrentInfo(t){
    let that = t;
    that.setData({
      latitude: that.data.lat,
      longitude: that.data.lng,
      exhibitAddress: that.data.extAdd
    })
  },
  // 点击筛选距离
  filterDis(){
    this.setData({
      is_location: false,
      is_kilometerItems: true
    })
  },
  // 点击距离选项确定按钮
  distBtn(){
    this.setData({
      is_kilometerItems: false,
      is_location: true,
    })
  },
  // 点击选择距离列表
  select_dist(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let dist = e.currentTarget.dataset.dist;
    let distance_list = that.data.distance_list;
    let distname = distance_list[index].name;
    that.setData({
      distname,
      dist,
      is_dist:index,
      is_duanxin:false,
    })
  },
  select_money(e){
    let that = this;
    let chooseAmountList = that.data.chooseAmountList;
    let index = e.currentTarget.dataset.index;
    if(index > 3){
      that.setData({
        money: ''
      })
    }else{
      that.setData({
        money: chooseAmountList[index].money
      })
    }
    that.setData({
      select_money: index,
    })
    console.log(that.data.money)
  },
  inputMoney(e){
    // if(e.detail.value%3 != 0){
    //   wx.showToast({
    //     title: '请输入3的倍数',
    //     icon: 'none'
    //   })
    //   return
    // }
    this.setData({
      money: e.detail.value
    })
  },
  // 选择商品/优惠券
  gotosele(){
    wx.navigateTo({
      url: '/packageA/pages/tool_choosepages/index?is_merchantBuy=1',
    })
  },

  // 点击开始推广
  fixed_btn(){
    let that = this;
    let business_id = that.data.business_id;
    let total_peop = that.data.total_peop;
    let quota = that.data.money;//  选择额度
    let lng = that.data.longitude;
    let lat = that.data.latitude;
    // 获取商品/优惠券数据
    let sele_info_moving = wx.getStorageSync('sele_MerchantBuy_info'); // 商品、优惠券对象数据
    let select_type_moving = wx.getStorageSync('sele_MerchantBuy_type'); // 商品或者优惠券 1 商品 2 优惠券
    let select_id = sele_info_moving.discount_id || sele_info_moving.id; // 商品或者优惠券id
    let select_time = that.data.select_time; // 推广时间
    let distance = that.data.dist; // 推广距离
    let pream = {
      member_id: wx.getStorageSync('member_id'), // 用户member_id
      business_id,
      quota, //  选择额度
      lng,
      lat,
      address: that.data.exhibitAddress,  // 地址
      order_time: select_time,  // 推广时间
      distance,  // 推广范围
      select_type: select_type_moving, // 商品或者优惠券 1 商品 2 优惠券
      select_id, // 商品或者优惠券id
    }

    if(select_type_moving == 0){
      wx.showToast({
        title: '请先选择推广商品或优惠券',
        icon:'none'
      })
      return
    }
    let is_block = that.data.is_block; 
    if(!is_block){
      return
    }
    that.setData({
      is_block:false,
    })
    common.post("/task/index?op=create_task",pream).then(res =>{
      if(res.data.code == 200){
        wx.setStorageSync('sele_MerchantBuy_info', {});
        wx.setStorageSync('sele_MerchantBuy_type', 0);
        that.setData({
          is_promlines:false,
        })
        wx.showToast({
          title: '发布成功！',
          icon:'none',
          duration: 2000,
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/bank/bank',
          })
        },1500)
        return;
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
        that.setData({
          is_block:true,
        })
      }
    }).catch(e =>{
      that.setData({
        is_block:true
      })
      console.log(e)
    })
  },
  // 扣推广账户金额弹窗蒙层
  is_promlines_layer(){
    let that = this;
    that.setData({
      is_promlines: false,
    })
  },
})