import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Check, Copy, Download, ExternalLink, X } from 'lucide-react';
import { FIREBASE_PROJECT_ID } from '../lib/firebase';

export type AuthProblem = { kind: 'popup' } | { kind: 'domain' } | { kind: 'other'; message: string };

/** Maps an auth error code (see lib/firebase.ts) to the problem the modal should explain, if any. */
export const authProblemFromError = (err: unknown): AuthProblem | null => {
  const message = (err as Error)?.message || '';
  if (message === 'AUTH_CANCELLED') return null;
  if (message === 'AUTH_POPUP_BLOCKED') return { kind: 'popup' };
  if (message === 'AUTH_UNAUTHORIZED_DOMAIN') return { kind: 'domain' };
  if (message === 'AUTH_NETWORK') return { kind: 'other', message: 'Could not reach Google. Check your connection and try again.' };
  return { kind: 'other', message: message || 'Google sign-in failed.' };
};

interface AuthProblemModalProps {
  problem: AuthProblem | null;
  onClose: () => void;
  onRetry: () => void;
  onDownloadInstead: () => void;
  /** Label for the download fallback ("Download plan instead" on the Save page, otherwise a link to it). */
  downloadLabel?: string;
}

const COPY = {
  popup: {
    title: 'Popup Blocked by Browser',
    subtitle: 'Google sign-in popups are often blocked inside preview frames',
  },
  domain: {
    title: 'Google sign-in isn’t enabled for this site yet',
    subtitle: 'Firebase only allows sign-in from domains on its authorized list',
  },
  other: {
    title: 'Google sign-in didn’t complete',
    subtitle: 'Nothing was saved to your Drive',
  },
} as const;

export const AuthProblemModal: React.FC<AuthProblemModalProps> = ({
  problem,
  onClose,
  onRetry,
  onDownloadInstead,
  downloadLabel = 'Download plan instead',
}) => {
  const [copied, setCopied] = useState(false);
  const host = window.location.hostname;

  const copyHost = async () => {
    try {
      await navigator.clipboard.writeText(host);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (insecure context, permissions); the host is shown on screen anyway
    }
  };

  return (
    <AnimatePresence>
      {problem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="auth-problem-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-[#152316] rounded-2xl p-6 border border-[#D5DDD2] dark:border-[#2C482A] shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="auth-problem-title" className="font-bold text-[#142314] dark:text-white text-base">
                    {COPY[problem.kind].title}
                  </h3>
                  <p className="text-xs text-[#5C6658] dark:text-[#9DB099]">{COPY[problem.kind].subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {problem.kind === 'popup' && (
              <>
                <p className="text-xs text-[#475544] dark:text-[#CBD8C9] leading-relaxed">
                  Your browser blocked the Google authorization window from opening. To connect your account or save to Drive:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#F4F7F2] dark:bg-[#1A2E1C] rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <strong className="block text-[#1D2B17] dark:text-white font-semibold">1. Open in Standalone Tab</strong>
                      <span className="text-[11px] text-[#5C6658] dark:text-[#9DB099]">
                        Popups work reliably without iframe security restrictions
                      </span>
                    </div>
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A6741] text-white font-semibold rounded-lg hover:bg-[#3B5334] transition-colors shrink-0 text-[11px]"
                    >
                      <span>Open Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="p-3 bg-[#F4F7F2] dark:bg-[#1A2E1C] rounded-xl">
                    <strong className="block text-[#1D2B17] dark:text-white font-semibold">2. Or Allow Popups in Address Bar</strong>
                    <span className="text-[11px] text-[#5C6658] dark:text-[#9DB099]">
                      Click the pop-up blocked icon in your browser URL bar and choose "Always allow pop-ups".
                    </span>
                  </div>
                </div>
              </>
            )}

            {problem.kind === 'domain' && (
              <>
                <p className="text-xs text-[#475544] dark:text-[#CBD8C9] leading-relaxed">
                  Firebase rejected Google sign-in from <strong className="font-mono">{host}</strong> because this domain
                  hasn’t been added to the project’s authorized domains. Your plan was not saved.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#F4F7F2] dark:bg-[#1A2E1C] rounded-xl space-y-2">
                    <strong className="block text-[#1D2B17] dark:text-white font-semibold">If you run this site</strong>
                    <span className="block text-[11px] text-[#5C6658] dark:text-[#9DB099]">
                      Firebase Console → Authentication → Settings → Authorized domains → Add domain, then paste:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="px-2 py-1 rounded-md bg-white dark:bg-[#0F1A10] border border-[#DFE6DC] dark:border-[#2C482A] font-mono text-[11px] text-[#1D2B17] dark:text-[#EEF5ED] break-all">
                        {host}
                      </code>
                      <button
                        type="button"
                        onClick={copyHost}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-[#4A6741] dark:text-[#88B080] hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <a
                        href={`https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/settings`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-[#4A6741] dark:text-[#88B080] hover:bg-white/60 dark:hover:bg-white/5"
                      >
                        <span>Open Firebase settings</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="p-3 bg-[#F4F7F2] dark:bg-[#1A2E1C] rounded-xl">
                    <strong className="block text-[#1D2B17] dark:text-white font-semibold">Meanwhile</strong>
                    <span className="text-[11px] text-[#5C6658] dark:text-[#9DB099]">
                      Download your plan as a file and upload it to Google Drive yourself.
                    </span>
                  </div>
                </div>
              </>
            )}

            {problem.kind === 'other' && (
              <p className="text-xs text-[#475544] dark:text-[#CBD8C9] leading-relaxed break-words">{problem.message}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#5C6658] dark:text-[#CBD8C9] hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl cursor-pointer"
              >
                Dismiss
              </button>
              {problem.kind === 'domain' ? (
                <button
                  type="button"
                  onClick={onDownloadInstead}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#1D2B17] dark:bg-[#4A6741] text-white rounded-xl hover:bg-[#2E4726] dark:hover:bg-[#3B5334] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadLabel}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 text-xs font-bold bg-[#1D2B17] dark:bg-[#4A6741] text-white rounded-xl hover:bg-[#2E4726] dark:hover:bg-[#3B5334] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
