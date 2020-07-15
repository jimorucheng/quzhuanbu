//start.js  启动页，授权页面

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
  },

  onLoad: function (options) {
    var shareid = '';
    if (options.shareid){
      //存储分享的shareid
      shareid = options.shareid;
    }else{
      shareid = '';
    }
    wx.setStorageSync('shareid', shareid );
   // console.log(wx.getStorageSync('shareid'))
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //用户已经授权,可以直接调用 getUserInfo 获取头像昵称，
          wx.getUserInfo({
            success: resUseInfo => {
              //console.log(resUseInfo)                         
            }
          })
          //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页              
          wx.switchTab({
            url: '../index/index',
          })
          // wx.getUserInfo({
          //   success: function (res) {
          //     // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
          //     // 根据自己的需求有其他操作再补           
          //   }
          // });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      // console.log("用户的信息如下：");
      //console.log(e.detail.userInfo);
      //存储用户信息
      wx.setStorageSync('nickName', e.detail.userInfo.nickName);
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      wx.switchTab({
        url: '../index/index',
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '温馨提示',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})