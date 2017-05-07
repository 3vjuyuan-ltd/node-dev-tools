/**
 * Copyright (c) 2014-present, San Wei Ju Yuan Tech Ltd. <https://www.3vjuyuan.com>
 * All rights reserved.
 *
 * This file is part of node-dev-tools, licensed under the MIT license (MIT) found
 * in the LICENSE file in the root directory of this source tree.
 *
 * For more details:
 * https://www.3vjuyuan.com/licenses/mit.html
 *
 * @author Team Fancy <fancy@3vjuyuan.com>
 * @author Team Delta <delta@3vjuyuan.com>
 */

'use strict';

import fs from 'fs';
import yaml from 'js-yaml';
import gulpRequireTasks from 'gulp-require-tasks';
import merge from './scripts/merge';
import empty from './scripts/empty';

process.trimPath = function (input) {
    return 'string' === typeof input ? input.replace(/^\/+|\/+$/g, '') : '';
};

process.getObjectType = function (obj) {
    return ({}).toString.call(obj).slice(8, -1).toLowerCase();
};

let currentPath = process.cwd() + '/',
    projectPath = process.env.PWD + (empty(process.env.npm_package_project_path) ? '/' : '/' + process.trimPath(process.env.npm_package_project_path) + '/'),
    configuration = merge(
        yaml.load(fs.readFileSync(currentPath + 'default.yml', 'utf8')),
        fs.existsSync(projectPath + 'project.yml') ? yaml.load(fs.readFileSync(projectPath + 'project.yml', 'utf8')) : {}
    ),
    lint,
    lintFilePath = '';

if (!Array.isArray(configuration.tasks.path)) {
    console.error("\x1b[31m", '\nThe default tasks configuration is lost. The path must be an array.\nPlease Check you configuration file in "UserProject/config.yml".');
    process.exit();
}

if (empty(lint = configuration.styles.lint) || process.getObjectType(lint) !== 'object') {
    lint = {configFile: currentPath + '.sass-lint.yml'};
} else if(
    fs.existsSync(lintFilePath = projectPath + process.trimPath(lint.configFile)) ||
    fs.existsSync(lintFilePath = process.env.PWD + '/' + process.trimPath(lint.configFile))){
    lint.configFile = lintFilePath;
} else {
    lint.configFile = currentPath + '.sass-lint.yml';
}

if (empty(lint = configuration.script.lint)) {
    lint = {path: currentPath + '.eslintrc.yml'};
}

process.chdir(projectPath);

for (let i in configuration.tasks.path) {
    gulpRequireTasks({
        path: currentPath + configuration.tasks.path[i],
        arguments: [configuration]
    });
}