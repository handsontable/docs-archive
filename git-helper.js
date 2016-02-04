
var getRepoInfo = require('git-repo-info');
var GitHubApi = require('github');
var Promise = require('bluebird');
var fs = require('fs');
var semver = require('semver');
var github;

/**
 * Setup the Github API helper objects and authenticate them.
 *
 * @param {String} githubToken The Github access token.
 */
exports.setupGitApi = function setupGitApi(githubToken) {
  if (github) {
    return;
  }
  github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000,
    headers: {
      'user-agent': 'Handsontable'
    }
  });

  github.authenticate({
    type: 'oauth',
    token: githubToken
  });
};

/**
 * Get information about local repository.
 *
 * @returns {Object}
 */
exports.getLocalInfo = function getLocalInfo() {
  return getRepoInfo();
};

/**
 * Get latest Handsontable release version based on passed semver range.
 *
 * @param {String} [range=false] Semver range version
 * @returns {Promise}
 */
exports.getHotLatestRelease = function getHotLatestRelease(range) {
  return new Promise(function(resolve, reject) {
    github.releases.listReleases({
      owner: 'handsontable',
      repo: 'handsontable',
      page: 1,
      per_page: 100
    }, function(err, resp) {
      if (err) {
        return reject(err);
      }
      if (range) {
        resp = resp.filter(function(release) {
          return semver.satisfies(release.tag_name, range);
        });
      }
      resolve(resp.length ? resp[0] : null);
    });
  });
};

/**
 * Get all availables docs version
 *
 * @returns {Promise}
 */
exports.getDocsVersions = function getDocsVersions() {
  return new Promise(function(resolve, reject) {
    github.repos.getBranches({
      user: 'handsontable',
      repo: 'docs',
      per_page: 100
    }, function(err, resp) {
      if (err) {
        return reject(err);
      }
      var branches;

      branches = resp.filter(function(branch) {
        return branch.name.match(/^\d{1,5}\.\d{1,5}\.\d{1,5}(\-(beta|alpha)(\d+)?)?$/) ? true : false;

      }).map(function(branch) {
        return branch.name;

      }).sort(function(a, b) {
        if (semver.gt(a, b)) {
          return 1;
        }
        if (semver.lt(a, b)) {
          return -1;
        }

        return 0;
      });

      resolve(branches);
    });
  });
};
