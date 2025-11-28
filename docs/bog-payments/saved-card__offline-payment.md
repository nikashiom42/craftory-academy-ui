# Automatic Payment by the Saved Card

Source: https://api.bog.ge/docs/en/payments/saved-card/offline-payment

- Save Card
- Automatic Payment by the Saved Card
Automatic Payment by the Saved Card
This method enables businesses to automatically withdraw funds from a customer's saved card without their participation. This feature is useful when a customer has previously saved their card information for automatic withdrawals during a successful card payment transaction.
Header parameters​
application/json
Basic <base64>
Bearer <jwt_token>, where jwt_token is the token returned in the access_token parameter of the authentication method response.
Bearer <jwt_token>
jwt_token
access_token
UUID v4
The Idempotency-Key parameter should be unique for each new API request. Subsequent requests to the same API endpoint with the same Idempotency-Key header will result in the server returning the same status code and response body as the initial request. This functionality is particularly useful to ensure consistent outcome in scenarios where network issues or retries may lead to duplicate requests.
Path parameters​
string
Body parameters​
string
The web address of the business will be automatically called by the bank after the transaction is completed to transmit payment data (via callback). If the parameter is empty, the system will use the value transmitted during the creation of the order corresponding to the parent_order_id.
parent_order_id.
string
The payment identifier from the business system (e.g., the purchase basket identifier). If the parameter is empty, the system will use the value transmitted during the creation of the order corresponding to the parent_order_id.
parent_order_id.
For the remaining parameters (amount, currency, buyer information, etc.) required for the order request, the system will automatically use the values transmitted during the creation of the order corresponding to the parent_order_id.
parent_order_id.
- CURL
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders/:parent_order_id/subscribe' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json'
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders/:parent_order_id/subscribe' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json'
Response​
string
object
The web resource addresses are used in the further stages of the payment process.
string
The address of the payment details can be used to obtain information on the online payment.
- RESPONSE
{ "id": "{order_id}", "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" } }}
{ "id": "{order_id}", "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" } }}