const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
    switchvalue: '',
    currentTab:0,
    cur:0,
    ttab:0,
    qwe:true,
    statusTab: 1,
    identify: {
      id: '',  //身份对应的id
      flag: '', //身份标识 1为普通会员，2为商家，3为回收员
      status: '',
    },
    setDeliveryPrice: true,
    currentDeliveryWindows: 0,
    currentDeliveryPrice: '',
    currentPrice:'',
    pageIndex: 1,
    pageSize: 20,
    hasMore: true,
    list:[],
    count: 0,
    orderlists: [],  //查询到的订单列表
    booklists:[],  // 图书回收列表
    jiuyi_lists:[], //旧衣回收
    ahs_lists:[], //爱回收家电回收
    bookyoujis:[], // 图书邮寄
    orderArr:[
      {id:0,name:'普通回收'},
      {id:3,name:'旧物回收'},
      {id:4,name:'家电回收'},
      {id:1,name:'图书回收'},
      {id:2,name:'图书邮送'},
    ],
    layer: false,
    preview: '',
    previewIndex: 0
  },
  onLoad: function(options) {
    let that = this;
    console.log(options)
    if(options.is_comtype == 'community'){
      wx.setNavigationBarTitle({
        title:'低碳社区驿站•金泰城丽湾'
      })
    }
    that.setData({
      currentTab: options.cur,
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info'),
      who: options.who || '',
      ['identify.id']: options.id,
      ['identify.flag']: options.flag,
      ['identify.status']: options.status,
    })
    // that.getData();
    if(that.data.currentTab == 0){
      that.getOrderInfo();
    }else if(that.data.currentTab == 1){
      that.getbookInfo();
    }else if (that.data.currentTab == 2){
      that.getlibararyinfo();
    }else if (that.data.currentTab == 3){
      that.getjiuyiinfo();
    }else if (that.data.currentTab == 4){
      that.getahsinfo();
    }
  },
  onShow: function() {
    let that = this;
    that.getUserIdentify();
    
  },
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      orderlists: [],  //查询到的订单列表
      jiuyi_lists:[], //旧衣回收
      ahs_lists:[], //爱回收家电回收
      booklists:[],  // 图书回收列表
      bookyoujis:[], // 图书邮寄
      list:[],
      count: 0,
      pageIndex: 1,
      hasMore: true,
    })
    if(that.data.currentTab == 0){
      that.getOrderInfo();
    }else if(that.data.currentTab == 1){
      that.getbookInfo();
    }else if (that.data.currentTab == 2){
      that.getlibararyinfo();
    }else if (that.data.currentTab == 3){
      that.getjiuyiinfo();
    }else if (that.data.currentTab == 4){
      that.getahsinfo();
    }
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
// 是否接单切换按钮
  switch1Change(e){
    console.log(e)
    let that = this;
    let switchvalue = e.detail.value;
    if (switchvalue == false){
      that.setData({
        switchvalue : 0
      })
    } else if(switchvalue == true){
      that.setData({
        switchvalue: 1
      })
    }
    common.get('/recover/change_recover_status',{
      member_id: wx.getStorageSync('member_id'),
      status: that.data.switchvalue
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '修改状态成功',
          icon:'none'
        })
      }
      if (res.data.code == -1){
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },

  //获取登录人的身份
  getUserIdentify() {
    let that = this;
    common.get("/member/getMemberIdentity", {
      member_id:  wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        if (res.data.status == 0) {
          that.setData({
            switchvalue: false
          })
        } else if (res.data.status == 1) {
          that.setData({
            switchvalue: true
          })
        }
        that.setData({
          avatarUrl: res.data.avatar,
          nickName: res.data.nickname,
          ['identify.flag']: res.data.identity,
        })
      }
    })
  },
  //上门回收栏切换
  changeTabItem(e) {
    let that = this;
    that.setData({
      ['identify.status']: e.currentTarget.dataset.status,
      orderlists: [],
      list:[],
      count: 0,
      pageIndex: 1,
      hasMore: true,
    });
    that.getOrderInfo();
  },
  //图书回收栏切换
  changeTabItem1(e) {
    console.log(e)
    let that = this;
    that.setData({
      statusTab: Number(e.currentTarget.dataset.statustab),
      booklists: [],
      list:[],
      count: 0,
      pageIndex: 1,
      hasMore: true,
    });
    that.getbookInfo();
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
      hasMore: flag,
    })
    // 将新获取的数据拼接到之前的数组中
    if(that.data.currentTab == 0){ //查询到的订单列表
      that.setData({
        orderlists: that.data.orderlists.concat(list[page]),
      })
    }else if(that.data.currentTab == 1){ // 图书回收
      that.setData({
        booklists: that.data.booklists.concat(list[page]),
      })
    }else if (that.data.currentTab == 2){ //图书邮送
      that.setData({
        bookyoujis: that.data.bookyoujis.concat(list[page]),
      })
    }else if (that.data.currentTab == 3){ //飞蚂蚁旧衣回收
      that.setData({
        jiuyi_lists: that.data.jiuyi_lists.concat(list[page]),
      })
    }else if (that.data.currentTab == 4){  //爱回收家电回收
      that.setData({
        ahs_lists: that.data.ahs_lists.concat(list[page]),
      })
    }
  },
  //查询回收订单
  getOrderInfo() {
    let that = this;
    wx.showLoading({
      title: '订单加载中...',
    })
    common.get("/recover/getOrderStatus", {
      member_id:  wx.getStorageSync('member_id'),
      recover_id: that.data.identify.id,
      identity_id: that.data.identify.flag,
      status: that.data.identify.status,
    }).then( res => {
      if ( res.data.code == 200 ) {
        wx.hideLoading();
        if ( res.data.order ) {
          let data = res.data.order;// 获取存储总数据
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
        }
      }else{
        wx.hideLoading();
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
  //查询图书回收订单
  getbookInfo() {
    let that = this;
    wx.showLoading({
      title: '订单加载中...',
    })
    console.log(that.data.statusTab)
    common.get("/recover/get_recover_book", {
      member_id:  wx.getStorageSync('member_id'),
    }).then( res => {
      if ( res.data.code == 200 ) {
        wx.hideLoading();
        let pageSize = that.data.pageSize;// 获取每页个数
        if ( that.data.statusTab == 1 ) {
          let data = res.data.data.wait;// 获取存储总数据
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
        }else if(that.data.statusTab == 2){
          let data = res.data.data.received;// 获取存储总数据
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
        
        }else if(that.data.statusTab == 3){
          let data = res.data.data.received;// 获取存储总数据
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
        }
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  savaData(e) {
    console.log(e)
    let that = this;
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    let txt = e.currentTarget.dataset.txt;
    let sum_money = e.currentTarget.dataset.sum_money;
    that.setData({
        status : e.currentTarget.dataset.status,
        id : e.currentTarget.dataset.id,
        txt : e.currentTarget.dataset.txt,
        sum_money : e.currentTarget.dataset.sum_money,
    })
    if (status == 3){
      that.setData({
        setDeliveryPrice: false,
        currentPrice: e.currentTarget.dataset.sum_money,
        pay_mode: e.currentTarget.dataset.pay_mode
      })
    }else{
      wx.showModal({
        title: '提示',
        content: txt,
        success: function (res) {
          if (res.confirm) {
            common.post('/recover/changeOrderStatus', {
              member_id:  wx.getStorageSync('member_id'),
              status,
              order_id: id
            }).then(res => {
              wx.showToast({
                title: '操作成功！',
                icon: 'success',
                duration: 1000
              })
              if (res.data.errno == 0) {
                that.getOrderInfo()
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
    }

  },
  savaData1(e) {
    console.log(e)
    let that = this;
    let id1 = e.currentTarget.dataset.id;
    let txt1 = e.currentTarget.dataset.txt;
    let integral_book = e.currentTarget.dataset.integral_book;

    wx.showModal({
      title: '提示',
      content: txt1,
      success: function (res) {
        if (res.confirm) {
          common.get('/recover/change_recover_book', {
            member_id:  wx.getStorageSync('member_id'),
            order_id: id1,
            integral:integral_book
          }).then(res => {
            if(res.data.code == 200){
              wx.showToast({
                title: '操作成功！',
                icon: 'success',
                duration: 1000
              })
              that.getbookInfo();
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
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
  //设置邮寄费用隐藏
  setDeliveryPriceHide(e) {
    let that = this;
    that.setData({
      setDeliveryPrice: true
    })
  },
  //输入积分
  currentDeliveryPrice(e) {
    let that = this;
    that.setData({
      currentPrice: e.detail.value
    })
  },
  //设置积分
  setDeliveryPrice(e) {
    let that = this;
    let end_money = that.data.currentPrice;
    let pay_mode = that.data.pay_mode;

    if (end_money.length < 1 && end_money <= 0 && end_money == '') {
      wx.showToast({
        title: '请输入您要修改的积分！',
        icon: 'none',
      })
      return;
    }
    common.post('/recover/changeOrderStatus', {
      member_id: wx.getStorageSync('member_id'),
      status: that.data.status,
      order_id: that.data.id,
      end_money
    }).then(res => {
      if (res.data.errno == 0) {
        wx.showToast({
          title: '操作成功！',
          icon: 'success',
          duration: 1000,
          success: function () {
            that.setData({
              setDeliveryPrice: true,
              currentDeliveryPrice: ''
            })
          }
        })
        that.getOrderInfo()
      }else if(res.data.errno == 202) {
        console.log(202)
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000,
          success: function () {
            that.setData({
              setDeliveryPrice: true,
            })
          }
        })
      }
    }).catch(e => {
      that.setData({
        currentDeliveryPrice: ''
      })
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })

  },
  //前往订单评价
  goToOrderComment(e) {
    let url = "/pages/markorder/markorder?tid=" + e.currentTarget.dataset.id;
    wx.navigateTo({
      url: url
    })
  },
    // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log(e)
    let that = this
    that.setData({
      statusTab: 1,
      ['identify.status']: '5',
      pageIndex: 1,
      pageSize: 20,
      hasMore: true,
      list:[],
      booklists: [],
      orderlists: [],
      jiuyi_lists:[],
      ahs_lists:[],
      dataStatus: false,
    })
    var cur = e.currentTarget.dataset.current;
    that.setData({
      currentTab : e.currentTarget.dataset.current
    })
    if (cur == 0) {
      console.log(that.data.cur)
      //普通回收
      that.setData({
        qwe: 1,
      })
      that.getOrderInfo();
    } else if (cur == 1) {
      //图书回收
      that.setData({
        qwe: 0,
      })
      that.getbookInfo();
    }else if (cur == 2){
      that.getlibararyinfo();
    }else if (cur == 3){
      that.getjiuyiinfo();
    }else if (cur == 4){
      that.getahsinfo();
    }
  },

  // 获取旧衣订单数据
  getjiuyiinfo(){
    let that = this;
    common.get("/fmy/index",{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let data = res.data.data.list;// 获取存储总数据
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
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 获取家电回收
  getahsinfo(){
    let that = this;
    common.get("/ahs/index",{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let data = res.data.data.list;// 获取存储总数据
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
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },

  // 图书邮送订单
  getlibararyinfo(){
    let that = this;
    common.get("/book_integral/mail_order",{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
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
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  makeCall(e){
    let that = this;
    let phone = e.currentTarget.dataset.phone;
    console.log(e)
    if(phone == 'null'){
      phone = '010-84672332'
    }else{
      phone = e.currentTarget.dataset.phone
    }
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  // 点击飞蚂蚁旧物回收取消订单
  clickQXDD(e){
    console.log(e)
    let that = this;
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let jiuyi_lists = that.data.jiuyi_lists;
    wx.showModal({
      title: '提示',
      content: '确定取消吗？',
      success: function (res) {
        if (res.confirm) {
          common.get('/fmy/cancel', {
            member_id: wx.getStorageSync('member_id'),
            order_sn: item.order_fmy_num, // 飞蚂蚁订单号
            reason:'取消订单', // 取消原因
          }).then(res => {
            if(res.data.code == 200){
              wx.showToast({
                title: '操作成功！',
                icon: 'success',
                duration: 1000
              })
              jiuyi_lists[index].status = 20;
              jiuyi_lists[index].status_str = '已取消';
              that.setData({
                jiuyi_lists
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
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
  openPhoto: function(event) { //打开图片
    let that = this;
    that.setData({
      layer: true,
      preview: event.currentTarget.dataset.url,
      previewIndex: event.currentTarget.dataset.index
    });
  },
  closePic: function() { //关闭图片
    let that = this;
    that.setData({
      layer: false
    });
  },
})