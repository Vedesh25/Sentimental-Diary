import { useState, useEffect } from 'react';
import Menu from "../src/Components/Menu";
import Sidebar from "../src/Components/Sidebar";
import Hero from "../src/Components/Hero";
import Footer from "../src/Components/Footer";
import Output from './Components/Output';
import axios from 'axios';

// Configure axios
axios.defaults.baseURL = 'http://localhost:5000'; // Update this with your backend URL

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPage, setSelectedPage] = useState(null);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
  }, [selectedDate]);

  const fetchPages = async () => {
    try {
      const response = await axios.get('/pages', {
        params: { date: selectedDate.toISOString().split('T')[0] }
      });
      setPages(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pages');
      console.error('Error fetching pages:', err);
    }
  };

  const handleAddPage = async () => {
    const pagesForSelectedDate = pages.filter(
      page => page.date === selectedDate.toISOString().split('T')[0]
    );

    const newPage = {
      title: `Page ${pagesForSelectedDate.length + 1}`,
      date: selectedDate.toISOString().split('T')[0],
      content: ''
    };

    try {
      const response = await axios.post('/pages', newPage);
      setPages([...pages, response.data]);
      setSelectedPage(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add page');
      console.error('Error adding page:', err);
    }
  };

  const handleDeletePage = async (pageId) => {
    try {
      await axios.delete(`/pages/${pageId}`);
      setPages(pages.filter(page => page._id !== pageId));
      if (selectedPage?._id === pageId) {
        setSelectedPage(null);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete page');
      console.error('Error deleting page:', err);
    }
  };

  const handleContentChange = async (pageId, newContent) => {
    try {
      await axios.put(`/pages/${pageId}`, { content: newContent });
      setPages(pages.map(page =>
        page._id === pageId ? { ...page, content: newContent } : page
      ));
      if (selectedPage?._id === pageId) {
        setSelectedPage({ ...selectedPage, content: newContent });
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update page');
      console.error('Error updating page:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <header>
        <Menu />
      </header>
      <main className="flex-grow flex flex-row">
        <Sidebar 
          onDateChange={setSelectedDate}
          onPageChange={setSelectedPage}
          pages={pages}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          selectedDate={selectedDate}
        />
        <div className='flex flex-col border-l-2 w-full p-5'>
          <Hero 
            selectedDate={selectedDate} 
            selectedPage={selectedPage} 
            onContentChange={handleContentChange}
          />
          <Output selectedPage={selectedPage} />
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 w-full">
        <Footer />
      </footer>
    </div>
  );
}

export default App;