# OpenStore Web

Meta repo for getting setup with developing the [OpenStore](https://open-store.io/).

## Reporting Bugs

Please report any bugs/features/requests in our [bug tracker](https://gitlab.com/theopenstore/openstore-meta/issues).

## Translations

If you would like to help out with translations head over to the OpenStore
project on the [UBports Weblate instance](https://translate.ubports.com/projects/openstore/open-storeio/).

## Development

* Initialize submodules:
    * Run: `git submodule update --init --recursive`
* Install the [docker & docker-compose](https://docs.docker.com/install/linux/docker-ce/ubuntu/):
* Install NPM dependencies:
    * Install api dependencies: `cd openstore-api; npm install; cd ..`
    * Install web dependencies: `cd openstore-web; npm install; cd ..`
* Start the docker containers
    * Run: `docker-compose up -d`
* Attach to the docker container:
    * Attach to the api container: `./docker/attach_api.sh`
    * Attach to the web container: `./docker/attach_web.sh`
* Visit the site:
    * In your browser go to: [http://localhost:8080](http://localhost:8080/)
    * For best results setup a local nginx to redirect `local.open-store.io` to `localhost:8080` and add `127.0.0.1 local.open-store.io` to your `/etc/hosts` file

```
server {
    listen 80;
    server_name local.open-store.io;
    server_tokens off;
    client_max_body_size 0;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
```

* Login
    * Login to the OpenStore to setup your user
    * Upgrade your user to an admin: `docker exec -it openstorewebdev_api_1 node /srv/openstore/openstore-api/bin/setup-admin`
* Stop the docker containers (when you are done):
    * Run: `docker-compose stop`

## Configuration

For more info on configuration read the [openstore-api/README.md](https://gitlab.com/theopenstore/openstore-api/blob/master/README.md).

## License

Copyright (C) 2019 [Brian Douglass](http://bhdouglass.com/)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3, as published
by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
