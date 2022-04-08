const ar = require('ar');
const fs = require('fs');
const path = require('path');
const streamifier = require('streamifier');
const tar = require('tar');
const tarstream = require('tar-stream');
const uuid = require('uuid');
const xml2js = require('xml2js');
const zlib = require('zlib');
const utf8 = require('utf8');

const App = require('./app');
const utils = require('./utils');

// TODO detect indicators

function extractIcon(fileData, data, callback) {
  let iconpath = data.iconpath;
  if (iconpath.indexOf('./') !== 0) {
    iconpath = `./${data.iconpath}`;
  }

  const write = path.join('/tmp', `${uuid.v4()}${path.extname(data.iconpath).toLowerCase()}`);
  const f = fs.createWriteStream(write)
    .on('finish', () => {
      data.icon = write;
      callback(null, data);
    });

  let found = false;
  streamifier.createReadStream(fileData)
    .on('error', (err) => {
      console.error(err);
      callback(null, data);
    })
    .pipe(zlib.Unzip())
    .pipe(new tar.Parse())
    .on('entry', (entry) => {
      if (entry.path == iconpath) {
        entry.pipe(f);
        found = true;
      }
      else {
        entry.resume();
      }
    })
    .on('end', () => {
      if (!found) {
        callback(null, data);
      }
    });
}

function parseJsonFile(stream, callback) {
  stream.on('data', (fdata) => {
    const str = fdata.toString();
    if (utils.isJson(str)) {
      callback(JSON.parse(str));
    }
    else {
      callback();
    }
  });
}

function parseXmlFile(stream, callback) {
  stream.on('data', (fdata) => {
    const str = fdata.toString();
    xml2js.parseString(str, {
      explicitArray: false,
      mergeAttrs: true,
      normalizeTags: true,
      normalize: true,
    }, (err, result) => {
      if (err) {
        callback();
      }
      else {
        callback(result);
      }
    });
  });
}

function parseIniFile(stream, callback) {
  stream.on('data', (fdata) => {
    const data = {};
    const desktop = fdata.toString().split('\n');

    const other = [];
    desktop.forEach((line) => {
      const lline = line.toLowerCase().trim();
      if (!(lline[0] == '[' && lline[lline.length - 1] == ']') && lline.length > 0) {
        const pos = lline.indexOf('=');
        if (pos > -1) {
          const key = lline.substring(0, pos).trim();
          const value = lline.substring(pos + 1).trim();
          data[key] = value;
        }
        else {
          other.push(line);
        }
      }
    });

    if (other.length > 0) {
      data.other = other;
    }

    callback(data);
  });
}

