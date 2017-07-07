#coding: utf-8
import urllib,os,requests,json,re,datetime
"""
下载花瓣网某子网址下num张图片
homeUrl = "http://huaban.com/explore/banmiansheji/"
num = 200
"""
class huabanCrawler():
    def __init__(self):
        self.imgs=[]       #每张图片的url
        self.homeUrl="http://huaban.com/favorite/beauty/"
        self.times=[]
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
        for i in result:
            info = {}
            info['id'] = str(i['pin_id'])
            info['url'] = "http://img.hb.aicdn.com/" + i["file"]["key"] + "_fw658"
            if 'image' == i["file"]["type"][:5]:
                info['type'] = i["file"]["type"][6:]
            else:
                info['type'] = 'NoName'
            self.imgs.append(info)
    def __make_ajax_url(self, No):
        """ 返回ajax请求的url """
        return self.homeUrl + "?i5p998kw&max=" + No + "&limit=20&wfl=1"

    def loadMore(self, maxPinID):          #chrome中xhr查看requests内容
        """ 刷新页面 """
        return requests.get(url = self.__make_ajax_url(maxPinID)).content

    def getImgUrl(self,num=20):      #每次加载20张
        self.process(self.load_homePage())
        for i in range((num-1)/20):
            self.process(self.loadMore(self.imgs[-1]["id"]))


    def down_images(self):
        """ 下载图片 """
        last_time=datetime.datetime.now()
        print "{} image will be download".format(len(self.imgs))
        for key, image in enumerate(self.imgs):
            if key !=0 and key%1000==0:
                cur_time=datetime.datetime.now()
                self.times.append((cur_time-last_time).total_seconds())
            print 'download {0} ...'.format(key)
            try:
                req = requests.get(image["url"])
            except :
                print 'error'
            imageName = os.path.join("./images", image["id"] + "." + image["type"])
            self.__save_image(imageName, req.content)

    def __save_image(self, imageName, content):
        """ 保存图片 """
        with open(imageName, 'wb') as fp:
            fp.write(content)



if __name__ == '__main__':
    hc=huabanCrawler()
    hc.getImgUrl(6000)
    hc.down_images()
    print hc.times