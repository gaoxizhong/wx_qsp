const common = require("../../../../assets/js/common")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beusedList: [],
    pageIndex: 1,
    pageSize: 15,
    hasMore: true,
    list:[],
    is_member:'',
    my_coin:0, // 可用余额
    num_coin:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      is_member: options.is_member
    })
    that.getbeusedList();
    // 获取可用余额
    that.getCodeSession();

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      list:[],
      beusedList:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getbeusedList();

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
  getbeusedList(){
    let that = this;
    common.get('/life/index?op=order_list',{
      member_id: wx.getStorageSync('member_id'),
      official_type:'1'
    }).then(res =>{
      if(res.data.code == 200){
        let data = res.data.data.list;// 获取存储总数据
        data.forEach(ele => {
          ele.goodnum = 1
        });
        // that.setData({
        //   beusedList
        // })
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
      beusedList: that.data.beusedList.concat(list[page]),
      hasMore: flag,
    })
  },
  // 点击抵扣余额
  inputnumCoin(e){
    let that = this;
    let num = e.detail.value;
    if( num > Number(that.data.my_coin) ){
      that.setData({
        num_coin: that.data.my_coin
      })
    }
    if(num > 20 ){
      wx.showToast({
        title: '不得超过20元！',
        icon:'none'
      })
      that.setData({
        num_coin: 20
      })
    }else{
      that.setData({
        num_coin: e.detail.value
      })
    }
  },
  inputValue(e){

    let that = this;
    let beusedList = that.data.beusedList;
    let index = e.currentTarget.dataset.index; // 订单id
    let num = Number(e.detail.value);
    let valid_num = Number(beusedList[index].card.valid_num);
    if( num > valid_num){
      wx.showToast({
        title: '不得超过待使用数！',
        icon:'none'
      })
      beusedList[index].goodnum = valid_num;
      that.setData({
        beusedList
      })
    }else{
      beusedList[index].goodnum = num;
      that.setData({
        beusedList
      })
    }

  },
  // 点击增加
  addNum(e) {
    let that = this;
    let beusedList = that.data.beusedList;
    let o_id = e.currentTarget.dataset.o_id; // 订单id
    beusedList.forEach(ele =>{
      if(ele.id == o_id){
        if( ele.goodnum >= ele.card.valid_num){
          wx.showToast({
            title: '不得超过待使用数！',
            icon:'none'
          })
        }else{
          ele.goodnum++ 
        }
      }
    })
    that.setData({
      beusedList
    })
  },
  // 点击减少
  minusNum(e) {
    let that = this;
    let beusedList = that.data.beusedList;
    let o_id = e.currentTarget.dataset.o_id; // 订单id
    beusedList.forEach(ele =>{
      if(ele.id == o_id){
        if( ele.goodnum >= ele.card.valid_num){
          wx.showToast({
            title: '不得超过待使用数！',
            icon:'none'
          })
        }else if(ele.goodnum <= 1 ){
          wx.showToast({
            title: '数量最少为1',
            duration: 1000,
            icon: 'none'
          })
        }else{
          ele.goodnum--
        }
      }
    })
    that.setData({
      beusedList
    })
  },

  //点击核销
  clickQx(e){
    let that = this;
    let beusedList = that.data.beusedList;
    let  card_id = e.currentTarget.dataset.c_id; // 会员卡id
    let  o_id = e.currentTarget.dataset.o_id; // 订单id
    let my_coin = that.data.num_coin; // 可兑换余额
    let num = 0;
    beusedList.forEach(ele =>{
      if(ele.id == o_id){
        num = ele.goodnum
      }
    })
    wx.showModal({
      title: '确认核销',
      content: '到店请工作人员当面核销！',
      success(res) {
        if (res.confirm) {
          common.get('/life/index?op=confirm_project_card',{
            member_id:wx.getStorageSync('member_id'),
            card_id,
            num,
            coin_value: my_coin
          }).then(res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '核销成功',
              })
              setTimeout(() => {
                // let beusedList = that.data.beusedList;
                // beusedList.forEach(ele =>{
                //   if(ele.id == order_id){
                //     ele.goodnum -= num;
                //   }
                // })
                // that.setData({
                //   beusedList
                // })
                that.setData({
                  list:[],
                  beusedList:[],
                  pageIndex: 1,
                  hasMore: true,
                })
                that.getbeusedList();
                // 获取可用余额
                that.getCodeSession();
              }, 1000);

            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          }).catch(e =>{
            console.log(e)
          })
        } else if (res.cancel) {
          console.log('点击了取消')
        }
      }
    })
  },
  userMember(e){
    let c_id = e.currentTarget.dataset.c_id;
    let type = e.currentTarget.dataset.type;

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      c_id,
      c_name: type == '1'?'基础卡':'畅玩卡'
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  // 获取可用余额
  getCodeSession(){
    let that = this;
    common.get('/life/index?op=check_num', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          my_coin:res.data.data.my_coin, // 我的余额
        });
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
  },
})