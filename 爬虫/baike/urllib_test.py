#!/usr/bin/env python
# -*- encoding:utf-8 -*-
# author :insun
#http://yxmhero1989.blog.163.com/blog/static/112157956201311994027168/
import urllib, urllib2, re, sys, os
reload(sys)


#url = 'http://huaban.com/favorite/'
if(os.path.exists('beauty') == False):
    os.mkdir('beauty')

def get_huaban_beauty():
    pin_id = 48145457
    limit = 20 #他默认允许的limit为100
    while pin_id != None:
        url = 'http://huaban.com/favorite/beauty/?max=' + str(pin_id) + '&limit=' + str(limit) + '&wfl=1'
        try:
            i_headers = {"User-Agent": "Mozilla/5.0(Windows; U; Windows NT 5.1; zh-CN; rv:1.9.1)\
            Gecko/20090624 Firefox/3.5", \
            "Referer": 'http://baidu.com/'}
            req = urllib2.Request(url, headers=i_headers)
            html = urllib2.urlopen(req).read()
            reg = re.compile('"pin_id":(.*?),.+?"file":{"farm":"farm1", "bucket":"hbimg",.+?"key":"(.*?)",.+?"type":"image/(.*?)"', re.S)
            groups = re.findall(reg, html)
            print str(pin_id) + "Start to catch " + str(len(groups)) + " photos"
            for att in groups:
                pin_id = att[0]
                att_url = att[1] + '_fw554'
                img_type = att[2]
                img_url = 'http://img.hb.aicdn.com/' + att_url
                if(urllib.urlretrieve(img_url, 'beauty/' + att_url + '.' + img_type)):
                    print img_url + '.' + img_type + ' download success!'
                else:
                    print img_url + '.' + img_type + ' save failed'
#print pin_id
        except:
            print 'error occurs'


get_huaban_beauty()