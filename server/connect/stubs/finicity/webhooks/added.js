module.exports = {
  "method": "POST",
  "headers": {
      "host": "webhook.sophtron-prod.com",
      "x-request-id": "70329da6d2d42937c3dff601a7e6df54",
      "x-real-ip": "34.215.116.35",
      "x-forwarded-for": "34.215.116.35",
      "x-forwarded-host": "webhook.sophtron-prod.com",
      "x-forwarded-port": "80",
      "x-forwarded-proto": "http",
      "x-scheme": "http",
      "content-length": "1241",
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
      "x-finicity-signature": "9c5cced2daa693aba21adae0177f91b6028175a3166c8e4ddd5a4146c8c5957e",
      "user-agent": "axios/0.25.0",
      "x-b3-traceid": "ee8f1740171057ec74015a4d0bdee2c6",
      "x-b3-spanid": "1e4d1378f76ba636",
      "x-b3-sampled": "1",
      "traceparent": "00-ee8f1740171057ec74015a4d0bdee2c6-1e4d1378f76ba636-01"
  },
  "path": "/webhook/finicity_sandbox/f0105b8f-a7a4-4665-98e2-09e116804951",
  "body": {
      "customerId": "6030781868",
      "eventType": "added",
      "eventId": "1688829092668-518e7b2cd7948bcdb968c433",
      "payload": {
          "institutionId": "102176",
          "accounts": [{
                  "id": "6055993964",
                  "number": "202020",
                  "name": "IRA",
                  "balance": 7030,
                  "type": "ira",
                  "status": "active",
                  "customerId": "6030781868",
                  "institutionId": "102176",
                  "createdDate": 1688650529,
                  "lastUpdatedDate": 0,
                  "currency": "USD",
                  "institutionLoginId": 6026370998,
                  "displayPosition": 1
              }, {
                  "id": "6055993965",
                  "number": "212121",
                  "name": "401K",
                  "balance": 9005,
                  "type": "401k",
                  "status": "active",
                  "customerId": "6030781868",
                  "institutionId": "102176",
                  "createdDate": 1688650529,
                  "lastUpdatedDate": 0,
                  "currency": "USD",
                  "institutionLoginId": 6026370998,
                  "displayPosition": 2
              }, {
                  "id": "6055993966",
                  "number": "222222",
                  "name": "Savings",
                  "balance": 22327.3,
                  "type": "savings",
                  "status": "active",
                  "customerId": "6030781868",
                  "institutionId": "102176",
                  "createdDate": 1688650529,
                  "lastUpdatedDate": 0,
                  "currency": "USD",
                  "institutionLoginId": 6026370998,
                  "displayPosition": 3
              }, {
                  "id": "6055993967",
                  "number": "333333",
                  "name": "Credit Card",
                  "balance": -1952.71,
                  "type": "creditCard",
                  "status": "active",
                  "customerId": "6030781868",
                  "institutionId": "102176",
                  "createdDate": 1688650529,
                  "lastUpdatedDate": 0,
                  "currency": "USD",
                  "institutionLoginId": 6026370998,
                  "displayPosition": 4
              }
          ],
          "oauth": true
      }
  }
}