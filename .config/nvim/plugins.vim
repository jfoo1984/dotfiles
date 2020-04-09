"dein Scripts-----------------------------
if &compatible
  set nocompatible               " Be iMproved
endif

" Required: Add the dein installation directory into runtimepath
set runtimepath+=/Users/jfu/.cache/dein/repos/github.com/Shougo/dein.vim

" Required:
if dein#load_state('/Users/jfu/.cache/dein')
  call dein#begin('/Users/jfu/.cache/dein')

  " Let dein manage dein
  " Required:
  call dein#add('/Users/jfu/.cache/dein/repos/github.com/Shougo/dein.vim')

  " Add or remove your plugins here
  " vim-better-whitespace - Trailing whitespace highlighting & automatic fixing
  call dein#add('ntpeters/vim-better-whitespace')

  " endwise
  call dein#add('tpope/vim-endwise')

  " vim-closer - auto-close plugin
  call dein#add('rstacruz/vim-closer')

  " vim-easymotion - Improved motion in Vim
  call dein#add('easymotion/vim-easymotion')

  " coc - Intellisense Engine
  call dein#add('neoclide/coc.nvim', {'merged':0, 'rev': 'release'})

  " denite - Fuzzy finding, buffer management7
  call dein#add('Shougo/denite.nvim')

  " Snippet support
  call dein#add('Shougo/neosnippet.vim')
  call dein#add('Shougo/neosnippet-snippets')

  " echodoc - Print function signatures in echo area
  call dein#add('Shougo/echodoc.vim')

  " for Shougo plugins
  if !has('nvim')
    call dein#add('roxma/nvim-yarp')
    call dein#add('roxma/vim-hug-neovim-rpc')
  endif

  " vim-commentary
  call dein#add('tpope/vim-commentary')

  " vim-rails
  call dein#add('tpope/vim-rails')

  " === Git Plugins === "
  " vim-gitgutter Display VCS status signs in gutter.
  call dein#add('airblade/vim-gitgutter')

  " vim-fugitive
  call dein#add('tpope/vim-fugitive')

  " === UI === "
  " vim-solarized8_flat - Solarized color scheme
  call dein#add('lifepillar/vim-solarized8')

  " nerdtree - File explorer
  call dein#add('preservim/nerdtree')
  call dein#add('Xuyuanp/nerdtree-git-plugin')

  " vim-airline - Customized vim status line
  call dein#add('vim-airline/vim-airline')
  call dein#add('vim-airline/vim-airline-themes')

  " Icons
  call dein#add('ryanoasis/vim-devicons')
  call dein#add('tiagofumo/vim-nerdtree-syntax-highlight')

  " Required:
  call dein#end()
  call dein#save_state()
endif

" Required:
filetype plugin indent on
syntax enable

" If you want to install not installed plugins on startup.
if dein#check_install()
 call dein#install()
endif

"End dein Scripts-------------------------
