import { ArmTeacherInputStudentReport, RatingLegendEntry, StudentDevelopment } from "@/api/types";
import { useGetArmTeacherInput } from "@/hooks/queryHooks/useStudent";
import { useMemo } from "react";

// GET /teacher-input/arm/{armId} is a proposed batch endpoint (see useSubmitArmTeacherInput's sibling
// submit) that returns every student's current development ratings for the arm in one call. It doubles
// as the source for the category/skill list (read off the first student's `developments` — every student
// in an arm shares the same level, so the same categories/skills), which sidesteps the 403 a subject/class
// teacher gets from GET /development-settings/level/{levelId}.
export const useArmDevelopmentData = (armId: number) => {
  const { data, isLoading } = useGetArmTeacherInput(armId);

  return useMemo(() => {
    const studentReports: ArmTeacherInputStudentReport[] = data?.data?.studentReports ?? [];
    const categories: StudentDevelopment[] = studentReports[0]?.developments ?? [];
    const ratingLegend: RatingLegendEntry[] = data?.data?.ratingLegend ?? [];

    const ratings: Record<string, string> = {};
    studentReports.forEach(report => {
      report.developments.forEach(category => {
        category.skills.forEach(skill => {
          if (skill.rating != null) {
            ratings[`${report.studentId}-${skill.skillId}`] = String(skill.rating);
          }
        });
      });
    });

    return { categories, ratingLegend, ratings, isLoading };
  }, [data, isLoading]);
};
