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
    space_list:[],
    homeworkList:{},
    member_id: wx.getStorageSync('member_id')
  },
  attached: function () {

    this.getspaceList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getspaceList(){
      let that = this;
      common.get('/life/index?op=space_list',{
        is_vip:1,
        member_id: wx.getStorageSync('member_id'),
        page: 1,
        is_sale: 0,
      }).then(res =>{
        if(res.data.code == 200){
          that.setData({
            space_list:res.data.data.space_list,
            homeworkList: res.data.data.space_list.length>0?res.data.data.space_list[0]:null,
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
    clickBuy(e){
      console.log(e)
      let that = this;
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        // url: '/packageB/pages/livingHall/reserve_buypages/index?id=' + id,
        url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
      })
    },
    // 点击查看更多人作品
    gotoAll(){
      wx.navigateTo({
        url: '/packageB/pages/livingHall/everyone_workList/index',
      })
    },
    gotoPersonalHome(e){
      let mid = e.currentTarget.dataset.member_id;
      wx.navigateTo({
        url: '/packageB/pages/livingHall/personal_home/index?mid=' + mid,
      })
    },
  },

})
