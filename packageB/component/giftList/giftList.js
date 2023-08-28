const common = require('../../../assets/js/common');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_gift:{ // 获取父级自定义属性值
      type:Boolean,
      value:false
    },
    selt_id:{  // 选中的动态id
      type:Number,
      value:0
    },
    content_uid:{
      type: Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    giftList:[],
    selt_id: 0,
    content_uid: 0,
    realAmount:0.00,
    is_jfbz:false
  },
  attached: function () {
    console.log('attached')
    // console.log(this.dataset.swiper_index)
    // this.setData({
    //   swiper_index:this.dataset.swiper_index
    // })
    this.getgiftList();
    this.getaccountnumber();
  },
  /**
   * 组件的方法列表
   */
  methods: {
   // 阻止冒泡
   catchtouchmove(){
    return
   },
    // 点击弹窗周围隐藏弹窗
    is_gift_mask(){
      this.setData({
        is_gift: false,
      })
      // 'show_poster' 是page页面里子组件标签自定义的方法
      // this.triggerEvent('show_poster',is_poster);
    },
    // 获取礼物列表
    getgiftList(){
      let that = this;
      common.get('/mine/index?op=gift_gift',{}).then(res =>{
        if(res.data.code == 200){
          that.setData({
            giftList: res.data.data.gift_list
          })
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
    // 点击礼物项 赠送礼物按钮
    giveAwayGift(e){
      let that = this;
      let id = e.currentTarget.dataset.id;
      let gift_jf = e.currentTarget.dataset.gift_jf;
      let gift_name = e.currentTarget.dataset.gift_name;
      let realAmount = that.data.realAmount;
      let selt_id = that.data.selt_id;
      let content_uid = that.data.content_uid;
      if( Number(realAmount)<Number(gift_jf) ){
        that.setData({
          is_jfbz: true
        })
        return
      }
      common.get('/mine/index?op=give_gift',{
        member_id: wx.getStorageSync('member_id'),
        content_id:selt_id, // 动态的id
        content_uid, // 动态发布的用户
        type: '2',  // 1 回复，2 礼物
        content:"", // 回复内容
        gift_id: id, // 礼物id
        gift_name, // 礼品名称
        gift_i: gift_jf,
        gift_count: 1
      }).then(res =>{
        if(res.data.code == 200){
          wx.showToast({
            title: '赠送礼物成功！',
          })
          setTimeout(function(){
            that.setData({
              is_gift: false,
              content_uid:0
            })
          that.triggerEvent('show_poster');
          },1500)
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
    // 点击去赚积分
    goTotastList(){
      wx.navigateTo({
        url: '/packageB/pages/signTaskList/index',
      })
    },
     // 点击积分不足周围隐藏弹窗
    is_jfbz_mask(){
      this.setData({
        is_jfbz: false
      })
    },






// 获取环保银行账户详情
  getaccountnumber(){
    let that = this;
    common.get("/environmental/bank/environmentalBankHome", {
      member_id: wx.getStorageSync('member_id'),
      type: 8
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          realAmount: Number(res.data.data.realAmount),
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },
  }

})
