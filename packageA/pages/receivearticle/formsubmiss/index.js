const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_list:false,
    category:'',
    oldNewarray: ['其他'],
    old_index:2,
    info_newold:['10成新','9.9成新','9.5成新','9成新','8.5成新','8成新','7.5成新','7成新','6.5成新','6成新','5成新','4成新','3成新','2成新','1成新'],
    fineness_index:2,
    fineness:'',
    name:'',
    model:'',
    purchase_year: '',
    info_data:[
      {name:'发票',img:'/packageA/assets/images/invoice.png',seled:false},
      {name:'说明书',img:'/packageA/assets/images/manual.png',seled:false},{name:'身份卡',img:'/packageA/assets/images/Identify-card.png',seled:false},
      {name:'其他',img:'/packageA/assets/images/other.png',seled:false}
    ],
    brand_list: [],
    new_brand_list:[],
    images:[],
    is_submit:true,
    showFull:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let oldNewarray = that.data.oldNewarray;
    common.get('/collect_clothes/brand').then( res =>{
      console.log(res)
      if(res.data.code ==200){
        that.setData({
          oldNewarray:res.data.data.concat(oldNewarray)
        })
      }
    })
    let new_brand_list = that.data.new_brand_list;
    console.log(new_brand_list)
    let newlist = [{
      category:'', // 品类
      supe_name:'', // 品类名称
      name:'',    // 品牌名称
      model:'',  // 品牌型号
      fineness:'',   // 成色
      purchase_year: '',   // 年份
      other:'',   // 保留信息
      img:[],   // 上传图片
    }]
    new_brand_list.concat(newlist);
    that.setData({
      new_brand_list:newlist
    })
    console.log( that.data.new_brand_list)
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
  // 选择品类
  getsupeidx(e){
    let that = this;
    let new_brand_list = that.data.new_brand_list;
    let index = (new_brand_list.length - 0) -1;
    let category = e.currentTarget.dataset.index
    new_brand_list[index].category = category;
    if(category == '1'){
      new_brand_list[index].supe_name = '包包';
    }
    if(category == '2'){
      new_brand_list[index].supe_name = '鞋子';
    }
    if(category == '3'){
      new_brand_list[index].supe_name = '衣服';
    }
    that.setData({
      category,
      new_brand_list,
    })
  },
    // 选择名称
    bindPickerChange: function(e) {
      console.log(e)
      let that = this;
      let oldNewarray = that.data.oldNewarray;
      let name = oldNewarray[e.detail.value];
      let new_brand_list = that.data.new_brand_list;
      let index = (new_brand_list.length - 0) -1;
      new_brand_list[index].name = name;
      that.setData({
        name,
        new_brand_list:new_brand_list,
        is_list:true
      })
    },
    // 品牌型号
    brand_model(e){
      let that = this;
       console.log(e.detail.value)
       let model = e.detail.value;
       let new_brand_list = that.data.new_brand_list;
       let index = (new_brand_list.length - 0) -1;
       new_brand_list[index].model = model;
       that.setData({
        model,
        new_brand_list
       })
    },
    //成色
    bindPickernewold(e){
      let that = this;
      let info_newold = that.data.info_newold;
      let fineness = info_newold[e.detail.value];
      let new_brand_list = that.data.new_brand_list;
      let index = (new_brand_list.length - 0) -1;
      new_brand_list[index].fineness = fineness;
      that.setData({
        fineness,
        new_brand_list
      })
    },
    // 选择年份
    bindDateChange(e){
      console.log(e)
      let that = this;
      let new_brand_list = that.data.new_brand_list;
      let index = (new_brand_list.length - 0) -1;
      new_brand_list[index].purchase_year = e.detail.value;
      that.setData({
        purchase_year: e.detail.value,
        new_brand_list
      })
      console.log(that.data.brand_list)
    },
    // 选择保留信息
    getchengetype(e){
      let that = this;
      let index = e.currentTarget.dataset.index;
      let info_data = that.data.info_data;
      let new_brand_list = that.data.new_brand_list;
      let indx = (new_brand_list.length - 0) -1;
      let seled = info_data[index].seled;
      info_data[index].seled = !seled;
      let other = [];
      info_data.forEach(ele =>{
        if(ele.seled == true){
          other.push(ele.name);
        }
      })
      new_brand_list[indx].other = other;

        that.setData({
          info_data,
          new_brand_list
        })
        console.log(that.data.new_brand_list)
    },
    //点击上传图片图标开始上传图片
