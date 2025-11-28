# Apple Pay™ on Business' Webpage

Source: https://api.bog.ge/docs/en/payments/external-orders/external-applepay

- Pay From Business' Webpage
- Apple Pay™ on Business' Webpage
Apple Pay™ on Business' Webpage
To add Apple Pay™ button on your webpage, following steps are required.
First your webpage should be compliant with Apple's requirements. Since Apple Pay button is added to your own webpage, instead of Bank of Georgia's, you need to configure the environment independently. For more information visit Apple's configuration page.
Add the Apple Pay certificate on your website.
Download certificate here.
See the detailed instruction here.
After adding the certificate, please, write to this email address ecommercemerchants@bog.ge and provide your domain and your API Public Key.
After these steps you can make Bank payments through Apple Pay button on your page. For creating order see Standard Process - Order Request
Body should contain following parameters:
Body
"payment_method": ["apple_pay"],"config": { "apple_pay": { "external": true }}
"payment_method": ["apple_pay"],"config": { "apple_pay": { "external": true }}
Response​
string
json
object
The web resource addresses are used in the further stages of the payment process. At the moment following resource is returned:
string
- RESPONSE
{ "id": "{order_id}", "result": {...}, "_links": { "accept": { "href": "https://api.bog.ge/payments/v1/ecommerce/orders/{order_id}/payment" } }}
{ "id": "{order_id}", "result": {...}, "_links": { "accept": { "href": "https://api.bog.ge/payments/v1/ecommerce/orders/{order_id}/payment" } }}