const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');

const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_list: [],
    new_book_list:[],
    new_data:[],
    book_name: '',
    book_image: '',
    book_price: '',
    book_author: '',
    isbn: '',
    book_id: '',
    book_publisher: '',
    library_id: '',
    discount_inx:2,
    discount_array: ['0折','1折', '2折','3折','4折','5折','6折','7折','8折','9折','10折'],
    inx:3,
    oldNewarray: ['10成新','9.9成新','9.5成新','9成新', '8成新','7成新','6成新','5成新','4成新', '3成新','2成新','1成新'],
    name_rido:'',
    latitude: '',
    longitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)

    if(options.is_err == 1){
      let is_title = options.is_title;
      wx.showToast({
        title: is_title,
        icon:'none'
      })
    }else{
      let book_discount = this.data.discount_inx;
      let book_grade =this.data.oldNewarray[ this.data.inx ];
      let stock = 1;
      let cc = this.data.discount_array[ this.data.discount_inx ];
      this.setData({
        cc,
        dd:book_grade,
        book_list: [{
          book_name: options.book_name,
          book_image: options.book_image,
          book_price: options.book_price,
          book_author: options.book_author,
          isbn: options.isbn,
          book_id: options.book_id,
          book_publisher: options.book_publisher,
          book_discount,
          discount_price:(options.book_price*book_discount/10).toFixed(2),
          book_grade,
          summary_image:[],
          summary:options.summary,
          stock,
          }]
      })
    }
    this.setData({
      library_id: options.library_id,
    })
    console.log(this.data.book_list);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  saoyisao: function () {
    //唤起摄像头
    let that = this;
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
            let summary= res.data.data.summary;
            let book_discount = that.data.discount_inx;
            let book_grade = that.data.oldNewarray[ that.data.inx ];
            let new_book_list = [{
              book_name: book_name,
              book_image: book_image,
              book_price: book_price,
              book_author: book_author,
              isbn: isbn,
              book_id: book_id,
              book_publisher: book_publisher,
              book_discount,
              discount_price:(book_price*book_discount/10).toFixed(2),
              book_grade,
              summary_image:[],
              summary:summary,
              stock:'1',
              }];
            that.setData({
              book_list: new_book_list.concat(that.data.book_list),  // .reverse()数组颠倒
          })
          console.log(that.data.book_list)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
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
  /**确定上架 */
  submit: function (e) {
    let that = this;
    let book_list = that.data.book_list;
    let type = e.currentTarget.dataset.type;
    console.log(type);
    if (Object.keys(that.data.book_list).length === 0){
      wx.showToast({
        title: '请先添加图书...',
        icon: "none"
      })
    }else{
      wx.showLoading({
        title:'上架中...'
      })
      common.post('/library/add_book_to_library', {
        member_id: wx.getStorageSync('member_id'),
        library_id: that.data.library_id,
        book_info: book_list,
        type,
        lat: that.data.latitude,
        lng: that.data.longitude,
      }).then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.requestSubscribeMessage({   // 调起消息订阅界面
            tmplIds: ['pFwkwK9Pol6sTBmvVo6BXa3houCdEJy4gIfP72vb1u0'],
            success (res) { 
              console.log('订阅消息 成功 ');
              console.log(res);
              wx.showToast({
                title: '上架成功',
                icon: "success"
              })
              //返回上一页
              setTimeout(function(){
                wx.navigateBack({
                  delta: 2
                })
              },1500)
            },
            fail (er){
              console.log("订阅消息 失败 ");
              console.log(er);

            }
          }) 
        }else{
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e =>{
        wx.hideLoading();
      })
    }
    
  },
  //删除当前行
  cancel(e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list.splice(index, 1);
    that.setData({
      book_list,
    })
    console.log(that.data.book_list)
  },
  // 修改原价
  setbookprice(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    let book_discount = book_list[index].book_discount;
    book_list[index].book_price = e.detail.value;
    book_list[index].discount_price = (e.detail.value*(book_discount/10)).toFixed(2);
    that.setData({
      book_list
    })
    console.log(that.data.book_list)
  },
  // 上架默认几折
  bindChange_shelfdisc(e) {
    console.log(e)
    let that = this;
    let value = Number(e.detail.value);
    let book_list = that.data.book_list;
    book_list.forEach(ele =>{
      console.log(ele)
      ele.book_discount = value;
      ele.discount_price = (ele.book_price*(value/10)).toFixed(2);
    })
    that.setData({
      discount_inx:value,
      cc : this.data.discount_array[ value ],
      book_list
    })
  },
    // 上架默认几成新
    bindChange_shelffine(e) {
      console.log(e)
      let that = this;
      let value = Number(e.detail.value);
      let book_list = that.data.book_list;
      book_list.forEach(ele =>{
        console.log(ele)
        ele.book_grade = that.data.oldNewarray[ value ];
      })
      that.setData({
        inx:value,
        dd : that.data.oldNewarray[ value ],
        book_list
      })
    },
  // 修改价格
  binddiscountChange(e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_price = e.currentTarget.dataset.book_price;
    let book_list = that.data.book_list;
    let index_value = e.detail.value-0;
    book_list[index].book_discount = index_value;
    book_list[index].discount_price = (book_price*(index_value/10)).toFixed(2);

    that.setData({
      book_list
    })
    console.log(that.data.book_list)
  },
  // 选择新旧程度
  bindPickerChange: function(e) {
    console.log(e)
    let that = this;
    let oldNewarray = that.data.oldNewarray;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list[index].book_grade = oldNewarray[e.detail.value];
    that.setData({
      book_list
    })
    console.log(that.data.book_list)
  },
  // 修改库存

  name_stock(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_list = that.data.book_list;
    book_list[index].stock = e.detail.value;
    that.setData({
      book_list
    })
    console.log(that.data.book_list)
  },
