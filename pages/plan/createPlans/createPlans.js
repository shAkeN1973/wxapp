/*creatPlans.js*/

const app = getApp()
import mqtt from '../../../library/mqtt.js';
var util = require('../../../utils/util.js');
var number=null;
var temp=null;
var numberTime=null;
var tempTime=null;
var upLoadArray=new Array();
var full=true;


var plans= {
  name: "",   //药物名称
  date: "",  //开始服药日期
  timer:[],  //设定的时间数组
  lengthOfTime: null,    //服药时间长度
  frenquency: null,      //一天吃几次
  drugsInOneDay:null,     //一次吃多少
  afterOrBefore: null,   //饭前饭后吃
  interval:null,      //服药间隔天数（若每天都吃则为null)
  };


var upLoadPlans={   //上传数组
  name:"",          //药物名称，可用于校验
  number:null,      //对应的药盒编号
  timer:[],        //每天的服药时间段
  drugsInOneDay:null,   //每天吃多少
  dateArray:[],        //日期数组，可能不会要但是得写上
  afterOrBefore:null,  //饭前吃还是饭后吃
  start:false
};

Page({
  data: {
    client:null,
    test:"",
    isSubmit:false,
    N:{},
    index:null,
    indexTime:null,                                //默认数组的当前下标名
    picker:["1","2","3","4","5","6","7","8"],  //选择有多少种药物
    howMany:"0",
    date1:"2019-07-01",
    array:[],
    timeChanger:[],
    numberArray:[]
  },

  PickerChange(e) {
    //console.log(e);
    this.setData({
      indexTime: e.detail.value,                    //一天以内吃几次的数量（frequency)
    });
    var size =parseInt(this.data.indexTime); 
    numberTime=size;                          
    tempTime=0;                                            
    var arr=new Array();
    for(var i=0;i<size;i++)
    {
      arr.push({"symbolTime":"symbolTime"+i.toString(),time:"12:00"});
    }
    this.setData({
      array: arr,
    }); 
    arr=null;
  },

  TimeChange(e){
    var time= e.detail.value;
    if (number > -1) {
      plans.timer.push(time);
      var toolArray = this.data.array;
      //console.log(plans);
      toolArray[tempTime].time = time;
      this.setData(
        {
          array: toolArray
        }
      );
      toolArray = null;
      tempTime++;
    }
    else {
      wx.showToast({
        title: 'error',
        //icon: 'loading',
        duration: 2000
      })
    }
  },

DateChange(e) {     //将显示的日期改变
    var date=e.detail.value;
    plans.date=date;
      this.setData(
        {
          date1:date
        })
  },

/*表单提交函数*/
Submit: function(e)
{
  if(e.currentTarget.id=='drugName'){
  var name=e.detail.value;
  //console.log(e);
  if(name==plans.name&&name==null)
  {
    wx.showToast({
      title: 'error',
      duration: 2000
    })
  }
  else{
    plans.name=name;
    }
  
  }
  else if (e.currentTarget.id =='lengthOfTime')
  {
    var lengthOfTime = e.detail.value;
   // console.log(e);
    if (lengthOfTime == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else
      plans.lengthOfTime = lengthOfTime;
  }
  else if (e.currentTarget.id == 'drugInOneDay') {
    var drugInOneDay = e.detail.value;
   // console.log(e);
    if (drugInOneDay == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else {
      plans.drugsInOneDay = drugInOneDay;
    }
  }
  else if (e.currentTarget.id == 'interval') {
    var interval = e.detail.value;
   // console.log(e);
    if (interval == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else {
      plans.interval = interval;
      console.log(plans);
    }
  }
  },

getStorageSlef:function(){         //只有在输入药物名称的时候才可以进行下一步操作
  var that = this
  wx.getStorage({
    key: 'nmsl',
    success(res) {
      console.log(res.data)
      for (let i = 0; i < 8; i++) {
        if (res.data[i] == null) {
          upLoadPlans.number = i + 1;           //设置药盒编号
          res.data[i] = "Occupied"
          try {
            wx.setStorage({
              key: "nmsl",
              data: res.data,
            });
          }
          catch (e) {
            console.log(e);
          }
          break;
        }
      }
    }
  })
},


dateCaculator(plans,upLoadPlans)   //计算日期数组
{
  var year=parseInt(plans.date.substring(0,4));
  var month=parseInt(plans.date.substring(5,7));
  var day=parseInt(plans.date.substring(8,10));
  var dateMax=null;
  if(month==2)
  {
      if(year%4==0&&year%100!=0)
          dateMax=29;
      else
          dateMax=20;
  }
  else if(month>6&&month%2==0||month<7&&month%2!==0)
  {
      dateMax=31;
  }
  else{
      dateMax=30;
  }
  for(var i=0;i<plans.lengthOfTime;i++)
  {
      var string=new String();
      string=year.toString()+"-"+month.toString()+"-"+day.toString();
      upLoadPlans.dateArray.push(string);
    day = day + parseInt(plans.interval);
    if (day >= dateMax) {
      day = day % dateMax;
      month++;
      console.log(day);
    }
      console.log(string);
  }
},


upLoad(upLoadPlans){
    // var newJson = JSON.stringify(upLoadPlans); //数组转json字符串
    var newJson=upLoadPlans.number.toString()+"N"+upLoadPlans.name.toString()+"T"+this.timeArry()+"A";
    var that = this;
    that.data.client = app.globalData.client;
    that.data.client.on('connect', e => {
      console.log("药物上传连接成功");
      that.data.client.subscribe('SW_LED', function (err) {
        if (!err) {
          that.data.client.publish('SW_LED', newJson)
        }
      })
    });
    that.data.client.publish('time',currentTime());//向对面发送现在的时间
    that.data.client.on('message', function (topic, message) {
      console.log(message.toString(),"这是接受到的信息，接下来将关闭mqtt连接");
  })
 
},



refresh(plans){     //plans 按值传递
    var toolplans= {
      name: "",
      date: "",
      lengthOfTime: null,
      frenquency: null,
      afterOrBefore: null,
      };
      toolplans.name=plans.name;
      toolplans.date=plans.date;
      toolplans.lengthOfTime=plans.lengthOfTime;
      toolplans.frenquency=plans.frenquency;
      toolplans.afterOrBefore=plans.afterOrBefore;
      return toolplans;
  },
  /*
  plans.name=e.detail.value;
  //console.log(plans);
  this.setData({
    //test:abc,
    isSubmit:true
  });
 /*
  if (this.data.isSubmit){
    const eventChannel=this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
    eventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });
   }*/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var N=this.getOpenerEventChannel()
    this.getStorageSlef();
    
    const eventChannel = this.getOpenerEventChannel()
    //console.log(eventChannel);  
    eventChannel.emit('acceptDataFromCreatePlanPage', {data: 'get The information'});
    /*
    var that=this
    wx.getStorage({
      key: 'nmsl',
      success(res) {
        console.log(res.data)
        for (let i = 0; i < 12; i++) {
          if (res.data[i] == null) {
            upLoadPlans.number = i + 1;           //设置药盒编号
            res.data[i] ="Occupied"
            try{
            wx.setStorage({
              key: "nmsl",
              data: res.data,
            });}
            catch(e)
            {
              console.log(e);
            }
            break;
          }
        }
      }
    })*/
  },

  SM: function () {
    upLoadPlans.name=plans.name;
    upLoadPlans.drugsInOneDay=plans.drugsInOneDay;
    upLoadPlans.afterOrBefore=plans.afterOrBefore;
    upLoadPlans.timer=plans.timer;
    this.dateCaculator(plans,upLoadPlans);
    console.log(upLoadPlans);
    wx.setStorage({
        key: upLoadPlans.number.toString(),
        data: upLoadPlans,
      });
    this.upLoad(upLoadPlans);
  },

  onUnload: function () {
   if(this.data.isSubmit)
   {
     
      // console.log("Unload方法被调用");
       //console.log("下面是Data中的数据")
     const newEventChannel = this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
     newEventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });
    
   }
  },

  
  timeArry:function(){         //计算数组发送  
    // console.log(timeCaluToday(today),upLoadPlans.dateArray[0],timeCaluPlan(upLoadPlans.dateArray[0]));
    var today=timeCaluToday(util.formatTime(new Date())) //获得今天的日期
    var day=timeCaluPlan(upLoadPlans)    //获取plan中的日期数组
    var timerUse=timeCaluPlanTimer(upLoadPlans.timer)
    
    var result=timeDiff(today.day,day[0],today.hour,timerUse[0].hour,today.min,timerUse[0].minute,1);
    var upLoadTimeString=result.hour.toString()+":"+result.minute.toString()+","
    
    for(let i=0;i<day.length;i++){
      for(let j=0;j<timerUse.length;j++){
        if(i==0&&j==0){
          continue;
        }
        else if(j==0){
          result=timeDiff(day[i-1],day[i],timerUse[timerUse.length-1].hour,timerUse[0].hour,timerUse[timerUse.length-1].minute,timerUse[0].minute,1);
          upLoadTimeString=upLoadTimeString+result.hour.toString()+":"+result.minute.toString()+",";
        }
        else{
          result=timeDiff(null,null,timerUse[j-1].hour,timerUse[j].hour,timerUse[j-1].minute,timerUse[j].minute,0)
          upLoadTimeString=upLoadTimeString+result.hour.toString()+":"+result.minute.toString()+",";
        }
      }
    }
    upLoadTimeString=upLoadTimeString.substring(0,upLoadTimeString.length-1);
    console.log(upLoadTimeString);
    return upLoadTimeString;
  }

})

