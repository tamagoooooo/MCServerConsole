"use client";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import Terminal from "@/components/Terminal";

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

export default function Inside({ name }: { name: string }) {
  const [list, setList] = useState<List>({});
  useEffect(() => {
    fetch("/api/list").then((res) => res.json()).then((data) => {
      setList(data as List)
    })
  }, [])

  return (
    <div className="flex h-full bg-[var(--background)]">
      <Sidebar selected={"server" + name} list={list} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8 py-10 px-12 min-h-0 overflow-y-auto bg-[var(--background)]">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-[32px] font-medium tracking-[-1px] text-[var(--foreground)]">
              {name}
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

        <div className="w-[260px] flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-6 border border-[var(--border)]">
            <span className="font-secondary text-sm font-normal text-[var(--muted-foreground)]">
              Status
            </span>
            <span className="font-primary text-[32px] font-semibold tracking-[-1px] text-[var(--foreground)]">
              {list[name] ? "Online" : "Offline"}
            </span>
          </div>
          <button className="flex items-center gap-2 px-[14px] h-10 w-60 border border-[var(--border)] bg-[var(--background)] cursor-pointer" onClick={() => {
            fetch("/api/servers/" + name + "/start").then((res) => res.text()).then((data) => {
              console.log(data)
            })
          }}>
            <span className="icon text-[18px] text-[var(--text-muted)]">
              start
            </span>
            <span className="font-secondary text-sm font-normal text-[var(--text-muted)]">
              Start Server
            </span>
          </button>
          <button className="flex items-center gap-2 px-[14px] h-10 w-60 border border-[var(--border)] bg-[var(--background)] cursor-pointer" onClick={() => {
            fetch("/api/servers/" + name + "/stop").then((res) => res.text()).then((data) => {
              console.log(data)
            })
          }}>
            <span className="icon text-[18px] text-[var(--text-muted)]">
              stop
            </span>
            <span className="font-secondary text-sm font-normal text-[var(--text-muted)]">
              Stop Server
            </span>
          </button>
        </div>

        <Terminal address={"ws://localhost:8080/api/servers/" + name} />


      </div>
    </div>
  );
}
