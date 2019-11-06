# this is the config for our redirects for our NGINX server
# include this file with "include redirects_unicorn-utterances.com;"

# url migration per PR #15

location /authors {
    return 302 /about;
}

location = /posts/ {
    return 301 /;
}
