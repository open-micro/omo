import sys
import time

for x in range(0, 2):
    print ("result %d" % x)
    time.sleep(1)
print ("foobar!", file=sys.stderr)
sys.exit(1)
