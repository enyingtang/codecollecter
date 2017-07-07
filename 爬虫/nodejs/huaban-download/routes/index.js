var io = require('socket.io').listen(3001)
var request = require('request')
var path = require('path')
var fs = require('fs')
var os = require('os')
var isWin = os.type().toLowerCase().indexOf('windows') > -1
var child_process = require('child_process')
var downLoadDir = "下载好的文件在这里"
var downLoadRoot = path.join(__dirname, '..', downLoadDir)

child_process.exec((isWin ? 'start' : 'open') + ' http://localhost:3000');

var chat = io
    .of('/huaban')
    .on('connection', function (socket) {
        socket.on('after-open-download-directory', function (data) {
            openDirector = data.boolean
        })

        socket.on('start download', function (data) {
            loadPageSource(data.url, socket)
        })

        socket.on('open-download-directory', function () {
            child_process.exec((isWin ? 'start' : 'open') + ' ' + downLoadDir, {
                cwd: path.dirname(downLoadRoot)
            });
        })

    })

var http = require('http')

function trim(str) {
    if (!str) return 'null'
    if (str.length > 200) str = str.substring(0, 200)
    return str.replace(/[\s\\\/'"|_?<>:*]/gi, '')
}

function loadPageSource(url, socket) {

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var id = body.match(/"pin_id"[\s\S]+?(\d+)/m)
                loadAllPin(url, id[1], undefined, socket)
            } catch (e) {
                console.log(e)
            }
        }
    })

}


//读取画集的所有JSON数据
function loadAllPin(baseurl, currentId, fileArr, socket) {

    if (!fileArr) fileArr = []

    function _loadAllPin(currentId) {
        socket.emit('load pins', {count: (fileArr.length + 1)})

        var url = baseurl + '?htcvzojp&max=' + currentId + '&limit=20&wfl=1'
        request({
            url: url,
            headers: {
                Accept: 'application/json',
                'X-Request': 'JSON',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, function (error, response, body) {
            if (error) console.log('抓取网页发生错误', error)
            try {
                var data = JSON.parse(body)
                data.user.pins.forEach(function (obj) {
                    var date = new Date(parseInt(obj.created_at, 10) * 1000)
                    fileArr.push({
                        board: trim(obj.board.title),
                        key: obj.file.key,
                        type: obj.file.type,
                        text: trim(obj.raw_text) + '-' + date.getFullYear() + '年' +
                            (date.getMonth() + 1) + '月' +
                            date.getDay() + '日' +
                            date.getHours() + '点' +
                            date.getMinutes() + '分'
                    })
                })
                if (data.user.pins.length >= 20) {
                    _loadAllPin(data.user.pins[data.user.pins.length - 1].pin_id)
                } else {
                    done(fileArr, socket)
                }
            } catch (e) {
                console.log('加载失败，开始重复加载' + currentId)
                console.log(e)
                done(fileArr, socket)
            }
        });

    }

    _loadAllPin(currentId)

}

//JSON抓取完毕，开始建立文件夹
function done(fileArr, socket) {
    createDir(fileArr, socket)
}


//根据分类创建好文件夹
function createDir(fileArr, socket) {

    var dirName = []
    fileArr.forEach(function (item) {
        if (dirName.indexOf(item.board) < 0) {
            dirName.push(item.board)
        }
    })

    function _mkdir() {
        var currentDir = dirName.shift()
        if (!currentDir) {
            socket.emit('download success', {
                msg: '文件夹创建完毕'
            })
            download(fileArr, socket)
            return
        }
        fs.mkdir(path.join(downLoadRoot, currentDir), function (err) {
            if (err) {
                socket.emit('download error', {
                    msg: currentDir + '创建失败'
                })
            } else {
                socket.emit('download success', {
                    msg: currentDir + '创建成功'
                })
            }
            _mkdir()
        })
    }

    _mkdir()

}


function download(fileArr, socket) {

    //储存总的图片数量
    var allCount = fileArr.length + 1
    console.log(fileArr)

    var downloadErrorCount = 0
    var downloadSuccessCount = 0


    function _download() {
        var current = fileArr.shift()
        if (!current) {
            socket.emit('process', {msg: '所有图片下载完毕', left: 0, sum: allCount})
            return
        }
        var type = current.type.substring(current.type.indexOf('/') + 1)
        var fileName = current.text + '.' + type
        var filePath = path.join(downLoadRoot, current.board, fileName)

        var url = 'http://img.hb.aicdn.com/' + current.key
        request({url: url, encoding: null}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                fs.writeFile(filePath, body, function (err) {
                    if (err) {
                        socket.emit('download error', {
                            msg: '错误：' + fileName + '下载失败'
                        })
                        downloadErrorCount++
                    } else {
                        socket.emit('download success', {
                            msg: '下载成功' + fileName
                        })
                        downloadSuccessCount++
                    }

                    socket.emit('process', {
                        msg: '还剩下' + (fileArr.length + 1) + '张图片',
                        left: fileArr.length,
                        successCount: downloadSuccessCount,
                        errorCount: downloadErrorCount,
                        sum: allCount
                    })
                    _download(fileArr)
                });
            } else {
                socket.emit('download error', {
                    msg: '下载失败：' + fileName
                })
                _download(fileArr)
            }
        })
    }

    _download()

}
