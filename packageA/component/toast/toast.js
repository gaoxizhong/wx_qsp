// packageA/component/toast.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: {
    animationData: {},
    content: '提示内容'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 
     * 显示toast，定义动画
     */
    showToast(val) {
      var animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.translateY(220).opacity(1).step()
      this.setData({
        animationData: animation.export(),
        content: val
      })
      /**
       * 延时消失
       */
      setTimeout(function () {
        animation.opacity(0).translateY(-220).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 1500)
    }
  }
})
