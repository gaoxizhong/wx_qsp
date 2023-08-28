const common = require('../../../assets/js/common');

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    buyer_address: '',
    showEdit: false,
    buyer_name:'', // 买家姓名
    buyer_phone:'', // 买家联系方式
    buyer_ssq:'', // 省市区
    buyer_addressDetail:'', // 详细地址
  },
  attached(){
    let that = this;
    // 获取用户地址
    common.get("/business/getMemberFreightAddress", {
       "member_id": wx.getStorageSync('member_id') 
      }).then( res => {
      console.log(res)
      if (res.data.code == 200 && res.data.data.length > 0) {
        that.setData({
          buyer_address: res.data.data[0]
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openEdit(){
      this.setData({
        showEdit: !this.data.showEdit,
      })
    },
    // 输入姓名
    inputName(e) {
      this.setData({
        buyer_name: e.detail.value
      })
    },
    // 输入联系方式
    inputPhone(e) {
      this.setData({
        buyer_phone: e.detail.value
      })
    },
    // 输入详细地址
    inputAddrDetail(e) {
      this.setData({
        buyer_addressDetail: e.detail.value
      })
    },
    // 选择省市区
    chooseAddress(e) {
      this.setData({
        buyer_ssq: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
      })
    },
    //保存地址
    saveAddress() {
      let that = this;
      let params = {
        "member_id": that.data.member_id,
        "name": that.data.buyer_name,
        "phone": that.data.buyer_phone,
        "address": that.data.buyer_ssq + that.data.buyer_addressDetail,
        "type": 1
      }
      console.log(params);
      if (!params.phone) {
        wx.showToast({
          "title": "联系方式不能为空！",
          "icon": "none"
        })
        return
      }
      if ( !(/^1[345678]\d{9}$/.test(params.phone)) ) {
        wx.showToast({
          "title": "请填写正确的联系方式！",
          "icon": "none"
        })
        return
      }
      if (!params.name) {
        wx.showToast({
          "title": "请填写姓名！",
          "icon": "none"
        })
        return
      }
      if (!that.data.buyer_addressDetail) {
        wx.showToast({
          "title": "请填写详细地址！",
          "icon": "none"
        })
        return
      }
      if (!that.data.buyer_ssq) {
        wx.showToast({
          "title": "请选择省市区！",
          "icon": "none"
        })
        return
      }
      common.get("/business/memberFreightAddress", params).then( res => {
        console.log(res);
        if ( res.data.code == 200 ) {
          that.setData({
            buyer_address: params,
            showEdit:false
          })
        }
        if (res.data.code == 201) {
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
  }
})
