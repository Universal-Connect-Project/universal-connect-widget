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


// def build_ui_scheme_redirect(ui_scheme, member_guid, error_reason = nil)
//     escaped_scheme = CGI.escapeHTML(ui_scheme)
//     # member guid can be nil in scenarios where the user wasn't able to be
//     # identified.
//     escaped_member_guid = member_guid.present? ? CGI.escapeHTML(member_guid) : nil
//     query_params = {
//       :status => error_reason.nil? ? "success" : "error",
//       :member_guid => escaped_member_guid || "", # default member to empty string so it stays in the query params.
//       :error_reason => error_reason # leave this nil, only send it when it exists.
//     }.compact
// ​
//     uri = URI("#{escaped_scheme}://oauth_complete")
//     uri.query = URI.encode_www_form(query_params)
//     uri
//   end