//点击上传图片图标开始上传图片
choosePic_tuan: function (e) { //选取图片
  console.log(e)
  let that = this;
  let idx = e.currentTarget.dataset.index;
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      let tempFiles = res.tempFiles;
      that.upLoadImg_tuan(tempFiles, 0, idx);
      return;
    }
  })
},
    //上传图片
    upLoadImg_tuan(image, index,idx) {
      let i = index;
      let img = image;
      let idxx = idx;
      let that = this;
      if (i >= img.length) {
        return
      }
      let txt = '上传中' + (i + 1) + '/' + img.length
      wx.showLoading({
        title: txt
      })
      wx.uploadFile({
        url: setting.apiUrl + '/file/uploadOss',
        filePath: img[i].path,
        name: 'files[]',
        header: {
          'content-type': 'multipart/form-data',
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          let data = JSON.parse(res.data);
          console.log(data);
          if (data.code == 0) {
            wx.hideLoading();
            let book_list = that.data.book_list;
            book_list[idxx].summary_image.push(data.data.url[0]);
            that.setData({
              book_list,
            })
            console.log(that.data.book_list)
          } else {
            app.showToast({
              title: "上传失败!",
            })
          }
          wx.hideLoading();
          i++;
          that.upLoadImg_tuan(image, i);
        },
        fail: function () {
          app.showToast({
            title: "上传失败!",
          })
          wx.hideLoading()
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    },
    //团购打开图片预览
    openPhoto_tuan(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      that.setData({
        preview_tuan: that.data.img_tuan[index],
        sel_index_tuan: index,
        showFull_tuan: true
      })
    },
    //关闭图片预览
    closePic_tuan() {
      this.setData({
        showFull_tuan: false
      })
    },
    //删除图片
    delPic_tuan() {
      let that = this;
      let index = that.data.sel_index_tuan;
      that.data.img_tuan.splice(index, 1);
      that.setData({
        showFull_tuan: false,
        img_tuan: that.data.img_tuan
      })
    },
    name_rido(e){
      let that = this;
      let index = e.currentTarget.dataset.index;
      let introduce = e.detail.value;
      let book_list = that.data.book_list;
      book_list[index].summary = introduce;
      console.log(e)
      this.setData({
        book_list,
      })
    },
})
