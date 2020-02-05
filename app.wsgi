#!/usr/bin/python
import sys
baseDir = os.environ.get('LAV_DIR')
sys.path.append(baseDir+'/src/')
from backend import app as application
