export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center text-white mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Portfolio Personal
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Desarrollador Full Stack especializado en crear experiencias web modernas y escalables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Ver Proyectos
            </button>
            <button className="border border-gray-300 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Descargar CV
            </button>
          </div>
        </section>

        {/* Projects Preview */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Proyectos Destacados
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((project) => (
              <div key={project} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="h-48 bg-gray-600 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Proyecto {project}
                </h3>
                <p className="text-gray-300 mb-4">
                  Descripción del proyecto y tecnologías utilizadas.
                </p>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                    Ver Demo
                  </button>
                  <button className="border border-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors">
                    GitHub
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center text-white">
          <h2 className="text-3xl font-bold mb-8">Contacto</h2>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Email
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
