import React from 'react';
import { X, Printer, CheckCircle, FileText, ExternalLink } from 'lucide-react';

interface DesignDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignDocModal: React.FC<DesignDocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D332B]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E0E7DE] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E0E7DE] flex items-center justify-between bg-[#F7F9F6] rounded-t-[32px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4A6741] text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#1D2B17]">
                Decarbonization Project Design Document (1–2 Pages)
              </h2>
              <p className="text-xs text-[#5C6658]">
                Carbon Footprint Reduction & Technical Architecture Specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-designdoc-btn"
              onClick={() => window.print()}
              title="Print Document"
              className="p-2.5 text-[#5C6658] hover:text-[#1D2B17] hover:bg-[#E8E4DF] rounded-full transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              id="close-designdoc-btn"
              onClick={onClose}
              title="Close Document"
              className="p-2.5 text-[#5C6658] hover:text-[#1D2B17] hover:bg-[#E8E4DF] rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Formatted Academic Document */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#2D332B] leading-relaxed font-serif print:text-black">
          {/* Document Title Header */}
          <div className="border-b border-[#E0E7DE] pb-5 text-center space-y-1.5 font-sans">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C7851]">
              Technical Solution Specification & Evaluation Brief
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D2B17]">
              Decarbonization Engine: Carbon Footprint Calculator & Reduction Planner
            </h1>
            <p className="text-xs text-[#737C70]">
              Energy & Atmosphere Decarbonization • Sustainable Systems & Climate Mitigations
            </p>
          </div>

          {/* Section 1: Problem Domain */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-[#1D2B17] font-serif border-b border-[#E0E7DE] pb-1.5 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D9E4D1] text-[#1D2B17] flex items-center justify-center text-xs font-bold font-sans">1</span>
              Assigned Problem Domain: Carbon Footprint Reduction
            </h2>
            <p className="text-[#2D332B]">
              Atmospheric carbon dioxide concentrations reached 424 ppm in 2024, driving unprecedented mean surface temperature
              increases (&gt;1.45°C above pre-industrial baselines). Anthropogenic climate change is predominantly driven by fossil fuel
              combustion across electricity generation (Scope 2), direct thermal heating and vehicular transit (Scope 1), and value chain
              consumption (Scope 3). Under the IPCC 1.5°C carbon budget, individual annual footprints must converge toward 2.0 tonnes CO₂e,
              whereas current developed-nation averages exceed 14.4 tonnes CO₂e. The central problem is the absence of accessible,
              quantifiable engineering tools that provide customized, actionable decarbonization roadmaps with clear cost-benefit metrics.
            </p>
          </section>

          {/* Section 2: Website Solution */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-[#1D2B17] font-serif border-b border-[#E0E7DE] pb-1.5 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D9E4D1] text-[#1D2B17] flex items-center justify-center text-xs font-bold font-sans">2</span>
              Proposed Engineering / IT Solution
            </h2>
            <p className="text-[#2D332B]">
              The <strong>CarbonZero Decarbonization Platform</strong> is a responsive, web-based decision support system composed of four
              interconnected functional tiers:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#2D332B]">
              <li>
                <strong>Granular GHG Calculation Engine:</strong> Evaluates Scope 1, 2, and 3 emissions using EPA eGRID factors,
                thermodynamic combustion calculations, and dietary trophic layer indices.
              </li>
              <li>
                <strong>Dynamic Reduction Planner:</strong> Simulates intervention roadmaps with interactive target goals (-25% to -80%),
                calculating abated tonnage, financial savings, and payback periods.
              </li>
              <li>
                <strong>Google Drive Research & Findings Integration:</strong> Cloud-connected workspace linking directly to
                <em> "CARBON FOOTPRINT REDUCTION.pptx"</em>, synthesizing key findings and comparing multi-dimensional pros.
              </li>
              <li>
                <strong>Knowledge Verification:</strong> Interactive quiz confirming engineering principles (heat pump COP, Scope accounting).
              </li>
            </ul>
          </section>

          {/* Section 3: Technologies Used */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-[#1D2B17] font-serif border-b border-[#E0E7DE] pb-1.5 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D9E4D1] text-[#1D2B17] flex items-center justify-center text-xs font-bold font-sans">3</span>
              Technologies & Standards Employed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-4 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl">
                <strong className="text-[#1D2B17]">Frontend Architecture:</strong> React 19, TypeScript, Tailwind CSS, Lucide icons, Motion layout animations.
              </div>
              <div className="p-4 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl">
                <strong className="text-[#1D2B17]">Cloud Integration:</strong> Google Drive REST API v3, Firebase Client SDK (OAuth 2.0 with drive.readonly scope).
              </div>
              <div className="p-4 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl">
                <strong className="text-[#1D2B17]">Emission Protocols:</strong> Greenhouse Gas Protocol (GHG Protocol Corporate Standard), US EPA GHG Hub.
              </div>
              <div className="p-4 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl">
                <strong className="text-[#1D2B17]">Hosting & Deployment:</strong> Cloud Run Container ingress on port 3000, Vite static asset optimization.
              </div>
            </div>
          </section>

          {/* Section 4: Expected Sustainability Impact */}
          <section className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-[#1D2B17] font-serif border-b border-[#E0E7DE] pb-1.5 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D9E4D1] text-[#1D2B17] flex items-center justify-center text-xs font-bold font-sans">4</span>
              Expected Sustainability Impact
            </h2>
            <p className="text-[#2D332B]">
              By translating complex climate science into personalized, financially viable actions, the platform drives measurable behavior
              change. Initial model simulations project an average household or campus dormitory reduction of <strong>4.5 to 7.8 tCO₂e/year</strong>
              per participating unit (a 35–55% abatement). Furthermore, the platform bridges the gap between individual actions and institutional
              ESG reporting, empowering students and facility directors to achieve measurable net-zero milestones.
            </p>
          </section>

          {/* Section 5: References */}
          <section className="space-y-1.5 pt-3 border-t border-[#E0E7DE] text-xs">
            <h3 className="font-bold text-[#1D2B17] font-sans">External References</h3>
            <ol className="list-decimal pl-5 space-y-1 text-[#5C6658]">
              <li>IPCC (2023). Climate Change 2023: Synthesis Report. Contribution of Working Groups I, II and III. Geneva, Switzerland.</li>
              <li>WRI & WBCSD (2015). The Greenhouse Gas Protocol: A Corporate Accounting and Reporting Standard.</li>
              <li>US Environmental Protection Agency (2024). Emissions & Generation Resource Integrated Database (eGRID).</li>
              <li>Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers. <em>Science</em>, 360(6392).</li>
              <li>International Energy Agency (2023). Net Zero Roadmap: A Global Pathway to Keep the 1.5 °C Goal in Reach. Paris.</li>
            </ol>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#E0E7DE] bg-[#F7F9F6] flex items-center justify-between rounded-b-[32px]">
          <span className="text-xs text-[#5C6658] font-sans">
            Technical Specification & Decarbonization Framework
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold transition-colors font-sans shadow-xs"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
