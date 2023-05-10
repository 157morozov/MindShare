import { Route, Routes } from "react-router-dom"

import Header from "./components/Header.jsx"

import Home from "./pages/Home.jsx"
import NotFound from "./pages/NotFound.jsx"
import Login from "./pages/Login.jsx"
import Profile from "./pages/Profile.jsx"
import Search from "./pages/Search.jsx"

import "../public/css/app.css"

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={ <Search/> }/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
