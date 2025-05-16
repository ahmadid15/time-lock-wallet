import { useState, useEffect } from 'react';
import { Clock, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Lock, Unlock, Hourglass, Bitcoin } from 'lucide-react';

// Mock data for demo purposes
const initialWallets = [
  { 
    id: 'w1', 
    name: 'Main Wallet', 
    balance: 1.25, 
    addresses: [
      { 
        id: 'addr1', 
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
        balance: 0.75, 
        lockTime: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        isLocked: true 
      },
      { 
        id: 'addr2', 
        address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', 
        balance: 0.5, 
        lockTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago (unlocked)
        isLocked: false 
      }
    ]
  }
];

export default function TimeLockWallet() {
  const [wallets, setWallets] = useState(initialWallets);
  const [activeWallet, setActiveWallet] = useState(null);
  const [activeAddress, setActiveAddress] = useState(null);
  const [view, setView] = useState('wallets'); // wallets, createWallet, addresses, createAddress, fundAddress, spend
  const [newWalletName, setNewWalletName] = useState('');
  const [lockDays, setLockDays] = useState(1);
  const [fundAmount, setFundAmount] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [sendAmount, setSendAmount] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (wallets.length > 0 && !activeWallet) {
      setActiveWallet(wallets[0]);
    }
  }, [wallets]);

  // Helper to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Helper to check if an address is locked
  const isLocked = (address) => {
    const lockTime = new Date(address.lockTime);
    return lockTime > new Date();
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Create new wallet
  const handleCreateWallet = () => {
    if (!newWalletName.trim()) {
      showNotification('Please enter a wallet name', 'error');
      return;
    }

    const newWallet = {
      id: `w${wallets.length + 1}`,
      name: newWalletName,
      balance: 0,
      addresses: []
    };

    setWallets([...wallets, newWallet]);
    setActiveWallet(newWallet);
    setNewWalletName('');
    setView('addresses');
    showNotification('Wallet created successfully');
  };

  // Create new address
  const handleCreateAddress = () => {
    if (!activeWallet) return;
    
    const lockTime = new Date();
    lockTime.setDate(lockTime.getDate() + parseInt(lockDays));
    
    const newAddress = {
      id: `addr${activeWallet.addresses.length + 1}-${activeWallet.id}`,
      address: `1BTC${Math.random().toString(36).substring(2, 10)}`,
      balance: 0,
      lockTime: lockTime.toISOString(),
      isLocked: true
    };

    const updatedWallet = {
      ...activeWallet,
      addresses: [...activeWallet.addresses, newAddress]
    };

    setWallets(wallets.map(w => w.id === activeWallet.id ? updatedWallet : w));
    setActiveWallet(updatedWallet);
    setView('addresses');
    showNotification('Address created successfully');
  };

  // Fund address
  const handleFundAddress = () => {
    if (!activeAddress || !fundAmount || fundAmount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    const updatedAddress = {
      ...activeAddress,
      balance: activeAddress.balance + parseFloat(fundAmount)
    };

    const updatedWallet = {
      ...activeWallet,
      balance: activeWallet.balance + parseFloat(fundAmount),
      addresses: activeWallet.addresses.map(addr => 
        addr.id === activeAddress.id ? updatedAddress : addr
      )
    };

    setWallets(wallets.map(w => w.id === activeWallet.id ? updatedWallet : w));
    setActiveWallet(updatedWallet);
    setActiveAddress(updatedAddress);
    setFundAmount(0);
    setView('addresses');
    showNotification('Address funded successfully');
  };

  // Spend from address
  const handleSpend = () => {
    if (!activeAddress || !destinationAddress || !sendAmount || sendAmount <= 0) {
      showNotification('Please fill all fields with valid values', 'error');
      return;
    }

    if (isLocked(activeAddress)) {
      showNotification('This address is still time-locked', 'error');
      return;
    }

    if (sendAmount > activeAddress.balance) {
      showNotification('Insufficient funds', 'error');
      return;
    }

    const updatedAddress = {
      ...activeAddress,
      balance: activeAddress.balance - parseFloat(sendAmount)
    };

    const updatedWallet = {
      ...activeWallet,
      balance: activeWallet.balance - parseFloat(sendAmount),
      addresses: activeWallet.addresses.map(addr => 
        addr.id === activeAddress.id ? updatedAddress : addr
      )
    };

    setWallets(wallets.map(w => w.id === activeWallet.id ? updatedWallet : w));
    setActiveWallet(updatedWallet);
    setActiveAddress(updatedAddress);
    setDestinationAddress('');
    setSendAmount(0);
    setView('addresses');
    showNotification('Transaction completed successfully');
  };

  // Bitcoin icon component
  const BitcoinIcon = () => (
    <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.638 14.904c-1.602 6.425-8.113 10.342-14.542 8.738C2.67 22.037-1.244 15.525.36 9.1 1.962 2.675 8.473-1.243 14.9.36c6.425 1.603 10.342 8.115 8.738 14.544z" />
      <path d="M17.08 10.64c.16-1.082-.662-1.665-1.79-2.052l.366-1.47-1.368-.3431-.356 1.431c-.36-.09-.729-.1711-1.098-.253l.356-1.431L11.6 6.215l-.358 1.447c-.294-.0673-.592-.1327-.878-.203l.004-.018-1.889-.4718L8.099 8.424s1.024.235 1.005.249c.563.141.665.515.646.811l-.648 2.6c.037.01.085.023.139.043l-.141-.0351-.91 3.649c-.07.172-.246.43-.639.332.013.02-1.005-.25-1.005-.25l-.647 1.492 1.783.445c.33.083.657.168.976.249l-.367 1.478 1.364.3431.365-1.456c.371.1.746.1931 1.107.2891l-.37 1.462 1.365.3421.365-1.474c2.346.441 4.113.265 4.856-1.857.598-1.711-.03-2.705-1.268-3.35.896-.207 1.572-.8.753-2.35zm-2.21 5.053c-.426 1.707-3.299.785-4.229.551l.754-3.023c.93.2331 3.912.6961 3.475 2.471zm.424-4.422c-.387 1.551-2.837.822-3.624.641l.688-2.749c.787.1961 3.33.5491 2.936 2.108z" fill="#ffffff" />
    </svg>
  );

  // Render different views based on state
  const renderView = () => {
    switch (view) {
      case 'wallets':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-500">Your Wallets</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wallets.map(wallet => (
                <div 
                  key={wallet.id} 
                  className="p-4 bg-black rounded-lg shadow hover:shadow-lg cursor-pointer border-2 border-orange-400 transition-all duration-200 text-white"
                  onClick={() => {
                    setActiveWallet(wallet);
                    setView('addresses');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wallet className="text-orange-400" size={20} />
                      <h3 className="font-semibold">{wallet.name}</h3>
                    </div>
                    <div className="flex items-center space-x-1 font-bold text-yellow-400">
                      <BitcoinIcon /> 
                      <span>{wallet.balance}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-400 text-sm">
                    {wallet.addresses.length} addresses
                  </div>
                </div>
              ))}
              <div 
                className="p-4 bg-gray-900 rounded-lg border-2 border-dashed border-orange-400 hover:bg-gray-800 cursor-pointer flex flex-col items-center justify-center h-32 text-orange-400"
                onClick={() => setView('createWallet')}
              >
                <Plus size={24} />
                <span className="mt-2">Create New Wallet</span>
              </div>
            </div>
          </div>
        );
        
      case 'createWallet':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <button 
                className="text-orange-400 flex items-center"
                onClick={() => setView('wallets')}
              >
                <ArrowUpRight size={16} />
                <span className="ml-1">Back</span>
              </button>
              <h2 className="text-xl font-bold ml-4 text-orange-500">Create New Wallet</h2>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-orange-400 text-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-300">Wallet Name</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-black border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    value={newWalletName}
                    onChange={e => setNewWalletName(e.target.value)}
                    placeholder="My Wallet"
                  />
                </div>
                <button
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded hover:from-orange-600 hover:to-yellow-600 transition-colors"
                  onClick={handleCreateWallet}
                >
                  Create Wallet
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'addresses':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  className="text-orange-400 flex items-center"
                  onClick={() => setView('wallets')}
                >
                  <ArrowUpRight size={16} />
                  <span className="ml-1">Back</span>
                </button>
                <h2 className="text-xl font-bold ml-4 text-orange-500">{activeWallet?.name}</h2>
              </div>
              <div className="font-bold flex items-center space-x-1 text-yellow-400">
                <BitcoinIcon />
                <span>{activeWallet?.balance}</span>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-orange-400 text-white">
              <h3 className="font-semibold mb-4 text-orange-300">Addresses</h3>
              <div className="space-y-4">
                {activeWallet?.addresses.map(address => (
                  <div 
                    key={address.id} 
                    className="p-3 border border-orange-400 bg-black rounded hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setActiveAddress(address);
                      setView('addressDetails');
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {isLocked(address) ? (
                          <Lock size={16} className="text-red-500" />
                        ) : (
                          <Unlock size={16} className="text-green-400" />
                        )}
                        <div className="font-mono text-sm truncate max-w-xs text-gray-300">
                          {address.address}
                        </div>
                      </div>
                      <div className="font-bold flex items-center space-x-1 text-yellow-400">
                        <BitcoinIcon />
                        <span>{address.balance}</span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {isLocked(address) ? (
                        <span>Locked until {formatDate(address.lockTime)}</span>
                      ) : (
                        <span>Unlocked</span>
                      )}
                    </div>
                  </div>
                ))}
                <div 
                  className="p-3 border border-dashed border-orange-400 rounded hover:bg-gray-800 cursor-pointer flex items-center justify-center text-orange-400"
                  onClick={() => setView('createAddress')}
                >
                  <Plus size={16} />
                  <span className="ml-2">Create New Address</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'createAddress':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <button 
                className="text-orange-400 flex items-center"
                onClick={() => setView('addresses')}
              >
                <ArrowUpRight size={16} />
                <span className="ml-1">Back</span>
              </button>
              <h2 className="text-xl font-bold ml-4 text-orange-500">Create New Address</h2>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-orange-400 text-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-300">Lock Time (days)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 bg-black border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    value={lockDays}
                    onChange={e => setLockDays(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Funds will be locked until {formatDate(new Date(Date.now() + parseInt(lockDays || 1) * 86400000))}
                  </p>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded hover:from-orange-600 hover:to-yellow-600 transition-colors"
                  onClick={handleCreateAddress}
                >
                  Create Address
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'addressDetails':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <button 
                className="text-orange-400 flex items-center"
                onClick={() => setView('addresses')}
              >
                <ArrowUpRight size={16} />
                <span className="ml-1">Back</span>
              </button>
              <h2 className="text-xl font-bold ml-4 text-orange-500">Address Details</h2>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-orange-400 text-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-orange-300">Address</div>
                  <div className="font-mono text-sm text-gray-300">{activeAddress?.address}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-orange-300">Balance</div>
                  <div className="font-bold flex items-center space-x-1 text-yellow-400">
                    <BitcoinIcon />
                    <span>{activeAddress?.balance}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-orange-300">Status</div>
                  <div className="flex items-center">
                    {activeAddress && isLocked(activeAddress) ? (
                      <>
                        <Lock size={16} className="text-red-500 mr-1" />
                        <span className="text-red-400">Locked until {formatDate(activeAddress.lockTime)}</span>
                      </>
                    ) : (
                      <>
                        <Unlock size={16} className="text-green-400 mr-1" />
                        <span className="text-green-400">Unlocked</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded hover:from-orange-600 hover:to-yellow-600 transition-colors flex items-center justify-center"
                    onClick={() => setView('fundAddress')}
                  >
                    <ArrowDownLeft size={16} className="mr-1" />
                    Fund
                  </button>
                  <button
                    className={`flex-1 py-2 rounded flex items-center justify-center ${
                      activeAddress && !isLocked(activeAddress)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (activeAddress && !isLocked(activeAddress)) {
                        setView('spend');
                      } else {
                        showNotification('Address is still time-locked', 'error');
                      }
                    }}
                  >
                    <ArrowUpRight size={16} className="mr-1" />
                    Spend
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'fundAddress':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <button 
                className="text-orange-400 flex items-center"
                onClick={() => setView('addressDetails')}
              >
                <ArrowUpRight size={16} />
                <span className="ml-1">Back</span>
              </button>
              <h2 className="text-xl font-bold ml-4 text-orange-500">Fund Address</h2>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-orange-400 text-white">
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-sm mb-4 bg-black p-2 rounded border border-orange-300 text-gray-300">
                    {activeAddress?.address}
                  </div>
                  <label className="block text-sm font-medium mb-1 text-orange-300">Amount (BTC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      className="w-full p-2 pl-8 bg-black border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      value={fundAmount}
                      onChange={e => setFundAmount(e.target.value)}
                    />
                    <div className="absolute left-2 top-2 text-yellow-400">
                      <BitcoinIcon />
                    </div>
                  </div>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded hover:from-orange-600 hover:to-yellow-600 transition-colors"
                  onClick={handleFundAddress}
                >
                  Fund Address
                </button>
                <div className="text-sm text-gray-400">
                  {activeAddress && isLocked(activeAddress) && (
                    <div className="flex items-center text-red-400 bg-red-900 bg-opacity-20 p-2 rounded">
                      <Hourglass size={16} className="mr-1" />
                      <span>Funds will be locked until {formatDate(activeAddress.lockTime)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'spend':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <button 
                className="text-orange-400 flex items-center"
                onClick={() => setView('addressDetails')}
              >
                <ArrowUpRight size={16} />
                <span className="ml-1">Back</span>
              </button>
              <h2 className="text-xl font-bold ml-4 text-orange-500">Spend</h2>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg shadow border border-orange-400 text-white">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-orange-300">From</label>
                    <span className="text-sm text-yellow-400 flex items-center">
                      Available: <BitcoinIcon /> <span className="ml-1">{activeAddress?.balance}</span>
                    </span>
                  </div>
                  <div className="font-mono text-sm mb-4 bg-black p-2 rounded border border-orange-300 truncate text-gray-300">
                    {activeAddress?.address}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-300">Destination Address</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-black border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    value={destinationAddress}
                    onChange={e => setDestinationAddress(e.target.value)}
                    placeholder="Recipient's BTC address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-300">Amount (BTC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      max={activeAddress?.balance}
                      className="w-full p-2 pl-8 bg-black border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      value={sendAmount}
                      onChange={e => setSendAmount(e.target.value)}
                    />
                    <div className="absolute left-2 top-2 text-yellow-400">
                      <BitcoinIcon />
                    </div>
                  </div>
                </div>
                
                <button
                  className={`w-full py-2 rounded ${
                    activeAddress && !isLocked(activeAddress)
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleSpend}
                  disabled={activeAddress && isLocked(activeAddress)}
                >
                  Send BTC
                </button>
                
                {activeAddress && isLocked(activeAddress) && (
                  <div className="text-sm text-red-400 flex items-center bg-red-900 bg-opacity-20 p-2 rounded">
                    <Lock size={16} className="mr-1" />
                    <span>Funds are locked until {formatDate(activeAddress.lockTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black shadow-lg border-b border-orange-500">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-orange-500 mr-3 flex items-center justify-center rounded-full bg-black p-1 border border-orange-400">
              <Bitcoin size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Time-Lock BTC Wallet</h1>
          </div>
          <div className="text-sm font-medium text-gray-400 bg-black px-2 py-1 rounded border border-orange-500">
            Demo Version
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderView()}
      </main>
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white border ${notification.type === 'error' ? 'border-red-700' : 'border-green-700'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}