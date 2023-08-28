const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    top_img:[],
    pop2:false,
    supe_idx:1,
    pagesurl:'',
    items: [
      {
        id: 1,
        name:'邮寄图书',
        url_1: '/packageA/image/book-point-1.png',
        url_2: 'http://oss.qingshanpai.com/banner/point-arrow-1.png',
        pagesUrl:'/packageA/pages/book_mailing/book_mailing',
      }, {
        id: 2,
        name:'送达图书馆',
        url_1: '/packageA/image/book-point-2.png',
        url_2: 'http://oss.qingshanpai.com/banner/point-arrow-2.png',
        pagesUrl:'/packageA/pages/sent_library/index',
      }, {
        id: 3,
        name:'上门收书',
        url_1: '/packageA/image/book-point-3.png',
        url_2: 'http://oss.qingshanpai.com/banner/point-arrow-3.png',
        pagesUrl:'/pages/book_store/book_store?tab=1',
      }
    ],
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        member_id: member_id,
        pop2: false
      })
    }

    if(that.data.supe_idx == 1){
      let that = this;
    that.setData({
      pagesUrl:'/packageA/pages/book_mailing/book_mailing'
    })
    }
    that.getData();
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
    //从banner图跳转 1为文章，2为商家，3为会话
    goToFromImg(e) {
      console.log(e)
      let dataset = e.currentTarget.dataset;
      if ( dataset.label == 1) {
        //跳转文章
        let url = "/pages/detail/detail?article_id=" + dataset.labelid;
        wx.navigateTo({
          url: url
        })
      } else if ( dataset.label == 2 ) {
        //跳转商家
        let url = "/pages/shop/shop?business_id=" + dataset.labelid;
        wx.navigateTo({
          url: url
        })
      } else if ( dataset.label == 3 ) {
        //发起会话
  
      }
    },
  getData(){
    this.getBannerUrls();
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/banner/newInfo', {
      member_id: that.data.member_id,
      type:16
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          top_img: res.data.data,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
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
  items_image(e){
    console.log(e)
    let that = this;
    let supe_idx = e.currentTarget.dataset.id;
    let pagesUrl = e.currentTarget.dataset.pagesurl;
    that.setData({
      supe_idx,
      pagesUrl,
    })
  },
  footer_btn(){
    let that = this;
    let supe_idx = that.data.supe_idx;
    let pagesUrl = that.data.pagesUrl;
    if(supe_idx == '3'){
      wx.showToast({
        title: '暂未开放！',
        icon:'none'
      })
      return
    }else{
      wx.navigateTo({
        url: pagesUrl,
      })
    }

  },
})