module.exports = {
  "method": "POST",
  "headers": {
      "host": "webhook.sophtron-prod.com",
      "x-request-id": "7bd31eb3e4fc0138955adcd5fd652c53",
      "x-real-ip": "34.215.116.35",
      "x-forwarded-for": "34.215.116.35",
      "x-forwarded-host": "webhook.sophtron-prod.com",
      "x-forwarded-port": "80",
      "x-forwarded-proto": "http",
      "x-scheme": "http",
      "content-length": "149",
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
      "x-finicity-signature": "d56e01e4b39b4452f3c2b5e059a9e5479a87acee25aa45f53cf4c937b2b7fca0",
      "user-agent": "axios/0.25.0",
      "x-b3-traceid": "5f865bb003f007283b3de2ce3f587c0f",
      "x-b3-spanid": "87f6a01f3b35256e",
      "x-b3-sampled": "1",
      "traceparent": "00-5f865bb003f007283b3de2ce3f587c0f-87f6a01f3b35256e-01"
  },
  "path": "/webhook/finicity_sandbox/f0105b8f-a7a4-4665-98e2-09e116804951",
  "body": {
      "customerId": "6030781868",
      "eventType": "adding",
      "eventId": "1688829066253-d10dac58486e33bf419919dc",
      "payload": {
          "institutionId": "102176",
          "oauth": true
      }
  }
}