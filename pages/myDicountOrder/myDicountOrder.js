const app = getApp()
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');

Page({
  data: {
    pageIndex: 1,
    pageSize: 15,
    hasMore: true,
    list:[],
    orderlists: [],  //查询到的订单列表
    searchkey: '',  //搜索框的值
    discount_order_tid:'',
    order_tid:'',
    is_show:false,
    day: 0, 
    hr: 0, 
    min: 0,
    sec: 0,
    starPic: [0, 0, 0, 0, 0],  //标记每个星星的图片显示灰色还是黄色，0表示灰色，1表示黄色
    score:8,
    pingfen_type:'',
    pingfen_id:'',
    library_id:'',
    grade:4,
    is_title:false,
    title_text:[],
    currentTab:0,
    is_shop:0,
    is_idle: 0,
    business_id:'',
    is_debug: true,
    is_order: true, 
    type: 1
  },
  onLoad: function(options) {
    let that = this;
    if(options.is_comtype == 'community'){
      wx.setNavigationBarTitle({
        title:'低碳社区驿站•金泰城丽湾'
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info'),
      status: options.status,
      type: options.type,
    })
    console.log(options);
    var tempindex = [0, 0, 0, 0, 0];
    var i = 4;
    for (var m = 0; m <= i; m++) {
      tempindex[m] = 1
    }
    var score = (i + 1) * 2;
    var grade = (i + 1);

    this.setData({
      starPic: tempindex,
      score,
      grade,
    })
    this.setData({
      
    })
    // 商家订单
    this.getOrderInfo('/business/getBusinessDiscountOrder');
  },
  onShow: function() {
    let that = this;
  },
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      list:[],
      orderlists:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getOrderInfo('/business/getBusinessDiscountOrder');
    wx.stopPullDownRefresh();
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getlistData();
      wx.hideLoading()
    }, 1000)
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  //头部栏切换
  changeTabItem(e) {
    let that = this;
    that.setData({
      status: e.currentTarget.dataset.status,
      searchkey:'',
      list:[],
      orderlists:[],
      pageIndex: 1,
      hasMore: true,
    });
    // 商家订单
    that.getOrderInfo('/business/getBusinessDiscountOrder');

  },
  //查询订单
  getOrderInfo(api_url) {
    let that = this;
    let postmsg = {
      status: that.data.status,
      member_id: wx.getStorageSync('member_id'),
    }
    wx.showLoading({
      title: '订单加载中...',
    })
    common.get(api_url, postmsg).then( res => {
      wx.hideLoading();
      if ( res.data.code == 200 ) {
        wx.hideLoading();
        let data = res.data.data;// 获取存储总数据
        let pageSize = that.data.pageSize;// 获取每页个数
        that.setData({
          count: data.length,
        })
        if(data.length > 0){
          for (let i = 0; i < data.length; i += pageSize){
            // 分割总数据，每个子数组里包含个数为pageSize
            that.data.list.push(data.slice(i, i + pageSize))
          }
          that.getlistData();
        }
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
  getlistData(){ // 前端实现一次获取总数据后分页获取数据
    let that = this;
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
      let page = (that.data.pageIndex - 1);
      let list = that.data.list;
      let count = that.data.count;// 获取数据的总数
    let flag = that.data.pageIndex * that.data.pageSize < count;
    that.setData({
      // 将新获取的数据拼接到之前的数组中
      orderlists: that.data.orderlists.concat(list[page]),
      hasMore: flag,
    })
  },
  //取消订单
  cancelOrder(e){
    let that = this;
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let orderlists = that.data.orderlists
    wx.showModal({
      content: '确定取消该订单吗？',
      success:function(res){
        if(res.confirm){
          //删除订单
          common.get("/business/setBusinessDiscountOrder", {
            member_id: that.data.member_id,
            status: 5,
            order_id: id,
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '取消订单成功',
                icon: 'success'
              })
              orderlists.splice(index, 1);
              that.setData({
                orderlists: orderlists
              })
            }
          })
        }
        
      }
    })
  },
  //图书馆取消订单
  cancelOrder_book(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let orderlists = that.data.orderlists
    wx.showModal({
      content: '确定取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          //删除订单
          common.post("/library/SaveOrderStatus", {
            member_id: that.data.member_id,
            order_status: 5,
            order_id: id,
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '取消订单成功',
                icon: 'success'
              })
              orderlists.splice(index, 1);
              that.setData({
                orderlists: orderlists
              })
            }
          })
        }

      }
    })
  },
  //支付订单
  payOrder(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    wx.showModal({
      content: '确定支付该订单吗？',
      success: function (res) {
        if(res.confirm){
          wx.showLoading({
            title: '加载中...',
          })
          common.get("/business/setBusinessDiscountOrder", {
            member_id: that.data.member_id,
            status: 2,
            order_id: id,
          }).then(res => {
            wx.hideLoading()
            if (res.data.code == 200) {
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
                  that.setData({
                    status: 2,
                    list:[],
                    orderlists:[],
                    pageIndex: 1,
                    hasMore: true,
                  })
                  // 商家订单
                  that.getOrderInfo('/business/getBusinessDiscountOrder');
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/tobuy_welfare/pay_succcess'
                    })
                  }, 1000)
                  return;
                },
                fail: function (e) {
                  console.log(e)
                  wx.showToast({
                    title: '支付失败！',
                    duration: 1000,
                    icon: 'none'
                  })
                  return;
                }
              });
            } else if (res.data.code == 202) {
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
              that.setData({
                status: 2,
                list:[],
                orderlists:[],
                pageIndex: 1,
                hasMore: true,
              })
              // 商家订单
              that.getOrderInfo('/business/getBusinessDiscountOrder');
            } else {
              wx.showToast({
                title: res.data.msg,
                duration: 1000,
                icon: 'none'
              })
            }
          })
        }
        
      }
    })
  },
  // 图书馆支付订单
  payOrder_book(e) {
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    let order_type = e.currentTarget.dataset.order_type;
    wx.showModal({
      content: '确定支付该订单吗？',
      success: function (res) {
        if(res.confirm){
          wx.showLoading({
            title: '加载中...',
          })
          if(order_type == '3'){
            common.get("/newhome/SaveOrderStatus", {
              member_id: that.data.member_id,
              order_status: 2,
              order_id: id,
            }).then(res => {
              wx.hideLoading()
              if (res.data.code == 200) {
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
                    that.setData({
                      order_status: 2,
                      list:[],
                      orderlists:[],
                      pageIndex: 1,
                      hasMore: true,
                    })
                    that.getOrderInfo('/business/getBusinessDiscountOrder');
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '/packageA/pages/eiltemode/mySubmit/index',
                      })
                    }, 1000)
                    return;
                  },
                  fail: function (e) {
                    console.log(e)
                    wx.showToast({
                      title: '支付失败！',
                      duration: 1000,
                      icon: 'none'
                    })
                    return;
                  }
                });
              } else if (res.data.code == 202) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'none'
                })
                that.setData({
                  status: 2,
                  list:[],
                  orderlists:[],
                  pageIndex: 1,
                  hasMore: true,
                })
                that.getOrderInfo('/business/getBusinessDiscountOrder');

              } else {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'none'
                })
              }
            })
          }else{
            common.post("/library/SaveOrderStatus", {
              member_id: that.data.member_id,
              order_status: 2,
              order_id: id,
            }).then(res => {
              wx.hideLoading()
              if (res.data.code == 200) {
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
                    that.setData({
                      order_status: 2,
                      list:[],
                      orderlists:[],
                      pageIndex: 1,
                      hasMore: true,
                    })
                    that.getOrderInfo('/business/getBusinessDiscountOrder');
                    setTimeout(function () {
                      wx.navigateTo({
                        url: '/pages/tobuy_welfare/pay_succcess'
                      })
                    }, 1000)
                    return;
                  },
                  fail: function (e) {
                    console.log(e)
                    wx.showToast({
                      title: '支付失败！',
                      duration: 1000,
                      icon: 'none'
                    })
                    return;
                  }
                });
              } else if (res.data.code == 202) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'none'
                })
                that.setData({
                  status: 2,
                  list:[],
                  orderlists:[],
                  pageIndex: 1,
                  hasMore: true,
                })
                that.getOrderInfo('/business/getBusinessDiscountOrder');
              } else {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'none'
                })
              }
            })
          }

        }
        
      }
    })
  },
    // 图书馆支付订单
    payOrder_gujiu(e) {
      console.log(e)
      let that = this;
      let id = e.currentTarget.dataset.id;
      let order_type = e.currentTarget.dataset.order_type;
      wx.showModal({
        content: '确定支付该订单吗？',
        success: function (res) {
          if(res.confirm){
            wx.showLoading({
              title: '加载中...',
            })
            common.post("/newhome/old_book_order", {
              member_id: that.data.member_id,
              order_status: 2,
              order_id: id,
            }).then(res => {
              wx.hideLoading()
              if (res.data.code == 200) {
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
                    that.setData({
                      order_status: 2,
                      list:[],
                      orderlists:[],
                      pageIndex: 1,
                      hasMore: true,
                    })
                    that.getOrderInfo('/business/getBusinessDiscountOrder');
                    setTimeout(function () {
                      wx.navigateTo({
                        url: '/pages/tobuy_welfare/pay_succcess'
                      })
                    }, 1000)
                    return;
                  },
                  fail: function (e) {
                    console.log(e)
                    wx.showToast({
                      title: '支付失败！',
                      duration: 1000,
                      icon: 'none'
                    })
                    return;
                  }
                });
              } else if (res.data.code == 202) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'none'
                })
                that.setData({
                  status: 2
                })
                that.getOrderInfo('/business/getBusinessDiscountOrder');
              } else {
                wx.showToast({
                  title: res.data.msg,
                  duration: 1000,
                  icon: 'none'
                })
              }
            })
  
          }
          
        }
      })
    },
  //订单去发货
  shipmentsOrder(e) {
    let that = this;
    console.log(e)
    let discount_id = e.currentTarget.dataset.discount_id;
    let discount_order_tid = e.currentTarget.dataset.discount_order_tid;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确定该订单已发货吗？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/idlelogistics/idlelogistics?discount_id=' + discount_id + '&id=' + id + '&discount_order_tid=' + discount_order_tid + '&order_type=ture',
          })
        }
      }
    })
  },

  //订单确认收货
  takeOrder(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let is_order = that.data.is_order;
    if(!is_order){
      wx.showToast({
        title: '请勿重复提交！',
        icon:'none'
      })
      return
    }
    that.setData({
      is_order: false
    })
    wx.showModal({
      content: '确定该订单已收到货吗？',
      success: function (res) {
        if (res.confirm){
          common.get("/business/setBusinessDiscountOrder", {
            member_id: that.data.member_id,
            status: 4,
            order_id: id,
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '收货成功',
                icon: 'success'
              })
              that.setData({
                status: 4,
                list:[],
                orderlists:[],
                pageIndex: 1,
                hasMore: true,
              })
              // 商家订单
              that.getOrderInfo('/business/getBusinessDiscountOrder');
            } else {
              wx.showToast({
                title: '收货失败',
                icon: 'success'
              })
            }
            that.setData({
              is_order: true
            })
          }).catch(e =>{
            that.setData({
              is_order: true
            })
          })
        }else{
          that.setData({
            is_order: true
          })
        }
      }
    })
  },
  // 评分
  tapstar0: function (e) {
    let that = this;
    var i = new Number(e.target.dataset.text)//获取image里面data-text传递过来的值，并转换成number类型，用来识别是哪颗星星被点击
    var tempindex = [0, 0, 0, 0, 0];

    for (var m = 0; m <= i; m++) {
      tempindex[m] = 1
    }
    var score = (i + 1) * 2;
    var grade = (i + 1);

    this.setData({
       starPic: tempindex,
       score,
       grade,
       })
  },
  //  提交评分
  submint(){
    let that = this;
    let id= that.data.pingfen_id;
    let library_id= that.data.library_id;
    let type = that.data.pingfen_type;
    let grade = that.data.grade;
    common.get("/library/to_grade", {
      library_id,
      grade
    }).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '评价成功',
          icon: 'success'
        })
        that.setData({
          is_pingfen: false
        })
        setTimeout(function(){
          common.post("/library/SaveOrderStatus", {
            member_id: that.data.member_id,
            order_status: 4,
            order_id: id,
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '收货成功',
                icon: 'success'
              })
  
              that.setData({
                order_status: 4,
                list:[],
                orderlists:[],
                pageIndex: 1,
                hasMore: true,
              })
              // 商家订单
              that.getOrderInfo('/business/getBusinessDiscountOrder');
            } else {
              wx.showToast({
                title: '收货失败',
                icon: 'success'
              })
            }
          })
        },1500)
        
      } else {
        wx.showToast({
          title: '评分失败...',
          icon: 'success'
        })
      }
    })
  },
  // 图书订单确认收货
  takeOrder_book(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;

    if(type == 'library'){
      that.setData({
       library_id : e.currentTarget.dataset.library_id,
        pingfen_id:id,
        pingfen_type:type,
        is_pingfen:true
      })

    }else{
      let is_debug = that.data.is_debug;
      if(!is_debug){
        wx.showToast({
          title: '请勿重复提交！',
          icon:"none"
        })
        return
      }
      that.setData({
        is_debug: false
      })
      wx.showModal({
        content: '确定该订单已收到货吗？',
        success: function (res) {
          if (res.confirm) {
            common.post("/library/SaveOrderStatus", {
              member_id: that.data.member_id,
              order_status: 4,
              order_id: id,
            }).then(res => {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '收货成功',
                  icon: 'success'
                })
  
                that.setData({
                  order_status: 4,
                  is_debug: true,
                  list:[],
                  orderlists:[],
                  pageIndex: 1,
                  hasMore: true,
                })
                // 商家订单
                that.getOrderInfo('/business/getBusinessDiscountOrder');
              } else {
                wx.showToast({
                  title: '收货失败',
                  icon: 'none'
                })
                that.setData({
                  is_debug: true
                })
              }
            }).catch( e=>{
              that.setData({
                is_debug: true
              })
            })
          }else{
            that.setData({
              is_debug: true
            })
          }
  
        }
      })
    }

  },
  //搜索框查询
  search(e) {
    this.setData({
      searchkey: e.detail.value,
      orderlists: []
    })
    // 商家订单
    that.getOrderInfo('/business/getBusinessDiscountOrder');
  },
  makeCall(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  obtainCall(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  
  savaData(e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    let txt = e.currentTarget.dataset.txt;
    let curIdx = e.currentTarget.dataset.curidx;
    wx.showModal({
      title: '提示',
      content: '确定' + txt + '吗？',
      success: function(res) {
        if (res.confirm) {
          common.post('/recover/changeOrderStatus', {
            member_id: that.data.member_id,
            status,
            order_id:id
          }).then(res => {

            console.log("修改状态")
            console.log(res)
            if (res.data.errno == 0) {
              that.getData()
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
  onPullDownRefresh() { //下拉刷新
    let that = this
    wx.stopPullDownRefresh()
    that.getData()
  },
// 查看物流
  viewLogistics(e){
    console.log(e)
    let that = this;
    let discount_order_tid = e.currentTarget.dataset.discount_order_tid;
    let order_tid = e.currentTarget.dataset.id;
    let in_stock = e.currentTarget.dataset.in_stock;

    let url = "/pages/viewLogistics/viewLogistics?discount_order_tid=" + discount_order_tid + "&order_tid=" + order_tid + "&in_stock=" + in_stock;
    wx.navigateTo({
      url: url,
    })

  },
  onShareAppMessage: function (res) { //分享
    console.log(res)
      let that = this
      if (res.target) {
        if (res.from === 'button') {
            let business_id = res.target.dataset.business_id;
            let discount_id = res.target.dataset.discount_id;
            let tuan_order_id = res.target.dataset.tuan_order_id;
            let order_type = res.target.dataset.order_type;
            let id = res.target.dataset.id;
            let need_num = res.target.dataset.need_num;
            let gdImages = res.target.dataset.img;
            let is_tuan = 0;
            if(order_type == 'tuan'){
              is_tuan = 1
            }
            console.log(is_tuan)
            let url = '/pages/dicount_good/dicount_good?business_id=' + business_id + '&member_id=' + that.data.member_id + '&discount_id=' +discount_id + '&id=' +id+ '&is_tuan=' + is_tuan + '&is_type=join' +'&tuan_order_id=' + tuan_order_id;
            return {
              title: '【还差'+ need_num +'份】帮我拼一下！商品很优惠喔！千万别错过',
              path: url,
              imageUrl: gdImages,
              success: function (res) {
                // 转发成功
                console.log(res)
                wx.reLaunch({
                  url: '/packageA/pages/commoditylist/commoditylist'
                })
              },
              fail: function (res) {
                // 转发失败
              }
            }
        } else {
          return {
            title: '【还差'+ num +'份】帮我拼一下！商品很优惠喔！千万别错过',
            path: '/pages/dicount_good/dicount_good?business_id=' + that.data.business_id + '&member_id=' + that.data.member_id + '&discount_id=' + that.data.discount_id + '&is_tuan=' + that.data.is_tuan+ '&is_type=join',
            success: function (res) {
              // 转发成功
              console.log(res)
              wx.reLaunch({
                url: '/packageA/pages/commoditylist/commoditylist'
              })
            },
            fail: function (res) {
              // 转发失败
              console.log(res)
            }
          }
        }
      }
    },
    countdown() {
      console.log(1)
      let that = this;
      // 目标日期时间戳
      const end = new Date('2020-7-8')
      // 当前时间戳
      const now = new Date()
      // 相差的毫秒数
      const msec = end - now
      // 计算时分秒数
      let day = parseInt(msec / 1000 / 60 / 60 / 24)
      let hr = parseInt(msec / 1000 / 60 / 60 % 24)
      let min = parseInt(msec / 1000 / 60 % 60)
      let sec = parseInt(msec / 1000 % 60)
      // 个位数前补零
      hr = hr > 9 ? hr : '0' + hr
      min = min > 9 ? min : '0' + min
      sec = sec > 9 ? sec : '0' + sec
      // 控制台打印
      console.log(`${day}天 ${hr}小时 ${min}分钟 ${sec}秒`)
      // 一秒后递归
      setTimeout(function () {
        that.countdown()
      }, 1000)
    },

    item_title(e){
      console.log(e);
      let that = this;
      let title_str = e.currentTarget.dataset.title;
      let title_text = title_str.split(',');
      console.log(title_text)
      that.setData({
        is_title:true,
        title_text,
      })
    },
    no_istitle(){
      let that = this;
      that.setData({
        is_title:false,
      })
    },
    //点击打开 图片
    open_image(){
      let show_photo = this.data.show_photo;
      console.log(show_photo);
      if(show_photo==false){
        this.setData({
          is_title:true
        })
      }else{
        this.setData({
          is_title:false
        })
      }

    },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  gotocommdetail(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let discount_order_tid = e.currentTarget.dataset.discount_order_tid;
    console.log(e)
    wx.navigateTo({
      url: '/packageA/pages/commorder_detail/index?id=' + id + '&discount_order_tid=' + discount_order_tid + '&type=' + that.data.type,
    })
  }
})