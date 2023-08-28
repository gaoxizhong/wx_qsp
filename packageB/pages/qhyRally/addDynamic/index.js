const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
import { getLessLimitSizeImage} from '../../../../utils/newImgcomp'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaVal:'',
    photos: [], //图片数组
    isDisabled: false,
    exhibitAddress:'',
    lat:'', 
    lng: '',
    is_debug: true,
    id:'',
    quality: 0.2,
    cWidth: 750,
    cHeight: 1334,
    marketInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var marketInfo = JSON.parse(options.marketInfo);
    this.setData({
      marketInfo,
      exhibitAddress: marketInfo.market_name
    })
    console.log(this.data.marketInfo);

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
  textareaChange(e) {
    let that = this
    that.setData({
      textareaVal: e.detail.value
    })
  },
  //选取图片
  chooseImg(e){
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
        let photos = that.data.photos;
        photos.push(img);
        that.setData({
          photos,
        })  
        // that.setData({
        //   photos: that.data.photos.concat(img)
        // })         
        wx.getFileInfo({
            filePath:img,
            success:function(res){
              console.log('3压缩后：'+res.size/1024+'kb')
            }
        })
        index = index + 1;
        that.getLessLimitSizeImage(index,ts)
      })
    }

  },

   //打开图片
  openPhoto: function(event) {
    let that = this;
    console.log(event);
    // wx.previewImage({
    //   current: e.currentTarget.dataset.url, // 当前显示图片的http链接
    //   urls: that.data.pics // 需要预览的图片http链接列表
    // })
    that.setData({
      layer: true,
      preview: event.currentTarget.dataset.url,
      imgname: event.currentTarget.dataset.imgname,
      previewIndex: event.currentTarget.dataset.index
    });
  },
  closePic: function() { //关闭图片
    let that = this;
    that.setData({
      layer: false
    });
  },
  delPic: function() {
    let that = this;
    let picsUp = that.data.photos;
    picsUp.splice(that.data.previewIndex, 1);
    that.setData({
      photos: picsUp,
      layer: false
    });
  },
  // 确定提交按钮
  shareSub(){
    let that = this;
    let words = that.data.textareaVal;
    if (words==""){
      wx.showToast({
        title:'内容不能为空！',
        icon:'none'
      })
      return
    }
    let is_debug = that.data.is_debug;
    if(!is_debug){
      wx.showToast({
        title: '请勿重复提交！',
        icon:'none'
      })
      return
    }
    that.setData({
      is_debug:false
    })
    app.uploadOss({
      url: setting.apiUrl + '/file/uploadOss', //这里是你图片上传的接口
      path: that.data.photos, //这里是选取的图片的地址数组
      result_list: [],
      picUpSuccess: function (res) {
         let ossimg = res.result_list;
        wx.showLoading({
          title: '提交中...',
        })
        common.post('/community_market/add_community_market_dynamic',{
          member_id: wx.getStorageSync('member_id'),
          community_info_id: that.data.marketInfo.community_info_id,//社区ID
          community_market_id:that.data.marketInfo.id, //社区大集ID
          images_list: JSON.stringify(ossimg), //发圈图片
          contents: that.data.textareaVal,//发圈内容
          tag_type: 1
        }).then(res =>{
          wx.hideLoading();
          if(res.data.code == 200){
            wx.showToast({
              title: '打卡成功！',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1,
              })
            },1000)
          }else{
            that.setData({
              is_debug:true
            })
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
        }).catch(e =>{
          wx.hideLoading();
          that.setData({
            is_debug:true
          })
          console.log(e)
        })
      }
    });



  }
})