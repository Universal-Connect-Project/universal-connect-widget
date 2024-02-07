# A demo server as an example of embeding the universal-connect-widget (Act as a client who uses the widget)

## Quick guide on widget usage

This example demonstrates a client website that embeds the universal widget and retrieves data after a connection has been established through the widget.
1. The `initWidget` function in [application/public/loader.html](application/public/loader.html) shows how a universal widget can be embedded into a webpage.

    The `action` parameter specifies which type of job to run when user creates a connection through the widget:
    - `agg`: aggregation job that returns accounts and transactions under each account;
    - `auth`: auth job that returns payment information including ACH account number and routing number for each account;
    - `identify`: identify job that returns owner's name, address and other identity information for the connection.
2. The [application/providers](../example/application/providers) folder shows how to query each provider for data after a connection has been established through the widget.
    * The example code can be used as-is to query data in verifiable credential format from each provider.
3. Event data are sent out to the client side from the moment user opens the widget, throughout the connection process, until the connection completes.
  - load
    ```
      {
        user_guid: string
        session_guid: string
      }
    ```
  - loaded
    ```
      {
        user_guid: string
        session_guid: string
        initial_step: string
      }
    ```
  - institutionSearch
    ```
      {
        user_guid: string
        session_guid: string
        query: string
      }
    ```
  - selectedInstitution
    ```
      {
        user_guid: string
        session_guid: string
        guid: string
        url: string
        name: string
      }
    ```
  - stepChange
    ```
      {
        user_guid: string
        session_guid: string
        current: string
        previous: string
      }
    ```
  - enterCredentials
    ```
      {
        user_guid: string
        session_guid: string
        institution: {
          guid: string
        }
      }
    ```
  - memberStatusUpdate
    ```
      {
        user_guid: string
        session_guid: string
        member_guid: string
        connection_status: number
      }
    ```
  - submitMFA
    ```
      {
        user_guid: string
        session_guid: string
        member_guid: string
      }
    ```
  - memberConnected
    ```
      {
        user_guid: string
        session_guid: string
        member_guid: string
        provider: string
      }
    ```
  - memberError
    ```
      {
        user_guid: string
        session_guid: string
        member: {
          guid: string
          connection_status: number
        }
      }
    ```

## Try with the example website
  - Provide the required credentials in [application/config.js](application/config.js).
    `NOTE: please use envrionment variables to provide the api secrets` variable names are the keys in the `config.js`
  - Build and run the docker image.
  - Or `npm i` and `npm run start` in `application` folder to get the server up
  - Browse `http://localhost:8088/loader.html?env=http://localhost:8080`
  - An hosted example can be found [here](https://demo.universalconnectproject.org/loader.html?env=https://widget.universalconnectproject.org)

