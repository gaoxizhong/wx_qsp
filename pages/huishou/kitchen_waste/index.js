const app = getApp();
const common = require('../../../assets/js/common');
const setting = require('../../../assets/js/setting');
const publicMethod = require('../../../assets/js/publicMethod');
const zhuan_dingwei = require('../../../assets/js/dingwei');
const wayIndex = -1;
const school_area = '';
const grade = '';
// 当联想词数量较多，使列表高度超过340rpx，那设置style的height属性为340rpx，小于340rpx的不设置height，由联想词列表自身填充
// 结合上面wxml的<scroll-view>
const arrayHeight = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newlists:[],
    total:0.00,
    type:2,
    goods_type:'',
    checked:true,
    savaStatus:true,
    sel_type_input:0,
    sel_type:0,
    numbers:'',
    rand_name:'',
    jifen_name:'',
    img: [],  //活动图片，
    showFull: false,  //全屏
    showFull_image:false,
    sel_index: '',  //当前选中的图片
    selected_goods: [],  //被选中的商品 组成购物车
    hideScroll:true,
    bindSource: [], //绑定到页面的数据，根据用户输入动态变化
    longitude: '',
    latitude: '',
    is_preview:false,
    company_name:'',
    integral:'',
    avatar:'',
    business_id:'',
    lx:true,
    contact_name: '', //联系人
    contact_phone: '', //联系电话
    garden: '', //所在小区
    address: '', //详细地址,点击结果项之后替换到文本框的值
    explain:'',
    remark:'',
    position:false,
    chengde_name:'',
    chengde_phone:'',
    chengde_school:'',
    chengde_class:'',
    ad_content:{},
    select_type:0,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    app.data.garbage_info = [];
    if(this.options.type){
      this.setData({
        type:this.options.type,
      })
    }
    if(this.options.type == 1){
      this.setData({
        jifen_name:'每次投放一次，可得10积分',
        name:'可回收种类',
        explain:'可回收'
      })
    }
    if(this.options.type == 2){
      this.setData({
        jifen_name:'每次投放一公斤厨余，可得5积分，最高可得20积分',
        name:'厨余垃圾重量',
        explain:'厨余垃圾'
      })
    }
    if(this.options.type == 3){
      this.setData({
        jifen_name:'每次投放一次，可得10积分',
        name:'有害垃圾种类',
        explain:'有害垃圾'
      })
    }
    if(this.options.type == 4){
      this.setData({
        jifen_name:'每次投放一公斤，可得5积分',
        name:'其他垃圾及重量',
        explain:'其他垃圾'
      })
    }
    this.getGoodsByCate();
    // 转百度定位坐标
    this.zhuan_baidu();
  },
  zhuan_baidu(){
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        return that.get_address();
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
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
        return that.get_address();
      }
    })
  },
  get_address(){
    let that = this;
    common.get('/garbage/address',{
      member_id:wx.getStorageSync('member_id'),
      lng:that.data.longitude,
      lat:that.data.latitude
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          contact_name:res.data.data.contact_name,
          contact_phone:res.data.data.contact_phone,
          garden:res.data.data.garden,
          address:res.data.data.address,
          chengde_name:res.data.data.chengde_name?res.data.data.chengde_name:'',
          chengde_phone:res.data.data.chengde_phone?res.data.data.chengde_phone:'',
          chengde_school:res.data.data.chengde_school?res.data.data.chengde_school:'',
          chengde_class:res.data.data.chengde_class?res.data.data.chengde_class:'',
          position:res.data.position,
        })
      }
    }).catch(e =>{
      console.log(e)
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
  getGoodsByCate() {
    let that = this;
    common.get("/garbage/index", {
    }).then( res => {
      if ( res.data.code == 200 ) {
        if(that.data.type == 1){
          that.setData({
            newlists: res.data.data.huishou,
            goods_type:res.data.data.huishou[0].type
          })
        }
        if(that.data.type == 2){
          that.setData({
            newlists: res.data.data.chuyu,
            goods_type:res.data.data.chuyu[0].type
          })
          console.log(res.data.data[0][0])
        }
        if(that.data.type == 3){
          that.setData({
            newlists: res.data.data.youhai,
            goods_type:res.data.data.youhai[0].type
          })
        }
        if(that.data.type == 4){
          that.setData({
            newlists: res.data.data.qita,
            goods_type:res.data.data.qita[0].type
          })
        }
        console.log(that.data.newlists)
        that.tongjiTot();
        that.changePrice();
      }
    })
  },
  // 活动数量列表点击事件
  changere(e){
    let that = this;
    console.log(e)
    let goodid = e.currentTarget.dataset.goods_id;
    let shopcar_list = that.data.selected_goods;
		let name= e.currentTarget.dataset.name;
		let integral= e.currentTarget.dataset.integral; 
		let rand_name= e.currentTarget.dataset.rand_name;
    let goods_type= e.currentTarget.dataset.goods_type;
    
    if(goodid != -1){
      that.setData({
        numbers:'',
      })
    }
    that.setData({
      sel_type:1,
      goodid,
      goods_type,
      rand_name,
    })
    if(shopcar_list.length == 0){
      shopcar_list.push({
        goods_id:goodid,
        goods_type,
        rand_name,
        integral
      })
      that.setData({
        selected_goods: shopcar_list,
        total:integral
      })
    }
    let hasFind = shopcar_list.find(ele =>{
      return ele.goods_type == goods_type
    })
    if(hasFind){
      // 找到了
      if(goodid != -1){
        for(let i=0;i<shopcar_list.length;i++){
          if(shopcar_list[i].goods_type == goods_type ){
            shopcar_list.splice(i,1);
          }
        }
        shopcar_list.push({
          goods_id:goodid,
          goods_type,
          rand_name,
          integral
        })
        that.setData({
          selected_goods: shopcar_list,
          total:integral,
          rand_name
        })
      }
    }
    console.log(shopcar_list)
  },
  save_input_num(e) {
    publicMethod.getFormId(e, this);
    console.log(e)
    let that = this;
    let shopcar_list = that.data.selected_goods;
    let goodid = e.currentTarget.dataset.goods_id;
    let rand_name1= e.detail.value;
    let rand_name = rand_name1.replace(/[^\d]/g,' ');
    let integrals= rand_name*5;
    let integral = integrals.toFixed(2); 
    let goods_type= e.currentTarget.dataset.goods_type;
    if( rand_name >=4 ){
    let integralss = 20.00; 
    let integralsss =integralss.toFixed(2);
      that.setData({
        rand_name,
        integral:integralsss,
      })
    }else{
      that.setData({
        integral,
      })
    }
    
    if(that.data.type == 3){
      let integralss = 20.00; 
      let integralsss =integralss.toFixed(2);
      that.setData({
        rand_name: e.detail.value,
        integral:integralsss,
      })
    }
    if ( shopcar_list.length == 0 ) {
      if ( rand_name ) {
        shopcar_list.push({
          goods_id:goodid,
          goods_type,
          rand_name:that.data.rand_name,
          integral:that.data.integral,
        })
      }
      that.setData({
        selected_goods: shopcar_list,
        total:that.data.integral,
        rand_name:that.data.rand_name,
      })
    }
    let hasFinds = shopcar_list.find( ele => {
      return ele.goods_type == goods_type
    })
    if (hasFinds) {
      //找到l
        for(let i=0;i<shopcar_list.length;i++){
          if(shopcar_list[i].goods_type == goods_type ){
            shopcar_list.splice(i,1);
          }
        }
        if ( rand_name ) {
        shopcar_list.push({
          goods_id:goodid,
          goods_type,
          rand_name:that.data.rand_name,
          integral:that.data.integral,
        })
      }
        that.setData({
          selected_goods: shopcar_list,
          total:that.data.integral,
          rand_name:that.data.rand_name,
        })
    }else{
      shopcar_list.push({
        goods_id:goodid,
        goods_type,
        rand_name:that.data.rand_name,
        integral:that.data.integral,
      })
      that.setData({
        selected_goods: shopcar_list,
        total:that.data.integral,
        rand_name:that.data.rand_name
      })
    }
    console.log(that.data.selected_goods)

  },

  //上传图片

  choosePic: function() { //选取图片
    let that = this;
    let img = that.data.img;
    wx.chooseImage({
      count: 2, // 默认2
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        img = img.concat(tempFilePaths);
        that.setData({
          img: img
        });
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
  openPhoto1(e) {
    let that = this;
    let image = e.currentTarget.dataset.image;
    that.setData({
      preview1: image,
      showFull_image: true
    })
  },
  //关闭图片预览
  closePic() {
    this.setData({
      showFull: false
    })
  },
  closePic1() {
    this.setData({
      showFull_image: false
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


  // 用户点击选择某个联想字符串时，获取该联想词，并清空提醒联想词数组
  itemtap: function (e) {
    this.setData({
      // .id在wxml中被赋值为{{item}}，即当前遍历的元素值
      address: e.target.id,
      // 当用户选择某个联想词，隐藏下拉列表
      hideScroll: true,
      bindSource: []
    })
  },
  remark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  savaData(e) {
    console.log('触发了')
    let that = this;
    let savaStatus = that.data.savaStatus;
    let data = that.data.selected_goods;
    let integral = that.data.total;
    let garbage_rand_name = that.data.rand_name;
    let img = that.data.img;
    let address_detail=that.data.address;
    let garden = that.data.garden;
    let contact_name = that.data.contact_name;
    let contact_phone = that.data.contact_phone;
    let chengde_name = that.data.chengde_name;
    let chengde_phone = that.data.chengde_phone;
    let chengde_school = that.data.chengde_school;
    let chengde_class = that.data.chengde_class;
    let remark = that.data.remark;
    let member_id = wx.getStorageSync('member_id');
    wx.setStorageSync('address_detail', address_detail);
    console.log(data)
    if(!member_id){
      wx.showToast({
        title: '请先登录!',
      })
      return
    }
    if(data.length == 0){
      wx.showToast({
        title: '请选择活动数量！',
        icon:'none'
      })
      return
    }

    if (that.data.img.length == 0) {
      wx.showToast({
        title: "请上传活动图片！",
        icon: 'none',
      })
      return;
    }
    if (that.data.img.length < 2) {
      wx.showToast({
        title: "最少上传两张照片！",
        icon: 'none',
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    })
    if (!savaStatus) {
      return
    }
    that.setData({
      savaStatus: false
    })
    common.get('/garbage/to_order',{
      member_id,
      address_detail:that.data.address,
      integral,
      contact_phone,
      contact_name,
      chengde_name,
      chengde_phone,
      chengde_school,
      chengde_class,
      garden,
      remark,
      garbage_rand_name,
      garbage_type:that.data.goods_type,
      lng: that.data.longitude,
      lat: that.data.latitude,
    }).then(res =>{
      console.log(res)
      if(res.data.code == 202){
        wx.hideLoading();
        that.setData({
          savaStatus: true
        })
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        return
      }
      if(res.data.code == 200){
        let garbage_info = res.data.data.garbage_info;
        let pop_ad = res.data.data.pop_ad;
        app.data.garbage_info = garbage_info;
        app.uploadimg({
          url: setting.apiUrl + '/garbage/upimage', //这里是你图片上传的接口
          path: img, //这里是选取的图片的地址数组
          member_id,
          name:'files',
          id:res.data.data.id,
          picUpSuccess: function (res) {
            wx.hideLoading();
            wx.hideNavigationBarLoading();
            wx.showToast({
              title: '提交成功',
              icon:'none',
              duration:2500,
              success:function(){
                // that.gettanchuang();
                let business_id = pop_ad.business_id;
                let i = pop_ad.integral;
                let lx = pop_ad.lx;
                if(lx == 1){
                  if(pop_ad.select_type == '1'){
                    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('member_id') + "&discount_id=" + pop_ad.ad_content.id + "&integral=" +i+ "&is_cxtg=1";
                    wx.navigateTo({
                      url: url
                    })
                  }
                  if(pop_ad.select_type == '2'){
                    let url = "/packageA/pages/coupon_detail/index?id=" + pop_ad.ad_content.id + "&integral=" +i+ "&is_cxtg=1";
                    wx.navigateTo({
                      url: url
                    })
                  }
                }else{
                 return
                }
              }  
            })
          }
        });
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
  // gettanchuang(){
  //   let that = this;
  //   common.get('/agent/pop_ad',{
  //     member_id:wx.getStorageSync('member_id'),
  //     lng: that.data.longitude,
  //     lat: that.data.latitude,
  //   }).then(res =>{
  //     if(res.data.code ==200){
  //       that.setData({
  //         company_name:res.data.data.company_name,
  //         integral:res.data.data.integral,
  //         avatar:res.data.data.avatar,
  //         business_id: res.data.data.business_id,
  //         lx:res.data.data.lx,
  //         is_preview:true,

  //       })
  //     }else{

  //     }
  //   }).catch(e =>{
  //     console.log(e)
  //   })
  // },
  click_bg(){
    // this.setData({
    //   is_preview:false
    // })
    // wx.reLaunch({
    //   url: '/pages/huishou/submitOther/index?member_id='+ wx.getStorageSync('member_id'),
    // })
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
  contact_name(e){
    this.setData({
      contact_name:e.detail.value
    })
  },
  contact_phone(e){
    this.setData({
      contact_phone:e.detail.value
    })
  },
  //承德活动
  chengde_name(e){
    this.setData({
      chengde_name:e.detail.value
    })
  },
  chengde_phone(e){
    this.setData({
      chengde_phone:e.detail.value
    })
  },
  chengde_school(e){
    this.setData({
      chengde_school:e.detail.value
    })
  },
  chengde_class(e){
    this.setData({
      chengde_class:e.detail.value
    })
  },
  address(e){
    let that = this;
    let address = e.detail.value;
    that.setData({
      address,
    })
    common.get('/garbage/waste_address_search',{
      address,
    }).then( res =>{
      if(res.data.code == 200){
        let newsoure = res.data.data;
        let bindSource = [];
        if(newsoure.length > 0){
          newsoure.forEach(ele => {
            bindSource.push(ele.address)
          });
        }else{
          bindSource = [];
        }

        console.log(bindSource)
        if(bindSource.length > 0){
          that.setData({
            // 匹配结果存在，显示自动联想词下拉列表
            hideScroll: false,
            bindSource,
            arrayHeight: bindSource.length * 71
          })
        }else{
          that.setData({
            hideScroll: true,
            bindSource: [],
          })
        }

      }
    })
  },
  saveGarden(e) {
    console.log(e)
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },

})