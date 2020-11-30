#!/bin/bash

source /srv/openstore/env.sh

set -x
set -e

date

b2 sync --noProgress --delete $DATA_DIR b2://openstore-backup/data
b2 sync --noProgress --delete $IMAGE_DIR b2://openstore-backup/images
b2 sync --noProgress --delete $ICON_DIR b2://openstore-backup/icons

mongodump -h $MONGODB_HOST -d $MONGODB_DB -o /srv/openstore/backup-full/
mongodump -h $MONGODB_HOST -d $MONGODB_DB --collection=packages -o /srv/openstore/backup/
mongodump -h $MONGODB_HOST -d $MONGODB_DB --collection=ratingcounts -o /srv/openstore/backup/
mongodump -h $MONGODB_HOST -d $MONGODB_DB --collection=reviews -o /srv/openstore/backup/
b2 sync --noProgress --delete /srv/openstore/backup/ b2://openstore-backup/mongo
