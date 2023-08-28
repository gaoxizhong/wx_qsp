const app = getApp();
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade:80,
    member_id:'',
    library_id:'',
    info_img:'',
    mymember_id:'',
    book_info:[],
    bookinfolen:false,
    is_leamsg:false,
    leamsg:'',
    library_content:[],
    library_see_data:[],
    libracont_len:0,
    is_car:'/images/acrt.png',
    is_car_1: '/images/acrt-1.png',
    btnTop: 400,
    btnLeft: 300,
    windowHeight: '',
    windowWidth: '',
    content_num:0,
    show_photo:false,
    photo_img:'http://oss.qingshanpai.com/banner/obtain-method.png',
    is_modify:false,
    library_name : '',
    member_name : '',
    phone : '',
    address : '',
    latitude: '',
    longitude: '',
    selectedLibrary: [],  //被选中的
    library_see_num:0,
    library_see:[],
    big_address:'请选择省市区',
    switchvalue:false,
    attention:false,
    library_password:'',
    follow_member_id:'',
    parent_member_id:'',
    view_member_id:'',
    pop2: false,
    rv:'',
    search_name:'',
    canIUseGetUserProfile: false,
    info_status: 0
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
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options)
    let that = this;
      that.setData({
        library_id:this.options.library_id,
        member_id: wx.getStorageSync('member_id'),
      })
      if(this.options.member_id){
        that.setData({
          parent_member_id: this.options.member_id,
          view_member_id: this.options.member_id
        })
      }
      var member_id = wx.getStorageSync('member_id');
      console.log(member_id)
      if (!member_id){
         that.setData({
           pop2:true
         })
      }else{
        // 自动加入对方环保圈
        // publicMethod.openCircle(that,that.data.rv.id,that.data.view_member_id);
      }
  /**
  *  获取系统信息
  */
   wx.getSystemInfo({
    success: res => {
      console.log(res)
      let windowHeight = res.windowHeight;
      let windowWidth = res.windowWidth;
      let btnTop = windowHeight - 134;
      this.setData({
        windowHeight,
        windowWidth,
        btnLeft: windowWidth - 65,
        btnTop
      })
    }
  })
  // wx.hideShareMenu();
},
  /**
   * 生命周期函数--监听页面初次渲染完成
  **/
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    console.log('触发了onshow')
    that.setData({
      book_info:[],
      search_name:'',
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
    })
    that.get_member_library_detail();
    that.getPersonInfo();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      library_see_data:[],
      library_content:[],
      book_info:[],
      selectedLibrary: [],  //被选中的
      library_see_num:0,
      library_see:[],
    })
    that.get_member_library_detail();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) { //分享
    console.log(res)
    let title = this.data.library_name;
    let library_id = this.data.library_id;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      that.setData({
        pop2: true
      })
      return;
    }else{
      let url = '/packageA/pages/library/personal_index/personal_index?library_id=' + library_id + '&member_id=' + member_id;
      if(res.from === "menu"){
        return {
          title:title,
          path:url,
        }
      }
      if(res.from == "button"){
        return {
          title:title,
          path:url,
        }
      }
    }
    
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch() {
    return
  },
// 获取个人图书馆详情信息
get_member_library_detail(){
  let that = this;
  let library_id = that.data.library_id;
  let member_id = that.data.member_id;

  common.get('/library/get_member_library_detail',{
    library_id,
    member_id
  }).then(res =>{
    if(res.data.code ==200){
      if (res.data.data.library_info.is_password == 2) {
        that.setData({
          switchvalue: false
        })
      } else if (res.data.data.library_info.is_password  == 1) {
        that.setData({
          switchvalue: true
        })
      }
      console.log(res.data.data.library_see_data)
      that.setData({
        latitude:res.data.data.library_info.latitude,
        longitude:res.data.data.library_info.longitude,
        book_info:res.data.data.book_info,
        follow_member_id: res.data.data.library_info.member_id,
        content_num: res.data.data.content_num,
        library_see_data:(res.data.data.library_see_data).splice(0,3),
        library_see:res.data.data.library_see_data,
        library_content:(res.data.data.library_content).splice(0,1),
        info_img:res.data.data.library_info.library_img,
        library_name:res.data.data.library_info.library_name,
        member_name:res.data.data.library_info.member_name,
        book_num:res.data.data.library_info.book_num,
        address:res.data.data.library_info.address,
        big_address:res.data.data.library_info.big_address,
        phone:res.data.data.library_info.phone,
        mymember_id:res.data.data.library_info.member_id,
        grade:res.data.data.library_info.grade,
        library_see_num:res.data.data.library_info.library_see_num,
        library_password:res.data.data.library_info.library_password,
        info_status:res.data.data.library_info.status,
        attention:res.data.data.follow,
        
      })
      if(that.data.book_info.length <= 0){
        that.setData({
          bookinfolen:true
        })
      }else{
        that.setData({
          bookinfolen:false
        })
      }
      console.log(that.data.library_see)
    }
  }).catch(e =>{
    console.log(e)
  })
},
  //查询路线
  getRoadLine(e) {
    let that = this;
    console.log(e);
    wx.getLocation({
      type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
      isHighAccuracy: true,
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        const latitude = Number(that.data.latitude)
        const longitude = Number(that.data.longitude)
        wx.openLocation({        //所以这里会显示你当前的位置
          latitude,
          longitude,
          name: that.data.library_name,
          address: that.data.big_address + that.data.address,
          scale: 18
        })
      }
    })
  },
