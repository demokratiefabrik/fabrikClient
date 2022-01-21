#!/bin/sh

# Replace env vars in JavaScript files
# echo "Replacing env vars in JS"
# for file in /usr/share/nginx/html/js/app.*.js;
# do

#   # Use the existing JS file as template
#   if [ ! -f $file.tmpl.js ]; then
#     cp $file $file.tmpl.js
#   fi

#   envsubst '$ENV_DOMAIN,$ENV_I18N_LOCALE,$ENV_I18N_FALLBACK_LOCALE,$ENV_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS,$ENV_APISERVER_URL,$ENV_OAUTH_LOCAL_REDIRECTION_URI,$ENV_OAUTH_BASE_URL,$ENV_OAUTH_CLIENT_ID,$ENV_SURVEY_URL' < $file.tmpl.js > $file

# done

nginx -g 'daemon off;'

# remove template file after replacing, right
# rm $file.tmpl
