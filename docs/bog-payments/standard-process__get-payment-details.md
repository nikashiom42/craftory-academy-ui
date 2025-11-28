# Payment Details

Source: https://api.bog.ge/docs/en/payments/standard-process/get-payment-details

- Standard Process
- Payment Details
Payment Details
This method allows businesses to receive detailed information about an online payment using its identifier.
Header parameters​
Basic <base64>
The meaning Bearer <jwt_token> is transmitted, where jwt_token is the meaning returned to the access_token parameter of the Response method.
Bearer <jwt_token>
jwt_token
Path parameter​
string
- CURL
curl -X GET 'https://api.bog.ge/payments/v1/receipt/:order_id' \-H 'Authorization: Bearer <token>'
curl -X GET 'https://api.bog.ge/payments/v1/receipt/:order_id' \-H 'Authorization: Bearer <token>'
Response​
string
string
string
The authorization method, always - automatic. transaction type with two possible meanings:
automatic
- automatic - a standard order
automatic
- manual - a pre-authorization order
manual
string
object
The business information.
string
string
string
string
string
string
object
Order status.
string
The status gets the following meanings:
- created - payment request is created
created
- processing - payment is being processed
processing
- completed - payment process has been completed
completed
- rejected - payment process has been unsuccessfully completed
rejected
- refund_requested - refund of the amount is requested
refund_requested
- refunded - payment amount has been returned
refunded
- refunded_partially - payment amount has been partially refunded
refunded_partially
- auth_requested - pre-authorize payment is requested
auth_requested
- blocked - pre-authorize payment has been completed successfully, but payment amount is blocked and waiting for confirmation
blocked
- partial_completed - pre-authorize payment partial amount has been confirmed successfully
partial_completed
string
object
The buyer information.
string
string
string
object
Information on the purchased products.
string
string
string
string
array
The list of the purchased products/services.
string
string
string
string
string
string
string
string
string
string
string
string
object
The business web-pages, to which customers can be re-directed from the online payment system upon completion of the transaction.
string
string
object
Payment details.
string
Payment method.
string
- card - payment by a bank card
card
- google_pay - payment through Google Pay
google_pay
- apple_pay - payment through Apple Pay
apple_pay
- bog_p2p - transferring by a customer of the Bank of Georgia, internet or mobile banking
bog_p2p
- bog_loyalty - payment by BoG MR/Plus points
bog_loyalty
- bnpl - payment in installments
bnpl
- bog_loan - standard bank installment plan.
bog_loan
string
string
string
A payer's identifier, according to the transfer_method, gets various meanings:
transfer_method
- card/google_pay – the card’s encoded number is returned (PAN)5
card
google_pay
- apple_pay – a device-specific number assigned to your card by Apple is returned
apple_pay
- bog_p2p/bog_loyalty – the account name is returned
bog_p2p
bog_loyalty
- bog_loan/bnpl – the first letter of a customer name is returned.
bog_loan
bnpl
string
Payment method. The following values can be returned:
- direct_debit - card payment
direct_debit
- recurrent - payment by the saved card
recurrent
- subscription - automatic payment by the saved card.
subscription
string
The type of card used for payment. The parameter takes its value during the card payment:
- amex - American Express
amex
- mc - Mastercard
mc
- visa - Visa.
visa
string
Expiration date (month/year) of the card with which the payment was made. The parameter takes value at the time of card payment.
string
E-commerce POS identifier requested in the order.
string
E-commerce POS identifier on which the payment was processed.
string
- recurrent - Card saved for client initiated future payments.
recurrent
- subscription - Card saved for automatic, subscription payments with fixed amount and details.
subscription
string
string
string
string
object
Discount details, that was applied on the payment
string
string
string
string
string
string
array
The list of actions associated with an order.
string
string
The channel, from which the action was initiated:
- public_api - online payments API
public_api
- business_manager - business manager website
business_manager
- support - BOG inner system.
support
string
The action type:
- authorize - confirmation of pre-authorize payment
authorize
- partial_authorize - confirmation of pre-authorize payment
partial_authorize
- cancel_authorize - rejection of pre-authorize payment
cancel_authorize
- refund - refund
refund
- partial_refund - partially refund
partial_refund
string
The action status:
- completed - action has been completed successfully
completed
- rejected - has been completed unsuccessfully
rejected
string
string
string
The interface language found by a customer after re-directing to the online payment page. There are two meanings:
- ka - Kartuli (Georgian)
ka
- en - English
en
string
The reason for payment failure. The parameter takes value only if the order failed ("order_status": "rejected"). takes the following values:
- expiration - the order has expired
expiration
- unknown - an unidentified reason.
unknown
- Payment Response Code Description - Payment rejection reason, initiated by card, Google Pay or Apple Pay. See full list of Response codes here.
Payment Response Code Description
- RESPONSE
{ "order_id": "a767a276-cddd-43ec-9db3-9f9b39eee02d", "industry": "ecommerce", "capture": "manual", "external_order_id": "123456", "client": { "id": "10000", "brand_ka": "საქართველოს ბანკი", "brand_en": "BOG", "url": "https://api.bog.ge" }, "zoned_create_date": "2022-11-01T13:19:43.021178Z", "zoned_expire_date": "2022-11-01T13:39:43.021178Z", "order_status": { "key": "refunded", "value": "დაბრუნებული" }, "buyer": { "full_name": "John Doe", "email": "johndoe@gmail.com", "phone_number": "+995555000000" }, "purchase_units": { "request_amount": "100.5", "transfer_amount": "0.0", "refund_amount": "100.5", "currency_code": "GEL", "items": [ { "external_item_id": "id_1", "description": "product 1", "quantity": "1", "unit_price": "25.35", "unit_discount_price": "0", "vat": "0", "vat_percent": "0", "total_price": "25.35", "package_code": "A000123", "tin": null, "pinfl": null, "product_discount_id": "BF222R5" } ] }, "redirect_links": { "success": "https://payment.bog.ge/receipt?order_id=a767a276-cddd-43ec-9db3-9f9b39eee02d", "fail": "https://payment.bog.ge/receipt?order_id=a767a276-cddd-43ec-9db3-9f9b39eee02d" }, "payment_detail": { "transfer_method": { "key": "card", "value": "ბარათით გადახდა" }, "code": "100", "code_description": "Successful payment", "transaction_id": "230513868679", "payer_identifier": "548888xxxxxx9893", "payment_option": "direct_debit", "card_type": "mc", "card_expiry_date": "03/24", "request_account_tag": "1212", "transfer_account_tag": "gev2", "saved_card_type": "recurrent", "parent_order_id": "8d52130d-cb1b-45ea-b048-0f040a44e2a3" }, "discount": { "bank_discount_amount": "string", "bank_discount_desc": "string", "discounted_amount": "string", "original_order_amount": "string", "system_discount_amount": "string", "system_discount_desc": "string" }, "actions": [ { "action_id": "b70968ca-eda9-47ae-8811-26fd1ab733f8", "request_channel": "public_api", "action": "authorize", "status": "completed", "zoned_action_date": "2022-11-28T13:42:40.668439Z", "amount": "100.5" }, { "action_id": "a89b872a-9700-4025-b3fb-047cbba7a5e6", "request_channel": "business_manager", "action": "refund", "status": "completed", "zoned_action_date": "2022-11-28T13:58:03.427939Z", "amount": "100.5" } ], "lang": "ka", "reject_reason": null}
{ "order_id": "a767a276-cddd-43ec-9db3-9f9b39eee02d", "industry": "ecommerce", "capture": "manual", "external_order_id": "123456", "client": { "id": "10000", "brand_ka": "საქართველოს ბანკი", "brand_en": "BOG", "url": "https://api.bog.ge" }, "zoned_create_date": "2022-11-01T13:19:43.021178Z", "zoned_expire_date": "2022-11-01T13:39:43.021178Z", "order_status": { "key": "refunded", "value": "დაბრუნებული" }, "buyer": { "full_name": "John Doe", "email": "johndoe@gmail.com", "phone_number": "+995555000000" }, "purchase_units": { "request_amount": "100.5", "transfer_amount": "0.0", "refund_amount": "100.5", "currency_code": "GEL", "items": [ { "external_item_id": "id_1", "description": "product 1", "quantity": "1", "unit_price": "25.35", "unit_discount_price": "0", "vat": "0", "vat_percent": "0", "total_price": "25.35", "package_code": "A000123", "tin": null, "pinfl": null, "product_discount_id": "BF222R5" } ] }, "redirect_links": { "success": "https://payment.bog.ge/receipt?order_id=a767a276-cddd-43ec-9db3-9f9b39eee02d", "fail": "https://payment.bog.ge/receipt?order_id=a767a276-cddd-43ec-9db3-9f9b39eee02d" }, "payment_detail": { "transfer_method": { "key": "card", "value": "ბარათით გადახდა" }, "code": "100", "code_description": "Successful payment", "transaction_id": "230513868679", "payer_identifier": "548888xxxxxx9893", "payment_option": "direct_debit", "card_type": "mc", "card_expiry_date": "03/24", "request_account_tag": "1212", "transfer_account_tag": "gev2", "saved_card_type": "recurrent", "parent_order_id": "8d52130d-cb1b-45ea-b048-0f040a44e2a3" }, "discount": { "bank_discount_amount": "string", "bank_discount_desc": "string", "discounted_amount": "string", "original_order_amount": "string", "system_discount_amount": "string", "system_discount_desc": "string" }, "actions": [ { "action_id": "b70968ca-eda9-47ae-8811-26fd1ab733f8", "request_channel": "public_api", "action": "authorize", "status": "completed", "zoned_action_date": "2022-11-28T13:42:40.668439Z", "amount": "100.5" }, { "action_id": "a89b872a-9700-4025-b3fb-047cbba7a5e6", "request_channel": "business_manager", "action": "refund", "status": "completed", "zoned_action_date": "2022-11-28T13:58:03.427939Z", "amount": "100.5" } ], "lang": "ka", "reject_reason": null}