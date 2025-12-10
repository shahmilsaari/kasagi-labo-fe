import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { AnimeDetail } from '@/components/AnimeDetail';
import { Favorites } from '@/components/Favorites';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
