" execute pathogen#infect()
set nocompatible              " be iMproved, required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" alternatively, pass a path where Vundle should install plugins
" call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

" Keep Plugin commands between vundle#begin/end.

" for ruby dev
Bundle 'vim-ruby/vim-ruby'
Plugin 'tpope/vim-rails'
Plugin 'tpope/vim-rake'
Plugin 'tpope/vim-bundler'
Plugin 'tpope/vim-projectionist'
Plugin 'jlanzarotta/bufexplorer'

" plugin on GitHub repo
Plugin 'tpope/vim-fugitive'

" surround.vim
Plugin 'tpope/vim-surround'

" solarized color scheme
Plugin 'altercation/vim-colors-solarized'

" vim-javascript
Plugin 'pangloss/vim-javascript'

" vim-gitgutter
Plugin 'airblade/vim-gitgutter'

" NERD TREE
Plugin 'scrooloose/nerdtree'

" NERD Commenter
Plugin 'scrooloose/nerdcommenter'

" youcompleteme
Plugin 'valloric/youcompleteme'

" Syntastic
Plugin 'scrooloose/syntastic'

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
" To ignore plugin indent changes, instead use:
"filetype plugin on
"
" Brief help
" :PluginList       - lists configured plugins
" :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
" :PluginSearch foo - searches for foo; append `!` to refresh local cache
" :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal
"
" see :h vundle for more details or wiki for FAQ
" Put your non-Plugin stuff after this line

filetype plugin indent on
" show existing tab with 2 spaces width
set tabstop=2
" when indenting with '>', use 2 spaces width
set shiftwidth=2
" On pressing tab, insert 2 spaces
set expandtab

syntax enable
set background=dark
colorscheme solarized

set number
