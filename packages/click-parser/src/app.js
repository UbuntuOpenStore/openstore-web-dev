function App(name, hooks) {
  this.name = name;
  this.type = 'app'; // app, webapp, scope, push, webapp+
  this.features = []; // content_hub, url_dispatcher, push_helper, account_service
  this.desktop = {};
  this.scopeIni = {};
  this.apparmor = {};
  this.contentHub = {};
  this.urlDispatcher = [];
  this.pushHelper = {};
  this.accountService = {};
  this.accountApplication = {};
  this.webappProperties = {};
  this.webappInject = false;
  this.webappUrl = null;
  this.hooks = hooks;
  this.qmlImports = [];
}

module.exports = App;
