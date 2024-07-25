export TERM_PROGRAM_VERSION="[master]"
export PF_INFO="ascii title os host kernel shell uptime memory"
pfetch

# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Set Antidote ZSH Plugins DIR
zsh_plugins=$HOME/.zsh_plugins

# Check if the file exists. If not, create it.
[[ -f ${zsh_plugins}.txt ]] || touch ${zsh_plugins}.txt

# Set the fpath, for loading the functions
fpath=($HOME/.antidote/functions $fpath)

# autoload, ofc
autoload -Uz antidote
autoload -Uz promptinit && promptinit

# install the plugins
if [[ ! ${zsh_plugins}.zsh -nt ${zsh_plugins}.txt ]]; then
  antidote bundle <${zsh_plugins}.txt >|${zsh_plugins}.zsh
fi

# OMZ Plugins
plugins=(git)

# zsh-autosuggestions
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=#808080'
ZSH_AUTOSUGGEST_STRATEGY=(completion history)

# source the plugin files
source ${zsh_plugins}.zsh

# Set alises, and other stuff
alias cat="bat"
alias ls="exa"

function grubdate {
  run0 grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
  run0 grub-mkconfig -o /boot/grub/grub.conf
}

function kg {
  pgrep $1 | xargs -r kill
}

function agrep {
  find . -type f -print0 | xargs -0 -P "$(nproc)" -n 1 grep --color=always -H -n -E "(^|[^[:alnum:]_])$1([^[:alnum:]_]|$)"
}

function install_icons {
  pwd=`pwd`
  dir="$1"
  name="$2"
  cd $dir
  for icon in `ls .`; do
    size=`echo "$icon" | sed "s/$name-icon_//g" | sed "s/.png//g"`
    echo "Installing $name from $icon (size $size)"
    xdg-icon-resource install --context "apps" --size $size $icon --novendor "$name"
    echo "Added icon ~/.local/share/icons/hicolor/${size}x${size}/apps/$name.png"
  done
  cd "$pwd"
}

# Set PATHs
export PATH="$HOME:/.bun/bin:$HOME/.local/bin:$PATH"
export EDITOR="$(which nvim)"
alias n="nvim"

function fuckoff { 
  # Sync filesystems
  echo s | run0 tee /proc/sysrq-trigger > /dev/null
  sleep 1  # Wait a moment for the sync to complete

  # Unmount filesystems
  echo u | run0 tee /proc/sysrq-trigger > /dev/null
  sleep 1  # Wait a moment for the unmount to complete

  # Power off the system
  echo o | run0 tee /proc/sysrq-trigger > /dev/null
}


function getback { 
  # Sync filesystems
  echo s | run0 tee /proc/sysrq-trigger > /dev/null
  sleep 1  # Wait a moment for the sync to complete

  # Unmount filesystems
  echo u | run0 tee /proc/sysrq-trigger > /dev/null
  sleep 1  # Wait a moment for the unmount to complete

  # Reboot the system
  echo b | run0 tee /proc/sysrq-trigger > /dev/null
}

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# bun completions
[ -s "/home/rajdeep/.bun/_bun" ] && source "/home/rajdeep/.bun/_bun"
source /usr/share/nvm/init-nvm.sh
