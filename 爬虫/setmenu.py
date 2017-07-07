# coding:utf-8
import sys

reload(sys)
sys.setdefaultencoding('utf8')
import os

def getFiles(filepath):
	files = []
	if os.path.isdir(filepath):
		for file in os.listdir(filepath):
			if os.path.isdir(file):
				getFiles(file)
			elif file.endswith('.jpg') or file.endswith('.png') or file.endswith('.gif'):
				files.append(filepath + str(file))
	elif os.path.isfile(filepath):
		files.append(filepath)
	return files

# 获取给定目录下所有以.jpg .png .gif结尾的文件，并补全路径保存到列表中输出
def recourse(filepath):
	files = []
	for fpathe, dirs, fs in os.walk(filepath):
		for f in fs:
			if f.endswith('.jpg') or f.endswith('.png') or f.endswith('.gif'):
				files.append(os.path.join(fpathe, f))
	return files

# 生成网页源码文件，指定
def generate(files, shuffle=False):
	template_start = '''
	<html>
	<head>
	<meta charset='utf-8'>
	<title>PhotoFlow</title>
	<link rel="stylesheet" type="text/css" href="menu.css">
	<script src="libs/jquery.min.js"></script>
	<script src="libs/jquery.imagesloaded.js"></script>
	<script src="jquery.wookmark.js"></script>
	<script src="min.js"></script>
	</head>
	<body>
	<div id="container" role="main">
	<ul id="tiles">
	'''
	
	template_body = ''
	# 如果指定乱序，就乱序列表中的数据
	if shuffle == True:
		from random import shuffle
		shuffle(files)
	for file in files:
		template_body += '<li><a href="' + file + '"><img class="pin-view" src="' + file + '"></a></li>'

	template_end = '''
	</ul>
	</div>
	</body>
	</html>
	'''
	
	html = template_start + template_body + template_end
	return html

# 生成html文件，并输出到指定的目录
def write2File(filepath, data):
	file = open(filepath, 'wb')
	file.write(data)
	file.close()
	print '生成成功!'


if __name__ == "__main__":
	#filepath = '/Users/joril/Documents/sp/UI'
	filepath = '/Users/joril/Desktop/menu/zhuanzhan'
	files = recourse(filepath=filepath)
	for item in files:
		print item
	html = generate(files, True)
	output_path = r'/Users/joril/Desktop/menu/index.html'
	write2File(filepath=output_path, data=html)
	print 'HTML相册文件已生成到' + output_path

