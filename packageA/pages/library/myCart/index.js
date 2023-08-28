const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allselected: false,
    allprices: 0.00,
    cartsdata:[],
    dataStatus:false,
    sel_shopcart_list:[], // 选取的商品
    number:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if(options.member_id){
      that.setData({
        member_id : options.member_id
      })
    }
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
    this.setData({
      allprices:0.00
    })
    this.getCartlist();
  },
getCartlist(){
  let that = this;
  common.get('/library/MyBookCar', {
    member_id: that.data.member_id,
  }).then(res => {
    if(res.data.code == 200){
      var cartsdata= res.data.data.data;
      var allprices = 0.00;
      for (var i in cartsdata) {
        // console.log()
        var book_info = cartsdata[i].book_info
        for (var a = 0; a < book_info.length; a++) {
          if (book_info[a].selected) {
            //当前商品价格*数量 +
            let price = Number(book_info[a].integral_price)
            let num = parseInt(book_info[a].num) //防止num为字符 *1或parseInt Number
            allprices += price * num
          }
        }
      }
      that.setData({
        cartsdata,
        word:res.data.data.word,
        allprices: allprices.toFixed(2)
      })
    }

    if (that.data.cartsdata == null) {
      that.setData({
          dataStatus: true
        })
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
  //计算总价格  所有选中商品的 （价格*数量）相加

  getallprices: function () {
    var cartsdata = this.data.cartsdata //购物车数据
    console.log(cartsdata)
    var allprices = 0.00
    for (var i in cartsdata) {
      // console.log()
      var book_info = cartsdata[i].book_info
      for (var a = 0; a < book_info.length; a++) {
        if (book_info[a].selected) {
          //当前商品价格*数量 +
          let price = Number(book_info[a].integral_price)
          let num = parseInt(book_info[a].num) //防止num为字符 *1或parseInt Number
          allprices += price * num
        }
      }
    }
    //跟新已选数量
    this.setData({
      allprices: allprices.toFixed(2)
    })
  },
  //全选条件 条件->商铺全选择全选 反之
  allallprices: function () {
    let cartsdata = this.data.cartsdata
    let storenum = cartsdata.length;
    let allselected = this.data.allselected
    let allselectednum = 0;
    for (var i = 0; i < cartsdata.length; i++) {
      if (cartsdata[i].selected == true) {
        allselectednum++
      }
    }
    if (storenum == allselectednum) {
      allselected = true
    } else {
      allselected = false
    }
    this.setData({
      allselected: allselected
    })
    this.getallprices();
  },
  // 店铺的选中
  storeselected: function (e) {
    var cartsdata = this.data.cartsdata //购物车数据
    let index = e.currentTarget.dataset.index //当前店铺下标
    var thisstoredata = cartsdata[index].book_info //当前店铺商品数据
    let sel_welfaregood_list = this.data.sel_welfaregood_list;
    //改变当前店铺状态
    if (cartsdata[index].selected) {
      cartsdata[index].selected = false
      //改变当前店铺所有商品状态
      for (var i in thisstoredata) {
        cartsdata[index].book_info[i].selected = false
      }
    } else {
      cartsdata[index].selected = true
      //改变当前店铺所有商品状态
      for (var i in thisstoredata) {
        cartsdata[index].book_info[i].selected = true
      }
    }
    this.setData({
      cartsdata: cartsdata //店铺下商品的数量
    })
    this.getallprices();
    this.allallprices();
  },
  // 商品的选中
  goodsselected: function (e) {
    console.log(e)
    var cartsdata = this.data.cartsdata //购物车数据
    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标
    let idx = e.currentTarget.dataset.selectIndex - 0 //当前店铺下标
    let cai = cartsdata[idx].book_info; //当前商品的店铺data.book_info
    let curt = cai[index]; //当前商品数组
    // let sel_welfaregood_list = this.data.sel_welfaregood_list;
    console.log(curt)
    if (curt.selected) {
      cartsdata[idx].book_info[index].selected = false //点击后当前店铺下当前商品的状态
      cartsdata[idx].selected = false
    } else {
      cartsdata[idx].book_info[index].selected = true //点击后当前店铺下当前商品的状态
      //当店铺选中商品数量与店铺总数量相等时 改变店铺状态
      var storegoodsleg = cartsdata[idx].book_info.length
      var book_info = cartsdata[idx].book_info
      var selectedleg = 0
      for (var i in book_info) {
        if (book_info[i].selected == true) {
          selectedleg++
        }
      }
      if (storegoodsleg == selectedleg) {
        cartsdata[idx].selected = true
      }
    }
    // 更新
    this.setData({
      cartsdata: cartsdata //店铺下商品的数量
    })
    console.log(this.data.cartsdata)
    this.getallprices();
    this.allallprices();
  },
  // 点击+号，num加1，点击-号，如果num > 1，则减1
  addCount: function (e) {
    var cartsdata = this.data.cartsdata //购物车数据
    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标
    let idx = e.currentTarget.dataset.selectIndex //当前店铺下标
    let cai = cartsdata[idx].book_info; //当前商品的店铺data.book_info
    let curt = cai[index]; //当前商品数组
    var num = curt.num; //当前商品的数量
    common.get('/library/EditCar', {
      member_id: wx.getStorageSync('member_id'),
      library_id: curt.library_id,
      library_name: curt.library_name,
      book_name: curt.book_name,
      book_id: curt.book_id,
      integral_price: curt.integral_price,
      images_medium: curt.images_medium,
      type: 'add'
    }).then(res => {
      console.log(res)
      if (res.data.code == 202) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        return
      }
      if (res.data.code == 200) {
        num++;
        cartsdata[idx].book_info[index].num = num //点击后当前店铺下当前商品的数量
        this.setData({
          cartsdata: cartsdata //店铺下商品的数量
        })
        //计算总价格
        this.getallprices();
      } else if (res.data.code == 201) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }

    })

  },
  minusCount: function (e) {
    var cartsdata = this.data.cartsdata //购物车数据
    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标
    let idx = e.currentTarget.dataset.selectIndex //当前店铺下标
    let cai = cartsdata[idx].book_info; //当前商品的店铺data.book_info
    let curt = cai[index]; //当前商品数组
    var num = curt.num; //当前商品的数量
    if (num <= 1) {
      wx.showToast({
        title: '数量不能为0...',
        icon:'none'
      })
      return false;
    }
    common.get('/library/EditCar', {
      member_id: wx.getStorageSync('member_id'),
      library_id: curt.library_id,
      library_name: curt.library_name,
      book_name: curt.book_name,
      book_id: curt.book_id,
      integral_price: curt.integral_price,
      images_medium: curt.images_medium,
      type: 'reduce'
    }).then(res => {
      console.log(res)
      if (res.data.code == 202) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        return
      }
      if (res.data.code == 200) {
        num--;
        cartsdata[idx].book_info[index].num = num //点击后当前店铺下当前商品的数量
        this.setData({
          cartsdata: cartsdata //店铺下商品的数量
        })
        this.getallprices();
      } else if (res.data.code == 201) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }

    })
  },
