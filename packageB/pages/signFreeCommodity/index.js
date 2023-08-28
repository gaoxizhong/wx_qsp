// packageB/pages/signFreeCommodity/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareimg:[  // 分享的用户头像列表
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
      {image:'',name:''},
    ],
    columnSeleted:'2', // 选择兑换方式按钮数据
    chooseShoplist:[ // 商品列表
      {id:1,goodnum:0,title:'OCE悦色彩妆盘化妆品组合化妆盒大地色',image:"https://oss.qingshanpai.com/banner/signin_5.jpg",imageNum:6,price:100},
      {id:2,goodnum:0,title:'OCE悦色彩妆盘化妆品组合化妆盒大地色',image:"https://oss.qingshanpai.com/banner/signin_5.jpg",imageNum:6,price:100},
      {id:3,goodnum:0,title:'OCE悦色彩妆盘化妆品组合化妆盒大地色',image:"https://oss.qingshanpai.com/banner/signin_5.jpg",imageNum:6,price:100},
      {id:4,goodnum:0,title:'OCE悦色彩妆盘化妆品组合化妆盒大地色',image:"https://oss.qingshanpai.com/banner/signin_5.jpg",imageNum:6,price:100},
      {id:5,goodnum:0,title:'OCE悦色彩妆盘化妆品组合化妆盒大地色',image:"https://oss.qingshanpai.com/banner/signin_5.jpg",imageNum:6,price:100},
      {id:6,goodnum:0,title:'OCE悦色彩妆盘化妆品组合化妆盒大地色',image:"https://oss.qingshanpai.com/banner/signin_5.jpg",imageNum:6,price:100},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 点击选择兑换方式按钮
  chooseWayBtn(e){
    this.setData({
      columnSeleted: e.currentTarget.dataset.id
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
  onShareAppMessage: function () {

  },
  // 前往商品详情页
  goToshopActivity(e){
    let that = this;
    app.data.signShopInfo = {};
    let id = e.currentTarget.dataset.id;
    let chooseShoplist = that.data.chooseShoplist;
    let signShopInfo = {};
    chooseShoplist.forEach(ele =>{
      if(id == ele.id) {
        signShopInfo = ele
      }
    })
    app.data.signShopInfo = signShopInfo;
    wx.navigateTo({
      url: '/packageB/pages/signFreeComm_activi/index',
    })
  },

  // 选择商品
  chooseLibrary(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let chooseShoplist = that.data.chooseShoplist;
    let choseChange = "chooseShoplist[" + index + "].checked";
    let info_checked = chooseShoplist[index].checked;
    console.log(info_checked)
    if(info_checked==true){
      that.setData({
        [choseChange]: ''
      })
    }else{
      that.setData({
        [choseChange]: true
      })
    }
    console.log(that.data.chooseShoplist);
  },
})