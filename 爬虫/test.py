#!/usr/bin/python

import os
f = open('test.txt','w')
for i in range(14753,15001):
	url = 'http://120.52.73.85/adultvideo.science/media/videos/iphone/' + str(i) + '.mp4'
	f.write(url + '\n')
	