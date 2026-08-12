import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Quote from './pages/Quote'
import Login from './pages/Login'
import Account from './pages/Account'
import List from './pages/List'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
      <Route path="/quote" element={<Quote />} />
<Route path="/login" element={<Login />} />
<Route path="/account" element={<Account />} />
<Route path="/list" element={<List />} />
<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
