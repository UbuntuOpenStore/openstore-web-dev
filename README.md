# OpenStore Web

Meta repo for getting setup with developing the [OpenStore](https://open.uappexplorer.com/).

## Reporting Bugs

Please report any bugs/features/requests in our [bug tracker](https://github.com/UbuntuOpenStore/openstore-meta/issues).

## Translations

If you would like to help out with translations head over to the OpenStore
project on the [UBports Weblate instance](https://translate.ubports.com/projects/openstore/openstore-web/).

## Development

* Initialize submodules:
    * Run: `git submodule update --init --recursive`
* Install [vagrant](http://vagrantup.com/)
* Install the docker compose vagrant plugin:
    * Run: `vagrant plugin install vagrant-docker-compose`
* Start vagrant:
    * Run: `vagrant up`
* Install NPM dependencies (it's best to run this in the vagrant VM):
    * Install api dependencies: `cd openstore-api; npm install; cd ..`
    * Install web dependencies: `cd openstore-web; npm install; cd ..`
* Attach to the docker container (if needed - from inside the vagrant VM):
    * Attach to the api container: `attach_api`
    * Attach to the web container: `attach_web`
* Update your system's hosts file:
    * Add `192.168.58.123 local.open.uappexplorer.com`
* Visit the site:
    * In your browser go to: `local.open.uappexplorer.com`
* Login
    * Login to the OpenStore to setup your user
    * Upgrade your user to an admin (From inside the vagrant VM): `docker exec -it openstore_api_1 node /srv/openstore/openstore-api/bin/setup-admin`
* Profit!

## Configuration

For more info on configuration read the [openstore-api/README.md](https://github.com/UbuntuOpenStore/openstore-api/blob/master/README.md).

## License

Copyright (C) 2017 [Brian Douglass](http://bhdouglass.com/)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3, as published
by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
