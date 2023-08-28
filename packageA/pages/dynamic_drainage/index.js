const common = require("../../../assets/js/common");
const publicMethod = require('../../../assets/js/publicMethod');

// packageA/pages/dynamic_drainage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type_moving: 0,
    sele_info_moving:'',
    is_bullet:false,
    yulian_info:{},
    is_limit:false,
    items: [
      {value: '5', name: '5小时'},
      {value: '9', name: '9小时'},
      {value: '12', name: '12小时'},
      {value: '24', name: '24小时'},
    ],
    select_time:0,
    balance3: 0,
    ad_balance3: 0,
    is_promlines: false,
    latitude: '',
    longitude: '',
    is_block:true,
    copywrite:'',
    is_textarea:true
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
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);

    let sele_info_moving = wx.getStorageSync('sele_info_moving');
    let select_type_moving = wx.getStorageSync('select_type_moving');
    that.setData({
      sele_info_moving,
      select_type_moving,
    })
    if(select_type_moving == 1){
      that.setData({
        copywrite: sele_info_moving.desc?sele_info_moving.desc:''
      })
    }else if(select_type_moving == 2){
      that.setData({
        copywrite: sele_info_moving.sign?sele_info_moving.sign:''
      })
    }
    console.log(that.data.sele_info_moving)
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
  gotosele(){
    wx.navigateTo({
      url: '/packageA/pages/tool_choosepages/index',
    })
  },
  // 预览
  yulan_moving(e){
    console.log(e)
    let that = this;
    let select_type = e.currentTarget.dataset.select_type;
    let coupon_id = e.currentTarget.dataset.id;
    let dis_id = e.currentTarget.dataset.discount_id;
    let select_type_moving = that.data.select_type_moving;
    if(!select_type_moving){
      wx.showToast({
        title: '请先选择要推广的商品/优惠券',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
    })

    if(select_type == 1){
      that.getshop(that,dis_id);
    }else if(select_type == 2){
      that.getcoupon(that,coupon_id);
    }

  },
  submit_btn(){
    let that = this;
    let select_type_moving = that.data.select_type_moving;
    if(!select_type_moving){
      wx.showToast({
        title: '请先选择要推广的商品/优惠券',
        icon: 'none'
      })
      return
    }else{
      that.setData({
        is_limit: true,
        is_textarea: false
      })
    }
    
  },
  getshop(t,dis_id){
    let that = t;
    let discount_id = dis_id;
    common.get('/business/getBusinessDiscount',{
      discount_id,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let cre_time = new Date();
        console.log(cre_time)
        that.setData({
          yulian_info:res.data.data[0],
          is_bullet: true,
          is_textarea: false
        })
        console.log(that.data.yulian_info)

      }else{
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();

      console.log(e)
    })
  },
  getcoupon(t,coupon_id){
    let that = t;
    let id = coupon_id;
    common.get('/coupon/details',{
      id,
    }).then(res =>{
      wx.hideLoading();

      if(res.data.code == 200){
        let cre_time = new Date();
        console.log(cre_time)
        that.setData({
          yulian_info:res.data.data[0],
          is_bullet: true,
          is_textarea: false
        })
      }else{
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();

      console.log(e)
    })
  },
  islayer(){
    this.setData({
      is_bullet: false,
      is_textarea: true
    })
  },
    // 设置推广有效期弹窗
    radioChange(e) {
      let that = this;
      const items = that.data.items
      for (let i = 0, len = items.length; i < len; ++i) {
        items[i].checked = items[i].value === e.detail.value
      }
      that.setData({
        items,
        select_time:e.detail.value,
        total_price: e.detail.value == 24? Number(199).toFixed(2) : Number(e.detail.value*19.9).toFixed(2),
      })
      console.log(that.data.select_time)
    },
    // 推广期限弹窗确认按钮
    limit_btn(){
      let that = this;
      let select_time = that.data.select_time;
      if(select_time == 0){
        wx.showToast({
          title: '请选择推广时长',
          icon:'none',
        })
        return
      }else{
        that.getad_balance();
        that.setData({
          is_limit:false,
          is_promlines: true,
        })
      }
    },
    getad_balance(){
      let that = this;
      common.get('/ad/index',{
        member_id: wx.getStorageSync('member_id'),
      }).then(res =>{
        if(res.data.code == 200){
          that.setData({
            balance3: res.data.data.balance3,
            ad_balance3: res.data.data.ad_balance3
          })
        }
      }).catch(e =>{
        console.log(e)
      })
    },
    is_limit_layer(){
      let that = this;
      that.setData({
        is_limit: false,
        is_textarea: true
      })
    },
    is_promlines_layer(){
      let that = this;
      that.setData({
        is_promlines: false,
        is_textarea: true
      })
    },
    promlines_btn(){
      let that = this;
      let all_info = wx.getStorageSync('sele_info_moving'); // 商品对象数据
      let select_type = wx.getStorageSync('select_type_moving');// 商品或者优惠券 1 商品 2 优惠券
      let select_id = all_info.discount_id || all_info.id; // 商品或者优惠券id
      let is_block = that.data.is_block; 
      let select_time = that.data.select_time; // 推广时间
      let copywrite = that.data.copywrite; // 推广文案
      if(!is_block){
        wx.showToast({
          title: '请勿重复提交！',
          none:'none'
        })
        return
      }
      that.setData({
        is_block:false,
      })
      let pream = {
        select_id,
        select_type,
        time: select_time,
        member_id:wx.getStorageSync('member_id'),
        pay_member_id:wx.getStorageSync('member_id'),
        type: 2,
        lng: that.data.longitude,
        lat: that.data.latitude,
        copywrite,
      };
      // if(pream.select_type == '2'){
      //   pream.coupon_id = select_id
      // }
      common.post("/referraltraffic/add",pream).then(res =>{
        if(res.data.code == 200){
          that.setData({
            is_promlines:false,
            is_textarea: true
          })
          wx.setStorageSync('sele_info_moving',{});
          wx.setStorageSync('select_type_moving','');
          wx.showToast({
            title: '投放成功！',
            icon:'none',
            duration: 2000
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/circle/circle',
            })
          },1500)
          // that.progress_bar();
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration: 2000
          })
          that.setData({
            is_block:true,
          })
        }
      }).catch(e =>{
        that.setData({
          is_block:true
        })
        console.log(e)
      })
    },
    getcopywrite(e){
      let that = this;
      console.log(e)
      that.setData({
        copywrite: e.detail.value
      })
    }
})