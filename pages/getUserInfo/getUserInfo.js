/* getUserInfo.js */
/* show the user's info and today's plans */
/* like this */
/* time  | name        |  eat? |*/
/* 12:00 | amoxicillin |  yes  |*/
/*       | Penicillin  |  yes  |*/
/* 13:00 | Gentamicin  |  no   |*/
var app = getApp();
const db=wx.cloud.database({
  env:"test-0tr93",
});

var util = require('../../utils/util.js');

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showArray:null,
    showNothing:false
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../plan/plan'
    })
  },


  onLoad: function () {
    var today = speretTime(util.formatTime(new Date()),null,"today");  //获得今天的日期
    var involveTodayPlanArray=deletPlanNotInvolveToday(returnPlanArray(),today);//获得已经筛选过的日期数组
    var showArray=['时间','药名','是否服药'];
    if(!involveTodayPlanArray||involveTodayPlanArray[0]==null){
      console.log("今天没药吃，歇了吧您内");
      this.setData({
        showNothing:true
      })
    }
    else{
      var timeSortArray=getSortedTimeArray(involveTodayPlanArray);  //获取排好序的时间数组
      if(timeSortArray){
        for(let i=0;i<timeSortArray.length;i++){      //遍历时间数组
          if(timeSortArray[i]==timeSortArray[i-1])
          continue;
          showArray.push(timeSortArray[i])
          for(let j=0;j<involveTodayPlanArray.length;j++){
            for(let k=0;k<involveTodayPlanArray[j].timer.length;k++){
              if(involveTodayPlanArray[j].timer[k]==timeSortArray[i]){
                showArray.push(involveTodayPlanArray[j].name);
                var time=speretTime(null,involveTodayPlanArray[j].timer[k],"time")
                if(time){
                  if(time.hour*60+time.minute>today.hour*60+today.minute){
                    showArray.push("未服药");
                  }
                  else
                  showArray.push("已服药")
                }
                else{
                  showArray.push("error")
                }
                showArray.push("");
              }
            }
          }
          showArray.pop();
        }
      }
    }
    console.log(showArray);
    //有可能的话在这里写个循环
    /**
     * 由于时间原因，在这里的逻辑有点问题，应该要写几个循环匹配的，这个问题之后有机会再改吧
     */
    try{
      let timeList=wx.getStorageSync('timeList1');
      let timeListToday=null;
      for(let m=0;m<timeList.length;m++){
        let dayFuckMe=speretTime(timeList[m][0],null,"date");
        if(dayFuckMe.day==today.day){
          timeListToday=timeList[m];
        }
      }
      console.log(timeListToday);
      let plan=wx.getStorageSync('1');
      for(let i=0;i<showArray.length;i++){
        let j=1;
        if(showArray[i]==plan.name){
          if(showArray[i+1]=="已服药"&&timeListToday[j].time!=null){
            console.log(showArray[i]);
            j++;
          }
          else if(showArray[i+1]=="已服药"&&timeListToday[j].time==null){
            console.log(showArray[i+1]);
            showArray[i+1]="未服药";
            j++;
          }
        }
      }
    }
    catch(e){
      console.log(e);
    }
     
    
    

    
    this.setData({
      showArray:showArray,
      formColorArray:arrangeColour(showArray.length)
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.onLoad();
  },

  goToDebug:function(){
    console.log('navigateto function is working')
    wx.navigateTo({
      url:"../index/debugTest/debugTest"
    })
  }

})


function speretTime(date,time,mood) {          //分开时间返回整形数 
  switch (mood) {
    case "date":
      return {
        year : parseInt(date.substring(0, 4)),
        month : parseInt(date.substring(5, 7)),
        day : parseInt(date.substring(8, 10)),
      }
      case "time":{
        return {
          hour : parseInt(time.substring(0, 2)),
          minute : parseInt(time.substring(3, 5)),
        }
      }
      case "today":{
        return {
          year : parseInt(date.substring(0, 4)),
          month : parseInt(date.substring(5, 7)),
          day : parseInt(date.substring(8, 10)),
          hour : parseInt(date.substring(11, 13)),
          minute : parseInt(date.substring(14, 17)),
        }

      }
    default:
      break;
  }
}


function returnPlanArray() {   //返回获得的数组
  var planArray=new Array();
  for(let i=1;i<=5;i++){
    var Plan=wx.getStorageSync(i.toString());
    if(Plan){
      planArray.push(Plan);
    }
    Plan=null;
  }
  return planArray
}

function deletPlanNotInvolveToday(planArray,today){       //剔除掉那些包含不包含今天的数组，返回包含今天的数组
  if(planArray[0]){
    var involeTodayPlanArray=new Array()
    for(let i=0;i<planArray.length;i++){
      for(let j=0;j<planArray[i].dateArray.length;j++){
        if(today.day==speretTime(planArray[i].dateArray[j],null,"date").day){
          involeTodayPlanArray.push(planArray[i]);
          break;
        }
      }
    }
    planArray=null;
    return involeTodayPlanArray;
  }
  else
  return null;
}


function getSortedTimeArray(planArray) {     //返回排好序的时间数组
  var timeArray=new Array();
  for(let i=0;i<planArray.length;i++){
    for(let j=0;j<planArray[i].timer.length;j++){
      var time=speretTime(null,planArray[i].timer[j],"time");
      timeArray.push(time.hour+time.minute);
      time=null;
    }
  }
  for(let i=0;i<timeArray.length;i++){            //冒泡排序
      for(let j=timeArray.length-1;j>=i;j--){
          if(timeArray[j]<timeArray[j-1]){
              var tool=timeArray[j];
              timeArray[j]=timeArray[j-1];
              timeArray[j-1]=tool;
          }
      }
  }
 
  for(let i=0;i<timeArray.length;i++){     //将时间还原成string
    var hourString=parseInt(timeArray[i]%60);
    var minuteString=parseInt(timeArray[i]/60);
    if(hourString<10){
      hourString="0"+hourString.toString()
    }
    if(minuteString<10){
      minuteString="0"+minuteString.toString();
    }
    else if(minuteString==0){
      minuteString="00"
    }
    timeArray[i]=hourString+":"+minuteString;
  }
  tool=null;
  hourString=null;
  minuteString=null;
  return timeArray
}

function arrangeColour(legenth){            // 表格颜色的确定
  var formColorArray=new Array();
  if(legenth){
    for(let i=0;i<legenth;i++){
      formColorArray.push(i%3==0?"cyan":"blue");
    }
    return formColorArray;
  }
  else
  return null;
}



