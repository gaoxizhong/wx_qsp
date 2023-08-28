const app = getApp()
const common = require('../../../assets/js/common');
Page({
  data: {
    memberid:'',
    is_daimai:0,
    img_url: app.data.imgUrl,
    activityInfo: '',  //获取到的活动信息
    goodnum: '1',  //购买数量
    cfg:'',
    isHelp: 0,
    butType: 0,
    showModel: false,
    business_discount_id:0,
    business_id:0,
    ident:0,
    canIUseGetUserProfile: false,
    is_bid: false,
    is_xy: false,
    yk_price:'',
    mobile:'',
    price_list:[], //  出价数组
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if (options.is_daimai) {
      that.setData({
        is_daimai: options.is_daimai,
      })
    }
    if (options.idle_id) {
      that.setData({
        idle_id: options.idle_id,
        member_id: options.member_id,
      })
    }
    if (options.copy_business) {
      that.setData({
        copy_business: options.copy_business,

      })
    }
    that.setData({
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })
    if (options.isHelp) {
      that.setData({
        isHelp: options.isHelp,
        sharecode: options.sharecode,
        pmid: options.pmid
      })
    }
    if (options.business_id) {
      console.log(options)
      that.setData({
        business_id: options.business_id,
      })
    }
    if ( options.discount_id ) {
      that.setData({
        discount_id: options.discount_id
      })
    }
    if (options.content_id) {
      that.setData({
        content_id: options.content_id
      })
    }
    if (options.id) {
      that.setData({
        idle_id: options.id
      })
    }
    
  },
  onShow: function(){
    let that = this;
    that.setData({
      user_info: wx.getStorageSync('user_info'),
      memberid : wx.getStorageSync('member_id')

    })
    that.getOneDiscount();
  },
  //获取单个的活动/商品
  getOneDiscount() {
    let that = this;
    let copy_business = that.data.copy_business;
    console.log(copy_business)
    let param = {
      idle_id: that.data.idle_id,
      member_id: wx.getStorageSync('member_id'),
      copy_business: that.data.copy_business,
    }
    common.get("/idle/idleDetails", param).then( res => {
      if ( res.data.code == 200 ) {

        that.setData({
          activityInfo: res.data.data[0],
          idle_id: res.data.data[0].id,
          price: res.data.data[0].price,
          title: res.data.data[0].title,
          bal_count: res.data.data[0].bal_count,
          discount_price: res.data.data[0].discount_price,
          hbb: res.data.data[0].hbb,
          total_price: res.data.data[0].total_price,
          desc: res.data.data[0].desc? res.data.data[0].desc:'暂无详情',
          img: res.data.data[0].img,
          info: res.data.data[0].info,
          type: res.data.data[0].type,
          is_idle: res.data.data[0].is_idle,
          cfg: res.data.cfg,
          ident: res.data.data[0].ident,
          price_list: res.data.data.price_list
        })
        console.log(res.data.data)
        if ( res.data.data[0].is_idle ){
          
          that.setData({
            business_id: res.data.data[0].business_id
          })

        }
        wx.setStorageSync('delivery', res.data.data[0].delivery)
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1500,
          icon: 'none'
        })
        setTimeout(function() {
          let pageslist = getCurrentPages();
          console.log(pageslist.length);
          if (pageslist && pageslist.length > 1) {
            wx.navigateBack({ delta: -1 });
          } else {
            wx.reLaunch({ url: "/pages/getalllist/getalllist" });
          }

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
    // that.setData({
    //   butType: 0,
    //   is_xy: true
    // })
    let param = {
      member_id:wx.getStorageSync('member_id'),
      business_id: that.data.business_id,
      business_discount_id: that.data.idle_id,
      pay_sum_jifen: (that.data.hbb * that.data.goodnum).toFixed(2),
      pay_count: that.data.goodnum,
      activityInfo: that.data.activityInfo,
      is_idle: that.data.is_idle
    }
    wx.setStorageSync("toBuyWel", (param));
    wx.navigateTo({
      url: "/packageA/pages/idleGroup/needPage/index?is_idle=" + that.data.is_idle + "&id=" + that.data.idle_id + "&business_id=" + that.data.business_id
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
    // else if (e.detail.value < 1){
    //   that.setData({
    //     goodnum: 1
    //   })
    //   wx.showToast({
    //     title: '最少兑换1个！',
    //     duration: 1000,
    //     icon: 'none'
    //   })
    // } 
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
  getUserProfile(){
    let that = this;
    wx.login({
      success: (data) => {
        console.log(data)
        that.setData({
          code: data.code,
        })
      }
    })
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', 
      success: (res) => {
        console.log(res)
        wx.setStorageSync('user_info', res.userInfo);
        that.setData({
          personData: res.userInfo
        })
        common.post('/member/oauth', {
          code: that.data.code,
          encryptedData: res.encryptedData,
          iv: res.iv,
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          gender: res.userInfo.gender,

        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            that.setData({
              member_id: res.data.member_id,
              hasUserInfo: true,
              isAuthorize: false,
              pop2: false
            })
            console.log("授权成功")
            wx.setStorageSync('member_id', res.data.member_id);
            if(res.data.api_token){
              wx.setStorageSync('token', res.data.api_token);
            }

            if (that.data.butType){
              that.addIntegral()
            }else{
              that.buyNow()
            }
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }).catch(e => {
          app.showToast({
            title: "数据异常",
          })
          console.log(e)
        })
        
      }
    })

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
  // saveImage(e) {
  //   console.log(e)
  //   wx.showModal({
  //     content: '确定保存该图片吗？',
  //     success:function(res){
  //         if(res.confirm){
  //           wx.showLoading({
  //             title: '保存中...',
  //             mask: true,
  //           });
  //           wx.downloadFile({
  //             url: e.currentTarget.dataset.img,
  //             success: function (res) {
  //               console.log(e)
  //               if (res.statusCode === 200) {
  //                 let img = res.tempFilePath;
  //                 wx.saveImageToPhotosAlbum({
  //                   filePath: img,
  //                   success(res) {
  //                     wx.showToast({
  //                       title: '保存成功',
  //                       icon: 'success',
  //                       duration: 2000
  //                     });
  //                   },
  //                   fail(res) {
  //                     wx.showToast({
  //                       title: '保存失败',
  //                       icon: 'success',
  //                       duration: 2000
  //                     });
  //                   }
  //                 });
  //               }
  //             }
  //           });
  //         }
  //     }
  //   })
    
  // },
  textPaste(e) {
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  turnto() {
    let that = this
    let pageslist = getCurrentPages();
    let business_id = that.data.copy_business > 0 ? that.data.copy_business : that.data.business_id
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ 
        url: "/pages/getalllist/getalllist"
      });
    }
  },
  // 分享
  onShareAppMessage: function (res) {
    let that= this
    let business_id = that.data.copy_business > 0 ? that.data.copy_business : that.data.business_id

    // if (res.from === 'button') {
    //   let code = new Date().getTime();
    //   console.log(that.data.user_info.nickName)
    //   return {
    //     title: that.data.user_info.nickName + ' 正在使用积分抢购“' + that.data.title + '”，真挚邀请您给他助力',
    //     imageUrl: that.data.img[0],
    //     path: 'pages/mine/myIdle_good/index?member_id=' + that.data.member_id + '&business_id=' + that.data.business_id + '&discount_id=' + that.data.discount_id + '&isHelp=1' + '&sharecode=' + code + '&pmid=' + that.data.member_id + '&copy_business=' + business_id + '&content_id=' + that.data.content_id + '&id=' + that.data.idle_id,
    //     success: function (res) {
    //       that.setData({
    //         showModel: false
    //       })
    //     }
    //   }
    // }
    return {
      title: that.data.title,
      imageUrl: that.data.img[0],
      path: '/packageA/pages/idleDetails_page/index?member_id=' + that.data.member_id + '&business_id=' + that.data.business_id + '&discount_id=' + that.data.discount_id + '&copy_business=' + business_id + '&content_id=' + that.data.content_id + '&id=' + that.data.idle_id,
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
  },

  // 去闲置卖场
  gotoidle(){
    wx.navigateTo({
      url: '/pages/getalllist/getalllist',
    })
  },
  // 出价
  bid_value(e){
    this.setData({
      yk_price:e.detail.value
    })
  },
  isbidBtn(e){
    console.log(e)
    let that = this;
    let idle_id = e.currentTarget.dataset.idle_id;
    let price  = that.data.yk_price;
    let mobile  = that.data.mobile;
    if(price == '' || !price){
      wx.showToast({
        title: '出价不能为空！',
        icon:'none'
      })
      return
    }
    if(mobile == '' || !mobile){
      wx.showToast({
        title: '电话不能为空！',
        icon:'none'
      })
      return
    }
    common.post('/idlegroup/price',{
      member_id:wx.getStorageSync('member_id'),
      price,
      mobile,
      idle_id
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '出价成功!',
          icon:'success'
        })
        that.setData({
          is_bid: false
        })
        that.getOneDiscount();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  isbidMask(){
    this.setData({
      is_bid: false
    })
  },
  
  isbidC(){
    this.setData({
      is_bid: true
    })
  },
  mobile(e){
    this.setData({
      mobile: e.detail.value
    })
  },
  /**调用电话 */
  tel: function (e) {
    let tel = e.currentTarget.dataset.mobile;
    if (tel != null || tel != '') {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    } else {
      app.showToast({
        title: "暂无联系电话",
        icon:'none'
      })
    }
  },
  gotokongjian(){
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id=' + this.data.activityInfo.business_id,
    })
  },
    // 点击闲友头像
    gotoxyIdle(){
      wx.navigateTo({
        url: '/pages/mine/myIdle_baby/index?member_id=' + this.data.activityInfo.business_id,
      });
    },
    isxyMask(){
      this.setData({
        is_xy: false
      })
    }
})