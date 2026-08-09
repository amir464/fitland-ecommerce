# FitLand Mock API

This is an independent JSON Server project for development data. It is separate from
the FitLand React frontend and runs in its own terminal on port 4000.

## Setup and use

```bash
npm install
npm run validate
npm run dev
```

The API base URL is `http://localhost:4000`.

- Products: `GET http://localhost:4000/products`
- Single product: `GET http://localhost:4000/products/product-001`
- Product photography: `http://localhost:4000/images/products/{filename}.jpg`

The 48 product photographs are verified local JPEG assets under
`public/images/products`. Product IDs are strings. Port 4000 is expected by this
standalone mock service.
