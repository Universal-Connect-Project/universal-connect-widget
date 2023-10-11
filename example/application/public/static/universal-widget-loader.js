const sophtron = (function () {
  const urls = {
    prod: 'https://universalwidget.sophtron.com',
    preview: 'https://universalwidget.sophtron-prod.com',
    pre: 'https://universalwidget.sophtron-prod.com',
    local: 'http://localhost:8080',
  };

  const defaultConf = {
    env: 'pre',
    jobType: 'agg',
    user_id: null,
    auth: null,
    connection_id: null,
    bank_id: null,
    provider: null,
    onEvent: null,
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
    if (state.widget) {
      state.widget.style.display = 'none';
      (document.body.style.overflow = oldOverflow), window.parent.focus();
    }
  }

  function reload() {
    state.widgetFrame.src = getWidgetUrl(state.config);
  }

  function onMessage(message) {
    if(message.type.startsWith('vcs')){
      message = {
        event: message.type,
        type: 'message',
        connection_id: message.metadata.member_guid,
        data: {...message.metadata, id: message.metadata.member_guid},
      }
    }
    // console.log(message)
    switch (message.type) {
      case 'message':
        if (message.error) {
          if (state.config.onError) {
            state.config.onError({
              _type: 'onError',
              error: message.error,
            });
          }
          break;
        }
        switch (message.event) {
          case 'CHALLENGED':
            if (state.config.onMfa) {
              state.config.onMfa({
                _type: 'onMfa',
                ...message,
              });
            }
            break;
          case 'vcs/connect/enterCredentials':
          case 'LOGIN':
            if (state.config.onLogin) {
              state.config.onLogin({
                _type: 'onLogin',
                ...message,
              });
            }
            break;
          case 'LOGIN_SUCCESS':
            if (state.config.onLoginSuccess) {
              state.config.onLoginSuccess({
                _type: 'onLoginSuccess',
                ...message,
              });
            }
            break;
          case 'vcs/connect/selectedInstitution':
          case 'SELECT_INSTITUTION':
            if (state.config.onSelectBank) {
              state.config.onSelectBank({
                _type: 'onSelectBank',
                ...message,
              });
            }
            break;
          case 'vcs/connect/memberConnected':
          case 'SUCCEEDED':
          case 'FAILED':
            if (state.config.onFinish) {
              if (state.config.onFinish({
                  _type: 'onFinish',
                  ...message,
                })
              ) {
                onMessage({ type: 'action', action: 'close' });
              }
            }
            break;
          case 'INIT':
          case 'INSTITUTION_LIST':
          case 'vcs/connect/stepChange':
          case 'vcs/connect/institutionSearch':
          case 'vcs/connect/loaded':
          case 'vcs/connect/memberStatusUpdate':
          case 'vcs/connect/submitMFA':
          case 'vcs/connect/stepChange':
            if(state.config.onEvent){
              state.config.onEvent(message)
            }
            break;
        }
        break;
      case 'action':
        switch (message.action) {
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
      default:
        if(state.config.onEvent){
          state.config.onEvent(message)
        }
    }
  }

  function messageHandler(msg){
    if(typeof msg.data === 'string'){
      try{
        return onMessage(JSON.parse(msg.data));
      }catch{}
    }
    return onMessage(msg.data);
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
    if (state.widget) {
      if (reinit) {
        destroy();
      } else {
        return;
      }
    }
    state.config = Object.assign(state.config, defaultConf, conf);
    state.widget = document.createElement('p');
    state.widget.style['display'] = 'flex';
    state.widget.style['top'] = '0';
    state.widget.style['min-height'] = '600px';
    state.widget.style['text-align'] = 'center';
    state.widget.style['justify-content'] = 'center';
    state.widgetFrame = document.createElement('iframe');
    state.widgetFrame.id = 'sophtron-widget-iframe';
    state.widgetFrame.src = getWidgetUrl(conf);
    state.widgetFrame.title = 'Sophtron';
    state.widgetFrame.width = '100%';
    state.widgetFrame.height = '100%';
    state.widgetFrame.style.top = '0';
    state.widgetFrame.style.bottom = '0';
    state.widgetFrame.style.magin = 'auto';
    state.widgetFrame.style['max-width'] = '400px';
    state.widgetFrame.style['min-height'] = '600px';
    state.widgetFrame.style.position = 'fixed';
    state.widgetFrame.style.backgroundColor = 'white';
    state.widgetFrame.style.zIndex = '9999999999';
    state.widgetFrame.style.borderWidth = '0';
    state.widgetFrame.style.overflowX = 'hidden';
    state.widgetFrame.style.overflowY = 'auto';
    state.widgetFrame.style.display = 'block';
    state.widget.appendChild(state.widgetFrame);
    document.body.appendChild(state.widget);

    window.addEventListener('message', messageHandler, false);
    onMessage({ type: 'action', action: 'init'});
  }

  function show() {
    if (state.shown) {
      return;
    }
    state.shown = true;
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (state.widget) {
      state.widget.style.display = 'flex';
      if (state.widgetFrame.contentWindow) {
        state.widgetFrame.contentWindow.focus();
      }
    }
    onMessage({ type: 'action', action: 'show' });
  }

  function destroy() {
    hide();
    if (state.widget) {
      state.widget.parentElement.removeChild(state.widget);
    }
    window.removeEventListener('message', messageHandler, false);
    state.widget = null;
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