choosePic_tuan: function (e) { //选取图片
  console.log(e)
  let that = this;
  let new_brand_list = that.data.new_brand_list;
  let idx = (new_brand_list.length - 0) - 1;
  console.log(idx)
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      console.log(res)
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
            let new_brand_list = that.data.new_brand_list;
            let images = that.data.images;
            new_brand_list[idxx].img.push(data.data.url[0]);
            images.push(data.data.url[0]);
            that.setData({
              new_brand_list,
              images,
            })
          } else {
            app.showToast({
              title: "上传失败!",
            })
          }
          wx.hideLoading();
          i++;
          that.upLoadImg_tuan(image,i,idxx);
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
    openPhoto(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      console.log(e)
      that.setData({
        preview: that.data.images[index],
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
      that.data.img.splice(index, 1);
      that.setData({
        showFull: false,
        img: that.data.img
      })
    },
    // 立即估价
    gotosubmit(){
      let that = this;
      let brand_list = that.data.brand_list;
      let member_id = wx.getStorageSync('member_id');
      if(brand_list.length <= 0){
        if(!member_id){
          wx.showToast({
            title: '请先登录!',
            icon:'none'
          })
          return
        }
        if(that.data.category == ''){
          wx.showToast({
            title: '请先选择品类！',
            icon:'none'
          })
          return
        }
        if(that.data.name == ''){
          wx.showToast({
            title: '请先选择品牌名称！',
            icon:'none'
          })
          return
        }
        // if(that.data.model == ''){
        //   wx.showToast({
        //     title: '请输入品牌型号！',
        //     icon:'none'
        //   })
        //   return
        // }
        if(that.data.fineness == ''){
          wx.showToast({
            title: '请选择成色！',
            icon:'none'
          })
          return
        }
        if(that.data.images.length <= 0){
          wx.showToast({
            title: '请上传照片！',
            icon:'none'
          })
          return
        }
        if(that.data.images.length < 3){
          wx.showToast({
            title: '至少上传3张照片！',
            icon:'none'
          })
          return
        }
        let brand_list = that.data.new_brand_list;
        let book_info = {'book_info' : brand_list};
        let is_submit = that.data.is_submit;
        if(!is_submit){
          return
        }
        that.setData({
          is_submit:false
        })
        wx.showLoading({
          title: '提交中...',
        })
        common.post('/collect_clothes/add',{
          book_info,
          member_id:wx.getStorageSync('member_id')
        }).then(res =>{
          if(res.data.code ==200){
            wx.hideLoading();
            wx.showToast({
              title: '提交成功！',
              icon:'none'
            })
            wx.redirectTo({
              url: '/packageA/pages/receivearticle/submitState/index?aaa=1',
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
            that.setData({
              is_submit:true
            })
          }
        }).catch(e =>{
          console.log(e)
          that.setData({
            is_submit:true
          })
        })
      }else if(that.data.category == '' && that.data.name == ''&& that.data.model == ''&& that.data.fineness == ''&& that.data.images.length <= 0){
        let brand_list = that.data.brand_list;
        let book_info = {'book_info' : brand_list};
        let is_submit = that.data.is_submit;
        if(!is_submit){
          return
        }
        that.setData({
          is_submit:false
        })
        wx.showLoading({
          title: '提交中...',
        })
        common.post('/collect_clothes/add',{
          book_info,
          member_id:wx.getStorageSync('member_id')
        }).then(res =>{
          if(res.data.code ==200){
            wx.hideLoading();

            wx.showToast({
              title: '提交成功！',
              icon:'none'
            })
            wx.redirectTo({
              url: '/packageA/pages/receivearticle/submitState/index?aaa=1',
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
            that.setData({
              is_submit:true
            })
          }
        }).catch(e =>{
          console.log(e)
          that.setData({
            is_submit:true
          })
        })
      }else{
        if(!member_id){
          wx.showToast({
            title: '请先登录!',
            icon:'none'
          })
          return
        }
        if(that.data.category == ''){
          wx.showToast({
            title: '请先选择品类！',
            icon:'none'
          })
          return
        }
        if(that.data.name == ''){
          wx.showToast({
            title: '请先选择品牌名称！',
            icon:'none'
          })
          return
        }
        // if(that.data.model == ''){
        //   wx.showToast({
        //     title: '请输入品牌型号！',
        //     icon:'none'
        //   })
        //   return
        // }
        if(that.data.fineness == ''){
          wx.showToast({
            title: '请选择成色！',
            icon:'none'
          })
          return
        }
        if(that.data.images.length <= 0){
          wx.showToast({
            title: '请上传照片！',
            icon:'none'
          })
          return
        }
        if(that.data.images.length < 3){
          wx.showToast({
            title: '至少上传3张照片！',
            icon:'none'
          })
          return
        }
        let brand_list = that.data.new_brand_list;
        let book_info = {'book_info' : brand_list};
        let is_submit = that.data.is_submit;
        if(!is_submit){
          return
        }
        that.setData({
          is_submit:false
        })
        wx.showLoading({
          title: '提交中...',
        })
        common.post('/collect_clothes/add',{
          book_info,
          member_id:wx.getStorageSync('member_id')
        }).then(res =>{
          if(res.data.code ==200){
            wx.hideLoading();
            wx.showToast({
              title: '提交成功！',
              icon:'none'
            })
            wx.redirectTo({
              url: '/packageA/pages/receivearticle/submitState/index?aaa=1',
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
            that.setData({
              is_submit:true
            })
          }
        }).catch(e =>{
          console.log(e)
          that.setData({
            is_submit:true
          })
        })
      }

    },

    // 继续添加
    gotojixuadd(){
      let that = this;
      const new_brand_list = that.data.new_brand_list;
      console.log(that.data.brand_list)
      console.log(new_brand_list)
      if(that.data.category == ''){
        wx.showToast({
          title: '请先选择品类！',
          icon:'none'
        })
        return
      }
      if(that.data.name == ''){
        wx.showToast({
          title: '请先选择品牌名称！',
          icon:'none'
        })
        return
      }
      // if(that.data.model == ''){
      //   wx.showToast({
      //     title: '请输入品牌型号！',
      //     icon:'none'
      //   })
      //   return
      // }
      if(that.data.fineness == ''){
        wx.showToast({
          title: '请选择成色！',
          icon:'none'
        })
        return
      }
      if(that.data.images.length <= 0){
        wx.showToast({
          title: '请上传照片！',
          icon:'none'
        })
        return
      }
      if(that.data.images.length < 3){
        wx.showToast({
          title: '至少上传3张照片！',
          icon:'none'
        })
        return
      }
      if(that.data.category != ''){
        let brand_list = new_brand_list;
        that.setData({
          brand_list,
        })
      }
      let info_data = that.data.info_data;
      info_data.forEach(ele =>{
        ele.seled = false
      })
      that.setData({
        info_data,
        category:'',
        old_index:2,
        fineness_index:2,
        fineness:'',
        name:'',
        model:'',
        purchase_year: '',
        images:[]
      })
      console.log(that.data.brand_list)
      let newlist = [{
        category:'', // 品类
        supe_name:'', // 品类名称
        name:'',    // 品牌名称
        model:'',  // 品牌型号
        fineness:'',   // 成色
        purchase_year: '',   // 年份
        other:'',   // 保留信息
        img:[],   // 上传图片
      }]
     let bbbb = that.data.new_brand_list.concat(newlist)
      that.setData({
        new_brand_list:bbbb,
      })

    },
    listdetale(e){
      let that = this;
      let index = e.currentTarget.dataset.index;
      let brand_list = that.data.brand_list;
      brand_list.splice(index, 1);
      that.setData({
        brand_list,
      })
    } 
})