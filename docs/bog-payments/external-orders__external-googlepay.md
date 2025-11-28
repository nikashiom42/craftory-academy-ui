# Google Pay™ on Business' Webpage

Source: https://api.bog.ge/docs/en/payments/external-orders/external-googlepay

- Pay From Business' Webpage
- Google Pay™ on Business' Webpage
Google Pay™ on Business' Webpage
To add Google Pay™ button on your webpage, following steps are required.
First your webpage should be compliant with Google's requirements. Since Google Pay button is added to your own webpage, instead of Bank of Georgia's, you need to configure the environment independently. For more information visit Google's configuration page.
During configuration, use the following parameters:
{ "type": "PAYMENT_GATEWAY", "parameters": { "gateway": "georgiancard", "gatewayMerchantId": "BCR2DN4TXKPITITV", }}
{ "type": "PAYMENT_GATEWAY", "parameters": { "gateway": "georgiancard", "gatewayMerchantId": "BCR2DN4TXKPITITV", }}
After these steps you can make Bank payments through Google Pay button on your page. For creating order see Standard Process - Order Request
Order Request Body should contain following parameters:
Body
"payment_method": ["google_pay"],"config": { "google_pay": { "external": true, "google_pay_token": "{token}" }}
"payment_method": ["google_pay"],"config": { "google_pay": { "external": true, "google_pay_token": "{token}" }}
boolean
string
{ "google_pay_token": "{'signature':'MEQCIHFtDlqJcskQXbwyvJLZQqS1LzeFds3OPilG9VoYKoe6AiA/j3MnWYkc6wT6plqYzN/pOLw0fJNbDDoTiV9fBJj92g\\u003d\\u003d','intermediateSigningKey':{'signedKey':'{\\'key...vJLtzc8lmztk=='}'}" }
{ "google_pay_token": "{'signature':'MEQCIHFtDlqJcskQXbwyvJLZQqS1LzeFds3OPilG9VoYKoe6AiA/j3MnWYkc6wT6plqYzN/pOLw0fJNbDDoTiV9fBJj92g\\u003d\\u003d','intermediateSigningKey':{'signedKey':'{\\'key...vJLtzc8lmztk=='}'}" }
Response​
string
string
object
Order details. Contains same data as payment details. The object is returned if payment process is completed without 3DS authentication.
object
The web resource addresses are used in the further stages of the payment process. At the moment following resources are returned:
string
string
- RESPONSE
{ "id": "{order_id}", "status": "completed", "order_details": {...}, "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" }, "redirect": { "href": "https://payment.bog.ge/api/3ds/post-form?fieldName={field_name}&fieldValue={field_value}&baseUrl={base_url}" } }}
{ "id": "{order_id}", "status": "completed", "order_details": {...}, "_links": { "details": { "href": "https://api.bog.ge/payments/v1/receipt/{order_id}" }, "redirect": { "href": "https://payment.bog.ge/api/3ds/post-form?fieldName={field_name}&fieldValue={field_value}&baseUrl={base_url}" } }}