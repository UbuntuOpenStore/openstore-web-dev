#!/bin/bash

cd /srv/openstore-api/current/src/
source /srv/openstore/env.sh
source /srv/openstore/version.sh
node /srv/openstore-api/current/src/index.js
