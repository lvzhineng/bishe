//index.js
//获取应用实例

var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    token: '',
    dialogVisible: false,
    buttons: [{ text: "确定" }],
    username: function (e) {
      var that = this;
      that.setData({
        username: e.detail.value
      })
    },
    password: function (e) {
      var that = this;
      that.setData({
        password: e.detail.value
      })
    },
    showTopTips: false,
    errorMsg: ""
  },
  tapDialogButton() {

  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },

  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用  
    var that = this;
    var username = e.detail.value.username;
    var password = e.detail.value.password;
    // 判断账号是否为空和判断该账号名是否被注册  
    wx.request({
      url: "http://localhost:8080/dormitory/login",
      data: { 'userName': username, 'userPwd': password, 'userType': "0" },
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      success: function (res) {
        
        if (res.data.code == 500) {
          that.dialogVisible = true
          wx.showModal({
            title: '登录失败！',
            content: '账号密码错误',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/student/index/index?token=' + res.data.data.token,
          })
        }
        /* if(res.data.role == "admin"){
          wx.navigateTo({
            url: '/pages/admin/index/index?username='+res.data.username,
          })
        }else if(res.data.role == "teacher"){
          wx.navigateTo({
            url: '/pages/teacher/index/index?username=' + res.data.username,
          })
        } else if (res.data.role == "student"){
          wx.navigateTo({
            url: '/pages/student/index/index?username=' + res.data.username,
          })
        } */
      }
    })
  }

})