/**调用电话 */
tel: function () {
  if (this.data.phone!=null){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  }else{
    app.showToast({
      title: "暂无联系电话"
    })
  }
},
// 点击扫码卖书
show_toast(){
  let that = this;
  let info_status = that.data.info_status;
  if(!info_status){
   wx.showModal({
     title: '请先完善信息',
     content: '是否前去完善个人信息',
     confirmText:'完善',
     cancelText:'暂不',
     success (res) {
       if(res.confirm){
          wx.navigateTo({
            url: '/packageA/pages/library/perfect_info/perfect_info?library_id=' + that.data.library_id,
          })
       }
     }
   })
  }else{
    wx.navigateTo({
      url: '/packageA/pages/library/addperbook_explan/addperbook_explan?library_id='+ that.data.library_id,
    })  
  }

},
// 去闲置小铺
goToIdle() {
  let that = this;
  let mymember_id = that.data.mymember_id;
  let url = '/pages/mine/myIdle/index?member_id=' + mymember_id;
  wx.navigateTo({
    url: url
  })
},
// 发布留言
release_btn(){
  this.setData({
    is_leamsg:true
  })
},
//查看全部留言
goTolist_detail(){
  let that = this;
  wx.navigateTo({
    url: '/packageA/pages/library/library_content/library_content?member_id=' + that.data.member_id + '&library_id=' + that.data.library_id,
  })
},
//  点击遮罩层
release_mrsk(){
  this.setData({
    is_leamsg:false
  })
},

//  编写留言
leamsg(e){
  console.log(e)
  let leamsg = e.detail.value;
  this.setData({
    leamsg,
  })
},

// 提交留言
leamsg_sub() {
  let that = this;
  let user_info = that.data.user_info;
  console.log(user_info)
  let prems = {
    member_id:that.data.member_id,
    member_photo:that.data.user_info.avatarUrl,
    member_name:that.data.user_info.nickName,
    content : that.data.leamsg,
    library_id:that.data.library_id,

  } 
  if(prems.content == ''){
    wx.showToast({
      title: '请填写留言内容...',
      icon:'none'
    })
    return
  }
  common.post('/library/leave_message',prems).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '提交成功！',
        icon:'success'
      })
      that.setData({
        is_leamsg:false,
        book_info:[],
        leamsg:'',
        library_content:[],
      })
      that.onShow();
    }else{
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })
    }
  }).catch(e =>{
    console.log(e)
  })
},

  // 按钮开始移动
  buttonStart(e) {
    // 获取起始点
    this.setData({
      startPoint: e.touches[0]
    })
  },

  // 按钮移动中
  buttonMove(e) {
    let {
      startPoint,
      btnTop,
      btnLeft,
      windowWidth,
      windowHeight,
      isIpx
    } = this.data
    // 获取结束点
    let endPoint = e.touches[e.touches.length - 1]
    // 计算移动距离相差
    let translateX = endPoint.clientX - startPoint.clientX
    let translateY = endPoint.clientY - startPoint.clientY
    // 初始化
    startPoint = endPoint
    // 赋值
    btnTop = btnTop + translateY
    btnLeft = btnLeft + translateX

    // 临界值判断
    if (btnLeft + 45 >= windowWidth) {
      btnLeft = windowWidth - 45;
    }
    if (btnLeft <= 0) {
      btnLeft = 0;
    }
    // 根据屏幕匹配临界值
    let topSpace = 100
    if (isIpx) {
      topSpace = 134
    } else {
      topSpace = 100
    }
    if (btnTop + topSpace >= windowHeight) {
      btnTop = windowHeight - topSpace
    }
    // 顶部tab临界值
    if (btnTop <= 43) {
      btnTop = 43
    }
    this.setData({
      btnTop,
      btnLeft,
      startPoint
    })
  },
