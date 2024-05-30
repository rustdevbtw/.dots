-- bootstrap lazy.nvim, LazyVim and my plugins
require("config.lazy")

vim.keymap.set("i", "<C-z>", "<ESC>:undo<CR>i", { noremap = true, silent = true })
vim.keymap.set("n", "<C-z>", ":undo<CR>", { noremap = true, silent = true })
vim.keymap.set("v", "<C-z>", "<ESC>:undo<CR>V", { noremap = true, silent = true })

vim.keymap.set("i", "<C-y>", "<ESC>:redo<CR>i", { noremap = true, silent = true })
vim.keymap.set("n", "<C-y>", ":redo<CR>", { noremap = true, silent = true })
vim.keymap.set("v", "<C-y>", "<ESC>:redo<CR>V", { noremap = true, silent = true })

vim.keymap.set({"n","x"}, "p", "<Plug>(YankyPutAfter)")
vim.keymap.set({"n","x"}, "P", "<Plug>(YankyPutBefore)")
vim.keymap.set({"n","x"}, "gp", "<Plug>(YankyGPutAfter)")
vim.keymap.set({"n","x"}, "gP", "<Plug>(YankyGPutBefore)")

vim.keymap.set("n", "<c-p>", "<Plug>(YankyPreviousEntry)")
vim.keymap.set("n", "<c-n>", "<Plug>(YankyNextEntry)")
