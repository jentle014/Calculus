import React from 'react';
import { X, BookOpen, Search } from 'lucide-react';
import { ModalWatermark } from './Watermark';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormulaGroup {
  category: string;
  formulas: { title: string; expression: string; note?: string }[];
}

const CHEAT_SHEET_DATA: FormulaGroup[] = [
  {
    category: 'Derivatives & Differentiation',
    formulas: [
      { title: 'Power Rule', expression: 'd/dx [ xⁿ ] = n xⁿ⁻¹' },
      { title: 'Product Rule', expression: 'd/dx [ u · v ] = u\' v + u v\'' },
      { title: 'Quotient Rule', expression: 'd/dx [ u / v ] = (u\' v - u v\') / v²' },
      { title: 'Chain Rule', expression: 'd/dx [ f(g(x)) ] = f\'(g(x)) · g\'(x)' },
      { title: 'Exponential', expression: 'd/dx [ e^(kx) ] = k e^(kx)' },
      { title: 'Natural Log', expression: 'd/dx [ ln(x) ] = 1 / x,  d/dx [ ln(u) ] = u\' / u' },
      { title: 'Sine & Cosine', expression: 'd/dx [ sin x ] = cos x,  d/dx [ cos x ] = -sin x' },
      { title: 'Tangent & Secant', expression: 'd/dx [ tan x ] = sec² x,  d/dx [ sec x ] = sec x tan x' },
      { title: 'Arctan', expression: 'd/dx [ arctan(x) ] = 1 / (1 + x²)' },
      { title: 'Arcsin', expression: 'd/dx [ arcsin(x) ] = 1 / √(1 - x²)' }
    ]
  },
  {
    category: 'Integrals & Anti-derivatives',
    formulas: [
      { title: 'Power Rule for Integrals', expression: '∫ xⁿ dx = (xⁿ⁺¹ / (n + 1)) + C  (n ≠ -1)' },
      { title: 'Logarithmic Integral', expression: '∫ (1/x) dx = ln|x| + C' },
      { title: 'Exponential Integral', expression: '∫ e^(kx) dx = (1/k) e^(kx) + C' },
      { title: 'Integration by Parts', expression: '∫ u dv = u v - ∫ v du' },
      { title: 'Trig Integrals', expression: '∫ sin x dx = -cos x + C,  ∫ cos x dx = sin x + C' },
      { title: 'Secant Squared Integral', expression: '∫ sec² x dx = tan x + C' },
      { title: 'Arctan Integral Form', expression: '∫ dx / (x² + a²) = (1/a) arctan(x/a) + C' },
      { title: 'Arcsin Integral Form', expression: '∫ dx / √(a² - x²) = arcsin(x/a) + C' },
      { title: 'Average Value Formula', expression: 'f_avg = [ 1 / (b - a) ] ∫_a^b f(x) dx' },
      { title: 'Area Between Curves', expression: 'A = ∫_a^b [ f_upper(x) - g_lower(x) ] dx' }
    ]
  },
  {
    category: 'Limits & Asymptotes',
    formulas: [
      { title: 'Fundamental Trig Limit', expression: 'lim (x➔0) [ sin(x) / x ] = 1' },
      { title: 'Cosine Limit', expression: 'lim (x➔0) [ (1 - cos x) / x ] = 0' },
      { title: 'Definition of e', expression: 'lim (x➔∞) (1 + k/x)ˣ = eᵏ' },
      { title: 'L’Hôpital’s Rule', expression: 'If lim f/g = 0/0 or ∞/∞, then lim f/g = lim (f\' / g\')' },
      { title: 'Squeeze Theorem', expression: 'If g(x) ≤ f(x) ≤ h(x) and lim g = lim h = L, then lim f = L' }
    ]
  },
  {
    category: 'Series & Sequences',
    formulas: [
      { title: 'Infinite Geometric Series', expression: 'S = a / (1 - r)  for |r| < 1' },
      { title: 'Ratio Test', expression: 'L = lim (n➔∞) |a_n+1 / a_n|; converges if L < 1' },
      { title: 'Taylor Series', expression: 'f(x) = ∑ [ fⁿ(a) / n! ] (x - a)ⁿ' },
      { title: 'Maclaurin e^x', expression: 'e^x = 1 + x + (x²/2!) + (x³/3!) + ...' },
      { title: 'Maclaurin sin x', expression: 'sin x = x - (x³/3!) + (x⁵/5!) - ...' }
    ]
  }
];

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  if (!isOpen) return null;

  const filteredGroups = CHEAT_SHEET_DATA.map((group) => ({
    ...group,
    formulas: group.formulas.filter(
      (f) =>
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.expression.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((group) => group.formulas.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-[#151310] border border-[#2e271d] shadow-2xl p-6 space-y-4 text-[#f4ecd8] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2e271d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#231e17] border border-[#3e3223]">
              <BookOpen className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-classical text-[#f8f2e4]">Calculus Formula Reference Sheet</h2>
              <p className="text-xs text-[#b8a78a] font-writeup">High-yield identities & derivative/integral rules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#28221b] text-[#b8a78a] hover:text-[#f8f2e4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#98886e] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search formulas e.g. power rule, arctan, e^x..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1d1914] border border-[#382f22] text-xs text-[#f4ecd8] placeholder-[#8a7a60] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Formula Groups List */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {filteredGroups.length === 0 ? (
            <p className="text-xs text-[#98886e] font-mono text-center py-8">No formulas matching "{searchTerm}"</p>
          ) : (
            filteredGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <h3 className="text-xs font-mono uppercase font-bold text-[#d4af37] tracking-wider">
                  {group.category}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.formulas.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-3.5 rounded-xl bg-[#1e1a14] border border-[#322a1f] space-y-1.5 hover:border-[#483a28] transition-colors"
                    >
                      <span className="text-xs font-bold text-[#f4ecd8] font-classical block">{item.title}</span>
                      <code className="text-xs font-mono text-[#d4af37] block bg-[#100f0d] p-2 rounded border border-[#2a2319] overflow-x-auto">
                        {item.expression}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <ModalWatermark />
      </div>
    </div>
  );
};