function parseQmlImports(str) {
  const split = str.split('\n');
  return split.filter((line) => line.trim().startsWith('import ')).map((line) => {
    const tokens = line.split(' ');
    const module = tokens[1].replace(/"/g, '');
    const isJs = module.endsWith('.js');
    const version = isJs ? null : tokens[2];

    return {
      module,
      version,
    };
  });
}

function parseData(fileData, data, icon, callback) {
  let potentialOgraWebapp = false;

  streamifier.createReadStream(fileData)
    .pipe(zlib.Unzip())
    .pipe(tarstream.extract())
    .on('entry', (header, stream, cb) => {
      const filename = header.name.replace('./', '');
      if (filename) {
        data.files.push(filename);
      }

      let found = false;
      data.apps.forEach((app) => {
        const scopeIni = `${data.name}_${app.name}.ini`;

        if (app.hooks.desktop && header.name == `./${app.hooks.desktop}`) {
          found = true;
          parseIniFile(stream, (json) => {
            app.desktop = json || {};

            if (app.desktop.exec) {
              if (app.desktop.exec.indexOf('webapp-container') === 0) {
              /*
              Check the arguments to webapp-container, if they contain
              an external url as the main url the assume it's a webapp.
              */

                let url = null;
                const exec = app.desktop.exec.replace('  ', ' ').replace('webapp-container', '').trim();

                // Match spaces not encased in quotes: http://stackoverflow.com/a/16261693
                const execSplit = exec.match(/(?:[^\s"]+|"[^"]*")+/g);
                execSplit.forEach((value) => {
                  if (
                    value && (
                      value.substring(0, 7) == 'http://' ||
                    value.substring(0, 8) == 'https://'
                    )
                  ) {
                    url = value;
                  }
                });

                if (url) {
                  app.type = 'webapp';
                  app.webappUrl = url;
                }
              }
            }

            if (app.desktop.icon) {
              data.iconpath = app.desktop.icon;
            }

            cb();
          });
        }
        else if (app.hooks.apparmor && header.name == `./${app.hooks.apparmor}`) {
          found = true;
          parseJsonFile(stream, (json) => {
            app.apparmor = json || {};
            cb();
          });
        }
        else if (app.hooks['content-hub'] && header.name == `./${app.hooks['content-hub']}`) {
          found = true;
          parseJsonFile(stream, (json) => {
            app.contentHub = json || {};
            cb();
          });
        }
        else if (app.hooks.urls && header.name == `./${app.hooks.urls}`) {
          found = true;
          parseJsonFile(stream, (json) => {
            app.urlDispatcher = json || [];
            cb();
          });
        }
        else if (app.hooks['push-helper'] && header.name == `./${app.hooks['push-helper']}`) {
          found = true;
          parseJsonFile(stream, (json) => {
            app.pushHelper = json || {};
            cb();
          });
        }
        else if (app.hooks['account-service'] && header.name == `./${app.hooks['account-service']}`) {
          found = true;
          parseXmlFile(stream, (json) => {
            app.accountService = json || {};
            cb();
          });
        }
        else if (app.hooks['account-application'] && header.name == `./${app.hooks['account-application']}`) {
          found = true;
          parseXmlFile(stream, (json) => {
            app.accountApplication = json || {};
            cb();
          });
        }
        else if (app.type == 'scope' && header.name.indexOf(scopeIni, header.name.length - scopeIni.length) !== -1) {
          found = true;
          parseIniFile(stream, (json) => {
            app.scopeIni = json || {};

            if (app.scopeIni.icon) {
              // Assume the icon is relative to the ini file
              data.iconpath = header.name.replace(scopeIni, app.scopeIni.icon).replace('./', '');
            }

            cb();
          });
        }
        else if ((app.type == 'app' || app.type == 'webapp+') && header.name == './config.js') {
          /*
            Detect the Ogra's alternate webapp container.
            Detect both the presence of a config.js file and
            Main.qml file with certain parameters.
            */

          stream.on('data', (fdata) => {
            const str = fdata.toString();

            if (
              str.indexOf('var webappName') >= 0 &&
                str.indexOf('var webappUrl') >= 0 &&
                str.indexOf('var webappUrlPattern') >= 0
            ) {
              if (potentialOgraWebapp) {
                app.type = 'webapp+';
              }
              else {
                potentialOgraWebapp = true;
              }
            }

            cb();
          });
        }
        else if ((app.type == 'app' || app.type == 'webapp+') && header.name == './qml/Main.qml') {
          // Detect the Ogra's alternate webapp container http://bazaar.launchpad.net/~ogra/alternate-webapp-container/trunk/files

          stream.on('data', (fdata) => {
            const str = fdata.toString();

            if (str.indexOf('WebView') >= 0 || str.indexOf('WebEngineView') >= 0) {
              if (potentialOgraWebapp) {
                app.type = 'webapp+';
              }
              else {
                potentialOgraWebapp = true;
              }
            }

            app.qmlImports = app.qmlImports.concat(parseQmlImports(str));

            cb();
          });
        }
        else if (header.name.endsWith('.qml')) {
          stream.on('data', (fdata) => {
            const str = fdata.toString();
            app.qmlImports = app.qmlImports.concat(parseQmlImports(str));

            cb();
          });
        }
      });

      if (!found) {
        if (header.name == './webapp-properties.json') {
          stream.on('data', (fdata) => {
            let webappProperties = fdata.toString();
            if (utils.isJson(webappProperties)) {
              webappProperties = JSON.parse(webappProperties);
              data.webappProperties = webappProperties;
              if (webappProperties.scripts && webappProperties.scripts.length > 0) {
                data.webappInject = true;
              }
            }

            cb();
          });
        }
        else if (header.name.indexOf('LC_MESSAGES') >= 0 && header.name.indexOf('.mo') >= 0) {
          const langs = header.name.split('/');
          const pos = langs.indexOf('LC_MESSAGES');
          let lang = null;
          if (pos >= 1) {
            lang = langs[pos - 1].trim();
          }

          if (lang && data.languages.indexOf(lang) == -1) {
            data.languages.push(lang);
          }

          cb();
        }
        else {
          cb();
        }
      }

      stream.resume();
    })
    .on('error', (err) => {
      console.error(err);
      callback(err);
    })
    .on('finish', () => {
      if (icon && data.iconpath) {
        extractIcon(fileData, data, callback);
      }
      else {
        callback(null, data);
      }
    });
}

function parseControl(control, fileData, icon, callback) {
  const data = {
    apps: [],
    architecture: 'all',
    description: '',
    framework: null,
    icon: null,
    iconpath: null,
    maintainer: null,
    maintainerEmail: null,
    name: null,
    permissions: [], // TODO add read/write paths
    title: null,
    types: [],
    urls: [],
    version: null,
    installedSize: null,
    webappInject: false,
    webappProperties: {},
    languages: [],
    files: [],
  };

  streamifier.createReadStream(control)
    .pipe(zlib.Unzip())
    .pipe(tarstream.extract())
    .on('entry', (header, stream, cb) => {
      if (header.name == './manifest') {
        let manifest = '';
        stream.on('data', (fdata) => {
          manifest += fdata.toString();
        });

        stream.on('end', () => {
          if (utils.isJson(manifest)) {
            data.manifest = JSON.parse(manifest);

            if (!data.manifest.hooks || Object.keys(data.manifest.hooks).length === 0) {
              cb('Manifest file does not have any hooks in it');
            }
            else {
              Object.keys(data.manifest.hooks).forEach((name) => {
                const hook = data.manifest.hooks[name];
                const app = new App(name, hook);

                if (hook.desktop) {
                  app.type = 'app';
                }
                else if (hook.scope) {
                  app.type = 'scope';
                }
                else if (hook['push-helper']) {
                  app.type = 'push';
                }

                data.apps.push(app);
              });
            }

            cb();
          }
          else {
            cb('Manifest file is not in a json format');
          }
        });
      }
      else {
        cb();
      }

      stream.resume();
    })
    .on('error', (err) => {
      callback(err);
    })
    .on('finish', () => {
      let maintainerEmail = '';
      let maintainer = '';
      if (data.manifest.maintainer) {
        const match = data.manifest.maintainer.match(/<.*>/);
        if (match && match.length == 1) {
          maintainerEmail = match[0].replace('<', '').replace('>', '').trim();
        }

        maintainer = data.manifest.maintainer.replace(/<.*>/, '').trim();
        try {
          // Ensure that special characters are properly encoded
          maintainer = utf8.decode(maintainer);
        }
        catch (e) {
          if (
            e.message != 'Invalid UTF-8 detected' &&
                e.message != 'Invalid continuation byte' &&
                e.message != 'Invalid byte index'
          ) {
            throw e;
          }
        }
      }

      if (data.manifest.architecture) {
        data.architecture = data.manifest.architecture;
      }

      data.description = data.manifest.description;
      data.framework = data.manifest.framework;
      data.maintainer = maintainer;
      data.maintainerEmail = maintainerEmail;
      data.name = data.manifest.name;
      data.title = data.manifest.title;
      data.version = data.manifest.version;

      if (data.manifest['installed-size']) {
        data.installedSize = parseInt(data.manifest['installed-size'], 10);
      }

      parseData(fileData, data, icon, callback);
    });
}

module.exports = function parseClickPackage(filepath, iconOrCallback, callback) {
  return new Promise((resolve, reject) => {
    let icon = iconOrCallback;
    if (typeof icon == 'function' && !callback) {
      callback = icon;
      icon = false;
    }

    let dataFile = null;
    let controlFile = null;

    const archive = new ar.Archive(fs.readFileSync(filepath));
    archive.getFiles().forEach((file) => {
      if (file.name() == 'data.tar.gz') {
        dataFile = file.fileData();
      }
      else if (file.name() == 'control.tar.gz') {
        controlFile = file.fileData();
      }
    });

    if (dataFile === null || controlFile === null) {
      reject(new Error('Malformed click package'));
      if (callback) {
        callback('Malformed click package');
      }
    }
    else {
      parseControl(controlFile, dataFile, icon, (err, data) => {
        if (err) {
          reject(err);
          if (callback) {
            callback(err);
          }
        }
        else if (!data) {
          reject(new Error('Control data is undefined'));
          if (callback) {
            callback('Control data is undefined');
          }
        }
        else {
          data.apps.forEach((app) => {
            if (data.types.indexOf(app.type) == -1) {
              data.types.push(app.type);
            }

            if (Object.keys(app.contentHub).length > 0) {
              app.features.push('content_hub');
            }

            if (Object.keys(app.urlDispatcher).length > 0) {
              app.features.push('url_dispatcher');
            }

            if (Object.keys(app.pushHelper).length > 0) {
              app.features.push('push_helper');
            }

            if (Object.keys(app.accountService).length > 0) {
              app.features.push('account_service');
            }

            if (app.type == 'webapp') {
              app.webappProperties = data.webappProperties;
              app.webappInject = data.webappInject;
            }

            if (app.apparmor && app.apparmor.policy_groups) {
              data.permissions = data.permissions.concat(app.apparmor.policy_groups.filter((permission) => {
                return data.permissions.indexOf(permission) < 0;
              }));
            }

            if (app.apparmor && app.apparmor.template == 'unconfined') {
              data.permissions.push('unconfined');
            }

            if (app.urlDispatcher && Array.isArray(app.urlDispatcher)) {
              app.urlDispatcher.forEach((ud) => {
                let url = '';
                if (ud.protocol) {
                  url = `${ud.protocol}://`;
                  if (ud['domain-suffix']) {
                    url += ud['domain-suffix'];
                  }

                  if (data.urls.indexOf(url) == -1) {
                    data.urls.push(url);
                  }
                }
              });
            }

            // Deduplicate imports
            const qmlImportMatch = [];
            const qmlImports = [];
            app.qmlImports.forEach((qmlImport) => {
              const key = qmlImport.module + qmlImport.version;
              if (!qmlImportMatch.includes(key)) {
                qmlImportMatch.push(key);
                qmlImports.push(qmlImport);
              }
            });

            app.qmlImports = qmlImports;
          });

          delete data.iconpath;
          delete data.manifest;
          delete data.webappInject;
          delete data.webappProperties;

          resolve(data);
          if (callback) {
            callback(null, data);
          }
        }
      });
    }
  });
};
