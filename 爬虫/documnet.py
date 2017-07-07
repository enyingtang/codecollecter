#!/usr/bin/python
import os  
def visitDir(path):  
	li = os.listdir(path)  
	for p in li:  
		pathname = os.path.join(path,p)  
		if not os.path.isfile(pathname):   
			visitDir(pathname)  
		else:  
			print pathname  
	  
if __name__ == "__main__":  
	path = r"/Users/joril/Documents/sp/UI"  
visitDir(path)  