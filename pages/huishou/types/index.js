const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const zhuan_dingwei = require('../../../assets/js/dingwei.js');

Page({
  data: {
    formData:{},
    numStatus: !0,
    payStatus: 1,
    sel_type:0,
    sel_type_input:0,
    total: 0,
    numbers:'',
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
      }, 
       {
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
    cateList: [],  //商品类目
    sel_cate_id: 0,  //选中类目id
    sel_re_id: 0,
    cion_price : 0,
    integral_price : 0,
    money_price : 0,
    sel_cate_name:'',
    lists: [],  //获取的商品,
    newlists:[],
    selected_goods: [],  //被选中的商品 组成购物车
    elect:'',
    longitude: '',
    latitude: ''
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;
    if (options.is_comtype == 'qhysq' ) {
      wx.setNavigationBarTitle({
        title:'清河营中路低碳社区'
      })
      that.setData({
        is_comtype: options.is_comtype
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      payStatus:3,
    });

  },
  onShow: function() {
    let that = this;
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
        that.getCategory();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
    })
    that.getCategory();

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
    publicMethod.getFormId(e, this)
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let id = e.currentTarget.dataset.id;
    let data = that.data.payItems;
    let lists = that.data.shopCar;
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
    app.data.shopCar.payStatus = that.data.payStatus;
    that.tongjiTot()
  },
  tongjiTot() {
    let that = this;
    let lists = that.data.selected_goods;
    let id = that.data.payStatus;
    let tem = 0;
    for (let i in lists) {
      if (id == 2) { //环保币
        tem = tem + (lists[i].min * lists[i].cion_price);
      } else if (id == 3) { //环保积分
        tem += lists[i].min * lists[i].integral_price;
      } else if (id == 4) { //人民币
        tem += lists[i].min * lists[i].money_price;
      }
    }
    let tot = tem.toFixed(2);
    app.data.shopCar.total = tot;
    app.data.shopCar.goodList = lists;
    that.setData({
      total: tot
    })
    if(that.total && that.selected_goods.length > 0){
      
    }

  },
  //增加删除
  addOrRed(e) {
    publicMethod.getFormId(e, this)
    let that = this;
    let curIdx = e.currentTarget.dataset.curidx;
    let who = e.currentTarget.dataset.who;
    let goodid = e.currentTarget.dataset.goodid;
    let data = that.data.lists;
    let shopcar_list = that.data.selected_goods;
    let numStatus = that.data.numStatus;

    if (!numStatus) {
      return
    }
    //先判断购物车里有没有这个商品，没有则添加，有则加数量
    if ( shopcar_list.length == 0 ) {
      shopcar_list.push(that.data.lists[curIdx]);
    }
    let hasFind = shopcar_list.find( ele => {
      return ele.id == goodid;
    })
    // debugger
    if ( !hasFind && who == 1 ) {
      //没找到
      data[curIdx].num++;
      data[curIdx].num = parseFloat(data[curIdx].num.toFixed(2));
      shopcar_list.push(that.data.lists[curIdx]);
    } else {
      //找到了
      if (who == 2) {
        hasFind.num--;
        data[curIdx].num = parseFloat(hasFind.num.toFixed(2));
        if (data[curIdx].num <= 0) {
          data[curIdx].num = 0;
          hasFind.num = 0;
        }
      } else {
        hasFind.num++;
        data[curIdx].num = parseFloat(hasFind.num.toFixed(2));
      }
    }
    that.setData({
      selected_goods: shopcar_list
    })
    that.changePrice()
    that.tongjiTot()
  },

  changePrice() {
    let data = this.data.lists;
    let shopcar_list = this.data.selected_goods;
    for (var i = 0; i < data.length; i++) {
      shopcar_list.forEach( ele => {
        if ( ele.id == data[i].id ) {
          let old1 = data[i].num * data[i].money_price;
          let new1 = old1.toFixed(2);
          let old2 = data[i].num * data[i].cion_price;
          let new2 = old2.toFixed(2);
          let old3 = data[i].num * data[i].integral_price;
          let new3 = old3.toFixed(2);
          data[i].money = new1
          data[i].coin = new2
          data[i].jifen = new3
        }
      })
    }

    //更新数据
    this.setData({
      lists: data
    })
  },
  savaData(e) {
    publicMethod.getFormId(e, this)
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // let formData = prevPage.data.formData;
    let formData = that.data.formData;
    let data = that.data.selected_goods;
    let elect = that.data.elect;
    if(data.length == 0){
      wx.showToast({
        title: '请先选择回收类型及数量',
        icon:'none'
      })
      return
    }
    if(that.data.payStatus == 3 && that.data.total <100){
      wx.showModal({
        content: '尊敬的环保达人，呼叫上门回收，可回收物需要达到100积分以上才可以哦！可以继续积攒或者选择爱心赠送哦！谢谢您对环保的支持！',
        showCancel:false,
        confirmColor:'#FF0221',
        success(res) {
          if(res.confirm){
          }
        }
      })
      return
    }
    if(that.data.payStatus == 4 && that.data.total < 5){
      wx.showModal({
        content: '尊敬的环保达人，呼叫上门回收，可回收物人民币需要达到5元以上才可以！可以继续积攒或者选择爱心赠送哦！谢谢您对环保的支持！',
        showCancel:false,
        confirmColor:'#FF0221',
        success(res) {
          if(res.confirm){
          }
        }
      })
      return
    }
    let a = [];
    let arr = [];
    for (let i in data) {
      let obj = {};
      obj.goods_id = data[i].goodstype_id;
      obj.id = data[i].id;
      obj.goods_num = data[i].good_num;
      arr.push(obj)
      a.push(data[i].name +"：" + data[i].good_num+ data[i].type)
    }
    let a1 = a.join("，")
    let str = arr
    formData.member_id = that.data.member_id;
    formData.goods = str;
    formData.pay_mode = that.data.payStatus || 1;
    formData.total = that.data.total;

    app.data.shopCar.total = that.data.total;
    app.data.shopCar.payStatus = that.data.payStatus;
    app.data.shopCar.goodList = arr;
    app.data.shopCar.types_a = a1;
    app.data.shopCar.elect = elect;
    console.log(app.data.shopCar)
    // wx.navigateBack()
    wx.navigateTo({
      url: '/pages/huishou/index/index',
    })
  },
  //获取商品类目
  getCategory() {
    let that = this;
    // common.get("/recover/getGoodsCategory").then( res => {
    common.get("/recover/get_recover_good",{
      member_id: wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat: that.data.latitude,
    }).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          cateList: res.data.data,
          sel_cate_id:res.data.data[0].id,
          sel_cate_name:res.data.data[0].name,
          cion_price : res.data.data[0].cion_price,
          integral_price : res.data.data[0].integral_price,
          money_price : res.data.data[0].money_price,
        })
      that.getGoodsByCate();
      }
    })
  },
  //切换商品类目
  changeCate(e) {
    let that = this;
    that.setData({
      newlists: [],
      sel_type:0,
      sel_type_input:0,
    });
    let selected_goods = that.data.selected_goods;
    let sel_cate_id= e.currentTarget.dataset.cateid; 
    let sel_cate_name = e.currentTarget.dataset.catename;
    let cion_price = e.currentTarget.dataset.cion_price;
    let integral_price = e.currentTarget.dataset.integral_price;
    let money_price = e.currentTarget.dataset.money_price;
    let sel_list = selected_goods.find(ele =>{
      return ele.goodstype_id == sel_cate_id
    })
    if(sel_list){
      that.setData({
        goodid:sel_list.id,
        sel_type:1,

      })
      if(sel_list.id == -1){
        that.setData({
          numbers:sel_list.good_num,
          sel_type_input:1
        })
      }
    }else{
      that.setData({
        numbers:'',
      })
    }
    that.setData({
      newlists: that.data.lists[e.currentTarget.dataset.cateid],
      sel_cate_id,
      sel_cate_name,
      cion_price,
      integral_price,
      money_price,
    });

  },
  getsel_type(){
    this.setData({
      sel_type:0,
      sel_type_input:1,
    })
  },
 save_input_num(e) {
    let that = this;
    console.log(e)
    let value = e.detail.value;
    let cateid = e.currentTarget.dataset.cateid;
    let name = e.currentTarget.dataset.name;
    let unit = e.currentTarget.dataset.unit;
    let cion_price = e.currentTarget.dataset.cion_price;
    let integral_price = e.currentTarget.dataset.integral_price;
    let money_price = e.currentTarget.dataset.money_price;
    let shopcar_list = that.data.selected_goods;
    let sel_cate_id = that.data.sel_cate_id;
    if(sel_cate_id == 61 || sel_cate_id == 63){
      console.log(value)
      if( Number(value) > 500){
        value = 500
        that.setData({
          numbers:500
        })
      }
    }
    if(sel_cate_id == 62){
      if( Number(value) > 200){
        value = 200
        that.setData({
          numbers:200
        })
      }
    }
    if(sel_cate_id == 64 || sel_cate_id == 65 || sel_cate_id == 66 ){
      if( Number(value) > 100){
        value = 100
        that.setData({
          numbers:100
        })
      }
    }
    if ( shopcar_list.length == 0 ) {
      if ( value ) {
        shopcar_list.push({
          name,
          cion_price,
          integral_price,
          money_price,
          type:unit,
          min:value,
          good_num:value,
          goodstype_id:cateid,
          id:-1,
        })
      }
      that.setData({
        selected_goods: shopcar_list,
        numbers:value
      })
    }
    let hasFinds = shopcar_list.find( ele => {
      return ele.goodstype_id == cateid;
    })
     if ( value  == '') {
      if (hasFinds) {
         //找到l
           for(let i=0;i<shopcar_list.length;i++){
            if(shopcar_list[i].goodstype_id == cateid ){
              shopcar_list.splice(i,1);
            }
          }
          that.setData({
            selected_goods: shopcar_list
           })
       }
     }else{
       if (hasFinds) {
         //找到l
           for(let i=0;i<shopcar_list.length;i++){
             if(shopcar_list[i].goodstype_id == cateid ){
              shopcar_list.splice(i,1);
             }
           }
           shopcar_list.push({
             name,
             type:unit,
             cion_price,
             integral_price,
             money_price,
             min:value,
            good_num:value,
            goodstype_id:cateid,
            id:-1,
          })
          that.setData({
            selected_goods: shopcar_list
          })
      }else{
        shopcar_list.push({
          name,
          type:unit,
          cion_price,
          integral_price,
          money_price,
          min:value.replace(/\D/g,''),
          good_num:value.replace(/\D/g,''),
          goodstype_id:cateid,
          id:-1,
        })
        that.setData({
          selected_goods: shopcar_list
        })
      }
    }
    that.changePrice()
    that.tongjiTot()
  },
  //切换商品下数量类目
  changere(e) {
    let that = this;
    let name = that.data.sel_cate_name;
    let cion_price = that.data.cion_price;
    let integral_price = that.data.integral_price;
    let money_price = that.data.money_price;
    let shopcar_list = that.data.selected_goods;
    let data = that.data.newlists;
    let curIdx = e.currentTarget.dataset.curidx;
    let goodid = e.currentTarget.dataset.goodid;
    let goodtypeid = e.currentTarget.dataset.goodtypeid;
    that.setData({
      goodid: e.currentTarget.dataset.goodid,
      sel_type:1,
      numbers:'',
      sel_type_input:0,
    });
    //先判断购物车里有没有这个商品，没有则添加，有则加数量
    if (shopcar_list.length == 0) {
      shopcar_list.push({
        name,
        cion_price,
        integral_price,
        money_price,
        min:data[curIdx].min,
        goodstype_id:data[curIdx].goodstype_id,
        id:data[curIdx].id,
        good_num:data[curIdx].min +'-'+ data[curIdx].max,
        type:data[curIdx].type 
    })
  }
    // .find()返回符合条件的
    // let hasFind = shopcar_list.find(ele => {
    //   return ele.id == goodid;
    // })

    let hasFinds = shopcar_list.find(ele => {
      return ele.goodstype_id == goodtypeid;
    })
    if (hasFinds) {
      //找到l
        for(let i=0;i<shopcar_list.length;i++){
          if(shopcar_list[i].goodstype_id == goodtypeid ){
            shopcar_list.splice(i,1);
          }
        }
        shopcar_list.push({
          name,
          cion_price,
          integral_price,
          money_price,
          goodstype_id:data[curIdx].goodstype_id,
          id:data[curIdx].id,
          min:data[curIdx].min,
          good_num:data[curIdx].min +'-'+ data[curIdx].max,
          type:data[curIdx].type 
      })
    }else{
      shopcar_list.push({
        name,
        cion_price,
        integral_price,
        money_price,
        goodstype_id:data[curIdx].goodstype_id,
        id:data[curIdx].id,
        min:data[curIdx].min,
        good_num:data[curIdx].min +'-'+ data[curIdx].max,
        type:data[curIdx].type 
    });
    }
    that.setData({
      selected_goods: shopcar_list
    })
    that.tongjiTot();
    that.changePrice();
  },
  //根据类目获取商品
  getGoodsByCate() {
    let that = this;
    common.get("/recover/get_goods_unit", {
    }).then( res => {
      if ( res.data.code == 200 ) {
        // res.data.goods.forEach( ele => {
        //   ele.coin = 0;
        //   ele.jifen = 0;
        //   ele.money = 0;
        //   ele.num = 0;
        // });
        // res.data.goods.forEach( ele1 => {
        //   that.data.selected_goods.forEach( ele2 => {
        //     if ( ele1.id == ele2.id ) {
        //       ele1.coin = ele2.coin;
        //       ele1.jifen = ele2.jifen;
        //       ele1.money = ele2.money;
        //       ele1.num = ele2.num;
        //     }
        //   })
        // });
        that.setData({
          lists: res.data.data,
          newlists: res.data.data[that.data.sel_cate_id],
        })
        that.tongjiTot();
        that.changePrice();
      }
    })
  },
  delet_list(e){
    let that =this;
    let curIdx = e.currentTarget.dataset.index;
    let shopcar_list = that.data.selected_goods;
    shopcar_list.splice(curIdx, 1);
    that.setData({
      selected_goods:shopcar_list,
    })
    that.tongjiTot();
    that.changePrice();
  },
  set_elect(e){
    let that = this;
    let elect = e.detail.value;
    that.setData({
      elect,
    })
  }
})