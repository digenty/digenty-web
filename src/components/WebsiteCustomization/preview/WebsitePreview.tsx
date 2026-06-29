"use client";

/* eslint-disable @next/next/no-img-element */
import { WebsiteConfig } from "../types";

const FALLBACK_YEAR = 2025;

const PlaceholderImage = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center bg-zinc-100 ${className ?? ""}`}>
    <svg viewBox="0 0 24 24" className="size-8 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  </div>
);

export const WebsitePreview = ({ config }: { config: WebsiteConfig }) => {
  const { schoolIdentity, theme, hero, about, gallery, news, admissions, contact, footer } = config;
  const primary = theme.primaryColor || "#437dfc";

  const navLinks = [
    about.visible && { label: "About", href: "#about" },
    gallery.visible && { label: "Gallery", href: "#gallery" },
    news.visible && { label: "News", href: "#news" },
    admissions.visible && { label: "Admissions", href: "#admissions" },
    contact.visible && { label: "Contact", href: "#contact" },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="w-full bg-white font-sans text-zinc-900">
      {/* Navbar */}
      <header className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3.5 @3xl:px-12 @3xl:py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {schoolIdentity.logoUrl ? (
            <img src={schoolIdentity.logoUrl} alt="logo" className="size-8 shrink-0 rounded object-cover" />
          ) : (
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded text-sm font-bold text-white"
              style={{ backgroundColor: primary }}
            >
              {(schoolIdentity.name || "S").charAt(0)}
            </div>
          )}
          <span className="truncate text-sm font-semibold @2xl:text-base">{schoolIdentity.name || "Your School"}</span>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-zinc-600 @3xl:flex">
          <span style={{ color: primary }} className="font-medium">
            Home
          </span>
          {navLinks.map(link => (
            <span key={link.href}>{link.label}</span>
          ))}
        </nav>
        <button className="shrink-0 rounded-md px-3 py-2 text-xs font-medium text-white @2xl:px-4 @2xl:text-sm" style={{ backgroundColor: primary }}>
          {hero.buttonText || "Apply Now"}
        </button>
      </header>

      {/* Hero */}
      {hero.visible &&
        (hero.layout === "full-image" ? (
          <section className="relative flex min-h-70 items-center justify-center overflow-hidden px-5 text-center @2xl:min-h-115 @3xl:px-12">
            {hero.backgroundImageUrl ? (
              <img src={hero.backgroundImageUrl} alt="hero" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-zinc-800" />
            )}
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative flex max-w-3xl flex-col items-center gap-4 py-14 text-white @2xl:gap-5 @2xl:py-24">
              <h1 className="text-2xl leading-tight font-bold @md:text-3xl @2xl:text-5xl">{hero.headline || "Welcome to our school"}</h1>
              {hero.subtitle && <p className="max-w-xl text-sm text-white/85 @2xl:text-base">{hero.subtitle}</p>}
              {hero.buttonText && (
                <button
                  className="mt-1 rounded-md px-5 py-2.5 text-sm font-medium text-white @2xl:mt-2 @2xl:px-6 @2xl:py-3"
                  style={{ backgroundColor: primary }}
                >
                  {hero.buttonText}
                </button>
              )}
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 items-center gap-6 px-5 py-10 @2xl:grid-cols-2 @2xl:gap-10 @3xl:px-12 @3xl:py-20">
            <div className="flex flex-col gap-4 @2xl:gap-5">
              <h1 className="text-2xl leading-tight font-bold @md:text-3xl @2xl:text-5xl">{hero.headline || "Welcome to our school"}</h1>
              {hero.subtitle && <p className="text-sm text-zinc-600 @2xl:text-base">{hero.subtitle}</p>}
              {hero.buttonText && (
                <button
                  className="mt-1 w-fit rounded-md px-5 py-2.5 text-sm font-medium text-white @2xl:mt-2 @2xl:px-6 @2xl:py-3"
                  style={{ backgroundColor: primary }}
                >
                  {hero.buttonText}
                </button>
              )}
            </div>
            {hero.backgroundImageUrl ? (
              <img src={hero.backgroundImageUrl} alt="hero" className="h-52 w-full rounded-xl object-cover @2xl:h-90" />
            ) : (
              <PlaceholderImage className="h-52 w-full rounded-xl @2xl:h-90" />
            )}
          </section>
        ))}

      {/* About */}
      {about.visible && (
        <section id="about" className="px-5 py-10 @3xl:px-12 @3xl:py-16">
          {about.stats.length > 0 && (
            <div className="mb-8 grid grid-cols-2 gap-3 @2xl:mb-12 @2xl:grid-cols-4 @2xl:gap-4">
              {about.stats.map(stat => (
                <div key={stat.id} className="rounded-xl bg-zinc-50 px-4 py-5 text-center @2xl:px-6 @2xl:py-7">
                  <div className="text-2xl font-bold @2xl:text-3xl" style={{ color: primary }}>
                    {stat.value || "0"}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 @2xl:text-sm">{stat.label || "Label"}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold @2xl:text-3xl">{about.title || "About Us"}</h2>
            {about.text && <p className="mt-3 text-sm leading-relaxed text-zinc-600 @2xl:mt-4 @2xl:text-base">{about.text}</p>}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.visible && (
        <section id="gallery" className="bg-zinc-50 px-5 py-10 @3xl:px-12 @3xl:py-16">
          <div className="mb-6 text-center @2xl:mb-10">
            <h2 className="text-2xl font-bold @2xl:text-3xl">{gallery.title || "Gallery"}</h2>
            {gallery.subtitle && <p className="mt-2 text-sm text-zinc-600 @2xl:mt-3 @2xl:text-base">{gallery.subtitle}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @2xl:gap-4">
            {gallery.images.map(image => (
              <div key={image.id} className="overflow-hidden rounded-xl">
                {image.url ? (
                  <img src={image.url} alt={image.title || "gallery"} className="h-32 w-full object-cover @2xl:h-56" />
                ) : (
                  <PlaceholderImage className="h-32 w-full @2xl:h-56" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {news.visible && (
        <section id="news" className="px-5 py-10 @3xl:px-12 @3xl:py-16">
          <div className="mb-6 text-center @2xl:mb-10">
            <h2 className="text-2xl font-bold @2xl:text-3xl">{news.title || "Latest News & Updates"}</h2>
            {news.subtitle && <p className="mt-2 text-sm text-zinc-600 @2xl:mt-3 @2xl:text-base">{news.subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @2xl:grid-cols-3 @2xl:gap-6">
            {news.items.map(item => (
              <article key={item.id} className="overflow-hidden rounded-xl border border-zinc-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover @2xl:h-44" />
                ) : (
                  <PlaceholderImage className="h-40 w-full @2xl:h-44" />
                )}
                <div className="flex flex-col gap-2 p-4 @2xl:p-5">
                  {item.date && (
                    <span className="text-xs font-medium" style={{ color: primary }}>
                      {item.date}
                    </span>
                  )}
                  <h3 className="text-base font-semibold @2xl:text-lg">{item.title || "News Item"}</h3>
                  {item.body && <p className="line-clamp-3 text-sm text-zinc-600">{item.body}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Admissions */}
      {admissions.visible && (
        <section id="admissions" className="bg-zinc-50 px-5 py-10 @3xl:px-12 @3xl:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold @2xl:text-3xl">{admissions.title || "Admissions"}</h2>
            {admissions.description && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 @2xl:mt-4 @2xl:text-base">{admissions.description}</p>
            )}
          </div>

          {admissions.requirements && (
            <div className="mx-auto mt-6 max-w-3xl @2xl:mt-8">
              <h3 className="mb-3 text-center text-xs font-semibold tracking-wide text-zinc-500 uppercase">Requirements</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {admissions.requirements
                  .split(",")
                  .map(part => part.trim())
                  .filter(Boolean)
                  .map((req, i) => (
                    <span key={i} className="rounded-full bg-white px-4 py-1.5 text-sm text-zinc-700 shadow-sm">
                      {req}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {admissions.classes.some(c => c.name || c.ageRange || c.spots) && (
            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-xl border border-zinc-200 bg-white @2xl:mt-10">
              <div className="grid grid-cols-3 bg-zinc-100 px-4 py-3 text-xs font-semibold text-zinc-600 @2xl:px-6 @2xl:text-sm">
                <span>Class</span>
                <span>Age Range</span>
                <span>Spots Available</span>
              </div>
              {admissions.classes
                .filter(c => c.name || c.ageRange || c.spots)
                .map(row => (
                  <div key={row.id} className="grid grid-cols-3 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-700 @2xl:px-6 @2xl:text-sm">
                    <span>{row.name || "—"}</span>
                    <span>{row.ageRange || "—"}</span>
                    <span>{row.spots || "—"}</span>
                  </div>
                ))}
            </div>
          )}

          {admissions.buttonText && (
            <div className="mt-7 text-center @2xl:mt-8">
              <button className="rounded-md px-5 py-2.5 text-sm font-medium text-white @2xl:px-6 @2xl:py-3" style={{ backgroundColor: primary }}>
                {admissions.buttonText}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Contact */}
      {contact.visible && (
        <section id="contact" className="px-5 py-10 @3xl:px-12 @3xl:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center text-2xl font-bold @2xl:mb-8 @2xl:text-3xl">{contact.title || "Contact Us"}</h2>
            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @2xl:gap-6">
              {contact.address && (
                <div className="rounded-xl border border-zinc-100 p-5">
                  <div className="text-sm font-semibold text-zinc-500">Address</div>
                  <div className="mt-1 text-sm text-zinc-700">{contact.address}</div>
                </div>
              )}
              {contact.phones.some(p => p.value) && (
                <div className="rounded-xl border border-zinc-100 p-5">
                  <div className="text-sm font-semibold text-zinc-500">Phone</div>
                  {contact.phones
                    .filter(p => p.value)
                    .map(p => (
                      <div key={p.id} className="mt-1 text-sm text-zinc-700">
                        {p.value}
                      </div>
                    ))}
                </div>
              )}
              {contact.email && (
                <div className="rounded-xl border border-zinc-100 p-5">
                  <div className="text-sm font-semibold text-zinc-500">Email</div>
                  <div className="mt-1 text-sm text-zinc-700">{contact.email}</div>
                </div>
              )}
              {contact.officeHours.some(h => h.value) && (
                <div className="rounded-xl border border-zinc-100 p-5">
                  <div className="text-sm font-semibold text-zinc-500">Office Hours</div>
                  {contact.officeHours
                    .filter(h => h.value)
                    .map(h => (
                      <div key={h.id} className="mt-1 text-sm text-zinc-700">
                        {h.value}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {footer.visible && (
        <footer className="px-5 py-5 text-center text-xs text-white @2xl:px-12 @2xl:text-sm" style={{ backgroundColor: primary }}>
          © {FALLBACK_YEAR} {footer.text || schoolIdentity.name || "Your School"}. All rights reserved.
        </footer>
      )}
    </div>
  );
};
