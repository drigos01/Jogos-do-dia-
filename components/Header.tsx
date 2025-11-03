import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onOpenHitRateModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, onOpenHitRateModal }) => {
  // ... código do componente ...
};

export default Header; // ← Deve ter export default
