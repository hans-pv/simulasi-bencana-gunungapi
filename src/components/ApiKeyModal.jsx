import React, { useState, useEffect } from "react";
import { X, Key, CheckCircle, Info } from "lucide-react";

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey }) {
  const [inputKey, setInputKey] = useState(currentKey || "");

  useEffect(() => {
    setInputKey(currentKey || "");
  }, [currentKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey("");
    onSaveKey("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Konfigurasi Google Maps API</h3>
              <p className="text-xs text-slate-400">Hubungkan peta satelit resmi Google Maps JavaScript API</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Dual-Engine Siap Pakai:</strong> Jika Anda tidak memiliki Google Maps API Key, aplikasi ini secara otomatis menggunakan <em>CartoDB Dark Tile Engine</em> dengan fungsionalitas visualisasi bahaya 100% lengkap tanpa error.
          </span>
        </div>

        {/* Input Form */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Google Maps JavaScript API Key:
          </label>
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
          />
          <p className="text-[11px] text-slate-400">
            API key disimpan di local storage browser Anda secara privat dan aman.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {currentKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              Hapus Key (Kembali ke Default)
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
