# Farm Animal Marketplace

A Solana-based farm animal marketplace with Phantom wallet integration, built with React and Supabase.

## Features

- 🐔 **Animal Trading**: Buy and sell different tiers of farm animals (Chickens, Ducks, Cows)
- 💰 **Solana Integration**: Secure transactions using Solana blockchain
- 👛 **Wallet Support**: Phantom wallet integration
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🗄️ **Database**: Supabase PostgreSQL backend
- ⚡ **Real-time**: Live updates and transactions

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Solana Web3.js
- **Wallet**: Phantom Wallet Adapter

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Phantom wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/farm-animal-marketplace.git
   cd farm-animal-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Update `server/supabase.cjs` with your credentials
   - Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor

4. **Start the development servers**
   ```bash
   npm run dev:full
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
farm-animal-marketplace/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Wallet)
│   └── main.jsx           # App entry point
├── server/
│   ├── routes/            # API routes
│   ├── models/            # Database models (legacy)
│   ├── index.cjs          # Server entry point
│   └── supabase.cjs       # Supabase client
├── supabase-schema.sql    # Database schema
└── package.json
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/orders` - Create new order
- `GET /api/orders/wallet/:address` - Get orders by wallet address
- `GET /api/users` - Get all users

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and select Phantom
2. **Browse Animals**: View available animals in the marketplace
3. **Purchase**: Click "Buy" on any animal to purchase with SOL
4. **View Collection**: See your purchased animals in your collection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Farming! 🚜🐄**