// 前往购物车列表页
goToAcrt(){
  let that = this;
  let member_id = wx.getStorageSync('member_id');
  let book_info = that.data.book_info;
  let new_book_info = [];
  let pay_money = 0;
  let number = 0;
  let phone = that.data.phone;
  console.log(phone)

  console.log(that.data.book_info);
  if(!member_id){
    wx.showModal({
      title: '登录后才可查看！',
      content: '是否跳转我的页面',
      confirmColor: '#ff1111',
      success: function (res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/mine/index/index'
          })
        }
      }
    })
    return
  }else{
    book_info.forEach(ele =>{
      if(ele.checked == true){
        new_book_info.push(ele);
        pay_money += (ele.discount_price - 0);
        number = new_book_info.length;
      }
    })
    new_book_info.forEach( ele =>{
      ele.num = 1;
      ele.library_name = that.data.library_name;
      ele.library_id = that.data.library_id;
    })
    console.log(new_book_info)
    let new_book_info1 = {'book_info': new_book_info};
    wx.setStorageSync('book_info', new_book_info1);
    if(new_book_info.length == 0){
      wx.showToast({
        title: '请先选择图书...',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/library/memberorder/index?pay_money=' + pay_money.toFixed(2) + '&number=' + number + '&phone=' + phone,
    })
  }
},
// 前往图书详情
goTobookdetail(e) {
  console.log(e)
  let library_id = e.currentTarget.dataset.library_id;
  let  id = e.currentTarget.dataset.id;
  let  phone = this.data.phone;

  wx.navigateTo({
    url:"/packageA/pages/library/goto_book_detil/goto_book_detil?id=" + id + "&library_id=" + library_id + '&phone=' + phone,
  })
},

//点击打开 图片
open_image(){
  let show_photo = this.data.show_photo;
  console.log(show_photo);
  if(show_photo==false){
    this.setData({
      show_photo:true
    })
  }else{
    this.setData({
      show_photo:false
    })
  }

},
goTomodify(){
    this.setData({
      is_modify:true
    })
  },
modify_mrsk(){
  this.setData({
    is_modify:false
  })
},
inputCrecount(e){
  console.log(e)
  let that = this;
  that.setData({
    library_name:e.detail.value
  })
},
inputCrename(e){
  console.log(e)
  let that = this;
  that.setData({
    member_name:e.detail.value
  })
},
inputCrephone(e){
  console.log(e)
  let that = this;
  that.setData({
    phone:e.detail.value
  })
},
inputCreaddress(e){
  console.log(e)
  let that = this;
  that.setData({
    address:e.detail.value
  })
},
createActivity(){
let that =this;
let prems = {
    member_id: wx.getStorageSync('member_id'),
    library_id:that.data.library_id,
    library_name : that.data.library_name,
    member_name : that.data.member_name,
    phone : that.data.phone,
    address : that.data.address,
    big_address : that.data.big_address,
    library_password:that.data.library_password,
    info_status: 1
}

if(prems.library_name == ''){
  wx.showToast({
    title: '图书馆名称为空！',
    icon:'none'
  })
  return
}
if(prems.member_name == ''){
  wx.showToast({
    title: '姓名不能为空！',
    icon:'none'
  })
  return
}
if(prems.phone == ''){
  wx.showToast({
    title: '电话不能为空！',
    icon:'none'
  })
  return
}
if (!(/^1[345678]\d{9}$/.test(prems.phone)) ) {
  wx.showToast({
    "title": "请填写正确的联系方式！",
    "icon": "none"
  })
  return
}
if(prems.big_address == '' || prems.big_address == '请选择省市区'){
  wx.showToast({
    title: '请选择省市区！',
    icon:'none'
  })
  return
}
if(prems.address == ''){
  wx.showToast({
    title: '地址不能为空！',
    icon:'none'
  })
  return
}

common.get('/library/make_library',prems).then(res =>{
  if(res.data.code == 200){
    wx.showToast({
      title: '修改成功！！！',
      icon:'none',
      duration:2000,
      success:function(){
        that.setData({
          is_modify:false
        })
        that.onShow();
      }
    })
  }else{
    wx.showToast({
      title: res.data.msg,
      icon:'none'
    })
  }
}).catch(e =>{
  console.log(e)
})
},
  //选择图书馆
  chooseLibrary(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_info = that.data.book_info;
    let choseChange = "book_info[" + index + "].checked";
    let book_info_checked = book_info[index].checked;
    console.log(book_info_checked)
    if(book_info_checked==true){
      that.setData({
        [choseChange]: ''
      })
    }else{
      that.setData({
        [choseChange]: true
      })
    }
    
    console.log(that.data.book_info);


  },

  goTo_fangke(){
    wx.navigateTo({
      url: '/packageA/pages/library/library_see/library_see?member_id=' + this.data.member_id + '&library_id=' + this.data.library_id,
    })
  },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/index/index" });
    }
  },
  //删除当前行
  cancel(e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_info = that.data.book_info;
    let book_id = e.currentTarget.dataset.book_id;
    let library_id = e.currentTarget.dataset.library_id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          common.get('/library/del_book', {
            member_id:that.data.member_id,
            library_id,
            book_id
          }).then(res => {
            if (res.data.code == 200) {
              let data = that.data.book_info
              data.splice(index, 1)
              if (data.length <= 0) {
                that.setData({
                  bookinfolen: true
                })
              }
              that.setData({
                book_info: data
              })
            }
          }).catch(e => {
            app.showToast({
              title: "数据异常",
            })
            console.log(e)
          })
        }
      }
    })
    that.setData({
      book_info,
    })
    console.log(that.data.book_info)
  },
  goToorder(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/myDicountOrder/myDicountOrder?type=1&status=0',
    })
  },
  // 城市三级联动
