const app = getApp()
import mqtt from '../../../library/mqtt.js';
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    client:null,
    scroll:0,
    number:null,
    dateArray:[],
    name:null,
    condition:"无异常",
    todayDate:null,
    persent:"0",
    persent2:0,
    timer:[],
    toolArray:[],
    show:false
  },

  detail:function(e){
    console.log(e);
    var obj=this.data.toolArray;
    // console.log(obj)
    for(let i=0;i<obj.length;i++){
      if (obj[i].date == e.currentTarget.id)
      {
        this.setData({
          timer:obj[i].timer
        })
        break;
      }
    }
    if(this.data.timer.length==0){
      console.log("error");
    }
    else{
      console.log("success",this.data.timer)
    }
    this.setData({
      show:true
    })
  },


  hideModal:function(){
    this.setData({
      show: false
    })
  },


  mqttConnet:function(e){
    var that = this;
    that.data.client = app.globalData.client;
    that.data.client.on('connect', e => {
      console.log("ok");
      that.data.client.subscribe('ask', function (err) {
        if (!err) {
          console.log("here")
          that.data.client.publish('ask', that.data.number.toString())
        }
      })
    });
    that.data.client.subscribe('ask'+that.data.number.toString(),function(err){
      if(!err){
        that.data.client.on('message',function(topic,message){
          var obj=JSON.parse(message);
          if(obj instanceof Array){
            //write somthing
            that.setData({
              toolArray:obj
            })
            // console.log(obj,that.data.toolArray);
          }
        })
      }
    })
  },


  scrollSteps:function() {
    var that=this;
    for (let i = 0; i < this.data.dateArray.length;i++)
    {
      var toolDate = this.date2(this.data.dateArray[i]);
      if (toolDate.year >=parseInt(this.data.todayDate.year) && toolDate.month >=parseInt(this.data.todayDate.month) && toolDate.day >= parseInt(this.data.todayDate.day)){
      break;}
      var str = parseInt(((i+1 )/ this.data.dateArray.length)*100);
      var str2=str.toString()+"%"
      this.setData({
        scroll: this.data.scroll + 1,
        persent2:str,
        persent:str2,
      })
    }
    // this.setData({
    //   scroll: this.data.scroll == 9 ? 0 : this.data.scroll + 1
    // })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var toolPlan = wx.getStorageSync(options.number.toString());
    
    var today = util.formatTime(new Date());  //获得今天的日期
    var toolTodayDate=this.date1(today);
   this.setData(                          //从plansIndex页面传过来的number
     {
       number:options.number,
       dateArray:toolPlan.dateArray,
       name:toolPlan.name,
       todayDate:toolTodayDate
     }
   );
    this.scrollSteps();
    this.mqttConnet();
  },



  date1: function (today) {
    var todayDate = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null
    }
    todayDate.year = parseInt(today.substring(0, 4));
    todayDate.month = parseInt(today.substring(5, 7));
    todayDate.day = parseInt(today.substring(8, 10));    
    todayDate.hour = parseInt(today.substring(11, 13));
    todayDate.minute = parseInt(today.substring(14, 17));
    return todayDate;
  },

  date2: function (today) {
    var todayDate = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null
    }
    todayDate.year = parseInt(today.substring(0, 4));
    todayDate.month = parseInt(today.substring(5, 7));
    todayDate.day = parseInt(today.substring(7, 9));
    todayDate.hour = parseInt(today.substring(11, 13));
    todayDate.minute = parseInt(today.substring(14, 17));
    return todayDate;
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

// function date(today){
//   var todayDate={
//     year:null,
//     month:null,
//     day:null,
//     hour:null,
//     minute:null
//   }
//    todayDate.year = parseInt(today.substring(0, 4));
//    todayDate.month= parseInt(today.substring(5, 7));
//    todayDate.day= parseInt(today.substring(8, 10));
//   todayDate.hour = parseInt(today.substring(12, 14));
//   todayDate.minute = parseInt(today.substring(15, 17));
//   return todayDate;
// }