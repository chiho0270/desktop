import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layout'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './Nav';
import Home from './Discover/Home'
import Dashboard from './Discover/Dashboard'
import Search from './Discover/Search'
import Chatbot from './Discover/Chatbot'
import Comparison from './Discover/Comparison'
import Chart from './Discover/Chart'
import History from './Library/History'
import Wishlist from './Library/Wishlist'
import Login from './Login'
import Signup from './Signup'
import User from './User'
import PostCreate from './Discover/PostCreate';
import PostDetail from './Discover/PostDetail';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider> 
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/chart" element={<Chart />} />
              <Route path="/history" element={<History />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/user" element={<User />} />
              <Route path="/dashboard/new" element={<PostCreate />} />
              <Route path="/dashboard/posts/:id" element={<PostDetail />} /> 
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
