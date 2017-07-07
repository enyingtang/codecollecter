# -*- encoding:utf-8 -*-
import urllib,urllib2,re,sys,os,time
reload(sys)
sys.setdefaultencoding('utf-8')
if(os.path.exists('huaban') == False):
  os.mkdir('huaban')

def get_huaban_beauty():

        board_id = 画板号
	pin_id = 最新采集号
	limit = 20 
	while pin_id != None:
		url = 'http://huaban.com/boards/'+str(board_id)+'/?max='+str(pin_id)+'&limit='+str(limit)
		try:
			head = {"User-Agent": "Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0",\
			"Referer": 'http://baidu.com/'}
			req = urllib2.Request(url, headers=head)
			html = urllib2.urlopen(req).read()

			regex = re.compile('"pin_id":(.*?),.+?"file":{"farm":"farm1", "bucket":"hbimg",.+?"key":"(.*?)",.+?"type":"image/(.*?)"',re.S)
			groups = re.findall(regex,html)
			print str(pin_id)+ " Start to catch "+str(len(groups))+" photos"
			for att in groups:
				pin_id = att[0]
				att_url = att[1]
				img_type = att[2]
				img_url = 'http://img.hb.aicdn.com/' + att_url
				if(urllib.urlretrieve(img_url,'huaban/'+att_url+'.'+img_type)):
					print img_url +'.'+img_type + ' success!'
				else:
					print img_url +'.'+img_type + 'failed'
			
		except:
			print 'error occurs'

if __name__=="__main__":
	get_huaban_beauty()
