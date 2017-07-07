#!/usr/bin/python
# Filename: huaban.py

import urllib2,re,sys,os
reload(sys)
sys.setdefaultencoding('utf-8')

def get_pic():
    pin_id = None
    limit = '20' 
    false = 'false'
    null = 'null'
    true = 'true'
    board_id = raw_input('Enter board id --> ')
    with open('log.txt', 'w') as f:
        while True:
            if pin_id == None:
                url = 'http://huaban.com/boards/'+ board_id
            else:
                url = 'http://huaban.com/boards/'+ board_id +'/?max='+ pin_id +'&limit='+ limit
            try:
                head = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.114 Safari/537.36",\
                "Referer": 'http://baidu.com/'}
                req = urllib2.Request(url, headers=head)
                html = urllib2.urlopen(req).read()

                regex = 'app.page\["board"\] = (.*?});'
                groups = re.findall(regex,html)
                exec 'content = ' + groups[0]
                pins = content['pins']
                print str(pin_id)+ " Start to catch "+str(len(pins))+" photos"
                if len(pins) == 0:
                    break
                for att in pins:
                    att_url = att['file']['key']
                    pin_id = str(att['pin_id'])
                    img_url = 'http://img.hb.aicdn.com/' + att_url
                    f.write(img_url + os.linesep)
            
            except:
                print 'error occurs'

if __name__=="__main__":
    get_pic()