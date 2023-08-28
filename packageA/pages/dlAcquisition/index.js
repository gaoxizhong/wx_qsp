const common = require("../../../assets/js/common");

// packageA/pages/dlAcquisition/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseAmountList:[
      {id:1,jf:10,money:10,},
      {id:2,jf:50,money:50,},
      {id:3,jf:100,money:100,},
    ],
    select_money:0, // 下标
    jfcount:'',
    inputjfcount:'',
    money:'',
    people:0,
    width:'',
    run: null,
    run_task:{},
    taskinfo:{},
    is_run: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let chooseAmountList = that.data.chooseAmountList;
    let select_money = that.data.select_money;
    let newchooseAmountList = [];
    chooseAmountList.forEach(el =>{
      newchooseAmountList.push({
        id: el.id,
        jf: el.jf,
        money: el.money,
        people: Math.ceil(el.money/0.3)
      })
    })
    that.setData({
      chooseAmountList: newchooseAmountList,
      money: newchooseAmountList[select_money].money,
      jfcount: newchooseAmountList[select_money].jf,
      people: Math.ceil( (newchooseAmountList[select_money].money) /0.3 ),
    })
    let taskinfo = wx.getStorageSync('taskinfo');
    console.log(taskinfo)
    that.setData({
      taskinfo,
    })
  },
  // 选择投入
  select_money(e){
    let that = this;
    let chooseAmountList = that.data.chooseAmountList;
    let index = e.currentTarget.dataset.index;
    if(index > 2){
      that.setData({
        money: ''
      })
    }else{
      that.setData({
        money: chooseAmountList[index].money,
        jfcount: chooseAmountList[index].jf,
        people: Math.ceil( (chooseAmountList[index].money) /0.3 )
      })
    }
    that.setData({
      select_money: index,
    })
    console.log(that.data.money)
  },
  inputMoney(e){
    this.setData({
      jfcount: e.detail.value,
      inputjfcount:e.detail.value,
      money: e.detail.value,
      people: Math.ceil( e.detail.value /0.3 )
    })
    console.log(this.data.jfcount)
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
    let that =  this;
    that.getMyRecord();
    that.getaccountnumber();
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
          memberIdBank: res.data.data.memberIdBank,
          realAmount: res.data.data.realAmount,
          // hbb_add: res.data.data.hbb_add,
          m_name:res.data.data.m.nickname,
          m_avatar:res.data.data.m.avatar,
          m_qian:res.data.data.qian,
          jf: res.data.data.jf,
          df: res.data.data.df,
          t_money: res.data.data.t_money,
        })
      }
    }).catch(error => {
      console.log(error);
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this;
    let run = that.data.run;
    let run_task = that.data.run_task;
    let record_id = run.id;
    let select_id = run_task.select_id;
    let select_type = run_task.select_type;
    let pathUrl = '';
    // 商品
    if(select_type == '1'){
      pathUrl = "/pages/dicount_good/dicount_good?discount_id=" + select_id + '&record_id=' + record_id + '&is_taskShare=1';
    }
    // 优惠券
    if(select_type == '2'){
      pathUrl = "/packageA/pages/coupon_detail/index?id=" +  select_id + '&record_id=' + record_id + '&is_taskShare=1';
    }

    if (res.from === 'button') {
      return {
        title: '我正在收集绿能量，快来给我助力吧！',
        path: pathUrl,
        imageUrl: '',
        success: function (res) {
          // 转发成功
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: '我正在收集绿能量，快来给我助力吧！',
      path: pathUrl,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  getMyRecord(){
    let that = this;
    common.get('/task/index?op=my_record',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          is_run: res.data.data.is_run,
          run: res.data.data.run,
          run_task: res.data.data.run_task,
          width:res.data.data.is_run? ( res.data.data.run.help_count/res.data.data.run.count )*100 + '%'  : '0%'//  help_count助理数 count总数
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
  //  点击开始交易
  fixed_btn(){
    let that = this;
    common.post('/task/index?op=create_record',{
      member_id: wx.getStorageSync('member_id'),
      task_id: that.data.taskinfo.id,
      quota:that.data.jfcount,
      type:'2',
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          success (res) { 
            console.log('订阅消息成功');
            that.getMyRecord();
          },
          fail (er){
            console.log("订阅消息 失败 ");
            console.log(er);
            that.getMyRecord();
          }
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
  // 点击立即兑换
  settlement(){
    let that = this;
    common.post('/task/index?op=settlement',{
      member_id: wx.getStorageSync('member_id'),
      record_id: that.data.run.id,
    }).then(res =>{
      if(res.data.code == '200'){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        setTimeout(()=>{
          wx.reLaunch({
            url: '/pages/bank/bank',
          })
        },1500)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e=>{
      console.log(e)
    })
  },
  gotoIndex(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  imageerror(e){
    let run_task =  this.data.run_task;
    run_task.business.avatar  = '/images/notlogin.jpg';
    this.setData({
      run_task
    })
  }
})