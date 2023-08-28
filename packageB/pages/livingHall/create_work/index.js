const common = require("../../../../assets/js/common");
const setting = require('../../../../assets/js/setting');
const publicMethod = require('../../../../assets/js/publicMethod');
import { getLessLimitSizeImage } from '../../../../utils/newImgcomp';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',  //活动标题
    desc:'', // 详情
    img: [],  //图片，
    photos: [], //图片数组
    setDeliveryPrice: true,
    currentDeliveryWindows: 0,
    currentDeliveryPrice: '',
    latitude: '',
    longitude: '',
    projectList:[], // 项目列表
    pageIndex:1,
    is_move: true, // 更多项目按钮展示状态
    channel_sel:0,
    channel:'', // 所选项目
    checkeditems: [
      {value: '1', name: '用于拍卖', checked: 'true'},
      {value: '2', name: '用于展示'},
    ],
    is_sale:'1', // 单选选项
    price:'',
    send_type: [], // 取货方式
    zitiShow: false,
    fufeiShow: false,
    showCheck:false,
    otp: '',
    discount_id:'',
    is_retun: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if(options.discount_id){
      that.setData({
        discount_id: options.discount_id
      })
      that.getgoodsInfo(options.discount_id);
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
    let that = this;
    that.getprojectList();
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
  // 选择所属项目
  channel_sel(e){
    let that = this;
    let projectList = that.data.projectList;
    projectList.forEach(ele =>{
      if(ele.id == e.currentTarget.dataset.id){
        that.setData({
          // channel: ele.name,
          channel_sel: e.currentTarget.dataset.id,
        })
      }
    })
  },
  // 选择用途
  radioChange(e) {
    console.log(e)
    // const checkeditems = this.data.checkeditems;
    // const index = e.currentTarget.dataset.index;
    // checkeditems[index].checked = !checkeditems[index].checked;
    // this.setData({
    //   checkeditems
    // })
    if(e.detail.value== '2'){
      this.setData({
        send_type: [],
      })
    }
    this.setData({
      is_sale: e.detail.value,
      price: e.detail.value == '2'?'0':'',
    })
  },
  //输入原价
  inputPrice(e) {
    console.log(e.detail);
    this.setData({
      price: e.detail.value
    })
  },
    //选择获取方式
    obtainListChange(e) {
      let that = this;
      that.setData({
        send_type: e.detail.value
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
  //点击设置费用显示弹窗
  setDeliveryPriceShow(e) {
    let that = this;
    that.setData({
      setDeliveryPrice: false,
      currentDeliveryWindows: e.currentTarget.dataset.id,
      currentDeliveryPrice: e.currentTarget.dataset.price,
    })
  },
  //点击设置邮寄费用弹窗取消按钮
  setDeliveryPriceHide(e) {
    let that = this;
    that.setData({
      setDeliveryPrice: true
    })
  },
  //点击设置邮寄费用确定按钮
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
  //点击设置费用弹窗输入框输入费用
  currentDeliveryPrice(e){
    let that = this;
    that.setData({
      currentDeliveryPrice: e.detail.value
    })
  },


  // ======== 上传图片相关功能 =============
  // 选择图片按钮
  chooseImg(e){
    let that = this;
      //拍照、从相册选择上传
    wx.chooseImage({
        sizeType:['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType:['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success:function(res){
          // 返回选定图片的本地文件列表，tempFilePaths可以作为img标签的src列表
          //res.tempFilePaths; 这个是选择后返回的图片列表
          // let tempFilePaths = res.tempFilePaths; 
          let tempFiles = res.tempFiles;
          // that.getLessLimitSizeImage(0,tempFilePaths);
          that.upLoadImg(tempFiles,0);   
        },
        fail:function(err){
            console.log(err)
        }
    })
  },
  //压缩并获取图片，这里用了递归的方法来解决canvas的draw方法延时的问题
  // getLessLimitSizeImage(index,ts){
  //   let that = this;
  //   let maxSize = 1000;
  //   let dWidth = wx.getSystemInfoSync().windowWidth;
  //   let num = Number(ts.length);
  //   if (index < num){ 
  //     getLessLimitSizeImage('canvas',ts[index],maxSize, dWidth, function(img){
  //       wx.getFileInfo({
  //         filePath:img,
  //         success:function(res){
  //           console.log('3压缩后：'+res.size/1024+'kb')
  //         }
  //     })
  //       let photos = that.data.photos;
  //       photos.push(img);
  //       that.setData({
  //         photos,
  //       })  

  //       index = index + 1;
  //       that.getLessLimitSizeImage(index,ts)
  //     })
  //   }
  // },

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
        console.log(data)
        if ( data.code == 0 ) {
          wx.hideLoading();
          that.data.photos.push(data.data.url[0]);
          that.setData({
            photos: that.data.photos
          })
          console.log(that.data.photos);
        } else {
          wx.showToast({
            title: "上传失败!",
          })
        }
        wx.hideLoading();
        i++;
        that.upLoadImg(image, i);
      },
      fail:function() {
        wx.showToast({
          title: "上传失败!",
          icon:'none'
        })
        wx.hideLoading()
      },
      complete:function() {
        wx.hideLoading()
      }
    })
  },
  // openPhoto: function(event) { //打开图片
  //   let that = this;
  //   that.setData({
  //     layer: true,
  //     preview: event.currentTarget.dataset.url,
  //     imgname: event.currentTarget.dataset.imgname,
  //     previewIndex: event.currentTarget.dataset.index
  //   });
  // },


  delPic(event) {
    let that = this;
    let previewIndex = event.currentTarget.dataset.index;
    let picsUp = that.data.photos;
    picsUp.splice(previewIndex, 1);
    that.setData({
      photos: picsUp,
      // layer: false
    });
  },
  //输入标题
  inputTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },
   //输入描述
  inputDesc(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  buy(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    let title = that.data.title;  // 标题
    let detail = that.data.desc; // 详情
    let is_sale = that.data.is_sale;  //  1、售卖 2、展示
    let image = that.data.photos;  // 图片
    let price = that.data.price; // 价格
    let project = that.data.channel_sel; // 所属项目
    let parcel_price = that.data.currentDeliveryPrice;
    let is_retun = that.data.is_retun;
     // 选择的取货方式
    let send_type = ['2'];
    if(title == ''){
      wx.showToast({
        title: '请先填写标题!',
        icon:'none'
      })
      return
    }
    if(detail == ''){
      wx.showToast({
        title: '请先填写内容!',
        icon:'none'
      })
      return
    }
    
    if(project == '' || project == 0){
      wx.showToast({
        title: '请先选择所属项目!',
        icon:'none'
      })
      return
    }
    if( is_sale == '1' && price == 0 ){
      wx.showToast({
        title: '请填写价格！',
        icon:'none'
      })
      return
    }
    if(!is_retun){
      wx.showToast({
        title: '请勿重复点击！',
        icon:'none'
      })
      return
    }


    let data = {
      member_id,
      title,
      detail,
      is_sale,
      image,
      price,
      send_type,
      parcel_price,
      project,
    }

    if(that.data.discount_id){
      data.id = that.data.discount_id
    }
    let p = JSON.stringify(data);
    let p1 = JSON.parse(p);

    that.setData({
      is_retun: false
    })
    wx.showLoading({
      title: '发布中...',
    })
    common.get("/life/index?op=edit_work",p1).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: that.data.discount_id?'修改成功！':'发布成功！',
          icon:'success'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500);
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        that.setData({
          is_retun: true
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
      that.setData({
        is_retun: true
      })
    })
  },
  clickMove(){
    let that = this;
    that.getprojectList();
  },
  // 获取数据
  getprojectList(){
    let that = this;
    common.get('/life/index?op=project',{
      page: that.data.pageIndex
    }).then(res =>{
      if(res.data.code == 200){
        let list = res.data.data.project;
        let project_count = res.data.data.project_count;
        that.setData({
          projectList: that.data.projectList.concat(list),
        })
        let listLength = that.data.projectList.length;
        if( listLength >= project_count ){
         that.setData({
           is_move: false
         })
          return
        }else{
          that.setData({
            pageIndex: that.data.pageIndex + 1,
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 商品信息回显
  getgoodsInfo(i){
    let that = this;
    common.get('/life/index?op=work_detail',{
      work_id: i,
    }).then(res =>{
      if(res.data.code == 200){
        let goodsInfo = res.data.data.work;
        that.setData({
          title: goodsInfo.title,
          desc:goodsInfo.detail, // 详情
          photos: goodsInfo.image_array, //图片数组
          send_type: goodsInfo.send_type, // 邮寄方式
          is_sale: goodsInfo.is_sale, // 作品用途
          price: goodsInfo.price,
          channel_sel: goodsInfo.project,
          currentDeliveryPrice: goodsInfo.parcel_price
        })
        if ( goodsInfo.send_type.length == 2){
          that.setData({
            showCheck: true,
            zitiShow: true,
            fufeiShow: true
          })
        }else{
          that.setData({
            otp:  goodsInfo.send_type[0]
          })
          goodsInfo.send_type[0] == 1 ? that.setData({ zitiShow: true }) : that.setData({ fufeiShow: true })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
})