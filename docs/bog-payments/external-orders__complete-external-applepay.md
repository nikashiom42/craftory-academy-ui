# Apple Pay™ Accept Payment

Source: https://api.bog.ge/docs/en/payments/external-orders/complete-external-applepay

- Pay From Business' Webpage
- Apple Pay™ Accept Payment
Apple Pay™ Accept Payment
Calling this service is required to complete Apple Pay™ payment initiated on business' webpage.
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
Full string representing the encrypted Apple Pay payment details. It must include all nested fields as received from the Apple Pay SDK without modification or truncation.
- CURL
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders/{order_id}/payment' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "apple_pay_token": "{\"token\":{\"paymentData\":{\"data\":\"..."}"}'
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders/{order_id}/payment' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "apple_pay_token": "{\"token\":{\"paymentData\":{\"data\":\"..."}"}'
Response​
string
string
object
Order details. Contains same data as payment details.
object
The web resource addresses are used in the further stages of the payment process. At the moment following resources are returned:
string
- RESPONSE
{ "id": "{order_id}", "status": "completed", "order_details": {...}, "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" } }}
{ "id": "{order_id}", "status": "completed", "order_details": {...}, "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" } }}