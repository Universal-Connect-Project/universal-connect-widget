# The Universal-Connect-Widget

Whether you are an established financial institution with existing data providers or a one person startup the Universal Connect Project (UCP) is the right way to connect to financial services like banks, credit unions and wealth managers. 

## Why Use an Internet Protocol? 
The UCP is an internet protocol for financial services data that builds upon the WC3 Standard Verifiable Credentials (https://www.w3.org/TR/vc-data-model/). When you connect to services through an Internet protocol instead of through a proprietary API you get: 

* Choice: The financial data you receive is always in the same format no matter what company you use. This means you can route your requests to another provider without making any changes to your code. 
Fault Tolerance: If one company or service goes offline your requests are automatically re-routed so your application stays up and your users stay happy. 
* Simple integration: Simply display the open source UCP Widget and it handles all of the user interaction needed to retrieve bank data from any data provider. 
* Performance: Data connection speeds vary across data providers and individual financial institutions with the same data provider. The UCP monitors the speed of connections and uses an open source algorithm to route your traffic to the fastest available connection. 
* Privacy: Some data providers have terms that allow them to reuse the data they collect. The UCP allows you to control when those providers are used. 
* Cost: Access to banking data is often one of the most expensive parts of building a fintech app. The UCP will route to the cheapest connection that meets your criteria. 

## What data providers can I use with the UCP? 
The UCP is currently routing traffic to MX, Finicity, Sophtron and Akoya, but if you would like to use another provider open an issue on our GitHub page and a member of the community will enable it for you. One of our community goals is to have global coverage by the end of 2025. 

## Why Verifiable Credentials? 
The UCP combines the FDX data standard with Verifiable Credentials to provide running code (a reference implementation) that eliminates ambiguity and embeds proof that the data has not been tampered with after it is created. 
Previous attempts to simplify access to financial services data have used an industry consortium approach rather than an Internet Standards approach. While Internet Standards take longer to establish the success of the Internet itself shows the benefits justify the extra work. 
Verifiable Credentials allow users to take possession of data without gaining the ability to modify the data. This enables the ideal “one click to instantly share” user experience that wasn’t previously possible. 
As the Internet itself is upgraded to improve privacy, security and reliability using Verifiable Credentials new applications for financial data will be unlocked. By adopting Verifiable Credentials now companies gain a competitive advantage. 
Verifiable Credentials are being embraced by regulators because they allow users to take possession of their data and completely control how that data is shared.

## Get started
- For a quick view check out [this demo site](https://demo.sophtron.com/loader.html?env=https://universalwidget.sophtron-prod.com)
- For development and deployment, please refer to [application/README.md](application/README.md)
- Usage documentation [openapi](openapi/)
- For examples on how to integrate with and embed an hosted widget, please refer to [example/README.md](example/README.md)

### Terms explained
- `Provider` (`data aggregation provider`): Data providers/issuers of financial data.
- `Institution`: financial institutions such as a bank or a utility company.
- `Customer`: the end-user.
- `Member`/`Connection`: logins owned by the `Customer` to an `Institution`.
