# MEMBERS

```
  # Creates an association between a User and an Institution
  #
  # ====url Endpoint URL
  #   POST /members
  #
  # ====renders
  #   [JSON] success JSON encoded member (see MembersController#show)
  #   [JSON] error JSON encoded error message
  #
  # ====request_fields
  #   [String[required]] institution_guid
  #   [Array[required]] credentials
  #
  # ====example_requests
  #   JSON example request with
  #     {
  #       "background_aggregation_is_disabled":false,
  #       "institution_guid":"INS-00000000-0000-0000-0000000000000000",
  #       "user_guid":"USR-00000000-0000-0000-0000000000000000",
  #       "credentials":[
  #         {
  #           "guid":"CRD-00000000-0000-0000-0000000000000000",
  #           "value":"user_entered_string"
  #         }
  #       ]
  #     }
  #
  #   JSON encoded error messages
  #     [{"message":"an error seems to have occurred"}]
  #
  # ====response_codes
  #   [200] success Request succeeded
  #   [500] failure Request failed
  #
```



