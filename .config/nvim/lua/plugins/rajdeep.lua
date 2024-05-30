-- TODO: add more
return {
  { "neoclide/coc.nvim" },
  { "catppuccin/nvim", name = "catppuccin", lazy = false, opts = {
    flavour = "frappe"
  }, priority = 1000 },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "catppuccin",
    }
  }
}
