import { CampaignChannel, CampaignTargetDto, CreateCampaignRequest } from "@/api/campaign";

import { CampaignFormValues, SelectedRecipient } from "./types";

/** Combine an ISO date string with an "HH:mm" time into a single ISO timestamp. */
export const combineDateTime = (dateIso: string | null, time: string | null): string | null => {
  if (!dateIso) return null;
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return null;
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    if (!Number.isNaN(hours)) date.setHours(hours, Number.isNaN(minutes) ? 0 : minutes, 0, 0);
  }
  return date.toISOString();
};

/** Map SelectedRecipient[] from the picker into a CampaignTargetDto. */
export const buildTarget = (recipients: SelectedRecipient[]): CampaignTargetDto => {
  if (recipients.length === 0) return { allStudents: false };

  // Individual student selections — pass studentIds + their linked parentIds
  const students = recipients.filter(r => r.type === "student");
  if (students.length > 0) {
    const studentIds = students.map(s => Number(s.id.split(":")[1]));
    const parentIds = students.flatMap(s => s.parentIds ?? []);
    return { studentIds, ...(parentIds.length ? { parentIds } : {}) };
  }

  // Individual parent selections — pass parentIds + their linked studentIds
  const parents = recipients.filter(r => r.type === "parent");
  if (parents.length > 0) {
    const parentIds = parents.map(p => Number(p.id.split(":")[1]));
    const studentIds = parents.flatMap(p => p.studentIds ?? []);
    return { parentIds, ...(studentIds.length ? { studentIds } : {}) };
  }

  // Group scope — API supports only a single ID per level, take the first
  const arms = recipients.filter(r => r.type === "arm");
  if (arms.length > 0) return { armId: Number(arms[0].id.split(":")[1]) };

  const classes = recipients.filter(r => r.type === "class");
  if (classes.length > 0) return { classId: Number(classes[0].id.split(":")[1]) };

  const branches = recipients.filter(r => r.type === "branch");
  if (branches.length > 0) return { branchId: Number(branches[0].id.split(":")[1]) };

  return { allStudents: false };
};

export const mapFormToCampaignRequest = (values: CampaignFormValues): CreateCampaignRequest => ({
  title: values.title.trim(),
  channel: values.channel as CampaignChannel,
  message: values.message.trim(),
  target: buildTarget(values.recipients),
  scheduledAt: combineDateTime(values.scheduledDate, values.scheduledTime),
});
