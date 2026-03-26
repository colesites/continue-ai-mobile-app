type BabelApi = {
  cache: (enabled: boolean) => void;
};

module.exports = function (api: BabelApi) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
