const { ipcRenderer, remote } = require('electron')
const { Menu, dialog } = remote
const W = remote.getCurrentWindow()
//const shell = remote.require('shell');
const partition = remote.getGlobal('partition')
// let isDeBug = remote.getGlobal('IsDebug')
function loadElectronFrame() {
  initElectronFrame()
  //  ipcRenderer.send("checkForUpdate");
}

window.loadElectronFrame = loadElectronFrame

function jumpChagre() {
  var webview = document.getElementById('wb')
  webview.send('WDCharge', '打印成功')
  //ChannelUtils.OpenPay();
  //shell.openExternal("http://www.sanguosha.com")
}

/*window.onresize = function () {
}*/

ipcRenderer.on('downloadProgress', (event, progressObj) => {
  console.log(progressObj)
})
ipcRenderer.on('resize', (e, msg) => {
  console.log('接收', msg)
})
ipcRenderer.on('create', (e, msg) => {
  console.log('create', msg)
})

const menuContextTemplate = [
  {
    label: '多开',
    submenu: [
      {
        label: '2',
        click: () => {
          ipcRenderer.send('createWindow', { partition: 2 })
        }
      },
      {
        label: '3',
        click: () => {
          ipcRenderer.send('createWindow', { partition: 3 })
        }
      },
      {
        label: '4',
        click: () => {
          ipcRenderer.send('createWindow', { partition: 4 })
        }
      },
      {
        label: '5',
        click: () => {
          ipcRenderer.send('createWindow', { partition: 5 })
        }
      },
      {
        label: '6',
        click: () => {
          ipcRenderer.send('createWindow', { partition: 6 })
        }
      },
      {
        label: '7',
        click: () => {
          ipcRenderer.send('createWindow', { partition: 7 })
        }
      },
      {
        label: '8',
        click: () => {
          ipcRenderer.send('createWindow', { partition: 8 })
        }
      }
    ]
  }
]
const menuBuilder = Menu.buildFromTemplate(menuContextTemplate)

window.onload = () => {
  console.log('window-onload:', partition)
  window.addEventListener(
    'contextmenu',
    (e) => {
      e.preventDefault()
      menuBuilder.popup({ window: W })
    },
    false
  )
}

