export type HeroLayout = "full-image" | "text-side-image";

export interface KeyStat {
  id: string;
  value: string;
  label: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  body: string;
  imageUrl: string;
}

export interface AdmissionClass {
  id: string;
  name: string;
  ageRange: string;
  spots: string;
}

export interface ContactLine {
  id: string;
  value: string;
}

export interface SchoolIdentityConfig {
  logoUrl: string;
  name: string;
  motto: string;
}

export interface ThemeConfig {
  primaryColor: string;
}

export interface HeroConfig {
  visible: boolean;
  layout: HeroLayout;
  backgroundImageUrl: string;
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface AboutConfig {
  visible: boolean;
  title: string;
  text: string;
  stats: KeyStat[];
}

export interface GalleryConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  images: GalleryImage[];
}

export interface NewsConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  items: NewsItem[];
}

export interface AdmissionsConfig {
  visible: boolean;
  title: string;
  description: string;
  requirements: string;
  classes: AdmissionClass[];
  buttonText: string;
  buttonLink: string;
}

export interface ContactConfig {
  visible: boolean;
  title: string;
  address: string;
  phones: ContactLine[];
  email: string;
  officeHours: ContactLine[];
}

export interface FooterConfig {
  visible: boolean;
  text: string;
}

export interface WebsiteConfig {
  schoolIdentity: SchoolIdentityConfig;
  theme: ThemeConfig;
  hero: HeroConfig;
  about: AboutConfig;
  gallery: GalleryConfig;
  news: NewsConfig;
  admissions: AdmissionsConfig;
  contact: ContactConfig;
  footer: FooterConfig;
}

/** Options surfaced in the "Button Link" routing selects. */
export const ROUTING_OPTIONS = [
  { label: "Admissions", value: "#admissions" },
  { label: "About Us", value: "#about" },
  { label: "Gallery", value: "#gallery" },
  { label: "News & Updates", value: "#news" },
  { label: "Contact Us", value: "#contact" },
] as const;
