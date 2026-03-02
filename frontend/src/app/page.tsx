"use client";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";

const metrics = [
  {
    label: "Status",
    value: "12,543",
    change: "+12.5% from last month",
    positive: true,
  },
  {
    label: "Revenue",
    value: "$48,290",
    change: "+8.2% from last month",
    positive: true,
  },
  {
    label: "Orders",
    value: "1,234",
    change: "+3.1% from last month",
    positive: true,
  },
  {
    label: "Active Now",
    value: "573",
    change: "+18 since last hour",
    positive: false,
  },
];

interface List {
  [key: string]: boolean;
}

export default function AdminDashboard() {
  const [list,setList] = useState<List>({});
  useEffect(()=>{
    fetch("/api/list").then((res)=>res.json()).then((data)=>{
      setList(data as List)
    })
  },[])
  
  return (
    <div className="flex h-full bg-[var(--background)]">
      <Sidebar selected="list" list={list} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8 py-10 px-12 min-h-0 overflow-y-auto bg-[var(--background)]">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-[32px] font-medium tracking-[-1px] text-[var(--foreground)]">
              Server List
            </h1>
            <p className="font-secondary text-sm font-normal text-[var(--muted-foreground)]">
              Overview of your admin panel activity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-[14px] h-10 w-60 border border-[var(--border)] bg-[var(--background)]">
              <span className="icon text-[18px] text-[var(--text-muted)]">
                search
              </span>
              <span className="font-secondary text-sm font-normal text-[var(--text-muted)]">
                Search...
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="flex gap-6 w-full">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex-1 flex flex-col gap-2 p-6 border border-[var(--border)]"
            >
              <span className="font-secondary text-sm font-normal text-[var(--muted-foreground)]">
                {m.label}
              </span>
              <span className="font-primary text-[32px] font-semibold tracking-[-1px] text-[var(--foreground)]">
                {m.value}
              </span>
              <span
                className={`font-secondary text-xs font-normal ${
                  m.positive
                    ? "text-[var(--success)]"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                {m.change}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="flex-1 flex flex-col border border-[var(--border)] min-h-0">
          {/* Table Title */}
          <div className="flex items-center justify-between py-4 px-6">
            <span className="font-primary text-lg font-semibold text-[var(--foreground)]">
              Recent Activity
            </span>
            <span className="font-secondary text-[13px] font-medium text-[var(--accent)] cursor-pointer">
              View All
            </span>
          </div>

          {/* Column Headers */}
          <div className="flex py-3 px-6 bg-[var(--surface)]">
            <div className="flex-1">
              <span className="font-secondary text-xs font-medium text-[var(--muted-foreground)]">
                User
              </span>
            </div>
            <div className="flex-1">
              <span className="font-secondary text-xs font-medium text-[var(--muted-foreground)]">
                Action
              </span>
            </div>
            <div className="w-[140px]">
              <span className="font-secondary text-xs font-medium text-[var(--muted-foreground)]">
                Date
              </span>
            </div>
            <div className="w-[100px] flex justify-end">
              <span className="font-secondary text-xs font-medium text-[var(--muted-foreground)]">
                Status
              </span>
            </div>
          </div>

          {/* Rows */}
          {Object.keys(list).map((key)=>{
            return (
              <div
                key={key}
                className="flex items-center py-[14px] px-6"
              >
                <div className="flex-1">
                  <span className="font-secondary text-sm font-medium text-[var(--foreground)]">
                    {key}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="font-secondary text-sm font-normal text-[var(--foreground)]">
                    {list[key] ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
