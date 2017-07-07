#coding: utf-8

import html_parser,url_manmager,html_downloader,html_outputer,urllib,urllib2,re,sys,os
reload(sys)

class SpiderMain (object):
    def __init__(self):
	    self.urls = url_manmager.UrlManager()
    	self.downloader = html_downloader.HtmlDownLoader()
    	self.parser = html_parser.HtmlParser()
	    self.outputer = html_outputer.HmtlOutputer()

if __name__=="__main__":
	obj_spider = SpiderMain()