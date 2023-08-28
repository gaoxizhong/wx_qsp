const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
var date = new Date();
const Makephoto = require('../../../../assets/js/setting');
const zhuan_dingwei = require('../../../../assets/js/dingwei.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newlists:[],
    estimate_weight: '',
    order_type:'1',
    goodid:0,
    user_name: '', //联系人
    user_phone: '', //联系电话
    garden: '', //所在小区
    user_street:'', // 街道
    user_address: '', //详细地址,点击结果项之后替换到文本框的值
    user_province: '', // 省市区
    user_city: '',  // 省市区 
    user_district: '',  // 省市区
    province_code:'', // 省市区 code值
    city_code:'',   // 省市区 code值
    district_code:'',   // 省市区 code值
    now_data:'',   // 当前日期
    now_time: '',   //  当前时间
    order_date: '',  // 选中日期
    order_time: '',  // 选中开始时间
    total: 0.00,
    payStatus: 1,
    payItems: [
      {
        id: 3,
        checked: !0,
        src: 'http://oss.qingshanpai.com/banner/integral.png',
        name: '环保积分'
      },{
        id:1,
        checked: !1,
        src: 'http://oss.qingshanpai.com/banner/icon-hove.png',
        name: '免费赠送'
      },{
       id: 4,
       checked: !1,
       src: 'http://oss.qingshanpai.com/banner/icon-people.png',
       name: '人民币'
     },{
        id: 2,
        checked: !1,
        src: 'http://oss.qingshanpai.com/banner/ecocoin.png',
        name: '环保币'
      },
    ],
    savaStatus:true,
    changer_address_pop:false,
    changer_time_pop:false,
    is_ad: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var Hours = date.getHours();
    var Minute = date.getMinutes();
    this.setData({
      now_data: year + '-' + month + '-' + day + '',
      now_time: Hours + ':' + Minute + ''
    })
    console.log(this.data.now_data)
    console.log(this.data.now_time)
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      payStatus:3,
    });
    this.getCategory();
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
      savaStatus:true,
    })
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
        // that.getCategory();
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
        // that.getCategory();
        if (res.errMsg == "getLocation:fail auth deny") {
          // that.openSetting(that)
        }
      }
    })

    for ( let i in that.data.payItems ) {
      that.data.payItems[i].checked = !1
    }
    if ( that.data.payStatus ) {
      let findIndex = that.data.payItems.findIndex( ele => {
        return ele.id == that.data.payStatus;
      })
      if ( findIndex != -1 ) {
        that.data.payItems[findIndex].checked = !0;
        that.setData({
          payItems: that.data.payItems
        });

      }

    }
    that.setData({
      payStatus: 3
    });
  },
  tapPay(e) {
    console.log(e)
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let id = e.currentTarget.dataset.id;
    let data = that.data.payItems;
    if(id == 2) {
      return wx.showToast({
        title: '暂不支持环保币兑换！',
        icon:'none'
      })
    }
    for (let i in data) {
      data[i].checked = !1
    }
    data[curIdx].checked = !0
    that.setData({
      payItems: data,
      payStatus: id
    })
    that.tongjiTot();
  },
  tongjiTot() {
    let that = this;
    let id = that.data.payStatus;
    let tem = 0;
    if (id == 3 || id == 2) { //环保积分
      tem = 100;
    }
    let tot = tem.toFixed(2);
    that.setData({
      total: tot
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
    // 活动数量列表点击事件
    changere(e){
      let that = this;
      let goodid = e.currentTarget.dataset.goods_id;
      that.setData({
        goodid,
      })
      console.log(goodid);
      that.tongjiTot();
    },
    // 姓名
    user_name(e){
      this.setData({
        user_name:e.detail.value
      })
    },
    // 电话
    user_phone(e){
      this.setData({
        user_phone:e.detail.value
      })
    },
    //  省市区
    saveGarden(e) {
      console.log(e)
      let province_code = e.detail.code[0];
      let city_code = e.detail.code[1];
      let district_code = e.detail.code[2];
      this.setData({
        garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2]),
        user_province: e.detail.value[0],
        user_city: e.detail.value[1],
        user_district: e.detail.value[2],
        province_code,
        city_code,
        district_code,
      })
    },
    // 街道
    user_street(e){
      this.setData({
        user_street:e.detail.value
      })
    },
    // 详细地址
    user_address(e){
      this.setData({
        user_address:e.detail.value
      })
    },
    // 选择日期
    dataPicker(e){
      console.log(e)
      let now_data = this.data.now_data;
      if(now_data == e.detail.value){
        console.log(1)
        this.setData({
          order_date: e.detail.value,
        })
      }else{
        console.log(2)
        this.setData({
          order_date: e.detail.value,
          now_time: '09:00'
        })
      }
    },
    starttimePicker(e){
      console.log(e)
      this.setData({
        order_time: e.detail.value
      })
    },
    // 提交订单
    savaData(){
      let that = this;
      let savaStatus = that.data.savaStatus;

      let perms ={
        member_id: wx.getStorageSync('member_id'),
        user_name: that.data.user_name,
        user_phone: that.data.user_phone,
        order_type: that.data.sel_type_id,
        order_info: that.data.goodid,
        order_date: that.data.order_date,
        order_time: that.data.order_time,

        user_province: that.data.user_province,
        user_city: that.data.user_city,
        user_district: that.data.user_district,
        user_address: that.data.user_address,
        user_street: that.data.user_street,
        province_code: that.data.province_code,
        city_code: that.data.city_code,
        district_code: that.data.district_code,
        pay_type: that.data.payStatus,
      }
      if(perms.pay_type == 3){
        perms.integral = 100
      }


      if(!perms.order_info || perms.order_info == ''){
        wx.showToast({
          title: '请先选择几成新！',
          icon:'none'
        })
        return
      }

      if (!savaStatus) {
        return
      }
      that.setData({
        savaStatus: false
      })
      common.post('/ahs/create',perms).then(res =>{
        console.log(res)
        if(res.data.code == 200){
          wx.showToast({
            title: '订单创建成功！',
            icon: 'success'
          })

          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/mine/myOrder/index?cur=4',
            })
          },2000)
        }else{
          wx.hideLoading();
          that.setData({
            savaStatus: true
          })
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
        
      }).catch(e => {
        that.setData({
          savaStatus: true
        })
        console.log(e)
      })
    },
    // 获取栏目
    getCategory() {
      let that = this;
      common.get("/ahs/index",{
        member_id: wx.getStorageSync('member_id'),
      }).then( res => {
        if ( res.data.code == 200 ) {
          that.setData({
            newlists: res.data.data.info_arr,
            cateList: res.data.data.type_arr,
            sel_type_id:res.data.data.info_arr[0].key,

            user_name: res.data.data.one?res.data.data.one.user_name:'',
            user_phone:  res.data.data.one?res.data.data.one.user_phone:'',
            user_province:  res.data.data.one?res.data.data.one.user_province:'',
            user_city:  res.data.data.one?res.data.data.one.user_city:'',
            user_district:  res.data.data.one?res.data.data.one.user_district:'',
            user_address:  res.data.data.one?res.data.data.one.user_address:'',
            user_street: res.data.data.one?res.data.data.one.user_street:'',
            province_code:  res.data.data.one?res.data.data.one.province_code:'',
            city_code:  res.data.data.one?res.data.data.one.city_code:'',
            district_code:  res.data.data.one?res.data.data.one.district_code:'',
            garden:  res.data.data.one?res.data.data.one.user_province +  res.data.data.one.user_city + res.data.data.one.user_district:'',
          })
        }
      })
    },
  //切换商品类目
  changeCate(e) {
    let that = this;
    let sel_type_id = e.currentTarget.dataset.typeid;
    that.setData({
      sel_type_id,
    });
    console.log(that.data.sel_type_id)
  },
  changer_address(){
    this.setData({
      changer_address_pop: true
    })
  },
  changer_address_marsk(){
    this.setData({
      changer_address_pop: false
    })
  },
  changer_time(){
    this.setData({
      changer_time_pop: true
    })
  },
  changer_time_marsk(){
    this.setData({
      changer_time_pop: false
    })
  },
})