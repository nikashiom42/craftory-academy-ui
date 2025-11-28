# Confirm Pre-Authorization

Source: https://api.bog.ge/docs/en/payments/preauthorization/approve

- Complete Pre-Aithorization
- Confirm Pre-Authorization
Confirm Pre-Authorization
This method allows businesses to confirm pre-authorized amounts, either in full or partially.
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
number
string
A reason for confirmation.
- CURL
curl -X POST 'https://api.bog.ge/payments/v1/payment/authorization/approve/:order_id' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{"amount": "10.5","description": "string"}'
curl -X POST 'https://api.bog.ge/payments/v1/payment/authorization/approve/:order_id' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{"amount": "10.5","description": "string"}'
Response​
string
string
string
- RESPONSE
{ "key": "request_received", "message": "Pre-authorization payment approval request received", "action_id": "e786283f-dc7f-48ba-bb75-12857f5a43ad"}
{ "key": "request_received", "message": "Pre-authorization payment approval request received", "action_id": "e786283f-dc7f-48ba-bb75-12857f5a43ad"}