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

import modernizr from 'gulp-modernizr';
import minify from 'gulp-babel-minify';

module.exports = {
    dep: ['scripts:compile'],
    fn: function (gulp, configuration) {
        return gulp.src([
            configuration.styles.path.src.css + '/**/*.css',
            configuration.styles.path.src.sass + '/**/*.{scss, sass}',
            configuration.scripts.path.src + '/**/*.js'
        ])
            .pipe(modernizr())
            .pipe(minify(configuration.scripts.minify))
            .pipe(gulp.dest(configuration.scripts.path.dest));
    }
};
