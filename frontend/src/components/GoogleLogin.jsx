
import React, { useEffect, useCallback } from 'react';

export default function GoogleLogin({ onLoginSuccess }) {
  // Credential handler defined before useEffect
  const handleCredentialResponse = useCallback(async (response) => {
    const idToken = response.credential;

    try {
      const res = await fetch('http://localhost:8000/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        onLoginSuccess(data.user);
      } else {
        console.error('Google login failed:', await res.text());
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  }, [onLoginSuccess]);

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: '794068868736-ndm7b7dqs5le977gb2uiidmhfh0phmvl.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );

      // Optional: prompt automatically (One Tap)
      // window.google.accounts.id.prompt();
    } else {
      console.warn('Google API not loaded yet.');
    }
  }, [handleCredentialResponse]);

  return <div id="google-signin-button"></div>;
}