chooseAddress(e) {
  console.log(e)
  this.setData({
    big_address: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2]),
  })
},
gotodingdan(){
  wx.navigateTo({
    url: '/pages/myDicountOrder/myDicountOrder?type=1&status=0',
  })
},

switch1Change(e){
  console.log(e)
  let that = this;
  let switchvalue = e.detail.value;
  console.log(switchvalue)

  common.get('/newhome/library_password',{
    member_id: wx.getStorageSync('member_id'),
    library_id:that.data.library_id,
    is_password:switchvalue
  }).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: '修改状态成功',
        icon:'none'
      })
      that.setData({
        switchvalue,
      })
    }
    if (res.data.code == 201){
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
      that.get_member_library_detail();
    }
  })
},
// 关注
attentionChange(e){
  console.log(e)
  let that = this;
  let attention = e.detail.value;
  console.log(attention)
  common.get('/newhome/follow',{
    member_id: wx.getStorageSync('member_id'),
    follow_member_id:that.data.follow_member_id,
    status:attention
  }).then(res =>{
    if(res.data.code == 200){
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })
      that.setData({
        attention,
      })
    }
    if (res.data.code == 201){
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
      that.get_member_library_detail();
    }
  })
},
  /**
   * 获取小程序二维码参数
   * @param {String} scene 需要转换的参数字符串
   */
  getScene: function (scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
  },
  // 生成海报
  gotoMakephoto(){
    let that = this;
    let type = 'personal_library';
    let id = this.data.library_id;
    let page_url = 'packageA/pages/library/personal_index/personal_index';
    let content = this.data.library_name;
    let icon_path = '';
    let member_id= wx.getStorageSync('member_id');
      publicMethod.gotoMakephoto(that,type,id,page_url,content,icon_path,member_id);
    },
  // 保存海报
  saveImage(e){
    publicMethod.saveImage(e,this);
  },
  //图片预览
  previewImage(e) { 
    let image_url= [];
    console.log(e)
    image_url.push(e.currentTarget.dataset.img);
    wx.previewImage({
      urls: image_url // 需要预览的图片http链接列表  
    });
  },
  // 关闭海报
  clodmark(){
    this.setData({
      makephoto:false
    })
  },
  inputpassword(e){
    let that = this;
    that.setData({
      library_password:e.detail.value
    })
  },
  chooseLibrary1(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    let library_id = e.currentTarget.dataset.library_id;
    wx.navigateTo({
      url: '/packageA/pages/library/info_modify/index?library_id=' + library_id + '&id=' + id,
    })
  },
  //获取个人信息
  getPersonInfo() {
    publicMethod.getPersonInfo(this);
  },
  aaa(){
    return
  },
  //搜索图书
  searchLibrary(e) {
    let that = this;
    console.log(e.detail.value);
    this.setData({
      search_name: e.detail.value
    })
    if (e.detail.value == ''){
      that.setData({
        book_info:[],
      })
      that.get_member_library_detail();
    }
  },
  //条件查找图书
  getLibraryByConditon() {
    let that = this;
    let params = {
      name: that.data.search_name,
      library_id:that.data.library_id
    }
    if(params.search_name == ''){
      wx.showToast({
        title: '搜索不能为空！',
        icon:'none'
      })
      return
    }
    // 搜索书名。。。
    common.get("/library/personal_book_search", params).then(res => {
      if (res.data.code == 200) {
        that.setData({
          book_info: res.data.data
        })
      } else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
})