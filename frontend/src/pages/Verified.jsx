import React from "react";

export default function Verified() {
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "0 20px",
  },
  heading: {
    fontSize: "2rem",
    color: "#4BB543",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.1rem",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#4BB543",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};
