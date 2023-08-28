const app = getApp()
const common = require('../../../../assets/js/common');
Page({
  data: {
    winHeight: "",
    start_time: '',
    end_time: '',
    status: '',
    type: '',
    official: '',  //来源：官方1，非官方0
    pageNo: 1,
    pageSize: 20,
    orderList: [],
    totalCount: 0,
    canLoadMore: true,
    showOrderList: true,  //展示订单
    orderSum: '',  //总收支
    group_id:''
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      group_id: options.group_id,
      member_id: wx.getStorageSync('member_id'),
    })
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight;
        var calc = clientHeight - 200;
        console.log(calc)
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
    that.fun_date(-7);
    that.getOrderList();
  },
  startTime(e) {
    console.log(e.detail.value,'开始时间');
    this.setData({
      start_time: e.detail.value
    })
  },
  endTime(e) {
    console.log(e.detail.value,'结束时间');
    this.setData({
      end_time: e.detail.value
    })
  },
  statusChange(e) {
    console.log(e.detail.value,'类型选择');
    this.setData({
      status: e.detail.value
    })
  },
  officialChange(e) {
    this.setData({
      official: e.detail.value
    })
  },
  typeChange(e) {
    this.setData({
      type: e.detail.value
    })
  },
  //点击查询按钮便重置信息
  resetSearch() {
    this.setData({
      pageNo: 1,
      totalCount: 0,
      orderList: [],
      canLoadMore: true,
      showOrderList: true
    })
    this.getOrderList();
  },

  getOrderList() {
    let that = this;
    let params = {
      member_id: that.data.member_id,
      group_id: that.data.group_id
    }
    console.log(params)
    wx.showLoading({
      title: '正在查询...'
    })

    common.get("/idlegroup/join_list",params).then( res => {
      wx.hideLoading();
      console.log(res);
      if ( res.data.code == 200 ) {
        console.log("获取成功")
        let orderList = res.data.data;
        that.setData({
          orderList: orderList,
        })
      }
    }).catch( error => {
      wx.hideLoading();
      app.showToast({
        title: "数据异常！"
      })
    })
  },



  //查询历史订单
  // getOrderList() {
  //   let that = this;
  //   if (!that.data.canLoadMore) {
  //     return;
  //   }
  //   if ( (that.data.pageNo-1) * that.data.pageSize > that.data.totalCount ) {
  //     console.log('不加载了');
  //     that.setData({
  //       canLoadMore: false
  //     })
  //     wx.showToast({
  //       title: '没有更多了！',
  //       duration: 1500,
  //       icon: 'none'
  //     })
  //     return;
  //   }
  //   let params = {
  //     member_id: that.data.member_id,
  //     type: that.data.type,
  //     status: that.data.status,
  //     is_official: that.data.official,
  //     pageNo: that.data.pageNo,
  //     pageSize: that.data.pageSize,
  //     start_time: that.data.start_time,
  //     end_time: that.data.end_time
  //   }
  //   console.log(params)
  //   wx.showLoading({
  //     title: '正在查询...'
  //   })
  //   common.get("/environmental/bank/getMemberBankLog",params).then( res => {
  //     wx.hideLoading();
  //     console.log(res);
  //     if ( res.data.code == 200 ) {
  //       console.log("获取成功")
  //       let orderList = that.data.orderList.concat(res.data.data.datails);
  //       that.setData({
  //         orderList: orderList,
  //         totalCount: res.data.data.count,
  //         orderSum: res.data.data.sum
  //       })
  //     }
  //   }).catch( error => {
  //     wx.hideLoading();
  //     app.showToast({
  //       title: "数据异常！"
  //     })
  //   })
  // },
  getMore() {
    let that = this;
    console.log("到底了");
    let pageNo = that.data.pageNo+1;
    console.log(pageNo);
    that.setData({
      pageNo: pageNo
    })
    that.getOrderList();
  },
  //切换筛选状态
  changeCheck() {
    if ( this.data.showOrderList ) {
      this.setData({
        showOrderList: false
      })
    } else {
      this.setData({
        showOrderList: true
      })
    }
  },
  //上拉加载
  onReachBottom() {
    console.log("到底了")
    this.getMore();
  },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if(pageslist && pageslist.length > 1) {
      wx.navigateBack({delta: -1});
    } else {
      wx.reLaunch({url: "/pages/index/index"});
    }
  },
  fun_date(aa){
    let that = this;
    let date1 = new Date();
    // let getMonth = (date1.getMonth()+1);
    // let getDate = (date1.getDate()+1);
    let time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    let date2 = new Date(date1);
    date2.setDate(date1.getDate()+aa);
    let time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
    that.setData({
      end_time:time1,
      start_time:time2
    })
  }
})