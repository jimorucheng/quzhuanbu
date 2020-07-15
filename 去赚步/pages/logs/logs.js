//logs.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfoNickName: '',
    userInfoAvatarUrl: '',
    cumulative: false,
    accumulated_income:0,
    accumulated_step:0,
    balance: 0, 
    num:0,
    price:0,
    friendListArray:[],
    openid:''
  },
  onLoad: function() {
    var that = this; 
    //获取微信存储的openid
    that.setData({ openid: wx.getStorageSync('openid')});
    //查看是否授权
    wx.getSetting({
      success: function(res) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            userInfoNickName: wx.getStorageSync('nickName'),
            userInfoAvatarUrl: wx.getStorageSync('avatarUrl'),
          })
        } else {
          that.setData({
            userInfoNickName: '',
            userInfoAvatarUrl: '/images/userInfoPic.png'
          })
        }
      }
    });     
  }, 
  //onshow每次进入这个页面都会执行：onshow生命周期刷新
  onShow(){
    var that = this;
    that.getMesageData();   
  },
  getMesageData(){
    var that = this;
    //获取接口信息  赚步页面内容
    wx.request({
      url: 'https://mabao.beijingjiaodian.com/wx/uinfo.html',
      // data: { openid: that.data.openid},
      data: { openid: wx.getStorageSync('openid') },
      //data: { openid:'oRlVa5N3lB73uUNNs0mB42_W847Y'},
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(res) {
        // console.log(that.data.openid)
        //console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            accumulated_income: res.data.data.accumulated_income,
            balance: res.data.data.balance / 100,
            accumulated_step: res.data.data.accumulated_step + wx.getStorageSync('steps'),
            num: res.data.data.num,
            price: res.data.data.price / 100,
            friendListArray: res.data.data.info
          })
          if (that.data.friendListArray.length == 1) {
            that.setData({ cumulative: false })
          } else {
            that.setData({ cumulative: true })
          }
        }
      }, fail(err) {
        console.log(err)
      }
    })
  },
  //下拉刷新
  onPullDownRefresh:function(){
    var that = this;
    that.getMesageData();
    wx.stopPullDownRefresh();  
  },
  //用户提现
  cashWithdrawal(){
    var balance = this.data.balance;
    if (balance < 2){
      wx.showModal({
        title: '温馨提示',
        content: '余额超过2元才可提现哦~',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“关闭提现”');
          }
        }
      })
    }else{
       //去提取现金的页面
      //微信存储balance
      wx.setStorageSync('balance', balance);
       wx.navigateTo({
         url: '../cash/cash',
       })
    } 
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '健步筑梦，赚步聚财',
      path: '/pages/start/start?shareid=' + wx.getStorageSync('openid'),
      imageUrl: 'http://img.xindaikuangren.com/shareShowPg1.png',
      success: function (res) {
        console.log('转发成功')
        // 转发成功
      },
      fail: function (res) {
        console.log('转发失败')
        // 转发失败
      }
    }
  },
  //分享页面到微信朋友
  openShareTap() {
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    wx.hideShareMenu();
  },
})
// 因为小程序都是异步操作，所以很多时候，可能会造成服务器相应慢的问题，就是说你在一个页面上传了图片，在另一个页面展示的时候会有延迟，造成闪烁