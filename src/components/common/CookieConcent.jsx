import React from 'react';
import { Cookie } from "lucide-react";
import { motion } from 'framer-motion';
const CookieConsent = ({ onAccept, onDecline }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={styles.overlay}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={styles.container}
      >
        <div style={styles.iconWrapper}>
          <Cookie style={styles.icon} />
        </div>
        <p style={styles.text}>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </p>
        <div style={styles.buttons}>
          <button onClick={onAccept} style={styles.acceptButton}>Accept</button>
          <button onClick={onDecline} style={styles.declineButton}>Decline</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    // background: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    maxWidth: 'auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  iconWrapper: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#f39c12',
  },
  icon: {
    verticalAlign: 'middle',
  },
  text: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '1rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  acceptButton: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  declineButton: {
    backgroundColor: '#bdc3c7',
    color: '#2c3e50',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default CookieConsent;

