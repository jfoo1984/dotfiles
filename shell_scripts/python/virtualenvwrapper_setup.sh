export WORKON_HOME=$HOME/.virtualenvs

if [ -n "$(asdf where python 2>/dev/null)" ]; then
  export VIRTUALENVWRAPPER_PYTHON=$(asdf where python)/bin/python
  source $(asdf where python)/bin/virtualenvwrapper.sh
else
  export VIRTUALENVWRAPPER_PYTHON=$(which python3)
  source $(which virtualenvwrapper.sh)
fi
