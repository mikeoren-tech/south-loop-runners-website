import Image from "next/image"

export function Hero() {
  return (
    <section className="relative w-full bg-gray-900 overflow-hidden">
      <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px]">
        <Image
          src="/slr-group-celebrating-medals.jpg"
          alt="South Loop Runners group celebrating after Chicago Marathon with medals"
          fill
          className="object-cover object-center"
          priority
          quality={95}
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <Image
            src="/slr-logo.png"
            alt="South Loop Runners Logo"
            width={120}
            height={120}
            className="drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      <div className="absolute bottom-[80px] left-0 right-0 z-10 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-black/50 backdrop-blur-md rounded-3xl p-8 mx-auto max-w-3xl shadow-2xl">
              <p className="text-sm md:text-base text-white/90 font-semibold mb-4 drop-shadow-lg tracking-wide uppercase">
                More Than Miles: South Loop Smiles
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance text-white drop-shadow-2xl mb-4">
                South Loop Runners
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/95 font-medium text-balance drop-shadow-lg">
                Chicago's premier running community in the heart of the South Loop
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 -mb-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <defs>
            <linearGradient id="heroWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" stopOpacity="0" />
              <stop offset="40%" stopColor="rgba(0,0,0,0.2)" stopOpacity="0.2" />
              <stop offset="70%" stopColor="rgba(0,0,0,0.4)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.5)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="url(#heroWaveGradient)"
          />
        </svg>
      </div>
    </section>
  )
}
