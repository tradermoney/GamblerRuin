import React from 'react';
import Tooltip from './Tooltip';
import styles from './HelpIcon.module.css';

interface HelpIconProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const HelpIcon: React.FC<HelpIconProps> = ({ content, position = 'top' }) => {
  return (
    <Tooltip content={content} position={position}>
      <span className={styles.helpIcon}>?</span>
    </Tooltip>
  );
};

export default HelpIcon;
