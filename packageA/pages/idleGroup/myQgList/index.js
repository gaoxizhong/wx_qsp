const app = getApp();
const common = require('../../../../assets/js/common');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    full_listdata:[],
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
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
      let that = this;
      that.setData({
        member_id: wx.getStorageSync('member_id'),
        full_listdata:[],
      })
      that.getData();
  },
  getData() { //初始化数据
    let that = this
    that.getUserIdentify();
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        console.log(res)
        that.setData({
         latitude : Number(res.latitude),
         longitude : Number(res.longitude)
        })
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        // 附近求购
        that.getfull_list();
      },
      fail: function(res) {
        wx.showModal({
          title: '需要开启手机定位',
          content: '请前去开启GPS服务',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
         that.getfull_list();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })

  },
  //获取登录人的身份
  getUserIdentify() {
    let that = this;
    let prems = {
      member_id: wx.getStorageSync('member_id'),
    }
    common.get("/member/getMemberIdentity", prems).then(res => {
      if (res.data.code == 200) {
        that.setData({
          avatarUrl: res.data.avatar,
          nickName: res.data.nickname
        })
      }
    })
  },
    // 求购闲置列表
    getfull_list(){
      let that = this
      wx.showLoading({
        title: '加载中...',
      })
      common.get('/idle/idle_purchase',{
        member_id: wx.getStorageSync('member_id'),
        page: 1,
        lng: that.data.longitude,
        lat: that.data.latitude,
      }).then(res => {
        if(res.data.code == 200){
          wx.hideLoading();
          let result = res.data.data.result;
          that.setData({
            full_listdata: result,
          });
        }
      }).catch(e => {
          app.showToast({
            title: e.data.msg,
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
  
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if(pageslist && pageslist.length > 1) {
      wx.navigateBack({delta: -1});
    } else {
      wx.reLaunch({ url: "/pages/getalllist/getalllist"});
    }
  },
  getinfo_phone(e){
    let that = this;
    let idle_purchase_id= e.target.dataset.id;
    let member_id= wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      return
    }
    common.get('/idle/is_phone',{
      idle_purchase_id,
      member_id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          marsk1: true,
          marsk_name: res.data.data.name,
          marsk_tel: res.data.data.mobile,
        })
      }else if(res.data.code == 206){
        wx.showModal({
          title: '查看电话',
          content: '需支付30积分查看',
          success: function (res) {
            if (res.confirm) {
              common.get('/idle/idle_purchase_phone', {
                idle_purchase_id,
                member_id
              }).then(res => {
                if (res.data.code == 206) {
                  wx.showModal({
                    title: res.data.msg,
                    content: '请先赚取积分',
                    showCancel:false
                  })
                }
                if (res.data.code == 200) {
                  that.setData({
                    marsk1: true,
                    marsk_name: res.data.data.name,
                    marsk_tel: res.data.data.mobile,
                  })
                }

              })
            } else if (res.cancel) {
              console.log('点击了取消')
            }
          }
        })
      }
    })


  },
  delt_btn(e){
    console.log(e)
    let that = this;
    wx.showModal({
      title: '删除信息',
      content: '是否要删除此条信息',
      success(res) {
        if (res.confirm) {
          common.get('/idle/idle_purchase_del', {
            id: e.target.dataset.id
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
              })
              that.setData({
                release_marsk: false,
                full_listdata: [],
                pageIndex: 1,
                hasMore_full: true,
                fullStatus: false,
              })
              that.getfull_list();
            }
            if (res.data.code == 206) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }).catch(error => {
            console.log(error);
          })
        } else if (res.cancel) {
          console.log('点击了取消')
        }
      }
    })
  },
  left_btn(){
    this.setData({
      marsk1: false,
    })
  },
  /**调用电话 */
  tel: function () {
    if (this.data.marsk_tel != null) {
      wx.makePhoneCall({
        phoneNumber: this.data.marsk_tel,
      })
    } else {
      app.showToast({
        title: "暂无联系电话"
      })
    }
  },
})