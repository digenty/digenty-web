"use client";

import { Arm, BranchWithClassLevels, ClassType, Parent } from "@/api/types";
import { getCountries } from "@/app/actions/country";
import { ProfilePicture } from "@/components/StudentAndParent/ProfilePicture";
import { Country, State, StudentInputValues } from "@/components/StudentAndParent/types";
import { toast } from "@/components/Toast";
import { ArrowUpS } from "@/components/Icons/ArrowUpS";
import CalendarIcon from "@/components/Icons/CalendarIcon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useAddStudent, useEditStudent, useGetStudent } from "@/hooks/queryHooks/useStudent";
import { cn, getAcademicYears } from "@/lib/utils";
import { studentSchema } from "@/schema/student";
import { admissions, AdmissionStatus, boardings, BoardingStatus, Gender, genders, terms } from "@/types";
import { format, formatDate } from "date-fns";
import { useFormik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { SearchableSelect } from "@/components/StudentAndParent/SearchableSelect";

type AccordionItem = { id: number; title: string; studentId?: number };

const StudentForm = ({ index, onSaveSuccess, studentId }: { index: number; onSaveSuccess: (id: number) => void; studentId?: number }) => {
  const [avatar, setAvatar] = useState<string | undefined>();
  const [countries, setCountries] = useState<Country[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [branchId, setBranchId] = useState<number | undefined>();
  const [classId, setClassId] = useState<number | null>(null);

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: classes, isPending: loadingClasses } = useGetClasses(branchId);
  const { data: arms, isPending: loadingArms } = useGetArmsByClass(classId);
  const { data: studentData } = useGetStudent(studentId);
  const { mutate: addStudent, isPending: isAddingStudent } = useAddStudent();
  const { mutate: updateStudentData, isPending: isUpdatingStudentData } = useEditStudent();
  const student = studentData?.data;

  useEffect(() => {
    const fetchData = async () => {
      const countryList = await getCountries();
      setCountries(countryList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (countries.length > 0 && values.nationality) {
      const selectedCountry = countries.find(c => c.name === values.nationality);
      if (selectedCountry) {
        setAvailableStates(selectedCountry.states || []);
      } else {
        setAvailableStates([]);
      }
    } else {
      setAvailableStates([]);
    }
  }, [countries]);

  const formik = useFormik<StudentInputValues>({
    enableReinitialize: true,
    initialValues: {
      firstName: student?.firstName ?? "",
      lastName: student?.lastName ?? "",
      middleName: student?.middleName ?? "",
      email: student?.email ?? "",
      gender: (student?.gender as Gender) ?? Gender.Female,
      boardingStatus: (student?.boardingStatus as BoardingStatus) ?? BoardingStatus.Day,
      dateOfBirth: student?.dateOfBirth ?? `${new Date()}`,
      address: student?.address ?? "",
      emergencyContactName: student?.emergencyContactName ?? "",
      emergencyContact: student?.emergencyContact ?? "",
      phoneNumber: student?.phoneNumber ?? "",
      secondaryPhoneNumber: student?.secondaryPhoneNumber ?? "",
      admissionNumber: student?.admissionNumber ?? "",
      admissionStatus: (student?.studentStatus as AdmissionStatus) ?? AdmissionStatus.Active,
      medicalInformation: student?.medicalInformation ?? "",
      nationality: student?.nationality ?? "",
      stateOfOrigin: student?.stateOfOrigin ?? "",
      joinedSchoolTerm: student?.joinedSchoolTerm ?? "",
      joinedSchoolSession: student?.joinedSchoolSession ?? "",
      branchId: student?.branchId ?? null,
      classId: null,
      armId: student?.armId ?? null,
    },
    validationSchema: studentSchema,
    onSubmit: values => {
      if (studentId) {
        updateStudentData(
          {
            ...values,
            studentId,
            dateOfBirth: formatDate(new Date(values.dateOfBirth), "yyyy-MM-dd"),
            image: avatar,
            linkedParents: [],
            tags: [],
          },
          {
            onSuccess: () => {
              toast({ title: "Updated successfully", type: "success" });
              onSaveSuccess(index);
            },
            onError: error => {
              toast({ title: error.message ?? "Something went wrong", type: "error" });
            },
          },
        );
      } else {
        addStudent(
          {
            ...values,
            dateOfBirth: formatDate(new Date(values.dateOfBirth), "yyyy-MM-dd"),
            tags: [],
            linkedParents: [],
            image: avatar,
          },
          {
            onSuccess: data => {
              toast({
                title: `Successfully added ${data.data.firstName} ${data.data.lastName}`,
                type: "success",
              });
              onSaveSuccess(index);
            },
            onError: error => {
              toast({ title: error.message ?? "Something went wrong", type: "error" });
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    if (student) {
      setBranchId(student.branchId);
      setClassId(student.classId);
    }
  }, [student]);

  useEffect(() => {
    if (student) {
      formik.setValues({
        firstName: student.firstName ?? "",
        lastName: student.lastName ?? "",
        middleName: student.middleName ?? "",
        email: student.email ?? "",
        gender: (student.gender as Gender) ?? Gender.Female,
        boardingStatus: (student.boardingStatus as BoardingStatus) ?? BoardingStatus.Day,
        dateOfBirth: student.dateOfBirth ?? `${new Date()}`,
        address: student.address ?? "",
        emergencyContactName: student.emergencyContactName ?? "",
        emergencyContact: student.emergencyContact ?? "",
        phoneNumber: student.phoneNumber ?? "",
        secondaryPhoneNumber: student.secondaryPhoneNumber ?? "",
        admissionNumber: student.admissionNumber ?? "",
        admissionStatus: (student.studentStatus as AdmissionStatus) ?? AdmissionStatus.Active,
        medicalInformation: student.medicalInformation ?? "",
        nationality: student.nationality ?? "",
        stateOfOrigin: student.stateOfOrigin ?? "",
        joinedSchoolTerm: student.joinedSchoolTerm ?? "",
        joinedSchoolSession: student.joinedSchoolSession ?? "",
        branchId: student.branchId ?? null,
        classId: student.classId ?? null,
        armId: student.armId ?? null,
      });
    }
  }, [student]);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit } = formik;

  // const handleCountryChange = (countryName: string) => {
  //   const selected = countries.find(c => c.name === countryName);
  //   setActiveCountryCode(selected?.iso2 || "");
  //   setFieldValue("nationality", countryName);
  //   setFieldValue("stateOfOrigin", "");
  // };

  const isPending = isAddingStudent || isUpdatingStudentData;

  return (
    <form onSubmit={handleSubmit} className="p-3 md:px-6 md:py-4">
      <div className="border-border-default flex flex-col gap-6 border-b pb-6">
        <div className="text-text-default text-lg font-semibold">Profile Picture</div>
        <ProfilePicture setAvatar={setAvatar} />
      </div>

      <div className="flex flex-col gap-8 pt-8">
        <div className="text-text-default text-lg font-semibold">Personal Information</div>

        <div className="border-border-default grid gap-8 border-b pb-8 md:grid-cols-2">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor={`firstName-${index}`} className="text-text-default text-sm font-medium">
              First Name <span className="text-text-destructive text-xs">*</span>
            </Label>
            <Input
              id={`firstName-${index}`}
              name="firstName"
              autoFocus
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Input First Name"
              className={cn(
                "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                touched.firstName && errors.firstName && "border-border-destructive border",
              )}
            />
            {touched.firstName && errors.firstName && <p className="text-text-destructive text-xs font-light">{errors.firstName}</p>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor={`lastName-${index}`} className="text-text-default text-sm font-medium">
              Last Name <span className="text-text-destructive text-xs">*</span>
            </Label>
            <Input
              id={`lastName-${index}`}
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Input Last Name"
              className={cn(
                "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                touched.lastName && errors.lastName && "border-border-destructive border",
              )}
            />
            {touched.lastName && errors.lastName && <p className="text-text-destructive text-xs font-light">{errors.lastName}</p>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor={`middleName-${index}`} className="text-text-default text-sm font-medium">
              Middle Name
            </Label>
            <Input
              id={`middleName-${index}`}
              name="middleName"
              value={values.middleName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Input Middle Name"
              className="text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Gender <span className="text-text-destructive text-xs">*</span>
            </Label>
            <Select value={values.gender} onValueChange={v => setFieldValue("gender", v)}>
              <SelectTrigger
                className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                onBlur={() => setFieldTouched("gender", true)}
              >
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {genders.map(g => (
                  <SelectItem key={g.value} value={g.value} className="text-text-default">
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.gender && errors.gender && <p className="text-text-destructive text-xs font-light">{errors.gender}</p>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Date of Birth <span className="text-text-destructive text-xs">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-text-muted bg-bg-input-soft! focus-visible:border-border-default! hover:bg-bg-input-soft! w-full border-none text-sm font-normal shadow-none"
                >
                  {date ? format(date, "PPP") : <span className="text-text-default">dd / mm / yy</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-bg-card! p-0!" align="start">
                <Calendar
                  disabled={{ after: new Date() }}
                  mode="single"
                  required
                  selected={date}
                  onSelect={d => {
                    setDate(d);
                    setFieldValue("dateOfBirth", d);
                  }}
                  captionLayout="dropdown"
                  className="bg-bg-card text-text-default w-full border-none"
                />
              </PopoverContent>
            </Popover>
            {touched.dateOfBirth && errors.dateOfBirth && <p className="text-text-destructive text-xs font-light">{errors.dateOfBirth}</p>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor={`medicalInformation-${index}`} className="text-text-default text-sm font-medium">
              Medical Information
            </Label>
            <Input
              id={`medicalInformation-${index}`}
              name="medicalInformation"
              value={values.medicalInformation}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Input Any Medical Information"
              className="text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Nationality <span className="text-text-destructive text-xs">*</span>
            </Label>
            {countries && countries.length > 0 ? (
              <SearchableSelect
                options={countries.map(country => ({
                  label: country.name,
                  value: country.name,
                  flag: country.flag,
                }))}
                value={values.nationality}
                onValueChange={country => {
                  setFieldValue("nationality", country);
                  setFieldValue("stateOfOrigin", ""); // Reset state if country changes
                }}
                placeholder="Select Nationality"
                searchPlaceholder="Search country..."
              />
            ) : (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            )}
            {touched.nationality && errors.nationality && <p className="text-text-destructive text-xs font-light">{errors.nationality}</p>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              State of Origin <span className="text-text-destructive text-xs">*</span>
            </Label>
            <Select
              disabled={!values.nationality}
              value={values.stateOfOrigin}
              onValueChange={value => {
                setFieldValue("stateOfOrigin", value);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Select State of Origin" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {availableStates.length === 0 && values.nationality ? (
                  <div className="flex items-center justify-center p-2">
                    <span className="text-text-muted text-xs">No states available</span>
                  </div>
                ) : (
                  availableStates.map(stateName => (
                    <SelectItem key={stateName} className="text-text-default" value={stateName}>
                      {stateName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {touched.stateOfOrigin && errors.stateOfOrigin && <p className="text-text-destructive text-xs font-light">{errors.stateOfOrigin}</p>}
          </div>
        </div>

        <div className="text-text-default text-lg font-semibold">Contact Information</div>

        <div className="border-border-default flex flex-col gap-6 border-b pb-8">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor={`address-${index}`} className="text-text-default text-sm font-medium">
              Home Address <span className="text-text-destructive text-xs">*</span>
            </Label>
            <Input
              id={`address-${index}`}
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Input Home Address"
              className={cn(
                "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                touched.address && errors.address && "border-border-destructive border",
              )}
            />
            {touched.address && errors.address && <p className="text-text-destructive text-xs font-light">{errors.address}</p>}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor={`email-${index}`} className="text-text-default text-sm font-medium">
              Email Address
            </Label>
            <Input
              id={`email-${index}`}
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Input Email Address"
              className={cn(
                "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                touched.email && errors.email && "border-border-destructive border",
              )}
            />
            {touched.email && errors.email && <p className="text-text-destructive text-xs font-light">{errors.email}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor={`phoneNumber-${index}`} className="text-text-default text-sm font-medium">
                Primary Phone Number
              </Label>
              <Input
                id={`phoneNumber-${index}`}
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="000-000-0000"
                className={cn(
                  "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                  touched.phoneNumber && errors.phoneNumber && "border-border-destructive border",
                )}
              />
              {touched.phoneNumber && errors.phoneNumber && <p className="text-text-destructive text-xs font-light">{errors.phoneNumber}</p>}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label htmlFor={`secondaryPhoneNumber-${index}`} className="text-text-default text-sm font-medium">
                Secondary Phone Number
              </Label>
              <Input
                id={`secondaryPhoneNumber-${index}`}
                name="secondaryPhoneNumber"
                value={values.secondaryPhoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="000-000-0000"
                className={cn(
                  "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                  touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && "border-border-destructive border",
                )}
              />
              {touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && (
                <p className="text-text-destructive text-xs font-light">{errors.secondaryPhoneNumber}</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label htmlFor={`emergencyContactName-${index}`} className="text-text-default text-sm font-medium">
                Emergency Contact Name
              </Label>
              <Input
                id={`emergencyContactName-${index}`}
                name="emergencyContactName"
                value={values.emergencyContactName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Input Emergency Contact Name"
                className={cn(
                  "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                  touched.emergencyContactName && errors.emergencyContactName && "border-border-destructive border",
                )}
              />
              {touched.emergencyContactName && errors.emergencyContactName && (
                <p className="text-text-destructive text-xs font-light">{errors.emergencyContactName}</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label htmlFor={`emergencyContact-${index}`} className="text-text-default text-sm font-medium">
                Emergency Contact Number
              </Label>
              <Input
                id={`emergencyContact-${index}`}
                name="emergencyContact"
                value={values.emergencyContact}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Input Emergency Contact Number"
                className={cn(
                  "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                  touched.emergencyContact && errors.emergencyContact && "border-border-destructive border",
                )}
              />
              {touched.emergencyContact && errors.emergencyContact && (
                <p className="text-text-destructive text-xs font-light">{errors.emergencyContact}</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-text-default text-lg font-semibold">Academic Information</div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">
              Joined School Session <small className="text-text-destructive text-xs">*</small>
            </Label>
            <Select value={values.joinedSchoolSession} onValueChange={v => setFieldValue("joinedSchoolSession", v)}>
              <SelectTrigger
                className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                onBlur={() => setFieldTouched("joinedSchoolSession", true)}
              >
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {getAcademicYears().map(session => (
                  <SelectItem key={session} value={session} className="text-text-default">
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.joinedSchoolSession && errors.joinedSchoolSession && (
              <p className="text-text-destructive text-xs font-light">{errors.joinedSchoolSession}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">
              Joined School Term <small className="text-text-destructive text-xs">*</small>
            </Label>
            <Select value={values.joinedSchoolTerm} onValueChange={v => setFieldValue("joinedSchoolTerm", v)}>
              <SelectTrigger
                className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                onBlur={() => setFieldTouched("joinedSchoolTerm", true)}
              >
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {terms.map(term => (
                  <SelectItem key={term.value} value={term.value} className="text-text-default">
                    {term.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.joinedSchoolTerm && errors.joinedSchoolTerm && (
              <p className="text-text-destructive text-xs font-light">{errors.joinedSchoolTerm}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`admissionNumber-${index}`} className="text-text-default text-sm font-medium">
              Admission Number
            </Label>
            <Input
              id={`admissionNumber-${index}`}
              name="admissionNumber"
              value={values.admissionNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="GFA/2023/01045"
              className={cn(
                "text-text-muted bg-bg-input-soft! h-9 border-none text-sm font-normal",
                touched.admissionNumber && errors.admissionNumber && "border-border-destructive border",
              )}
            />
            {touched.admissionNumber && errors.admissionNumber && (
              <p className="text-text-destructive text-xs font-light">{errors.admissionNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">
              Branch <small className="text-text-destructive text-xs">*</small>
            </Label>
            {!branches || loadingBranches ? (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            ) : (
              <Select
                value={values.branchId ? String(values.branchId) : ""}
                onValueChange={value => {
                  const branch = branches.data?.find((br: BranchWithClassLevels) => br.branch.uuid === value);
                  setBranchId(branch?.branch.id);
                  setFieldValue("branchId", branch?.branch.id ?? null);
                  setFieldValue("classId", null);
                  setFieldValue("armId", null);
                  setClassId(null);
                }}
              >
                <SelectTrigger
                  className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                  onBlur={() => setFieldTouched("branchId", true)}
                >
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {branches.data?.map((br: BranchWithClassLevels) => (
                    <SelectItem key={br.branch.id} value={br.branch.uuid} className="text-text-default">
                      {br.branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {touched.branchId && errors.branchId && <p className="text-text-destructive text-xs font-light">{errors.branchId}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">
              Class <small className="text-text-destructive text-xs">*</small>
            </Label>
            {!classes || loadingClasses ? (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            ) : (
              <Select
                disabled={!branchId}
                value={values.classId ? String(values.classId) : ""}
                onValueChange={value => {
                  const classObj = classes.data.content?.find((cls: ClassType) => cls.uuid === value);
                  setClassId(classObj?.id);
                  setFieldValue("classId", classObj?.id ?? null);
                  setFieldValue("armId", null);
                }}
              >
                <SelectTrigger
                  className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                  onBlur={() => setFieldTouched("classId", true)}
                >
                  <SelectValue placeholder={!branchId ? "Select a branch first" : "Select Class"} />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {classes.data.content.map((cls: ClassType) => (
                    <SelectItem key={cls.id} value={cls.uuid} className="text-text-default">
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {touched.classId && errors.classId && <p className="text-text-destructive text-xs font-light">{errors.classId}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">
              Arm <small className="text-text-destructive text-xs">*</small>{" "}
              {!classId && <span className="text-text-default text-xs font-light">(Select a class first)</span>}
            </Label>
            {!arms || loadingArms ? (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            ) : (
              <Select
                disabled={!classId}
                value={values.armId ? String(values.armId) : ""}
                onValueChange={value => {
                  const arm = arms.data?.content?.find((a: Arm) => a.uuid === value);
                  setFieldValue("armId", arm?.id ?? null);
                }}
              >
                <SelectTrigger
                  className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                  onBlur={() => setFieldTouched("armId", true)}
                >
                  <SelectValue placeholder={!classId ? "Select a class first" : "Select Arm"} />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {arms.data.content.length === 0 ? (
                    <SelectItem disabled value="none" className="text-text-default">
                      No Arms Found
                    </SelectItem>
                  ) : (
                    arms.data.content.map((arm: Arm) => (
                      <SelectItem key={arm.id} value={arm.uuid} className="text-text-default">
                        {arm.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
            {touched.armId && errors.armId && <p className="text-text-destructive text-xs font-light">{errors.armId}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">Boarding Status</Label>
            <Select value={values.boardingStatus} onValueChange={v => setFieldValue("boardingStatus", v)}>
              <SelectTrigger
                className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                onBlur={() => setFieldTouched("boardingStatus", true)}
              >
                <SelectValue placeholder="Boarding Status" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {boardings.map(status => (
                  <SelectItem key={status.value} value={status.value} className="text-text-default">
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">
              Admission Status <small className="text-text-destructive text-xs">*</small>
            </Label>
            <Select value={values.admissionStatus} onValueChange={v => setFieldValue("admissionStatus", v)}>
              <SelectTrigger
                className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                onBlur={() => setFieldTouched("admissionStatus", true)}
              >
                <SelectValue placeholder="Admission Status" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {admissions.map(ad => (
                  <SelectItem key={ad.value} value={ad.value} className="text-text-default">
                    {ad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.admissionStatus && errors.admissionStatus && (
              <p className="text-text-destructive text-xs font-light">{errors.admissionStatus}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default disabled:bg-bg-state-soft! disabled:text-text-subtle! h-8 disabled:cursor-not-allowed"
          >
            {isPending && <Spinner className="text-text-white-default mr-2" />}
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export const ParentStudent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const parentId = Number(pathname.split("/")[3]);

  const [items, setItems] = useState<AccordionItem[]>([{ id: 1, title: "Student" }]);
  const [openId, setOpenId] = useState<number | null>(1);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const { data: parentData } = useGetParent(parentId);

  const handleSaveSuccess = (id: number) => {
    setSavedIds(prev => new Set(prev).add(id));
  };

  const allSaved = items.every(item => savedIds.has(item.id));

  function addItem() {
    const newId = items.length + 1;
    setItems(prev => [...prev, { id: newId, title: "Student" }]);
    setOpenId(newId);
  }

  function toggle(id: number) {
    setOpenId(prev => (prev === id ? null : id));
  }

  useEffect(() => {
    if (parentData?.linkedStudents?.length) {
      setItems(
        parentData.linkedStudents.map((s: Parent) => ({
          id: s.id,
          title: "Student",
          studentId: s.id,
        })),
      );
    }
  }, [parentData]);

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4">
      <div className="border-border-default border-b">
        <div className="flex flex-col gap-1 pb-4">
          <div className="text-text-default text-md font-semibold">Student Information</div>
          <div className="text-text-muted text-xs">Add one or more children attending this school</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={item.id} className="border-border-default rounded-md border">
            <div
              role="button"
              onClick={() => toggle(item.id)}
              className="border-border-default flex w-full items-center justify-between border-b p-4"
            >
              <div className="flex items-center gap-2">
                <span className="bg-bg-state-gray text-text-inverted-default flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-text-default text-lg font-medium">
                  {item.title} {index + 1}
                </span>
              </div>
              <ArrowUpS fill="var(--color-icon-default-muted)" className={`transition-transform ${openId === item.id ? "rotate-180" : ""}`} />
            </div>

            {openId === item.id && <StudentForm index={index} onSaveSuccess={() => handleSaveSuccess(item.id)} studentId={item.studentId} />}
          </div>
        ))}

        <Button onClick={addItem} className="text-text-default border-border-default w-full border border-dashed text-center">
          + Add item
        </Button>
      </div>

      <div className="border-border-default flex w-full justify-between border-t pt-4">
        <Button onClick={() => router.back()} className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-8">
          Back
        </Button>
        <Button
          disabled={!allSaved}
          onClick={() => router.push(`${pathname}?step=review`)}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 disabled:cursor-not-allowed!"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
