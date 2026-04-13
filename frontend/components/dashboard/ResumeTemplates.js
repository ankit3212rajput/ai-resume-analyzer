export default function ResumeTemplates({ templates = [] }) {
  return (
    <div className="dashboard-card p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Templates</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">ATS-friendly resume templates</h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
          Downloadable
        </span>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {templates.map((template) => (
          <a
            key={template.id}
            href={template.downloadUrl}
            download
            className="rounded-[22px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
          >
            <p className="font-display text-xl font-semibold text-white">{template.name}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{template.description}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-tide">Download template</span>
          </a>
        ))}
      </div>
    </div>
  );
}
