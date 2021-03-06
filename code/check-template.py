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