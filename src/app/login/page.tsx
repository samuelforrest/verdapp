'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMsg(error.message);
    else router.push('/dashboard');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#2ab985',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
    },
    form: {
      backgroundColor: '#fff',
      padding: '40px 30px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
      boxSizing: 'border-box' as const,
    },
    heading: {
      marginBottom: '24px',
      fontSize: '1.8rem',
      color: '#333',
      textAlign: 'center' as const,
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      marginBottom: '20px',
      borderRadius: '5px',
      border: '1.5px solid #2ab985',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: { borderColor: '#2ab985' },
    button: {
      width: '100%',
      padding: '12px 15px',
      backgroundColor: '#2ab985',
      color: '#fff',
      fontWeight: '600',
      fontSize: '1.1rem',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: { backgroundColor: '#259c74' },
    error: {
      color: '#e63946',
      marginTop: '10px',
      fontWeight: '600',
      textAlign: 'center' as const,
    },
    link: {
      marginTop: '16px',
      fontSize: '0.9rem',
      textAlign: 'center' as const,
      color: '#2ab985',
      textDecoration: 'none',
    },
  };

  const [hover, setHover] = useState(false);

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <h1 style={styles.heading}>Please Login First</h1>
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
          onBlur={(e) => (e.currentTarget.style.borderColor = styles.input.border)}
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
          onBlur={(e) => (e.currentTarget.style.borderColor = styles.input.border)}
        />
        <button
          type="submit"
          style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Log In
        </button>
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        <Link href="/signup" style={styles.link}>Don’t have an account? Sign up here</Link>
      </form>
    </div>
  );
}