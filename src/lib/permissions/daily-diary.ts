import { hasPermission } from ".";

export const canViewDailyDiary = (permissions: string[] | undefined) => hasPermission(permissions, "view_daily_diary");

/** Write and publish daily entries for a class. */
export const canManageDailyDiary = (permissions: string[] | undefined) => hasPermission(permissions, "manage_daily_diary");

/** Approve weekly reports before parents see them (head teacher). */
export const canApproveDiaryReports = (permissions: string[] | undefined) => hasPermission(permissions, "approve_diary_reports");

/** See the school-wide publish and sign-off compliance figures. */
export const canViewDiaryCompliance = (permissions: string[] | undefined) => hasPermission(permissions, "view_diary_compliance");

/** Diary settings live under the module, so gate them on the settings permission as well. */
export const canManageDiarySettings = (permissions: string[] | undefined) =>
  canManageDailyDiary(permissions) && hasPermission(permissions, "manage_settings");
