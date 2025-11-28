# Order Request

Source: https://api.bog.ge/docs/en/payments/standard-process/create-order

- Standard Process
- Order Request
Order Request
To place an order request, businesses must send payment details, technical specifications, and the amount to be paid to the online payment server. If the process is successful, the customer should be redirected to the online payment page at the redirect address returned to the _link parameter to complete the payment.
redirect
_link
Header parameters​
application/json
Basic <base64>
Bearer <jwt_token>, where jwt_token is the token returned in the access_token parameter of the authentication method response.
Bearer <jwt_token>
jwt_token
access_token
UUID v4
The Idempotency-Key parameter should be unique for each new API request. Subsequent requests to the same API endpoint with the same Idempotency-Key header will result in the server returning the same status code and response body as the initial request. This functionality is particularly useful to ensure consistent outcome in scenarios where network issues or retries may lead to duplicate requests.
string
The language of the interface that the customer will see when redirected to the online payment page. The possible values are:
- ka - Georgian (default)
ka
- en - English.
en
string
The theme of the interface that the customer will see when redirected to the online payment page. The possible values are:
- light - Light (default)
light
- dark - Dark.
dark
Body parameters​
"web" | "mobile"
Defines the type of application from which the order was created. This parameter is used specifically when an order is created using Apple Pay, directly from the merchant's webpage or mobile application. application_type has two values:
application_type
- web - For orders created from a webpage.
web
- mobile - For orders created from a mobile application.
mobile
object
Information about the buyer.
string
string
string
string
string
"automatic" | "manual"
- automatic - creation of a standard order, payment will be made without pre-authorization, and the amount will be immediately withdrawn from the customer’s account.
automatic
- manual - after payment, the amount on the customer’s account will be blocked and will not be available for the customer. To complete the payment, it is necessary to use the pre-authorization completing method and confirm/reject the transaction. If this operation is not performed within 30 days, the amount will be automatically unblocked and will be available again for the customer. This feature can only be used when paying through Apple Pay, Google Pay or by a card.
manual
object
The purchase information.
array
A basket of products or services purchased within a given payment in a business.
string
string
number
number
number
number
number
number
string
string
string
string
string
object
Information about the delivery service.
number
number
number
string
The currency in which payment is made:
- GEL - Georgian Lari (default)
GEL
- USD - US dollar
USD
- EUR - Euro
EUR
- GBP - British pound.
GBP
object
The business web addresses that customers can be redirected to from the online payment system upon completion of the payment.
string
string
number
array
The payment methods that a customer can use to pay for the order. The business must have all the methods it provides here activated. If the parameter is left empty, upon redirecting a customer to the online payment page, they will be able to use all the payment methods available for the business. The possible values are:
- card - payment by a bank card
card
- google_pay - payment through Google Pay and by a bank card (in the case of providing this option, the customer will be able to pay both by Google Pay and a bank card. The Business must have both payment methods activated)
google_pay
- apple_pay - payment through Apple Pay and by a bank card (in the case of providing this option, the customer will be able to pay both by Apple Pay and a bank card. The Business must have both payment methods activated)
apple_pay
- bog_p2p - transferring by the BoG, internet, or mobile bank user
bog_p2p
- bog_loyalty - payment by the BoG MR/Plus points
bog_loyalty
- bnpl - payment with Buy Now Pay Later plan
bnpl
- bog_loan - standard bank installment plan
bog_loan
- gift_card - payment with a gift card
gift_card
object
Configuration of a specific payment.
object
Payment configuration. Transmission of a parameter is necessary if you wish the payment to be made only by installment plan ("payment_method":["bog_loan"]) or only by bnpl ("payment_method":["bnpl"]).
string
number
object
Duration of the installment/bnpl in months (the value of the month parameter returned by the calculator).
string
A card type, to which the discount applies to:
- visa - Visa
visa
- mc - MasterCard
mc
- solo - SOLO card
solo
string
- restrict - card type restriction
restrict
- client_discount - discount on a specific card type
client_discount
object
Payment configuration. Transmission of a parameter is necessary if you wish to make Google Pay payment from your own webpage.
string
boolean
- true - payment is initiated from the Google Pay button on business' webpage
true
- false - Payment is initiated from the bank's webpage (default).
false
object
Payment configuration. This parameter is necessary if you wish to enable Apple Pay payments from your own webpage.
boolean
- true -Payment is initiated from the Apple Pay button on the business's webpage.
true
- false - Payment is initiated from the bank's webpage (default).
false
object
Payment configuration: This object is necessary if you have configured multiple e-commerce POS terminals in the same currency. It allows you to group payments based on business needs or settle payments on different business bank accounts.
string
E-commerce POS identifier. If provided tag does not match with POS configuration or tag was not provided, the operation will default to the default POS terminal and its corresponding payment account. Note: It is important to agree upon tag values when configuring additional ecommerce POS terminal.
- CURL
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders' \-H 'Accept-Language: ka' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "callback_url": "https://example.com/callback", "external_order_id": "id123", "purchase_units": { "currency": "GEL", "total_amount": 1, "basket": [ { "quantity": 1, "unit_price": 1, "product_id": "product123" } ] }, "redirect_urls": { "fail": "https://example.com/fail", "success": "https://example.com/success" }}'
curl -X POST 'https://api.bog.ge/payments/v1/ecommerce/orders' \-H 'Accept-Language: ka' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "callback_url": "https://example.com/callback", "external_order_id": "id123", "purchase_units": { "currency": "GEL", "total_amount": 1, "basket": [ { "quantity": 1, "unit_price": 1, "product_id": "product123" } ] }, "redirect_urls": { "fail": "https://example.com/fail", "success": "https://example.com/success" }}'
Response​
string
object
The web resource addresses are used in the further stages of the payment process. At the moment two resources are returned:
string
string
- RESPONSE
{ "id": "{order_id}", "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" }, "redirect": { "href": "https://payment.bog.ge/?order_id={order_id}" } }}
{ "id": "{order_id}", "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" }, "redirect": { "href": "https://payment.bog.ge/?order_id={order_id}" } }}