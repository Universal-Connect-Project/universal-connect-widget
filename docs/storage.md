 ## Persistent layer of the widget - Private component

 The widget server should ideally operate on a stateless mode, Most of the state information can be persisted in the user's browser session.

 however it appears that there are some information has to be persisted, for instance, the wiget will also have to receive provider's server callback and oauth redirect which cannot access the browser session, so a storage-layer is required by the wiget, it can be as simple as a redis cache, the persisted data only needs to be available for the length of the user session, 
 
 but in a provider-hosted scenarios, as mutliple clients are accessing the same server, it is then necessary to integrate with the Auth service in order to achieve client access isolation, to ensure there is no potential cross-client access.
