const mockData = {
    '/api/message': {message: "Test"},
};

export const fetch = (url) => 
  new Promise((resolve) => {
    setTimeout(() => resolve({
      json: () => Promise.resolve(mockData[url]),
    }), 500); // Имитация задержки сети
  });
