const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Farm Animal Marketplace...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://ismailsglr01:isomelo12@cluster0.7owbfgr.mongodb.net/farm1?retryWrites=true&w=majority&appName=Cluster0

# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com

# Marketplace Configuration
MARKETPLACE_WALLET_ADDRESS=5BN556ekHrkkBxgmGd9BkQMR4HGPDN4e4NfmuJPPyKC2

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start MongoDB (local or cloud)');
console.log('3. Start the server: npm run server');
console.log('4. Initialize products: curl -X POST http://localhost:5000/api/products/initialize');
console.log('5. Start the frontend: npm run dev');
console.log('6. Open http://localhost:3000 in your browser');
console.log('\n🐔 Happy farming!'); 