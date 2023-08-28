const app = getApp()
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
const publicMethod = require('../../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    rate:0.985,
    title: '',  //活动标题
    price: '',  //原价
    place:true,
    discount_price: '',  //活动价
    bal_count: 1,  //活动库存
    discount: '',  //折扣金额 total_price - discount_price
    hbb: '',  //兑换积分数
    total_price: '', // 总价
    spread:'',// 代卖期望赚取差价
    img: [],  //活动图片，
    desc: '',  //活动详情,
    sel_index: '',  //当前选中的图片
    activityType: '1',  //活动模板
    obtainType: [],
    discount_name:'',
    showFull: false,  //全屏
    delivery: [
      { id: 1, name: '快递邮寄&emsp;&emsp;&emsp;', showPrice: '设置费用',price: '', status: 1 },
      // { id: 2, name: '青山生态送货专员', showPrice: '设置费用',price: '', status: 0 },
      // { id: 3, name: '预约回收带上门', showPrice: '设置费用', price: '', status: 0 },
    ], //付费邮寄方式
    discount_id: 0,
    otp: '',
    setDeliveryPrice: true,
    currentDeliveryWindows: 0,
    currentDeliveryPrice: '',
    address: '',
    phone: '',
    zitiShow: false,
    fufeiShow: false,
    showCheck:false,
    deliveryShowCheck: true,
    copy: 1,
    commission: '', //分佣佣金
    is_business: 0,
    savaStatus: true,
    items: [],
    showEditBox:0,
    idle_id:0,
    sale_id: 0,
    is_preview: false,
    ad_content:{},
    select_type:0,
    latitude: '',
    longitude: '',
    channelList:[
      {id:1,name:'品牌专柜'},
      {id:2,name:'其他线下渠道'},
      {id:3,name:'品牌官方'},
      {id:4,name:'其他线上渠道'},
      {id:5,name:'他人代购'},
      {id:6,name:'他人赠与'},
      {id:7,name:'其他'}
    ],
    channel_sel:0,
    finenessList:[
      {id:1,name:'全新'},
      {id:2,name:'几乎全新'},
      {id:3,name:'轻微使用痕迹'},
      {id:4,name:'明显使用痕迹'},
      {id:4,name:'明显使用痕迹'},
      {id:4,name:'明显使用痕迹'},

    ],
    fineness_sel:0,
    appendixList:[
      {id:1,name:'无附件'},
      {id:2,name:'质保卡'},
      {id:3,name:'购物小票'},
      {id:4,name:'发票'}
    ],
    appendix_sel:0,
    channel:'', // 购买渠道
    condition:'', // 成色
    enclosure:'', // 附件清单
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;
    if (options.idle_id && options.is_sales == 1) {
      that.contentShow("/idle/idleInfo",options.idle_id)
      that.setData({
        idle_id: options.idle_id,
      })
    }
    if (options.sale_id && options.is_sales == 2) {
      that.contentShow("/sale/saleInfo",options.sale_id)
      that.setData({
        sale_id: options.sale_id,
      })
    }
    if (options.discount_id) {
      that.contentShow(options.discount_id)
    }
    if (options.is_sales) {
      that.setData({
        is_sales: options.is_sales,
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })
   common.get("/business/getLastGood", { "member_id": wx.getStorageSync('member_id') }).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        that.setData({
          address: res.data.data.discount_address,
          phone: res.data.data.discount_phone,
          discount_name: res.data.data.discount_name
        })
      }
    }).catch(error => {
      console.log(error)
    });
  },
   
  onShow: function(){
    let member_id = wx.getStorageSync('member_id');
    console.log(common.formatTime1(new Date()))
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
  },
  //复制状态
  activityCopyChange(e){
    let that = this;
    that.setData({
       copy:e.detail.value
    })
  
    if (e.detail.value == 1){
      this.setData({
        commission: ''
      })
    }
  },
  //创建活动
  createActivity(e) {
    console.log(e)
    let bal_count = e.detail.value.num;
    let that = this;
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
    if (that.data.price === '') {
      wx.showToast({
        title: "请填入原价！",
        icon: 'none',
      })
      return;
    }
    if (that.data.total_price === '') {
      let that = this;
      wx.showToast({
        title: "请填入出售价格！",
        icon: 'none',
      })
      return;
    }
    // if (that.data.hbb === '') {
    //   wx.showToast({
    //     title: "请填入积分！",
    //     icon: 'none',
    //   })
    //   return;
    // }
    if (that.data.discount_name === '') {
      wx.showToast({
        title: "请填入联系人！",
        icon: 'none',
      })
      return;
    }
    if (that.data.phone == '') {
      wx.showToast({
        title: "请填写联系方式！",
        icon: 'none',
      })
      return;
    }
    if (!(/^1[345678]\d{9}$/.test(that.data.phone))) {
      wx.showToast({
        title: '请输入正确的电话号码！',
        icon: 'none',
      })
      return
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
    // if (that.data.address == '' && that.data.zitiShow == true) {
    //   wx.showToast({
    //     title: "请填写取货地址！",
    //     icon: 'none',
    //   })
    //   return;
    // }
    if (that.data.address == '') {
      wx.showToast({
        title: "请填写取货地址！",
        icon: 'none',
      })
      return;
    }
    let checkVal = that.data.checkVal
    let params = {
      member_id: that.data.member_id,
      img:that.data.img,
      desc: that.data.desc,
      price: that.data.price,
      // discount_price: that.data.discount_price,
      discount_price: (that.data.price - that.data.total_price).toFixed(2),
      bal_count: that.data.bal_count,
      discount: (that.data.price - that.data.total_price).toFixed(2),
      hbb: 0,
      // total_price: (that.data.discount_price * 1.15 + that.data.commission * 1.15).toFixed(2),
      total_price: that.data.total_price,
      type: that.data.activityType,
      obtain_type: that.data.obtainType,
      title: that.data.title,
      discount_address: that.data.address,
      discount_phone: that.data.phone,
      copy: that.data.copy,
      delivery: '',
      discount_id: that.data.discount_id,
      // commission: that.data.commission,
      is_business: that.data.is_business,
      discount_name: that.data.discount_name,
      lat: that.data.latitude,
      lng: that.data.longitude,
      channel: that.data.channel, // 购买渠道
      condition:that.data.condition, // 成色
      enclosure:that.data.enclosure, // 附件清单
    }

    if(that.data.is_sales == 1){
      params.idle_id = that.data.idle_id

    }
    if (that.data.is_sales == 2) {
      params.sale_id = that.data.sale_id
      params.spread = that.data.spread;
      // params.total_price = (that.data.discount_price * 1.15 + that.data.commission * 1.15 + that.data.spread * 1.15).toFixed(2)
      params.total_price = that.data.total_price;
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
      console.log(delivery)
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
    common.get('/content/getTips').then(res => {
      if (res.data.code == 200) {
        wx.showModal({
          content: res.data.msg,
          success: function (res) {
            if (res.confirm) {
              if( that.data.is_sales == 2){
                that.createDiscount("/sale/saleAdd", params)
                console.log('发布')
              } else if (that.data.is_sales == 1){
                that.createDiscount("/idle/idleAdd", params)
              }
            }
          }
        })
      }
    })
  },

// 闲置发布接口
  createDiscount(url,params){
    let that = this
    wx.showLoading({
      title: '发表中...',
    })
    common.get(url, params).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        if (that.data.is_sales == 1 && !that.data.idle_id){
          console.log('弹广告')
          wx.requestSubscribeMessage({   // 调起消息订阅界面
            tmplIds: ['kaOSsY5MEllEKU3dDxHNIjJzq4p57sooro1kcI9BMuM','pFwkwK9Pol6sTBmvVo6BXRezocpQpJU3imf6InMQE_s'],
            success (res) { 
              console.log('订阅消息 成功 ');
              console.log(res);
              wx.showToast({
                title: '发布成功',
                icon: "success",
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            },
            fail (er){
              console.log("订阅消息 失败 ");
              console.log(er);
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          }) 
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "success",
            duration: 1000,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }

      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(error => {
      wx.hideLoading();
      console.log(error)
    })
  },
  // 广告弹窗点击背景
  click_bg(){
    // this.setData({
    //   is_preview:false
    // })
    // setTimeout(function () {
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // }, 1000)
    this.gotoindex();

  },
  // =================== 新增 ===================
  goto_adshop(e){
    publicMethod.goto_adshop(e,this);
  },
  gotoxuanze(){
    publicMethod.gotoxuanze(this);
  },
  // =================== 新增 ===================  

  //修改内容回显
  contentShow(url,id){
    let that = this
    common.get(url, { 
      discount_id: id,
      idle_id: id,
      sale_id: id
    }).then(res => {
      if (res.data.code == 200) {
          let data = res.data.data[0]
          console.log(data)
        if (that.data.is_sales == 1) {
          that.setData({
            idle_id: data.id,
          })
        }
        if (that.data.is_sales == 2) {
          that.setData({
            sale_id: data.id,
          })
        }
          that.setData({
            discount_id: id,
            img: data.img,
            desc: data.desc,
            price: data.price,
            spread:data.spread,
            discount_price: data.discount_price,
            bal_count: data.bal_count,
            discount: data.total_price - data.discount_price,
            hbb: data.hbb,
            total_price: data.total_price,
            activityType: data.type,
            obtainType: data.obtain_type,
            title: data.title,
            address: data.discount_address,
            phone: data.discount_phone,
            copy: data.is_copy,
            commission: data.commission,
            discount_name: data.discount_name,
            channel: data.channel, // 购买渠道
            condition:data.condition, // 成色
            enclosure:data.enclosure, // 附件清单
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
    console.log(e)
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
    // 输入出售价格
    inputtotalPrice(e){
      let that = this;
      let rate = that.data.rate;
      that.setData({
        total_price: e.detail.value,
      })
      // if (that.data.total_price === '') {
      //   that.setData({
      //     discount_price: 0
      //   })
      // }
    },
  inputDiscountPrice(e) {
    let that = this;
    console.log(e.detail);
    this.setData({
      discount_price: e.detail.value,
    });
    // if (that.data.discount_price === '') {
    //   that.setData({
    //     total_price: 0
    //   })
    // }
  },
  inputspreadPrice(e) {
    let that = this;
    console.log(e.detail);
    this.setData({
      spread: e.detail.value,
    });
  },
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
  //输入库存
  inputBalCount(e) {
    this.setData({
      bal_count: e.detail.value
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
  // inputCommission(e) {
  //   console.log(e.detail);
  //   this.setData({
  //     commission: e.detail.value,
  //   })
  //   if (this.data.discount_price === '') {
  //     that.setData({
  //       total_price: 0.00
  //     })
  //   }
  // },
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
        console.log(tempFiles[0]);
        console.log(tempFiles);
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
    console.log(1)
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
    let checkVal = e.detail.value

    this.setData({
      checkVal: e.detail.value
    })
  },
  goToFix(){
    let that = this;
    that.setData({
      showEditBox:1,
      place:false,
    })
  },
  popLock(){
    let that = this;
    that.setData({
      showEditBox: 0,
      place:true,
    })
  }, 
  btnArea(){
    let that = this;
    if (that.data.price === '') {
      wx.showToast({
        title: "请填入原价！",
        icon: 'none',
      })
      return;
    }
    // if (that.data.discount_price === '') {
    //   let that = this;
    //   that.setData({
    //     total_price: 0.00
    //   });
    //   wx.showToast({
    //     title: "请填入期望价格！",
    //     icon: 'none',
    //   })
    //   return;
    // }
    if (that.data.is_sales == 2) {
      if (that.data.spread === '') {
        let that = this;
        that.setData({
          total_price: 0.00
        });
        wx.showToast({
          title: "请填入出售价！",
          icon: 'none',
        })
        return;
      }
    }
    // if (that.data.hbb === '') {
    //   wx.showToast({
    //     title: "请填入积分！",
    //     icon: 'none',
    //   })
    //   return;
    // }
    // if (that.data.copy == 2){
    //   if (that.data.commission == '') {
    //     wx.showToast({
    //       title: '允许复制分享奖金不能为空！',
    //       icon:'none'
    //     })
    //     return
    //   }
    // }
    
    that.setData({
      showEditBox: 0
    })
  },


  // 、、、、、、、、、、、、、、  11/12  改版   、 、、、、、、、、、、、
  // 选择渠道
  channel_sel(e){
    let that = this;
    let channelList = that.data.channelList;
    channelList.forEach(ele =>{
      if(ele.id == e.currentTarget.dataset.id){
        that.setData({
          channel: ele.name,
          channel_sel: e.currentTarget.dataset.id,
        })
      }
    })
  },
  // 成色
  fineness_sel(e){
    let that = this;
    let finenessList = that.data.finenessList;
    finenessList.forEach(ele =>{
      if(ele.id == e.currentTarget.dataset.id){
        that.setData({
          condition: ele.name,
          fineness_sel: e.currentTarget.dataset.id,
        })
      }
    })
  },
    // 附件清单
    appendix_sel(e){
      let that = this;
      let appendixList = that.data.appendixList;
      appendixList.forEach(ele =>{
        if(ele.id == e.currentTarget.dataset.id){
          that.setData({
            enclosure: ele.name,
            appendix_sel: e.currentTarget.dataset.id,
          })
        }
      })
    },

})