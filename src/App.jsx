import Navbar from "./sections/Navbar"

const App = () => {
  return (
    <div className="relative w-screen min-h-screen overflow-x-auto">
      <Navbar />
      <section  id="home"className="flex items-center justify-center w-screen h-screen bg-gray-200">
        <h1 className="text-6xl font-bold">Scroll Down</h1>
      </section>
      <section id="services"className="flex items-center justify-center w-screen h-screen bg-gray-400">
        <h1 className="text-6xl font-bold">Section 2</h1>
      </section>
      <section id="about" className="flex items-center justify-center w-screen h-screen bg-gray-600">
        <h1 className="text-6xl font-bold text-white">Section 3</h1>
      </section>
    </div>
  )
}

export default App