// 清空购物车
goodsremove(e) {
     console.log(e)
    common.get('/library/EditCar', {
      member_id: wx.getStorageSync('member_id'),
      type: 'reduce_all'
    }).then(res => {
      console.log(res)
      if (res.data.code == 202) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        return
      }
      if (res.data.code == 200) {
        let that = this;
        wx.showToast({
          title: '删除商品成功...',
          icon:'none',
          success:function(){
            that.getCartlist();
            that.getallprices();
          }
        })

      } else if (res.data.code == 201) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }

    })
  },
  placeanorder(){
    let that = this;
    that.setData({
      sel_shopcart_list:[]
    })
    let cartsdata = that.data.cartsdata;
    let allprices = that.data.allprices;
    let member_id = wx.getStorageSync('member_id');
    let number = 0;
    let sel_shopcart_list = that.data.sel_shopcart_list;
    for (var i in cartsdata){
      for (var j in cartsdata[i].book_info){
        if (cartsdata[i].book_info[j].selected == true){
          sel_shopcart_list.push(cartsdata[i].book_info[j]);
          number += (cartsdata[i].book_info[j].num - 0);
        }
      }
    }
    console.log(number)
    that.setData({
      sel_shopcart_list: sel_shopcart_list,
      number,
    })
    common.post('/library/is_makeorder',{
      member_id: wx.getStorageSync('member_id'),
      book_info: sel_shopcart_list,
    }).then(res =>{
      if(res.data.code == 200){
        let all_integral = res.data.data.all_integral;
        let pay_money = res.data.data.pay_money;
        let book_info = res.data.data.book_info;

        wx.setStorageSync('book_info', book_info);

        wx.navigateTo({
          url: '/packageA/pages/library/myCartDetail/index?all_integral=' + all_integral + '&pay_money=' + pay_money + '&number=' + number,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })

  }
})