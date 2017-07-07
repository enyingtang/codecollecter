#coding: utf-8
import urllib,urllib2,re,sys,os
reload(sys)

def get_pic():
    pin_id = None #花瓣每个图的pin-id
    limit = '20' #限制
    if(os.path.exists('huaban') == False):
        os.mkdir('huaban')
        if(os.path.exists('huaban/img') == False):
            os.mkdir('huaban/img')
    with open('huaban/缓存记录.html', 'w') as allimg: #以写模式打开log.html，没有就创建
        while True:
            if pin_id == None:
                print "<---------------------- 请输入花瓣画板ID: ---------------------->"
                board_id = raw_input() #输入画板ID
                url = 'http://huaban.com/boards/'+ board_id

            else:
                url = 'http://huaban.com/boards/'+ board_id +'/?max='+ pin_id +'&limit='+ limit

            try:
                head = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.114 Safari/537.36",\
                "Referer": 'http://baidu.com/'}
                req = urllib2.Request(url, headers=head)
                html = urllib2.urlopen(req).read() #读取抓取页面
                regex = re.compile('"pin_id":(.*?),.+?"file":{"farm":"farm1", "bucket":"hbimg",.+?"key":"(.*?)",.+?"type":"image/(.*?)"',re.S)
                print regex
                groups = re.findall(regex,html)
                #regex_all = 'app.page\["board"\] = (.*?});' #正则表达式模块
                print groups
                exec 'content = ' + groups[0]
                pins = content['pins']
                print pins
                if len(pins) == 0:
                    break
                allimg.write('<!doctype html><html><head><title>缓存记录</title><meta http-equiv="Content-Type" content="text/html;charset=utf-8" /><link href="style.css" rel="stylesheet" type="text/css" /><script src="main.js" type="text/javascript"></script></head><article><div class="pic"><ul>')
                for att in groups: #循环语句
                    att_url = att[1] + '_fw554' #序列第一位
                    pin_id = att[0]
                    img_type = att[2]
                    img_url = 'http://img.hb.aicdn.com/' + att_url
                    urllib.urlretrieve(img_url, 'huaban/img/' + pin_id + '.' + img_type)
                    print '---' + pin_id + '已下载'
                    allimg.write('<li><a href="' + img_url + '"><img src="' 'img/' + pin_id + '.' + img_type + '">' +'</a></li>' + os.linesep)

                allimg.write('</ul></div></article></html>')

            except:
                print '出错了'
                break
if __name__=="__main__":
    get_pic()