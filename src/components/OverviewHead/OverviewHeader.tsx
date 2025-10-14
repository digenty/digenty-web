"use client";

import Image from "next/image";
import React from "react";

export default function OverviewHeader() {
  const [openFilterModal, setOpenFilterModal] = React.useState(false);

  const termsOptions = [
    { value: "Term 1", label: "24/25 Third Term", icon: "/icons/home-2.svg" },
    { value: "Term 2", label: "24/25  Second Term", icon: "/icons/home-2.svg" },
    { value: "Term 3", label: "24/25 First Term", icon: "/icons/home-2.svg" },
  ];
  const branches = [
    { value: "All Branches", label: "All Branches" },
    { value: "Lawanson", label: "Lawanson" },
    { value: "Ilasamaja", label: "Ilasamaja" },
  ];

  return (
    <div>
      <div className="flex justify-between p-4 align-middle text-zinc-950">
        <h2 className="text-2xl font-bold">Overview</h2>
        {/* big screen view */}

        <div className="hidden gap-2 align-middle md:flex">
          <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-2 py-2">
            <Image src={termsOptions[0].icon} width={20} height={20} alt="term icon" />
            <select
              name="terms"
              id="terms"
              className="border-none bg-transparent text-sm font-bold focus:ring-0 focus:outline-none"
              defaultValue={termsOptions[0].value}
            >
              {termsOptions.map(term => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-2 py-2">
            <Image src={termsOptions[0].icon} width={20} height={20} alt="term icon" />
            <select
              name="branches"
              id="branches"
              className="border-none bg-transparent text-sm font-bold focus:ring-0 focus:outline-none"
              defaultValue="All Branches"
            >
              {branches.map(branch => (
                <option key={branch.value} value={branch.value}>
                  {branch.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="block rounded-sm bg-gray-100 p-1 md:hidden">
          <Image src="/icons/menu-2.svg" alt="filter icon" width={20} height={20} onClick={() => setOpenFilterModal(true)} />
        </button>

        {/* Mobile Filter Modal */}
        {openFilterModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
            <div className="m-3 w-full max-w-md rounded-[10px] bg-white pb-2 shadow-lg">
              <div className="border-default-transparent/5 mb-4 flex items-center justify-between rounded-t-[10px] border-b-1 bg-zinc-100 px-2 py-4">
                <h4 className="text-lg font-semibold">Filter</h4>
                <button className="text-xl font-bold text-zinc-500" onClick={() => setOpenFilterModal(false)}>
                  ×
                </button>
              </div>
              <div className="mb-4 flex flex-col gap-4 p-2">
                <label className="mb-1 text-sm font-bold text-zinc-900">Period</label>
                <select name="terms" id="terms" className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-bold" defaultValue="Term 1">
                  {termsOptions.map(term => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
                <label className="mb-1 text-sm font-bold text-zinc-900">Branch</label>
                <select
                  name="branches"
                  id="branches"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-bold"
                  defaultValue="All Branches"
                >
                  {branches.map(branch => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between p-1">
                <button onClick={() => setOpenFilterModal(false)} className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-600">
                  Cancel
                </button>
                <button className="rounded-md bg-blue-500 px-4 py-2 text-sm tracking-[0.1rem] text-white">Apply Filter</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
