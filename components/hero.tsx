import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-10">
            <Image
              src="/slr-logo.jpg"
              alt="South Loop Runners"
              width={500}
              height={375}
              className="w-full max-w-lg h-auto"
              priority
            />
          </div>
          <p className="text-base md:text-lg text-gray-500 mt-0 mb-6">More Than Miles: South Loop Smiles</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-gray-900">
            South Loop Runners
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 text-balance">
            Chicago's premier running community in the heart of the South Loop
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  )
}
