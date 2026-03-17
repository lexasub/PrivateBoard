import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '1rem'
    }}>
      <h1>404</h1>
      <p>Page not found</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
