import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages (lazy loaded)
const Home = lazy(() => import("./pages/Home"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyPosts = lazy(() => import("./pages/MyPosts"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="grow container mx-auto px-4 py-8">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blogs/:id" element={<BlogDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/my-posts" element={<MyPosts />} />
                    <Route path="/blogs/create" element={<CreateBlog />} />
                    <Route path="/blogs/:id/edit" element={<EditBlog />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
