module.exports = {
  "institution": {
    "account_verification_is_enabled": true,
    "code": "gringotts",
    "forgot_password_credential_recovery_url": "https://mx.com/forgot_password",
    "forgot_username_credential_recovery_url": null,
    "guid": "INS-241266ed-803a-4841-8a8a-0f37551e8f56",
    "instructional_text": "<a href=\"https://google.com\" id=\"instructional_text\">A Test Link</a>",
    "instructional_data": {
      "title": "Test Instructions",
      "description": "<a href=\"https://google.com\" id=\"instructional_text\">A Test Link</a>",
      "steps": [
        "Go to <a href=\"https://google.com\" id=\"instructional_text_steps\">Google</a>"
      ]
    },
    "login_url": null,
    "name": "Gringotts",
    "popularity": 32671,
    "supports_oauth": false,
    "tax_statement_is_enabled": false,
    "trouble_signing_credential_recovery_url": "https://mx.com/forgot_password",
    "url": "https://gringotts.sand.internal.mx",
    "credentials": [
      {
        "credential": {
          "display_order": 1,
          "field_name": "LOGIN",
          "field_type": 3,
          "guid": "CRD-241266ed-803a-4841-8a8a-0f37551e8f56",
          "label": "Username",
          "meta_data": null,
          "optional": false,
          "options": null
        }
      },
      {
        "credential": {
          "display_order": 2,
          "field_name": "PASSWORD",
          "field_type": 1,
          "guid": "CRD-241266ed-803a-4841-8a8a-0f37551e8f56",
          "label": "Password",
          "meta_data": null,
          "optional": false,
          "options": null
        }
      }
    ]
  }
}