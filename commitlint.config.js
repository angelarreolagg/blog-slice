/**
 * Header shape: "{emoji} {type}(scope)?: {subject}".
 * The leading emoji is required; without it the header fails to parse and
 * `type-empty` reports the error.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(\p{Extended_Pictographic}(?:️)?(?:‍\p{Extended_Pictographic}(?:️)?)*)\s(\w+)(?:\(([^)]*)\))?!?:\s(.+)$/u,
      headerCorrespondence: ["emoji", "type", "scope", "subject"],
    },
  },
  rules: {
    "header-max-length": [2, "always", 72],
    "subject-full-stop": [2, "never", "."],
    "subject-case": [2, "always", "lower-case"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
  },
};
