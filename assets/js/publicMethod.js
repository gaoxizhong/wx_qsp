const common = require('common');
const setting = require('setting');
const zhuan_dingwei = require('dingwei.js');
const QQMapWX = require('qqmap-wx-jssdk.min');
const app = getApp();

let qqmapsdk;
let publicMethod = {
  getConfig(t) { //全局配置
    let that = t
    common.get('/memberinfo/config').then(res => {
      console.log("全局配置")
      console.log(res)
      that.setData({
        configData: res.data
      })
      wx.setStorageSync('configData', res.data)
    }).catch(e => {
      // app.showToast({
      //   title: "数据异常"
      // })
      console.log(e)
    })
  },
  getUnreadNum(t) { //未读
    let that = t
    common.get('/chat/getUnreadNum', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("未读")
      console.log(res)
      setTimeout(() => {
        that.setData({
          unData: res.data.data
        })
      }, 500)
    }).catch(e => {
      // app.showToast({
      //   title: "数据异常",
      // })
      console.log(e)
    })
  },
  guanzhus(e, t, f) { //关注

    this.getFormId(e, t)
    let that = t;
    if (!that.data.member_id) {
      this.showLoginConfirm(t);
      return;
    }
    let id = e.currentTarget.dataset.id;
    let business_id = e.currentTarget.dataset.business_id;
    let data = that.data.privilege_list;
    let idx = e.currentTarget.dataset.idx;
    let type;
    if (business_id != 0) {
      type = 1
    } else {
      type = 2
    }
    common.post('/memberinfo/clickConcern', {
      member_id: that.data.member_id,
      be_member_id: id,
      type
    }).then(res => {

      console.log("关注")
      console.log(res)
      if (typeof f == 'function') {
        f(res);
      }
      if (res.data.code == 200) {
        let arr = [];
        for (let i in data) {
          if (type == 1) {
            if (data[idx].member_id == data[i].member_id && data[i].business_id != 0) {
              arr.push(i)
            }
          } else if (type == 2) {
            if (data[idx].member_id == data[i].member_id && data[i].business_id == 0) {
              arr.push(i)
            }
          }
          // if (data[idx].member_id == data[i].member_id) {
          //   arr.push(i)
          // }
        }
        for (let i in arr) {
          if (res.data.msg == "已关注") {
            data[arr[i]].is_concern = 1
          } else {
            data[arr[i]].is_concern = 0
          }
        }
        that.setData({
          privilege_list: data
        })

      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  guanzhu(e, t, f) { //关注

    this.getFormId(e, t)
    let that = t;
    if ( !that.data.member_id ) {
      this.showLoginConfirm(t);
      return;
    }
    let id = e.currentTarget.dataset.id;
    let business_id = e.currentTarget.dataset.business_id;
    let data = that.data.wenzData;
    let idx = e.currentTarget.dataset.idx;
    let type;
    if (business_id != 0) {
      type = 1
    } else {
      type = 2
    }
    common.post('/memberinfo/clickConcern', {
      member_id: that.data.member_id,
      be_member_id: id,
      type
    }).then(res => {

      console.log("关注")
      console.log(res)
      if ( typeof f == 'function' ) {
        f(res);
      }
      if (res.data.code == 200) {
        let arr = [];
        for (let i in data) {
          if ( type == 1 ) {
            if (data[idx].member_id == data[i].member_id && data[i].business_id != 0) {
              arr.push(i)
            }
          } else if ( type == 2 ) {
            if (data[idx].member_id == data[i].member_id && data[i].business_id == 0) {
              arr.push(i)
            }
          }
          // if (data[idx].member_id == data[i].member_id) {
          //   arr.push(i)
          // }
        }
        for (let i in arr) {
          if (res.data.msg == "已关注") {
            data[arr[i]].is_concern = 1
          } else {
            data[arr[i]].is_concern = 0
          }
        }
        that.setData({
          wenzData: data
        })

      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  openFun(e, t) { 
    this.getFormId(e, t)
    let that = t
    let ind = e.currentTarget.dataset.curindex
    // wx.hideTabBar()
    that.setData({
      ind,
      popidx: ind,
      pop3: !that.data.pop3
    })
  },
  callTel(e, t) { //拨打电话
    this.getFormId(e, t)
    let that = t;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
      complete: function() {
        wx.showTabBar()
        that.setData({
          popidx: false,
          pop3: false
        })
      }
    })
  },
  openFulltxt(e, t) { //打开全文
    let that = t;
    console.log(e)
    let curIdx = e.currentTarget.dataset.curidx;
    that.data.showFull[curIdx].status = !that.data.showFull[curIdx].status
    that.setData({
      showFull: that.data.showFull
    })
  },
  previewImage(e, t) { //图片预览
    console.log(that.data.wenzData)
    let that = t
    var curIndex = e.target.dataset.curindex;
    var subIndex = e.target.dataset.subidx;
    var imgUrls = [];
    for (var i in that.data.wenzData[curIndex].images) {
      imgUrls.push(that.data.wenzData[curIndex].images[i].url)
    }
    wx.previewImage({
      current: that.data.wenzData[curIndex].images[subIndex].url, // 当前显示图片的http链接  
      urls: imgUrls // 需要预览的图片http链接列表  
    })
  },
  delCircle(e, t) { //删除图文
    let that = t;
    let id = e.currentTarget.dataset.id;
    let curIdx = e.currentTarget.dataset.curidx;
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          common.get('/content/selfDelete', {
            member_id: that.data.member_id,
            id
          }).then(res => {

            console.log("删除图文")
            console.log(res)
            if (res.data.code == 200) {
              that.setData({
                popidx: false,
                pop3: false
              })
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
              let data = that.data.wenzData
              data.splice(curIdx, 1)
              if (data.length <= 0) {
                that.setData({
                  dataStatus: true
                })
              }
              that.setData({
                wenzData: data
              })
              // that.onLoad();
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })

  },
  delCircleidle(e, t) { //删除闲置
    let that = t;
    let discount_id = e.currentTarget.dataset.id;
    let curIdx = e.currentTarget.dataset.curidx;
    let content_id = e.currentTarget.dataset.content_id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          common.get('/idle/idleDelete', {
            member_id: that.data.member_id,
            discount_id,
            content_id
          }).then(res => {
            if (res.data.code == 200) {
              that.setData({
                popidx: false,
                pop3: false
              })
              let data = that.data.xianData
              data.splice(curIdx, 1)
              if (data.length <= 0) {
                that.setData({
                  dataStatu: true
                })
              }
              that.setData({
                xianData: data
              })
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })

  },
  delCirclecoupon(e, t) { //删除优惠券
    let that = t;
    let id = e.currentTarget.dataset.id;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          common.get('/coupon/delete', {
            member_id: that.data.member_id,
            id,
          }).then(res => {
            if (res.data.code == 200) {
              that.setData({
                popidx: false,
                pop3: false
              })
              let data = that.data.xianData
              data.splice(curIdx, 1)
              if (data.length <= 0) {
                that.setData({
                  dataStatu: true
                })
              }
              that.setData({
                xianData: data
              })
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })
  },
  loadMore(e, t) { //加载更多评论
    let that = t
    let idx = e.currentTarget.dataset.curindex
    let page1 = that.data.page1[idx]
    page1++
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/content/loadMore', {
      content_id: that.data.wenzData[idx].id,
      page: page1
    }).then(res => {

      wx.hideLoading()
      console.log("加载评论")
      console.log(res)
      if (res.data.code == 200) {
        if (res.data.data.length <= 0) {
          // var a = `page1[${idx}]`
          // that.setData({
          //   [a]: page1
          // })
          that.data.loadend[idx] = !that.data.loadend[idx]
          that.setData({
            loadend: that.data.loadend
          })
          return
        }

        let wenzData = that.data.wenzData;
        let comments = wenzData[idx].comments;
        let obj = res.data.data
        for (var i in obj) {
          comments.push(obj[i])
        }
        var a = `page1[${idx}]`
        that.setData({
          wenzData,
          [a]: page1
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  hfComment(e, t) { //回复评论
    let that = t;
    let inpPlaceholder = '回复' + e[1] + ':';
    that.setData({
      inpPlaceholder,
      hfStatus: 1,
      pop1: true
    })
  },
  openComment(e, t) { //打开评论弹框
    let that = t
    this.showLoginConfirm(t);
    that.setData({
      hfStatus: 0,
      pop1: true
    })
  },
  bindTextChange(e, t) { //留言val
    let that = t
    that.setData({
      textVal: e.detail.value
    })
  },
  sendComment(e, t) { //评论
    let that = t
    let savaStatus = that.data.savaStatus
    let hfStatus = that.data.hfStatus
    if (!savaStatus) {
      return
    }
    if (that.data.textVal == '' || that.data.textVal == null) return;
    that.setData({
      savaStatus: false
    })

    let params = {
      member_id: that.data.member_id,  //当前评论的id
      content_id: that.data.contentid,  //文章的id
      content: that.data.textVal,  //留言内容
    }

    let obj = {
      "content": that.data.textVal,
      "other_id": that.data.member_id,
    };

    if (hfStatus == 1) { //回复评论
      params.replay_member_id = that.data.replay_member_id
    }

    common.post('/content/comment', params).then(res => {
      that.setData({
        savaStatus: true
      })
      if (res.data.code == 200) {
        comments.push(obj)
        that.setData({
          pop1: app.globalData.pop1,
          textVal: '',
          inpPlaceholder: '发表评论',
          comment_page: 1,
          commentList: [],
        })
        that.getComments();
      }else {
        comments.push(obj)

        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
   //点赞
   like(e, t,_app) {
    let that = t;
    let app = _app;
    let lat = that.data.latitude;
    let lng = that.data.longitude;
    let is_shake = e.currentTarget.dataset.is_shake; 
    let source = e.currentTarget.dataset.source;
    let business_id =  e.currentTarget.dataset.business_id;
    let is_like =  e.currentTarget.dataset.is_like; // 判断点的哪个按钮
    if ( !that.data.member_id ) {
      return;
    }
//  ======================== 新增重复点击判断提示 =============== 
    let like_status = that.data.like_status;
    if(!like_status){
      wx.showToast({
        title: is_like == '2'?'请勿频繁点击！':'加载中...请勿重复点击！',
        icon:'none'
      })
      return
    }
    that.setData({
      like_status: false
    })
// ======================== 新增重复点击判断提示 =============== 
    let ind = e.currentTarget.dataset.curindex;

    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    common.get('/content/praise', {
      member_id: that.data.member_id,
      content_id: e.currentTarget.dataset.zxid,
      lat,
      lng,
      is_shake,
      is_like,
    }).then(res => {
      wx.hideLoading();
      if(res.data.code == 200){
        let wenzData = that.data.wenzData;
        publicMethod.gotosetint_transac(that);
        let tefused = res.data.tefused;
        let judge = res.data.judge;
        wenzData[ind].laud_count = parseFloat(that.data.wenzData[ind].laud_count) + 1;
        wenzData[ind].laud_status = 1;
        that.setData({
          wenzData,
          pop_integral: 1
        })

        // if(is_like != '3'){
        //   wx.showToast({
        //     title:res.data.msg,
        //     icon:'none',
        //     duration: 2000
        //   })
        // }
// =============================== ↓ =====================================
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          complete (res) { 
            //  快速推广弹窗功能
            // tefused：是否允许推广 1 :允许  2: 拒绝  0: 未选择
            if(tefused == 2){
              console.log('2: 拒绝')
              that.setData({
                like_status: true
              })
              return
            }else{
              // 引流模式
              if(source == 200 || source == 201|| source == 203){
                console.log('引流模式')
                let select_id = e.currentTarget.dataset.select_id;
                let select_type =  e.currentTarget.dataset.select_type;
                let traffic_id =  e.currentTarget.dataset.traffic_id;
                // 推广引流
                wx.setStorageSync('isReset', 0);
              // ==============================  新改 ---  直接拆盲盒 ---  跳转详情页 ============================
                // 拆盲盒  --- 跳转商品、优惠券详情页  
                publicMethod.blindbox_btn(that,select_type,select_id,traffic_id);
              // ==============================  新改 ---  直接拆盲盒 ---  跳转详情页 ============================

                // 跳转拆盲盒页面
                // wx.navigateTo({
                //   url: '/packageA/pages/blindBox/index?select_type=' + select_type + '&select_id=' + select_id + '&traffic_id=' + traffic_id,
                // })
              }else{
                // 快速推广
                if(judge == '1'){
                  console.log('快速推广')
                  common.get('/content_personal/fuli',{
                    member_id: wx.getStorageSync('member_id'),
                    business_id,
                    is_like,
                  }).then(res =>{
                    if(res.data.code == 200){
                      console.log(res.data.data)
                      let swiper_data = res.data.data[0]?res.data.data[0]:{};
                      // ==============================  新改 ---  直接拆盲盒 ---  跳转详情页 ============================
                      // swiper_data.tab.select_type == '1'?'audit_btn':'xuyao_coupon'
                        if(swiper_data.tab.select_type == '1'){
                          //  商品的广告
                          publicMethod.audit_btn(that,swiper_data.data.detail_id,swiper_data.data.id,swiper_data.data.business_id)
                        }else{
                          //  优惠券的广告
                          publicMethod.xuyao_coupon(that,swiper_data.data.del_id,swiper_data.data.id)
                        }
                      // ==============================  新改 ---  直接拆盲盒 ---  跳转详情页 ============================

                      //   app.data.confirm_coupons = swiper_data;
                      //   wx.setStorageSync('isReset', 0);
                      //   // 跳转拆盲盒
                      //   wx.navigateTo({
                      //     url: '/packageA/pages/blindBox/index?is_judge=1',
                      //   })
                    }else{
                      wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                      })
                      that.setData({
                        like_status: true
                      })
                    }
                  }).catch(e =>{
                    that.setData({
                      like_status: true
                    })
                    wx.hideLoading();
                    console.log(e)
                  })
                  return 
                }
                // 持续推广弹窗
                if(judge == '2'){
                  console.log('持续推广弹窗')
                  that.setData({
                    like_status: true
                  })
                  if(tefused == 0){
                    wx.setStorageSync('isReset', 1);
                    publicMethod.popAd_integral(that,lat,lng,1,1);
                    return 
                  }else if(tefused == 1){
                    wx.setStorageSync('isReset', 0);
                    publicMethod.popAd_integral(that,lat,lng,1,1);
                    return 
                  }
                  return 
                }
              }
            }
          },
        })  
// ================================= ↑ =======================================
      }else{
        // 这是 推广商品 直接点击查看详情按钮
        if(is_like == '1'){
          let select_id = e.currentTarget.dataset.select_id;
          let select_type =  e.currentTarget.dataset.select_type;
          if(select_type == '1'){
            wx.navigateTo({
              url: '/pages/dicount_good/dicount_good?discount_id='+ select_id + '&is_n=1',
            })
          }else if(select_type == '2'){
            wx.navigateTo({
              url: '/packageA/pages/coupon_detail/index?id='+ select_id + '&is_n=1',
            })
          }
        }else{
          wx.showToast({
            title: is_shake == 1?'已摇过，请勿重复点击':res.data.msg,
            icon:'none',
            duration: 2000
          })
          that.setData({
            like_status: true
          })
        }

      }
    }).catch(e => {
      wx.hideLoading();
      app.showToast({
        title: "数据异常",
      })
      that.setData({
        like_status: true
      })
      console.log(e)
    })
  },
  getFormId: function(e, t) { //取FormId
    let that = t;
    common.post('/saveFormId', {
      member_id: that.data.member_id,
      form_id: e.detail.formId
    }).then(res => {
      console.log('取FormId')
      console.log(res)
    })
  },
  //唤起登录
  showLoginConfirm(t) {
    let that = t;
    if ( wx.getStorageSync('member_id') ) {
      console.log(that.member_id,'唤起登录检测');
    } else {
      wx.showModal({
        title: '未授权，无法操作！',
        content: '是否前往授权？',
        success: function(res) {
          if ( res.confirm ) {
            wx.reLaunch({
              url: '/pages/mine/index/index'
            })
          }
          if ( res.cancel ) {
            that.setData({
              pop1: false,  //评论弹窗
            })
          }
        }
      })
    }
  },
  // 获取定位
  getPos(t) { 
    let _this = t;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {

        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        _this.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1],
        })
        getApp().globalData.longitude = gcj02tobd09[0];
        getApp().globalData.latitude = gcj02tobd09[1];
        // common.post('/location', {
        //   member_id: wx.getStorageSync('member_id'),
        //   longitude: gcj02tobd09[0],
        //   latitude: gcj02tobd09[1],
        // }).then(res => {
        //   console.log("获取定位")
        //   console.log(res)
        // })
      },
      fail: function(res) {
        console.log(res)
        if (res.errMsg == "getLocation:fail auth deny") {
          // publicMethod.openSetting(_this)
          wx.showToast({
            title: '请先授权小程序位置服务！',
            icon:'none'
          })
        }
      }
    })
  },
  // 微信授权
  getUserProfile(t, f){
    let that = t;
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
          // avatarUrl: res.userInfo.avatarUrl,
          // nickName: res.userInfo.nickName,
          gender: res.userInfo.gender,
        }).then(res => {
          if (res.data.code == 200) {
            that.setData({
              member_id: res.data.member_id,
              hasUserInfo: true,
              isAuthorize: false,
              pop2: false
            })
            wx.showToast({
              title: '登陆成功！',
              icon:'success'
            })
            wx.setStorageSync('member_id', res.data.member_id);
            if(res.data.api_token){
              wx.setStorageSync('token', res.data.api_token);
            }
            wx.setStorageSync('is_code', '0');
            // wx.showTabBar();
            if (typeof f == "function") {
              return f()
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
   //打开授权设置
  openSetting(t) {
    let _this = t;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '你的位置信息将用于小程序位置接口的效果展示',
      success: function(res) {
        wx.getSetting({
          success(data) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  if (!res.authSetting["scope.userInfo"]) {
                    _this.setData({
                      isAuthorize: !0
                    })
                  } else {
                    _this.setData({
                      isAuthorize: !1
                    })
                  }
                  console.log(res.authSetting)
                }
              })
            }
          }
        })
      }
    })
  },
  //打开授权设置
  openWeRunSetting(t) { 
    let _this = t;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '你需要允许授权小程序使用微信运动',
      success: function(res) {
        wx.getSetting({
          success(data) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  if (!res.authSetting["scope.werun"]) {
                    // _this.setData({
                    //   isAuthorize: !0
                    // })
                  } else {
                    // _this.setData({
                    //   isAuthorize: !1
                    // })
                  }
                  console.log(res.authSetting)
                }
              })
            }
          }
        })
      }
    })
  },
  // 生成海报
  gotoMakephoto(t, types, ids, page_urls, contents, icon_paths,memberid) {
    let that = t;
    let type = types;
    let id = ids;
    let page_url = page_urls;
    let content = contents;
    let icon_path = icon_paths;
    let member_id = memberid;
    wx.showLoading({
      title: "合成中...",
      icon: 'none',
      mark: true,
    })
    common.get('/Makephoto/new_photo', {
      type,
      id,
      page_url,
      content,
      icon_path,
      member_id,
    }).then(res => {
      wx.hideLoading();
      if (res.data.code == 200) {
        console.log(res);
        that.setData({
          makephoto : true,
          makephoto_img: res.data.data,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 保存图片
  saveImage(e,t) {
    let that = t;
    console.log(e)
    wx.showModal({
      content: '确定保存该图片吗？',
      success: function (res) {
        if (res.confirm) {
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
                      duration: 2000,
                      success: function () {
                        that.setData({
                          makephoto: false,
                        })
                      }
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
    })

  },
  //获取个人信息
  getPersonInfo(t) {
      let that = t;
      common.get('/content/getMemberInfo', {
        member_id: that.data.member_id
      }).then(res => {
        if (res.data.code == 200) {
          wx.setStorageSync('personalInfo', res.data.data)
          that.setData({
            personalInfo: res.data.data,
            rv: res.data.rv,
            rv_name: res.data.rv.cricle.village_name,
            isRv: res.data.isRv
          });
        }
      })
    },
  openCircle(t,id,share) {
    let that = t;
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    if (!that.data.member_id) {
      that.setData({
        pop2: true
      })
      return;
    }else {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
      let code = new Date().getTime();
      common.get("/content/openCircle", {
        member_id: that.data.member_id,
        parent_member_id:share,
        vid: id?id:'',
        code: code,
      }).then(res => {
        console.log(res.data)
        wx.hideLoading();
        that.setData({
          share: 0
        })
      }).catch(error => {
        console.log(error);
      })
    }
  },
  // 每日签到
  goToSign(t,lng,lat){
    let that = t;
    let member_id = wx.getStorageSync('member_id');
    console.log(member_id)
    let peamrs = {
      member_id,
      task_id:1,
      lng: lng,
      lat: lat,
    }
    let is_goToSign = that.data.is_goToSign;
    if(!is_goToSign){
      wx.showToast({
        title: '请勿重复提交',
        icon:'none'
      })
      return
    }
    that.setData({
      is_goToSign:false
    })
    common.get('/environmental/bank/do_card',peamrs).then( res => {
      console.log(res)
      if(res.data.ret == 0){
        let content_id = res.data.content_id;
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration:1500,
          success:function(){
            that.setData({
              is_true: true,
            })
            wx.requestSubscribeMessage({  
              tmplIds: ['1neA-pyIpkUR4Asv__QNuyCbM4rVIvaoluNlc6XdCJo'],
              complete(res){
                wx.navigateTo({
                  url: '/packageB/pages/signIndex/index?m_id=' + wx.getStorageSync('member_id'),
                })
              }
            })
          } 
        })
      }else if(res.data.ret == 202){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          is_goToSign:true,
          task_sign: false,
          is_true:true
        })
      }
    }).catch(e =>{
      console.log(e)
      that.setData({
        is_goToSign:true,
      })
    })
  },
  // 赚更多积分
  goTobank(){
    wx.reLaunch({
      url: '/pages/bank/bank?fromindex=1',
    })
  },
  // 转百度定位
  zhuan_baidu(t){
    let that = t;
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        wx.setStorageSync('zhuan_dingwei', gcj02tobd09);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        getApp().globalData.longitude = gcj02tobd09[0];
        getApp().globalData.latitude = gcj02tobd09[1];
        console.log(that.data.longitude)
        console.log(that.data.latitude)
      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          // publicMethod.openSetting(that)
        }
        
      }
    })
  },
  toufang(t){
    let that = t;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/agent/ad_info',{
      member_id : wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        console.log(that.data.put_distance)
        let put_dist = res.data.data == ''?'0':Number(res.data.data.put_distance) - 1;
        let gl_integral = that.data.put_distance[put_dist].integral;
        let aa = res.data.aa;
        console.log(res.data.aa)
        that.setData({
          is_put:true,
          set_name:res.data.data == ''?aa.name:res.data.data.company_name,
          set_phone:res.data.data == ''?aa.phone:res.data.data.mobile,
          yulian_selec_id: res.data.data == ''?'1':res.data.data.type,
          selec_distance: res.data.data == ''?'0':put_dist,
          selec_distance_name : res.data.data == ''?'3':that.data.put_distance[put_dist].distance,
// ==============  4.12 新增 ===================
          select_id : res.data.data == ''? 0: res.data.data.select_id,
          select_type : res.data.data == ''? 0: res.data.data.select_type,
// ==============  以上 新增 ===================
          gl_integral,
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      wx.showToast({
        title: e,
        icon:'none'
      })
      console.log(e)
    })

  },
  submit_put(t){
    let that = t;
    let pramen = {
      member_id:wx.getStorageSync('member_id'),
      business_id: that.data.business_id,
      company_name: that.data.set_name,
      mobile: that.data.set_phone,
      type: that.data.yulian_selec_id,
      put_distance: that.data.selec_distance_name,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }
  //  ================ 2021.04.12 新增 =====================
    if( (pramen.type == '1' && that.data.select_type == 0) || (pramen.type == '1' && that.data.select_type === null) ){
      wx.showToast({
        title: '请选择你要推广店铺的商品活优惠券',
        icon: 'none'
      })
      return
    }
    if((pramen.type == '1' && that.data.select_id == 0 )|| (pramen.type == '1' && that.data.select_id === null) ){
      wx.showToast({
        title: '请选择你要推广店铺的商品活优惠券',
        icon: 'none'
      })
      return
    }
    if(pramen.type == '1'){
      pramen.select_type = that.data.select_type;
      pramen.select_id = that.data.select_id;
    }
  //  ================ 以上 新增 =====================
    console.log(pramen)

    wx.showLoading({
      title: '提交中...',
    })
    common.get('/agent/add_ad',pramen).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        that.setData({
          is_put:false,
          is_yulian:true,
          avatar: res.data.data.avatar,
          yulian_company_name:res.data.data.company_name,
          yulian_integral: res.data.data.integral,
          yulian_image : res.data.data.image,
          ad_content: res.data.data.ad_content,
          select_type: res.data.data.select_type
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      console.log(e)
    })
  },
  //建圈
  create_circle(t){
    let that = t;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'MBQBZ-IU4CX-XI34P-75P45-R5O22-XGF67'
    });
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        qqmapsdk.reverseGeocoder({
          location: res.latitude + ',' + res.longitude || '', //位置坐标,不填默认当前位置
          success: function(result) { //成功后的回调
            console.log(result);
            var result = result.result;
            common.get("/content/CircleCreate", {
              member_id: that.data.member_id,
              longitude: res.longitude,
              latitude: res.latitude,
              address: result.address,
              village_name: ' ',
              area: result.ad_info.district,
              area_location: result.ad_info.location,
            }).then(res => {
              console.log(res.data.msg);
              if (res.data.code == 200) {
                console.log('200')
                that.getData();
              }
            }).catch(error => {
              console.log(error);
            })
          },
          fail: function(error) {
            console.log(error);
          },
          complete: function(res) {

          }
        })

      },
    })
  },
  goto_adshop(e,t,is_num){
    let that = t;
    let is_n = is_num;
    console.log(e)
    let select_type = e.currentTarget.dataset.select_type;
    let business_id = e.currentTarget.dataset.business_id;
    let id = e.currentTarget.dataset.id;

    if(select_type == '1'){
      // 跳转商品
      let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('member_id') + "&discount_id=" + id + "&is_isReset=1";
      if(is_n == 1){
        url = url + "&is_n=1"
      }
      wx.navigateTo({
        url: url
      })
    }
    if(select_type == '2'){
      // 跳转优惠券
      let url = "/packageA/pages/coupon_detail/index?id=" + id + "&is_isReset=1";
      if(is_n == 1){
        url = url + "&is_n=1"
      }
      wx.navigateTo({
        url: url
      })
    }
  },
  gotoshop(){
    let that = this;
    common.get("/garbage/follow_log",{
      member_id:wx.getStorageSync('member_id'),
      business_id:that.data.business_id,
    }).then(res =>{
      if(res.data.code == 200){
        wx.reLaunch({
          url: '/pages/shop/shop?business_id='+ that.data.business_id,
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
  gotoindex(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  gotodongtai(){
    wx.reLaunch({
      url: '/pages/mine/myContent/index?member_id='+this.data.view_member_id + '&is_onShare=1',
    })
  },
  gotocircle(){
   wx.reLaunch({
      url: '/pages/circle/circle',
    })
  },
  gotoxuanze(t){
    let that = t;
    let lx = that.data.lx;
    // if(lx == 1){
    //   publicMethod.gotoshop();
    // }
    // if(lx == 2){
    //   publicMethod.gotoindex();
    // }
    // if(lx == 3){
    //   publicMethod.gotodongtai();
    // }
    publicMethod.gotocircle();
  },
  // 点赞弹广告
  popAd_integral(t,lat,lng,integral,is_num){
    let that = t;
    let prem = {
      lat,
      lng,
      member_id: wx.getStorageSync('member_id'),
      integral
    }
    common.get("/garbage/ad_integral",prem).then(res =>{
      if(res.data.code == 200){
        console.log(res)
          let pop_ad = res.data.data;
          let is_n = is_num;
          let business_id = pop_ad.business_id;
          let i = pop_ad.integral;
          let lx = pop_ad.lx;
          if(lx == 1){
            if(pop_ad.select_type == '1'){
              // 跳转商品
              let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('member_id') + "&discount_id=" + pop_ad.ad_content.id + "&integral=" +i+ "&is_cxtg=1" + "&is_isReset=1";
              if(is_n == 1){
              url = url + "&is_n=1"
            }
            wx.navigateTo({
              url: url
            })
            }
            if(pop_ad.select_type == '2'){
              // 跳转优惠券select_id
              let url = "/packageA/pages/coupon_detail/index?id=" + pop_ad.ad_content.id + "&integral=" +i+ "&is_cxtg=1" + "&is_isReset=1";
              if(is_n == 1){
                url = url + "&is_n=1"
              }
              wx.navigateTo({
                url: url
              })
            }
          }else{
           return
          }
      }else{
        wx.setStorageSync('isReset', 0);
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 默认挂售赠送积分、
  gotosetint_transac(t){
    let that = t;
    let member_id = wx.getStorageSync('member_id');
    common.get("/content_personal/is_jf",{
      member_id,
      lng: that.data.longitude,
      lat: that.data.latitude
    }).then(res =>{
      if(res.data.code == 200){

      }
    }).catch(e =>{
      console.log(e)
    })

  },
  // 跳转志愿活动详情页面
  gotoApplyFor(e,t){
    let that = t;
    console.log(e);
    let activity_id = e.currentTarget.dataset.activity_id;
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_details/index?id=' + activity_id + '&isgoback=1',
    })
  },


// 点击轮播红包推广
  goToTool_welfare(t){
    let that = t;
    common.get('',{
      member_id: wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat: that.data.latitude
    }).then(res =>{
      if(res.data.code = 200){
        let swiper_data = res.data.data[0]? res.data.data[0] : {};
        app.data.confirm_tool = swiper_data;
        wx.setStorageSync('isReset', 1);
        wx.navigateTo({
          url: '/packageA/pages/confirm_tool/index',
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
  gotojion(e,t){
    let that = t;
    let source = e.currentTarget.dataset.source;
    let memberid = e.currentTarget.dataset.memberid;
    let goodid = e.currentTarget.dataset.goods_id;
    let business_id = e.currentTarget.dataset.business_id;
    if(source == 1){
      // 跳转动态发圈
      wx.navigateTo({
        url: "/pages/publish/publish",
      })
    }else if(source == 2){
      // 跳转志愿活动
      wx.navigateTo({
        url: '/packageA/pages/home_page/volunacti_page/index',
      })
    }else if(source == 3){
      // 签到打卡
      publicMethod.goToSign(that,that.data.longitude,that.data.latitude);
    }else if(source == 4){
      // 跳转微信运动
      wx.navigateTo({
        url: '/packageA/pages/home_page/wechatmove_page/index',
      })
    }else if(source == 5){
      // 跳转爱心捐赠
      wx.navigateTo({
        url: '/packageA/pages/donate_types/index',
      })
    }else if(source == 6){
      // 跳转提现
      wx.navigateTo({
        url: '/pages/mine/walletChild/index?menber_id=' + wx.getStorageSync('member_id'),
      })
    }else if(source == 7){
      if(memberid == wx.getStorageSync('member_id')){
        // 跳转提现
        wx.navigateTo({
          url: '/pages/mine/walletChild/index?menber_id=' + wx.getStorageSync('member_id'),
        })
        return
      }else{
        // 跳转集赞换钱
        wx.navigateTo({
          url: '/packageA/pages/praise_exchange/index',
        })
        return
      }
    }else if(source == 8){
      // 跳转今日福利
      wx.navigateTo({
        url: "/packageA/pages/praise_welfaredetail/index?goodid="+ goodid + "&business_id=" + business_id,
      })
    } else if(source == 9){
      // 跳转摇一摇
      wx.navigateTo({
        url: '/packageA/pages/shake_page/index',
      })
    }else if(source == 10){
      // 跳转桶前值守
      wx.navigateTo({
        url: '/packageA/pages/site_clock/index',
      })
    }else if(source == 11){
      // 跳转邻居的书
      wx.navigateTo({
        url: '/packageA/pages/library/neighbook/index',
      })
    }else if(source == 12){
      // 跳转闲置
      wx.navigateTo({
        url: '/pages/getalllist/getalllist',
      })
    }else if(source == 13){
      // 跳转积分换书
      wx.navigateTo({
        url: '/packageA/pages/library/library/library',
      })
    }else if(source == 14){
      // 跳转抽奖
      wx.navigateTo({
        url: '/packageA/pages/lottery_project/lottery_awards/index',
      })
    }else if(source == 15){
      // 跳转上门回收
      wx.navigateTo({
        url: '/pages/huishou/types/index',
      })
    }else if(source == 16 || source == 203){
      // 跳转一分钱公益
      wx.navigateTo({
        url: '/packageA/pages/pennywelfare_Activity/index',
      })
    }else if(source == 17){
      // 跳转冬奥打卡
      wx.navigateTo({
        url: '/packageB/pages/winter_olympics/winter_punchlist/index',
      })
    }
  },
  upLoadImg(image,index,t){
    let img = image;
    let i = index;
    let that = t;
    if ( i >= img.length ) {
      return
    }
    let txt = '上传中'
    wx.showLoading({
      title:txt
    })
    wx.uploadFile({
      url: setting.apiUrl + '/file/uploadOss',
      filePath: img[i],
      name: 'files[]',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        console.log(data);
        if ( data.code == 0 ) {
          wx.hideLoading();
          that.data.img.push(data.data.url[0]);
          that.setData({
            img: that.data.img
          })
        } else {
          app.showToast({
            title: "上传失败!",
          })
        }
        wx.hideLoading();
        i++;
        publicMethod.upLoadImg(image,i,that);
      },
      fail:function() {
        app.showToast({
          title: "上传失败!",
        })
        wx.hideLoading()
      },
      complete:function() {
        wx.hideLoading()
      }
    })
  },
  // 去登录页面
  gotoLoginMark(){
    wx.navigateTo({
      url: '/pages/login_mark/index',
    })
  },

  // 引流广告、
  blindbox_btn(t,s_t,s_i,t_i){
    let that = t;
    let select_type = s_t;
    let select_id = s_i;
    let traffic_id = t_i;
    common.post("/referraltraffic/record",{
      traffic_id,
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        let url = '';
        if( select_type == 1 ){
          url = '/pages/dicount_good/dicount_good?discount_id=' + select_id + '&jiage=' + jiage + '&is_blindBox=1';
        }else if( select_type == 2 ){
          url = '/packageA/pages/coupon_detail/index?id=' + select_id + '&jiage=' + jiage + '&is_blindBox=1';
        }
        wx.navigateTo({
          url,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 快速推广、优惠券
  xuyao_coupon(t,d_i,i){
    let that = t;
    let del_id = d_i;
    let id = i;
    common.get("/content_personal/byfuli",{
      id: del_id
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        wx.navigateTo({
          url: "/packageA/pages/coupon_detail/index?id=" + id  + '&jiage=' + jiage + '&is_blindBox=1',
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 快速推广、商品
  audit_btn(t,d_i,i,b_i){
    let that = t;
    let status = '1';
    let detail_id = d_i;
    let id = i;
    let business_id = b_i;
    common.get('/content_personal/audit',{
      status,
      detail_id,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        if(status == 1){
          wx.navigateTo({
            url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&discount_id=" + id + '&jiage=' + jiage + '&is_blindBox=1',
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        return;
      }
    }).catch(e =>{
      console.log(e)
    })
  },








  // 进度条动画
  progress_bar(progressBar){
    let that = progressBar.that;  //  this
    let bar_text = progressBar.text;  // 进度完成文字展示
    let bar_tag = progressBar.tag;   // 类型
    let bar_integral = progressBar.integral?progressBar.integral:'';  // 获取积分
    let bar_jiage = progressBar.jiage?progressBar.jiage:'';  // 获取价格
    let f = progressBar.f ? progressBar.f : ''  //  完成加载后函数
    that.setData({
      is_progress:true
    })
    // 进度条
    let timer = setInterval(function(){
      that.setData({
        bar_number : that.data.bar_number+1,  
        tb_leflt : that.data.tb_leflt + 6.28
      })
      if(that.data.bar_number == 100){
        clearInterval(timer);
      }
      return
    },100)
    // 倒计时
    let djs_timer = setInterval(() => {
      that.setData({
        djs_number : that.data.djs_number-1
      })
      if(that.data.djs_number == 0){
        clearInterval(djs_timer);
        if(typeof(f) == 'function'){
          f();
        }
        that.setData({
          bar_text: bar_text,
          is_returns:true,
        })
        setTimeout(() => {
          that.setData({
            is_progress: false,   // 进度条显示隐藏模块
            is_taskShare_s: false,   // 收购模块展示隐藏模块
            is_zyhd: false,  //  志愿活动、热血夺宝文案展示隐藏
            is_cxtg: bar_tag == 'is_cxtg' ? 1 : 0, // 展示持续推广模块
            is_blindBox: bar_tag == 'is_blindBox' ? 1 : 0, // 展示拆盲模块
            is_smallacqu: bar_tag == 'is_smallacqu' ? 1 : 0, // 展示小量模块
            is_taskShare: bar_tag == 'is_taskShare' ? 1 : 0, // 展示大量模块
            is_zyhd_box: bar_tag == 'is_zyhd_box' ? 1 : 0, // 志愿活动、热血夺宝模块,
            integral: bar_integral,  // 获得积分
            jiage: bar_jiage,  // 获得金额
            bar_number: 2,
            djs_number: 5,
          })
        }, 2000);
      }
      return
    }, 2000);
    that.setData({
      timer, // 进度条
      djs_timer,   // 倒计时
    })
  },



}


module.exports = publicMethod