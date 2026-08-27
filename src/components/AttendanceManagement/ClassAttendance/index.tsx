"use client";
import { AttendanceSession, StudentAttendance, Term } from "@/api/types";
import { BackButton } from "@/components/BackButton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateAttendanceSheet, useGetAllAttendance, useGetArmAttendance } from "@/hooks/queryHooks/useAttendance";
import { useGetAttendanceSettingsByLevel } from "@/hooks/queryHooks/useAttendanceSettings";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AttendanceTable } from "./AttendanceTable";
import { ClassAttendanceHeader } from "./ClassAttendanceHeader";
import { ClassAttendanceWrapper } from "./ClassAttendanceWrapper";
import { toast } from "@/components/Toast";

export type AttendanceMarkList = { studentId: number; isPresent: boolean }[];

export interface SessionSlot {
  session: AttendanceSession;
  label: string;
  attendanceId?: number;
  students: StudentAttendance[];
  isLoading: boolean;
  attendanceList: AttendanceMarkList;
  setAttendanceList: React.Dispatch<React.SetStateAction<AttendanceMarkList>>;
}

export const ClassAttendance = () => {
  const path = usePathname();
  const armId = path.split("/")[4] ?? "";
  const classArmName = path.split("/")[3] ?? "";
  // The attendance list's "Open" button (Card.tsx) already creates today's first sheet
  // (MORNING, or the session-less/full-day one) before linking here, and puts its id in the
  // URL. Trust it instead of re-creating the same sheet and colliding with it.
  const sheetIdFromUrl = Number(path.split("/")[6]);
  const initialSheetId = Number.isFinite(sheetIdFromUrl) && sheetIdFromUrl > 0 ? sheetIdFromUrl : undefined;

  const [date, setDate] = useState<Date>(new Date());
  const [fullDayList, setFullDayList] = useState<AttendanceMarkList>([]);
  const [morningList, setMorningList] = useState<AttendanceMarkList>([]);
  const [afternoonList, setAfternoonList] = useState<AttendanceMarkList>([]);
  const [sessionAttendanceIds, setSessionAttendanceIds] = useState<Partial<Record<AttendanceSession, number>>>(() =>
    initialSheetId ? { MORNING: initialSheetId, FULL_DAY: initialSheetId } : {},
  );
  const user = useLoggedInUser();

  const { data: terms } = useGetTerms(user?.schoolId);
  const currentTerm = terms?.data?.terms?.find((term: Term) => term.isActiveTerm);

  const { data: allAttendance } = useGetAllAttendance(undefined, currentTerm?.termId);
  const levelId = allAttendance?.data?.levels
    ?.flatMap((level: { levelId: number; classArms: { armId: number }[] }) =>
      level.classArms.map(arm => ({ armId: arm.armId, levelId: level.levelId })),
    )
    .find((arm: { armId: number }) => arm.armId === Number(armId))?.levelId;

  const { data: attendanceSettings, isPending: isLoadingAttendanceSettings } = useGetAttendanceSettingsByLevel(levelId);
  const sessionsPerDay: 1 | 2 = attendanceSettings?.data?.sessionsPerDay ?? 1;
  const isTwoSession = sessionsPerDay === 2;
  const sessionsNeeded: AttendanceSession[] = isTwoSession ? ["MORNING", "AFTERNOON"] : ["FULL_DAY"];
  // Wait for the real sessions-per-day setting before provisioning sheets, otherwise this
  // fires once for the default of 1 session and again once the actual value loads, and the
  // second create conflicts (409) with the sheet the first call already created for that date.
  const settingsReady = !!levelId && !isLoadingAttendanceSettings;

  const { mutate: createSheet } = useCreateAttendanceSheet();
  const requestedSheetsRef = useRef<Set<string>>(
    initialSheetId
      ? new Set([`${armId}|${format(date, "yyyy-MM-dd")}|MORNING`, `${armId}|${format(date, "yyyy-MM-dd")}|FULL_DAY`])
      : new Set(),
  );

  // Reset local marks and known sheet ids whenever the date actually changes (not on mount,
  // which would immediately wipe the sheet id seeded from the URL above).
  const isFirstDateRun = useRef(true);
  useEffect(() => {
    if (isFirstDateRun.current) {
      isFirstDateRun.current = false;
      return;
    }
    setFullDayList([]);
    setMorningList([]);
    setAfternoonList([]);
    setSessionAttendanceIds({});
  }, [date]);

  // Make sure a register exists for the selected date, for every session this level takes.
  useEffect(() => {
    if (!armId || !settingsReady) return;

    sessionsNeeded.forEach(session => {
      const requestKey = `${armId}|${format(date, "yyyy-MM-dd")}|${session}`;
      // Guard against React Strict Mode's dev-only double-invoke firing this create twice
      // in a row, which would otherwise self-collide with the record it just created.
      if (requestedSheetsRef.current.has(requestKey)) return;
      requestedSheetsRef.current.add(requestKey);

      createSheet(
        {
          armId: Number(armId),
          date: format(date, "yyyy-MM-dd"),
          ...(session === "FULL_DAY" ? {} : { attendanceSession: session }),
        },
        {
          onSuccess: data => {
            setSessionAttendanceIds(prev => ({ ...prev, [session]: data?.data?.id }));
          },
          onError: (error: Error) => {
            toast({
              title: error?.message ?? `Could not prepare the ${session === "FULL_DAY" ? "" : session.toLowerCase() + " "}attendance sheet`,
              type: "error",
            });
          },
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armId, date, isTwoSession, settingsReady]);

  const { data: fullDayData, isLoading: isLoadingFullDay } = useGetArmAttendance({
    armId: Number(armId),
    limit: 200,
    page: 0,
    date: format(date, "yyyy-MM-dd"),
    enabled: settingsReady && !isTwoSession,
  });

  const { data: morningData, isLoading: isLoadingMorning } = useGetArmAttendance({
    armId: Number(armId),
    limit: 200,
    page: 0,
    date: format(date, "yyyy-MM-dd"),
    session: "MORNING",
    enabled: settingsReady && isTwoSession,
  });

  const { data: afternoonData, isLoading: isLoadingAfternoon } = useGetArmAttendance({
    armId: Number(armId),
    limit: 200,
    page: 0,
    date: format(date, "yyyy-MM-dd"),
    session: "AFTERNOON",
    enabled: settingsReady && isTwoSession,
  });

  const isLoading = !settingsReady || (isTwoSession ? isLoadingMorning || isLoadingAfternoon : isLoadingFullDay);

  const slots: SessionSlot[] = isTwoSession
    ? [
        {
          session: "MORNING",
          label: "Morning",
          attendanceId: sessionAttendanceIds.MORNING,
          students: morningData?.data?.studentsPresent ?? [],
          isLoading: isLoadingMorning,
          attendanceList: morningList,
          setAttendanceList: setMorningList,
        },
        {
          session: "AFTERNOON",
          label: "Afternoon",
          attendanceId: sessionAttendanceIds.AFTERNOON,
          students: afternoonData?.data?.studentsPresent ?? [],
          isLoading: isLoadingAfternoon,
          attendanceList: afternoonList,
          setAttendanceList: setAfternoonList,
        },
      ]
    : [
        {
          session: "FULL_DAY",
          label: "Attendance",
          attendanceId: sessionAttendanceIds.FULL_DAY,
          students: fullDayData?.data?.studentsPresent ?? [],
          isLoading: isLoadingFullDay,
          attendanceList: fullDayList,
          setAttendanceList: setFullDayList,
        },
      ];

  const roster = slots.find(slot => slot.students.length > 0)?.students ?? slots[0]?.students ?? [];
  const hasNoStudents = !isLoading && roster.length === 0;

  return (
    <ClassAttendanceWrapper armId={Number(armId)} isLoading={isLoading}>
      <div className="space-y-6">
        <div className="px-4 pt-3 md:hidden">
          <BackButton />
        </div>

        <ClassAttendanceHeader
          classArmName={classArmName.split("-").join(" ")}
          slots={slots}
          date={date}
          setDate={setDate}
          activeTerm={currentTerm}
        />

        <div className="px-4 pb-10 md:px-8">
          {isLoading && <Skeleton className="bg-bg-input-soft h-200 w-full" />}

          {!isLoading && hasNoStudents && (
            <div className="flex h-80 items-center justify-center">
              <ErrorComponent
                title="No Students in this arm yet"
                description="No students have been added to this arm"
                buttonText="Add a student"
                url="/staff/student-and-parent-record/add-student"
              />
            </div>
          )}

          {!isLoading && !hasNoStudents && <AttendanceTable roster={roster} slots={slots} />}
        </div>
      </div>
    </ClassAttendanceWrapper>
  );
};
