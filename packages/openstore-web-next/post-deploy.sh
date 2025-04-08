#!/bin/bash

VERSION=$1
ENV=${2:-""}
BASE=/srv/openstore-web-next$ENV

set -x
set -e

cd $BASE/$VERSION

rm -f $BASE/current
ln -s $BASE/$VERSION $BASE/current
chmod 777 $BASE/current/*.db

sudo systemctl restart openstore-web-next$ENV

cd $BASE/
echo "Going to remove old versions"
ls -1t | grep -v current | tail -n +5
ls -1t | grep -v current | tail -n +5 | xargs -d '\n' -r rm -r --
