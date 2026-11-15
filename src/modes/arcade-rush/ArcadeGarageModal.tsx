import React, { useEffect } from 'react';
import { Lock, Palette, Sparkles, Star, X } from 'lucide-react';
import { type AstronautProfile } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import {
  COSMETIC_CATALOG,
  type CapiAccessoryId,
  type CosmeticCategory,
  type RoverSkinId,
  type SuitSkinId,
  equipCosmetic,
  isCosmeticUnlocked,
  markUnlocksSeen,
  useArcadeProgress,
} from './arcadeStore';
import { CapiBadgePortrait, RoverSprite } from './CosmeticSprites';

export interface ArcadeGarageModalProps {
  open: boolean;
  onClose: () => void;
  profile: AstronautProfile;
}

const CATEGORIES: CosmeticCategory[] = ['SUIT', 'ROVER', 'CAPI'];

export const ArcadeGarageModal: React.FC<ArcadeGarageModalProps> = ({
  open,
  onClose,
  profile,
}) => {
  const { dict } = useLanguage();
  const arcade = useArcadeProgress();

  useEffect(() => {
    if (open) {
      markUnlocksSeen();
    }
  }, [open]);

  if (!open) return null;

  const isEquipped = (id: string, category: CosmeticCategory): boolean => {
    if (category === 'SUIT') return arcade.equipped.suit === id;
    if (category === 'ROVER') return arcade.equipped.rover === id;
    return arcade.equipped.capi === id;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={dict.arcade.garage}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2.5 backdrop-blur-sm sm:p-4"
    >
      <div className="pixel-box relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden bg-slate-950 text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-2 border-b-4 border-cyan-500/40 bg-slate-900 px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-amber-300" />
            <h2 className="font-pixel text-[10px] text-amber-300 sm:text-xs">
              {dict.arcade.garage}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-sm border border-amber-400/70 bg-amber-950/70 px-2 py-1 font-pixel text-[8px] text-amber-200 sm:text-[9px]">
              <Sparkles className="h-3 w-3 text-amber-300" />
              {arcade.totalPoints}
            </span>
            <span className="inline-flex items-center gap-1 rounded-sm border border-yellow-400/70 bg-yellow-950/70 px-2 py-1 font-pixel text-[8px] text-yellow-200 sm:text-[9px]">
              <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
              {arcade.totalStars}
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              aria-label={dict.common.close}
              className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-sm border-2 border-slate-700 bg-slate-800 text-slate-200 hover:border-cyan-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Palco ao vivo com os 3 sprites equipados */}
        <div className="grid grid-cols-3 items-center gap-2 border-b-2 border-slate-800 bg-gradient-to-b from-slate-900 to-orange-950/40 px-3 py-3 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-1">
            <AstronautAvatar profile={profile} size="md" />
            <span className="font-pixel text-[7px] text-cyan-200 sm:text-[8px]">
              {dict.arcade.cosmetics[arcade.equipped.suit]}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <RoverSprite size="md" animated />
            <span className="font-pixel text-[7px] text-amber-200 sm:text-[8px]">
              {dict.arcade.cosmetics[arcade.equipped.rover]}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <CapiBadgePortrait size="sm" mood="COOL" />
            <span className="font-pixel text-[7px] text-emerald-200 sm:text-[8px]">
              {dict.arcade.cosmetics[arcade.equipped.capi]}
            </span>
          </div>
        </div>

        {/* Prateleiras visuais de cosméticos */}
        <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
          {CATEGORIES.map((category) => {
            const items = COSMETIC_CATALOG.filter((item) => item.category === category);
            return (
              <section key={category} className="space-y-2">
                <h3 className="font-pixel text-[9px] text-cyan-300 sm:text-[10px]">
                  {dict.arcade.categories[category]}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {items.map((item) => {
                    const unlocked = isCosmeticUnlocked(item.id, arcade.totalPoints);
                    const active = isEquipped(item.id, item.category);
                    const pct =
                      item.cost === 0
                        ? 100
                        : Math.min(100, Math.round((arcade.totalPoints / item.cost) * 100));

                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col items-center justify-between gap-2 rounded-sm border-2 p-2.5 text-center transition ${
                          active
                            ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_16px_rgba(52,211,153,0.28)]'
                            : unlocked
                            ? 'border-slate-700 bg-slate-900/90 hover:border-cyan-400'
                            : 'border-slate-800 bg-slate-950/90 opacity-80'
                        }`}
                      >
                        <div className="flex h-16 w-full items-center justify-center">
                          {item.category === 'SUIT' && (
                            <div className={unlocked ? '' : 'brightness-50 grayscale'}>
                              <AstronautAvatar
                                profile={profile}
                                size="sm"
                                suitSkinOverride={item.id as SuitSkinId}
                              />
                            </div>
                          )}
                          {item.category === 'ROVER' && (
                            <div className={unlocked ? '' : 'brightness-50 grayscale'}>
                              <RoverSprite
                                skinOverride={item.id as RoverSkinId}
                                size="sm"
                              />
                            </div>
                          )}
                          {item.category === 'CAPI' && (
                            <div className={unlocked ? '' : 'brightness-50 grayscale'}>
                              <CapiBadgePortrait
                                accessoryOverride={item.id as CapiAccessoryId}
                                size="sm"
                              />
                            </div>
                          )}
                        </div>

                        <span className="font-dialog text-xs font-bold text-slate-100">
                          {dict.arcade.cosmetics[item.id]}
                        </span>

                        {unlocked ? (
                          <button
                            type="button"
                            disabled={active}
                            onClick={() => {
                              soundEngine.playSuccess();
                              equipCosmetic(item.id);
                            }}
                            className={`pixel-btn min-h-[38px] w-full px-2 py-1.5 font-pixel text-[8px] ${
                              active
                                ? 'bg-emerald-400 text-slate-950'
                                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                            }`}
                          >
                            {active ? dict.arcade.equipped : dict.arcade.equip}
                          </button>
                        ) : (
                          <div className="w-full space-y-1">
                            <div className="flex items-center justify-center gap-1 font-pixel text-[8px] text-amber-300">
                              <Lock className="h-3 w-3" />
                              <span>{item.cost} PTS</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-sm bg-slate-800">
                              <div
                                style={{ width: `${pct}%` }}
                                className="h-full bg-amber-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
