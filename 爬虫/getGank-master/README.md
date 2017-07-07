# getGank.io
抓取<http://gank.io>网页

- 使用Jsoup抓取，但是使用的不多，后续需改进
- 程序代码有点混乱，没有处理和使用好Java的函数和类关系，有待学习和掌握
- 程序思路：
  1. 爬取了网站所有页面，存储在content.txt文件，同时存储各个页面title到map中
  2. 复制无内容网页框架rawGet.html内容到Get_gank.html并写入map中内容形成汇总列表
  3. 将content.txt内容写入到Get_gank.html
