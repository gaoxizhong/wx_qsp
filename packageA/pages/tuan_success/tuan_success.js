const app = getApp()
const common = require('../../../assets/js/common');
var WxParse = require('../../../wxParse/wxParse.js');
const setting = require('../../../assets/js/setting');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    copy_business:'',
    business_id:'',
    discount_id:'',
    is_tuan:'',
    img:[],
    gdImages:'',
    need_num:0,
    tuan_order_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.business_id){
      this.setData({
        business_id:options.business_id,
        discount_id:options.discount_id,
        is_tuan:options.is_tuan,
        member_id: wx.getStorageSync('member_id'),
      })
    }
    if(options.tuan_order_id){
      this.setData({
        tuan_order_id:options.tuan_order_id
      })
    }
      //获取单个的活动/商品
    this.getOneDiscount();
    this.get_need_num();
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
  //获取单个的活动/商品
  getOneDiscount() {
    let that = this;
    let copy_business = that.data.copy_business;
    console.log(copy_business)
    let param = {
      business_id: that.data.business_id,
      discount_id: that.data.discount_id,
      copy_business: copy_business,
    }
    common.get("/business/getBusinessDiscount", param).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          activityInfo: res.data.data[0],
          business_id: res.data.data[0].business_id,
          title: res.data.data[0].title,
          bal_count: res.data.data[0].bal_count,
          discount_price: res.data.data[0].discount_price,
          start_time: res.data.data[0].start_time,
          end_time: res.data.data[0].end_time,
          desc: res.data.data[0].desc,
          img: res.data.data[0].img,
          info: res.data.data[0].info,
          type: res.data.data[0].type,
          bought: res.data.data.bought,
          tuan_price: res.data.data[0].tuan_price,
          tuan_num:res.data.data[0].tuan_num,
          saled_num:res.data.data[0].saled_num,
          num:(res.data.data[0].tuan_num - 0 )- (res.data.data[0].saled_num - 0)
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1500,
          icon: 'none'
        })
      }
    })
  },
  get_need_num() {
    let that = this;
    let tuan_order_id = that.data.tuan_order_id;
    common.get("/service/get_need_num", {
      tuan_order_id,
    }).then( res => {
      if ( res.data.code == 200 ) {
          that.setData({
            need_num:res.data.data
          })
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 1500,
          icon: 'none'
        })
      }
    })
  },
  onShareAppMessage: function (res) { //分享
    console.log(res)
      let that = this
      if (res.target) {
        if (res.from === 'button') {
            let url = '/pages/dicount_good/dicount_good?business_id=' + that.data.business_id + '&member_id=' + that.data.member_id + '&discount_id=' + that.data.discount_id + '&is_tuan=' + that.data.is_tuan + '&is_type=join' +'&tuan_order_id='+that.data.tuan_order_id +'&need_num='+that.data.need_num;
            let need_num = that.data.need_num;
            let img = that.data.img;
            for(var i=0;i<=img.length;i++){
              that.setData({
                gdImages:img[0]
              })
            }
            console.log(that.data.gdImages)
            return {
              title: '【还差'+ need_num +'份】帮我拼一下！商品很优惠喔！千万别错过',
              path: url,
              imageUrl: that.data.gdImages,
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
            path: '/pages/dicount_good/dicount_good?business_id=' + that.data.business_id + '&member_id=' + that.data.member_id + '&discount_id=' + that.data.discount_id + '&is_tuan=' + that.data.is_tuan+ '&type=join',
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
    goTodingdan(){
      wx.navigateTo({
        url:"/pages/myDicountOrder/myDicountOrder?type=1&status=",
      })
    }
})