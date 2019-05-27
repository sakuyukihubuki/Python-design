input = [[2,7,11,15],9]
output = [0,1]
isMutiply = True
# version: Python3

'''
This function is the entry of this program, 
the args is the input params and
it must be return your answer of current question.
'''
def solution(args):
	return [5, 6, 7, 1, 2, 3, 4]
import os
import psutil
import time
start = 0
end = 0
def test(input, output):
    global start
    global end
    try:
        if not isMutiply:
            input = [ input ]
        start = time.perf_counter()
        user_output = solution(input)
        end = time.perf_counter()
        return [input, output, user_output, user_output == output]
    except:
        print(input)
        raise

def formatOutput(result):
    for item in result:
        print(item, end="!@#$%^&*()")

formatOutput(result = test(input, output))
print(str(end-start) + 's', str(psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024)+'MB', sep="!@#$%^&*()", end="")