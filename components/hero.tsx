import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20">
      <Image
        src="/hero-resort.png"
        alt="Gramamstays Luxury Resort"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 text-center text-white max-w-3xl px-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-4 text-balance">
          Welcome to Gramamstays
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-balance">
          Experience luxury in perfect harmony with nature
        </p>
        <button className="px-8 py-4 bg-secondary text-white rounded-lg hover:bg-accent transition-all font-semibold text-lg shadow-lg">
          Reserve Your Escape
        </button>
      </div>
    </section>
  )
}
