# Metrics server - Shared or private component

One of the very important feature that the universal widget provides is the ability to dynamically route traffic based on performance metrics. A unified analytics service is necessary for this so that more data can be aggregated, which provides the client more reliable data. This should be secure, while also ensuring that the information is anonymous. The widget host should also have the option to choose their own metrics server, in order to keep the performance data to themselves, with the caveat being that they will not be able to leverage the aggregated, large-scale data. 

The analytics service underlying is as simple as grepping several meaningful types of event data emitted by the widget, then forwarding to a statsd datastore, with proper tagging to add source, institution, and provider information, etc. 

Clients can decide whether to let the widget read and write the metrics data to the community shared data store, so they can get a much bigger volume-based performance metrics, which means more accurate and more active.
It would be also simple to keep it as a private instance.