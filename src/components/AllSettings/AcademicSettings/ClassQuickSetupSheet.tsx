import { CloseFill } from "@/components/Icons/CloseFill";
import Settings4 from "@/components/Icons/Settings4";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

const startclasses = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"];
const endClasses = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"];
export const ClassQuickSetupSheet = () => {
  const [startClass, setStartClass] = useState(startclasses[0]);
  const [endClass, setEndClass] = useState(endClasses[0]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [departmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [armsEnabled, setArmsEnabled] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className="">
      <Button
        onClick={() => setSheetOpen(true)}
        className="bg-bg-state-secondary! border-border-darker! text-text-default rounded-md! border shadow-sm lg:ml-[-149]"
      >
        <Settings4 fill="var(--color-icon-default-muted)" /> Quick Setup
      </Button>
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <div>
            <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <VisuallyHidden>
                  <SheetTitle>Quick Setup</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center justify-between">
                  <div className="text-text-default text-md font-semibold">Quick Setup</div>
                </div>
              </SheetHeader>

              <div className="flex w-full flex-col gap-6 p-6">
                <div className="text-text-default text-xl font-semibold">Customize Level</div>
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Level name <span className="text-text-destructive">*</span>{" "}
                  </Label>
                  <Input type="text" className="bg-bg-input-soft! text-text-default w-full rounded-md border-none text-sm" placeholder="Creche" />
                </div>
                <div className="border-border-default flex items-center justify-between gap-3 border-b pb-6">
                  <div className="flex w-full flex-col gap-2">
                    <Select value={startClass} onValueChange={setStartClass}>
                      <div className="flex flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Class Start</Label>
                        <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                          <SelectValue>
                            <span className="text-text-default text-sm font-medium">{startClass}</span>
                          </SelectValue>
                        </SelectTrigger>
                      </div>
                      <SelectContent className="bg-bg-card border-border-default">
                        {startclasses.map(str => (
                          <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                            {str}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-text-muted text-xs">e.g Primary 1</span>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Select value={endClass} onValueChange={setEndClass}>
                      <div className="flex flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Class End</Label>
                        <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                          <SelectValue>
                            <span className="text-text-default text-sm font-medium">{endClass}</span>
                          </SelectValue>
                        </SelectTrigger>
                      </div>
                      <SelectContent className="bg-bg-card border-border-default">
                        {endClasses.map(str => (
                          <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                            {str}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-text-muted text-xs">e.g Primary 6</span>
                  </div>
                </div>

                <div className="text-text-default text-xl font-semibold">Departments</div>
                <div className="flex items-start justify-between gap-2">
                  <div className="">
                    <div className="text-text-default text-sm font-medium">Enable Departments</div>
                    <div className="text-text-subtle text-sm">
                      Departments let you organize students within the same level into different academic paths. This way, classes under the same
                      level can offer different sets of subjects or focus areas.
                    </div>
                  </div>
                  <Toggle checked={departmentsEnabled} onChange={e => setDepartmentsEnabled((e.target as HTMLInputElement).checked)} />
                </div>
                {departmentsEnabled && (
                  <>
                    <div className="border-border-default flex flex-col gap-3 border-b pt-4 pb-4">
                      <div className="text-text-default text-sm font-medium">Departments</div>
                      <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                        <Input
                          type="text"
                          className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm"
                          placeholder="Add Department"
                        />
                        <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                      </div>
                      <div className="flex items-center gap-1">
                        {" "}
                        {["Mathematics", "English Language", "Basic Science"].map(subject => (
                          <Badge
                            key={subject}
                            className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                          >
                            <span className="text-text-subtle text-xs">{subject}</span>{" "}
                            <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                          </Badge>
                        ))}
                      </div>
                      <div className="text-text-muted text-xs">
                        You can add multiple departments at once by separating with a comma e.g Art, Commercial, Science
                      </div>
                    </div>

                    <div className="text-text-default text-xl font-semibold">Department Subjects</div>
                    <div className="flex flex-col gap-3 pt-4 pb-4">
                      <Label className="text-text-default text-sm font-medium">Art Subjects</Label>
                      <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                        <Input
                          type="text"
                          className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm"
                          placeholder="Add Department"
                        />
                        <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                      </div>
                      <div className="flex items-center gap-1">
                        {" "}
                        {["Mathematics", "English Language", "Basic Science"].map(subject => (
                          <Badge
                            key={subject}
                            className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                          >
                            <span className="text-text-subtle text-xs">{subject}</span>{" "}
                            <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                          </Badge>
                        ))}
                      </div>
                      <div className="text-text-muted text-xs">
                        You can add multiple subjects at once by separating with a comma e.g English Language, Mathematics etc.{" "}
                      </div>
                    </div>
                  </>
                )}

                <div className="">
                  <div className="text-text-default mb-6 text-xl font-semibold">Subjects</div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Subjects</Label>
                    <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                      <Input
                        type="text"
                        className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm"
                        placeholder="Enter Subjects"
                      />
                      <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {" "}
                      {["Mathematics", "English Language", "Basic Science"].map(subject => (
                        <Badge
                          key={subject}
                          className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                        >
                          <span className="text-text-subtle text-xs">{subject}</span>{" "}
                          <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                        </Badge>
                      ))}
                      <div className="text-text-muted mt-1 text-xs">
                        You can add multiple departments at once by separating with a comma e.g English Language, Mathematics etc.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-text-default text-xl font-semibold">Subjects</div>
                  <Toggle checked={armsEnabled} onChange={e => setArmsEnabled((e.target as HTMLInputElement).checked)} />
                </div>
                {armsEnabled && (
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Subjects</Label>
                    <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                      <Input
                        type="text"
                        className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm"
                        placeholder="Enter Subjects"
                      />
                      <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {" "}
                      {["Mathematics", "English Language", "Basic Science"].map(subject => (
                        <Badge
                          key={subject}
                          className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                        >
                          <span className="text-text-subtle text-xs">{subject}</span>{" "}
                          <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                        </Badge>
                      ))}
                      <div className="text-text-muted mt-1 text-xs">
                        You can add multiple departments at once by separating with a comma e.g English Language, Mathematics etc.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <SheetFooter className="border-border-default border-t pb-8">
                <div className="flex items-center justify-between">
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                    >
                      Close
                    </Button>
                  </SheetClose>
                  <Button
                    type="submit"
                    className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
                  >
                    Save
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </div>
        </Sheet>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Quick Setup">
          <div className="flex w-full flex-col gap-6 p-6">
            <div className="text-text-default text-xl font-semibold">Customize Level</div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Level name <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input type="text" className="bg-bg-input-soft! text-text-default w-full rounded-md border-none text-sm" placeholder="Creche" />
            </div>
            <div className="border-border-default flex items-center justify-between gap-3 border-b pb-6">
              <div className="flex w-full flex-col gap-2">
                <Select value={startClass} onValueChange={setStartClass}>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Class Start</Label>
                    <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                      <SelectValue>
                        <span className="text-text-default text-sm font-medium">{startClass}</span>
                      </SelectValue>
                    </SelectTrigger>
                  </div>
                  <SelectContent className="bg-bg-card border-border-default">
                    {startclasses.map(str => (
                      <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                        {str}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-text-muted text-xs">e.g Primary 1</span>
              </div>
              <div className="flex w-full flex-col gap-2">
                <Select value={endClass} onValueChange={setEndClass}>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Class End</Label>
                    <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                      <SelectValue>
                        <span className="text-text-default text-sm font-medium">{endClass}</span>
                      </SelectValue>
                    </SelectTrigger>
                  </div>
                  <SelectContent className="bg-bg-card border-border-default">
                    {endClasses.map(str => (
                      <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                        {str}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-text-muted text-xs">e.g Primary 6</span>
              </div>
            </div>

            <div className="text-text-default text-xl font-semibold">Departments</div>
            <div className="flex items-start justify-between gap-2">
              <div className="">
                <div className="text-text-default text-sm font-medium">Enable Departments</div>
                <div className="text-text-subtle text-sm">
                  Departments let you organize students within the same level into different academic paths. This way, classes under the same level
                  can offer different sets of subjects or focus areas.
                </div>
              </div>
              <Toggle checked={departmentsEnabled} onChange={e => setDepartmentsEnabled((e.target as HTMLInputElement).checked)} />
            </div>
            {departmentsEnabled && (
              <>
                <div className="border-border-default flex flex-col gap-3 border-b pt-4 pb-4">
                  <div className="text-text-default text-sm font-medium">Departments</div>
                  <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                    <Input
                      type="text"
                      className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm"
                      placeholder="Add Department"
                    />
                    <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                  </div>
                  <div className="flex items-center gap-1">
                    {" "}
                    {["Mathematics", "English Language", "Basic Science"].map(subject => (
                      <Badge
                        key={subject}
                        className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                      >
                        <span className="text-text-subtle text-xs">{subject}</span>{" "}
                        <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                  <div className="text-text-muted text-xs">
                    You can add multiple departments at once by separating with a comma e.g Art, Commercial, Science
                  </div>
                </div>

                <div className="text-text-default text-xl font-semibold">Department Subjects</div>
                <div className="flex flex-col gap-3 pt-4 pb-4">
                  <Label className="text-text-default text-sm font-medium">Art Subjects</Label>
                  <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                    <Input
                      type="text"
                      className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm"
                      placeholder="Add Department"
                    />
                    <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                  </div>
                  <div className="flex items-center gap-1">
                    {" "}
                    {["Mathematics", "English Language", "Basic Science"].map(subject => (
                      <Badge
                        key={subject}
                        className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                      >
                        <span className="text-text-subtle text-xs">{subject}</span>{" "}
                        <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                  <div className="text-text-muted text-xs">
                    You can add multiple subjects at once by separating with a comma e.g English Language, Mathematics etc.{" "}
                  </div>
                </div>
              </>
            )}

            <div className="">
              <div className="text-text-default mb-6 text-xl font-semibold">Subjects</div>
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Subjects</Label>
                <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                  <Input type="text" className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm" placeholder="Enter Subjects" />
                  <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {" "}
                  {["Mathematics", "English Language", "Basic Science"].map(subject => (
                    <Badge
                      key={subject}
                      className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                    >
                      <span className="text-text-subtle text-xs">{subject}</span>{" "}
                      <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                    </Badge>
                  ))}
                  <div className="text-text-muted mt-1 text-xs">
                    You can add multiple departments at once by separating with a comma e.g English Language, Mathematics etc.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-text-default text-xl font-semibold">Subjects</div>
              <Toggle checked={armsEnabled} onChange={e => setArmsEnabled((e.target as HTMLInputElement).checked)} />
            </div>
            {armsEnabled && (
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Subjects</Label>
                <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                  <Input type="text" className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm" placeholder="Enter Subjects" />
                  <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-7! rounded-md">Add</Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {" "}
                  {["Mathematics", "English Language", "Basic Science"].map(subject => (
                    <Badge
                      key={subject}
                      className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                    >
                      <span className="text-text-subtle text-xs">{subject}</span>{" "}
                      <CloseFill fill="var(--color-icon-default-muted)" className="size-2 cursor-pointer" />
                    </Badge>
                  ))}
                  <div className="text-text-muted mt-1 text-xs">
                    You can add multiple departments at once by separating with a comma e.g English Language, Mathematics etc.
                  </div>
                </div>
              </div>
            )}
          </div>
          <SheetFooter className="border-border-default border-t">
            <div className="flex items-center justify-between">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                >
                  Close
                </Button>
              </SheetClose>
              <Button
                type="submit"
                className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
              >
                Save
              </Button>
            </div>
          </SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
