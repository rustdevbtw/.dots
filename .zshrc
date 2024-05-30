fastfetch

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
alias cd="z"

function grubdate {
  sudo grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
  sudo grub-mkconfig -o /boot/grub/grub.conf
}

# Set PATHs
export PATH="$HOME/.local/bin:$PATH"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
