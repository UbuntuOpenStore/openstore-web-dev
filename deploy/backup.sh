#!/bin/bash

source /srv/openstore/env.sh

set -x
set -e

date

b2 sync --noProgress --delete $DATA_DIR b2://openstore-backup/data
b2 sync --noProgress --delete $IMAGE_DIR b2://openstore-backup/images
b2 sync --noProgress --delete $ICON_DIR b2://openstore-backup/icons

mongodump -h $MONGODB_HOST -d $MONGODB_DB -u $MONGODB_USER -p $MONGODB_PASSWORD \
    --collection=packages \
    --collection=ratingcounts \
    --collection=reviews \
    -o /tmp/mongo-backup
b2 sync --noProgress --delete /tmp/mongo-backup b2://openstore-backup/mongo
