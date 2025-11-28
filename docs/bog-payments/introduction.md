# https://api.bog.ge/docs/en/payments/introduction

Source: https://api.bog.ge/docs/en/payments/introduction

- Introduction
Aggregator Integration Protocol for E-Commerce Services​
What is Online Payment API?​
The Online Payment API is a robust, developer-friendly solution designed to integrate a secure payment module into any electronic system quickly and effortlessly. It streamlines payment processing, allowing business1 to receive payments using various payment methods, including cards from Bank of Georgia and other commercial banks (VISA, MasterCard, American Express).
Protocol and Technical Specifications​
- API Architecture: RESTful
- Communication Protocol: HTTP/1.1 (All API calls must be made over HTTPS to ensure secure data transmission.)
- Data Format: JSON is used for both request payloads and response bodies, facilitating easy integration.
- Authentication & Security: OAuth 2.0 is used for authentication, while JSON Web Tokens (JWT) ensure secure data exchange.
- Synchronous API Calls: Every API request is processed immediately, delivering a response that reflects the outcome of the API call.
- Asynchronous Webhook Notifications: Although API calls are synchronous, key events, such as payment confirmations and updates, are managed asynchronously via Callbacks3 for reliable, real-time communication.
- Error Handling: Standard HTTP status codes and descriptive error messages are used to indicate success or error states, helping developers quickly diagnose issues.
Checkout Process Overview​
- Customer Initiates Payment: The customer selects the desired product or service (or a combination in a shopping cart) on the business's website and clicks the payment button.
- Business Sends an Order Request: The business sends an order request to the online payment API to initiate the operation, marking the beginning of the payment process.
- API Returns Order Request Details: The payment gateway responds with the necessary parameters—such as an order request ID and a redirect URL—that enable the payment process to continue.
- Customer is Redirected to the Online Payment Page: The business directs the customer to the online payment page2. Here, the customer chooses the payment method, enters their card details or uses internet banking to authorize the payment.
- Payment Processing: The online payment system validates payment details and securely processes the payment.
- Callback Notification Sent to Business: Once the transaction is processed, the payment gateway sends a Callback, to the business’s callback URL, provided in the order request.
Receiving the callback is a crucial step in the payment process. it confirms the payment status (successful or failed) and other essential details. Based on the information received in the callback, the business must ensure that its system is updated accordingly.
- Operation Completion: After receiving the callback, the business finalizes the process by confirming the order to the customer and completing any related fulfillment activities.
Before redirecting to the online payments page, the business can use the card-saving feature to carry out future transactions automatically or without entering card details.
The payment manager represents the new payment system. To view the previous version, please refer to the iPAY documentation.