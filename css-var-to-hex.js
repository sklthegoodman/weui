let through = require('through2')
let gutil = require('gulp-util')
let PuginError = gutil.PluginError

// https://www.npmjs.com/package/css-tree

// 常量
const PLUGIN_NAME = 'gulp-prefixer';

function gulpProfixer(prefixText){
    if(!prefixText){
        throw new PuginError(PLUGIN_NAME, '没有要处理的文字')
    }

    prefixText = new Buffer(prefixText)

    //创建一个 stream 通道，让每个文件通过
    let stream = through.obj(function(file, enc, cb){
        //不支持stream
        console.log(file.toString())
        if(file.isStream()){
            this.emit('error', new PluginError(PLUGIN_NAME, '不支持stream'))
            return cb()
        }
        //处理Buffer
        if(file.isBuffer()){
            console.log(prefixText)
            file.contents = Buffer.concat([prefixText, file.contents]);
        }
        // 确保进入下一个gulp插件
        this.push(file)

        // 告诉stream引擎，我们已经处理完成了这个文件
        cb()
    })

    return stream
}

module.exports = gulpProfixer