const common = require('../../../assets/js/common');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acquisitionList:[], //  收购积分列表
    longitude:'',
    latitude:'',
    pageSize: 10,
    pageIndex: 1,
    hasMore:true,
    my_record: null,
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
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude : Number(res.latitude),
          longitude : Number(res.longitude)
         })
         var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
         that.setData({
           longitude: gcj02tobd09[0],
           latitude: gcj02tobd09[1]
         })
        that.getacquisitionList();  //  获取商家收购列表数据

      },
      fail: function(res) {
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getacquisitionList();  //  获取商家收购列表数据

      }
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
    let that = this;
    that.setData({
      acquisitionList:[],
      pageIndex:1,
      hasMore:true
    })
    that.getacquisitionList();
    // wx.getLocation({
    //   type: 'wgs84',
    //   success:function(res){
    //     var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
    //     that.setData({
    //       longitude: gcj02tobd09[0],
    //       latitude: gcj02tobd09[1]
    //     })
    //     that.getitemslist();
    //   },
    //   fail: function(res) {
    //     wx.showModal({
    //       title: '需要开启手机定位',
    //       content: '请前去开启GPS服务',
    //       showCancel:false,
    //       success (res) {
    //         if (res.confirm) {
    //           console.log('用户点击确定')
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })
    //     that.setData({
    //       latitude: '',
    //       longitude: ''
    //     })
    //     if (res.errMsg == "getLocation:fail auth deny") {
    //       that.openSetting(that)
    //     }
    //     that.getitemslist();
    //   }
    // })
    wx.stopPullDownRefresh();
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
  // 获取项目列表
  // getacquisitionList(){
  //   let that = this;
  //   let page = that.data.pageIndex;
  //   if (!that.data.hasMore) {
  //     wx.showToast({
  //       title: '已加载全部数据',
  //       icon: 'none'
  //     })
  //     return
  //   }
  //   wx.showLoading({
  //     title: '加载中...',
  //   })
  //   common.get('', {
  //     member_id: wx.getStorageSync('member_id'),
  //     lng: that.data.longitude,
  //     lat: that.data.latitude,
  //     page,
  //   }).then(res => {
  //     if (res.data.code == 200) {
  //       wx.hideLoading();
  //       let pageSize = res.data.data.pageSize;
  //       let count = res.data.data.count;
  //       let flag = that.data.pageIndex * pageSize < count;
  //       that.setData({
  //         is_publisher: res.data.data.is_publisher,
  //         items_list: that.data.items_list.concat( res.data.data.array ),
  //         hasMore: flag,
  //       })
  //       if(that.data.items_list.length <= 0){
  //         wx.showToast({
  //           title: '暂无数据',
  //           icon:'none',
  //           duration:5000
  //         })
  //       }
  //     }else{
  //       wx.hideLoading();
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon:'none'
  //       })
  //     }
  //   }).catch(e => {
  //     wx.hideLoading();
  //     app.showToast({
  //       title: "数据异常"
  //     })
  //   })
  // },
  getacquisitionList(){
    let that = this;
    common.get('/task/index?op=task_list',{
      member_id: wx.getStorageSync('member_id'),
      lng : that.data.longitude,
      lat : that.data.latitude
    }).then(res =>{
      if(res.data.code == 200){
        let acquisitionList = res.data.data.list;
        acquisitionList.forEach(ele =>{
          ele.is_tsbtn = true;
        })
        that.setData({
          acquisitionList,
          my_record: res.data.data.my_record,
        })
      }else{
        console.log(res.data.msg)
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 点击大量收购
  getDlAcquisition(e){
    console.log(e)
    let that = this;
    let my_record = that.data.my_record;
    if( my_record ){
      wx.showToast({
        title: '你有一个任务正在进行中，请先去完成任务',
        icon:'none',
        duration: 2000
      })
      return
    }
    let index = e.currentTarget.dataset.index;
    let acquisitionList = that.data.acquisitionList;
    let taskinfo = acquisitionList[index];
    wx.setStorageSync('taskinfo', taskinfo);
    wx.navigateTo({
      url: '/packageA/pages/dlAcquisition/index',
    })
  },
  // 点击小量收购
  smallAcquisition(e){
    let that = this;
    console.log(e)
    let task_id = e.currentTarget.dataset.id;
    let select_type = e.currentTarget.dataset.select_type;
    let select_id = e.currentTarget.dataset.select_id;
    let business_id = e.currentTarget.dataset.business_id;
    let peram = {
      member_id: wx.getStorageSync('member_id'),
      business_id,
      task_id,
      type: '1'
    };
    common.get('/task/index?op=create_record',peram).then(res =>{
      if(res.data.code == 200){
        // wx.showToast({
        //   title: res.data.msg,
        //   icon:'none'
        // })
        setTimeout(() => {
          // 商品
          if(select_type == '1'){
            wx.navigateTo({
              url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('memner_id') + "&discount_id=" + select_id  + '&jiage=0.2'+ '&is_smallacqu=1',
            })
          return
          }
          // 优惠券
          if(select_type == '2'){
            wx.navigateTo({
              url: "/packageA/pages/coupon_detail/index?id=" +  select_id + '&jiage=0.2' + '&is_smallacqu=1',
            })
          return
          }
        },1000)

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
  gotosgtask(){
    wx.navigateTo({
      url: '/packageA/pages/dlAcquisition/index',
    })
  },
  clickIscsbtn(e){
    let that = this;
    let acquisitionList = that.data.acquisitionList;
    let index = e.currentTarget.dataset.index;
    acquisitionList[index].is_tsbtn = false;
    that.setData({
      acquisitionList
    })
  }
})