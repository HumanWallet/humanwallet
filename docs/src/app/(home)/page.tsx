import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center px-4">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <svg 
            width="80" 
            height="80" 
            xmlns="http://www.w3.org/2000/svg" 
            aria-label="HumanWallet Logo" 
            viewBox="0 0 24 24"
            className="humanwallet-logo"
          >
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx={12} cy={12} r={10} fill="url(#heroGradient)" />
            <path 
              d="M8 10a1.5 1.5 0 0 1 3 0v4a1.5 1.5 0 0 1-3 0v-4zM13 8a1.5 1.5 0 0 1 3 0v8a1.5 1.5 0 0 1-3 0V8z" 
              fill="white" 
            />
          </svg>
        </div>
        <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          HumanWallet Documentation
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto mb-8">
          Modern Web3 wallet infrastructure with biometric authentication and account abstraction. 
          Build the future of user-friendly blockchain interactions.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link 
          href="/docs" 
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          📚 Read Documentation
        </Link>
        <Link 
          href="https://github.com/HumanWallet/humanwallet" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200 border border-indigo-200"
        >
          🔗 View on GitHub
        </Link>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="humanwallet-card text-center p-6 rounded-lg bg-gradient-to-b from-indigo-50 to-purple-50">
          <div className="text-2xl mb-2">🔐</div>
          <h3 className="font-semibold text-gray-900 mb-2">Biometric Auth</h3>
          <p className="text-sm text-gray-600">WebAuthn passkeys with FaceID & TouchID support</p>
        </div>
        <div className="humanwallet-card text-center p-6 rounded-lg bg-gradient-to-b from-indigo-50 to-purple-50">
          <div className="text-2xl mb-2">🛡️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Account Abstraction</h3>
          <p className="text-sm text-gray-600">Smart contract wallets with gasless transactions</p>
        </div>
        <div className="humanwallet-card text-center p-6 rounded-lg bg-gradient-to-b from-indigo-50 to-purple-50">
          <div className="text-2xl mb-2">🌐</div>
          <h3 className="font-semibold text-gray-900 mb-2">Universal Compatibility</h3>
          <p className="text-sm text-gray-600">Works with any EVM-compatible blockchain</p>
        </div>
      </div>
    </main>
  )
}
