import type { Root, Declaration, Rule as PostCSSRule, AtRule, Node } from 'postcss'
import type { RuleMeta, RuleMessages } from 'stylelint'

export interface CSSRequirements {
  normalizedCss?: boolean
}

/** Predicate receiving a PostCSS Root (the entire file AST). */
type CSSPredicate = (root: Root) => boolean

/** Predicate receiving a PostCSS Rule node. */
type RulePredicate = (rule: PostCSSRule) => boolean

/** Predicate receiving a PostCSS Declaration node. */
type DeclPredicate = (decl: Declaration) => boolean

/**
 * Predicate for at-rule allow/deny hooks.
 * Returns `true` to allow, `false` to deny, or a `string` custom message.
 */
type AtRuleVerdict = (rule: AtRule) => boolean | string

export interface RuleInteractionCallbacks {
  rootAllowCss?: CSSPredicate
  rootAllowRule?: RulePredicate
  rootAllowDecl?: DeclPredicate
  childAllowCss?: CSSPredicate
  childAllowRule?: RulePredicate
  childAllowDecl?: DeclPredicate
  tagSelectorsAllowCss?: CSSPredicate
  doubleSelectorsAllowCss?: CSSPredicate
  doubleSelectorsAllowRule?: RulePredicate
  nonDirectChildSelectorsAllowCss?: CSSPredicate
  allowSpecificImport?: AtRuleVerdict
  allowSpecificKaliberScoped?: AtRuleVerdict
}

/** Map from target rule name → interaction callbacks. */
export type RuleInteraction = Record<string, RuleInteractionCallbacks>

export interface PluginContext {
  originalRoot: Root
  modifiedRoot: Root
  report: (node: Node, message: string, index?: number) => void
  context: { fix?: boolean }
}

export interface KaliberRuleMeta extends RuleMeta {
  description: string
}

export interface RuleDefinition<
  M extends RuleMessages = RuleMessages,
  Config extends Record<string, unknown> = Record<string, unknown>,
> {
  ruleName: string
  meta: KaliberRuleMeta
  ruleInteraction?: RuleInteraction | null
  cssRequirements?: CSSRequirements | null
  messages: M
  create: (config: Config) => (ctx: PluginContext) => void
}

export default function defineRule<D extends RuleDefinition>(rule: D): D
