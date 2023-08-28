const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
    id:'',
    img_url: app.data.imgUrl,
    activityInfo: '',  //获取到的活动信息
    goodnum: '1',  //购买数量
    cfg:'',
    bought:0,
    isHelp: 0,
    butType: 0,
    copy_business:0,
    business_discount_id:0,
    is_type:'',
    tuan_order_id:'',
    pay_name:'',
    pay_mobile:'',
    is_infos:false,
    business_id:'',
    stock:'',
    canIUseGetUserProfile: false,
    is_isReset:0,
    is_n:0,
    is_blindBox: 0,
    jiage:'0.00',
    is_tx:0,
    is_taskShare:0,  // 收购任务集赞部分
    is_taskShare_1:0, // 收购任务集赞部分图标显示
    is_smallacqu:0,  // 小量收购部分
    is_smallacqu_1:0, // 小量收购图标显示
    is_blindBox_1:0, // 盲盒图标显示
    money:0,
    run:{},
    is_taskShare_s: true,
    is_cxtg:0,
    is_cxtg_1:0,
    integral: 0,
    // 进度条动画数据
    bar_number: 2,
    djs_number: 5,
    bar_text: '',
    tb_leflt: -2,
    is_progress: false,
    timer:{}, // 进度条
    djs_timer:{},   // 倒计时
    run_helped: false,
    is_yzm: 0
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;
    if(options.is_yzm){
      that.setData({
        is_yzm: options.is_yzm
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if(options.is_cxtg){
      // that.setData({
      //   is_cxtg:options.is_cxtg,
      //   integral: options.integral
      // })
      that.setData({
        is_cxtg_1: 1,
        bar_text: '点赞有收益 正在给您计算收益...'
      })
      let progressBar = {
        that: that,
        text: '盲盒打开成功！',
        tag: 'is_cxtg',
        integral: options.integral
      }
      publicMethod.progress_bar(progressBar);
    }
    if(options.is_isReset){
      that.setData({
        is_isReset: options.is_isReset
      })
    }
    if(options.is_blindBox){   // 拆盲盒
      that.getaccountnumber();
      // that.setData({
      //   is_blindBox: options.is_blindBox,
      //   jiage: options.jiage
      // })
      that.setData({
        is_tx: options.is_tx?options.is_tx:0,
        is_blindBox_1: 1,
        bar_text: options.is_tx?'环保积分正在兑换，请稍后...':'正在打开盲盒，请稍候...'
      })
      let progressBar = {
        that: that,
        text: options.is_tx?'积分兑换成功！':'盲盒打开成功！',
        tag: 'is_blindBox',
        jiage: options.jiage,
      }
      publicMethod.progress_bar(progressBar);
    }
    if(options.is_smallacqu){  // 小量收购
      // this.setData({
      //   is_smallacqu: options.is_smallacqu,
      //   jiage: options.jiage
      // })
      // this.jine();
      that.setData({
        is_smallacqu_1: 1,
        bar_text: '正在交易，请稍候...'
      })
      let progressBar = {
        that: that,
        text: '交易成功！',
        tag: 'is_smallacqu',
        jiage: options.jiage,
        f: that.jine
      }
      publicMethod.progress_bar(progressBar);
    }
    if(options.is_taskShare){
      this.setData({
        is_taskShare_1: 1,
        is_taskShare: options.is_taskShare,
        record_id: options.record_id,
      })
      this.getMyRecord();
    }

    if(options.is_n){
      that.setData({
        is_n: options.is_n
      })
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        is_circle: 1
      })
    }
    that.setData({
      id:options.id,
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })
    if(options.order_id){
      that.setData({
        id: options.order_id,
        order_number: options.order_number,
        stock: options.stock, 
      })
    }
  },
  // 获取环保银行账户详情
  getaccountnumber(){
    let that = this;
    common.get("/environmental/bank/environmentalBankHome", {
      member_id: wx.getStorageSync('member_id'),
      type: 8
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          realAmount: Number(res.data.data.realAmount),
          jf: res.data.data.jf,
          df: res.data.data.df,
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },
  jine() {
    let that = this;
    common.get('/memberinfo/indexWithdraw', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      console.log(res)
      that.setData({
        money: res.data.data.balance,
      })
    }).catch(e => {
      app.showToast({
        title: "错误",
      })
      console.log(e)
    })
  },
  onShow: function(){
    let that = this;
    that.setData({
      user_info: wx.getStorageSync('user_info'),
    })
    if(that.data.is_isReset == 1){
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        isReset: 1,
      })
    }
    that.getOneDiscount();
  },
  //获取单个的活动/商品
  getOneDiscount() {
    let that = this;
    let param = {
      id:that.data.id,
    }
    common.get("/coupon/details", param).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          activityInfo: res.data.data[0],
          bal_count: res.data.data[0].stock,
          business_id: res.data.data[0].business_id,
        })

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
  getpay_name(e){
    this.setData({
      pay_name:e.detail.value
    })
  },
  getpay_mobile(e){
    this.setData({
      pay_mobile:e.detail.value
    })
  },
  //前去购买
  buyNow1(){
    let that = this;
    let is_phone = that.data.activityInfo.is_phone;
    if(Number(is_phone) == 1){
      that.setData({
        is_infos:true
      })
    }else if(Number(is_phone) == 2 || !is_phone){
      that.buyNow();
    }

  },
  hidden_infos(){
    let that = this;
    that.setData({
      is_infos:false
    })
  },
  buyNow(e) {
    let that = this;
    let pay_name = that.data.pay_name;
    let pay_mobile = that.data.pay_mobile;
    let is_phone = that.data.activityInfo.is_phone;
    let is_yzm = that.data.is_yzm;

    console.log(e)
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
      that.setData({
        pop2: true
      })
      return;
    }
    let param = {
      id:that.data.id,
      member_id: that.data.member_id,
      business_id: that.data.activityInfo.business_id,
      name: that.data.activityInfo.name,
      price: that.data.activityInfo.price,
      current_price: that.data.activityInfo.current_price,
      coupon_price: (that.data.activityInfo.coupon_price * that.data.goodnum ).toFixed(2),
      pay_sum_jifen: (that.data.activityInfo.coupon_integral * that.data.goodnum).toFixed(2),
      stock: that.data.goodnum,
    }
    if(is_yzm){
      param.is_yz = is_yzm;
      param.yz_id = wx.getStorageSync('yz_id');
    }
    if(Number(is_phone) == 1){
      param.pay_name = pay_name;
      param.pay_mobile = pay_mobile;
      if(!param.pay_name || param.pay_name == ''){
        wx.showToast({
          title: '请填写姓名！',
          duration: 1000,
          icon: 'none'
        })
        return;
      }
      if(!param.pay_mobile || param.pay_mobile == ''){
        wx.showToast({
          title: '请填写电话！',
          duration: 1000,
          icon: 'none'
        })
        return;
      }
    }

    if (param.stock < 1) {
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    common.get("/business/isInteger", {
      "member_id": param.member_id,
      "pay_sum_jifen": param.pay_sum_jifen,
    }).then(res => {
      if (res.data.code == 403) {
        wx.showToast({
          title: res.data.msg + '请先赚取积分',
          icon:'none'
        })
        that.setData({
          is_infos:false
        })
      }else{
        common.get("/coupon/pay_coupon", param).then(res => {
          if(res.data.code == 200){
            wx.hideLoading()
            if (res.data.data != '') {
              var $config = res.data.data
              wx.requestPayment({
                timeStamp: $config['timeStamp'], //注意 timeStamp 的格式
                nonceStr: $config['nonceStr'],
                package: $config['package'],
                signType: $config['signType'],
                paySign: $config['paySign'], // 支付签名
                success: function (res) {
                  // 支付成功后的回调函数
                  wx.showToast({
                    title: '支付成功',
                    duration: 1000,
                    icon: 'success'
                  })
                  setTimeout(function () {
                    that.setData({
                      is_infos:false
                    })
                    if(is_yzm){
                      wx.reLaunch({
                        url: 'packageB/pages/postStationCode/index',
                      })
                    }else{
                      wx.navigateTo({
                        url: '/packageA/pages/coupon_buy_success/index'
                      })
                    }
                  }, 1000)
                  return;
                },
                fail: function (e) {
                  console.log(e)
                  that.setData({
                    is_infos:false
                  })
                  wx.showToast({
                    title: '支付失败！',
                    duration: 1000,
                    icon: 'none'
                  })
                  return;
                }
               
              });
            } else {
  
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'success'
              })
              setTimeout(function () {
                that.setData({
                  is_infos:false
                })
                if(is_yzm){
                  wx.reLaunch({
                    url: 'packageB/pages/postStationCode/index',
                  })
                }else{
                  wx.navigateTo({
                    url: '/packageA/pages/coupon_buy_success/index'
                  })
                }
              }, 1000)
            }
          }else if(res.data.code == 403) {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
          that.setData({
            is_infos:false
          })
        }else{
          that.setData({
            is_infos:false
          })
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(error => {
        that.setData({
          is_infos:false
        })
        console.log(error);
      })
      }
    }).catch(e =>{
      console.log(e)
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
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
    })

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
              pop2: false
            })
            console.log("授权成功")
            wx.showTabBar()
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
    let that = this;
    let is_blindBox = that.data.is_blindBox;
    let is_tx = that.data.is_tx;
    let pageslist = getCurrentPages();
    let business_id = that.data.business_id;
    if (pageslist && pageslist.length > 1) {
      if(that.data.is_audit == '1' && !is_tx || is_blindBox == '1' && !is_tx){
        console.log(2)
        wx.navigateBack({ delta: 2 });
      }else{
        console.log(1)
        wx.navigateBack({ delta: 1 });
      }
    } else {
      wx.reLaunch({ 
        url: "/pages/shop/shop?business_id=" + that.data.business_id
      });
    }
  },
  onShareAppMessage: function (res) {
    let that= this
    let business_id = that.data.activityInfo.business_id;
    let id = that.data.activityInfo.id;
    return {
      title: that.data.activityInfo.name,
      imageUrl: that.data.activityInfo.thumb[0],
      path: '/packageA/pages/coupon_detail/index?business_id=' + business_id + '&id=' + id,
      success: function (res) {
        that.setData({
          showModel: false
        })
      }
    }
  },
  gotoshop(){
    let that = this;
    let business_id = that.data.business_id;
    wx.navigateTo({
        url: '/pages/shop/shop?business_id='+business_id,
    })
  },
  use_btn(){
    let that = this;
    let id = that.data.id;
    let order_number = that.data.order_number;
    wx.showModal({
      cancelColor: '#666',
      content:'确定核销吗？',
      confirmText:'确定',
      cancelText:'取消',
      success (res) {
        if(res.confirm){
          common.get("/coupon/use_my_coupon",{
            id,
            order_number,
            member_id:wx.getStorageSync('member_id'),
          }).then( res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '核销成功',
                icon:'success'
              })
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              },1500)
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          }).catch(e=>{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          })
        }else{

        }
      }
    })
  },
  //提现弹出可提现金额模块
  gettxian_btn(e){
    console.log(e)
    let that = this;
    let menber_id = wx.getStorageSync('member_id');
    let url = '/pages/mine/walletChild/index?menber_id=' + menber_id
    wx.navigateTo({
      url: url,
    })
  },
  // 获取任务分享信息
  getMyRecord(){
    let that = this;
    common.get('/task/index?op=record_detail',{
      record_id: that.data.record_id,
      run_helped: res.data.data.run_helped
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          run: res.data.data.run
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
  // 点击绿能量按钮
  getcreatehelp(){
    let that = this;
    common.get('/task/index?op=create_help',{
      member_id: wx.getStorageSync('memer_id'),
      record_id: that.data.record_id,
    }).then(res =>{
      if(res.data.code == '200'){
        that.setData({
          is_taskShare: false,
          bar_text: '正在输出绿能量，请稍候...',
        })
        let progressBar = {
          that: that,
          text: '绿能量收集完成！',
          tag: 'is_taskShare',
          integral: '',
          // f: that.getMyRecord
        }
        publicMethod.progress_bar(progressBar);
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
  // 点击我也去参加
  gototasklist(){
    wx.showModal({
      title:'提示',
      content:'请选择',
      cancelColor: '#ff0000',
      cancelText:'个人参与',
      confirmText:'企业参与',
      success: function (res) {
        if (res.confirm) {
          //企业
          wx.reLaunch({
            url: '/packageA/pages/merchant_entrance/index',
          })
        } else {
          // 个人
          wx.reLaunch({
            url: '/pages/bank/bank',
          })
        }
      }
    })
  },


})