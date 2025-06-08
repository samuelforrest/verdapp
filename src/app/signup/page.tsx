'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hover, setHover] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setErrorMsg('');

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setErrorMsg(signUpError.message);
      return;
    }

    const user = signUpData.user;

    if (user) {
      const { error: profileError } = await supabase
        .from('profiles') // Or 'users', depending on your DB schema
        .insert([
          {
            id: user.id,
            email: email,
            full_name: fullName,
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        setErrorMsg('Account created, but profile not saved.');
        return;
      }

      router.push('/history');
    } else {
      setErrorMsg('Account created, but no user data returned.');
    }
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

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
        <h1 style={styles.heading}>Create an Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          style={styles.input}
          onChange={e => setFullName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor)}
          onBlur={(e) => (e.currentTarget.style.borderColor = styles.input.border)}
        />
        <button
          type="submit"
          style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Sign Up
        </button>
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        <Link href="/login" style={styles.link}>Already have an account? Log in</Link>
      </form>
    </div>
  );
}