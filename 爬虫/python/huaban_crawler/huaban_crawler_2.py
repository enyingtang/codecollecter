#coding: utf-8
import urllib,os,requests,json,re,time,thread
from threading import Condition
"""
下载花瓣网某子网址下num张图片
homeUrl = "http://huaban.com/favorite/beauty/"
num = 200
版本2：两个线程
1）下拉加载线程
    load_homePage：收到html的requests后，产生urls，将最后一张图片的 ID 放入 maxPinIDs 中
    load_more：根据maxPinIDs中当前ID产生下拉请求，然后产生新的urls，以及新的maxPinID。
    maxPinIDs中始终有一个元素，直到组后没有新的加载请求
    imgs中保存了所有下载图片的url
2）主线程 下载图片
"""
class huabanCrawler():
    def __init__(self,num):
        self.imgs = []                   #每张图片的url
        self.maxPinIDs = []             #当前下拉加载需要的maxPinID
        self.homeUrl = "http://huaban.com/favorite/beauty/"
        self.k=0                         #下载第k张图片，被生产者和消费者使用
        self.n=num
        self.times = []
        if not os.path.exists('./images'):
            os.mkdir('./images')

    def load_homePage(self):
        return requests.get(url = self.homeUrl).content   #chrom中通过source和network查看request得到的内容

    def process(self,html): #提取每张图片的url以及pinID等信息
        rex = re.compile('app\.page\["pins"\].*')
        appPins = rex.findall(html)
        if appPins == []:
            return None
        result = json.loads(appPins[0][19:-1])             #解析从第19个字符开始的json字符串
        # print u'有了新的可下载图片URL'
        for i in result:
            info = {}
            info['id'] = str(i['pin_id'])
            info['url'] = "http://img.hb.aicdn.com/" + i["file"]["key"] + "_fw658"
            if 'image' == i["file"]["type"][:5]:
                info['type'] = i["file"]["type"][6:]
            else:
                info['type'] = 'NoName'
            self.imgs.append(info)
        self.maxPinIDs.append(self.imgs[-1]["id"])        #最后一个图片的pinID保存
        # print u'生产了新的pinID:%s' %self.maxPinIDs[0]

    def loadMore(self):          #chrome中xhr查看requests内容
        if not self.maxPinIDs:           #没有可以用来加载的新id
            print u"没有可以用来加载的新id"
        maxPinID = self.maxPinIDs[0]
        ajax_str=self.homeUrl + "?i5p998kw&max=" + maxPinID + "&limit=20&wfl=1"  # 返回ajax请求的url
        # print u'pinID:%s 已使用' %maxPinID
        self.maxPinIDs.pop()
        return requests.get(url = ajax_str).content

    def getImgUrl(self):                      #每次加载20张
        print u'正在加载中请稍后...'
        self.process(self.load_homePage())
        while len(self.imgs) < self.n:
            if ( len(self.imgs) - self.k ) <= 20:
                self.process(self.loadMore())   #当前最后一个id来加载得到下一组图片，并保存最新的maxPinId
            else:
                time.sleep(1)


    def down_images(self):
        last_time=time.clock()
        while self.k < self.n:
            if self.k < len(self.imgs):
                if self.k !=0 and self.k%1000==0:
                    cur_time=time.clock()
                    self.times.append((cur_time-last_time))
                print 'download (%d) ...' %self.k
                image=self.imgs[self.k]
                self.k+=1
                try:
                    req = requests.get(image["url"])
                except :
                    print 'error'
                imageName = os.path.join("./images", image["id"] + "." + image["type"])
                self.__save_image(imageName, req.content)
            else:
                time.sleep(1)

    def __save_image(self, imageName, content):
        with open(imageName, 'wb') as fp:
            fp.write(content)

if __name__ == '__main__':
    hc=huabanCrawler(6000)
    thread.start_new_thread(hc.down_images,())       #下载图片，作为消费者线程
    hc.getImgUrl()                               # 下拉加载线程
    print hc.times