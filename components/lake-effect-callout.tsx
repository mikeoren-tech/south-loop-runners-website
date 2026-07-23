import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function LakeEffectCallout() {
  return (
    <section className="relative py-16 bg-black" aria-labelledby="lake-effect-heading">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          <a
            href="https://www.tickettailor.com/events/southlooprunners/2310904"
            target="_blank"
            rel="noopener noreferrer"
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-slr-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <div className="relative aspect-[1200/500] w-full overflow-hidden">
              <img
                src="/images/lake-effect-banner.png"
                alt="The Lake Effect - a point-to-point lakefront run plus Chicago trolley social"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </a>
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-3xl">
              <h2 id="lake-effect-heading" className="text-3xl md:text-4xl font-bold text-white text-balance mb-3">
                The Lake Effect
              </h2>
              <p className="text-lg leading-relaxed text-white/80 text-pretty">
                An 18.5 mile run from the north end of the Chicago Lakefront Path to the south end, with an optional
                paid trolley ride back.
              </p>
            </div>
            <Button
              size="lg"
              className="shimmer-button shrink-0 gap-2 bg-slr-blue hover:bg-slr-blue/90 text-slr-blue-dark shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a
                href="https://www.tickettailor.com/events/southlooprunners/2310904"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                <span className="sr-only">Opens in new window</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
