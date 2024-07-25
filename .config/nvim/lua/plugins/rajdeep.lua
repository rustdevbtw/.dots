-- TODO: add more
return {
  { "vim-crystal/vim-crystal" },
  { "neoclide/coc.nvim" },
  { "catppuccin/nvim", name = "catppuccin", lazy = false, opts = {
    flavour = "frappe",
  }, priority = 1000 },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "catppuccin",
    },
  },
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function(_, opts)
      require("nvim-treesitter.configs").setup(opts)
      vim.treesitter.language.register("markdown", "mdx")
      local configs = require("nvim-treesitter.configs")

      configs.setup({
        highlight = { enable = true },
        indent = { enable = true },
      })
    end,
  },
}
