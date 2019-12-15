let through = require('through2')
let gutil = require('gulp-util')
let PuginError = gutil.PluginErro
let csstree = require('css-tree')

// 常量
const PLUGIN_NAME = 'css-add-hex-color';

function createRule(property, value){
    if(!property || !value) return false

    let data = {
        "type": "Declaration",
        "loc": null,
        "important": false,
        property,
        "value": {
            "type": "Value",
            "loc": null,
            "children": [
                {
                "type": "HexColor",
                "loc": null,
                value
                }
            ]
        }
    }

    return {
        prev: null,
        next: null,
        data
    }
}

function gulpProfixer(){
    // if(!prefixText){
    //     throw new PuginError(PLUGIN_NAME, '没有要处理的文字')
    // }

    // prefixText = new Buffer(prefixText)

    //创建一个 stream 通道，让每个文件通过
    let stream = through.obj(function(file, enc, cb){
        //不支持stream
        // if(file.isStream()){
        //     this.emit('error', new PluginError(PLUGIN_NAME, '不支持stream'))
        //     return cb()
        // }
        // //处理Buffer
        // if(file.isBuffer()){
        //     file.contents = Buffer.concat([prefixText, file.contents]);
        // }
        // 确保进入下一个gulp插件
        let contents = file.contents.toString()
        // console.log(contents)
        let ast = csstree.parse(contents)

        csstree.walk(ast, (pnode, item, list) => {
            if(pnode.type == "Declaration"){
                console.log(121212)
                csstree.walk(pnode, (node) => {
                    // console.log(node.type)
                    // console.log(node.property)
                    // console.log(node.name)

                    if(node.type == 'Function' && node.name == 'var'){
                        list.insert(createRule(pnode.property, '343434'), item)
                        // let copy = csstree.clone(item)
                        console.log('sdasdasd')
                    }
                })
            }
        })
        
        let bu = Buffer.from(csstree.generate(ast))
        file.contents = bu
        

        this.push(file)

        // 告诉stream引擎，我们已经处理完成了这个文件
        cb()
    })

    return stream
}

module.exports = gulpProfixer