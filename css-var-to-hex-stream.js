let through = require('through2')
let gutil = require('gulp-util')
let PluginError = gutil.PluginError

//常量
const NAME = 'css-var-to-hex-stream'

function prefixStream(prefixText){
    let stream = through()
    stream.write(prefixText)
    return stream
}

// 插件级别函数 （处理文件）
function gulpPrefixer(prefixText){
    if(!prefixText){
        throw new PluginError(NAME, '请提供文字')
    }

    prefixText = new Buffer(prefixText)

    // 创建一个让每一个文件通过的 stream 通道
    let stream = through.obj(function(file, enc, cb){
        if(file.isBuffer()){
            this.emit('error', new PluginError(NAME, 'Buffers not supported!'))
            return cb()
        }

        if(file.isStream()){
            // 定义转换内容的 streamer
            let streamer = prefixStream(prefixText)
            // 从streamer捕获错误，并发出一个gulp的错误
            streamer.on('error', this.emit.bind(this,'error'))
            // 开始转换
            files.contents = files.contents.pipe(streamer)
        }

        // 确保文件进入下一个文件
        this.push(file)

        //告诉gulp转换已经完成
        cb()
    })

    return stream
}

module.exports = gulpPrefixer