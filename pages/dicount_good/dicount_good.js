const app = getApp()
const common = require('../../assets/js/common');
const QR = require('../../assets/js/qrcode')
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    is_goods:0,
    img_url: app.data.imgUrl,
    activityInfo: '',  //获取到的活动信息
    goodnum: '1',  //购买数量
    cfg:'',
    bought:0,
    isHelp: 0,
    butType: 0,
    showModel: false,
    copy_business:0,
    business_discount_id:0,
    is_idle:0,
    is_welfare:0,
    is_songcai:0,
    is_tuan: 0,
    is_type:'',
    tuan_order_id:'',
    canIUseGetUserProfile: false,
    is_audit:0,
    is_isReset:0,
    is_n:0,
    is_duizhang: 0,
    discount_num: 100,
    daze: 0,
    is_duiyuan:0,
    is_mian: 0,
    activity_id: 0,
    share_id: 0,
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
    is_cxtg_1: 0,
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
    if(options.is_cxtg){ // 持续推广盲盒
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
    if(options.is_blindBox){ // 引流、快速推广盲盒
      that.getaccountnumber();
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        is_houtui: 1
      })
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
    if(options.is_smallacqu){
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
        is_taskShare: options.is_taskShare,
        is_taskShare_1: 1,
        record_id: options.record_id,
      })
      this.getMyRecord();
    }
    if(options.id){
      that.setData({
        activity_id: options.id,
        is_duizhang: options.is_duizhang,
        is_duiyuan: options.is_duiyuan,
        discount_num: options.discount,
        share_id: options.share_id
      })
    }
    if(options.is_mian){
      that.setData({
        is_mian: options.is_mian
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })

    if(options.is_tuan){
      that.setData({
        is_tuan: options.is_tuan
      })
    }
    if(options.is_songcai){
      that.setData({
        is_songcai: options.is_songcai
      })
    }
    if (options.isHelp) {
      that.setData({
        isHelp: options.isHelp,
        sharecode: options.sharecode,
        pmid: options.pmid
      })
    }
    if ( options.business_id ) {
      that.setData({
        business_id: options.business_id,
        copy_business: options.copy_business
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
    if ( options.is_goods == 1 ){
      this.setData({
        is_goods: options.is_goods
      })
    }
    if ( options.is_type == 'join' ){
      this.setData({
        is_type: options.is_type,
        tuan_order_id:options.tuan_order_id
      })
    }
    if(options.is_audit == '1'){
      that.setData({
        is_audit: options.is_audit
      })
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
    console.log(that.data.is_type)
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
  //获取单个的活动/商品
  getOneDiscount() {
    let that = this;
    let param = {
      discount_id: that.data.discount_id,
    }
    if(that.data.tuan_order_id){
      param.tuan_order_id = that.data.tuan_order_id
    }
    common.get("/business/getBusinessDiscount", param).then( res => {
      if ( res.data.code == 200 ) {
        
        that.setData({
          activityInfo: res.data.data[0],
          img: res.data.data[0].img,
          business_id: res.data.data[0].business_id,
          price: res.data.data[0].price,
          title: res.data.data[0].title,
          bal_count: res.data.data[0].bal_count,
          discount_price: res.data.data[0].discount_price?res.data.data[0].discount_price.toFixed(2):0,
          hbb: res.data.data[0].hbb,
          total_price: res.data.data[0].total_price,
          start_time: res.data.data[0].start_time,
          end_time: res.data.data[0].end_time,
          desc: res.data.data[0].desc,
          business_discount_id: res.data.data[0].id,
          info: res.data.data[0].info,
          type: res.data.data[0].type,
          cfg: res.data.cfg,
          bought: res.data.data.bought,
          need_num: res.data.data.need_num,
          is_idle: res.data.data[0].is_idle,
          is_tuan: res.data.data[0].is_tuan,
          is_welfare: res.data.data[0].is_welfare,
          tuan_price: res.data.data[0].tuan_price,
        })
        if(that.data.is_mian){
          that.setData({
            daze: 0,
          })
        }else{
          that.setData({
            daze:Number(res.data.data[0].total_price * that.data.discount_num/100).toFixed(2),
          })
        }
        if ( res.data.data.need_num == 0){
          this.setData({
            is_type: 'mark',
          })
        }
        console.log(res.data.data[0].id)
        wx.setStorageSync('delivery', res.data.data[0].delivery)
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1500,
          icon: 'none'
        })
        // setTimeout(function() {
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // },1500)
      }
      console.log(that.data.is_type)
    })
  },
  //积分不足提示
  hideModal:function(){
    this.setData({
       showModel: false
    })
  },
  //前去购买
  buyNow(e) {
    let that = this;
    let is_yzm = that.data.is_yzm;
    // var is_tuan = e.currentTarget.dataset.is_tuan;
    // var is_duoren = e.currentTarget.dataset.is_duoren;
    var is_type = that.data.is_type;
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
      member_id: wx.getStorageSync('member_id'),
      business_id: that.data.business_id,
      copy_business: that.data.copy_business,
      business_discount_id: that.data.business_discount_id,
      pay_sum_jifen: (that.data.hbb * that.data.goodnum).toFixed(2),
      pay_count: that.data.goodnum,
      activityInfo: that.data.activityInfo,
      is_idle: that.data.is_idle,
      is_welfare: that.data.is_welfare,
      // is_tuan: that.data.is_tuan,
    }
    if(is_yzm){
      param.is_yz = is_yzm;
      param.yz_id = wx.getStorageSync('yz_id');
    }
    // if (is_duoren){
    //   param.is_duoren = is_duoren;
    // }
    if (is_type){
      param.is_type = is_type;
      param.tuan_order_id = that.data.param
    }
    if (param.pay_count < 1) {
      wx.showToast({
        title: '最少兑换1个！',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    common.get("/business/isInteger?is_idle=" + param.is_idle, { 
        "member_id": param.member_id,
        "pay_sum_jifen": param.pay_sum_jifen,
        "is_idle": param.is_idle,
        "is_welfare": param.is_welfare,
        // "is_tuan": param.is_tuan,

      }).then(res => {
      if (res.data.code == 403) {
        that.setData({
          showModel: true
        })
      }else{
        let is_mian = that.data.is_mian;
        let is_duiyuan = that.data.is_duiyuan;
        wx.setStorageSync("toBuyWel", (param));
        let url = "/pages/tobuy_welfare/tobuy_welfare?is_idle=" + param.is_idle + "&business_id=" + param.business_id + "&discount_id=" + that.data.discount_id + "&is_welfare=" + that.data.is_welfare+ "&is_type=" + is_type+ "&tuan_order_id=" + that.data.tuan_order_id + '&is_duizhang=' + that.data.is_duizhang  + '&is_duiyuan=' + is_duiyuan + '&daze=' + that.data.daze + '&is_mian=' + is_mian + '&activity_id=' + that.data.activity_id  + '&share_id=' + that.data.share_id 
        if(is_yzm){
          url = url + '&is_yzm=' + is_yzm;
        }
        wx.navigateTo({
          url,
        })
      }
    }).catch(error => {
      console.log(error);
    })
    
  },
  //确认购买
  confirmToBuy() {
    let that = this;
    let param = {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      copy_business: that.data.copy_business,
      business_discount_id: that.data.business_discount_id,
      pay_sum_jifen: (that.data.hbb * that.data.goodnum).toFixed(2),
      pay_count: that.data.goodnum,
      discount_id: that.data.discount_id
    }
    console.log(param);
    common.get("/business/createDiscountOrder", param).then( res => {
      if ( res.data.code == 200 ) {
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'success'
        })
        setTimeout(function(){
          let url = "/pages/shop/shop?business_id=" + that.data.business_id;
          wx.navigateTo({
            url: url
          })
        },1000)
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none'
        })
      }
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
    console.log(1)
    this.setData({
      isHelp: 0
    })
  },
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
    })
    // wx.reLaunch({
    //   url:'/pages/mine/index/index'
    // })
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
            console.log(wx.getStorageSync('member_id'))
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
              },
              fail() {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            });
          }
      }
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
    let business_id = that.data.copy_business > 0 ? that.data.copy_business : that.data.business_id

    if (res.from === 'button') {
      let code = new Date().getTime();
      console.log(that.data.user_info.nickName)
      return {
        title: that.data.user_info.nickName + ' 正在使用积分抢购“' + that.data.title + '”，真挚邀请您给他助力',
        imageUrl: that.data.img[0],
        path: 'pages/dicount_good/dicount_good?business_id=' + that.data.business_id + '&discount_id=' + that.data.discount_id + '&isHelp=1' + '&sharecode=' + code + '&pmid=' + that.data.member_id + '&copy_business=' + business_id + '&content_id=' + that.data.content_id,
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
      path: 'pages/dicount_good/dicount_good?business_id=' + that.data.business_id + '&discount_id=' + that.data.discount_id + '&copy_business=' + business_id + '&content_id=' + that.data.content_id,
      success: function (res) {
        that.setData({
          showModel: false
        })
      }
    }
  },
  gotoshop(){

    let business_id = this.data.business_id;
    console.log(business_id)
    wx.navigateTo({
        url: '/pages/shop/shop?business_id='+business_id,
    })
  },
  goTobank(){
    wx.reLaunch({
      url: '/pages/bank/bank?fromindex=1',
    })
  },
  // 获取任务分享信息
  getMyRecord(){
    let that = this;
    common.get('/task/index?op=record_detail',{
      record_id: that.data.record_id,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          run: res.data.data.run,
          run_helped: res.data.data.run_helped
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
  // 绿能量集赞功能
  getcreatehelp(){
    let that = this;
    common.get('/task/index?op=create_help',{
      member_id: wx.getStorageSync('member_id'),
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
    let that = this;
    wx.showModal({
      title:'提示',
      content:'请选择',
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