__author__ = 'zhaozhe'
#coding: utf-8
import urllib,os,requests,json,re,time,thread
"""
下载饭拍秀上的图片
homeUrl = "http://www.ubsshows.com/"
num = 200
"""
class huabanCrawler():
    def __init__(self,goalPage):
        self.imgs=[]       #每张图片的url
        self.homeUrl="http://www.ubsshows.com/page/"
        self.times=[]
        self.curPage=1
        self.goalPage=goalPage
        self.downK=0
        if not os.path.exists('./images'):
            os.mkdir('./images')

    def load_homePage(self):
        return requests.get(url = self.homeUrl+str(self.curPage)).content

    def process(self,html): #提取每张图片的url以及pinID等信息
        rex = re.compile('src="(http://[\w/\.]*.jpg)"')
        pics = rex.findall(html)
        self.imgs+=pics

    def loadMore(self):          #chrome中xhr查看requests内容
        print "加载第%d页" %self.curPage
        self.curPage+=1
        return requests.get(url = self.homeUrl+str(self.curPage)).content


    def getImgUrl(self):
        self.process(self.load_homePage())
        while self.curPage<self.goalPage:
            if len(self.imgs) - self.downK < 20:
                self.process(self.loadMore())
            else:
                time.sleep(1)


    def down_images(self):
        """ 下载图片 """
        last_time=time.clock()
        while self.curPage < self.goalPage:
            if self.downK < len(self.imgs):
                image=self.imgs[self.downK]
                if self.curPage !=0 and self.curPage%10==0:
                    cur_time=time.clock()
                    self.times.append((cur_time-last_time))
                print 'download {0} ...'.format(self.downK)
                try:
                    req = requests.get(image)
                except :
                    print 'error'
                imageName = os.path.join("./images", str(self.downK))+".jpg"
                self.__save_image(imageName, req.content)
                self.downK+=1
            else:
                time.sleep(1)

    def __save_image(self, imageName, content):
        """ 保存图片 """
        with open(imageName, 'wb') as fp:
            fp.write(content)



if __name__ == '__main__':
    hc=huabanCrawler(300)
    thread.start_new_thread(hc.down_images,())
    hc.getImgUrl()

    print hc.times
