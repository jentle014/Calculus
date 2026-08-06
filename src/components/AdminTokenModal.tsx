import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Key, Plus, Copy, Check, UserCheck, RefreshCw } from 'lucide-react';
import { generateAdminTokens, fetchAllTokens, adminActivateUserByEmail } from '../services/userService';
import { ActivationToken } from '../types';
import { ModalWatermark } from './Watermark';

interface AdminTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTokenModal: React.FC<AdminTokenModalProps> = ({ isOpen, onClose }) => {
  const [tokens, setTokens] = useState<ActivationToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Direct activation state
  const [targetEmail, setTargetEmail] = useState('');
  const [directMsg, setDirectMsg] = useState<string | null>(null);
  const [isDirectLoading, setIsDirectLoading] = useState(false);

  const loadTokens = async () => {
    setIsLoading(true);
    try {
      const list = await fetchAllTokens();
      setTokens(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTokens();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (count: number) => {
    setIsGenerating(true);
    try {
      await generateAdminTokens(count);
      await loadTokens();
    } catch (e) {
      console.error('Failed to generate admin tokens:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDirectActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;
    setIsDirectLoading(true);
    setDirectMsg(null);
    try {
      const res = await adminActivateUserByEmail(targetEmail);
      setDirectMsg(res.message);
      if (res.success) {
        setTargetEmail('');
      }
    } catch (err: any) {
      setDirectMsg(err.message || 'Activation failed.');
    } finally {
      setIsDirectLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#151310] border border-[#2e271d] shadow-2xl p-6 space-y-5 text-[#f4ecd8] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2e271d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#282117] border border-[#483a26]">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-classical text-[#f8f2e4]">
                Admin Console (jentlecasper014@gmail.com)
              </h2>
              <p className="text-xs text-[#b8a78a] font-writeup">
                Generate Support Activation Tokens & Manage User Unlocks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#28221b] text-[#b8a78a] hover:text-[#f8f2e4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls: Generate Tokens & Direct User Email Unlock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Box 1: Generate Tokens */}
          <div className="p-4 rounded-xl bg-[#1d1914] border border-[#322a1f] space-y-3">
            <span className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
              1. Generate New Support Tokens
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerate(1)}
                disabled={isGenerating}
                className="flex-1 py-2 rounded-lg bg-[#282117] hover:bg-[#342a1d] border border-[#483a26] text-xs font-bold text-[#d4af37] font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Token</span>
              </button>
              <button
                onClick={() => handleGenerate(5)}
                disabled={isGenerating}
                className="flex-1 py-2 rounded-lg bg-[#282117] hover:bg-[#342a1d] border border-[#483a26] text-xs font-bold text-[#d4af37] font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+5 Tokens</span>
              </button>
            </div>
          </div>

          {/* Box 2: Direct Email Activation */}
          <form onSubmit={handleDirectActivate} className="p-4 rounded-xl bg-[#1d1914] border border-[#322a1f] space-y-2">
            <span className="text-xs font-mono uppercase text-[#d4af37] font-bold block">
              2. Direct User Email Unlock
            </span>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="student@school.edu"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#151310] border border-[#382f22] text-xs text-[#f4ecd8] focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={isDirectLoading || !targetEmail.trim()}
                className="px-3 py-1.5 rounded-lg bg-[#c9a24d] hover:bg-[#d8b45c] text-black font-bold text-xs font-mono transition-colors"
              >
                Unlock
              </button>
            </div>
            {directMsg && (
              <p className="text-[11px] font-mono text-emerald-400">{directMsg}</p>
            )}
          </form>
        </div>

        {/* Tokens List Table */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#b8a78a] pb-1 border-b border-[#2e271d]">
            <span>ACTIVATION TOKENS LOG ({tokens.length})</span>
            <button
              onClick={loadTokens}
              className="flex items-center gap-1 text-[#d4af37] hover:underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {tokens.length === 0 ? (
            <p className="text-xs text-[#8a7a60] font-mono text-center py-8">
              No activation tokens generated yet. Click "+1 Token" or "+5 Tokens" above to create!
            </p>
          ) : (
            <div className="space-y-2">
              {tokens.map((tok) => (
                <div
                  key={tok.id || tok.code}
                  className="p-3 rounded-xl bg-[#1d1914] border border-[#322a1f] flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#f4ecd8] tracking-widest text-sm">{tok.code}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tok.isUsed
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {tok.isUsed ? 'Used' : 'Available'}
                      </span>
                    </div>
                    {tok.isUsed && tok.usedByEmail && (
                      <p className="text-[11px] text-[#b8a78a]">
                        Redeemed by: <span className="text-[#d4af37]">{tok.usedByEmail}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopy(tok.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282117] hover:bg-[#342a1d] text-[#d4af37] border border-[#483a26] text-xs transition-colors"
                    title="Copy token to clipboard"
                  >
                    {copiedCode === tok.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <ModalWatermark />
      </div>
    </div>
  );
};
