import { z } from 'zod'
import { parseColor } from '/@/lib/basic/color'

/**
 * https://developer.mozilla.org/ja/docs/Web/CSS/color_value
 *
 * keyword(transparent,currentcolor,システム色含む)は使えない
 * 透明度指定もできない
 */
export type CSSColorTypeSimple = string
const CSSColorTypeSimpleSchema = z
  .string()
  .refine(value => parseColor(value) !== null, {
    message: 'Invalid CSSColorTypeSimple'
  })
/**
 * https://developer.mozilla.org/ja/docs/Web/CSS/color_value
 *
 * こっちは透明度指定やkeywordの利用ができる
 */
export type CSSColorType = string
const CSSColorTypeSchema = z.string()
/**
 * https://developer.mozilla.org/ja/docs/Web/CSS/image
 *
 * CSSColorTypeでは使えなかったkeywordも使える
 */
export type CSSImageType = string
const CSSImageTypeSchema = z.string()

const maybeCSSColorTypeSimple = <T extends z.ZodTypeAny>(t: T) =>
  z.union([CSSColorTypeSimpleSchema, t])

export type BasicTheme = z.infer<typeof basicThemeSchema>
const basicThemeSchema = z.object({
  accent: z.object({
    primary: maybeCSSColorTypeSimple(
      z.object({
        default: CSSColorTypeSchema,
        background: CSSImageTypeSchema,
        fallback: CSSColorTypeSimpleSchema
      })
    ),
    notification: maybeCSSColorTypeSimple(
      z.object({
        default: CSSColorTypeSchema,
        background: CSSImageTypeSchema
      })
    ),
    online: CSSColorTypeSimpleSchema,
    error: CSSColorTypeSimpleSchema,
    focus: CSSColorTypeSimpleSchema
  }),
  background: z.object({
    primary: maybeCSSColorTypeSimple(
      z.object({
        default: CSSImageTypeSchema,
        border: CSSColorTypeSchema,
        fallback: CSSColorTypeSimpleSchema
      })
    ),
    secondary: maybeCSSColorTypeSimple(
      z.object({
        default: CSSImageTypeSchema,
        border: CSSColorTypeSchema,
        fallback: CSSColorTypeSimpleSchema
      })
    ),
    tertiary: maybeCSSColorTypeSimple(
      z.object({
        default: CSSImageTypeSchema,
        border: CSSColorTypeSchema
      })
    )
  }),
  ui: z.object({
    primary: maybeCSSColorTypeSimple(
      z.object({
        default: CSSColorTypeSchema,
        background: CSSImageTypeSchema,
        fallback: CSSColorTypeSimpleSchema
      })
    ),
    secondary: maybeCSSColorTypeSimple(
      z.object({
        default: CSSColorTypeSchema,
        background: CSSImageTypeSchema,
        fallback: CSSColorTypeSimpleSchema
      })
    ),
    tertiary: CSSColorTypeSimpleSchema
  }),
  text: z.object({
    primary: CSSColorTypeSimpleSchema,
    secondary: CSSColorTypeSimpleSchema
  })
})

export type SpecificTheme = z.infer<typeof specificThemeSchema>
const specificThemeSchema = z.object({
  /** 波形表示の色 */
  waveformColor: CSSColorTypeSchema,
  /** 波形表示のグラデーション */
  waveformGradation: CSSImageTypeSchema,

  /** ナビゲーションバー(左の部分)のデスクトップでの背景色 */
  navigationBarDesktopBackground: CSSImageTypeSchema,
  /** ナビゲーションバー(左の部分)のモバイルでの背景色 */
  navigationBarMobileBackground: CSSImageTypeSchema,
  /** メインビュー(真ん中の部分)の背景色 */
  mainViewBackground: CSSImageTypeSchema,
  /** サイドバー(右の部分)の背景色 */
  sideBarBackground: CSSImageTypeSchema
})

export type BrowserTheme = z.infer<typeof browserThemeSchema>
const browserThemeSchema = z.object({
  /**
   * @default accent.primary
   * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/meta/name/theme-color
   */
  themeColor: CSSColorTypeSchema,
  /**
   * @default undefined background.primaryの色の明るさで自動で`'light dark'`か`'dark light'`になる
   * @see https://developer.mozilla.org/ja/docs/Web/CSS/color-scheme
   */
  colorScheme: z.string(),

  /** 選択状態になっている部分の文字色 */
  selectionText: CSSColorTypeSimpleSchema,
  /** 選択状態になっている部分の背景色 */
  selectionBackground: CSSColorTypeSchema,
  /** キャレットの色 */
  caret: CSSColorTypeSchema.optional(),

  /** スクロールバーのサムの色 */
  scrollbarThumb: CSSColorTypeSchema,
  /** スクロールバーのサムのホバー状態の色 */
  scrollbarThumbHover: CSSColorTypeSchema,
  /** スクロールバーのトラックの色 */
  scrollbarTrack: CSSColorTypeSchema
})

/**
 * @default 'auto' background.primaryの色の明るさで自動で`'light'`か`'dark'`になる
 */
export type MarkdownDefaultTheme = z.infer<typeof markdownDefaultThemeSchema>
const markdownDefaultThemeSchema = z.enum(['auto', 'light', 'dark'])

export type MarkdownTheme = z.infer<typeof markdownTheme>
const markdownTheme = z.object({
  codeHighlight: markdownDefaultThemeSchema,
  linkText: CSSColorTypeSchema,
  hrText: CSSColorTypeSchema,
  h6Text: CSSColorTypeSchema,
  quoteText: CSSColorTypeSchema,
  quoteBar: CSSColorTypeSchema,
  codeBackground: CSSColorTypeSchema,
  codeFileNameBackground: CSSColorTypeSchema,
  tableTdBorder: CSSColorTypeSchema,
  tableTrBorder: CSSColorTypeSchema,
  tableTrBackground: CSSColorTypeSchema,
  tableTrBackground2: CSSColorTypeSchema,
  imgBackground: CSSColorTypeSchema,
  markText: CSSColorTypeSchema,
  markBackground: CSSColorTypeSchema,
  spoilerBackground: CSSColorTypeSchema,
  spoilerShownBackground: CSSColorTypeSchema,
  /** メンションやチャンネルリンク */
  embedLinkText: CSSColorTypeSchema,
  embedLinkBackground: CSSColorTypeSchema,
  /** 自分へのメンションや自分の所属しているグループへのメンション */
  embedLinkHighlightText: CSSColorTypeSchema,
  embedLinkHighlightBackground: CSSColorTypeSchema
})

export type ExtendedOptionalMarkdownTheme = z.infer<
  typeof extendedOptionalMarkdownThemeSchema
>
const extendedOptionalMarkdownThemeSchema = z
  .object({
    /**
     * 元にするテーマ
     *
     * 省略した場合にこのテーマの色が利用される
     **/
    extends: markdownDefaultThemeSchema
  })
  .merge(markdownTheme.partial())

/** traQ固有のテーマ定義 */
export type Theme = z.infer<typeof themeSchema>
export const themeSchema = z.object({
  version: z.literal(2),
  basic: basicThemeSchema,
  specific: specificThemeSchema.partial().optional(),
  browser: browserThemeSchema.partial().optional(),
  markdown: z
    .union([markdownDefaultThemeSchema, extendedOptionalMarkdownThemeSchema])
    .optional()
})
