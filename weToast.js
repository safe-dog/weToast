/**
 * weToast::v0.1
 * 微信小程序自定义通知信息模块
 * 作者：safe-dog
 * 网站：safedog.cc
 * 项目：https://github.com/safe-dog/weToast
 */

// 默认配置
var TOAST_CONFIG = {
  // 动画时间
  duration: 200,
  // 隐藏卡片时间
  delay: 2000,
  // 默认卡片背景颜色
  defaultBG: 'rgba(76, 175, 80, 0.9)',
};

// 消息队列
var MSG_QUEUE = [];

// 是否正在显示
var IS_SHOW = false;

// 图标列表
var ICONS = {
  error: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfhBgIQJgTsELvhAAABZElEQVRIx62VPUoDURSFv4kYTOEEi4BBbAKSKLZTBWzSuobUWYmEdDauwAVE0w0EJViMkFKwzwLEn7R6LHxKnLkvTuKc7j3OPdz/G+CBOnQ44ZgqLzwwYRyMyQdFimUjVvSXcUOJliNRw2/eVT50LWPUz2kuSX1lBFYxl6T+es7bgaixhrkkl05hZP4jl0AiV/c0QtAg9TcAhRlmBGTaZgigkkYLfyOVAHSV4saoari2D6CKZu49UwVA7SwVdczodgBUc68agFoWEZ2ZAo/aAlBTUhNAdTuP6M6T4euvqF2hQ819As/y4fy7XVXW1EdCy9BzAj0/ZZkHU5V/Bu3CL+DLwVzhQg42dGPTSkw8y+EgeHVVOITgnVOePLvPFG796oM6gHbtEKrGbzvViW/aBtCRIWDMwq0xC/faBNAwxY3zT+OlAu1lmJFvH+RDokI2UgE7sYCtXMBd+PdlKuQ2OpGVrvMn2ArMk+TCghYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDYtMDJUMTY6Mzg6MDQrMDg6MDCD+FtdAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA2LTAyVDE2OjM4OjA0KzA4OjAw8qXj4QAAAABJRU5ErkJggg==',
  info: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfhBgIQJgTsELvhAAAA+klEQVRIx6WVsY3CQBBF39CAW8DRXWACJMeXuAzacVEmIEEugToQboB/ga2T0O3MLuxPZ/737Oz3X8OBBgZ+6GhYuHHlYhfKoF6T0pjU58h7zYoxa+/TTyrDKU0fC+mSNNbR/0sUD58+iFq36Qg6utV2pRNsfu3wMGu7dx/foK+g3gOubVbcw+pkangUWjSJHTlzZgWGsH4w4xB2ZLy/9jz9BtODJtA3A/TE3IbtIx8L7Fhql3irFbjWCpQmnYOcE/NLtIVzxQBnMn8jEBqppygPPIF5M1GQSB2oc6vt31GCTPTHfw33ylR+W2JM3knlywTVb+Mm8tbr/AsiKsvZqvomQwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNi0wMlQxNjozODowNCswODowMIP4W10AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDYtMDJUMTY6Mzg6MDQrMDg6MDDypePhAAAAAElFTkSuQmCC',
  success: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfhBgIQJgTsELvhAAABYklEQVRIx62VMUsDQRCFvz1IkATTiFoYwUYIJmCljZ2gYFIopNBO8A/4F8TWWmsrG5s09lYhaBML8QeoRbS2CcKzOHPJXfY2e8bX3Qzv3cy8YdaQCi2zSZkiX7zxYF7xhxrqaBwd1X3ITbnRdJEX1NZktDVvp9c8yAPUpqOPSJhB8fQyTDnEovmAAECGVmY6tGR8J+9wxIBy9P/w/xD5ANjNQHhnjhKf0fcOYN06O140C6Cz4Xaiojf9UQUArYwG/f2/1wyAVuNhXwfulAfQWjIRUPYY3S37pg9a5zmZCigmIkuUeIpFrjky36ANuhZxncYqugFQQd0ochnum7bsvY3PoBKTuPilb6cNx+bCUOJcYZV76dO170El1uSBy560TYwkdOi0twOoYU2FjRzLjTqgXEryRFeahNzU9yAUMF7XOIm2zD/cxKFZWa9ydXyps0hUrTVN+TLh54jrbYxEMrzOPzpcj+/i+lSAAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA2LTAyVDE2OjM4OjA0KzA4OjAwg/hbXQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNi0wMlQxNjozODowNCswODowMPKl4+EAAAAASUVORK5CYII=',
  warning: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfhBgIQJgTsELvhAAABdUlEQVRIx7WVMUvDUBSFz32KBBo7FEXdChW6hNK52O4VhdKt4C/oD/B/dHMt2A6uCtK5gk5CFYeCrnVoNzN7HBJaNO/mxYpnSeDc77z7Xm4S4H9Ewzb7nDPSnH22abLCFY5o14gVF5zngOkaMK/jVWZT1Y7XM+IkWU/iwS9wkgwiTmLcx4elqcvl3ZnF3ZZwtX7PuspF7N5a3d4KLyptXsX+o+IXgWg4zpXHshNf9xU/4uipB/Ucd6DLMwACdTB24VJgADRUe4+ugIYBUEspEEdAzQAo/yGgbADkUgo2HAE5A2CRUrDpCFgYAJM/BEwMgHFKwZYjYCwAS3jFujoUgILPtQOMAYToKvaDiIgI3hW/K9Gk0Vcm/T6q40zx/fhtlBCdNdrvSLj6IgHXOEluAS8AgGMcJLwbnH4bU+aWv5EsmjM5vyyoe/2pGQvWTdHjMAM+pJdyMmw68GaG42WLUws6ZStZm/K+8wgVlOAjxBue5M5e9QVEd3pTUnO/GQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNi0wMlQxNjozODowNCswODowMIP4W10AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDYtMDJUMTY6Mzg6MDQrMDg6MDDypePhAAAAAElFTkSuQmCC'
}

