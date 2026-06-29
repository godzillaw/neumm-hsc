/**
 * lib/stage-content.ts
 *
 * Master lookup: stageId → ExplanationBlock[]
 * Merges all per-year content files. Used by PracticeSession to show rich
 * dual-coding explanations (text + formula + worked example + tip) for every stage.
 */
import type { ExplanationBlock } from './curriculum'
import { STAGE_CONTENT_Y9_Y10 } from './stage-content-y9-y10'
import { STAGE_CONTENT_Y11_STD_ADV } from './stage-content-y11-std-adv'
import { STAGE_CONTENT_Y11_EXT1_Y12_EXT2 } from './stage-content-y11-ext1-y12-ext2'
import { STAGE_CONTENT_Y12_ADV } from './stage-content-y12-adv'
import { STAGE_CONTENT_Y12_EXT1_STD } from './stage-content-y12-ext1-std'

export const STAGE_CONTENT: Record<string, ExplanationBlock[]> = {
  ...STAGE_CONTENT_Y9_Y10,
  ...STAGE_CONTENT_Y11_STD_ADV,
  ...STAGE_CONTENT_Y11_EXT1_Y12_EXT2,
  ...STAGE_CONTENT_Y12_ADV,
  ...STAGE_CONTENT_Y12_EXT1_STD,
}
