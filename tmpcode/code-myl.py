units = [{"input":[[2,7,11,15],9],"output":[0,1]},{"input":[[3,5,8,4,11],14],"output":[0,4]},{"input":[[3,4,8,1,5,8,9,10],9],"output":[2,3]}]
isMutiply = True
# version: Python3

'''
This function is the entry of this program, 
the args is the input params and
it must be return your answer of current question.
'''
def solution(args):
	return [0, 1]
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
        start = time.clock()
        user_output = solution(input)
        end = time.clock()
        return user_output, user_output == output
    except:
        print(input)
        raise

def check(units):
    for unit in units:
        cur_input = unit.get("input")
        cur_output = unit.get("output")
        user_output, isPass = test(cur_input, cur_output)
        if isPass == False:
            return [cur_input, cur_output, user_output, False]
    return True

def formatOutput(result):
    for item in result:
        print(item, end="!@#$%^&*()")

formatOutput(result = check(units))
print(str(end-start) + 's', str(psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024)+'MB', sep="!@#$%^&*()", end="")