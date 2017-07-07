#!/usr/bin/python
# -*- coding: UTF-8 -*-
  
import urllib2  
from urllib2 import URLError  
  
result_url=[]  
count=0  
not_200=0
work=0  
f=open("test.txt","r")  
img_not_200=open('nofuli.txt','w')
itwork=open('fuli.txt','w')  
  
for line in f:  
	count+=1  
	print "测试第" + str(count) + '行网址'
	try:  
		response=urllib2.urlopen(line)  
	except URLError, e:  
		if hasattr(e,'reason'): #stands for URLError  
			print "连接不成功,writing..."  
			result_url.append(line)  
			not_200+=1  
			img_not_200.write(line)  
			#print "网址写入成功"  
		elif hasattr(e,'code'): #stands for HTTPError  
			print "find http error, writing..."  
			result_url.append(line)  
			not_200+=1  
			img_not_200.write(line)  
			#print "网址写入成功"  
		else: #stands for unknown error  
			print "unknown error, writing..."  
			result_url.append(line)  
			not_200+=1  
			img_not_200.write(line)  
			#print "网址写入成功"  
	else:  
		#print "网址可访问"
		itwork.write(line)  
		#else 中不用再判断 response.code 是否等于200,若没有抛出异常，肯定返回200,直接关闭即可  
		response.close()  
	finally:  
		pass  
f.flush()
img_not_200.flush()
itwork.flush()  
print "扫描完成，总数：",count,"无法访问：",not_200  
f.close()  
img_not_200.close()
itwork.close()  