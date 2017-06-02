/**
 * weToast::v0.1
 * 微信小程序自定义通知信息模块
 * 作者：safedog.cc
 */

// 默认配置
var TOAST_CONFIG = {
  // 隐藏卡片时间
  delay: 2000,
  // 默认卡片背景颜色
  defaultBG: 'rgba(76, 175, 80, 0.9)',
};

// 消息队列
var MSG_QUEUE = [];
// 是否正在显示
var IS_SHOW = false;

class weToast {
  /**
   * 初始化
   * page = Page对象(this)
   */
  constructor (page) {
    this.setData = page.setData.bind(page);

    // 配置动画
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    });

    // 显示动画数据
    animation.bottom(100).opacity(1).scale(1).step();
    this._showAnimation = animation.export();

    // 隐藏动画数据
    animation.bottom(-100).opacity(0).scale(0).step();
    this._hideAnimation = animation.export();

    // 初始化数据
    this.setData({
      weToastTitle: '',
      weToastContent: '',
      weToastBoxBG: TOAST_CONFIG['defaultBG'],
      weToastAnimation: this._hideAnimation
    });
  }

  /**
   * 添加消息到队列
   * opt = {content, title, style}
   */
  _add (opt) {
    MSG_QUEUE.push({
      weToastTitle: opt['title'],
      weToastContent: opt['content'],
      weToastBoxBG: opt['style'] || TOAST_CONFIG['defaultBG'],
      weToastAnimation: this._showAnimation
    });
    // 如果没在显示，则显示
    if (!IS_SHOW) {
      this._show();
    }
  }

  /**
   * 显示消息
   */
  _show () {
    const msg = MSG_QUEUE.shift();
    if (!msg) return;

    IS_SHOW = true;
    this.setData(msg);

    setTimeout(this._hide.bind(this), TOAST_CONFIG['delay']);
  }

  /**
   * 隐藏消息
   */
  _hide () {
    this.setData({
      weToastTitle: '',
      weToastContent: '',
      weToastAnimation: this._hideAnimation
    });
    // 200ms后调用_show
    setTimeout(() => {
      IS_SHOW = false;
      this._show();
    }, 200);
  }

  /**
   * 成功消息
   */
  success (content, title = '') {
    this._add({
      title, content,
      style: 'rgba(76, 175, 80, 0.9)'
    })
  }

  /**
   * 提示消息
   */
  info (content, title = '') {
    this._add({
      title, content,
      style: 'rgba(0, 188, 212, 0.9)'
    })
  }

  /**
   * 警告消息
   */
  warning (content, title = '') {
    this._add({
      title, content,
      style: 'rgba(255, 152, 0, 0.9)'
    })
  }

  /**
   * 错误消息
   */
  error (content, title = '') {
    this._add({
      title, content,
      style: 'rgba(244, 67, 54, 0.9)'
    })
  }

  /**
   * 设置卡片停留时间
   * 默认2000ms
   */
  setDelay (delay = 2000) {
    TOAST_CONFIG['delay'] = delay;
  }
}

module.exports = weToast;