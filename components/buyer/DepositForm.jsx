import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import '@/styles/Forms.css';

const DepositForm = ({ onDeposit }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  
  const availableCoins = [5, 10, 20, 50, 100];
  
  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };
  
  const handleDeposit = () => {
    if (selectedCoin) {
      onDeposit(selectedCoin);
      setSelectedCoin(null); // Reset selection after deposit
    }
  };
  
  return (
    <div className="deposit-form">
      <div className="coin-selection">
        {availableCoins.map(coin => (
          <button
            key={coin}
            className={`coin ${selectedCoin === coin ? 'selected' : ''}`}
            onClick={() => handleCoinSelect(coin)}
          >
            {coin}¢
          </button>
        ))}
      </div>
      
      <div className="deposit-actions">
        <Button 
          onClick={handleDeposit} 
          disabled={!selectedCoin}
          variant="primary"
        >
          Deposit {selectedCoin ? `${selectedCoin}¢` : ''}
        </Button>
      </div>
    </div>
  );
};

export default DepositForm;