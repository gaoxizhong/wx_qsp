const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const zhuan_dingwei = require('../../../assets/js/dingwei');
Page({
  data: {
    img_url: app.data.imgUrl,
    goodInfo: '',  //福利商品详情
    goodnum:1,
    total_price:0,
    hbb:0,
    goods_name:'',
    savaStatus: true,
    butType: 0,
    personData:'',
    showModel: false,
    welfare_goods:{},
    is_notice:false,
    business_id:'',
    member_id:'',
    discount_id:'',
    latitude: '',
    longitude: '',
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
    if (options.goodid) {
      that.setData({
        business_id: options.business_id,
        discount_id : options.goodid,
      })
    }
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    that.getBusinessDiscount();
  },
  onShow: function() {
    let that = this;
    that.setData({
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
    })
  },

  inputValue(e) {
    let that = this;
    return
    if ( e.detail.value > (that.data.goodInfo.stock - 0) ) {
      that.setData({
        goodnum: (that.data.goodInfo.stock - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    } else if (e.detail.value < 1){
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: e.detail.value
      })
    }
  },
  minusNum() {
    let that = this;
    wx.showToast({
      title: '不可修改数量',
      icon:'none'
    })
    return
    that.data.goodnum --;
    if (that.data.goodnum < 1) {
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  addNum() {
    let that = this;
    wx.showToast({
      title: '不可修改数量',
      icon:'none'
    })
    return
    that.data.goodnum ++;
    if ( that.data.goodnum > (that.data.goodInfo.stock - 0) ) {
      that.setData({
        goodnum: (that.data.goodInfo.stock - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  //积分不足提示
  hideModal:function(){
    this.setData({
        showModel: false
    })
  },
  //购买按钮
  buyNow() {
    let that = this;
    that.setData({
      butType: 0
    })
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      publicMethod.gotoLoginMark();
      return
    }
    common.get("/business/isInteger", { 
      "member_id": wx.getStorageSync('member_id'),
      "pay_sum_jifen": that.data.goodInfo.hbb,
      "business_id": that.data.goodInfo.business_id,
      "buy_like": that.data.goodInfo.buy_like,
      "discount_id" : that.data.goodInfo.id,
      "longitude" : that.data.longitude,
      "latitude" : that.data.latitude,
    }).then(res => {
    if (res.data.code == 403) {
      wx.showToast({
        title: '积分不足请先去赚取积分！',
        icon:'none',
        duration: 2000
      })
      return
    }else if(res.data.code == 202){
      wx.showToast({
        title: '今日获赞数量不够，请先去分享动态获取点赞！',
        icon:'none',
        duration: 2000
      })
      return
    }else{
      let welfare_goods = that.data.goodInfo;
      wx.setStorageSync('praise_welfare_goods', welfare_goods);
      wx.navigateTo({
        url: '/packageA/pages/praise_welfarebuy/index',
      })
    }
  }).catch(error => {
    console.log(error);
  })

  },
  onHide() {
  },
  onUnload() {
  },
  goTobank(){
    wx.reLaunch({
      url: '/pages/bank/bank?fromindex=1',
    })
  },
  goto_circle(){
    let that = this;
    that.setData({
      is_notice:true
    })
  },
  notice_btn(){
    let that = this;
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id='+ wx.getStorageSync('member_id'),
    })
    that.setData({
      is_notice:false
    })
  },
  click_marek(){
    let that = this;
    that.setData({
      is_notice:false
    })
  },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/index/index" });
    }
  },
  // 分享
  onShareAppMessage: function (res) {
    let that= this;
    let url = "/packageA/pages/praise_welfaredetail/index?goodid="+ that.data.goodInfo.id + "&business_id=" + that.data.goodInfo.business_id;
    return {
      title: that.data.goods_name,
      imageUrl: that.data.goodInfo.img[0],
      path: url,
      success: function (res) {
       
      }
    }
  },
  getBusinessDiscount(){
    let that = this;
    let param = {
      business_id: that.data.business_id,
      discount_id: that.data.discount_id,
      member_id: wx.getStorageSync('member_id'),
    }
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1],
        })
        param.longitude= gcj02tobd09[0];
        param.latitude= gcj02tobd09[1];
        common.get("/business/getBusinessDiscount", param ).then(res => {  
          console.log(res);
          if ( res.data.code == 200 ) {
            that.setData({
              goodInfo: res.data.data[0],
              total_price: res.data.data[0].total_price,
              hbb: res.data.data[0].hbb,
              goods_name: res.data.data[0].title
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              duration: 1000
            })
            setTimeout(()=>{
              wx.navigateBack(1);
            },1000)
          }
        }).catch( error => {
          console.log(error);
        })
      },
      fail: function(res) {
        console.log('未获取到定位')
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          publicMethod.openSetting(that)
        }
      }
    })

  }
})