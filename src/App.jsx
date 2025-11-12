import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [checkedInGuests, setCheckedInGuests] = useState([]);

  useEffect(() => {
    if (!isScanning) return;

    // Initialize QR Scanner
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText) {
      try {
        // Parse the QR code data (it's JSON)
        const data = JSON.parse(decodedText);
        
        // Stop scanning and show result
        scanner.clear();
        setScanResult(data);
        setIsScanning(false);
        
        // Add to checked-in list
        setCheckedInGuests(prev => [...prev, {
          ...data,
          checkedInAt: new Date().toISOString()
        }]);

        // Auto-reset after 5 seconds
        setTimeout(() => {
          setScanResult(null);
          setIsScanning(true);
        }, 5000);
        
      } catch (e) {
        alert('Invalid QR Code format');
      }
    }

    function onScanError(error) {
      // Silent error handling for scanning attempts
    }

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isScanning]);

  // Determine background color based on photo consent
  const getBackgroundColor = (consent) => {
    return consent === 'YES' 
      ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'  // Green
      : 'linear-gradient(135deg, #e52d27 0%, #b31217 100%)';  // Red
  };

  const getWristbandColor = (consent) => {
    return consent === 'YES' ? 'GREEN' : 'RED';
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      
      {/* Header */}
      <h1 style={{ 
        textAlign: 'center',
        color: '#333',
        marginBottom: '10px'
      }}>
        🎤 Workforce Debates Vol. 5
      </h1>
      <h2 style={{ 
        textAlign: 'center',
        color: '#666',
        fontSize: '18px',
        marginBottom: '30px'
      }}>
        Event Check-In System
      </h2>

      {/* Scanner Section */}
      {isScanning && !scanResult && (
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ textAlign: 'center', color: '#333' }}>
            📱 Scan Guest QR Code
          </h3>
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </div>
      )}

      {/* Result Display - BIG COLORED SCREEN */}
      {scanResult && (
        <div style={{
          background: getBackgroundColor(scanResult.photoConsent),
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
          animation: 'fadeIn 0.5s',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          
          {/* Main Status */}
          <h2 style={{ 
            fontSize: '48px', 
            margin: '0 0 30px 0',
            fontWeight: 'bold'
          }}>
            {scanResult.photoConsent === 'YES' ? '✅ PHOTOS OK' : '❌ NO PHOTOS'}
          </h2>
          
          {/* Attendee Info */}
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <p style={{ fontSize: '24px', margin: '10px 0' }}>
              📱 {scanResult.phone}
            </p>
            <p style={{ fontSize: '18px', margin: '10px 0' }}>
              🎤 {scanResult.eventName || 'Workforce Debates Vol. 5'}
            </p>
          </div>

          {/* Wristband Instruction */}
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '30px',
            borderRadius: '10px',
            color: '#333'
          }}>
            <h3 style={{ 
              fontSize: '36px',
              margin: '0 0 10px 0',
              color: scanResult.photoConsent === 'YES' ? '#11998e' : '#e52d27'
            }}>
              Give {getWristbandColor(scanResult.photoConsent)} Wristband
            </h3>
            <p style={{ fontSize: '18px', margin: 0 }}>
              {scanResult.photoConsent === 'YES' 
                ? '🟢 Guest consents to photos' 
                : '🔴 Guest does NOT consent to photos'}
            </p>
          </div>

          {/* Manual Next Button */}
          <button
            onClick={() => {
              setScanResult(null);
              setIsScanning(true);
            }}
            style={{
              marginTop: '30px',
              padding: '15px 40px',
              fontSize: '18px',
              background: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#333',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}
          >
            ✓ Scan Next Guest
          </button>
        </div>
      )}

      {/* Check-in Stats */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          📊 Check-In Stats
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
          textAlign: 'center'
        }}>
          <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
              {checkedInGuests.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Total</div>
          </div>
          <div style={{ padding: '15px', background: '#d4edda', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#155724' }}>
              {checkedInGuests.filter(g => g.photoConsent === 'YES').length}
            </div>
            <div style={{ fontSize: '14px', color: '#155724' }}>Green</div>
          </div>
          <div style={{ padding: '15px', background: '#f8d7da', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#721c24' }}>
              {checkedInGuests.filter(g => g.photoConsent === 'NO').length}
            </div>
            <div style={{ fontSize: '14px', color: '#721c24' }}>Red</div>
          </div>
        </div>

        {/* Recent Check-ins */}
        {checkedInGuests.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#333', marginBottom: '10px' }}>Recent Check-ins</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {checkedInGuests.slice().reverse().slice(0, 10).map((guest, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '10px',
                    background: '#f9f9f9',
                    marginBottom: '5px',
                    borderRadius: '5px',
                    borderLeft: `4px solid ${guest.photoConsent === 'YES' ? '#11998e' : '#e52d27'}`
                  }}
                >
                  <strong>{guest.phone}</strong> - {guest.photoConsent === 'YES' ? '🟢' : '🔴'}
                  <span style={{ float: 'right', fontSize: '12px', color: '#999' }}>
                    {new Date(guest.checkedInAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📝 Instructions</h4>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
          <li>Ask guest to show QR code from WhatsApp</li>
          <li>Hold phone steady to scan</li>
          <li>GREEN screen = Give green wristband (photos OK)</li>
          <li>RED screen = Give red wristband (no photos)</li>
          <li>Click "Scan Next Guest" to continue</li>
        </ol>
      </div>
    </div>
  );
}

export default App;