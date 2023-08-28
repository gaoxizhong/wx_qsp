const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business_info:{},
    z_integral: 0.00,
    z_money: 0.00,
    chooseAmountList:[
      {id:1,money:1000},
      {id:2,money:2000},
      {id:3,money:5000},
    ],
    select_money:0, // 选择金额下标
    money:'',  // 选中的钱数
    inputMoney:'',
    list: [], //  分店列表
    selectilall: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let chooseAmountList = that.data.chooseAmountList;
    let select_money = that.data.select_money;
    that.setData({
      money: chooseAmountList[select_money].money
    })
    that.getbuyintegrallist(that.getbranch_list);
  },
  // 获取店铺id
  getbuyintegrallist(f){
    let that = this;
    common.get('/content/getMemberInfo',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          business_info:res.data.business_info,
        })
        return f(res.data.business_info.id)
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 获取分店列表
  getbranch_list(b){
    let that = this;
    common.get('/businessbranch/index?op=branch_list',{
      main_store:b,
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          list:res.data.data.branch,
          z_integral: res.data.data.integral,
          z_money: res.data.data.money
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 选择钱数
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
        money: chooseAmountList[index].money
      })
    }
    that.setData({
      select_money: index,
    })
    console.log(that.data.money)
  },
  inputMoney(e){
    this.setData({
      money: e.detail.value
    })
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
  onShareAppMessage: function () {

  },
  //单选
  select: function (e) {
    let selectValue = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index;
    let list = this.data.list
    let newli = 'list[' + index + '].checked';
    this.setData({
      [newli]: !this.data.list[index].checked
    })
    let num = 0;
    for(var i=0;i<this.data.list.length;i++){
      if(this.data.list[i].checked){
        num++;
      }
    }
    if(num == this.data.list.length){
      this.setData({
        selectilall: true
      })
    }else{
      this.setData({
        selectilall: false
      })
    }
  },
  //全选，取消全选
  selectAll: function (e) {
    let list = this.data.list;
    let selectilall = this.data.selectilall;
    if (selectilall == false) {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list[' + i + '].checked';
        this.setData({
          [newli]: true,
          selectilall: true
        })
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list[' + i + '].checked';
        this.setData({
          [newli]: false,
          selectilall: false
        })
      }
    }
  },
  submit_btn(){
    let that = this;
    let list = that.data.list;
    let datalist = [];
    list.forEach( el =>{
      if(el.checked){
        datalist.push(el.id)
      }
    })
    common.post('/businessbranch/index?op=transfer_branch',{
      main_store: that.data.business_info.id,
      bus_list: datalist,
      type:'1',
      amount: that.data.money
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  }
})