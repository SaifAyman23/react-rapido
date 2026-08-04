import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MainLayout from './MainLayout'

import { SeoUpdater } from '@/components/SeoUpdater'
import { ROUTES } from '@/lib/constants'

const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/auth/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('@/pages/auth/Register').then((m) => ({ default: m.Register })))
const ForgotPassword = lazy(() =>
  import('@/pages/auth/ForgotPassword').then((m) => ({ default: m.ForgotPassword }))
)
const VerifyOTP = lazy(() =>
  import('@/pages/auth/VerifyOTP').then((m) => ({ default: m.VerifyOTP }))
)
const ResetPassword = lazy(() =>
  import('@/pages/auth/ResetPassword').then((m) => ({ default: m.ResetPassword }))
)

function App() {
  return (
    <Router>
      <SeoUpdater />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            {/* Future authenticated routes go here */}
          </Route>

          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.VERIFY_OTP} element={<VerifyOTP />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
