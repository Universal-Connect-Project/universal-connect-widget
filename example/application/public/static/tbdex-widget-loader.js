const sophtron = (function () {
  const urls = {
    prod: 'https://tbdexwidget.sophtron.com',
    preview: 'https://tbdexwidget.sophtron-prod.com',
    // legacy: 'https://sophtron.com/integration',
    // mock: 'http://localhost:8081',
    local: 'http://localhost:8080',
  };

  const defaultConf = {
    env: 'local',
    jobType: 'agg',
    auth: null,
    user_id: null,
    connection_id: null,
    bank_id: null,
    provider: null,
    onInit: null,
    onShow: null,
    onClose: null,
    onSelectBank: null,
    onLogin: null,
    onLoginSuccess: null,
    onMfa: null,
    onFinish: null, // widget closes if this handler returns true
    onError: null,
  };

  let oldOverflow;
  const state = {
    config: {},
    shown: false,
    widgetFrame: null,
  };

  function hide() {
    state.shown = false;
    if (state.widgetFrame) {
      state.widgetFrame.style.display = 'none';
      (document.body.style.overflow = oldOverflow), window.parent.focus();
    }
  }

  function reload() {
    state.widgetFrame.src = getWidgetUrl(state.config);
  }

  function onMessage(message) {
    // console.log(message.data)
    switch (message.data.type) {
      case 'message':
        if (message.data.error) {
          if (state.config.onError) {
            state.config.onError({
              _type: 'onError',
              error: message.data.error,
            });
          }
          break;
        }
        switch (message.data.event) {
          case 'CHALLENGED':
            if (state.config.onMfa) {
              state.config.onMfa({
                _type: 'onMfa',
                ...message.data,
              });
            }
            break;
          case 'LOGIN':
            if (state.config.onLogin) {
              state.config.onLogin({
                _type: 'onLogin',
                ...message.data,
              });
            }
            break;
          case 'LOGIN_SUCCESS':
            if (state.config.onLoginSuccess) {
              state.config.onLoginSuccess({
                _type: 'onLoginSuccess',
                ...message.data,
              });
            }
            break;
          case 'SELECT_INSTITUTION':
            if (state.config.onSelectBank) {
              state.config.onSelectBank({
                _type: 'onSelectBank',
                ...message.data,
              });
            }
            break;
          case 'SUCCEEDED':
          case 'FAILED':
            if (state.config.onFinish) {
              if (
                state.config.onFinish({
                  _type: 'onFinish',
                  ...message.data,
                })
              ) {
                onMessage({ data: { type: 'action', action: 'close' } });
              }
            }
            break;
          case 'INIT':
          case 'INSTITUTION_LIST':
            break;
        }
        break;
      case 'action':
        switch (message.data.action) {
          case 'close':
            hide();
            reload();
            if (state.config.onClose) {
              state.config.onClose({
                _type: 'onClose',
              });
            }
            break;
          case 'show':
            if (state.config.onShow) {
              state.config.onShow({
                _type: 'onShow',
              });
            }
            break;
          case 'init':
            if (state.config.onInit) {
              state.config.onInit({
                _type: 'onInit',
                env: state.config.env,
                action: state.config.jobType
              });
            }
            break;
        }
        break;
    }
  }

  function getWidgetUrl(conf) {
    var url = urls[conf.env];
    if(!url && conf.env.startsWith('http')){
      url = conf.env
    }
    if (!url) {
      console.log('Expected envs: ');
      console.log(Object.keys(urls));
      throw Error(`Invalid env ${conf.env}`);
    }
    url = url.trimEnd('/')
    let ret = `${url}/?job_type=${conf.jobType}&auth=${conf.auth}`;
    if(conf.connection_id){
      ret += `&connection_id=${conf.connection_id}`
    }else if(conf.bank_id){
      ret += `&bankId=${encodeURIComponent(conf.bank_id)}`
    }

    if(conf.user_id){
      ret += `&user_id=${encodeURIComponent(conf.user_id)}`
    }
    // let ret= `${url}/${conf.partner}/${action}?integration_key=${conf.integration_key || '' }&request_id=${conf.request_id || ''}`;
    // if(action == 'Refresh'){
    //     if(conf.userInstitution_id ){
    //         ret += `&userinstitution_id=${conf.userInstitution_id}`;
    //     }else{
    //         throw Error('Missing userinstitution_id param for refresh');
    //     }
    // }else if(conf.institution_id ){
    //     ret += `&institution_id=${conf.institution_id}`;
    // }else if(conf.routing_number ){
    //     ret += `&routing_number=${conf.rounting_number}`;
    // }
    return ret;
  }

  function init(conf, reinit) {
    if (state.widgetFrame) {
      if (reinit) {
        destroy();
      } else {
        return;
      }
    }
    state.config = Object.assign(state.config, defaultConf, conf);
    state.widgetFrame = document.createElement('iframe');
    state.widgetFrame.id = 'sophtron-widget-iframe';
    state.widgetFrame.src = getWidgetUrl(conf);
    state.widgetFrame.title = 'Sophtron';
    state.widgetFrame.width = '100%';
    state.widgetFrame.height = '100%';
    state.widgetFrame.style.top = '0';
    state.widgetFrame.style.left = '0';
    state.widgetFrame.style.right = '0';
    state.widgetFrame.style.bottom = '0';
    state.widgetFrame.style.position = 'fixed';
    state.widgetFrame.style.backgroundColor = 'black';
    state.widgetFrame.style.zIndex = '9999999999';
    state.widgetFrame.style.borderWidth = '0';
    state.widgetFrame.style.overflowX = 'hidden';
    state.widgetFrame.style.overflowY = 'auto';
    state.widgetFrame.style.display = 'none';
    document.body.appendChild(state.widgetFrame);

    window.addEventListener('message', onMessage, false);
    onMessage({ data: { type: 'action', action: 'init' } });
  }

  function show() {
    if (state.shown) {
      return;
    }
    state.shown = true;
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (state.widgetFrame) {
      state.widgetFrame.style.display = 'block';
      if (state.widgetFrame.contentWindow) {
        state.widgetFrame.contentWindow.focus();
      }
    }
    onMessage({ data: { type: 'action', action: 'show' } });
  }

  function destroy() {
    hide();
    if (state.widgetFrame) {
      state.widgetFrame.parentElement.removeChild(state.widgetFrame);
    }
    window.removeEventListener('message', onMessage, false);
    state.widgetFrame = null;
  }

  return {
    state,
    init,
    show,
    hide,
    reload,
    destroy,
    envs: () => Object.keys(urls),
  };
})();
