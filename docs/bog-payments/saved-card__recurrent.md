# Save Card for Recurring Payments

Source: https://api.bog.ge/docs/en/payments/saved-card/recurrent

- Save Card
- Save Card for Recurring Payments
Save Card for Recurring Payments
The bank offers businesses the option to save a customer's card information, with the customer's consent, to enable future payments without having to enter card details again.
To use this feature, the business should call the relevant method and provide the order identifier before redirecting the customer to the payment page upon order request. If the card payment is successful for the given order, the same identifier can be used for future orders.
Header parameters​
Basic <base64>
Bearer <jwt_token>, where jwt_token is the token returned in the access_token parameter of the authentication method response.
Bearer <jwt_token>
jwt_token
access_token
UUID v4
The Idempotency-Key parameter should be unique for each new API request. Subsequent requests to the same API endpoint with the same Idempotency-Key header will result in the server returning the same status code and response body as the initial request. This functionality is particularly useful to ensure consistent outcome in scenarios where network issues or retries may lead to duplicate requests.
Path parameters​
string
Response​
202 ACCEPTED
The request has been accepted.
- CURL
curl -X PUT 'https://api.bog.ge/payments/v1/orders/:order_id/cards' \-H 'Authorization: Bearer <token>'
curl -X PUT 'https://api.bog.ge/payments/v1/orders/:order_id/cards' \-H 'Authorization: Bearer <token>'