const API_URL = 'http://localhost:5000/api';

export const apiService = {
  fetchPages: async () => {
    const response = await fetch(`${API_URL}/pages`);
    return response.json();
  },

  createPage: async (pageData) => {
    const response = await fetch(`${API_URL}/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData),
    });
    return response.json();
  },

  updatePage: async (pageId, content) => {
    const response = await fetch(`${API_URL}/pages/${pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  deletePage: async (pageId) => {
    await fetch(`${API_URL}/pages/${pageId}`, {
      method: 'DELETE',
    });
  }
};
