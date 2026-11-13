import React, { useState, useEffect, useMemo } from 'react';
import { CalculationResult, PageTab, ReductionStrategy, DriveFileItem } from '../types';
import { REDUCTION_STRATEGIES } from '../data/carbonData';
import { formatINR } from '../utils/currency';
import {
  savePlanToGoogleDrive,
  listSavedPlansFromDrive,
  downloadPlanLocally,
  DrivePlanFormat,
  PlanExportPayload,
} from '../lib/drive';
import { fireCelebrationConfetti } from '../utils/confetti';
import {
  Cloud,
  FileText,
  CheckCircle2,
  ExternalLink,
  FolderUp,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  FileCode,
  Check,
  Layers,
  Calendar,
  Sliders,
  TrendingDown,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { SpotlightCard, ShinyText, Magnet } from './reactbits';

interface SavePlanToDriveViewProps {
  currentCalculation: CalculationResult;
  accessToken: string | null;
  onLogin: () => void;
  onRequestDriveAccess: () => Promise<string>;
  onLogout: () => void;
  isLoggingIn: boolean;
  onNavigate: (tab: PageTab) => void;
}

export const SavePlanToDriveView: React.FC<SavePlanToDriveViewProps> = ({
  currentCalculation,
  accessToken,
  onLogin,
  onRequestDriveAccess,
  onLogout,
  isLoggingIn,
  onNavigate,
}) => {
  // Plan customization state
  const [planTitle, setPlanTitle] = useState<string>('Personal Climate Action Plan 2026');
  const [format, setFormat] = useState<DrivePlanFormat>('gdoc');
  const [targetPercent, setTargetPercent] = useState<number>(40);
  const [horizonYears, setHorizonYears] = useState<number>(5);

  // Selected mitigation strategies for the export
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>([
    'solar_pv_rooftop',
    'plant_rich_dietary_shift',
    'multimodal_transit_carpool',
    'food_waste_diversion_compost',
    'heat_pump_electrification',
  ]);

  // Saving state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessFile, setSaveSuccessFile] = useState<DriveFileItem | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Saved files in Drive state
  const [existingPlans, setExistingPlans] = useState<DriveFileItem[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState<boolean>(false);
  const [existingError, setExistingError] = useState<string | null>(null);

  const baselineKg = currentCalculation.totalAnnualKgCO2e;
  const baselineTonnes = currentCalculation.totalAnnualTonnesCO2e;

  const selectedStrategies = useMemo(() => {
    return REDUCTION_STRATEGIES.filter((s) => selectedStrategyIds.includes(s.id));
  }, [selectedStrategyIds]);

  const { totalAbatedKg, totalAbatedTonnes, netRemainingTonnes, annualSavingsINR } = useMemo(() => {
    const abatedKg = selectedStrategies.reduce((sum, s) => sum + s.potentialReductionKgCO2e, 0);
    const abatedTonnes = Number((abatedKg / 1000).toFixed(2));
    const remainingKg = Math.max(0, baselineKg - abatedKg);
    const remainingTonnes = Number((remainingKg / 1000).toFixed(2));
    // Estimated financial savings in India (~₹18.5 / kg CO2e avoided)
    const savings = Math.round(abatedKg * 18.5);

    return {
      totalAbatedKg: abatedKg,
      totalAbatedTonnes: abatedTonnes,
      netRemainingTonnes: remainingTonnes,
      annualSavingsINR: savings,
    };
  }, [selectedStrategies, baselineKg]);

  const toggleStrategy = (id: string) => {
    setSelectedStrategyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [hasDriveAccess, setHasDriveAccess] = useState<boolean>(false);
  const [isRequestingDrive, setIsRequestingDrive] = useState<boolean>(false);

  // Load existing plans from Drive if connected
  const fetchExistingPlans = async () => {
    if (!accessToken) return;
    setIsLoadingExisting(true);
    setExistingError(null);
    try {
      const files = await listSavedPlansFromDrive(accessToken);
      setExistingPlans(files);
      setHasDriveAccess(true);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      const errMsg = err.message || '';
      if (errMsg.includes('403') || errMsg.includes('insufficient permissions')) {
        setHasDriveAccess(false);
      } else {
        setExistingError(err.message || 'Could not load existing plans');
      }
    } finally {
      setIsLoadingExisting(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchExistingPlans();
    }
  }, [accessToken]);

  // Handle local download of the plan
  const handleDownloadLocally = () => {
    const payload: PlanExportPayload = {
      planTitle: planTitle.trim() || 'Personal Climate Action Plan 2026',
      baselineTonnes,
      targetPercent,
      abatedTonnes: totalAbatedTonnes,
      netRemainingTonnes,
      annualSavingsINR,
      horizonYears,
      selectedStrategies,
    };
    downloadPlanLocally(payload, format);
  };

  // Handle saving the plan to Google Drive
  const handleSaveToDrive = async () => {
    let token = accessToken;

    // If not connected yet, initiate Google authentication with Drive scope
    if (!token) {
      setIsRequestingDrive(true);
      setSaveError(null);
      try {
        token = await onRequestDriveAccess();
        setHasDriveAccess(true);
      } catch (err: any) {
        setSaveError(err.message || 'Google Drive authorization was not granted.');
        setIsRequestingDrive(false);
        return;
      }
      setIsRequestingDrive(false);
    }

    if (!token) {
      setSaveError('Google Drive authorization token is required to save to Drive.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccessFile(null);

    const payload: PlanExportPayload = {
      planTitle: planTitle.trim() || 'Personal Climate Action Plan 2026',
      baselineTonnes,
      targetPercent,
      abatedTonnes: totalAbatedTonnes,
      netRemainingTonnes,
      annualSavingsINR,
      horizonYears,
      selectedStrategies,
    };

    try {
      const savedFile = await savePlanToGoogleDrive(token, payload, format);
      setSaveSuccessFile(savedFile);
      fireCelebrationConfetti();
      // Refresh list of plans
      fetchExistingPlans();
    } catch (err: any) {
      console.error('Error saving plan to Google Drive:', err);
      if (err.message === 'UNAUTHORIZED_EXPIRED_TOKEN') {
        try {
          const freshToken = await onRequestDriveAccess();
          const savedFile = await savePlanToGoogleDrive(freshToken, payload, format);
          setSaveSuccessFile(savedFile);
          fireCelebrationConfetti();
          fetchExistingPlans();
          return;
        } catch (retryErr: any) {
          setSaveError('Session expired. Please reconnect your Google Drive account.');
        }
      } else {
        setSaveError(err.message || 'Failed to save file to Google Drive');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-3xl shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A6741]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8EFE5] dark:bg-[#1F2E1D] text-[#2E4726] dark:text-[#A8C7A0] text-xs font-bold rounded-full border border-[#D0DFCB] dark:border-[#2F442C]">
              <Cloud className="w-3.5 h-3.5" />
              <span>Google Drive Cloud Integration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] tracking-tight">
              Save Your Climate Action Plan to Google Drive
            </h1>
            <p className="text-sm text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Export your decarbonization roadmap, adopted mitigation interventions, and financial ROI directly into your Google Drive. Save as an editable native Google Doc, Markdown report, or JSON schema.
            </p>
          </div>

          {/* Google Auth Status Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {accessToken ? (
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#D0DFCB] dark:border-[#2E442B] rounded-2xl text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-[#1D2B17] dark:text-[#EEF5ED]">Google Drive Connected</span>
                <button
                  id="drive-disconnect-btn"
                  onClick={onLogout}
                  className="ml-2 text-[11px] text-[#8C7851] hover:text-[#5C4D26] underline font-medium"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                id="drive-connect-btn"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A6741] hover:bg-[#3B5334] text-white text-xs font-bold rounded-full transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>{isLoggingIn ? 'Connecting...' : 'Connect Google Drive'}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F1EFEC] dark:bg-[#1F2E1D] hover:bg-[#E8E4DF] dark:hover:bg-[#263824] text-[#1D2B17] dark:text-[#EEF5ED] text-xs font-semibold rounded-full transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Back to Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Plan Configurator & Save Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plan Customization & Format Options (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Document Metadata & Format */}
          <div className="p-6 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-3xl shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4A6741]" />
              <span>Plan Document Settings</span>
            </h2>

            {/* Title Input */}
            <div>
              <label htmlFor="plan-title-input" className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE] mb-2">
                Document Title
              </label>
              <input
                id="plan-title-input"
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                placeholder="e.g. My Personal Decarbonization Roadmap"
                className="w-full px-4 py-3 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] rounded-2xl text-sm font-medium text-[#1D2B17] dark:text-[#EEF5ED] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] outline-none transition-all"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {['Personal Climate Action Plan 2026', 'Household Decarbonization Plan', 'Green Lifestyle Transition 2030'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setPlanTitle(suggestion)}
                      className="text-[11px] px-2.5 py-1 bg-[#F1EFEC] dark:bg-[#1F2E1D] hover:bg-[#E0E7DE] dark:hover:bg-[#2A3F27] text-[#5C6658] dark:text-[#9DB099] rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Target Reduction & Horizon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E0E7DE] dark:border-[#263824]">
              <div>
                <label className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE] mb-1.5">
                  Target Reduction Goal
                </label>
                <div className="flex items-center gap-2">
                  {[30, 40, 50, 75].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTargetPercent(pct)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        targetPercent === pct
                          ? 'bg-[#1D2B17] dark:bg-[#EEF5ED] text-white dark:text-[#141E13] border-transparent'
                          : 'bg-[#F7F9F6] dark:bg-[#1A2619] text-[#5C6658] dark:text-[#9DB099] border-[#E0E7DE] dark:border-[#2E442B]'
                      }`}
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE] mb-1.5">
                  Timeline Horizon
                </label>
                <div className="flex items-center gap-2">
                  {[3, 5, 10].map((yrs) => (
                    <button
                      key={yrs}
                      type="button"
                      onClick={() => setHorizonYears(yrs)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        horizonYears === yrs
                          ? 'bg-[#1D2B17] dark:bg-[#EEF5ED] text-white dark:text-[#141E13] border-transparent'
                          : 'bg-[#F7F9F6] dark:bg-[#1A2619] text-[#5C6658] dark:text-[#9DB099] border-[#E0E7DE] dark:border-[#2E442B]'
                      }`}
                    >
                      {yrs} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-3 pt-2 border-t border-[#E0E7DE] dark:border-[#263824]">
              <label className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                Select Drive Document Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Google Doc Format */}
                <button
                  id="format-gdoc-btn"
                  type="button"
                  onClick={() => setFormat('gdoc')}
                  className={`p-3.5 text-left rounded-2xl border transition-all relative ${
                    format === 'gdoc'
                      ? 'border-[#4A6741] bg-[#F7F9F6] dark:bg-[#1A2619] shadow-xs'
                      : 'border-[#E0E7DE] dark:border-[#263824] bg-white dark:bg-[#141E13] hover:border-[#CCD9C3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {format === 'gdoc' && (
                      <span className="w-4 h-4 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-[#1D2B17] dark:text-[#EEF5ED]">Google Doc</div>
                  <div className="text-[10px] text-[#5C6658] dark:text-[#9DB099] mt-0.5">
                    Native editable Docs format with executive tables & formatting
                  </div>
                </button>

                {/* Markdown Format */}
                <button
                  id="format-markdown-btn"
                  type="button"
                  onClick={() => setFormat('markdown')}
                  className={`p-3.5 text-left rounded-2xl border transition-all relative ${
                    format === 'markdown'
                      ? 'border-[#4A6741] bg-[#F7F9F6] dark:bg-[#1A2619] shadow-xs'
                      : 'border-[#E0E7DE] dark:border-[#263824] bg-white dark:bg-[#141E13] hover:border-[#CCD9C3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileCode className="w-5 h-5 text-[#8C7851]" />
                    {format === 'markdown' && (
                      <span className="w-4 h-4 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-[#1D2B17] dark:text-[#EEF5ED]">Markdown (.md)</div>
                  <div className="text-[10px] text-[#5C6658] dark:text-[#9DB099] mt-0.5">
                    Clean technical documentation for notes, reports, and versioning
                  </div>
                </button>

                {/* JSON Format */}
                <button
                  id="format-json-btn"
                  type="button"
                  onClick={() => setFormat('json')}
                  className={`p-3.5 text-left rounded-2xl border transition-all relative ${
                    format === 'json'
                      ? 'border-[#4A6741] bg-[#F7F9F6] dark:bg-[#1A2619] shadow-xs'
                      : 'border-[#E0E7DE] dark:border-[#263824] bg-white dark:bg-[#141E13] hover:border-[#CCD9C3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    {format === 'json' && (
                      <span className="w-4 h-4 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-[#1D2B17] dark:text-[#EEF5ED]">JSON Schema</div>
                  <div className="text-[10px] text-[#5C6658] dark:text-[#9DB099] mt-0.5">
                    Raw structured metrics & strategy objects for ESG pipelines
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Strategies Included in this Plan */}
          <div className="p-6 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
                  Interventions Included in Drive Export ({selectedStrategies.length})
                </h3>
                <p className="text-[11px] text-[#5C6658] dark:text-[#9DB099]">
                  Toggle the specific decarbonization actions you wish to embed into the generated document.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSelectedStrategyIds(
                    selectedStrategyIds.length === REDUCTION_STRATEGIES.length
                      ? []
                      : REDUCTION_STRATEGIES.map((s) => s.id)
                  )
                }
                className="text-xs text-[#4A6741] dark:text-[#88B080] font-semibold hover:underline"
              >
                {selectedStrategyIds.length === REDUCTION_STRATEGIES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {REDUCTION_STRATEGIES.map((strategy) => {
                const isChecked = selectedStrategyIds.includes(strategy.id);
                return (
                  <div
                    key={strategy.id}
                    onClick={() => toggleStrategy(strategy.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-[#F7F9F6] dark:bg-[#1A2619] border-[#D0DFCB] dark:border-[#2E442B]'
                        : 'bg-white dark:bg-[#141E13] border-[#E0E7DE] dark:border-[#263824] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[#4A6741] border-[#4A6741] text-white'
                            : 'border-[#CCD9C3] dark:border-[#384E34]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED]">{strategy.title}</p>
                        <p className="text-[10px] text-[#737C70] dark:text-[#839580]">
                          {strategy.category} • {strategy.implementationEase} Effort • {strategy.costEstimate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#4A6741] dark:text-[#88B080]">
                        -{(strategy.potentialReductionKgCO2e / 1000).toFixed(2)} t
                      </span>
                      <p className="text-[10px] text-[#737C70] dark:text-[#839580]">/ yr</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Plan Summary & Save Button & Existing Plans (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Executive Metrics Overview */}
          <div className="p-6 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-3xl shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4A6741]" />
              <span>Plan Impact Summary</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] rounded-2xl">
                <span className="text-[11px] font-semibold text-[#5C6658] dark:text-[#9DB099]">Baseline Emissions</span>
                <p className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
                  {baselineTonnes} <span className="text-xs font-sans font-normal text-[#737C70]">tCO₂e/yr</span>
                </p>
              </div>

              <div className="p-4 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] rounded-2xl">
                <span className="text-[11px] font-semibold text-[#5C6658] dark:text-[#9DB099]">Annual Abatement</span>
                <p className="text-xl font-serif font-bold text-[#4A6741] dark:text-[#88B080] mt-1">
                  -{totalAbatedTonnes} <span className="text-xs font-sans font-normal text-[#737C70]">tCO₂e/yr</span>
                </p>
              </div>

              <div className="p-4 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] rounded-2xl">
                <span className="text-[11px] font-semibold text-[#5C6658] dark:text-[#9DB099]">Net Post-Plan Footprint</span>
                <p className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
                  {netRemainingTonnes} <span className="text-xs font-sans font-normal text-[#737C70]">tCO₂e/yr</span>
                </p>
              </div>

              <div className="p-4 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] rounded-2xl">
                <span className="text-[11px] font-semibold text-[#5C6658] dark:text-[#9DB099]">Est. Annual Savings</span>
                <p className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
                  ₹{annualSavingsINR.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#5C6658] dark:text-[#9DB099]">Target Goal Progress</span>
                <span className="text-[#4A6741] dark:text-[#88B080]">
                  {Math.min(100, Math.round((totalAbatedTonnes / (baselineTonnes * (targetPercent / 100))) * 100))}% of -{targetPercent}% target
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#E0E7DE] dark:bg-[#263824] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4A6741] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((totalAbatedTonnes / (baselineTonnes * (targetPercent / 100))) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons: Google Drive & Local Download */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="save-plan-to-drive-btn"
                onClick={handleSaveToDrive}
                disabled={isSaving || isRequestingDrive || selectedStrategies.length === 0}
                className="py-3.5 px-5 bg-[#1D2B17] dark:bg-[#4A6741] hover:bg-[#2E4726] dark:hover:bg-[#3B5334] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving || isRequestingDrive ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isRequestingDrive ? 'Connecting Drive...' : 'Saving to Drive...'}</span>
                  </>
                ) : (
                  <>
                    <FolderUp className="w-4 h-4" />
                    <span>Save to Google Drive</span>
                  </>
                )}
              </button>

              <button
                id="download-plan-locally-btn"
                type="button"
                onClick={handleDownloadLocally}
                disabled={selectedStrategies.length === 0}
                className="py-3.5 px-5 bg-[#F1EFEC] dark:bg-[#1F2E1D] hover:bg-[#E2DFD8] dark:hover:bg-[#2B3F27] text-[#1D2B17] dark:text-[#EEF5ED] font-bold text-xs sm:text-sm rounded-2xl border border-[#D5DDD2] dark:border-[#2F442C] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#4A6741] dark:text-[#88B080]" />
                <span>Download {format === 'gdoc' ? 'DOC' : format.toUpperCase()} Locally</span>
              </button>
            </div>

            {/* Save Success Alert */}
            {saveSuccessFile && (
              <div className="p-4 bg-[#E8EFE5] dark:bg-[#1A2B19] border border-[#B8D1B4] dark:border-[#2C482A] rounded-2xl space-y-3 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#2E4726] dark:text-[#88B080] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
                      Plan Successfully Saved to Google Drive!
                    </p>
                    <p className="text-[11px] text-[#4A6741] dark:text-[#A8C7A0] mt-0.5 font-medium">
                      "{saveSuccessFile.name}" has been created in your Drive.
                    </p>
                  </div>
                </div>

                {saveSuccessFile.webViewLink && (
                  <a
                    id="open-saved-drive-file-btn"
                    href={saveSuccessFile.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 bg-white dark:bg-[#141E13] border border-[#B8D1B4] dark:border-[#2C482A] hover:bg-[#F7F9F6] text-[#1D2B17] dark:text-[#EEF5ED] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Open in Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Error Notice */}
            {saveError && (
              <div className="p-4 bg-[#FDF2F0] dark:bg-[#2B1714] border border-[#E8C5BE] dark:border-[#4D2620] rounded-2xl text-xs text-[#8C3A27] dark:text-[#E8998D] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Unable to Save Plan</p>
                  <p className="text-[11px] mt-0.5">{saveError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Existing Saved Plans in Drive */}
          <div className="p-6 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1D2B17] dark:text-[#EEF5ED] flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#4A6741]" />
                <span>Your Saved Drive Plans</span>
              </h3>
              {accessToken && (
                <button
                  type="button"
                  onClick={fetchExistingPlans}
                  disabled={isLoadingExisting}
                  className="text-xs text-[#5C6658] dark:text-[#9DB099] hover:text-[#1D2B17] flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingExisting ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              )}
            </div>

            {!accessToken ? (
              <div className="p-4 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl text-center space-y-2">
                <Cloud className="w-6 h-6 text-[#737C70] mx-auto opacity-50" />
                <p className="text-xs text-[#5C6658] dark:text-[#9DB099]">
                  Log in to your Google account to create and manage Climate Action Plans.
                </p>
                <button
                  onClick={onLogin}
                  disabled={isLoggingIn}
                  className="px-4 py-1.5 bg-[#4A6741] text-white text-xs font-bold rounded-full hover:bg-[#3B5334] transition-colors"
                >
                  Log In
                </button>
              </div>
            ) : !hasDriveAccess && !isLoadingExisting ? (
              <div className="p-4 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl text-center space-y-2">
                <Cloud className="w-6 h-6 text-[#737C70] mx-auto opacity-50" />
                <p className="text-xs text-[#5C6658] dark:text-[#9DB099]">
                  Grant Google Drive access to view and manage previously saved Climate Action Plans.
                </p>
                <button
                  onClick={async () => {
                    try {
                      await onRequestDriveAccess();
                      fetchExistingPlans();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="px-4 py-1.5 bg-[#4A6741] text-white text-xs font-bold rounded-full hover:bg-[#3B5334] transition-colors"
                >
                  Grant Drive Access
                </button>
              </div>
            ) : isLoadingExisting ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-[#737C70]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#4A6741]" />
                <span>Loading your Drive documents...</span>
              </div>
            ) : existingPlans.length > 0 ? (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {existingPlans.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl flex items-center justify-between hover:border-[#CCD9C3] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[#1D2B17] dark:text-[#EEF5ED] truncate">{file.name}</p>
                        <p className="text-[10px] text-[#737C70] dark:text-[#839580]">
                          {file.createdTime ? new Date(file.createdTime).toLocaleDateString('en-IN') : 'Saved in Drive'}
                        </p>
                      </div>
                    </div>
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] hover:bg-[#E8EFE5] text-[#2E4726] dark:text-[#A8C7A0] text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 ml-2"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#737C70] dark:text-[#839580] text-center py-4 bg-[#F7F9F6] dark:bg-[#1A2619] rounded-2xl border border-dashed border-[#E0E7DE] dark:border-[#263824]">
                No previous climate plans found in your Google Drive. Click "Save Plan to Google Drive" above to create your first one!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
