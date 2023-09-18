function handle_oauth(redirect, app_url, post_message, member_guid, error_reason){
  // If this is an app, try to automatically redirect them to the app
  if(redirect){
    window.location = app_url;
  }
  if (window.opener && window.opener.location) {
    window.opener.postMessage({
      mx: true,
      type: post_message,
      metadata: {
        member_guid,
        error_reason,
      }
    }, '*')
  }
  var closeButton = document.getElementById('oauth-close-window')
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      window.location = app_url
    })
  }
}