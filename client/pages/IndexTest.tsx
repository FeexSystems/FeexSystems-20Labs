export default function IndexTest() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          🎉 FeexSystems Is Working!
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#ccc',
          marginBottom: '0.5rem'
        }}>
          React app is successfully mounted and rendering
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: '#999'
        }}>
          This is a test component to verify the setup
        </p>
      </div>
    </div>
  );
}
