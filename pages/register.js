import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/register/`, {
        username,
        password,
        email,
      });
      setMessage('Registration successful!');
      setTimeout(() => {
        router.push('/login'); // Redirect to the login page after successful registration
      }, 1000); // Wait for 1 second to show the success message
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <form style={styles.form} onSubmit={handleRegister}>
          <h1 style={styles.header}>Register</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Register</button>
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  formWrapper: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    marginBottom: '1rem',
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  message: {
    color: '#333',
    textAlign: 'center',
    fontSize: '1rem',
  },
};
