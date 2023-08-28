const app = getApp()
const common = require('../../../assets/js/common');
const QR = require('../../../assets/js/qrcode')
const publicMethod = require('../../../assets/js/publicMethod');
Page({
  data: {
    member_id:'',
    img_url: app.data.imgUrl,
    activityInfo: '',  //获取到的活动信息
    goodnum: '1',  //购买数量
    cfg:'',
    isHelp: 0,
    butType: 0,
    showModel: false,
    ident:0,
    goods_id:'',
    user_id:'',
    canIUseGetUserProfile: false,
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;

    that.setData({
      goods_id:options.id,
      user_id:options.user_id,
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onShow: function(){
    let that = this;
    that.setData({
      user_info: wx.getStorageSync('user_info'),
      member_id : wx.getStorageSync('member_id')
    })
    that.getOneDiscount();
  },
  //获取单个的活动/商品
  getOneDiscount() {
    let that = this;
    let param = {
      member_id: that.data.member_id,
      goods_id: that.data.goods_id,
    }
    common.get("/admin/goods_detail", param).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          activityInfo: res.data.data,
          title: res.data.data.goods_name,
          bal_count: res.data.data.goods_stock,
          price: res.data.data.goods_price,
          hbb: res.data.data.goods_integral,
          total_price: res.data.data.goods_discount_price,
          desc: res.data.data.goods_descript,
          img: res.data.data.goods_image,
        })
        console.log(res.data.data)
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1500,
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        },1500)
      }
    })
  },
  //积分不足提示
  hideModal:function(){
    this.setData({
       showModel: false
    })
  },
  //前去购买
  buyNow() {
    let that = this;
    let user_id = that.data.user_id;
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
      return;
    }
    let param = {
      user_id,
      member_id: that.data.member_id,
      id: that.data.id,
      pay_sum_jifen: (that.data.hbb * that.data.goodnum).toFixed(2),
      pay_count: that.data.goodnum,
      activityInfo: that.data.activityInfo,
    }

    if (param.pay_count < 1) {
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    wx.setStorageSync("toBuyWel_goods", (param));
    wx.navigateTo({
      url: "/packageA/pages/tobuy_commodity/tobuy_commodity?user_id=" + user_id,
    })
    
  },
  inputValue(e) {
    let that = this;
    if ( e.detail.value > (that.data.bal_count - 0) ) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
      })
      wx.showToast({
        title: '超出库存！',
        duration: 1000,
        icon: 'none'
      })
    } 
    else {
      that.setData({
        goodnum: e.detail.value
      })
    }
  },
  minusNum() {
    let that = this;
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
    that.data.goodnum ++;
    if ( that.data.goodnum > (that.data.bal_count - 0) ) {
      that.setData({
        goodnum: (that.data.bal_count - 0)
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
  //关闭好友助力
  closeHelp: function(){
    this.setData({
      isHelp: 0
    })
  },
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
    })
    console.log('取消授权完成')

  },

  //增加积分
  addIntegral: function(){
    let that = this
    common.get("/business/addInteger", {
      member_id: that.data.member_id,
      parent_member_id: that.data.pmid,
      code: that.data.sharecode,
      discount_id: that.data.discount_id
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        wx.showToast({
          title: '助力好友成功!',
          duration: 1000,
          icon: 'success'
        })
        this.setData({
          isHelp: 0
        })
      } else if(res.data.code == 400) {
        that.setData({
          isHelp: 0
        })
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none'
        })
      }
    })
  },
  //好友助力
  help:function(){
    let that = this
    // wx.setStorageSync('member_id', 2);
    that.setData({
      butType: 1
    })
    // 登录
    wx.login({
      success: function (data) {
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      that.setData({
        pop2: true
      })
      // wx.hideTabBar()
    } else {
      that.setData({
        member_id: member_id,
        pop2: false
      })
      that.addIntegral()
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })

  },
  // 保存图片
  saveImage(e) {
    console.log(e)
    wx.showModal({
      content: '确定保存该图片吗？',
      success:function(res){
          if(res.confirm){
            wx.showLoading({
              title: '保存中...',
              mask: true,
            });
            wx.downloadFile({
              url: e.currentTarget.dataset.img,
              success: function (res) {
                console.log(e)
                if (res.statusCode === 200) {
                  let img = res.tempFilePath;
                  wx.saveImageToPhotosAlbum({
                    filePath: img,
                    success(res) {
                      wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000
                      });
                    },
                    fail(res) {
                      wx.showToast({
                        title: '保存失败',
                        icon: 'success',
                        duration: 2000
                      });
                    }
                  });
                }
              }
            });
          }
      }
    })
    
  },
  turnto() {
    let that = this;
    // 获取当前页面栈
    let pageslist = getCurrentPages();
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ 
        url: "/pages/index/index"
      });
    }
  },
  // 分享
  onShareAppMessage: function (res) {
    let that= this
    if (res.from === 'button') {
      let code = new Date().getTime();
      console.log(that.data.user_info.nickName)
      return {
        title: '',
        imageUrl: that.data.img[0],
        path: '',
        success: function (res) {
          that.setData({
            showModel: false
          })
        }
      }
    }
    return {
      title: that.data.title,
      imageUrl: that.data.img[0],
      path: '',
      success: function (res) {
        that.setData({
          showModel: false
        })
      }
    }
  },
  identify_full(){
    wx.navigateTo({
      url: '/pages/mine/identify_full/index?idle_id=' + this.data.idle_id,
    })
  }

})