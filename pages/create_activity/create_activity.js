const app = getApp()
const common = require('../../assets/js/common');
const setting = require('../../assets/js/setting');
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    cur: 0,
    rate:0,
    img_url: app.data.imgUrl,
    title: '',  //活动标题
    price: '',  //原价
    discount_price: '0.00',  //活动价
    bal_count: '',  //活动库存
    limit_day:'', // 间隔天数
    limit_num:'', // 限购件数
    discount: '',  //折扣金额 price - discount_price
    hbb: '',  //兑换积分数
    total_price: '', // 总价
    start_time: '',  //开始时间
    end_time: '',  //结束时间
    img: [],  //活动图片，
    desc: '',  //活动详情,
    sel_index: '',  //当前选中的图片
    activityType: '1',  //活动模板
    obtainType: [],
    obtainType_tuan: [],
    discount_name: '',
    showFull: false,  //全屏
    showFull_tuan: false,  //全屏
    showFull_coupon: false,  //全屏
    delivery: [
      { id: 1, name: '快递邮寄&emsp;&emsp;&emsp;', showPrice: '设置费用',price: '', status: 1 },
      { id: 2, name: '青山生态送货专员', showPrice: '设置费用',price: '', status: 0 },
      { id: 3, name: '预约回收带上门', showPrice: '设置费用', price: '', status: 0 },
    ], //付费邮寄方式
    discount_id: 0,
    otp: '',
    setDeliveryPrice: true,
    currentDeliveryWindows: 0,
    currentDeliveryPrice: '',
    address: '',
    phone: '',
    zitiShow: false,
    zitiShow_tuan: false,
    fufeiShow: false,
    fufeiShow_tuan: false,
    showCheck:false,
    deliveryShowCheck: true,
    copy: 1,
    commission: '', //分佣佣金
    is_business: 0,
    savaStatus: true,
    currentTab: 0,
    qwe: true,
    items: [],
    is_tuan:0,
    showEditBox:0,
    title_tuan: '',  //团购活动标题
    desc_tuan: '',  //团购活动详情
    img_tuan: [],  //团购活动图片，
    sel_index_tuan: '',  //团购当前选中的图片
    discount_price_tuan: '',  //团购活动价
    one_price_tuan:'',  // 团购单人价格
    number_tuan: '', // 团购份数
    number_price_tuan:'',//团购单价
    bal_count_tuan: '',  //活动库存
    discount_name_tuan: '',
    hbb_tuan: '',  //兑换积分数
    total_price_tuan: '', // 总价
    start_time_tuan: '',  //开始时间
    end_time_tuan: '',  //结束时间
    is_coupon:0,
    coupon_id:'',  // 优惠券id
    name_coupon: '',  //优惠券标题
    sign: '',  //优惠券使用说明
    thumb_coupon: [],  //优惠券图片，
    coupon_price:'',  // 优惠价抵扣价格
    coupon_integral:'', // 优惠价抵扣积分
    sel_index_coupon: '',  //优惠券当前选中的图片
    original_price: '',  //商品原价
    current_price:'', // 使用优惠劵后价格
    bal_count_coupon: '',  //优惠券库存
    start_time_coupon: '',  //开始时间
    end_time_coupon: '',  //结束时间
    pay_count:'',
    need_radio:2,
    shop_name:'',
    // sign_dianzhang:'', // 优惠券店长留言
    // shop_message:'',// 商品店长留言
    switchvalue: false, // 参与社区大集
    isShowConfirm: false, // 密码弹窗
    password: '', // 密码
    community_info_id: '',  // 社区ID
    community_market_id: '', // 大集ID
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;
    if(options.community_info_id){
      that.setData({
        community_info_id: options.community_info_id,  // 社区ID
        community_market_id: options.community_market_id, // 大集ID
      })
    }
    if(options.currentTab == '2'){
      that.setData({
          currentTab: 2,
      })
    }
    if(options.is_tuan == '1'){
      that.setData({
        is_tuan:options.is_tuan,
        currentTab: 1,
        qwe: false,
      })
    }
    if(options.is_coupon == '1'){
      that.setData({
        is_tuan:options.is_tuan,
        currentTab: 2,
      })
    }
    console.log(that.data.currentTab)
    if (options.business_id) {
      that.setData({
        business_id: options.business_id,
        rate:options.rate,
        is_business: 1,  //为1则为商家用户
      })
    } else {
      that.setData({
        is_business: 2
      })
    }

    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
      business_id: options.business_id,
    })
    common.get("/business/getBusinessAddInfo", { "business_id": options.business_id }).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        that.setData({
          address: res.data.goods_contact.discount_address,
          phone: res.data.goods_contact.discount_phone,
          shop_name:res.data.data.name,
          discount_name: res.data.goods_contact.discount_name
        })
      }
    }).catch(error => {
      console.log(error)
    });
    if(options.discount_id && options.is_tuan != '1'){
      that.contentShow(options.discount_id);
    }else if(options.is_tuan == '1'){
      that.tuanShow(options.discount_id);

    }else if(options.is_coupon == '1'){
      that.couponShow(options.id);
    }


    // that.getFansnear();
  },
  onShow: function(){
    let member_id = wx.getStorageSync('member_id');
    let time = common.formatTime1(new Date())
    this.setData({
      start_time:time,
      start_time_tuan:time,
      start_time_coupon:time
    })
    // this.getBusinessInfo(); 
  },



  //复制状态
  activityCopyChange(e){
    let that = this;
    that.setData({
       copy:e.detail.value
    });
    if (e.detail.value == 1) {
      this.setData({
        commission: ''
      })
    }
  },
  // 优惠券是否需要买家留信息
  need_radioChange(e){
    let that = this;
    that.setData({
      need_radio:e.detail.value
    });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    publicMethod.getFormId(e, this)
    console.log(e)
    let that = this
    var cur = e.currentTarget.dataset.current;
    that.setData({
      cur: e.currentTarget.dataset.current
    })
    if (cur == 0) {
      console.log(that.data.cur)
      that.setData({
        qwe: 1,
      })
    } else if (cur == 1) {
      that.setData({
        qwe: 0,
        currentTab: cur
      })
    }
    that.setData({
      currentTab: cur
    })
  },
  //创建活动
  createActivity() {
    let that = this;
    let commission = that.data.commission;
    if (that.data.title == '') {
      wx.showToast({
        title: "请填写标题！",
        icon: 'none',
      })
      return;
    }
    if (that.data.img.length == 0) {
      wx.showToast({
        title: "请上传活动图片！",
        icon: 'none',
      })
      return;
    }

    if (that.data.price === '' && that.data.activityType == 1) {
      wx.showToast({
        title: "请填入原价！",
        icon: 'none',
      })
      return;
    }

    if (that.data.total_price === '') {
      let that = this;
      that.setData({
        discount_price: 0.00
      });
      wx.showToast({
        title: "请填入商品价格！",
        icon: 'none',
      })
      return;
    }
    // if (that.data.copy == 2) {
    //   if (commission == '') {
    //     wx.showToast({
    //       title: '允许复制分享奖金不能为空！',
    //       icon: 'none'
    //     })
    //     return;

    //   }
    // }
    if (that.data.hbb === '') {
      wx.showToast({
        title: "请填入积分！",
        icon: 'none',
      })
      return;
    }
    if (that.data.start_time === '' || that.data.end_time === '') {
      wx.showToast({
        title: "请选择时间！",
        icon: 'none',
      })
      return;
    }
      if (that.data.bal_count === '') {
      wx.showToast({
        title: "请填入库存！",
        icon: 'none',
      })
      return;
    }
    if (that.data.limit_day === '' && that.data.limit_num != '') {
      wx.showToast({
        title: "请输入间隔天数",
        icon: 'none',
      })
      return;
    }
    if (that.data.limit_day != '' && that.data.limit_num == '') {
      wx.showToast({
        title: "请输入限购件数",
        icon: 'none',
      })
      return;
    }

    if (that.data.discount_name === '') {
      wx.showToast({
        title: "请填入联系人！",
        icon: 'none',
      })
      return;
    }
    if (that.data.obtainType.length == 0) {
      wx.showToast({
        title: "请选择到货方式！",
        icon: 'none',
      })
      return;
    }

    if (that.data.fufeiShow == true) {
      let delivery = that.data.delivery
      for (let val of delivery) {
        if (val.status == 1 && val.price == '') {
          wx.showToast({
            title: "请设置" + val.name.replace(/&emsp;/g, '') + '的费用！',
            icon: 'none',
          })
          return;
        }
      }
    }
    
    if (that.data.phone == '' && that.data.zitiShow == true){
      wx.showToast({
        title: "请填写联系方式！",
        icon: 'none',
      })
      return;
    }
    // if (!(/^1[345678]\d{9}$/.test(that.data.phone)) && that.data.zitiShow == true) {
    //   wx.showToast({
    //     title: '请输入正确的电话号码！',
    //     icon: 'none',
    //   })
    //   return
    // }
    if (that.data.address == '' && that.data.zitiShow == true) {
      wx.showToast({
        title: "请填写取货地址！",
        icon: 'none',
      })
      return;
    }
    let checkVal = that.data.checkVal
    
    let params = {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      img:that.data.img,
      desc: that.data.desc,
      price: that.data.price,
      discount_price: that.data.discount_price,
      bal_count: that.data.bal_count,
      limit_day: that.data.limit_day,
      limit_num: that.data.limit_num,
      discount: that.data.price - that.data.discount_price,
      hbb: that.data.hbb,
      // total_price: (that.data.discount_price * 1.15 + that.data.commission * 1.15).toFixed(2),
      total_price: that.data.total_price,
      start_time: that.data.start_time,
      end_time: that.data.end_time,
      type: that.data.activityType,
      obtain_type: that.data.obtainType,
      title: that.data.title,
      discount_address: that.data.address,
      discount_phone: that.data.phone,
      copy: that.data.copy,
      delivery: '',
      discount_id: that.data.discount_id,
      commission: that.data.commission,
      is_business: that.data.is_business,
      discount_name: that.data.discount_name,
      // content: that.data.shop_message
    }
    for (let i in checkVal) {
      if (checkVal[i] == 1) {
        params.is_fans = 1
      } else if (checkVal[i] == 2) {
        params.is_near = 1
      }
    }
    if (that.data.fufeiShow == true) {
      let delivery = that.data.delivery
      let deliveryNew = delivery.filter(item => item.status == 1)
      let deliverysNew = delivery.filter(item => item.status >= 0)
      if (deliveryNew.length == 0){
        wx.showToast({
          title: '请选择付费邮寄方式',
          icon: 'none'
        })
        return;
      }
      params.delivery = deliverysNew
    }
    console.log(params)
    if (that.data.is_business == 1) {

      common.get('/content/getTips').then(res => {
        if (res.data.code == 200) {
          wx.showModal({
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                that.createDiscount(params)
              }
            }
          })
        }
      })
    } else {
      let code = new Date().getTime();
      that.createDiscount(params)
    }
   
  },
  createDiscount(params){
    let that = this
    wx.showLoading({
      title: '发布中...',
    })
    common.post("/business/createDiscount", params).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: "success",
          duration: 1000
        })
        let id = res.data.data.business_discount_id;
        let switchvalue = that.data.switchvalue;
        if(switchvalue){
         that.addCommunity(id);
        }
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  //普通商品修改内容回显
  contentShow(id){
    let that = this
    common.post("/business/discountInfo", 
    {
      business_id: that.data.business_id,
      discount_id:id
    }
    ).then(res => {
      if (res.data.code == 200) {
          let data = res.data.data[0]
          that.setData({
            discount_id: id,
            business_id: data.business_id,
            img: data.img,
            desc: data.desc,
            price: data.price,
            discount_price: data.discount_price,
            bal_count: data.bal_count,
            limit_day: data.limit_day?data.limit_day:'',
            limit_num: data.limit_num?data.limit_num:'',
            discount: data.price - data.discount_price,
            hbb: data.hbb,
            total_price: data.total_price,
            start_time: data.start_time,
            end_time: data.end_time,
            activityType: data.type,
            obtainType: data.obtain_type,
            title: data.title,
            address: data.discount_address,
            phone: data.discount_phone,
            copy: data.is_copy,
            commission: data.commission,
            discount_name: data.discount_name,
            // shop_message: data.content
          })
        if (data.obtain_type.length == 2){
          that.setData({
            showCheck: true,
            zitiShow: true,
            fufeiShow: true
          })
        }else{
          that.setData({
            otp: data.obtain_type[0]
          })
          data.obtain_type[0] == 1 ? that.setData({ zitiShow: true }) : that.setData({ fufeiShow: true })
        }
        if (data.delivery){
            that.setData({
              delivery: data.delivery
            })
        }
      }
    }).catch(error => {
      console.log(error)
    })
  },
  // 优惠劵修改内容回显
  couponShow(id){
    let that = this
    common.get("/coupon/info", 
    {
      business_id: that.data.business_id,
      id,
    }
    ).then(res => {
      if (res.data.code == 200) {
          let data = res.data.data[0]
          that.setData({
            coupon_id:data.id,
            business_id:data.business_id,
            name_coupon: data.name,
            sign:data.sign, // 优惠券使用说明
            // sign_dianzhang :data.content, // 优惠券店长留言
            thumb_coupon:data.thumb,
            coupon_price:data.coupon_price,
            coupon_integral:data.coupon_integral,
            original_price:data.price,
            current_price:data.current_price,
            start_time_coupon:data.start_time,
            end_time_coupon:data.end_time,
            stock:data.stock,
            need_radio:data.is_phone,
            pay_count: data.pay_count
          })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  //输入描述
  inputDesc(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  inputAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //切换模板
  activityTypeChange(e) {
    console.log(e.detail.value);
    let that = this;
    that.setData({
      activityType: e.detail.value,
      obtainType: [],
      showCheck: false,
      zitiShow: false,
      fufeiShow:false
    })
  },
  //选择获取方式
  obtainListChange(e) {
    console.log(e.detail.value);
    let that = this;
    that.setData({
      obtainType: e.detail.value
    })
    let hasfind = e.detail.value.find( ele => {
      return ele == 1
    })
    let hasfindpay = e.detail.value.find(ele => {
      return ele == 2
    })
    hasfind ? that.setData({ zitiShow: true }) : that.setData({ zitiShow: false })
    hasfindpay ? that.setData({ fufeiShow: true }) : that.setData({ fufeiShow: false })
  },
  //付费邮寄方式选择
  deliveryListChange(e){
       let that = this;
       let delivery = that.data.delivery
       let id       = e.currentTarget.dataset.id
       let checked  = e.currentTarget.dataset.checked
       delivery[id - 1].status = checked > 0 ? 0 : 1
       that.setData({
         delivery: delivery
       })
  },
  //设置邮寄费用显示
  setDeliveryPriceShow(e) {
    let that = this;
    that.setData({
      setDeliveryPrice: false,
      currentDeliveryWindows: e.currentTarget.dataset.id,
      currentDeliveryPrice: e.currentTarget.dataset.price,
    })
  },
  //设置邮寄费用隐藏
  setDeliveryPriceHide(e) {
    let that = this;
    that.setData({
      setDeliveryPrice: true
    })
  },
  //输入邮寄费用
  currentDeliveryPrice(e){
    let that = this;
    that.setData({
      currentDeliveryPrice: e.detail.value
    })
  },
  //设置邮寄费用
  setDeliveryPrice(e) {
    let that     = this;
    let id       = that.data.currentDeliveryWindows
    let delivery = that.data.delivery
    let price    = that.data.currentDeliveryPrice
    if (price.length < 1 && price >= 0){
        wx.showToast({
          title: '请输入您要设置的费用！',
          icon: 'none',
        })
        return;
    }
    delivery[id - 1].showPrice = price == 0 ? '免费' : '￥' + price
    delivery[id - 1].price = price
    that.setData({
      delivery: delivery,
      setDeliveryPrice: true
    })
  },
  // 输入总成交价
  inputtotalPrice(e){
    let that = this;
    let rate = that.data.rate;
    that.setData({
      total_price: e.detail.value,
      discount_price:(e.detail.value * rate).toFixed(2)
    })
    if (that.data.total_price === '') {
      that.setData({
        discount_price: 0
      })
    }
  },
  //输入折扣价格
  // inputDiscountPrice(e) {
  //   let that = this;
  //   console.log(e.detail);
  //   this.setData({
  //     discount_price: e.detail.value,
  //   });
  //   if (that.data.discount_price === '') {
  //     that.setData({
  //       total_price: 0
  //     })
  //   }
  // },
  //输入标题
  inputTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },
  //输入姓名
  inputBalDiscname(e) {
    this.setData({
      discount_name: e.detail.value
    })
  },
  //输入库存a
  inputBalCount(e) {
    this.setData({
      bal_count: e.detail.value
    })
  },
  // 间隔天数
  inputLimitDays(e){
    this.setData({
      limit_day: e.detail.value
    })
  },
  // 限购件数
  inputLimitNum(e){
    this.setData({
      limit_num: e.detail.value
    })
  },
  //输入原价
  inputPrice(e) {
    console.log(e.detail);
    this.setData({
      price: e.detail.value
    })
  },
  //输入所需环保币
  inputHbb(e) {
    console.log(e.detail);
    this.setData({
      hbb: e.detail.value
    })
  },
  //输入所需佣金
  inputCommission(e) {
    console.log(e.detail);
    this.setData({
      commission: e.detail.value,
      // total_price: (discount_price * 1.15) + (commission * 1.15),
    })
    if (this.data.discount_price === '') {
      that.setData({
        total_price: 0.00
      })
    }
  },
  //选择开始时间
  bindStartTime(e) {
    console.log(e.detail);
    this.setData({
      start_time: e.detail.value
    })
  },
  //选择结束时间
  bindEndTime(e) {
    console.log(e.detail);
    this.setData({
      end_time: e.detail.value
    })
  },
  //选择优惠券结束时间
  bindEndTime_coupon(e) {
    this.setData({
      end_time_coupon: e.detail.value
    })
    console.log(this.data.end_time_coupon);

  },
  //上传图片
  choosePic: function() { //选取图片
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        that.upLoadImg(tempFiles, 0);
        return;
      }
    })
  },
  //上传图片
  upLoadImg(image,index) {
    let i = index;
    let img = image;
    let that = this;
    if ( i >= img.length ) {
      return
    }
    // debugger;
    let txt = '上传中'+(i+1)+'/'+img.length
    wx.showLoading({
      title:txt
    })
    wx.uploadFile({
      url: setting.apiUrl + '/file/uploadOss',
      filePath: img[i].path,
      name: 'files[]',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        console.log(data);
        if ( data.code == 0 ) {
          wx.hideLoading();
          that.data.img.push(data.data.url[0]);
          that.setData({
            img: that.data.img
          })
        } else {
          app.showToast({
            title: "上传失败!",
          })
        }
        wx.hideLoading();
        i++;
        that.upLoadImg(image, i);
      },
      fail:function() {
        app.showToast({
          title: "上传失败!",
        })
        wx.hideLoading()
      },
      complete:function() {
        wx.hideLoading()
      }
    })
  },
  //打开图片预览
  openPhoto(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      preview: that.data.img[index],
      sel_index: index,
      showFull: true
    })
  },
  //关闭图片预览
  closePic() {
    this.setData({
      showFull: false
    })
  },
  //删除图片
  delPic() {
    let that = this;
    let index = that.data.sel_index;
    that.data.img.splice(index,1);
    that.setData({
      showFull: false,
      img: that.data.img
    })
  },
   checkboxChange(e) {
    this.setData({
      checkVal: e.detail.value
    })
  },

  // getFansnear() {
  //   let that = this;
  //   common.get('/content/fansnear', {
  //     member_id: that.data.member_id,
  //     is_business: that.data.is_business
  //   }).then(res => {
  //     console.log("是否有通知开关")
  //     console.log(res)
  //     if (res.data.errno == 0) {
  //       if (res.data.data.is_fans == 1) {
  //         that.data.items.push({
  //           name: '1',
  //           value: '通知关注自己的人'
  //         })
  //       }
  //       if (res.data.data.is_near == 1) {
  //         that.data.items.push({
  //           name: '2',
  //           value: '告知周围三公里的用户'
  //         })
  //       }
  //       that.setData({
  //         items: that.data.items
  //       })
  //     }
  //   }).catch(e => {
  //     console.log(e)
  //   })
  // },
  goToFix(){
    let that = this;
    that.setData({
      showEditBox:1
    })
  },
  popLock(){
    let that = this;
    that.setData({
      showEditBox: 0,
    })
  }, 

  btnArea() {
    let that = this;
    let commission = that.data.commission;
    if (that.data.price === '' && that.data.activityType == 1) {
      wx.showToast({
        title: "请填入原价！",
        icon: 'none',
      })
      return;
    }

    if (that.data.discount_price === '') {
      let that = this;
      that.setData({
        total_price: 0.00
      });
      wx.showToast({
        title: "请填入折扣价格！",
        icon: 'none',
      })
      return;
    }
    if (that.data.hbb === '') {
      wx.showToast({
        title: "请填入积分！",
        icon: 'none',
      })
      return;
    }
    if (that.data.copy == 2) {
      if (commission == '') {
        wx.showToast({
          title: '允许复制分享奖金不能为空！',
          icon: 'none'
        })
        return
      }
    }
    that.setData({
      showEditBox: 0
    })
  },

  // 优惠券功能
  // 标题
  input_name_coupon(e){
    let that = this;
    return that.setData({
      name_coupon:e.detail.value
    })
  },
  // 优惠券使用说明
  input_sign(e){
    this.setData({
      sign:e.detail.value
    })
  },
  // 优惠券店长留言
  // inputsign_dianzhang(e){
  //   this.setData({
  //     sign_dianzhang:e.detail.value
  //   })
  // },
  // 商品店长留言
  // shop_message(e){
  //   this.setData({
  //     shop_message:e.detail.value
  //   })
  // },
  // 抵扣价格
  coupon_price(e){
    this.setData({
      coupon_price:e.detail.value
    })
  },
  // 抵扣积分
  coupon_integral(e){
    this.setData({
      coupon_integral:e.detail.value
    })
  },
  // 商品原价
  original_price(e){
    this.setData({
      original_price:e.detail.value
    })
  },
  // 折扣价
  current_price(e){
    this.setData({
      current_price:e.detail.value
    })
  },
  // 数量
  input_stock(e){
    this.setData({
      stock:e.detail.value
    })
  },
  //优惠券上传图片
  choosePic_coupon: function () { //选取图片
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        that.upLoadImg_coupon(tempFiles, 0);
        return;
      }
    })
  },
  //上传图片
  upLoadImg_coupon(image, index) {
    let i = index;
    let img = image;
    let that = this;
    if (i >= img.length) {
      return
    }
    // debugger;
    let txt = '上传中' + (i + 1) + '/' + img.length
    wx.showLoading({
      title: txt
    })
    wx.uploadFile({
      url: setting.apiUrl + '/file/uploadOss',
      filePath: img[i].path,
      name: 'files[]',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        let data = JSON.parse(res.data);
        console.log(data);
        if (data.code == 0) {
          wx.hideLoading();
          that.data.thumb_coupon.push(data.data.url[0]);
          that.setData({
            thumb_coupon: that.data.thumb_coupon
          })
        } else {
          app.showToast({
            title: "上传失败!",
          })
        }
        wx.hideLoading();
        i++;
        that.upLoadImg_coupon(image, i);
      },
      fail: function () {
        app.showToast({
          title: "上传失败!",
        })
        wx.hideLoading()
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //优惠券打开图片预览
  openPhoto_coupon(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      preview_coupon: that.data.thumb_coupon[index],
      sel_index_coupon: index,
      showFull_coupon: true
    })
  },
  //关闭图片预览
  closePic_coupon() {
    this.setData({
      showFull_coupon: false
    })
  },
  //删除图片
  delPic_coupon() {
    let that = this;
    let index = that.data.sel_index_coupon;
    that.data.thumb_coupon.splice(index, 1);
    that.setData({
      showFull_tuan: false,
      thumb_coupon: that.data.thumb_coupon
    })
  },
  yulan_coupon() {
    let that = this;
    if (that.data.name_coupon == ''){
      wx.showToast({
        title: "请填写优惠券名称！",
        icon: 'none',
      })
      return;
    }
    if (that.data.thumb_coupon.length == 0) {
      wx.showToast({
        title: "请上传活动图片！",
        icon: 'none',
      })
      return;
    }
    if (that.data.coupon_price === '') {
      wx.showToast({
        title: "请填入抵扣价格！",
        icon: 'none',
      })
      return;
    }
    if (that.data.coupon_integral === '') {
      let that = this;
      wx.showToast({
        title: "请输入抵扣积分！",
        icon: 'none',
      })
      return;
    }
    if (that.data.original_price == '') {
        wx.showToast({
          title: '请输入商品原价！',
          icon: 'none'
        })
        return;
    }
    if (that.data.current_price === '') {
      wx.showToast({
        title: "请输入折扣价！",
        icon: 'none',
      })
      return;
    }    
    if (that.data.end_time_coupon === '') {
      wx.showToast({
        title: "请选择结束时间！",
        icon: 'none',
      })
      return;
    }
    if (that.data.stock === '') {
      wx.showToast({
        title: "请输入数量！",
        icon: 'none',
      })
      return;
    }
    if (that.data.pay_count === '') {
      wx.showToast({
        title: "请输入每个用户可购买数量！",
        icon: 'none',
      })
      return;
    }
    let params = {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      name: that.data.name_coupon,
      sign: that.data.sign, //使用说明
      // content:that.data.sign_dianzhang, //  店长留言
      thumb: that.data.thumb_coupon,
      coupon_price: that.data.coupon_price,
      coupon_integral: that.data.coupon_integral,
      price: that.data.original_price,
      current_price:that.data.current_price,
      stock: that.data.stock,
      start_time:that.data.start_time_coupon,
      end_time:that.data.end_time_coupon,
      id:that.data.coupon_id,
      pay_count: that.data.pay_count,
      is_phone: that.data.need_radio,
      business_name:that.data.shop_name,
    }
    app.yulan_params = params;
    wx.navigateTo({
      url: '/packageA/pages/preview_coupon/index',
    })
  },
  createActivity_coupon() {
    let that = this;
    console.log(that.data.name_coupon)
    if (that.data.name_coupon == '') {
      wx.showToast({
        title: "请填写优惠券名称！",
        icon: 'none',
      })
      return;
    }
    if (that.data.thumb_coupon.length == 0) {
      wx.showToast({
        title: "请上传活动图片！",
        icon: 'none',
      })
      return;
    }

    if (that.data.coupon_price === '') {
      wx.showToast({
        title: "请填入抵扣价格！",
        icon: 'none',
      })
      return;
    }

    if (that.data.coupon_integral === '') {
      let that = this;
      wx.showToast({
        title: "请输入抵扣积分！",
        icon: 'none',
      })
      return;
    }
    if (that.data.original_price == '') {
        wx.showToast({
          title: '请输入商品原价！',
          icon: 'none'
        })
        return;
    }
    if (that.data.current_price === '') {
      wx.showToast({
        title: "请输入折扣价！",
        icon: 'none',
      })
      return;
    }    
    if (that.data.end_time_coupon === '') {
      wx.showToast({
        title: "请选择结束时间！",
        icon: 'none',
      })
      return;
    }

    if (that.data.stock === '') {
      wx.showToast({
        title: "请输入数量！",
        icon: 'none',
      })
      return;
    }
    if (that.data.pay_count === '') {
      wx.showToast({
        title: "请输入每个用户可购买数量！",
        icon: 'none',
      })
      return;
    }
    let params = {
      member_id: that.data.member_id,
      business_id: that.data.business_id,
      name: that.data.name_coupon,
      sign: that.data.sign,  // 使用说明
      // content:that.data.sign_dianzhang,   // 优惠券店长留言
      thumb: that.data.thumb_coupon,
      coupon_price: that.data.coupon_price,
      coupon_integral: that.data.coupon_integral,
      price: that.data.original_price,
      current_price:that.data.current_price,
      stock: that.data.stock,
      start_time:that.data.start_time_coupon,
      end_time:that.data.end_time_coupon,
      id:that.data.coupon_id,
      pay_count: that.data.pay_count,
      is_phone: that.data.need_radio
    }
    console.log(params)
    if (that.data.is_business == 1) {

      common.get('/content/getTips').then(res => {
        if (res.data.code == 200) {
          wx.showModal({
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                that.createDiscount_coupon(params)
              }
            }
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      })
    } else {
      let code = new Date().getTime();
      that.createDiscount_coupon(params)
    }

  },
  createDiscount_coupon(params) {
    let that = this
    wx.showLoading({
      title: '发表中...',
    })
    common.get("/coupon/add", params).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: "success",
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(error => {
      wx.hideLoading();
      console.log(error)
    })
  },   
  pay_count(e){
    let that = this;
    that.setData({
      pay_count:e.detail.value
    })
  },
  isShowConfirm(){
    this.setData({
      isShowConfirm:false
    })
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
  /*验证编码是否正确 */
  judge_linbarrnum:function(e){
    let that = this;
    let password = e.detail.value.password;
    if (password==''){
      wx.showToast({
        title: "请输入密码!"
      })
    }else{
      common.post('/community_market/check_member_community_market_sign_up_info', {
        member_id: wx.getStorageSync('member_id'),
        password,
      }).then(res => {
        if(res.data.code==200){
          wx.showToast({
            title: '验证成功！',
            icon:'none'
          })
          that.setData({
            community_info_id: res.data.data.community_info_id,
            community_market_id: res.data.data.id,
            switchvalue: true,
            isShowConfirm: false,
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }

      })
    }
  },
  switch1Change(){
    console.log(this.data.switchvalue)
    let that = this;
    if(!that.data.switchvalue){
      that.setData({
        switchvalue: false,
        isShowConfirm: true
      })
      return
    }else{
      wx.showToast({
        title: '取消参与！',
        icon:'none'
      })
      that.setData({
        switchvalue: false,
      })
      return
    }

  },
  // 参与社区大集活动接口
  addCommunity(i){
    let that = this;
    common.post('/community_market/add_community_market_goods_relation',{
      community_info_id: that.data.community_info_id,  // 社区ID
      community_market_id: that.data.community_market_id, // 大集ID
      business_discount_id:i

    }).then( res =>{
      if(res.data.code == 200){
        
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  }
})