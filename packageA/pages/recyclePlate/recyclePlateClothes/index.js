const app = getApp();
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');

var date = new Date();
const zhuan_dingwei = require('../../../../assets/js/dingwei.js');
import { getLessLimitSizeImage, getBase64} from '../../../../utils/newImgcomp'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalInfo:{}, // 用户信息
    newlists:[],
    estimate_weight: '',
    order_type:'1', //回收类型:1=>旧衣回收 2=>书籍回收 3=>家电回收
    goodid:0,
    category_info: [   // 家电分类信息
      {id: 915,name:'电视'},
      {id: 1249,name:'冰箱'},
      {id: 1627,name:'洗衣机'},
      {id: 1849,name:'空调'}
    ],
    top_cate_id: '',
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
    order_start_time: '',  // 选中开始时间
    order_end_time: '',  // 选中结束时间
    selectDeta:{}, // 新的选择的时间数据： 选中日期、选中开始时间、选中结束时间
    selectDeta: '',
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
        id: 2,
        checked: !1,
        src: 'http://oss.qingshanpai.com/banner/ecocoin.png',
        name: '环保币'
      },
    ],
    savaStatus:true,
    remark:'',
    more_weight_pop: false,
    changer_address_pop: false,
    changer_time_pop: false,
    count:0,
    ext_id: '',
    is_activity:'1',
    activity_id:0,
    // ======= 做任务赚积分数据  
    is_Signtask:0,
    task_id: 0,
    is_signTaskMask: false,
    taskMaskpreview_title:'',
    taskMaskpreview_jifen:'',
    is_shareBox: false,
    u_items: [
      {value: '1', name: '普通用户', checked: 'true'},
      {value: '2', name: '志愿活动',},
    ],
    selt_u: '1', // 选择角色 1, 普通用户 2、志愿者
    is_btn: '1',  // 1、提交 按钮 ；；  2、邀请按钮
    is_pop: false, // 志愿信息弹窗
    ext_list: [],
    recover_index:0,
    selectedExt: {},  // 选中的志愿者信息
    inv_ext_id:'', //  分享者的地址信息id
    inv_member:'',  // 分享者的 member_id,
    inv_personalInfo:{}, // 分享者的用户信息
    open_share: '', // 是否打开的是用户分享
    perms:{},
    inv_cnt: 0, // 已完成数
    is_comtype:'',
    is_ad: true,
    isDisabled: false,
    photos:[],//图片数组
    images:[], // 上传到oss 后的图片数组
    layer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)

    // ======= 做任务赚积分数据  
    if(options.is_Signtask){
      that.setData({
        is_Signtask: options.is_Signtask,
        task_id: options.task_id
      })
      that.getDoneTask(options.task_id,options.jifen);
    }
    // ======= 做任务赚积分数据  
    if (options.is_activity == '2'){
      that.setData({
        is_activity: options.is_activity,
        activity_id: options.activity_id,
        ext_id: options.ext_id
      })
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var Hours = date.getHours();
    var Minute = date.getMinutes();
    that.setData({
      now_data: year + '-' + month + '-' + day + '',
      now_time: Hours + ':' + Minute + ''
    })
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      payStatus:3,
    });
    if(that.data.order_type == '1'){
      that.setData({
        newlists: [
          {id: 7, rand_name: "10kg",num:'30', estimate_weight: 4,integral_price:150,money_price:0.00,cion_price:30},
          {id: 4, rand_name: "10-20kg",num:'30', estimate_weight: 3,integral_price:150,money_price:0.00,cion_price:75},
          {id: 3, rand_name: "20-50kg",num:'40', estimate_weight: 2,integral_price:300,money_price:0.00,cion_price:125},
          {id: 2, rand_name: "50Kg以上",num:'60', estimate_weight: 1,integral_price:750,money_price:0.00,cion_price:175},
        ]
      })
    }
    if(options.inv_member){
      that.setData({
        open_share: '1',
        inv_member: options.inv_member,
        inv_ext_id: options.ext_id?options.ext_id:''
      })

      // 获取用户信息
      common.get('/content/getMemberInfo', {
        member_id: options.inv_member
      }).then(res => {
        if (res.data.code == 200) {
          that.setData({
            inv_personalInfo: res.data.data,
          });
        }
      })
      // if(options.ext_id){
      //   common.get('/content/getMemberInfo', {
      //     member_id: options.inv_member
      //   }).then(res => {
      //     if (res.data.code == 200) {
      //       that.setData({
      //         inv_personalInfo: res.data.data,
      //       });
      //     }
      //   })
      // }

    }

    that.getInfo();
    setTimeout(() =>{
      if(options.is_comtype == 'community'){
        that.setData({
          user_province: '北京市',
          user_city: '北京市',
          user_district: '朝阳区',
          user_street: '金泰城丽湾',
          province_code: '110000',
          city_code: '110100',
          district_code: '110105',
          garden: '北京市北京市朝阳区',
          is_comtype: options.is_comtype
        })
        wx.setNavigationBarTitle({
          title:'绿城•金泰城丽湾'
        })
      }
      if (options.is_comtype == 'qhysq') {
        that.setData({
          user_province: '北京市',
          user_city: '北京市',
          user_district: '朝阳区',
          user_street: '清河营中路',
          province_code: '110000',
          city_code: '110100',
          district_code: '110105',
          garden: '北京市北京市朝阳区',
          is_comtype: options.is_comtype
        })
        wx.setNavigationBarTitle({
          title:'清河营中路低碳社区'
        })
      }
    },1000)

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
      latitude : app.globalData.latitude,
      longitude : app.globalData.longitude,
      selectDeta: that.data.selectDeta
    })
    // that.getCategory();

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

    // 获取志愿者信息
    let selectedExt = wx.getStorageSync('selectedExt');
    if(!selectedExt){
      common.get('/activity/ext_list',{
        member_id: wx.getStorageSync('member_id'),
      }).then(res =>{
        if (res.data.code == 200){
          that.setData({
            ext_list: res.data.data.ext_list,
            selectedExt: res.data.data.ext_list[0],
          })
          wx.setStorageSync('selectedExt', res.data.data.ext_list[0])
        }
      })
    }else{
      that.setData({
        selectedExt
      })
    }
    that.getextInfoList();
  },
    // 获取我的不同志愿列表
    getextInfoList(){
      let that = this;
      common.get('/fmy/inv_list',{
        member_id: wx.getStorageSync('member_id'),
      }).then(res =>{
        if(res.data.dcode = 200){
          wx.hideLoading();
          that.setData({
            inv_cnt:res.data.data.inv_cnt?Number(res.data.data.inv_cnt):0,
          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            icon:'none',
          })
        }
      }).catch(e =>{
        wx.hideLoading();
        console.log(e)
      })
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
    console.log(1)
    let that = this;
    let lists = that.data.newlists;
    let id = that.data.payStatus;
    let goodid = that.data.goodid;
    let tem = 0;
    lists.forEach(el =>{
      if( goodid == el.id){
        if (id == 2) { //环保币
          tem = el.cion_price;
        } else if (id == 3) { //环保积分
          tem = el.integral_price;
        } else if (id == 4) { //人民币
          tem = el.money_price;
        }
      }
    })
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
  onShareAppMessage: function (res) {
    let that = this;
    console.log(res)
    let path = '';
    if (res.from === 'button') {
      let selt_u = that.data.selt_u;
      if(selt_u == '1'){
        // 普通用户
        path = '/packageA/pages/recyclePlate/recyclePlateClothes/index?inv_member=' + wx.getStorageSync('member_id');
      }
      if(selt_u == '2'){
        // 志愿者
        path = '/packageA/pages/recyclePlate/recyclePlateClothes/index?inv_member=' + wx.getStorageSync('member_id') + '&ext_id=' + that.data.selectedExt.ext_id
      }
      return {
        title: that.data.personalInfo.nickname + '邀请您参加旧物回收！',
        path,
        imageUrl: 'http://oss.qingshanpai.com/huanbaobi/1eeb99cc547dc6ae4a0f74597bf3a1ad.png',
        success: function(res) {
          // 转发成功
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }

    }
    return {
      title: '旧物回收…',
      imageUrl: '/packageA/pages/recyclePlate/recyclePlateClothes/index?inv_member=' + wx.getStorageSync('member_id'),
      path: url,
      success: function(res) {
        // 转发成功
        console.log(res)

      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
    // 活动数量列表点击事件
    changere(e){
      let that = this;
      console.log(e)
      let goodid = e.currentTarget.dataset.goods_id;
      let newlists = that.data.newlists;
      let estimate_weight = '';
      if(goodid == 6){
        wx.showToast({
          title: '暂不支持5kg以下上门回收！',
          icon: 'none',
        })
        return
      }else{
        newlists.forEach(el =>{
          if(goodid == el.id){
            estimate_weight = el.estimate_weight
          }
        })
        that.setData({
          goodid,
          estimate_weight
        })
        that.tongjiTot();
      }

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
      let that = this;
      let province_code = e.detail.code[0];
      let city_code = e.detail.code[1];
      let district_code = e.detail.code[2];
      common.get("/fmy/check",{
        province_code,
        city_code,
        district_code,
        order_type: that.data.order_type
      }).then( res =>{
        if(res.data.code == 200){
          that.setData({
            garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2]),
            user_province: e.detail.value[0],
            user_city: e.detail.value[1],
            user_district: e.detail.value[2],
            province_code,
            city_code,
            district_code,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch( e=>{
        console.log(e)
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
        order_start_time: e.detail.value
      })
    },
    endtimePicker(e){
      console.log(e)
      this.setData({
        order_end_time: e.detail.value
      })
    },
    // 页面提交订单按钮
    savaData_btn(){
      let that = this;
      let perms ={
        member_id: wx.getStorageSync('member_id'),
        order_type: that.data.order_type,
        order_date: that.data.selectDeta.order_date,
        order_start_time: that.data.selectDeta.order_start_time,
        order_end_time: that.data.selectDeta.order_end_time,
        estimate_weight: that.data.estimate_weight,
        user_name: that.data.user_name,
        user_phone: that.data.user_phone,
        user_province: that.data.user_province,
        user_city: that.data.user_city,
        user_district: that.data.user_district,
        user_street: that.data.user_street,
        user_address: that.data.user_address,
        province_code: that.data.province_code,
        city_code: that.data.city_code,
        district_code: that.data.district_code,
        integral: that.data.total,
        remark: that.data.remark,
      }
      if(perms.order_type == '3'){
        perms.top_cate_id = Number(that.data.top_cate_id)
      }
      if(perms.order_type == '3' && perms.top_cate_id == ''){
        wx.showToast({
          title: '请先选择家电类型',
          icon:'none'
        })
        return
      }
      // 志愿活动界面进来信息
      // if(activity_id && ext_id){
      //   perms.activity_id = activity_id;
      //   perms.ext_id = ext_id;
      // }
      if(perms.estimate_weight === ''){
        wx.showToast({
          title: '请先选择数量',
          icon:'none'
        })
        return
      }
      if(perms.user_address == ''){
        wx.showToast({
          title: '请先填写回收地址',
          icon:'none'
        })
        return
      }
      if(perms.order_date == '' || perms.order_start_time == '' || perms.order_end_time == ''){
        wx.showToast({
          title: '请先预约时间',
          icon:'none'
        })
        return
      }
      if(that.data.open_share == '1'){
        that.setData({
          is_btn: '1',
          perms
        })
        that.savaData();
      }else{
        that.setData({
          is_btn: '1',
          is_shareBox: true,
          perms
        })
        if(that.data.order_type == '3'){
          that.savaData();
        }else{
          that.setData({
            is_shareBox: true,
          })
        }
       
      }

    },
    // 提交订单
    savaData(){
      let that = this;
      let perms = that.data.perms;
      let inv_ext_id = that.data.inv_ext_id;
      let inv_member = that.data.inv_member;
      let member_id = wx.getStorageSync('member_id');
      let photos = that.data.photos;

      // 分享界面进来信息
      if(inv_ext_id){
        if(inv_member != member_id){
          perms.inv_ext_id = inv_ext_id;
          perms.inv_member = inv_member;
        }
      }else if(that.data.is_btn == '1' && that.data.selt_u == '2'){
      // 用户自己在下单的时候选择身份判断是志愿者时传 用户的 志愿信息id
        perms.ext_id = that.data.selectedExt.ext_id;
      }
      if(that.data.is_comtype == 'community'){
        perms.is_community = 1;
      }
      let savaStatus = that.data.savaStatus;
      if (!savaStatus) {
        return
      }
      that.setData({
        savaStatus: false
      })
      if( photos.length <= 0){
        that.create_fmy(perms);
      }else{
        app.uploadOss({
          url: setting.apiUrl + '/file/uploadOss', //这里是你图片上传的接口
          path: that.data.photos, //这里是选取的图片的地址数组
          result_list: [],
          picUpSuccess: function (res) {
            let images = res.result_list;
            that.setData({
              images,
            })
            that.create_fmy(perms);
          }
        });
      }
    },
    create_fmy(p){
      let that = this;
      wx.showLoading({
        title: '提交中...',
      })
      let perms = p;
      if(that.data.images.length >0){
        perms.image = that.data.images[0]
      }
      common.post('/fmy/create',perms).then(res =>{
        wx.hideLoading();        
        if(res.data.code == 200){
          wx.showToast({
            title: '订单创建成功！',
            icon: 'success'
          })
          setTimeout(function(){
            that.setData({
              images: []
            })
            wx.reLaunch({
              url: '/pages/mine/myOrder/index?cur=3',
            })
          },2000)
        }else{
          that.setData({
            savaStatus: true
          })
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e => {
        wx.hideLoading();        
        that.setData({
          savaStatus: true
        })
        wx.showToast({
          title: e.data.msg,
          icon:'none'
        })
        console.log(e)
      })
    },
    getInfo(){
      let that = this;
      common.get("/fmy/index",{member_id:wx.getStorageSync('member_id')}).then(res =>{
        if(res.data.code == 200){
          that.setData({
            user_name: res.data.data.one?res.data.data.one.user_name:'',
            user_phone: res.data.data.one?res.data.data.one.user_phone:'',
            user_province: res.data.data.one?res.data.data.one.user_province:'',
            user_city: res.data.data.one?res.data.data.one.user_city:'',
            user_district: res.data.data.one?res.data.data.one.user_district:'',
            user_street: res.data.data.one?res.data.data.one.user_street:'',
            user_address: res.data.data.one?res.data.data.one.user_address:'',
            province_code: res.data.data.one?res.data.data.one.province_code:'',
            city_code: res.data.data.one?res.data.data.one.city_code:'',
            district_code: res.data.data.one?res.data.data.one.district_code:'',
            garden: res.data.data.one?(res.data.data.one.user_province +  res.data.data.one.user_city + res.data.data.one.user_district):'',
            count: res.data.data.count,
          })
        }
      })
    },
    remark(e){
      this.setData({
        remark: e.detail.value
      })
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
      // this.setData({
      //   changer_time_pop: true
      // })
      wx.navigateTo({
        url: '/packageB/pages/subscribe_date/index?is_fmy=1',
      })
    },
    changer_time_marsk(){
      this.setData({
        changer_time_pop: false
      })
    },
    // =========  做任务赚积分 弹窗功能 =======
  // 做任务赚积分跳转过来
  getDoneTask(id,jifen){
    let that = this;
    let task_id = id;
    let taskMaskpreview_jifen = jifen;
    common.get('/mine/index?op=done_task',{
      member_id: wx.getStorageSync('member_id'),
      task_id,
    }).then(res =>{
      if(res.data.code == 200){
      if(that.data.is_Signtask == '1'){
        that.setData({
          is_signTaskMask: true,
          taskMaskpreview_title:'欢迎了解旧衣回收',
          taskMaskpreview_jifen,
        })
        setTimeout(function(){
          that.setData({
            is_signTaskMask: false,
            taskMaskpreview_title:'',
            taskMaskpreview_jifen:'',
            is_Signtask: 0
          })
        },2000)
      }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  click_mask(){
    this.setData({
      is_signTaskMask: false,
      taskMaskpreview_title:'',
      taskMaskpreview_jifen:'',
      is_Signtask: 0
    })
  },
// ========= 邀请功能 弹窗  ↓ =======
  click_share(){
    let that = this;
    that.setData({
      is_btn: '2',
      is_shareBox: true,
    })
    // 获取用户信息
    common.get('/content/getMemberInfo', {
      member_id: wx.getStorageSync('member_id')
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          personalInfo: res.data.data,
        });
      }
    })
  },
  shareBox_marsk(){
    this.setData({
      is_shareBox: false
    })
  },
    // 身份选择
    radioChange(e){
      console.log(e)
      let that = this;
      that.setData({
        selt_u: e.detail.value
      })
      if( that.data.selt_u == '2'){
        that.setData({
          is_shareBox: false,
          is_pop:true
        })
      }

    },
    // 点击志愿者信息弹窗背景
    click_useinter(){
      let that = this;
      that.setData({
        is_pop:false,
        photos: [],
        images: []
      })
    },
  //点击信息
  chooseExt(e) {
    let that = this;
    console.log(e);
    let is_chooseExt_id = e.currentTarget.dataset.ext_id;
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_infomanagement/index?is_chooseExt=1' + '&is_chooseExt_id=' + is_chooseExt_id,
    })
  },
  click_look(){
    wx.navigateTo({
      url: '/packageA/pages/myFmyinv_list/index',
    })
  },
  adClose(){
    this.setData({
      is_ad: false
    })
  },
 // 预估重量范围: ；回收类型为2(书籍回收)时:范围包含:11=>50本以上,12=>35-50本,13=>20-35本,14=>5-20本,15=>5本以下；回收类型为3或者4(家电回收或玩具回收)时,范围包含:16=>3个以下,17=>3-5个,18=>5-10个,19=>10-15个,20=>15个以上
  changeTabItem(e){
    let order_type = e.currentTarget.dataset.order_type;
    if(order_type == '1'){ //旧衣回收
      this.setData({
        newlists: [
          {id: 7, rand_name: "10kg",num:'30', estimate_weight: 4,integral_price:150,money_price:0.00,cion_price:30},
          {id: 4, rand_name: "10-20kg",num:'30', estimate_weight: 3,integral_price:150,money_price:0.00,cion_price:75},
          {id: 3, rand_name: "20-50kg",num:'40', estimate_weight: 2,integral_price:300,money_price:0.00,cion_price:125},
          {id: 2, rand_name: "50Kg以上",num:'60', estimate_weight: 1,integral_price:750,money_price:0.00,cion_price:175},
        ]
      })
    }
    if(order_type == '2'){ //书籍回收
      this.setData({
        newlists: [
          {id: 4, rand_name: "5kg-10kg",num:'10', estimate_weight: 14,integral_price:150,money_price:0.00,cion_price:30},
          {id: 3, rand_name: "10-20kg",num:'20', estimate_weight: 13,integral_price:150,money_price:0.00,cion_price:75},
          {id: 2, rand_name: "20-50kg",num:'50', estimate_weight: 12,integral_price:300,money_price:0.00,cion_price:125},
          {id: 1, rand_name: "50Kg以上",num:'100', estimate_weight: 11,integral_price:750,money_price:0.00,cion_price:175},
        ]
      })
    }
    if(order_type == '3'){ //家电回收
      this.setData({
        newlists: [
          {id: 5, rand_name: "3个以下",num:'10', estimate_weight: 16,integral_price:0,money_price:0.00,cion_price:0},
          {id: 4, rand_name: "3-5个",num:'10', estimate_weight: 17,integral_price:0,money_price:0.00,cion_price:0},
          {id: 3, rand_name: "5-10个",num:'20', estimate_weight: 18,integral_price:0,money_price:0.00,cion_price:0},
          {id: 2, rand_name: "10-15个",num:'30', estimate_weight: 19,integral_price:0,money_price:0.00,cion_price:0},
          {id: 1, rand_name: "15个以上",num:'50', estimate_weight: 20,integral_price:0,money_price:0.00,cion_price:0},
        ]
      })
    }
    this.setData({
      order_type,
      goodid:0,
      top_cate_id: '',
      photos:[],
      images: []
    })

  },
  // 点击选择家电
  changereCateId(e){
    this.setData({
      top_cate_id: e.currentTarget.dataset.top_cate_id
    })
  },

  // 上传图片功能
  chooseImg(e){
    let that = this;
      //拍照、从相册选择上传
    wx.chooseImage({
        count: 1, // 默认9
        sizeType:['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType:['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success:function(res){
          // 返回选定图片的本地文件列表，tempFilePaths可以作为img标签的src列表
          let tempFilePaths = res.tempFilePaths; //这个是选择后返回的图片列表
          that.getLessLimitSizeImage(0,tempFilePaths);
        },
        fail:function(err){
            console.log(err)
        }
    })
  },
  getLessLimitSizeImage(index,ts){
    let that = this;
    let maxSize = 1000;
    let dWidth = wx.getSystemInfoSync().windowWidth;
    let num = Number(ts.length);
    //压缩并获取图片，这里用了递归的方法来解决canvas的draw方法延时的问题
    if (index < num){ 
      getLessLimitSizeImage('canvas',ts[index],maxSize, dWidth, function(img){
        let photos = that.data.photos;
        photos.push(img);
        that.setData({
          photos,
        })  
        // that.setData({
        //   photos: that.data.photos.concat(img)
        // })         
        wx.getFileInfo({
            filePath:img,
            success:function(res){
              console.log('3压缩后：'+res.size/1024+'kb')
            }
        })
        index = index + 1;
        that.getLessLimitSizeImage(index,ts)
      })
    }

  },
  openPhoto: function(event) { //打开图片
    let that = this;
    that.setData({
      layer: true,
      preview: event.currentTarget.dataset.url,
      imgname: event.currentTarget.dataset.imgname,
      previewIndex: event.currentTarget.dataset.index
    });
  },
  checkDisabled: function(){
     let that = this
     that.setData({
        isDisabled: false
     })
  },
  closePic: function() { //关闭图片
    let that = this;
    that.setData({
      layer: false
    });
  },
  delPic: function() {
    let that = this;
    if (that.data.isDisabled) {
      return;
    }
    let picsUp = that.data.photos;
    picsUp.splice(that.data.previewIndex, 1);
    that.setData({
      photos: picsUp,
      layer: false
    });
  },

})