import { PERMISSION_NOTES } from "@/lib/content";

export default function PermissionsTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {PERMISSION_NOTES.map((item, i) => (
        <div
          key={item.permission}
          className={`flex flex-col gap-1 px-5 py-4 transition-colors duration-200 hover:bg-surface/60 sm:flex-row sm:gap-6 ${i !== 0 ? "border-t border-border" : ""}`}
        >
          <code className="shrink-0 rounded bg-surface px-2 py-1 text-xs font-semibold sm:w-56">{item.permission}</code>
          <p className="text-sm text-muted">{item.reason}</p>
        </div>
      ))}
    </div>
  );
}
