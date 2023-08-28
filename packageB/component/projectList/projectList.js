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
    projectList:[], // 项目列表
    page:1,
    project_count:0
  },
  attached(){
    this.getprojectList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getprojectList(){
      let that = this;

      common.get('/life/index?op=project',{
        page: that.data.page,
        page_size:8
      }).then(res =>{
        if(res.data.code == 200){
          let list = res.data.data.project;
          let listLength = that.data.projectList.length;
          let project_count = res.data.data.project_count;
          if(listLength >= project_count ){
            wx.showToast({
              title: '已加载全部！',
              icon:'none'
            })
            return
          }else{
            that.setData({
              projectList: that.data.projectList.concat(list),
              page: that.data.page+1,
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
    // 点击项目购买
    gotoBuyDetails(e){
      console.log(e)
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/packageB/pages/livingHall/reserve_proDetails/index?p_id=' + id,
      })
    },
  }
})
