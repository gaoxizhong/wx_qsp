const common = require('../../../assets/js/common');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    welfare:{
      type: Number,
      value:0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    name:'',
    mobile:'',
    saveGarden:'',
    address:'',
    remark:'',
    welfare:'',
    region:['北京市','北京市','海淀区']
  },
  attached: function () {
    // 获取父组件标签上自定义data- 属性
    // console.log(this.dataset)
    console.log('attached')
    this.get_address();
  },
  moved: function () {
    console.log('moved')
  },
  detached: function () {
    console.log('detached')
  },
  /**
   * 组件的方法列表
   */
  methods: {
    catchtouchmove(){
      return
    },
    click_mask(){
      let is_info = false;
      this.triggerEvent('is_info',is_info)
    },
    name(e){
      this.setData({
        name:e.detail.value
      })
    },
    mobile(e){
      this.setData({
        mobile:e.detail.value
      })
    },
    saveGarden(e) {
      console.log(e)
      this.setData({
        saveGarden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
      })
    },
    address(e){
      this.setData({
        address:e.detail.value
      })
    },
    remark(e){
      this.setData({
        remark:e.detail.value
      })
    },


    // 获取地址信息
    get_address(){
      let that = this;
      common.get('/public_welfare/receive',{
        member_id:wx.getStorageSync('member_id'),
        welfare: that.data.welfare,
      }).then(res =>{
        if(res.data.code == 200){
          that.setData({
            name:res.data.data?res.data.data.name:'',
            mobile:res.data.data?res.data.data.mobile:'',
            saveGarden:res.data.data?res.data.data.region:'',
            address:res.data.data?res.data.data.address:'',
          })
        }
      }).catch(e =>{
        console.log(e)
      })
    },


    //保存地址
    saveAddress() {
      let that = this;
      let params = {
        "member_id":wx.getStorageSync('member_id'),
        "welfare": that.data.welfare,
        "name": that.data.name,
        "mobile": that.data.mobile,
        "region": that.data.saveGarden,
        "address":  that.data.address,
        "remark":  that.data.remark,
      }
      console.log(params);
      if (!params.name) {
        wx.showToast({
          "title": "姓名不能为空！",
          "icon": "none"
        })
        return
      }
      if (!params.mobile) {
        wx.showToast({
          "title": "联系方式不能为空！",
          "icon": "none"
        })
        return
      }
      if ( !(/^1[345678]\d{9}$/.test(params.mobile)) ) {
        wx.showToast({
          "title": "请填写正确的联系方式！",
          "icon": "none"
        })
        return
      }
      if (!params.region) {
        wx.showToast({
          "title": "请选择省市区！",
          "icon": "none"
        })
        return
      }
      if (!that.data.address) {
        wx.showToast({
          "title": "请填写详细地址！",
          "icon": "none"
        })
        return
      }

      common.get("/public_welfare/receive", params).then( res => {
        console.log(res);
        if ( res.data.code == 200 ) {
          wx.showToast({
            "title": '已领奖，尽快为您发送！',
            "icon": 'none'
          })
          setTimeout(function(){
            let is_info = false;
            this.triggerEvent('is_info',is_info);
            wx.reLaunch({
              url: '/pages/index/index',
            })
          },2000)
            return
        }else{
          wx.showToast({
            "title": res.data.msg,
            "icon": "none"
          })
          return
        }
       
      }).catch( error => {
        console.log(error);
      })
    },




  },

})
