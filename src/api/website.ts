import api from "@/lib/axios/axios-auth";
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
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
