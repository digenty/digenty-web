import api from "@/lib/axios/axios-auth";
import apiPublic from "@/lib/axios/axios-public";
import axios, { isAxiosError } from "axios";
import { getSessionToken } from "@/app/actions/auth";

export type HeroLayoutApi = "FULL_IMAGE_BACKGROUND" | "TEXT_SIDE_IMAGE";

export interface IdentityDto {
  schoolName?: string;
  logoUrl?: string;
  motto?: string;
}

export interface ThemeDto {
  primaryColor?: string;
}

export interface HeroDto {
  visible?: boolean;
  layout?: HeroLayoutApi;
  backgroundImageUrl?: string;
  headline?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface KeyStatDto {
  value?: string;
  label?: string;
}

export interface AboutDto {
  visible?: boolean;
  title?: string;
  text?: string;
  keyStats?: KeyStatDto[];
}

export interface GalleryImageDto {
  imageUrl?: string;
  title?: string;
}

export interface GalleryDto {
  visible?: boolean;
  title?: string;
  subtitle?: string;
  images?: GalleryImageDto[];
}

export interface NewsItemDto {
  name?: string;
  title?: string;
  date?: string;
  summary?: string;
  imageUrl?: string;
}

export interface NewsDto {
  visible?: boolean;
  title?: string;
  subtitle?: string;
  items?: NewsItemDto[];
}

export interface AdmissionClassDto {
  className?: string;
  ageRange?: string;
  spotsAvailable?: number;
}

export interface AdmissionsDto {
  visible?: boolean;
  title?: string;
  description?: string;
  requirements?: string[];
  classes?: AdmissionClassDto[];
  buttonText?: string;
  buttonLink?: string;
}

export interface ContactDto {
  visible?: boolean;
  title?: string;
  address?: string;
  phoneNumbers?: string[];
  email?: string;
  officeHours?: string;
}

export interface FooterDto {
  visible?: boolean;
  text?: string;
}

export interface WebsiteConfigDto {
  id?: number;
  live?: boolean;
  // Raw-HTML override. Non-empty -> render this verbatim instead of the structured sections below.
  // null/undefined for every school built purely with the visual editor. Sending "" clears it.
  customHtml?: string | null;
  identity?: IdentityDto;
  theme?: ThemeDto;
  hero?: HeroDto;
  about?: AboutDto;
  gallery?: GalleryDto;
  news?: NewsDto;
  admissions?: AdmissionsDto;
  contact?: ContactDto;
  footer?: FooterDto;
}

export interface ImageUploadResponse {
  url: string;
}

export const getWebsiteConfig = async (): Promise<WebsiteConfigDto> => {
  try {
    const { data } = await api.get("/website");
    // API wraps every response: { success, code, message, data: <payload>, timestamp }
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export interface SiteResolutionDto {
  slug: string;
  live: boolean;
}

// Unauthenticated — host -> slug lookup used before rendering the public site. A 404 here means
// no school owns this host at all (fall through to normal routing); a resolved `live: false`
// means the school owns the host but hasn't published (show "coming soon", not a 404).
export const resolveWebsiteHost = async (host: string): Promise<SiteResolutionDto | null> => {
  try {
    const { data } = await apiPublic.get("/public/website/resolve", { params: { host } });
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// Unauthenticated — the full site to render for a host. Only ever returns a published site;
// an unpublished one 404s here even though resolveWebsiteHost still resolves it.
export const getPublicWebsiteConfig = async (host: string): Promise<WebsiteConfigDto> => {
  try {
    const { data } = await apiPublic.get("/public/website", { params: { host } });
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createWebsiteConfig = async (payload: WebsiteConfigDto): Promise<WebsiteConfigDto> => {
  try {
    const { data } = await api.post("/website", payload);
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateWebsiteConfig = async (payload: WebsiteConfigDto): Promise<WebsiteConfigDto> => {
  try {
    const { data } = await api.put("/website", payload);
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const publishWebsite = async (live: boolean): Promise<WebsiteConfigDto> => {
  try {
    const { data } = await api.patch("/website/publish", { live });
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// Multipart upload bypasses the shared `api` instance (which forces JSON content-type).
export const uploadWebsiteImage = async (file: File, type?: string): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const { token } = await getSessionToken();

  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/images${type ? `?type=${type}` : ""}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
