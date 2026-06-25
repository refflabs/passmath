/**
 * components/DecisionTree.tsx
 * Visualisasi pohon keputusan klasifikasi password.
 */

import type { SecurityStatus } from '../types/analysis';
import { getStatusColor } from '../utils/scoring';
import { toFixed } from '../utils/formatting';

interface DecisionTreeProps {
  finalScore: number;
  securityStatus: SecurityStatus;
}

export default function DecisionTree({ finalScore, securityStatus }: DecisionTreeProps) {
  const colors = getStatusColor(securityStatus);

  // Tentukan jalur yang diambil
  const path = {
    lt40: finalScore < 40,
    lt60: finalScore < 60,
    lt80: finalScore < 80,
  };

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-lime-500/15 text-lime-400">
          <span aria-hidden="true" className="text-sm">🌳</span>
        </div>
        <div>
          <h2 className="card-title">10. Pohon Keputusan</h2>
          <p className="text-xs text-gray-500 mt-0.5">Klasifikasi berdasarkan Final Score</p>
        </div>
      </div>

      {/* Final Score display */}
      <div className={`rounded-xl p-4 border mb-6 ${colors.bg} ${colors.border}`}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">Final Score yang dievaluasi:</p>
          <p className={`text-2xl font-bold font-mono ${colors.text}`}>{toFixed(finalScore)}</p>
        </div>
      </div>

      {/* Visual Decision Tree */}
      <div className="mb-6 space-y-1">
        {/* Node Start */}
        <TreeNode
          label="Mulai"
          type="start"
          active
          description="Final Score masuk ke evaluasi pohon keputusan"
        />

        <TreeConnector />

        {/* Node 1: score < 40? */}
        <TreeDecision
          question={`Apakah Final Score < 40?`}
          detail={`${toFixed(finalScore)} < 40?`}
          yesActive={path.lt40}
          noActive={!path.lt40}
          yesBranch={
            <TreeResult
              label="Tidak Aman"
              status="Tidak Aman"
              active={path.lt40}
              score={finalScore}
            />
          }
        />

        {!path.lt40 && (
          <>
            <TreeConnector label="TIDAK (lanjut)" />

            {/* Node 2: score < 60? */}
            <TreeDecision
              question="Apakah Final Score < 60?"
              detail={`${toFixed(finalScore)} < 60?`}
              yesActive={path.lt60 && !path.lt40}
              noActive={!path.lt60}
              yesBranch={
                <TreeResult
                  label="Kurang Aman"
                  status="Kurang Aman"
                  active={path.lt60 && !path.lt40}
                  score={finalScore}
                />
              }
            />

            {!path.lt60 && (
              <>
                <TreeConnector label="TIDAK (lanjut)" />

                {/* Node 3: score < 80? */}
                <TreeDecision
                  question="Apakah Final Score < 80?"
                  detail={`${toFixed(finalScore)} < 80?`}
                  yesActive={path.lt80 && !path.lt60}
                  noActive={!path.lt80}
                  yesBranch={
                    <TreeResult
                      label="Aman"
                      status="Aman"
                      active={path.lt80 && !path.lt60}
                      score={finalScore}
                    />
                  }
                />

                {!path.lt80 && (
                  <>
                    <TreeConnector label="TIDAK" />
                    <TreeResult
                      label="Sangat Aman"
                      status="Sangat Aman"
                      active
                      score={finalScore}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Penjelasan jalur */}
      <div className="formula-box text-sm space-y-1.5">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Jejak Keputusan</div>
        <p className="text-gray-400">
          Final Score = <span className="text-white">{toFixed(finalScore)}</span>
        </p>
        {!path.lt40 && (
          <p className="text-gray-500">
            {toFixed(finalScore)} tidak kurang dari 40 → lanjut evaluasi
          </p>
        )}
        {path.lt40 && (
          <p className="text-gray-400">
            {toFixed(finalScore)} &lt; 40 → <span className="text-red-400 font-semibold">Tidak Aman</span>
          </p>
        )}
        {!path.lt40 && !path.lt60 && (
          <p className="text-gray-500">
            {toFixed(finalScore)} tidak kurang dari 60 → lanjut evaluasi
          </p>
        )}
        {!path.lt40 && path.lt60 && (
          <p className="text-gray-400">
            {toFixed(finalScore)} &lt; 60 → <span className="text-orange-400 font-semibold">Kurang Aman</span>
          </p>
        )}
        {!path.lt40 && !path.lt60 && !path.lt80 && (
          <p className="text-gray-500">
            {toFixed(finalScore)} tidak kurang dari 80 → lanjut evaluasi
          </p>
        )}
        {!path.lt40 && !path.lt60 && path.lt80 && (
          <p className="text-gray-400">
            {toFixed(finalScore)} &lt; 80 → <span className="text-green-400 font-semibold">Aman</span>
          </p>
        )}
        {!path.lt40 && !path.lt60 && !path.lt80 && (
          <p className="text-gray-400">
            {toFixed(finalScore)} ≥ 80 → <span className="text-blue-400 font-semibold">Sangat Aman</span>
          </p>
        )}
        <p className={`text-base font-bold mt-2 ${colors.text}`}>
          Maka klasifikasi akhir = {securityStatus}
        </p>
      </div>
    </div>
  );
}

// ============ Sub-komponen pohon keputusan ============

function TreeNode({ label, type, active, description }: {
  label: string; type: 'start'; active: boolean; description: string;
}) {
  return (
    <div className={`flex flex-col items-center ${active ? '' : 'opacity-40'}`}>
      <div className={`rounded-xl px-6 py-3 border text-sm font-semibold text-center ${
        active
          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
          : 'bg-gray-800 border-gray-700 text-gray-500'
      }`}>
        {label}
      </div>
      {description && (
        <p className="text-xs text-gray-600 mt-1 text-center">{description}</p>
      )}
    </div>
  );
}

function TreeConnector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-0.5 h-4 bg-gray-700" />
      {label && (
        <span className="text-xs text-gray-600 bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
          {label}
        </span>
      )}
      <div className="w-0.5 h-2 bg-gray-700" />
    </div>
  );
}

function TreeDecision({
  question,
  detail,
  yesActive,
  noActive,
  yesBranch,
}: {
  question: string;
  detail: string;
  yesActive: boolean;
  noActive: boolean;
  yesBranch: React.ReactNode;
}) {
  return (
    <div>
      {/* Diamond node */}
      <div className="flex justify-center mb-2">
        <div className={`px-4 py-2 border-2 rounded-xl text-sm font-medium text-center max-w-xs ${
          yesActive || noActive
            ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300'
            : 'bg-gray-800 border-gray-700 text-gray-500'
        }`}>
          <span className="text-yellow-500/70 mr-1">◇</span>
          {question}
          <p className="text-xs text-gray-500 mt-0.5 font-mono">{detail}</p>
        </div>
      </div>

      {/* Branches */}
      <div className="flex gap-4 justify-center">
        {/* YA branch */}
        <div className={`flex flex-col items-center ${yesActive ? 'opacity-100' : 'opacity-30'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-500" />
            <span className="text-xs text-red-400 font-medium">YA</span>
          </div>
          <div className="w-0.5 h-3 bg-red-500/50 mx-auto" />
          {yesBranch}
        </div>
      </div>
    </div>
  );
}

function TreeResult({ label, status, active, score }: {
  label: string;
  status: SecurityStatus;
  active: boolean;
  score: number;
}) {
  const colors = getStatusColor(status);

  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${active ? 'scale-105' : 'opacity-30 scale-95'}`}>
      <div className={`rounded-xl px-5 py-3 border text-sm font-bold text-center ${
        active ? `${colors.bg} ${colors.border} ${colors.text}` : 'bg-gray-800 border-gray-700 text-gray-500'
      }`}>
        {active && <span className="text-lg mr-1">→</span>}
        {label}
        {active && (
          <p className="text-xs opacity-70 font-normal mt-0.5">{toFixed(score)} masuk di sini</p>
        )}
      </div>
    </div>
  );
}
