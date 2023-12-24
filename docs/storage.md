 ## Persistent layer of the widget - Private component

The widget server should ideally operate on a stateless mode. Most of the state information can be persisted in the user's browser session.

However, it appears that there is some information that needs to be persisted. For instance, the widget will also have to receive provider's server callback and oauth redirect, which cannot access the browser session. Because of this, a storage-layer is required by the widget. It can be as simple as a redis cache. The persisted data only needs to be available for the length of the user session. 

In a provider-hosted scenario, however, as multiple clients are accessing the same server, it is then necessary to integrate with the Auth service in order to achieve client access isolation, in order to ensure there is no potential cross-client access.
