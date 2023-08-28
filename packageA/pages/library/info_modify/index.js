const app = getApp();
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    id:'',
    library_id:'',
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
    inx:0,
    oldNewarray: ['10成新','9.9成新','9.5成新','9成新', '8成新','7成新','6成新','5成新','4成新', '3成新','2成新','1成新'],
    name_rido:'',
    summary_image:[],
    sel_index: '',  //当前选中的图片
    showFull: false,  //全屏
    summary:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      library_id:options.library_id,
      book_id:options.id,
      member_id:wx.getStorageSync('member_id'),
    })
    this.getinfododify();
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
  // 信息回显
  getinfododify(){
    let that =this;
    let id = that.data.book_id;
    let library_id = that.data.library_id;
    common.get('/newhome/edit',{
      id,
      library_id
    }).then(res =>{
      if(res.data.code){
      let image=res.data.data.summary_image;
      if(image == ''){
        that.setData({
          summary_image:image,
        })
      }else{
        //  josn 格式转换成数组
        let summary_image = JSON.parse( image );
        that.setData({
          summary_image,
        })
      }
        that.setData({
          book_image:res.data.data.images_medium,
          book_name:res.data.data.name,
          book_author:res.data.data.book_author,
          book_price:res.data.data.integral_price,
          book_discount:res.data.data.book_discount,
          discount_price:res.data.data.discount_price,
          book_grade:res.data.data.book_grade,
          stock:res.data.data.stock,
          id:res.data.data.id,
          summary:res.data.data.book_summary
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  //点击上传图片图标开始上传图片
choosePic_tuan: function (e) { //选取图片
  console.log(e)
  let that = this;
  let idx = e.currentTarget.dataset.index;
  wx.chooseImage({
    count: 1, // 默认9
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
  /**确定上架 */
  submit: function (e) {
    let that = this;
    let praems = {
      member_id: wx.getStorageSync('member_id'),
      id : that.data.id,
      discount_price : that.data.discount_price,
      book_discount : that.data.book_discount,
      book_grade : that.data.book_grade,
      stock : that.data.stock,
      book_price : that.data.book_price,
      summary : that.data.summary,
      summary_image : that.data.summary_image,
    }
      wx.showLoading({
        title:'上架中...'
      })
      common.post('/newhome/update',praems).then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: "success"
          })
          //返回上一页
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
          
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      })
  },
  // 修改原价
  setbookprice(e){
    console.log(e)
    let that = this;
    let book_price = e.detail.value;
    let book_discount = that.data.book_discount;
    let discount_price = (e.detail.value*(book_discount/10)).toFixed(2);
    that.setData({
      book_price,
      discount_price
    })
  },
  // 修改价格
  binddiscountChange(e) {
    console.log(e)
    let that = this;
    let book_price = e.currentTarget.dataset.book_price;
    let index_value = e.detail.value-0;
    let book_discount = index_value;
    let discount_price = (book_price*(index_value/10)).toFixed(2);

    that.setData({
      book_discount,
      discount_price
    })
  },
  // 选择新旧程度
  bindPickerChange: function(e) {
    console.log(e)
    let that = this;
    let oldNewarray = that.data.oldNewarray;
    let book_grade = oldNewarray[e.detail.value];
    that.setData({
      book_grade
    })
  },
 // 修改库存

 name_stock(e){
  let that = this;
  let stock = e.detail.value;
  that.setData({
    stock
  })
},

name_rido(e){
  let that = this;
  let introduce = e.detail.value;
  let summary = introduce;
  this.setData({
    summary,
  })
},


    //上传图片
    upLoadImg_tuan(image, index) {
      let i = index;
      let img = image;
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
            let summary_image = that.data.summary_image;
            summary_image.push(data.data.url[0]);
            that.setData({
              summary_image,
            })
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
    //打开图片预览
    openPhoto(e) {
      let that = this;
      console.log(e)
      let index = e.currentTarget.dataset.index;
      that.setData({
        preview: that.data.summary_image[index],
        sel_index: index,
        showFull: true
      })
    },
    //关闭图片预览
    closePic() {
      this.setData({
        showFull: false
      })
    },
    //删除图片
    delPic() {
      let that = this;
      let index = that.data.sel_index;
      that.data.summary_image.splice(index, 1);
      that.setData({
        showFull: false,
        summary_image: that.data.summary_image
      })
    },
})