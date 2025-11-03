import { Megaphone } from "lucide-react"
import Link from "next/link"

export function AnnouncementBanner() {
  return (
    <Link
      href="https://docs.google.com/forms/d/e/1FAIpQLSddb2wsdmhb6WqeRexSnHHGBAhB6sW1BRzYqYfR3tQ3ueVBRQ/viewform?usp=dialog"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-r from-[#b4def7] to-[#d4ebfa] hover:from-[#a0d4f0] hover:to-[#c0e0f5] transition-colors"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            
            <p className="text-gray-900 font-medium">
              Help us improve! Take our quick community survey and share your feedback.
            </p>
          </div>
          <span className="bg-[#d92a31] hover:bg-[#b91f26] text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap transition-colors">
            Take Survey →
          </span>
        </div>
      </div>
    </Link>
  )
}
