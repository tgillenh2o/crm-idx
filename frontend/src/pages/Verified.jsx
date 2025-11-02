import React from "react";

export default function Verified() {
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#121212",
      color: "white",
      flexDirection: "column",
      textAlign: "center",
      padding: "2rem",
    },
    heading: {
      fontSize: "2rem",
      marginBottom: "1rem",
      color: "#4BB543",
    },
    text: {
      fontSize: "1.2rem",
      marginBottom: "2rem",
    },
    button: {
      background: "#FF6B6B",
      color: "white",
      padding: "0.8rem 1.2rem",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎉 Your email has been verified!</h1>
      <p style={styles.text}>
        Thank you for confirming your email. You can now log in to your account.
      </p>
      <a href="/login" style={styles.button}>
        Go to Login
      </a>
    </div>
  );
}