function initElectronFrame() {
  console.log('初始化')
  var max = document.getElementById('max')
  if (max) {
    max.addEventListener('click', () => {
      //发送最大化命令
      if (W.isMaximized()) {
        W.restore()
      } else {
        W.maximize()
      }
      //最大化图形切换
      if (max.getAttribute('name') == 'max') {
        max.setAttribute('name', 'min')
      } else {
        max.setAttribute('name', 'max')
      }
      if (max.getAttribute('name') == 'max') {
        max.setAttribute('src', 'res/button_05.png')
      } else {
        max.setAttribute('src', 'res/button_01.png')
      }
    })

    max.addEventListener('mousemove', () => {
      //最大化图形切换
      if (max.getAttribute('name') == 'max') {
        max.setAttribute('src', 'res/button_06.png')
      } else {
        max.setAttribute('src', 'res/button_02.png')
      }
      // console.log("###")
    })
    max.addEventListener('mouseout', () => {
      if (max.getAttribute('name') == 'max') {
        max.setAttribute('src', 'res/button_05.png')
      } else {
        max.setAttribute('src', 'res/button_01.png')
      }
    })
  }

  var min = document.getElementById('min')
  if (min) {
    min.addEventListener('click', () => {
      //发送最小化命令
      W.minimize()
    })
  }

  var close = document.getElementById('close')
  if (close) {
    close.addEventListener('click', () => {
      dialog
        .showMessageBox(W, {
          type: 'warning',
          title: '提示',
          message: '是否确定退出游戏',
          buttons: ['ok', 'cancel']
        })
        .then((data) => {
          if (data.response == 0) {
            ipcRenderer.send('window-close', partition)
            W.close()
          }
        })
      // confirm("是否确定退出游戏") ? W.close() : void(0)
    })
  }

  let WDVerTxt = document.getElementById('WDVerSion')
  let webview = document.getElementById('wb')

  WDVerTxt.innerHTML = '三国杀' + partition
  document.title = '三国杀' + partition
  webview.partition = 'persist:sgs' + partition

  var loginURL = remote.getGlobal('LoginURL')
  var loginForm = remote.getGlobal('PackageId')
  if (remote.getGlobal('IsTest')) {
    if (loginForm == 1 || loginForm == 2) {
      webview.src = remote.getGlobal('URLOffTest')
    } else {
      webview.src = remote.getGlobal('URLLYTest')
    }
  } else {
    webview.src = loginURL[loginForm - 1]
  }

  //webview.setAttribute("IsDebug", isDeBug)
  webview.addEventListener('dom-ready', function () {
    // if (isDeBug) {
    // webview.openDevTools({ mode: 'detach' })
    // isDeBug = null
    // }
    console.log('dom-ready')
    webview.executeJavaScript(`
window.WDVerSion =  "1.0.0"
console.info('--wd --> ', window.location)
  fetch("https://cas.dobest.cn/cas/logout?url=https%3A%2F%2Fweb.sanguosha.com%2Findex.html", {
    "referrer": "https://web.sanguosha.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "no-cors",
    "credentials": "include"
  }).then(response => response.json())
    .catch(err => console.log('退出登录'))
if (window.location.pathname === '/login/air/client/h5/index') {
  console.log('加载密码管理');
  const login_form = document.querySelector('.dobest_login_form')
  let style = document.createElement('style')
  style.innerHTML = 'ul{padding:0;list-style:none;margin:0}a{text-decoration:none}a:link{color:#000}a:active,a:hover{outline:0}.pass-root{position:relative;color:#000}.hidden{visibility:hidden;opacity:0;height:0}.pass-root .more{width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:10px solid #fff}#manager{position:absolute;left:-180px;top:20px;width:192px;padding-top:5px;box-sizing:border-box;background-color:#fff;border-radius:5px;max-height:300px;overflow:auto;transition:all 1s}#manager::-webkit-scrollbar{height:12px;width:16px;background:rgba(0,0,0,.06);z-index:12;overflow:visible}#manager::-webkit-scrollbar-thumb{width:10px;background-color:#434953;border-radius:10px;z-index:12;border:4px solid transparent;background-clip:padding-box;transition:background-color .32s ease-in-out;margin:4px;min-height:32px;min-width:32px}#manager::-webkit-scrollbar-thumb:hover{background-color:#4e5157}#manager::-webkit-scrollbar-corner{background:#202020}#manager_add{display:block;margin-top:5px;padding:6px;border-top:1px solid #bfcfe4}.manager_account{display:flex;flex-direction:column;align-items:stretch;justify-content:center}.manager_account li{padding:4px 10px}.manager_account li:hover .button--danger{display:inline-block}#manager_add:hover,.manager_account li:hover{background-color:#ddd;border-radius:4px}.button--danger{display:none;float:right;box-sizing:border-box;border-radius:4px;color:#fff;background-color:#f56c6c;border:1px solid #f56c6c;cursor:pointer}'
  document.getElementsByTagName('head')[0].appendChild(style)
  let div = document.createElement('div')
  let html = '<div class="pass-root"><div class="more"></div><div id="manager" class="hidden"><ul class="manager_account"></ul><a id="manager_add" href="javascript:;">添加当前账号</a></div></div>'
  div.innerHTML = html
  div.style.float = 'left'
  div.style.position = 'absolute'
  div.style.left = '295px'
  div.style.top = '34px'
  login_form.appendChild(div)

  function getData() {
    let data = window.localStorage.getItem('managerData')
    if (data != null) {
      return JSON.parse(data)
    } else {
      return []
    }
  }
  function saveData(list) {
    window.localStorage.setItem('managerData', JSON.stringify(list))
  }
  function load() {
    const ul = document.querySelector('.manager_account')
    ul.innerHTML = ''
    if (userlist) {
      userlist.forEach((item, index) => {
        let li = document.createElement('li')
        li.dataset.index = index
        li.innerHTML = '<span data-index="'+index+'">'+item.account+'</span><button class="button--danger" data-index="'+index+'">X</button>'
        li.addEventListener('click', clickCb)
        ul.appendChild(li)
      })
    }
  }
  function remove(index) {
    userlist.splice(index, 1)
    saveData(userlist)
    load()
  }
  function clickCb(e) {
    const target = e.target
    switch (target.nodeName) {
      case 'LI':
        console.log(userlist[target.dataset.index])
        $('.dobest_username input')[0].value = userlist[target.dataset.index].account
        $('.dobest_pwd input')[0].value = userlist[target.dataset.index].password
        $('#manager').toggleClass('hidden')
        break
      case 'SPAN':
        console.log(userlist[target.dataset.index])
        $('.dobest_username input')[0].value = userlist[target.dataset.index].account
        $('.dobest_pwd input')[0].value = userlist[target.dataset.index].password
        $('#manager').toggleClass('hidden')
        break
      case 'BUTTON':
        remove(target.dataset.index)
        break
      default:
        break
    }
  }
  document.querySelector('#manager_add').addEventListener('click', () => {
    let account = $('.dobest_username input')[0].value
    let password = $('.dobest_pwd input')[0].value
    if (!account) return
    userlist.push({ account, password })
    saveData(userlist)
    load()
    setTimeout(() => {
      $('#manager').toggleClass('hidden')
    }, 1000)
  })
  document.querySelector('.more').addEventListener('click', () => {
    $('#manager').toggleClass('hidden')
  })
  let userlist = getData()
  load()
}

`)
  })
}