// 隐藏卡片时间器
var HIDDEN_TIMMER = null;

class weToast {
  /**
   * 初始化
   * page = Page对象(this)
   */
  constructor (page) {
    this.page = page;
    // this.setData = page.setData.bind(page);
    page.weToastHideHandler = this._hide.bind(this);

    // 配置动画
    const animation = wx.createAnimation({
      duration: TOAST_CONFIG['duration'],
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
      icon: '',
      title: '',
      content: '',
      boxBG: TOAST_CONFIG['defaultBG'],
      animation: this._hideAnimation
    });
  }

  setData (opt) {
    this.page.setData({
      weToast: opt
    })
  }

  /**
   * 添加消息到队列
   * opt = {content, title, style}
   */
  _add (opt) {
    MSG_QUEUE.push({
      icon: ICONS[opt['icon']],
      title: opt['title'],
      content: opt['content'],
      boxBG: opt['style'] || TOAST_CONFIG['defaultBG'],
      animation: this._showAnimation
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

    this.setData(msg);
    IS_SHOW = true;

    HIDDEN_TIMMER = setTimeout(
      this._hide.bind(this),
      TOAST_CONFIG['delay'] + TOAST_CONFIG['duration']
    );
  }

  /**
   * 隐藏消息
   */
  _hide () {
    if (HIDDEN_TIMMER) {
      clearTimeout(HIDDEN_TIMMER);
    }
    this.setData({
      title: '',
      content: '',
      animation: this._hideAnimation
    });
    // 200ms后调用_show
    setTimeout(() => {
      IS_SHOW = false;
      this._show();
    }, TOAST_CONFIG['duration']);
  }

  /**
   * 成功消息
   */
  success (content, title = '') {
    this._add({
      title, content,
      icon: 'success',
      style: 'rgba(76, 175, 80, 0.9)'
    })
  }

  /**
   * 提示消息
   */
  info (content, title = '') {
    this._add({
      title, content,
      icon: 'info',
      style: 'rgba(0, 188, 212, 0.9)'
    })
  }

  /**
   * 警告消息
   */
  warning (content, title = '') {
    this._add({
      title, content,
      icon: 'warning',
      style: 'rgba(255, 152, 0, 0.9)'
    })
  }

  /**
   * 错误消息
   */
  error (content, title = '') {
    this._add({
      title, content,
      icon: 'error',
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