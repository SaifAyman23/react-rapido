import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-md"
      >
        Skip to content
      </a> */}
      {/* <Navbar /> */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
