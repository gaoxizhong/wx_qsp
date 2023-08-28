const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    library_id:'',
    library_name:'',
    library_opentime:'',
    library_address:'',
    is_car:'/images/acrt.png',
    is_car_1: '/images/acrt-1.png',
    book_list : [],
    newbook_list: [],
    isShowConfirm:false,
    library_number:'',
    library_bianma:'',
    latitude:'',
    longitude:'',
    phone:'',
    pageIndex: 1,
    pageSize: 20,
    hasMore: true,
    makephoto:false,
    makephoto_img:'',
    btnTop: 400,
    btnLeft: 300,
    windowHeight: '',
    windowWidth: '',
    cart_number:0,
    songshow:false,
    book_name:'',
    business_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options) // 这时候就会发现this.options上就会有对应的参数了
    if(this.options.is_comtype == 'community'){
      wx.setNavigationBarTitle({
        title:'绿城•金泰城丽湾'
      })
    }
    this.setData({
      library_id: this.options.library_id,
      member_id: wx.getStorageSync('member_id')
    })
    if (options.library_opentime == 'null'){
      this.setData({
        library_opentime: "暂无",
      })
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
          btnLeft: windowWidth - 75,
          btnTop
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      dataStatus:false,
      songshow:false
    })
    that.onPullDownRefresh();
  },
  //获取图书馆信息
  getlibraryinfo(){
    let that = this;
    common.get("/library/get_library_info", {
      library_id: that.data.library_id,
      member_id: that.data.member_id
    }).then(res =>{
     that.setData({
       library_name: res.data.data.library_name,
       library_opentime: res.data.data.operational_hours,
       library_address: res.data.data.address,
       book_num: res.data.data.book_num,
       phone: res.data.data.phone,
       latitude: res.data.data.latitude,
       longitude: res.data.data.longitude,
       library_number: res.data.data.number,
       cart_number: res.data.data.car_num,
       business_id: res.data.data.business_id,

     })
    }).catch(e =>{
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    })
  },
  /*获取书籍信息 */
  getbooklist(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    common.get("/library/library_bookslist", {
      library_id: that.data.library_id,
      member_id
    }).then(res => {
      if (res.data.code == 202) {
        setTimeout(function () {
          that.setData({
            dataStatus: true
          })
        }, 500)
        return
      }
      let count = that.data.book_num;// 获取数据的总数
      let book_list = res.data.data;// 获取存储总数据
      let pageSize = that.data.pageSize;// 获取每页个数
      for (let i = 0; i < book_list.length; i += pageSize){
        // 分割总数据，每个子数组里包含个数为pageSize
        that.data.newbook_list.push(book_list.slice(i, i + pageSize))
      }

      that.getlistData();

      wx.hideLoading();
      if (that.data.book_list.length <= 0) {
        setTimeout(function () {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
    });
  },
getlistData(){ // 前端实现一次获取总数据后分页获取数据
  let that = this;
  if (!that.data.hasMore) {
    wx.showToast({
      title: '已加载全部数据',
      icon: 'none'
    })
    return
  }
  let page = (that.data.pageIndex - 1);
  let newbook_list = that.data.newbook_list;
  let count = that.data.book_num;// 获取数据的总数
  let flag = that.data.pageIndex * that.data.pageSize < count;
  that.setData({
    // 将新获取的数据拼接到之前的数组中
    book_list: that.data.book_list.concat(newbook_list[page]),
    hasMore: flag,
  })
  },
  getData(){
  this.getlibraryinfo();
  this.getbooklist();
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
    console.log('下拉动作')
    let that = this;
    that.setData({
      search_info:'',
      pageIndex: 1,
      book_list:[],
      newbook_list:[],
      hasMore: true,
    })
    that.getData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
      if (that.data.dataStatus){
        return
      }
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getlistData();
      wx.hideLoading()
    }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /*点击上架 */
  show_toast:function(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showModal({
        title: '请先登录！',
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
    }
    this.setData({
      library_bianma: ''
    })
    console.log(that.data.isShowConfirm);
    if(that.data.isShowConfirm){
      that.setData({
        isShowConfirm: false
      })
    }else{
      that.setData({
        isShowConfirm: true
      })
    }
  },
  /*验证编码是否正确 */

  judge_linbarrnum:function(e){
    let that = this;
    console.log(e)
    let library_number = e.detail.value.library_bianma;
    if (library_number==''){
      app.showToast({
        title: "请输入图书馆编号"
      })
    }else{
      common.get('/library/isset_library', {
        library_id: that.data.library_id,
        library_number,
      }).then(res => {
        if(res.data.code==200){
          that.setData({
            isShowConfirm: false
          })
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
                  let book_publisher = res.data.data.publisher
                  /*跳转页面*/
                  wx.navigateTo({
                    url: "/packageA/pages/library/addbook/addbook?book_name=" + book_name + "&book_id=" + book_id + "&isbn=" + isbn + "&book_price=" + book_price + "&book_image=" + book_image + "&book_author=" + book_author + "&book_publisher=" + book_publisher+"&library_id="+that.data.library_id
                  })
                } else {
                  let is_title = res.data.msg;
                  let is_err = 1;
                  wx.navigateTo({
                    url: "/packageA/pages/library/addbook/addbook?is_err=" + is_err + '&is_title=' + is_title + "&library_id=" + that.data.library_id,
                  })
                }
              })
            },
            complete(ret, result) {
              console.log('ret', ret);
              console.log('result', result);
              // if (!result){
              //   wx.showToast({
              //     title: '请扫取书籍条形码',
              //     icon: "none"
              //   })
              // }

            },
          })
        }else{
          app.showToast({
            title: res.data.msg,
          })
        }

      })
    }
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
        console.log(res)
        console.log(latitude)
        console.log(longitude)
        wx.openLocation({        //所以这里会显示你当前的位置
          latitude,
          longitude,
          name: that.data.library_name,
          address: that.data.library_address,
          scale: 18
        })
      }
    })
  },
