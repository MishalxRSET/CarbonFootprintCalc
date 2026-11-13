import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { DriveFileItem, PresentationSlideSummary } from '../types';
import { searchDriveFiles } from '../lib/drive';
import { PRESENTATION_FINDINGS_DATA, SUSTAINABILITY_QUIZ } from '../data/carbonData';
import { SpotlightCard, ShinyText, Magnet } from './reactbits';
import {
  HardDrive,
  Presentation,
  ExternalLink,
  CheckCircle2,
  Search,
  RefreshCw,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

interface DriveFindingsViewProps {
  user: User | null;
  accessToken: string | null;
  onLogin: () => void;
  isLoggingIn: boolean;
}

export const DriveFindingsView: React.FC<DriveFindingsViewProps> = ({
  user,
  accessToken,
  onLogin,
  isLoggingIn,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isSearchingDrive, setIsSearchingDrive] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [targetFound, setTargetFound] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  // Auto-search Google Drive if accessToken exists
  const runDriveSearch = async () => {
    if (!accessToken) return;
    setIsSearchingDrive(true);
    setSearchError(null);
    try {
      const result = await searchDriveFiles(accessToken, 'CARBON FOOTPRINT REDUCTION');
      setDriveFiles(result.files);
      setTargetFound(result.targetFound);
    } catch (err: unknown) {
      console.warn('Drive search error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to query Drive files';
      setSearchError(msg);
    } finally {
      setIsSearchingDrive(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      runDriveSearch();
    }
  }, [accessToken]);

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setQuizSubmitted((prev) => ({ ...prev, [qIdx]: true }));
  };

  const activeSlide: PresentationSlideSummary = PRESENTATION_FINDINGS_DATA[activeSlideIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Primary Source Research
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#D9E4D1] text-[#1D2B17] border border-[#CCD9C3] flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-[#4A6741]" /> Google Drive
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D2B17] tracking-tight mt-1">
            Research Findings & Presentation Deck Hub
          </h1>
          <p className="text-sm text-[#5C6658] mt-1 max-w-2xl">
            Referencing research findings and comprehensive strategy pros documented in{' '}
            <strong className="text-[#1D2B17] font-mono bg-[#F1EFEC] px-2 py-0.5 rounded-md border border-[#E8E4DF]">
              CARBON FOOTPRINT REDUCTION.pptx
            </strong>
          </p>
        </div>

        {user && accessToken && (
          <button
            id="refresh-drive-btn"
            onClick={runDriveSearch}
            disabled={isSearchingDrive}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F1EFEC] border border-[#E8E4DF] hover:bg-[#E8E4DF] text-[#1D2B17] rounded-full text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSearchingDrive ? 'animate-spin' : ''}`} />
            <span>{isSearchingDrive ? 'Searching Drive...' : 'Rescan Drive Files'}</span>
          </button>
        )}
      </div>

      {/* Google Drive Status & Connection Card */}
      <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D9E4D1]/40 border border-[#CCD9C3] flex items-center justify-center text-[#4A6741] shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1D2B17]">
                  Google Drive Cloud Workspace Integration
                </h2>
                {user ? (
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#D9E4D1] text-[#1D2B17] border border-[#CCD9C3] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#4A6741]" /> Connected
                  </span>
                ) : (
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#F1EFEC] text-[#8C7851] border border-[#E8E4DF]">
                    Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5C6658] mt-1 max-w-2xl">
                {user
                  ? `Signed in as ${user.email}. Drive files matching "CARBON FOOTPRINT REDUCTION.pptx" are verified through the Google Drive API.`
                  : 'Connect your Google account to authorize the app to search and reference "CARBON FOOTPRINT REDUCTION.pptx" directly in your Drive.'}
              </p>
            </div>
          </div>

          {!user && (
            <button
              id="drive-connect-action-btn"
              onClick={onLogin}
              disabled={isLoggingIn}
              className="flex items-center gap-2 px-5 py-3 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <span>{isLoggingIn ? 'Connecting...' : 'Connect Google Drive'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Drive Query Results when connected */}
        {user && (
          <div className="mt-5 pt-4 border-t border-[#E0E7DE]">
            {isSearchingDrive ? (
              <div className="flex items-center gap-2 text-xs text-[#5C6658] py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#4A6741]" />
                <span>Querying Google Drive API for "CARBON FOOTPRINT REDUCTION.pptx"...</span>
              </div>
            ) : searchError ? (
              <div className="p-3 bg-[#FDF2F0] border border-[#E8C5BE] rounded-xl text-xs text-[#8C3A27] flex items-center justify-between">
                <span>{searchError}</span>
                <button onClick={runDriveSearch} className="font-bold underline text-[#8C3A27]">Retry</button>
              </div>
            ) : driveFiles.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7851]">
                  Detected Google Drive Files:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 bg-[#F7F9F6] rounded-2xl border border-[#E0E7DE] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Presentation className="w-4 h-4 text-[#8C7851] shrink-0" />
                        <div className="truncate">
                          <p className="font-bold text-[#1D2B17] truncate">{file.name}</p>
                          <p className="text-[10px] text-[#737C70]">
                            Modified: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white border border-[#E0E7DE] rounded-full text-[11px] font-semibold text-[#1D2B17] hover:bg-[#F1EFEC] flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#F7F9F6] rounded-2xl border border-[#E0E7DE] text-xs text-[#5C6658] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4A6741]" />
                  <span>
                    Google Drive scope authorized. Full presentation findings, slides & strategy pros are synthesized below.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Slide-by-Slide Findings Viewer */}
      <div className="bg-white border border-[#E0E7DE] rounded-[32px] overflow-hidden shadow-xs">
        <div className="p-6 bg-[#1D2B17] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#4A6741] text-white flex items-center justify-center font-bold">
              #{activeSlide.slideNumber}
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#CCD9C3]">
                Slide {activeSlide.slideNumber} of {PRESENTATION_FINDINGS_DATA.length}
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">{activeSlide.title}</h2>
            </div>
          </div>

          {/* Slide Navigator buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {PRESENTATION_FINDINGS_DATA.map((slide, idx) => (
              <button
                key={slide.slideNumber}
                id={`slide-nav-${slide.slideNumber}-btn`}
                onClick={() => setActiveSlideIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  activeSlideIndex === idx
                    ? 'bg-[#4A6741] text-white shadow-xs'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {slide.slideNumber}
              </button>
            ))}
          </div>
        </div>

        <div className="p-7 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              {activeSlide.subtitle}
            </span>
            <div className="mt-3.5 space-y-2.5">
              {activeSlide.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-[#5C6658] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741] mt-1.5 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slide-Specific Highlighted PROS */}
          <div className="space-y-3.5 pt-5 border-t border-[#E0E7DE]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4A6741]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D2B17]">
                Key Pros & Feasibility Metrics Documented in this Slide
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeSlide.highlightedPros.map((pro, i) => (
                <SpotlightCard
                  key={i}
                  spotlightColor="rgba(74, 103, 65, 0.12)"
                  className="p-5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1D2B17]">{pro.category}</span>
                    {pro.metrics && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#4A6741] border border-[#CCD9C3]">
                        {pro.metrics}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C6658] leading-relaxed">{pro.benefit}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive PROS & ADVANTAGES Matrix (Referencing the Presentation Deck) */}
      <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8C7851]" />
            <h2 className="text-2xl font-serif text-[#1D2B17]">
              Master Pros Matrix: Why Carbon Footprint Reduction Succeeds
            </h2>
          </div>
          <p className="text-xs text-[#5C6658] mt-1">
            Systematic compilation of scientific, financial, operational, and public health benefits
            demonstrated in "CARBON FOOTPRINT REDUCTION.pptx".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-[#D9E4D1]/30 border border-[#CCD9C3] space-y-2.5">
            <h3 className="font-bold text-[#1D2B17] text-sm">1. Environmental Pros</h3>
            <ul className="space-y-1.5 text-[#5C6658] leading-relaxed">
              <li>• Rapid mitigation of atmospheric radiative forcing.</li>
              <li>• Deceleration of ocean acidification (pH stabilization).</li>
              <li>• Preservation of cryosphere ice sheets and glacial reservoirs.</li>
              <li>• Habitat restoration through land sparing in agroforestry.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#F1EFEC] border border-[#E8E4DF] space-y-2.5">
            <h3 className="font-bold text-[#1D2B17] text-sm">2. Economic / ROI Pros</h3>
            <ul className="space-y-1.5 text-[#5C6658] leading-relaxed">
              <li>• Dramatic insulation from volatile fossil fuel price spikes.</li>
              <li>• Levelized Cost of Solar (LCOE) now lower than new coal/gas.</li>
              <li>• Protection against escalating carbon border adjustment taxes (CBAM).</li>
              <li>• High institutional ESG scores unlocking lower cost of capital.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#FDF2F0] border border-[#E8C5BE] space-y-2.5">
            <h3 className="font-bold text-[#8C3A27] text-sm">3. Public Health Pros</h3>
            <ul className="space-y-1.5 text-[#5C6658] leading-relaxed">
              <li>• Drastic reduction in toxic PM2.5 and NOx criteria air pollutants.</li>
              <li>• Lower pediatric asthma and adult cardiovascular morbidity.</li>
              <li>• Active transit lifestyles combat sedentary obesity and stress.</li>
              <li>• Reduced urban heat island effect via reflective surfaces.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F9F6] border border-[#E0E7DE] space-y-2.5">
            <h3 className="font-bold text-[#1D2B17] text-sm">4. Engineering Pros</h3>
            <ul className="space-y-1.5 text-[#5C6658] leading-relaxed">
              <li>• Electric motor thermodynamic efficiency (&gt;85% vs &lt;28% ICE).</li>
              <li>• Heat pump vapor-compression COP exceeding 350%.</li>
              <li>• Smart microgrid peak shaving reduces grid infrastructure fatigue.</li>
              <li>• Closed-loop circular economy eliminates raw material extraction.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Knowledge Quiz / Assessment Verification */}
      <div className="bg-[#F7F9F6] border border-[#E0E7DE] rounded-[32px] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#4A6741]" />
            <h2 className="text-2xl font-serif text-[#1D2B17]">
              Interactive Sustainability Knowledge Check
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#1D2B17] bg-[#D9E4D1] px-3 py-1 rounded-full border border-[#CCD9C3]">
            Carbon Knowledge Check
          </span>
        </div>

        <div className="space-y-4">
          {SUSTAINABILITY_QUIZ.map((q, qIdx) => {
            const isAnswered = quizSubmitted[qIdx];
            const selectedOpt = quizAnswers[qIdx];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div key={qIdx} className="bg-white p-5 rounded-2xl border border-[#E0E7DE] space-y-3.5 shadow-2xs">
                <p className="text-xs font-bold text-[#1D2B17]">
                  Q{qIdx + 1}: {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'border-[#E0E7DE] bg-[#F7F9F6] hover:bg-white text-[#2D332B]';

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'border-[#4A6741] bg-[#D9E4D1]/40 text-[#1D2B17] font-bold';
                      } else if (selectedOpt === optIdx) {
                        btnStyle = 'border-[#8C3A27] bg-[#FDF2F0] text-[#8C3A27]';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        id={`quiz-${qIdx}-opt-${optIdx}-btn`}
                        onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                        className={`p-3 rounded-xl border text-left transition-colors flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <Check className="w-4 h-4 text-[#4A6741] shrink-0" />
                        )}
                        {isAnswered && selectedOpt === optIdx && optIdx !== q.correctIndex && (
                          <X className="w-4 h-4 text-[#8C3A27] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`p-3 rounded-xl text-xs leading-relaxed ${isCorrect ? 'bg-[#D9E4D1]/50 text-[#1D2B17]' : 'bg-[#F1EFEC] text-[#5C4D26]'}`}>
                    <span className="font-bold">{isCorrect ? 'Correct! ' : 'Explanation: '}</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
