import { Branch, Student } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditStudent } from "@/hooks/queryHooks/useStudent";
import { studentSchema } from "@/schema/student";
import { AdmissionStatus, BoardingStatus, Gender, genders } from "@/types";
import { useFormik } from "formik";
import { getCountries, getStatesForCountry } from "@/app/actions/country";
import { Country, State, StudentInputValues } from "@/components/StudentAndParent/types";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { toast } from "@/components/Toast";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";

export const EditStudentBiodata = ({ onSave, onCancel, data }: { data: { data: Student } | undefined; onSave: () => void; onCancel: () => void }) => {
  const student = data?.data;

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [activeCountryCode, setActiveCountryCode] = useState("");
  const [branch, setBranch] = useState<string>();

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { mutate, isPending } = useEditStudent();

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  const fetchStates = useCallback(async () => {
    const stateList = await getStatesForCountry(activeCountryCode);
    setStates(stateList);
  }, [activeCountryCode]);

  useEffect(() => {
    if (activeCountryCode) {
      setStates([]);
      fetchStates();
    }
  }, [activeCountryCode, fetchStates]);

  useEffect(() => {
    if (student?.nationality && countries.length > 0) {
      const country = countries.find(c => c.name === student.nationality);
      if (country) setActiveCountryCode(country.iso2);
    }
  }, [countries, student?.nationality]);

  const formik = useFormik<StudentInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: Gender.Female,
      boardingStatus: BoardingStatus.Day,
      dateOfBirth: "",
      address: "",
      emergencyContactName: "",
      emergencyContact: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      admissionNumber: "",
      admissionStatus: AdmissionStatus.Active,
      medicalInformation: "",
      nationality: "",
      stateOfOrigin: "",
      joinedSchoolTerm: "",
      joinedSchoolSession: "",
      branchId: null,
      classId: null,
      armId: null,
    },
    validationSchema: studentSchema,
    enableReinitialize: true,
    onSubmit: values => {
      if (!student?.id) return;
      mutate(
        {
          ...values,
          studentId: student.id,
          tags: [],
          linkedParents: [],
          //   image: avatar,
        },
        {
          onSuccess: () => {
            toast({ title: "Student updated successfully", type: "success" });
            onSave();
          },
          onError: error => {
            toast({ title: error?.message ?? "Something went wrong", type: "error" });
          },
        },
      );
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit } = formik;

  useEffect(() => {
    if (data) {
      formik.setFieldValue("firstName", data.data.firstName);
      formik.setFieldValue("lastName", data.data.lastName);
      formik.setFieldValue("middleName", data.data.middleName);
      formik.setFieldValue("email", data.data.email);
      formik.setFieldValue("nationality", data.data.nationality);
      formik.setFieldValue("stateOfOrigin", data.data.stateOfOrigin);
      formik.setFieldValue("phoneNumber", data.data.phoneNumber);
      formik.setFieldValue("secondaryPhoneNumber", data.data.secondaryPhoneNumber ?? "");
      formik.setFieldValue("emergencyContactName", data.data.emergencyContactName ?? "");
      formik.setFieldValue("emergencyContact", data.data.emergencyContact ?? "");
      formik.setFieldValue("gender", data.data.gender);
      formik.setFieldValue("address", data.data.address);
      formik.setFieldValue("branchId", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (data && branches) {
      const brnch = branches.data.content?.find((brnch: Branch) => brnch.name === data.data.branch);
      formik.setFieldValue("branchId", brnch?.id);
      setBranch(brnch?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, branches]);

  const handleCountryChange = (countryName: string) => {
    const selected = countries.find(c => c.name === countryName);
    setActiveCountryCode(selected?.iso2 || "");
    setFieldValue("nationality", countryName);
    setFieldValue("stateOfOrigin", "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-bg-muted w-full rounded-xl p-4">
        <div className="border-border-default border-b px-5 py-4">
          <p className="text-text-default text-md font-semibold">Editing Biodata</p>
          <p className="text-text-subtle text-xs">Changes will be submitted for review</p>
        </div>

        <div className="bg-bg-card rounded-lg">
          <div className="flex flex-col gap-3 px-5 py-5 md:gap-6">
            <div className="border-border-default flex flex-col gap-1.5 border-b pb-3 md:pb-6">
              <p className="text-text-default text-sm font-medium">Picture</p>
              <div className="flex items-center gap-3">
                <Avatar />
                <span className="text-text-default border-border-default bg-bg-state-secondary h-7 cursor-pointer rounded-md border p-1 text-sm font-medium">
                  Upload
                </span>
                <span className="text-text-muted text-xs">JPG or PNG. 1MB Max.</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-text-default text-sm font-semibold">Personal Information</p>

              <div className="border-border-default grid grid-cols-1 gap-3 border-b pb-3 md:grid-cols-2 md:gap-6 md:pb-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    First Name <span className="text-text-destructive">*</span>
                  </Label>
                  <Input
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Input First Name"
                    className={cn(
                      "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                      touched.firstName && errors.firstName && "border-border-destructive border",
                    )}
                  />
                  {touched.firstName && errors.firstName && <p className="text-text-destructive text-xs font-light">{errors.firstName}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Last Name <span className="text-text-destructive">*</span>
                  </Label>
                  <Input
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Input Last Name"
                    className={cn(
                      "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                      touched.lastName && errors.lastName && "border-border-destructive border",
                    )}
                  />
                  {touched.lastName && errors.lastName && <p className="text-text-destructive text-xs font-light">{errors.lastName}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Middle Name</Label>
                  <Input
                    name="middleName"
                    value={values.middleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Input Middle Name"
                    className="bg-bg-input-soft! h-8! w-full rounded-md border-none text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Gender <span className="text-text-destructive">*</span>
                  </Label>
                  <Select value={values.gender} onValueChange={v => setFieldValue("gender", v)}>
                    <SelectTrigger
                      className={cn(
                        "bg-bg-input-soft! text-text-default h-8! w-full rounded-md border-none text-sm",
                        touched.gender && errors.gender && "border-border-destructive border",
                      )}
                      onBlur={() => setFieldTouched("gender", true)}
                    >
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                      {genders.map(g => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.gender && errors.gender && <p className="text-text-destructive text-xs font-light">{errors.gender}</p>}
                </div>

                <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
                  <Label className="text-text-default text-sm font-medium">
                    Branch <span className="text-text-destructive">*</span>{" "}
                  </Label>
                  {!branches?.data.length || loadingBranches ? (
                    <Skeleton className="bg-bg-input-soft h-8 w-full" />
                  ) : (
                    <Select
                      value={branch}
                      onValueChange={value => {
                        const branch = branches?.data?.branch?.find((branch: Branch) => branch.name === value);
                        if (branch) {
                          formik.setFieldValue("branchId", branch.id);
                        }
                      }}
                    >
                      <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                        <SelectValue placeholder="Branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {branches.data.content.map((branch: Branch) => (
                          <SelectItem key={branch.id} className="text-text-default" value={branch.name ?? ""}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {touched.branchId && errors.branchId && <p className="text-text-destructive text-xs font-light">{errors.branchId}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Nationality <span className="text-text-destructive">*</span>
                  </Label>
                  {countries.length > 0 ? (
                    <Select value={values.nationality} onValueChange={handleCountryChange}>
                      <SelectTrigger
                        className="bg-bg-input-soft! text-text-default h-8! w-full rounded-md border-none text-sm"
                        onBlur={() => setFieldTouched("nationality", true)}
                      >
                        <SelectValue placeholder="Select Nationality" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                        {countries.map(c => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Skeleton className="bg-bg-input-soft h-8 w-full" />
                  )}
                  {touched.nationality && errors.nationality && <p className="text-text-destructive text-xs font-light">{errors.nationality}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    State of Origin <span className="text-text-destructive">*</span>
                  </Label>
                  <Select disabled={!activeCountryCode} value={values.stateOfOrigin} onValueChange={v => setFieldValue("stateOfOrigin", v)}>
                    <SelectTrigger
                      className="bg-bg-input-soft! text-text-default h-8! w-full rounded-md border-none text-sm"
                      onBlur={() => setFieldTouched("stateOfOrigin", true)}
                    >
                      <SelectValue placeholder={!activeCountryCode ? "Select a country first" : "Select State of Origin"} />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                      {states.length === 0 ? (
                        <div className="flex items-center justify-center p-2">
                          <Spinner />
                        </div>
                      ) : (
                        states.map(s => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {touched.stateOfOrigin && errors.stateOfOrigin && (
                    <p className="text-text-destructive text-xs font-light">{errors.stateOfOrigin}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-6">
              <p className="text-text-default text-lg font-semibold">Contact Information</p>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Email Address <span className="text-text-destructive">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Input Email Address"
                  className={cn(
                    "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                    touched.email && errors.email && "border-border-destructive border",
                  )}
                />
                {touched.email && errors.email && <p className="text-text-destructive text-xs font-light">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Primary Phone Number <span className="text-text-destructive">*</span>
                  </Label>
                  <Input
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="000-000-0000"
                    className={cn(
                      "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                      touched.phoneNumber && errors.phoneNumber && "border-border-destructive border",
                    )}
                  />
                  {touched.phoneNumber && errors.phoneNumber && <p className="text-text-destructive text-xs font-light">{errors.phoneNumber}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Secondary Phone Number <span className="text-text-destructive">*</span>
                  </Label>
                  <Input
                    name="secondaryPhoneNumber"
                    value={values.secondaryPhoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="000-000-0000"
                    className={cn(
                      "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                      touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && "border-border-destructive border",
                    )}
                  />
                  {touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && (
                    <p className="text-text-destructive text-xs font-light">{errors.secondaryPhoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Home Address <span className="text-text-destructive">*</span>
                </Label>
                <Input
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Input Home Address"
                  className={cn(
                    "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                    touched.address && errors.address && "border-border-destructive border",
                  )}
                />
                {touched.address && errors.address && <p className="text-text-destructive text-xs font-light">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Emergency Contact Name <span className="text-text-destructive">*</span>
                  </Label>
                  <Input
                    name="emergencyContactName"
                    value={values.emergencyContactName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Damilare John"
                    className={cn(
                      "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                      touched.emergencyContactName && errors.emergencyContactName && "border-border-destructive border",
                    )}
                  />
                  {touched.emergencyContactName && errors.emergencyContactName && (
                    <p className="text-text-destructive text-xs font-light">{errors.emergencyContactName}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Emergency Contact Number <span className="text-text-destructive">*</span>
                  </Label>
                  <Input
                    name="emergencyContact"
                    value={values.emergencyContact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0000000000"
                    className={cn(
                      "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                      touched.emergencyContact && errors.emergencyContact && "border-border-destructive border",
                    )}
                  />
                  {touched.emergencyContact && errors.emergencyContact && (
                    <p className="text-text-destructive text-xs font-light">{errors.emergencyContact}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-border-default flex items-center justify-between gap-3 border-t px-5 py-4 md:justify-end">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-darker text-text-default border text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default text-sm"
            >
              {isPending && <Spinner className="text-text-white-default mr-2" />}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