/**搜索 图书 */
  searchenter(e) {
    console.log(e.detail.value);
    let that = this;
    that.setData({
      search_info: e.detail.value
    })
  },
/**搜索 图书框图书失去焦点 */
  searchblur(e){
    let that = this;
    if (e.detail.value == ''){
      that.getData();
    }
  },
  searclick(){
    let search_info = this.data.search_info;
    this.search(search_info);
  },
  search(search_info){
    let that = this;
    if (search_info !== '') {
      common.get('/book/serach_books', {
        library_id: that.data.library_id,
        search_info: search_info
      }).then(res => {
        console.log(res.data)
        if (res.data.code == 202) {
          app.showToast({
            title: "没有找到"
          })
        } else {
          that.setData({
            book_list: res.data.data
          })
        }
      });
    } else {
      app.showToast({
        title: "请输入内容"
      })
    }
  },
  /**跳积分兑换 */
  gotobuy:function(){
    console.log(this.data.library_id)
    let url = "/pages/buybook/buybook?library_id=" + this.data.library_id + "&library_number=" + this.data.library_number;
    wx.showModal({
      content: '在图书馆内扫描书后条形码，支付环保积分-兑换图书',
      showCancel:false,
      confirmText:'知道了',
      success:function(res){
        if(res.confirm){
          wx.navigateTo({
            url: url
          });
        }
        
      }
    })
  }
 ,
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
  /**点击蒙板 */
  isShowConfirm:function(){
  this.setData({
    isShowConfirm: false
  })
  },
    /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch: function () {
    return
  },
  // 生成海报
  gotoMakephoto(){
    let that = this;
    let type = 'library';
    let id = this.data.library_id;
    let page_url = 'packageA/pages/library/index';
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

// 点击添加到购物车
  add_ShopCart(e){
    console.log(e)
    let that = this;
    let book_list = that.data.book_list;
    let list_index = e.currentTarget.dataset.index;
    let book_id = e.currentTarget.dataset.book_id;
    let stock = e.currentTarget.dataset.stock;
    let name = e.currentTarget.dataset.name;
    let integral_price = e.currentTarget.dataset.integral_price;
    let images_medium = e.currentTarget.dataset.images_medium;
    let member_id = wx.getStorageSync('member_id');

    if (!member_id) {
      wx.showModal({
        title: '登录后才可添加！',
        content: '是否跳转我的页面',
        confirmColor:'#ff1111',
        success:function(res){
          if (res.confirm){
            wx.reLaunch({
              url:'/pages/mine/index/index'
            })
          }
        }
      })
      return
    }else{

      common.get('/library/EditCar',{
        member_id: wx.getStorageSync('member_id'),
        library_id: that.data.library_id,
        library_name: that.data.library_name,
        book_name: name,
        book_id,
        integral_price,
        images_medium,
        type:'add'
      }).then(res => {
        console.log(res)
        if (res.data.code == 202) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        if(res.data.code == 200){
          wx.showToast({
            title: '添加购物车成功！',
            icon: 'none',
            success: function () {
              let cart_number = that.data.cart_number - 0
              book_list[list_index].is_car = true // 1.改变当前图书的选中状态
              that.setData({
                book_list: book_list,  // 2.重新更新图书列表
                cart_number: cart_number += 1
              })
            }
          })
        }else if(res.data.code == 201){
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }

      })

    }

  },
  // 前往购物车列表页
  goToAcrt(){
    let that = this;
    let url = '/packageA/pages/library/myCart/index?member_id=' + that.data.member_id;
    let member_id = wx.getStorageSync('member_id');
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
      wx.navigateTo({
        url: url,
      })
    }
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
  // 前往图书详情
goTobookdetail(e) {
  console.log(e)
  let library_id = e.currentTarget.dataset.library_id;
  let  id = e.currentTarget.dataset.id;
  let  is_books= e.currentTarget.dataset.is_books;
  wx.navigateTo({
    url:"/packageA/pages/library/goto_book_detil/goto_book_detil?id=" + id + "&library_id=" + library_id + '&is_books=' + is_books,
  })
},
songshow(){
  let that = this;
  if(!that.data.business_id){
    wx.showToast({
      title: '暂无福利！',
      icon:'none'
    })
    return
  }else{
    wx.navigateTo({
      url: '/pages/shop/shop?business_id=' + that.data.business_id + '&member_id=' + wx.getStorageSync('member_id'),
    })
  }

  return
  wx.showModal({
    content: '从下面图书列表选择心仪图书，我们会给您送上门哦！',
    showCancel:false,
    confirmText:'知道了',
    success:function(res){
      if(res.confirm){
        that.setData({
          songshow:true
        })
      }
    }
  })

},
  //搜索框输入图书
  searchLibrary(e) {
    let that = this;
    console.log(e.detail.value);
    this.setData({
      book_name: e.detail.value,
    })
    if (e.detail.value == ''){
      that.setData({
        search_info:'',
        pageIndex: 1,
        book_list:[],
        newbook_list:[],
        hasMore: true,
      })
      that.getData();
    }
  },
  //条件查找图书
  getLibraryByConditon() {
    let that = this;
    let params = {
      library_id: that.data.library_id,
      name:that.data.book_name
    }
    wx.showLoading({
      title: '加载中',
      })
    common.get("/garbage/book_search", params).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        that.setData({
          book_list: res.data.data
        })
      } else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
})