import { createWebsiteConfig, getWebsiteConfig, publishWebsite, updateWebsiteConfig, uploadWebsiteImage } from "@/api/website";
import { websiteKeys } from "@/queries/website";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetWebsiteConfig = () => {
  return useQuery({
    queryKey: websiteKeys.config,
    queryFn: getWebsiteConfig,
    retry: false,
  });
};

export const useCreateWebsiteConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: websiteKeys.create,
    mutationFn: createWebsiteConfig,
    onSuccess: data => {
      queryClient.setQueryData(websiteKeys.config, data);
    },
  });
};

export const useUpdateWebsiteConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: websiteKeys.update,
    mutationFn: updateWebsiteConfig,
    onSuccess: data => {
      queryClient.setQueryData(websiteKeys.config, data);
    },
  });
};

export const usePublishWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: websiteKeys.publish,
    mutationFn: publishWebsite,
    onSuccess: data => {
      queryClient.setQueryData(websiteKeys.config, data);
    },
  });
};

export const useUploadWebsiteImage = () => {
  return useMutation({
    mutationKey: websiteKeys.uploadImage,
    mutationFn: ({ file, type }: { file: File; type?: string }) => uploadWebsiteImage(file, type),
  });
};
