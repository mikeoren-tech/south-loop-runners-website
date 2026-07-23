import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function LakeEffectCallout() {
  return (
    <section className="relative py-16 bg-background" aria-labelledby="lake-effect-heading">
      <div className="container mx-auto px-4">
        <Link
          href="https://www.tickettailor.com/events/southlooprunners/2310904"
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-3xl border border-border shadow-2xl transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slr-blue focus-visible:ring-offset-2"
        >
          <div className="relative aspect-[1200/500] w-full">
            <img
              src="/images/lake-effect-banner.png"
              alt="The Lake Effect - a point-to-point lakefront run plus Chicago trolley social"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4 bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl">
              <h2 id="lake-effect-heading" className="sr-only">
                The Lake Effect
              </h2>
              <p className="text-lg leading-relaxed text-card-foreground text-pretty">
                An 18.5 mile run from the north end of the Chicago Lakefront Path to the south end, with an optional
                paid trolley ride back.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slr-blue px-6 py-3 font-semibold text-white transition-colors group-hover:bg-slr-blue-light">
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
