import { MenuItem } from "./MenuItem";
import { SectionHeader } from "./SectionHeader";

interface input {
  selected:string
  list:{
    [key:string]:boolean
  }
}

export function Sidebar({selected,list}:input) {
  return (
    <div className="flex flex-col w-[260px] h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)]">
      {/* Logo Area */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-[var(--border)]">
        <div className="w-7 h-7 rounded-[6px] bg-[var(--accent)]" />
        <span className="font-primary text-lg font-semibold text-[var(--foreground)]">
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 py-2 px-3 flex flex-col overflow-y-auto">
        <SectionHeader label="MAIN" />
        <MenuItem icon="list" label="List" active={selected === "list"} href="/" />
        <MenuItem icon="swap_horiz" label="Proxy Server" active={selected === "proxy"} href="/proxy" />

        <SectionHeader label="Servers" />
        {
          Object.keys(list).map((item)=>{
            return (
              <MenuItem icon="router" label={item} active={selected === "server"+item} href={`/servers/${item}`} key={item} />
            )
          })
        }

        <SectionHeader label="SETTINGS" />
      </div>
    </div>
  );
}
