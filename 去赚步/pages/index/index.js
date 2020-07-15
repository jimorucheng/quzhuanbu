//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    steps: 0,
    isButtonShow: false,
    stepShow: false,
    isSignInSuceess: true,
    isAllSevenDay: true,
    step1000: true,
    step2500: true,
    step5000: true,
    step7000: true,
    step10000: true,
    yesdaystep: 0,
    maskBox1: false,
    oneDayMoney: 0,
    weekDayMoney: 0,
    reach: 0
  },
  onLoad: function() {
    //
    var count = 1;
    //获取屏幕高度
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.log(res)
    //     this.setData({ "wh": res.windowHeight })
    //   }
    // })
    //运动步数获取
    this.getWeRunData();
  },
  //步数获取
  getWeRunData() {
    var that = this;
    // 登录
    //1、调用小程序API:wx.login获取code和sessionKey；
    wx.login({
      success: res => {
        // console.log(res.code)
        wx.request({
          url: "https://mabao.beijingjiaodian.com/Wx/onlogin.html",
          data: {
            code: res.code
          },
          method: "GET",
          dataType: "json",
          success: function(re) {
            //console.log(re)
            //微信存储openid
            wx.setStorageSync('openid', re.data.data.openid)
            if (re.data.code == 200) {
              //console.log(re.data.data.session_key)
              //re.data.session_key;
              //2、调用小程序API: wx.getWeRunData获取微信运动数据（加密的）；
              wx.getWeRunData({
                success(resRun) {
                  //console.log(resRun)
                  //3、解密步骤2的数据；
                  wx.request({
                    url: 'https://mabao.beijingjiaodian.com/Wx/decrypt.html',
                    data: {
                      encryptedData: resRun.encryptedData,
                      iv: resRun.iv,
                      sessionKey: re.data.data.session_key
                    },
                    method: "GET",
                    success: function(resDecrypt) {
                      // console.log(resDecrypt)
                      //授权成功
                      that.setData({
                        isButtonShow: false
                      })
                      //判断达标阶段
                      var stepData = resDecrypt.data.data[1].step;
                      if (stepData >= 10000) {
                        that.setData({
                          step10000: false
                        })
                      } else {
                        that.setData({
                          step10000: true
                        })
                      }
                      if (stepData >= 7000) {
                        that.setData({
                          step7000: false
                        })
                      } else {
                        that.setData({
                          step7000: true
                        })
                      }
                      if (stepData >= 5000) {
                        that.setData({
                          step5000: false
                        })
                      } else {
                        that.setData({
                          step5000: true
                        })
                      }
                      if (stepData >= 2500) {
                        that.setData({
                          step2500: false
                        })
                      } else {
                        that.setData({
                          step2500: true
                        })
                      }
                      if (stepData >= 1000) {
                        that.setData({
                          step1000: false
                        })
                      } else {
                        that.setData({
                          step1000: true
                        })
                      }
                      //步数
                      that.setData({
                        steps: resDecrypt.data.data[1].step,
                        stepShow: true,
                        yesdaystep: resDecrypt.data.data[0].step
                      })
                      //存储当前步数
                      wx.setStorageSync('steps', resDecrypt.data.data[1].step)
                      //步数更新
                      wx.request({
                        url: 'https://mabao.beijingjiaodian.com/wx/update.html',
                        data: {
                          todaystep: resDecrypt.data.data[1].step,
                          openid: wx.getStorageSync('openid'),
                          yesdaystep: resDecrypt.data.data[0].step
                        },
                        method: "GET",
                        success: function(suRes) {
                          console.log('更新成功');
                        }
                      })
                      //显示用户签到达标或者不达标
                      that.reacheState();
                      //传值给后台分享的用户信息
                      that.getUserInfoMessage();
                    }
                  })
                },
                fail(res) {
                  that.setData({
                    isButtonShow: true
                  })
                }
              })
            }
          },
          fail: function(err) {
            console.log(err)
          },
          complete: function() {}
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  //分享获取用户信息
  getUserInfoMessage() {
    wx.request({
      url: 'https://mabao.beijingjiaodian.com/Wx/register.html',
      data: {
        nickname: wx.getStorageSync('nickName'),
        headicon: wx.getStorageSync('avatarUrl'),
        todaystep: this.data.steps,
        openid: wx.getStorageSync('openid'),
        shareid: wx.getStorageSync('shareid')
      },
      method: "GET",
      success(reShare) {
        //console.log(33)
        //console.log(reShare)
      }
    })
  },
  //显示用户签到达标或者不达标
  reacheState() {
    var that = this;
    wx.request({
      url: 'https://mabao.beijingjiaodian.com/wx/reache.html',
      data: {
        step: that.data.steps,
        openid: wx.getStorageSync('openid')
      },
      method: "GET",
      success(resState) {
        //console.log(resState)
        if (resState.data.code == 200) {
          if (resState.data.data.status == 1) {
            if (resState.data.data.state == 1) {
              if (resState.data.data.stateArr.qiprice == '') {
                that.setData({
                  maskBox1: true,
                  isSignInSuceess: true,
                  isAllSevenDay: false,
                  oneDayMoney: resState.data.data.stateArr.price / 100,
                  reach: resState.data.data.reach
                })
              } else {
                that.setData({
                  maskBox1: true,
                  isSignInSuceess: true,
                  isAllSevenDay: false,
                  oneDayMoney: resState.data.data.stateArr.price / 100,
                  weekDayMoney: resState.data.data.stateArr.qiprice / 100
                })
              }
            } else {
              that.setData({
                maskBox1: true,
                isSignInSuceess: false,
              })
            }
          } else {
            that.setData({
              maskBox1: false,
            })
          }
        } else {
          that.setData({
            maskBox1: false,
          })
        }
      }
    })
  },
  //打开设置授权页
  openSettingTap: function() {
    var that = this;
    wx.openSetting({
      success: function(resOpen) {
        //console.log(resOpen)
        if ((resOpen.authSetting["scope.werun"] == false) || (resOpen.authSetting["scope.userInfo"] == false)) {
          //console.log(11)
          that.setData({
            isButtonShow: true
          })
        } else {
          that.setData({
            isButtonShow: false
          })
          that.getWeRunData();
        }
      }
    })
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '健步筑梦，赚步聚财',
      path: '/pages/start/start?shareid=' + wx.getStorageSync('openid'),
      imageUrl: 'http://img.xindaikuangren.com/shareShowPg1.png',
      success: function(res) {
        console.log('转发成功')
        // 转发成功
      },
      fail: function(res) {
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
  //关闭弹窗
  close() {
    this.setData({
      maskBox1: false
    })
  }
})