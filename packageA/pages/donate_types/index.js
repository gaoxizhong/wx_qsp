const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const setting = require('../../../assets/js/setting');
const zhuan_dingwei = require('../../../assets/js/dingwei.js');
import { getLessLimitSizeImage} from '../../../utils/newImgcomp'

Page({
  data: {
    formData:{},
    numStatus: !0,
    payStatus: 1,
    sel_type:0,
    savaStatus: true,
    sel_type_input:0,
    total: 0,
    numbers:'',
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
    img:[],
    showFull: false,  //全屏
    contact_name: '', //联系人
    contact_phone: '', //联系电话
    garden: '', //所在小区
    address: '', //详细地址,
    latitude: '',
    longitude: '',
    company_name: '',
    integral:'',
    avatar: '',
    business_id: '',
    lx: '',
    is_preview: false,
    remark:'',
    top_img:[],
    position:false,
    chengde_name:'',
    chengde_phone:'',
    chengde_school:'',
    chengde_class:'',
    is_activity:'1',
    ad_content:{},
    select_type:0,
    activity_id:0,
    photos:[],
    quality: 0.2,
    cWidth: 750,
    cHeight: 1334,
    ext_id: '',
    is_yzm: 0
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;
    if(options.is_yzm){
      that.setData({
        is_yzm: options.is_yzm
      })
    }
    if(options.is_activity){
      that.setData({
        is_activity: options.is_activity,
        activity_id: options.activity_id,
        ext_id: options.ext_id,
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      payStatus:3,
    });
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
        // 获取地址
        that.get_address();
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
        // 获取地址
        that.get_address();
      }
    })
    that.getCategory();
    that.getBannerUrls();
  },
  onShow: function() {
    let that = this;
    that.setData({
      company_name: '',
      integral:'',
      avatar: '',
      business_id: '',
      lx: '',
      is_preview: false,
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
  tapPay(e) {
    publicMethod.getFormId(e, this)
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
    that.tongjiTot()
  },
  tongjiTot() {
    let that = this;
    let lists = that.data.selected_goods;
    let tem = 0;
    for (let i in lists) {
      tem += lists[i].min * lists[i].integral_price;
    }
    let tot = tem.toFixed(2);
    if(tot >=1000){
      tot = 1000
    }
    that.setData({
      total: tot
    })
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
  remark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  savaData(e) {
    publicMethod.getFormId(e, this)
    let that = this;
    let savaStatus = that.data.savaStatus;
    let data = that.data.selected_goods;
    let img = that.data.img;
    let contact_name = that.data.contact_name == '' ?'':that.data.contact_name;
    let contact_phone = that.data.contact_phone == ''?'':that.data.contact_phone;
    let remark = that.data.remark;
    let garden = that.data.garden;
    let address = that.data.address;
    let total = that.data.total;
    let type = that.data.is_activity;
    let activity_id = that.data.activity_id;
    let ext_id = Number(that.data.ext_id);
    let is_yzm = that.data.is_yzm;
    if(data.length == 0){
      wx.showToast({
        title: '请先选择回收类型及数量',
        icon:'none'
      })
      return
    }
    if(img.length < 2){
      wx.showToast({
        title: '最少上传2张图片',
        icon:'none'
      })
      return
    }

    if( !is_yzm && garden == '' || !is_yzm && address == '' ){
      wx.showToast({
        title: '上门地址不能为空！',
        icon:'none'
      })
      return
    }
    let goods = [];
    for (let i in data) {
      let obj = {};
      obj.goods_id = data[i].goodstype_id;
      obj.id = data[i].id;
      obj.goods_num = data[i].good_num;
      goods.push(obj)
    }
    wx.showLoading({
      title: '提交中...',
    })
    if (!savaStatus) {
      wx.hideLoading();
      wx.showToast({
        title: '请勿重复提交！',
        icon:'none'
      })
      return
    }
    that.setData({
      savaStatus: false
    })
    let param = {
      goods,
      img,
      contact_name,
      contact_phone,
      chengde_name:that.data.chengde_name,
      chengde_phone:that.data.chengde_phone,
      chengde_school:that.data.chengde_school,
      chengde_class:that.data.chengde_class,
      garden,
      address,
      remark,
      total,
      member_id: wx.getStorageSync('member_id'),
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      type,
      activity_id,
      ext_id,
    }
    if(is_yzm){
      param.is_yz = is_yzm;
      param.yz_id = wx.getStorageSync('yz_id');
    }
    common.post('/garbage/create_order',param).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading();
        let content_id = res.data.data.content.original.data;
        wx.showToast({
          title: '提交成功',
          icon:'none',
          duration:2500,
          success:function(){
            // that.gettanchuang();
            if(is_yzm){
              setTimeout(function(){
                wx.reLaunch({
                  url: '/packageB/pages/postStationCode/index',
                })
              },1500)
            }else{
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/circle/circle?is_circle=0&id=' + content_id,
                })
              },2000)
            }

          }  
        })
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
    }).catch(e =>{
      wx.hideLoading();
      that.setData({
        savaStatus: true
      })
      console.log(e)
    })
  },

  //获取商品类目
  getCategory() {
    let that = this;
    common.get("/recover/get_recover_good").then( res => {
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
  blur_input_num(e){
    console.log(e)
  },
  //输入框输入数量
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
  //选择图片
  choosePic(e){
    let that = this;
      //拍照、从相册选择上传
    wx.chooseImage({
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
        wx.getFileInfo({
          filePath:img,
          success:function(res){
            console.log('3压缩后：'+res.size/1024+'kb')
          }
        })
        let newimg = [];
        newimg.push(img)
        that.upLoadImg(newimg, 0);         

        index = index + 1;
        that.getLessLimitSizeImage(index,ts)
      })
    }

  },
  //上传图片
  upLoadImg(image,index) {
    console.log(image)
    let i = index;
    let img = image;
    let that = this;
    if ( i >= img.length ) {
      return
    }
    let txt = '上传中'
    wx.showLoading({
      title:txt
    })
    wx.uploadFile({
      url: setting.apiUrl + '/file/uploadOss',
      filePath: img[i],
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
      this.setData({
        address:e.detail.value
      })
    },
    saveGarden(e) {
      console.log(e)
      this.setData({
        garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
      })
    },
    getBannerUrls() { //轮播图地址
      let that = this
      common.get('/banner/newInfo', {
        member_id: wx.getStorageSync('member_id'),
        type: 14
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