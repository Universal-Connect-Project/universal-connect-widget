# Metrics server - Shared or private component

One of the very important feature that the universal widget provides is the ability to dynamically route traffic based on performance metrics. a unified analytics service is neccessary for this so that more data can be aggregated, then clients can rely on it more, this should be secure and ensure information anonymouse, although, the widget host should also have the option to choose their own metrics server to keep the performance data to themselves, with the cost of not being able to leverage the larger scaled data. 

The analytics service underlying is as simple as grepping several meaningful types of event data emmitted by the widget, then forwarding to a statsd datastore, with proper taggings to add source, institution and provider information, etc. 

Clients can decide weather to let the widget read and write the metrics data to the community shared data store, so they can get a much bigger volumn based performance metrics, which means more accurate and more active.
Or it would be also simple to keep it as a private instance.