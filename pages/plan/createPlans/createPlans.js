Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:"",
    isSubmit:false,
    N:{}
  },
/*表单提交函数*/
Submit: function(e)
{
  var abc=e.detail.value;
  console.log(e);
  this.setData({
    test:abc,
    isSubmit:true
  });
  console.log(this.data.test);
  if (this.data.isSubmit){
    //console.log("Unload方法被调用");
    console.log("下面是Data中的数据");
    const eventChannel=this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
    eventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });


    wx.request({
      url: ' https://easy-mock.com/mock/5dc57d6e2b69d9223b633bb3/example/xjtu',
      data:{
        uname:"hahaha"
      },
      method:"GET",
      header:{"content-type": "application/json "},
      success:function(res){
          console.log(res.data)
      }
    })
   }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var N=this.getOpenerEventChannel()
    
    const eventChannel = this.getOpenerEventChannel()
    //console.log(eventChannel);  
    eventChannel.emit('acceptDataFromCreatePlanPage', {data: 'get The information'});
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
   if(this.data.isSubmit)
   {
     
      // console.log("Unload方法被调用");
       //console.log("下面是Data中的数据")
     const newEventChannel = this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
     newEventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });
     
   }
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
    
  }
})