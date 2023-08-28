const app = getApp()
const common = require('../../../../assets/js/common');
const Makephoto = require('../../../../assets/js/setting');
const publicMethod = require('../../../../assets/js/publicMethod');

Page({
  data: {
    true_memberid:[],
    library_id:'',
    book_info:[],
    bookinfolen:false,
    mymember_id:'',
    cate_list: [],  //类目
    cateSeleted: '',  //当前选中的类目
    btnTop: 400,
    btnLeft: 300,
    truue:false,
    parent_member_id:'',
    isfenxiang:0,
    pop2:false,
    input_text:'',
    top_img:[],
    canIUseGetUserProfile: false

  },

  onLoad: function (options) {
    let that = this;
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    let member_id =  wx.getStorageSync('member_id');
    that.setData({
      member_id,
    })
    if(this.options.isfenxiang == 1){
      that.setData({
        isfenxiang:this.options.isfenxiang,
        parent_member_id:this.options.member_id
      })
      wx.login({
        success: function (data) {
          that.setData({
            loginData: data
          })
        }
      })
    }
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
  if (wx.getUserProfile) {
    this.setData({
      canIUseGetUserProfile: true
    })
  }
    that.getBannerUrls();
  },

  onReady: function () {

  },
  onShow: function () {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (member_id){
      that.setData({
        member_id: member_id,
        pop2: false
      })
      that.addIntegral();
    }
    that.setData({
      member_id,
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
      shopList: [],
      input_text:''
    })
    app.data.book_info2 = [];
    that.getShangjia();
    that.getShopCates();
  },
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
  onShareAppMessage: function (res) { //分享
    console.log(res)
    let member_id = wx.getStorageSync('member_id');
    let url = '/packageA/pages/eiltemode/class_bookslist/index?member_id=' + member_id + '&isfenxiang=1';
    if(res.from === "menu"){
      return {
        title:'好友送你一次积分换书的机会，还包邮到家哦！',
        path:url,
      }
    }
    if(res.from == "button"){
      return {
        title:'好友送你一次积分换书的机会，还包邮到家哦！',
        path:url,
      }
    }
  },

  //获取可上架人员
  getShangjia() {
    let that = this;
    common.get('/newhome/members_code', {}).then( res => {
      if ( res.data.code == 200 ) {
        let member_id = that.data.member_id;
        let true_memberid = res.data.data.member_id;
        let truue = true_memberid.find(ele =>{
          console.log(ele)
          return ele == member_id
        })
        if(truue){
          that.setData({
            truue:true
          })
        }
        that.setData({
          library_id:res.data.data.library_id
        })
      }
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
  saoma(){
    let that = this;
    //唤起摄像头
    wx.scanCode({   
    success(res) {
      console.log("扫码结果", res);
      common.get("/book/sao_isbn", { isbn: res.result }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          let book_name = res.data.data.book_name
          let book_id = res.data.data.book_id;
          let isbn = res.data.data.isbn;
          let book_price = res.data.data.integral_price;        
          let book_image = res.data.data.book_image;
          let book_author = res.data.data.author;
          let book_publisher = res.data.data.publisher;
          let summary = res.data.data.summary;
          let category_id = res.data.data.category_id;
          /*跳转页面*/
          wx.navigateTo({
            url: "/packageA/pages/eiltemode/addbooks_list/index?book_name=" + book_name + "&book_id=" + book_id + "&isbn=" + isbn + "&book_price=" + book_price + "&book_image=" + book_image + "&book_author=" + book_author + "&book_publisher=" + book_publisher+"&library_id="+that.data.library_id+"&summary=" + summary + "&category_id=" + category_id
          })
          console.log(1)
        } else {
          let is_err = 1;
          wx.navigateTo({
            url: "/packageA/pages/eiltemode/addbooks_list/index?is_err=" + is_err + '&is_title=' + is_title + "&library_id=" + that.data.library_id,
          })
        }
      })
    },
    complete(ret, result) {
      console.log('ret', ret);
      console.log('result', result);
     },
    })
  },




  //获取商家类目
  getShopCates() {
    let that = this;
    common.get('/newhome/category_books', {}).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          cate_list: res.data.data,
          cateSeleted: res.data.data[0].id
        })
        that.getShopByCate();
      }
    })
  },
  //点击切换类目
  getCateShop(e) {
    let that = this;
    that.setData({
      input_text:'',
      book_info: [],
      cateSeleted: e.target.dataset.id,
      bookinfolen:false
    })
    that.getShopByCate();
  },
   //根据类目获取商家信息
   getShopByCate() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/newhome/category_books_list', {
      category_id: that.data.cateSeleted,
    }).then( res => {
      if ( res.data.code == 200 ) {
        wx.hideLoading();
        let book_info = res.data.data;
        let book_info2 = app.data.book_info2;
        for(var i=0;i<book_info.length;i++){
          let checked = book_info2.find(ele =>{
            return ele.book_id == book_info[i].book_id
          })
          if(checked){
            book_info[i].checked = true
          }
        }

        if(res.data.data.length <= 0){
          that.setData({
            bookinfolen:true
          })
        }
        that.setData({
          book_info,
        })
      } else if ( res.data.code == 206 ) {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },

//选择图书馆
chooseLibrary(e) {
  let that = this;
  let index = e.currentTarget.dataset.index;
  let book_id = e.currentTarget.dataset.id;
  let book_name = e.currentTarget.dataset.book_name;
  let checked = e.currentTarget.dataset.checked;
  let images_medium = e.currentTarget.dataset.images_medium;
  let integral_price = e.currentTarget.dataset.integral_price;
  let library_id = e.currentTarget.dataset.library_id;
  let book_info = that.data.book_info;
  let book_info2 = app.data.book_info2;
      //先判断购物车里有没有这个商品，没有则添加，有则加数量
      if (book_info2.length == 0) {
        book_info2.push({
          book_id,
          book_name,
          checked:book_info[index].checked,
          images_medium,
          integral_price,
          library_id,
      })
      book_info[index].checked = !checked;

    }else{
      let hasFinds = book_info2.find(ele => {
        return ele.book_id == book_id;
      })
      if (hasFinds) {
        //找到l
          for(let i=0;i<book_info2.length;i++){
            if(book_info2[i].book_id == book_id ){
              book_info2.splice(i,1);
            }
          }
      book_info[index].checked = !checked;

      }else if(book_info2.length>=3){
        wx.showToast({
          title: '最多选择三本图书...',
          icon:'none'
        })
        return
      }else{
        book_info2.push({
          book_id,
          book_name,
          checked:book_info[index].checked,
          images_medium,
          integral_price,
          library_id,
        })
      book_info[index].checked = !checked;

        that.setData({
          book_info
        })
      }
    }

    app.data.book_info2 = book_info2
    that.setData({
      book_info
    })

  console.log(that.data.book_info);
  console.log(app.data.book_info2)
},
// 前往购物车列表页
goToAcrt(){
  let that = this;
  let member_id = wx.getStorageSync('member_id');
  let book_info2 = app.data.book_info2;
  let new_book_info = [];
  let pay_money = 0;
  let number = 0;

  console.log(book_info2);
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
    book_info2.forEach(ele =>{
      pay_money += (ele.integral_price - 0);
      number = book_info2.length;
      ele.num = 1;
    })

    console.log(book_info2)
    let new_book_info1 = {'book_info': book_info2};
    wx.setStorageSync('book_info1', new_book_info1);
    if(book_info2.length == 0){
      wx.showToast({
        title: '请先选择图书...',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/eiltemode/memberorder/index?pay_money=' + pay_money.toFixed(2) + '&number=' + number
    })
  }
},
// 前往图书详情
goTobookdetail(e) {
  console.log(e)
  let library_id = e.currentTarget.dataset.library_id;
  let  id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url:"/packageA/pages/eiltemode/goto_book_detil/goto_book_detil?id=" + id + "&library_id=" + library_id,
  })
},

  // 生成海报
  gotoMakephoto(){
    let that = this;
    let type = 'jingrui';
    let id = wx.getStorageSync('member_id');
    let page_url = 'packageA/pages/eiltemode/class_bookslist/index';
    let content = '';
    let icon_path = '';
    let member_id= wx.getStorageSync('member_id');
    let apiUrl = Makephoto.makeUrl
      publicMethod.gotoMakephoto(that,type,id,page_url,content,icon_path,member_id);
  },

  getinput_text(e){
    let that = this;
    let input_text = e.detail.value;
    that.setData({
      input_text,
    })
  },
  search_btn(){
    let that = this;
    let input_text = that.data.input_text;
    let book_info = that.data.book_info;
    if(input_text == ''){
      wx.showToast({
        title: '搜索内容不能为空!',
        icon:'none'
      })
      return
    }
    common.get('/newhome/jingrui_search',{
      book_name:input_text,
    }).then(res =>{
      if(res.data.code == 200){
        console.log(res)
        if(res.data.data.length <= 0){
          that.setData({
            bookinfolen:true
          })
        }else{
          that.setData({
            bookinfolen:false
          })
        }
        that.setData({
          cateSeleted:0,
          book_info:res.data.data
        })

        console.log(that.data.book_info)
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

  //增加积分
  addIntegral: function(){
    let that = this
    common.get("/newhome/jingrui_integral", {
      member_id: that.data.member_id,
      parent_member_id: that.data.parent_member_id,
    }).then(res => {
      if (res.data.code == 200) {

      } else{
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none'
        })
      }
    })
  },
  myCatchTouch(){
    return false
  },
  getBannerUrls() { //轮播图地址
  let that = this
  common.get('/banner/newInfo', {
    member_id: that.data.member_id,
    type: 15
  }).then(res => {
    console.log("banner图")
    console.log(res)
    if (res.data.code == 200) {
      that.setData({
        top_img: res.data.data,
      })
    }
  }).catch(e => {
    app.showToast({
      title: "数据异常"
    })
    console.log(e)
  })
},
})