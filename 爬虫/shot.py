#-*- coding:utf-8 -*-
import sys
import os.path
from PyQt4 import QtGui,QtCore,QtWebKit
 
class PageShotter(QtGui.QWidget):
    def __init__(self,url,parent=None):
        QtGui.QWidget.__init__(self,parent)
        self.url = url
         
    def shot(self):
        webView = QtWebKit.QWebView(self)
        webView.load(QtCore.QUrl(self.url))
        self.webPage = webView.page()
        self.connect(webView,QtCore.SIGNAL("loadFinished(bool)"),self.savePage)
         
    def savePage(self,finished):
        #print finished
        if finished:
            print u"开始截图！"
            size = self.webPage.mainFrame().contentsSize()
            print u"页面宽：%d，页面高：%d" % (size.width(),size.height())
            self.webPage.setViewportSize(QtCore.QSize(size.width()+16,size.height()))
            img = QtGui.QImage(size, QtGui.QImage.Format_ARGB32)
            painter = QtGui.QPainter(img)
            self.webPage.mainFrame().render(painter)
            painter.end()
            fileName= "shot.png";
            if img.save(fileName):
                filePath = os.path.join(os.path.dirname(__file__), fileName)
                print u"截图完毕：%s" % filePath
            else:
                print u"截图失败";
        else:
            print u"网页加载失败！"
        self.close()
         
if __name__=="__main__":
    app = QtGui.QApplication(sys.argv)
    #shotter = PageShotter("http://www.adssfwewfdsfdsf.com")
    shotter = PageShotter("http://www.oschina.net/")
    shotter.shot()
    sys.exit(app.exec_())