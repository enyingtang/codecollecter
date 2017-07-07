#coding: utf-8
import urllib, urllib2, re, sys, os
import random
reload(sys)
 
def SearchAndDownLoadImg(SearchStr,NumPerPage,filepath):
     
    url = 'http://huaban.com/search/?q=%s&per_page=%s' % (SearchStr,str(NumPerPage))
     
    Respon = urllib2.urlopen(url)
     
    Htm = Respon.read()
     
    print url+"\n\n\n"
     
    print "----------------搜索结束，开始下载----------------"+"\n\n"
     
    Patt=re.compile('"file":\{"farm":"farm1",.+?"bucket":"hbimg",.+?"key":"(.*?)",.+?"type":"image/(.*?)",.+?"width":')
     
    group = re.findall(Patt,Htm)
     
    #print "find total imgurl"+len(group)+"\n"
     
    x = 1
     
    for item in group:
     
        imgurl=r"http://img.hb.aicdn.com/"+item[0]+"_fw658"
         
        urllib.urlretrieve(imgurl,'pic%s.%s' % (str(x),item[1]))
         
        print imgurl+"------>下载完成" +"\tpic"+ str(x)
         
        x = x+1
     
     
 
if __name__ == "__main__":
     
    print "搜索图片关键字:"
     
    SearchStr = raw_input()
     
    print "\n\n"
     
    print "下载图片张数:"
     
    NumPerPage = raw_input()
     
    print "\n\n"
     
    print "-----------------------开始搜索---------------------------"+"\n"
     
     
    filenum = random.randint(20, 50)
     
    filename = str(filenum)
     
    filepath = filename
     
    #if(os.path.exists(filepath) == False):
        #os.mkdir(filepath)
     
    #print filepath
     
    SearchAndDownLoadImg(SearchStr,NumPerPage,filepath)
     
    #http://img.hb.aicdn.com/23a58517fb73f86bca85937f069724486b3e00a44caa-GMc99I_sq75sf
     
    print"\n\n"
     
    print "---------------------完事了-----------------------"