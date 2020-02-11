const app = getApp()
import mqtt from '../../../library/mqtt.js';







Page({

  /**
   * 页面的初始数据
   */
  data: {
    client:null,
    
  },


  mqttCon:function(){
    var that = this;
    that.data.client = app.globalData.client;
    that.data.client.on('connect', e => {
      console.log("ok");
      that.data.client.subscribe('presence', function (err) {
        if (!err) {
          that.data.client.on('message', function (topic, message) {
            console.log(message.toString());
            that.data.client.end();
          })
        }
      })
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  }
})