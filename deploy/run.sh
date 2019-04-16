#!/bin/bash

cd /srv/openstore-api/src/
source /srv/openstore/env.sh
source /srv/openstore/version.sh
node /srv/openstore-api/src/index.js
