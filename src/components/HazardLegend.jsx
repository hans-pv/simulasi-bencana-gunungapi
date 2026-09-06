import { Info } from "lucide-react";

export default function HazardLegend({ hazardRadii }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-lg text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <Info className="w-3.5 h-3.5 text-amber-400" /> Legenda Kode Warna Zona Bahaya
        </span>
        <span className="text-[10px] text-slate-400">Standar PVMBG & BMKG</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Pyroclastic */}
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300 shadow-sm shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-400 text-[11px]">Zona Piroklastik (KRB III)</div>
            <div className="text-[10px] text-slate-400">Radius ~{hazardRadii.pyroclasticRadiusKm} km • Suhu &gt;500°C</div>
          </div>
        </div>

        {/* Tsunami */}
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-cyan-200 shadow-sm shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-cyan-400 text-[11px]">Gelombang Tsunami</div>
            <div className="text-[10px] text-slate-400">Run-up 15–42m • Laju 120–250 km/j</div>
          </div>
        </div>

        {/* Ash Cloud */}
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border border-purple-300 shadow-sm shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-purple-400 text-[11px]">Payung Abu Vulkanik</div>
            <div className="text-[10px] text-slate-400">Plume hingga 80 km • Hujan abu silika</div>
          </div>
        </div>

        {/* Shockwave */}
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-sm shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-400 text-[11px]">Shockwave & Suara</div>
            <div className="text-[10px] text-slate-400">172 dB @ 160km • Terdengar 4.800km</div>
          </div>
        </div>
      </div>
    </div>
  );
}
