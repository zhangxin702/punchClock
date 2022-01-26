// component/panel/panel.js
Component({
  properties: {
    title: {
      type: String,
      value: ''
    }
  },
  data: {

  },
  methods: {
    rightTap(e){
      this.triggerEvent('paneltap', { current: e.detail.current }, {});
    }
  }
})
