const assert = require('assert');
const path = require('path');

const parse = require('../src/index');

describe('click-parser', () => {
  describe('parse qml click package', () => {
    it('should parse without error', (done) => {
      parse(path.join(__dirname, 'test-qml.bhdouglass_0.1_all.click'), (err, data) => {
        if (err) {
          throw err;
        }

        assert.deepEqual(data, {
          apps: [{
            name: 'test-qml',
            type: 'app',
            features: ['content_hub', 'url_dispatcher', 'account_service'],
            desktop: {
              name: 'test-qml',
              exec: 'qmlscene $@ Main.qml',
              icon: 'test-qml.png',
              terminal: 'false',
              type: 'Application',
              'x-ubuntu-touch': 'true',
            },
            apparmor: {
              policy_groups: ['networking', 'webview'],
              policy_version: 1.3,
            },
            contentHub: {
              source: ['pictures'],
            },
            urlDispatcher: [{
              protocol: 'http',
              'domain-suffix': 'example.com',
            }],
            pushHelper: {},
            qmlImports: [
              {
                module: 'QtQuick',
                version: '2.0',
              },
              {
                module: 'Ubuntu.Components',
                version: '1.1',
              },
            ],
            accountService: {
              service: {
                name: 'test-qml',
                type: 'test-qml.bhdouglass',
                provider: 'facebook',
              },
            },
            accountApplication: {
              application: {
                services: {
                  service: {
                    id: 'test-qml.bhdouglass',
                    description: 'Post your pictures to Facebook',
                  },
                },
              },
            },
            webappProperties: {},
            webappUrl: null,
            webappInject: false,
            hooks: {
              'account-application': 'account-application.xml',
              'account-service': 'account-service.xml',
              apparmor: 'apparmor.json',
              'content-hub': 'content-hub.json',
              desktop: 'test-qml.desktop',
              urls: 'url-dispatcher.json',
            },
            scopeIni: {},
          }, {
            name: 'test-qml-push-helper',
            type: 'push',
            features: ['push_helper'],
            desktop: {},
            apparmor: {
              policy_groups: ['push-notification-client'],
              policy_version: 1.3,
              template: 'ubuntu-push-helper',
            },
            contentHub: {},
            urlDispatcher: [],
            pushHelper: {
              exec: 'pushHelper',
              app_id: 'test-qml.bhdouglass',
            },
            qmlImports: [
              {
                module: 'QtQuick',
                version: '2.0',
              },
              {
                module: 'Ubuntu.Components',
                version: '1.1',
              },
            ],
            accountService: {},
            accountApplication: {},
            webappProperties: {},
            webappUrl: null,
            webappInject: false,
            hooks: {
              apparmor: 'push-helper-apparmor.json',
              'push-helper': 'push-helper.json',
            },
            scopeIni: {},
          }],
          architecture: 'all',
          description: 'description of test-qml',
          files: [
            'url-dispatcher.json',
            'account-service.xml',
            'content-hub.json',
            'test-qml.desktop',
            'test-qml.png',
            'account-application.xml',
            'push-helper-apparmor.json',
            'pushHelper',
            'Main.qml',
            'apparmor.json',
            'push-helper.json',
          ],
          framework: 'ubuntu-sdk-15.04',
          icon: null,
          maintainer: 'Brian Douglass',
          maintainerEmail: 'bhdouglass@gmail.com',
          name: 'test-qml.bhdouglass',
          permissions: ['networking', 'webview', 'push-notification-client'],
          title: 'test-qml',
          types: ['app', 'push'],
          urls: ['http://example.com'],
          version: '0.1',
          languages: [],
          installedSize: 39,
        });

        done();
      });
    });
  });

  describe('parse html5 click package', () => {
    it('should parse without error', (done) => {
      parse(path.join(__dirname, 'test-html5.bhdouglass_0.1_all.click'), (err, data) => {
        if (err) {
          throw err;
        }

        assert.equal(data.apps.length, 1);
        assert.equal(data.apps[0].type, 'app');

        done();
      });
    });
  });

  describe('parse scope click package', () => {
    it('should parse without error', (done) => {
      parse(path.join(__dirname, '/test-scope.bhdouglass_0.1_armhf.click'), (err, data) => {
        if (err) {
          throw err;
        }

        assert.equal(data.apps.length, 1);
        assert.equal(data.apps[0].type, 'scope');
        assert.deepEqual(data.apps[0].scopeIni, {
          displayname: 'Test-scope Scope',
          description: 'This is a Test-scope scope',
          art: 'screenshot.png',
          author: 'Firstname Lastname',
          icon: 'icon.png',
          'pageheader.logo': 'logo.png',
        });

        done();
      });
    });
  });

  describe('parse webapp click package', () => {
    it('should parse without error', (done) => {
      parse(path.join(__dirname, '/test-webapp.bhdouglass_0.1_all.click'), (err, data) => {
        if (err) {
          throw err;
        }

        assert.equal(data.apps.length, 1);
        assert.equal(data.apps[0].type, 'webapp');
        assert.equal(data.apps[0].webappInject, true);
        assert.equal(data.apps[0].webappUrl, 'http://example.com');
        assert.deepEqual(data.apps[0].webappProperties, {
          includes: ['http://example.com:*/*'],
          name: 'ExtendedWebappProperties',
          scripts: ['inject.js'],
          domain: '',
          homepage: '',
          /* eslint-disable-next-line max-len */
          'user-agent-override': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/39.0.2171.65 Chrome/39.0.2171.65 Safari/537.36',
        });

        done();
      });
    });
  });

  describe('parse ogra webapp click package', () => {
    it('should parse without error', (done) => {
      parse(path.join(__dirname, '/test-ogra.bhdouglass_0.1_all.click'), (err, data) => {
        if (err) {
          throw err;
        }

        assert.equal(data.apps.length, 1);
        assert.equal(data.apps[0].type, 'webapp+');

        done();
      });
    });
  });
});
