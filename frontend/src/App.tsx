import React, { useEffect, useState } from 'react';
/* Используется только для отладки.
import { fetch } from './api/mockApi' */

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('/api/message')
      .then(res => res.json())
      .then(res => setData(res.message));
  }, []);

  return (
    <div>
      <h1>React + Django</h1>
      <p>Сообщение с бэкенда: {data}</p>
    </div>
  );
}

export default App;
