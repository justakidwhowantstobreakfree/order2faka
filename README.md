# order2faka

Generate gift card codes on the fly from orders of other shopping systems.

## What Problem Does It Solve?

Receive orders from other shopping sites, generate gift code dynamically, pay with price at shopping system, then go back to the shopping site unlock the shopping item.
接受其他购物网站的订单，动态生成卡密，按购物网站订单的价格支付，然后回到购物网站输入卡密解锁商品

## How to Use

### Setup Enviroment Variables

Create a `.env.production` on root folder of this repo.

```bash
HOST=https://yoursite.com
WEBHOOK_HOST=https://webhook.yoursite.com
WEBHOOK_PORT=8888  # If you change this port you need modify docker-compose.yml as well

EMAIL_HOST=smtp.yourmailer.com
EMAIL_PORT=123
EMAIL_USER=your_mailer_account
EMAIL_PASS=your_mailer_pass

MONGO_HOST=mongodb
MONGO_PORT=27017

ADMIN_TOKEN='your_token'
```

### Build Docker Image

You need to install docker on your machine first.

```bash
# If you change order2faka to other names
# you will need to modify docker-compose.yml as well
docker build -t order2faka ./
```

### Run

```bash
docker compose up  # or docker-compose up on some versions
```

### Initialize

1. visit `https://yoursite.com` or whatever you input in `.env.production`, maybe localhost:3000
2. visit `yoursite.com/admin?token=your_token` according to `ADMIN_TOKEN` you input in `.env.production`
3. Add payment processors and generate at least one merchant. If multiple payment processors are added, round robin algorithm will be applied to distribute your sales volume to these payment processors. At the moment, only epay is supported.

### Create Order

#### API Endpoint

`POST /api/orders`

#### JSON Body

```typescript
interface RequestBody {
  title: string
  amount: number // in cents
  outTradeNo: string
  currency: string // only 'CNY' is available beacause order2faka only supports rainbow epay
  returnUrl?: string
  description?: string
  clientIp: string
  userAgent?: string
  notifyUrl?: string
  merchantId: string // you will get one after generating merchant in admin page
  merchantKeyHash: string
}
```

where `merchantKeyHash` is `md5(outTradeNo + merchantKey)`, you will get one `merchantKey` after generating merchant in admin page

#### Return Example

```typescript
{
  url: 'https://yoursite.com/orders/:orderId'
}
```

Consumers can buy correspondent gift code at `url` through payment processors

### Verify Order

You can use this api to check the order has been paid or not by querying gift code users input in your site

#### API Endpoint

`GET /api/orders`

#### Query Parameters

```typescript
type kami = string
type merchantKey = string
```

Caution: here is `merchantKey` instead of `merchantKeyHash`

#### Return Example

```typescript
{
  paid: true,
  outTradeNo: '123',
}
```

or

```typescript
{
  paid: false
}
```

### Webhook

If you provide `notifyUrl`, when the payment completes, `notifyUrl` will be requested with below JSON parameters:

```typescript
interface WebhookRequestBody {
  title: string
  description: string
  amount: number
  currency: string
  outTradeNo: string
  merchantKeyHash: string
}
```

You should return a `success` raw text if everything works fine on your side.

## To Do

Webhook resend at some interval if merchant fails to respond with raw text `success`
