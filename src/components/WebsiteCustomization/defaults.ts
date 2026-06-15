import { WebsiteConfig } from "./types";

let counter = 0;
/** Lightweight client-side id generator for repeatable rows. */
export const uid = (prefix = "row") => `${prefix}-${++counter}-${Math.random().toString(36).slice(2, 7)}`;

export const defaultConfig: WebsiteConfig = {
  schoolIdentity: {
    logoUrl: "",
    name: "Digenty Academy",
    motto: "",
  },
  theme: {
    primaryColor: "#437dfc",
  },
  hero: {
    visible: true,
    layout: "full-image",
    backgroundImageUrl: "",
    headline: "Welcome to Digenty Academy",
    subtitle: "A vibrant learning community where every child is encouraged to grow, explore, and reach their full potential.",
    buttonText: "Apply for Admission",
    buttonLink: "#admissions",
  },
  about: {
    visible: true,
    title: "About Us",
    text: "We are committed to nurturing well-rounded individuals through quality education, character development, and a supportive learning environment.",
    stats: [
      { id: "stat-1", value: "25+", label: "Years of Excellence" },
      { id: "stat-2", value: "1,200+", label: "Students" },
      { id: "stat-3", value: "80+", label: "Qualified Teachers" },
      { id: "stat-4", value: "40+", label: "Programs" },
    ],
  },
  gallery: {
    visible: true,
    title: "Gallery",
    subtitle: "A glimpse into life at our school",
    images: [
      { id: "img-1", url: "", title: "" },
      { id: "img-2", url: "", title: "" },
      { id: "img-3", url: "", title: "" },
      { id: "img-4", url: "", title: "" },
    ],
  },
  news: {
    visible: true,
    title: "Latest News & Updates",
    subtitle: "Stay informed with the latest happenings at our school",
    items: [
      { id: "news-1", title: "Resumption for New Term", date: "", body: "", imageUrl: "" },
      { id: "news-2", title: "Inter-House Sports", date: "", body: "", imageUrl: "" },
      { id: "news-3", title: "Annual Science Fair", date: "", body: "", imageUrl: "" },
    ],
  },
  admissions: {
    visible: true,
    title: "Admissions",
    description: "Join our community of learners. Find out everything you need to know about enrolling your child.",
    requirements: "",
    classes: [{ id: "class-1", name: "", ageRange: "", spots: "" }],
    buttonText: "Apply for Admission",
    buttonLink: "#contact",
  },
  contact: {
    visible: true,
    title: "Contact Us",
    address: "",
    phones: [{ id: "phone-1", value: "" }],
    email: "",
    officeHours: [{ id: "hours-1", value: "" }],
  },
  footer: {
    visible: true,
    text: "Digenty Academy",
  },
};
