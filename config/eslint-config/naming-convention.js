const namingConventionRules = {
  "@typescript-eslint/naming-convention": [
    "error",
    {
      selector: "variable",
      modifiers: ["destructured"],
      format: null,
    },
    {
      selector: "typeLike",
      format: ["PascalCase"],
    },
    {
      selector: "variable",
      format: ["camelCase", "PascalCase", "UPPER_CASE"],
    },
    {
      selector: "parameter",
      format: ["camelCase", "PascalCase"],
      leadingUnderscore: "allow",
    },
    {
      selector: "enumMember",
      format: ["UPPER_CASE"],
    },
  ],
};

module.exports = namingConventionRules;
