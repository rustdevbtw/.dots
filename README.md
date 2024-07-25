# Dots

This is my repo, containing all my dotfiles. Some files might be missing for now, which I will add soon.

## Configs

### 1. Hyprland

**Location**: `.config/hypr/hyprland.conf`

#### Usage

First, install Hyprland with your preferred package manager.  

On Arch (btw):

```sh
sudo pacman -S hyprland
```

I use `paru` and install the `hyprland-git` (might take *a lot* of time to build):

```sh
paru -S hyprland-git
```

Hyprland requires no other change to work with the config, except the required packages (install them):

1. `wezterm`/`kitty`
2. `rofi` (for app launcher and stuff, I use the wayland fork: [`rofi-wayland`](https://archlinux.org/packages/extra/x86_64/rofi-wayland))
3. `qt{5,6}ct` - recommended, for Qt stuff
4. `ags`/`waybar` (more on that later)

> [!NOTE]
> I no longer use Waybar, and the Waybar config will no longer be maintained. It is recommended to use AGS instead.

5. `wl-clipboard` (for copy-pasta)
6. `hyprpaper` (for wallpaper, more on that later)
7. `hyprlock` (for lock, more on that later)
8. `cliphist` (for clipboard management)
9. `swaync` (for notifications)
10. `polkit-kde-agent` (for authentication)
11. `aylurs-gtk-shell` (The best way to make *beautiful* **and** *functional* wayland widgets)

Additionally, for the menu to work, adjust the path (change from `/home/rajdeep` to *your* `$HOME`).

### 2. Waybar

First, install Waybar with your preferred package manager. Often, the package is `waybar` and using the git variant isn't necessary.  

The Waybar config is expected to work out-of-box without problems.  

As for the weather, you can change the `.config/waybar/config.jsonc` file to change the city name. It uses `wttr.in` for Weather, and that works pretty well.

### 3. Hyprpaper

First, install that with your package manager.

I recommend installing the `-git` version from AUR (for Arch):

```sh
paru -S hyprpaper-git
```

It should *almost* work out-of-box with just one change: file path.  
Edit the `.config/hypr/hyprpaper.config` file's path to change `/home/rajdeep` to your `$HOME` and you're done.

### 3. Hyprlock

First, install `hyprlock` (or, the git variant: `hyprlock-git`) and it should work out-of-box.

### 4. XDG-Desktop-Portal

For various stuff, I recommend having XDPH (`xdg-desktop-portal-hyprland`), XDPG (`xdg-desktop-portal-gtk`) and XDPK (`xdg-desktop-portal-kde`). Just install them, and it should work.

### 5. Starship

Just install it, and add `eval $(starship init $SHELL)` to your RC and it should work.

### 6. ZSH

Now, I use ZSH with OMZ (Oh-My-ZSH), Antidote (package manager), and Powerlevel10K (prompt framework). Install Antidote to `~/.antidote` (and don't forget to add to PATH) and it all should just work.

### 7. NeoVIM

Should work out-of-box with zero issues. Just install it.

### 8. WezTerm 

Just install, and it'll work.

### 9. Kitty

Just install, and it'll work.

> [!NOTE]
> I no longer actively use Kitty. Instead, check out **WezTerm**!

### 10. AGS

The AGS Config is created to be as independent as possible. To match the theme, you'd need to install the Catppuccin GTK Theme (I can't tell you how, it's so damn complicated) and the Breeze Cursor Icon Theme. You may need to make a few changes in the `.config/ags/config.js` file.
