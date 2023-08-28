const common = require('../../assets/js/common');
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
    total_count:0,
    welfareGoodsList:[],
    welfareGoodsCount:0,
    page:0
  },
  attached: function () {
    console.log('attached')
    // 获取父组件标签上自定义data- 属性
    // console.log(this.dataset)
    this.getWelfareGoods();
  },
  moved: function () {

  },
  detached: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
  //获取今日福利
  getWelfareGoods() {
    let that = this;
    common.get("/welfare/revcover_welfare", {
      page: that.data.page
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          total_count: res.data.count,
          welfareGoodsList: res.data.data.goods_info,
          welfareGoodsCount: res.data.data.all_page
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  //更换今日福利
  changeWealfareGoods() {
    let that = this;
    if (that.data.page >= (that.data.welfareGoodsCount)){
      that.setData({
        page: 0
      })
      that.getWelfareGoods();
      return
    }
    that.setData({
      page: that.data.page += 1
    })
    that.getWelfareGoods();
  },
  //前往福利详情
  goToInfo(e) {
    let that = this;
    let goodid = e.currentTarget.dataset.id;
    let business_id = e.currentTarget.dataset.business_id;
    wx.navigateTo({
      url: "/packageA/pages/praise_welfaredetail/index?goodid="+ goodid + "&business_id=" + business_id,
    })
  },
  }
})
