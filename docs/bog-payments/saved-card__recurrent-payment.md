# Payment by the Saved Card

Source: https://api.bog.ge/docs/en/payments/saved-card/recurrent-payment

- Save Card
- Payment by the Saved Card
Payment by the Saved Card
This method allows businesses to enable customers to make payments on the bank's webpage without entering their card details again. This feature is useful when a customer has previously saved their card information during a successful card payment transaction for future use.
Path parameters​
string
The Header, Body and Response parameters for this method are the same as those used for the order request method.
Header
Body
Response
- CURL
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders/:parent_order_id' \-H 'Accept-Language: ka' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "callback_url": "https://example.com/callback", "purchase_units": { "total_amount": 1, "basket": [ { "quantity": 1, "unit_price": 1, "product_id": "product123" } ] }}'
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders/:parent_order_id' \-H 'Accept-Language: ka' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "callback_url": "https://example.com/callback", "purchase_units": { "total_amount": 1, "basket": [ { "quantity": 1, "unit_price": 1, "product_id": "product123" } ] }}'