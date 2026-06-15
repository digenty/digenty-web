import { WebsiteConfigDto } from "@/api/website";
import { defaultConfig, uid } from "./defaults";
import { HeroLayout, WebsiteConfig } from "./types";

export interface WebsiteMeta {
  id?: number;
  live?: boolean;
}

const toUiLayout = (layout?: string): HeroLayout => (layout === "TEXT_SIDE_IMAGE" ? "text-side-image" : "full-image");
const toApiLayout = (layout: HeroLayout) => (layout === "text-side-image" ? "TEXT_SIDE_IMAGE" : "FULL_IMAGE_BACKGROUND");

/** Build the editable UI config from the API DTO, falling back to defaults for anything the server omits. */
export const dtoToConfig = (dto: WebsiteConfigDto | undefined): WebsiteConfig => {
  if (!dto) return defaultConfig;

  const d = defaultConfig;

  return {
    schoolIdentity: {
      logoUrl: dto.identity?.logoUrl ?? "",
      name: dto.identity?.schoolName ?? d.schoolIdentity.name,
      motto: dto.identity?.motto ?? "",
    },
    theme: {
      primaryColor: dto.theme?.primaryColor ?? d.theme.primaryColor,
    },
    hero: {
      visible: dto.hero?.visible ?? true,
      layout: toUiLayout(dto.hero?.layout),
      backgroundImageUrl: dto.hero?.backgroundImageUrl ?? "",
      headline: dto.hero?.headline ?? "",
      subtitle: dto.hero?.subtitle ?? "",
      buttonText: dto.hero?.buttonText ?? "",
      buttonLink: dto.hero?.buttonLink ?? "",
    },
    about: {
      visible: dto.about?.visible ?? true,
      title: dto.about?.title ?? "",
      text: dto.about?.text ?? "",
      stats: (dto.about?.keyStats ?? []).map(stat => ({ id: uid("stat"), value: stat.value ?? "", label: stat.label ?? "" })),
    },
    gallery: {
      visible: dto.gallery?.visible ?? true,
      title: dto.gallery?.title ?? "",
      subtitle: dto.gallery?.subtitle ?? "",
      images: (dto.gallery?.images ?? []).map(image => ({ id: uid("img"), url: image.imageUrl ?? "", title: image.title ?? "" })),
    },
    news: {
      visible: dto.news?.visible ?? true,
      title: dto.news?.title ?? "",
      subtitle: dto.news?.subtitle ?? "",
      items: (dto.news?.items ?? []).map(item => ({
        id: uid("news"),
        title: item.title ?? item.name ?? "",
        date: item.date ?? "",
        body: item.summary ?? "",
        imageUrl: item.imageUrl ?? "",
      })),
    },
    admissions: {
      visible: dto.admissions?.visible ?? true,
      title: dto.admissions?.title ?? "",
      description: dto.admissions?.description ?? "",
      requirements: (dto.admissions?.requirements ?? []).join(", "),
      classes: (dto.admissions?.classes ?? []).map(row => ({
        id: uid("class"),
        name: row.className ?? "",
        ageRange: row.ageRange ?? "",
        spots: row.spotsAvailable != null ? String(row.spotsAvailable) : "",
      })),
      buttonText: dto.admissions?.buttonText ?? "",
      buttonLink: dto.admissions?.buttonLink ?? "",
    },
    contact: {
      visible: dto.contact?.visible ?? true,
      title: dto.contact?.title ?? "",
      address: dto.contact?.address ?? "",
      phones: (dto.contact?.phoneNumbers?.length ? dto.contact.phoneNumbers : [""]).map(value => ({ id: uid("phone"), value })),
      email: dto.contact?.email ?? "",
      officeHours: (dto.contact?.officeHours ? dto.contact.officeHours.split("\n") : [""]).map(value => ({ id: uid("hours"), value })),
    },
    footer: {
      visible: dto.footer?.visible ?? true,
      text: dto.footer?.text ?? "",
    },
  };
};

/** Serialise the UI config back into the API DTO shape. */
export const configToDto = (config: WebsiteConfig, meta: WebsiteMeta = {}): WebsiteConfigDto => ({
  ...(meta.id != null ? { id: meta.id } : {}),
  ...(meta.live != null ? { live: meta.live } : {}),
  identity: {
    schoolName: config.schoolIdentity.name,
    logoUrl: config.schoolIdentity.logoUrl,
    motto: config.schoolIdentity.motto,
  },
  theme: {
    primaryColor: config.theme.primaryColor,
  },
  hero: {
    visible: config.hero.visible,
    layout: toApiLayout(config.hero.layout),
    backgroundImageUrl: config.hero.backgroundImageUrl,
    headline: config.hero.headline,
    subtitle: config.hero.subtitle,
    buttonText: config.hero.buttonText,
    buttonLink: config.hero.buttonLink,
  },
  about: {
    visible: config.about.visible,
    title: config.about.title,
    text: config.about.text,
    keyStats: config.about.stats.map(stat => ({ value: stat.value, label: stat.label })),
  },
  gallery: {
    visible: config.gallery.visible,
    title: config.gallery.title,
    subtitle: config.gallery.subtitle,
    images: config.gallery.images.map(image => ({ imageUrl: image.url, title: image.title })),
  },
  news: {
    visible: config.news.visible,
    title: config.news.title,
    subtitle: config.news.subtitle,
    items: config.news.items.map(item => ({ name: item.title, title: item.title, date: item.date, summary: item.body, imageUrl: item.imageUrl })),
  },
  admissions: {
    visible: config.admissions.visible,
    title: config.admissions.title,
    description: config.admissions.description,
    requirements: config.admissions.requirements
      .split(",")
      .map(part => part.trim())
      .filter(Boolean),
    classes: config.admissions.classes
      .filter(row => row.name || row.ageRange || row.spots)
      .map(row => ({
        className: row.name,
        ageRange: row.ageRange,
        spotsAvailable: row.spots && !Number.isNaN(Number(row.spots)) ? Number(row.spots) : undefined,
      })),
    buttonText: config.admissions.buttonText,
    buttonLink: config.admissions.buttonLink,
  },
  contact: {
    visible: config.contact.visible,
    title: config.contact.title,
    address: config.contact.address,
    phoneNumbers: config.contact.phones.map(phone => phone.value).filter(Boolean),
    email: config.contact.email,
    officeHours: config.contact.officeHours
      .map(line => line.value)
      .filter(Boolean)
      .join("\n"),
  },
  footer: {
    visible: config.footer.visible,
    text: config.footer.text,
  },
});
