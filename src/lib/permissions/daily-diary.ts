import { hasPermission } from ".";
import { canManageAttendance, canViewAttendance } from "./attendance";

/**
 * TEMPORARY — remove once the backend seeds the four diary permissions.
 *
 * `view_daily_diary`, `manage_daily_diary`, `approve_diary_reports` and
 * `view_diary_compliance` do not exist in `GET /permissions` yet, so they cannot be
 * assigned to a role and no staff account — admins included — can open the module.
 *
 * While this is `false` the diary borrows the Attendance permissions, which every
 * account that should see the diary already has. Flip it to `true` (and delete the
 * fallbacks below) the day the real strings ship; note that staff must re-login
 * afterwards, because permissions are read from the JWT, not fetched.
 */
const DIARY_PERMISSIONS_LIVE = false;

export const canViewDailyDiary = (permissions: string[] | undefined) =>
  hasPermission(permissions, "view_daily_diary") || (!DIARY_PERMISSIONS_LIVE && canViewAttendance(permissions));

/** Write and publish daily entries for a class. */
export const canManageDailyDiary = (permissions: string[] | undefined) =>
  hasPermission(permissions, "manage_daily_diary") || (!DIARY_PERMISSIONS_LIVE && canManageAttendance(permissions));

/** Approve weekly reports before parents see them (head teacher). */
export const canApproveDiaryReports = (permissions: string[] | undefined) =>
  hasPermission(permissions, "approve_diary_reports") || (!DIARY_PERMISSIONS_LIVE && canManageAttendance(permissions));

/** See the school-wide publish and sign-off compliance figures. */
export const canViewDiaryCompliance = (permissions: string[] | undefined) =>
  hasPermission(permissions, "view_diary_compliance") || (!DIARY_PERMISSIONS_LIVE && canViewAttendance(permissions));

/** Diary settings live under the module, so gate them on the settings permission as well. */
export const canManageDiarySettings = (permissions: string[] | undefined) =>
  canManageDailyDiary(permissions) && hasPermission(permissions, "manage_settings");
