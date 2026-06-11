"use client";

import { ImageCircleFill } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AddButton, Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { ImageDropBox } from "../ImageUpload";
import { SectionCard } from "../SectionCard";
import { uid } from "../defaults";
import { GalleryImage } from "../types";

export const GallerySection = () => {
  const { config, patchSection, setSection } = useWebsiteCustomization();
  const { gallery } = config;

  const updateImages = (images: GalleryImage[]) => setSection("gallery", { ...gallery, images });
  const updateImage = (id: string, patch: Partial<GalleryImage>) =>
    updateImages(gallery.images.map(image => (image.id === id ? { ...image, ...patch } : image)));

  return (
    <SectionCard
      icon={<ImageCircleFill fill="var(--color-icon-default)" />}
      title="Gallery"
      visible={gallery.visible}
      onVisibleChange={value => patchSection("gallery", { visible: value })}
    >
      <Field label="Section Title">
        <Input
          className={INPUT_CLASS}
          value={gallery.title}
          onChange={e => patchSection("gallery", { title: e.target.value })}
          placeholder="e.g Gallery"
        />
      </Field>

      <Field label="Section Subtitle" hint="Optional">
        <Input
          className={INPUT_CLASS}
          value={gallery.subtitle}
          onChange={e => patchSection("gallery", { subtitle: e.target.value })}
          placeholder="Talk about your school"
        />
      </Field>

      <Field
        label={`Gallery Images (${gallery.images.length})`}
        hint={<AddButton label="Add Image" onClick={() => updateImages([...gallery.images, { id: uid("img"), url: "", title: "" }])} />}
      >
        <div className="grid grid-cols-3 gap-3">
          {gallery.images.map(image => (
            <div key={image.id} className="flex flex-col gap-2">
              <ImageDropBox value={image.url} onChange={url => updateImage(image.id, { url })} />
              <Input
                className={cn(INPUT_CLASS, "h-8")}
                value={image.title}
                onChange={e => updateImage(image.id, { title: e.target.value })}
                placeholder="Image Title"
              />
            </div>
          ))}
        </div>
      </Field>
    </SectionCard>
  );
};
