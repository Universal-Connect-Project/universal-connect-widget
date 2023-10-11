# The Universal-Connect-Widget

This is part of the Universal-Connect project, that provides a embed-able widget-ui designed for end user to authorize a `provider` to login to their financial institution account and extract data
It provides:
- A unified work flow for end-user to: select a financial institution -> login -> resolve security challenges -> extract data
- A unified search against all selected `data aggregation provider`'s support list, then integrate the processing through the `provider`'s API
- The ability to collect performance metrics from all used `providers` and dynamically route user request to gain the best coverage

## Get started
- For a quick view, we have setup [this demo site](https://demo.sophtron.com/loader.html?env=https://universalwidget.sophtron-prod.com) for playing with
- For development and deployment(hosting). please see [application/README.md](application/README.md)
- Usage documentation [openapi](openapi/)
- For examples on how to integrate/embed an hosted instance, please see [example/README.md](example/README.md)

### Terms explained
- `Provider` (`data aggregation provider`): The service that actually processes the login data, currently implemented:
  * [Sophtron]()
  * [MX]()
  * [Finicity]()
  * [Akoya]()
- `Institution`: end-user's financial institution to extract data from. such as a bank, utility company
- `Customer`: the end-user
- `Member`/`Connection`: the login between a `Customer` and an `Institution`
