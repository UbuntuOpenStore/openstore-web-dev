#!/bin/bash

cd /srv/openstore-api/current/dist/
source /srv/openstore/env.sh
source /srv/openstore/version.sh
npm run start
