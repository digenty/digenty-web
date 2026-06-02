import FAQSection from "@/components/website/FAQSection";
import FeaturesSection from "@/components/website/FeaturesSection";
import Footer from "@/components/website/Footer";
import HeroSection from "@/components/website/HeroSection";
import HowItWorksSection from "@/components/website/HowItWorksSection";
import Navbar from "@/components/website/Navbar";
import PricingSection from "@/components/website/PricingSection";
import TestimonialsSection from "@/components/website/TestimonialsSection";
import WhyItMattersSection from "@/components/website/WhyItMattersSection";
import WhoWeAreSection from "@/components/website/WhoWeAreSection";
import AnimateIn from "@/components/website/AnimateIn";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main>
        <HeroSection />
        <WhyItMattersSection />
        <FeaturesSection />
        <WhoWeAreSection />
        <HowItWorksSection />
        <TestimonialsSection />

        {/* CTA Banner */}
        <section className="px-4 py-8">
          <div className="relative mx-auto max-w-9xl overflow-hidden rounded-2xl bg-[#56D197]/10 px-8 py-16 text-center">
            {/* Axis watermark */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
              viewBox="0 0 1398 302"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M356.489 100.232C361.612 99.0893 369.175 98.8624 374.448 99.8035C386.579 101.969 391.34 111.702 397.588 121.223L411.201 142.076L458.746 214.857C447.064 216.001 435.368 217.021 423.664 217.918L408.841 194.502C398.403 195.211 387.459 196.302 376.997 197.19L332.337 200.987C328.957 209.579 325.436 218.115 321.775 226.592C310.176 227.699 298.566 228.687 286.946 229.555C288.392 227.129 290.594 221.566 291.81 218.713L300.272 198.867L326.312 138.833C328.068 134.734 329.929 130.468 331.65 126.37C337.338 112.826 340.718 103.618 356.489 100.232ZM364.102 126.742C361.12 132.091 357.806 140.608 355.379 146.432L342.544 177.059L369.524 174.748L394.864 172.585C391.43 167.27 366.76 127.622 364.102 126.742Z"
                fill="#E7B413"
                fillOpacity="0.25"
              />
              <path
                d="M714.685 70.043C745.445 66.9366 777.052 64.5882 807.925 61.9448C808.081 69.2385 808.62 77.0341 803.709 83.0498C801.025 86.3332 796.025 88.6175 791.944 89.6038C784.682 91.3586 776.206 91.6467 768.681 92.3104C753.927 93.6111 739.131 94.6777 724.387 96.0414C721.181 96.3928 716.778 97.2209 714.755 99.9565C711.589 104.23 712.439 114.574 717.754 116.888C722.735 119.054 730.134 117.775 735.486 117.298L767.82 114.418C793.202 112.192 815.515 109.983 819.54 143.025C823.115 172.372 813.329 184.112 783.81 187.107L689.04 195.165C688.643 187.786 688.724 180.624 693.521 174.366C696.077 171.032 700.58 168.684 704.597 167.645C711.609 165.832 719.965 165.53 727.239 164.887C743.932 163.412 760.68 162.209 777.366 160.656C780.988 160.268 785.204 159.094 787.442 156.02C790.408 151.943 789.469 140.596 784.337 138.494C779.806 136.638 772.575 137.784 767.646 138.216L739.737 140.681C713.708 142.987 686.853 148.36 682.32 113.738C678.778 86.6528 687.246 73.699 714.685 70.043Z"
                fill="#E7B413"
                fillOpacity="0.25"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M520.991 139.145C562.685 68.0484 624.703 18.0435 710.371 18.2172C688.591 22.4544 667.78 30.667 648.977 42.4442C643.768 45.6756 638.949 49.3181 633.847 52.7179C631.087 55.546 626.595 58.7201 623.474 61.3571C618.296 65.8075 613.292 70.4559 608.47 75.2916C588.92 94.7827 572.882 119.215 558.358 142.518C565.199 149.231 572.113 155.867 579.098 162.425C580.83 164.07 588.286 171.09 589.437 172.665C596.853 179.002 603.846 186.452 610.983 193.128C613.307 195.299 617.101 199.342 619.447 201.183C609.388 202.102 582.299 206.508 575.287 201.091C571.321 199.343 546.194 174.487 541.247 169.765C537.44 174.708 533.788 180.485 529.905 185.626C521.684 196.439 512.607 206.573 502.761 215.93C465.496 251.257 418.886 271.069 367.198 269.72C378.161 267.041 387.135 264.815 397.766 260.582C438.819 244.236 469.638 213.954 495.087 178.702C500.236 171.57 504.698 164.516 509.592 157.275C512.66 151.349 517.543 145.025 520.991 139.145ZM395.808 47.4098C399.747 46.313 405.616 46.5313 409.676 46.5565C450.567 46.8124 485.176 71.9445 513.023 99.5796C517.211 103.735 521.856 107.825 525.768 112.264C522.439 118.235 513.033 133.81 509.119 139.232C483.317 114.726 460.385 86.7811 426.958 72.7292C421.806 70.6181 416.476 68.9717 411.031 67.8084C409.894 67.5598 403.097 66.2439 402.366 65.958C362.223 62.7218 329.61 82.1325 302.796 110.484C304.875 106.781 312.734 96.2161 315.499 92.8673C335.547 68.5853 364.219 50.7454 395.808 47.4098Z"
                fill="#E7B413"
                fillOpacity="0.25"
              />
              <path
                d="M632.617 77.0571C640.665 76.1706 649.313 75.5713 657.418 74.8625L667.925 197.02L660.234 197.727C655.79 198.13 640.504 199.927 637.219 198.881C635.05 195.075 634.463 182.905 634.048 178.12L631.867 152.813L628.178 109.68C627.493 101.684 626.75 93.7014 626.253 85.6908C625.902 80.0916 627.398 78.4516 632.617 77.0571Z"
                fill="#E7B413"
                fillOpacity="0.25"
              />
            </svg>
            <AnimateIn className="relative z-10 flex flex-col items-center gap-5">
              <h2 className="max-w-xl text-3xl font-bold leading-snug text-[#111115] sm:text-4xl">Take the first step toward a better school system</h2>
              <p className="max-w-md text-base leading-relaxed text-[#4e4e55]">Join schools already using Axis to save time, reduce errors, and stay organized.</p>
              <Link
                href="/auth/staff?step=signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#437dfc] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-500 hover:shadow-md active:scale-[0.98]"
              >
                Get Started
              </Link>
            </AnimateIn>
          </div>
        </section>

        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
