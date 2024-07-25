-- Pull in the wezterm API
local wezterm = require("wezterm")

-- This will hold the configuration.
local config = wezterm.config_builder()

-- For the Action API
local act = wezterm.action

config.color_scheme = "Catppuccin Frappe"
config.cursor_thickness = 0.5
config.font = wezterm.font("CaskaydiaCove Nerd Font", { weight = "Bold", italic = false })
config.enable_scroll_bar = true
config.enable_kitty_keyboard = true
config.detect_password_input = true
config.window_decorations = "NONE"
config.audible_bell = "SystemBeep"
config.keys = {
	{ key = "{", mods = "ALT", action = act.ActivateTabRelative(-1) },
	{ key = "}", mods = "ALT", action = act.ActivateTabRelative(1) },
	-- Create a new tab in the same domain as the current pane.
	-- This is usually what you want.
	{
		key = "t",
		mods = "SHIFT|ALT",
		action = act.SpawnTab("CurrentPaneDomain"),
	},
	-- Create a new tab in the default domain
	{ key = "t", mods = "SHIFT|ALT", action = act.SpawnTab("DefaultDomain") },
	-- Create a tab in a named domain
	{
		key = "t",
		mods = "SHIFT|ALT",
		action = act.SpawnTab({
			DomainName = "unix",
		}),
	},
}
config.front_end = "WebGpu"
config.enable_tab_bar = false
config.cursor_blink_ease_in = "Constant"
config.cursor_blink_ease_out = "Constant"
config.cursor_blink_rate = 0

return config
