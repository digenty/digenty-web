"use client";

import { DeleteBin, Phone } from "@digenty/icons";
import { Input } from "@/components/ui/input";
import { AddButton, Field, INPUT_CLASS } from "../common";
import { useWebsiteCustomization } from "../context";
import { SectionCard } from "../SectionCard";
import { uid } from "../defaults";
import { ContactLine } from "../types";

const RemoveLabelButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} aria-label="Remove field" className="cursor-pointer">
    <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
  </button>
);

export const ContactSection = () => {
  const { config, patchSection, setSection } = useWebsiteCustomization();
  const { contact } = config;

  const updatePhones = (phones: ContactLine[]) => setSection("contact", { ...contact, phones });
  const updateHours = (officeHours: ContactLine[]) => setSection("contact", { ...contact, officeHours });

  return (
    <SectionCard
      icon={<Phone fill="var(--color-icon-default)" />}
      title="Contact Us"
      visible={contact.visible}
      onVisibleChange={value => patchSection("contact", { visible: value })}
    >
      <Field label="Section Title">
        <Input
          className={INPUT_CLASS}
          value={contact.title}
          onChange={e => patchSection("contact", { title: e.target.value })}
          placeholder="e.g Contact Us"
        />
      </Field>

      <Field label="School Address" hint="Optional">
        <Input
          className={INPUT_CLASS}
          value={contact.address}
          onChange={e => patchSection("contact", { address: e.target.value })}
          placeholder="e.g 52, example street"
        />
      </Field>

      {contact.phones.map((phone, index) => (
        <Field
          key={phone.id}
          label={index === 0 ? "Phone Number" : `Phone Number ${index + 1}`}
          hint={index === 0 ? undefined : <RemoveLabelButton onClick={() => updatePhones(contact.phones.filter(p => p.id !== phone.id))} />}
        >
          <Input
            className={INPUT_CLASS}
            value={phone.value}
            onChange={e => updatePhones(contact.phones.map(p => (p.id === phone.id ? { ...p, value: e.target.value } : p)))}
            placeholder="e.g 0904 000 000"
          />
        </Field>
      ))}
      <AddButton label="Add Phone Number" onClick={() => updatePhones([...contact.phones, { id: uid("phone"), value: "" }])} />

      <Field label="Email Address">
        <Input
          className={INPUT_CLASS}
          value={contact.email}
          onChange={e => patchSection("contact", { email: e.target.value })}
          placeholder="e.g example@gmail.com"
        />
      </Field>

      {contact.officeHours.map((line, index) => (
        <Field
          key={line.id}
          label={index === 0 ? "Office Hours" : `Office Hours ${index + 1}`}
          hint={index === 0 ? undefined : <RemoveLabelButton onClick={() => updateHours(contact.officeHours.filter(l => l.id !== line.id))} />}
        >
          <Input
            className={INPUT_CLASS}
            value={line.value}
            onChange={e => updateHours(contact.officeHours.map(l => (l.id === line.id ? { ...l, value: e.target.value } : l)))}
            placeholder="e.g Monday – Friday: 7:30am – 4:00pm"
          />
        </Field>
      ))}
      <AddButton label="Add" onClick={() => updateHours([...contact.officeHours, { id: uid("hours"), value: "" }])} />
    </SectionCard>
  );
};