function timeCaluToday(today){   //分割今天的时间和数组
  var day=parseInt(today.substring(8,10));
  var hour=parseInt(today.substring(11,13));
  var min=parseInt(today.substring(14,16));
  var todayDHM={
    day:day,
    hour:hour,
    min:min
  }
  return todayDHM;
}

function timeCaluPlan(plans){
  var day=[];
  try {
    for(let i=0;i<plans.dateArray.length;i++){
      day[i]=parseInt(plans.dateArray[i].substring(7,9));
    }
  } catch (error) {
    console.log(error);
  }
  return day
}

function timeCaluPlanTimer(timer){
  var timerSperet=[]
  try {
    for(let i=0;i<timer.length;i++){
      var toolTimeSruct={
        hour:parseInt(timer[i].substring(0,2)),
        minute:parseInt(timer[i].substring(3,5))
      }
      timerSperet.push(toolTimeSruct);
    }
  } catch (error) {
    console.log(error);
  }
  return timerSperet
}

function timeDiff(Aday,Bday,Ahour,Bhour,Amin,Bmin,type){      //计算时间差
  var result={
    hour:null,
    minute:null
  }
  if(type==1){    //计算天之间的时间差
    result.hour=parseInt((((Bday-Aday)*24+Bhour-Ahour)*60+(Bmin-Amin))/60)
    result.minute=(((Bday-Aday)*24+Bhour-Ahour)*60+(Bmin-Amin))%60
  }
  else{
    result.hour=parseInt(((Bhour-Ahour)*60+(Bmin-Amin))/60)
    result.minute=((Bhour-Ahour)*60+(Bmin-Amin))%60
  }
  return result;
}

function currentTime(){        //获得今天的日期，并进行字符串的拼接
  var todaySent=timeCaluToday(util.formatTime(new Date())) //获得今天的日期
  var stringSend=' Wed'+' Aug'+' '+todaySent.day.toString()+' '+todaySent.hour.toString()+":"+todaySent.min.toString()+":"+(Math.floor(Math.random()*60)).toString()+" 2020";
  console.log(stringSend);
  return stringSend;
  
}