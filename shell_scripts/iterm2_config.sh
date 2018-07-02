function title {
    if [ $ITERM_SESSION_ID ]
    then
      if [ $# -ne 0 ]
      then
        export PROMPT_COMMAND='echo -ne "\033]0;'${*}'\007"'
      else
        export PROMPT_COMMAND='echo -ne "\033]0;${PWD##*/}\007"'
      fi
    fi
}
title
