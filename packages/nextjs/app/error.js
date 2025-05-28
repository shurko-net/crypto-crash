"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Щось пішло не так!</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>Спробувати знову</button>
      </body>
    </html>
  );
}
