import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function UploadPanel({ onAnalyze, loading }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  function handleFileSelection(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isAllowedType =
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isAllowedType) {
      toast.error("Only PDF and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be 5MB or smaller.");
      return;
    }

    setFileName(file.name);
    onAnalyze(file);
  }

  return (
    <div className="dashboard-card p-6 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Resume Upload</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">Analyze a new resume</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Upload a PDF or DOCX file up to 5MB. The backend extracts the text, sends it to OpenAI, and stores the
            analysis in your history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-panel hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Upload Resume"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileSelection}
        className="hidden"
      />

      <div className="mt-6 rounded-[24px] border border-dashed border-white/20 bg-white/5 p-6">
        <p className="text-sm text-slate-300">{fileName ? `Selected: ${fileName}` : "Drag-and-drop styling ready. Click upload to choose a file."}</p>
      </div>
    </div>
  );
}
